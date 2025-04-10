
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from "uuid";
import Navbar from "@/components/Navbar";
import { 
  Package, Save, ArrowLeft, Image as ImageIcon, 
  DollarSign, Tag, Layers, Info, PlusCircle, Trash2
} from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import SellerLayout from "@/components/seller/SellerLayout";

// Form schema validation
const productSchema = z.object({
  product_name: z.string().min(3, "Product name must be at least 3 characters"),
  price: z.string().refine(val => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Price must be a positive number",
  }),
  sku: z.string().min(3, "SKU must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  category: z.string().min(1, "Please select a category"),
  stock_quantity: z.string().refine(val => !isNaN(Number(val)) && Number(val) >= 0, {
    message: "Stock must be a non-negative number",
  }),
  features: z.array(z.string()).optional(),
  available_colors: z.array(z.string()).optional(),
  status: z.enum(["active", "inactive", "draft"]).default("active"),
});

type ProductFormValues = z.infer<typeof productSchema>;

const SellerAddProduct = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [features, setFeatures] = useState<string[]>([""]);
  const [colors, setColors] = useState<string[]>([""]);
  
  // Initialize form
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      product_name: "",
      price: "",
      sku: `SKU-${Math.floor(Math.random() * 10000)}`,
      description: "",
      category: "",
      stock_quantity: "1",
      features: [],
      available_colors: [],
      status: "active",
    },
  });
  
  // Handle image selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target && typeof e.target.result === 'string') {
          setPhotoPreview(e.target.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Add feature field
  const addFeatureField = () => {
    setFeatures([...features, ""]);
  };
  
  // Update feature field
  const updateFeatureField = (index: number, value: string) => {
    const updatedFeatures = [...features];
    updatedFeatures[index] = value;
    setFeatures(updatedFeatures);
  };
  
  // Remove feature field
  const removeFeatureField = (index: number) => {
    if (features.length > 1) {
      const updatedFeatures = features.filter((_, i) => i !== index);
      setFeatures(updatedFeatures);
    }
  };
  
  // Add color field
  const addColorField = () => {
    setColors([...colors, ""]);
  };
  
  // Update color field
  const updateColorField = (index: number, value: string) => {
    const updatedColors = [...colors];
    updatedColors[index] = value;
    setColors(updatedColors);
  };
  
  // Remove color field
  const removeColorField = (index: number) => {
    if (colors.length > 1) {
      const updatedColors = colors.filter((_, i) => i !== index);
      setColors(updatedColors);
    }
  };
  
  // Form submission handler
  const onSubmit = async (data: ProductFormValues) => {
    setLoading(true);
    
    try {
      // Get current seller data
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error("You must be logged in to add a product");
        return;
      }
      
      const { data: sellerData } = await supabase
        .from("sellers")
        .select("id")
        .eq("user_id", session.user.id)
        .single();
      
      if (!sellerData) {
        toast.error("Seller account not found");
        return;
      }
      
      // Prepare product data
      const productData = {
        product_name: data.product_name,
        price: parseFloat(data.price),
        sku: data.sku,
        description: data.description,
        category: data.category,
        stock_quantity: parseInt(data.stock_quantity),
        features: features.filter(f => f.trim() !== ""),
        available_colors: colors.filter(c => c.trim() !== ""),
        status: data.status,
        seller_id: sellerData.id,
      };
      
      // Upload product image if provided
      let photoUrl = null;
      if (photoFile) {
        const fileExt = photoFile.name.split('.').pop();
        const fileName = `${uuidv4()}.${fileExt}`;
        const filePath = `products/${fileName}`;
        
        const { error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(filePath, photoFile);
          
        if (uploadError) {
          console.error("Error uploading image:", uploadError);
          toast.error("Failed to upload product image");
        } else {
          const { data: publicUrlData } = supabase.storage
            .from('product-images')
            .getPublicUrl(filePath);
          
          photoUrl = publicUrlData.publicUrl;
        }
      }
      
      // Insert product with photo URL if available
      const { data: product, error } = await supabase
        .from("products")
        .insert([
          {
            ...productData,
            photo_url: photoUrl,
          },
        ])
        .select();
      
      if (error) {
        console.error("Error adding product:", error);
        toast.error("Failed to add product");
      } else {
        toast.success("Product added successfully!");
        navigate("/seller/products");
      }
    } catch (error) {
      console.error("Error in product submission:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <SellerLayout>
      <div className="container mx-auto py-6 max-w-4xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={() => navigate("/seller/products")}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-2xl font-bold">Add New Product</h1>
          </div>
          
          <Button 
            onClick={form.handleSubmit(onSubmit)} 
            disabled={loading} 
            className="flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            {loading ? "Saving..." : "Save Product"}
          </Button>
        </div>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Product Images Section */}
              <Card className="md:col-span-1">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center justify-center space-y-4">
                    <div className="text-center">
                      <h3 className="font-medium flex items-center justify-center gap-2 mb-2">
                        <ImageIcon className="h-4 w-4" />
                        Product Image
                      </h3>
                      <div 
                        className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer flex flex-col items-center justify-center h-48"
                        onClick={() => document.getElementById('product-image')?.click()}
                      >
                        {photoPreview ? (
                          <img 
                            src={photoPreview} 
                            alt="Product preview" 
                            className="object-contain h-full"
                          />
                        ) : (
                          <div className="flex flex-col items-center justify-center text-gray-500">
                            <ImageIcon className="h-8 w-8 mb-2" />
                            <p className="text-sm">Click to upload product image</p>
                          </div>
                        )}
                      </div>
                      <input
                        id="product-image"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                      <p className="text-xs text-gray-500 mt-2">
                        Recommended: 1000x1000px, Max 2MB
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Main Product Info Section */}
              <Card className="md:col-span-2">
                <CardContent className="pt-6 space-y-4">
                  <h3 className="font-medium flex items-center gap-2">
                    <Info className="h-4 w-4" />
                    Basic Information
                  </h3>
                  
                  <FormField
                    control={form.control}
                    name="product_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Product Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter product name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-1">
                            <DollarSign className="h-3 w-3" />
                            Price
                          </FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="0.00" 
                              {...field} 
                              type="number"
                              step="0.01"
                              min="0"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="sku"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-1">
                            <Tag className="h-3 w-3" />
                            SKU
                          </FormLabel>
                          <FormControl>
                            <Input placeholder="SKU-12345" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category</FormLabel>
                          <FormControl>
                            <Input placeholder="Electronics, Clothing, etc." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="stock_quantity"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-1">
                            <Layers className="h-3 w-3" />
                            Stock Quantity
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="0"
                              {...field}
                              type="number"
                              min="0"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Product Description</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Describe your product..." 
                            className="min-h-[120px]" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
              
              {/* Features Section */}
              <Card className="md:col-span-3">
                <CardContent className="pt-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium flex items-center gap-2">
                      <Package className="h-4 w-4" />
                      Product Features
                    </h3>
                    <Button 
                      type="button"
                      variant="outline" 
                      size="sm"
                      onClick={addFeatureField}
                      className="flex items-center gap-1"
                    >
                      <PlusCircle className="h-3 w-3" />
                      Add Feature
                    </Button>
                  </div>
                  
                  <div className="space-y-2">
                    {features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Input
                          value={feature}
                          onChange={(e) => updateFeatureField(index, e.target.value)}
                          placeholder={`Feature ${index + 1}`}
                          className="flex-1"
                        />
                        <Button 
                          type="button"
                          variant="ghost" 
                          size="icon"
                          onClick={() => removeFeatureField(index)}
                          disabled={features.length === 1}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              {/* Colors Section */}
              <Card className="md:col-span-3">
                <CardContent className="pt-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">Available Colors</h3>
                    <Button 
                      type="button"
                      variant="outline" 
                      size="sm"
                      onClick={addColorField}
                      className="flex items-center gap-1"
                    >
                      <PlusCircle className="h-3 w-3" />
                      Add Color
                    </Button>
                  </div>
                  
                  <div className="space-y-2">
                    {colors.map((color, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Input
                          value={color}
                          onChange={(e) => updateColorField(index, e.target.value)}
                          placeholder={`Color ${index + 1} (e.g., Red, Blue, etc.)`}
                          className="flex-1"
                        />
                        <Button 
                          type="button"
                          variant="ghost" 
                          size="icon"
                          onClick={() => removeColorField(index)}
                          disabled={colors.length === 1}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              {/* Product Status */}
              <Card className="md:col-span-3">
                <CardContent className="pt-6">
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Product Status</FormLabel>
                        <div className="flex items-center space-x-4 mt-2">
                          <div className="flex items-center space-x-2">
                            <Checkbox 
                              id="active" 
                              checked={field.value === "active"}
                              onCheckedChange={() => field.onChange("active")} 
                            />
                            <label htmlFor="active" className="text-sm font-medium">
                              Active (Visible in store)
                            </label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox 
                              id="inactive" 
                              checked={field.value === "inactive"} 
                              onCheckedChange={() => field.onChange("inactive")}
                            />
                            <label htmlFor="inactive" className="text-sm font-medium">
                              Inactive (Hidden from store)
                            </label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox 
                              id="draft" 
                              checked={field.value === "draft"} 
                              onCheckedChange={() => field.onChange("draft")}
                            />
                            <label htmlFor="draft" className="text-sm font-medium">
                              Draft (Save for later)
                            </label>
                          </div>
                        </div>
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </div>
          </form>
        </Form>
      </div>
    </SellerLayout>
  );
};

export default SellerAddProduct;
