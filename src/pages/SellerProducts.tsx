import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Package, Plus, Edit, Trash2, Search, ExternalLink, ArrowUpDown, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import SellerLayout from "@/components/seller/SellerLayout";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface Product {
  id: number;
  product_name: string;
  price: number;
  sku: string;
  stock_quantity: number;
  status: string;
  category: string;
  photo_url?: string;
  created_at: string;
}

const SellerProducts = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const highlightedProductId = searchParams.get('highlight');
  
  const [sellerId, setSellerId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string | undefined>(undefined); // Use undefined for initial/cleared state
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined); // Use undefined for initial/cleared state
  const [sortBy, setSortBy] = useState<string>("newest");

  // Fetch seller ID
  useEffect(() => {
    const fetchSellerInfo = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from('sellers')
          .select('id')
          .eq('user_id', user.id)
          .single();
        if (data) {
          setSellerId(data.id);
        }
      }
    };
    fetchSellerInfo();
  }, []);

  // Fetch products data
  const { data: products, isLoading, error, refetch } = useQuery({
    queryKey: ['seller-products', sellerId],
    queryFn: async () => {
      if (!sellerId) return [];
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('seller_id', sellerId);
      
      if (error) {
        console.error("Error fetching products:", error);
        throw new Error("Failed to fetch products");
      }
      
      return data as Product[];
    },
    enabled: !!sellerId
  });

  // Get unique categories for filter, ensuring no empty or whitespace-only strings
  const validCategories = products
    ?.map(product => product.category)
    .filter((category): category is string => typeof category === 'string' && category.trim() !== '');
  const categories = [...new Set(validCategories)];
  
  // Handle product deletion
  const handleDeleteProduct = async (productId: number) => {
    if (confirm("Are you sure you want to delete this product?")) {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId)
        .eq('seller_id', sellerId);
      
      if (error) {
        toast.error("Failed to delete product");
        console.error("Error deleting product:", error);
      } else {
        toast.success("Product deleted successfully");
        refetch();
      }
    }
  };

  // Handle product edit
  const handleEditProduct = (productId: number) => {
    navigate(`/seller/edit-product/${productId}`);
  };

  // Filter and sort products
  const filteredProducts = products?.filter(product => {
    const matchesSearch = 
      product.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.category && product.category.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = categoryFilter ? product.category === categoryFilter : true; // Check if categoryFilter is truthy (not undefined)
    const matchesStatus = statusFilter ? product.status === statusFilter : true; // Check if statusFilter is truthy (not undefined)
    
    return matchesSearch && matchesCategory && matchesStatus;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'name-asc':
        return a.product_name.localeCompare(b.product_name);
      case 'name-desc':
        return b.product_name.localeCompare(a.product_name);
      case 'price-asc':
        return a.price - b.price;
      case 'price-desc':
        return b.price - a.price;
      case 'stock-asc':
        return a.stock_quantity - b.stock_quantity;
      case 'stock-desc':
        return b.stock_quantity - a.stock_quantity;
      case 'newest':
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      case 'oldest':
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      default:
        return 0;
    }
  });

  // Scroll to highlighted product
  useEffect(() => {
    if (highlightedProductId && !isLoading && products) {
      const element = document.getElementById(`product-${highlightedProductId}`);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          element.classList.add('bg-yellow-50');
          setTimeout(() => {
            element.classList.remove('bg-yellow-50');
            element.classList.add('bg-white');
          }, 2000);
        }, 500);
      }
    }
  }, [highlightedProductId, isLoading, products]);
  
  return (
    <SellerLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">Products</h2>
            <p className="text-muted-foreground">
              Manage your product inventory
            </p>
          </div>
          
          <Button onClick={() => navigate("/seller/add-product")} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Product
          </Button>
        </div>
        
        {/* Search and filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          {/* Conditionally render category filter only when data is loaded and categories exist */}
          {!isLoading && categories.length > 0 && (
            <Select 
              value={categoryFilter} 
              onValueChange={(value) => setCategoryFilter(value === "all" ? undefined : value)} // Set undefined if "all" is selected
            >
              <SelectTrigger>
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem> {/* Use "all" value */}
                {categories.map((category, index) => (
                  <SelectItem key={`${category}-${index}`} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          
          {/* Conditionally render status filter */}
          {!isLoading && (
            <Select 
              value={statusFilter} 
              onValueChange={(value) => setStatusFilter(value === "all" ? undefined : value)} // Set undefined if "all" is selected
            >
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem> {/* Use "all" value */}
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
          )}
          
          {/* Conditionally render sort dropdown */}
          {!isLoading && (
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="name-asc">Name (A-Z)</SelectItem>
                <SelectItem value="name-desc">Name (Z-A)</SelectItem>
                <SelectItem value="price-asc">Price (Low to High)</SelectItem>
                <SelectItem value="price-desc">Price (High to Low)</SelectItem>
                <SelectItem value="stock-asc">Stock (Low to High)</SelectItem>
                <SelectItem value="stock-desc">Stock (High to Low)</SelectItem>
              </SelectContent>
            </Select>
          )}
        </div>
        
        {/* Products table */}
        <div className="border rounded-md overflow-hidden shadow-sm">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="w-[80px]">Image</TableHead>
                <TableHead>
                  <div className="flex items-center">
                    Product <ArrowUpDown className="ml-2 h-3 w-3 text-muted-foreground" />
                  </div>
                </TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>
                  <div className="flex items-center">
                    Stock <ArrowUpDown className="ml-2 h-3 w-3 text-muted-foreground" />
                  </div>
                </TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    Loading products...
                  </TableCell>
                </TableRow>
              ) : error ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    <div className="flex flex-col items-center text-red-500">
                      <AlertCircle className="h-6 w-6 mb-2" />
                      <p>Error loading products</p>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => refetch()}
                        className="mt-2"
                      >
                        Retry
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredProducts?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    {searchTerm || categoryFilter || statusFilter ? (
                      <div className="flex flex-col items-center">
                        <p>No products matching your filters</p>
                        <Button 
                          variant="link" 
                          onClick={() => {
                            setSearchTerm("");
                            setCategoryFilter(undefined); // Clear to undefined
                            setStatusFilter(undefined); // Clear to undefined
                          }}
                          className="mt-2"
                        >
                          Clear all filters
                        </Button>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-8">
                        <Package className="h-12 w-12 text-gray-300 mb-2" />
                        <p className="text-muted-foreground mb-4">No products found</p>
                        <Button onClick={() => navigate("/seller/add-product")}>
                          Add your first product
                        </Button>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ) : (
                filteredProducts?.map((product) => (
                  <TableRow 
                    key={product.id} 
                    id={`product-${product.id}`}
                    className={cn(
                      "transition-all",
                      Number(highlightedProductId) === product.id && "bg-yellow-50"
                    )}
                  >
                    <TableCell>
                      <div className="h-12 w-12 rounded overflow-hidden bg-gray-100 flex items-center justify-center">
                        {product.photo_url ? (
                          <img 
                            src={product.photo_url} 
                            alt={product.product_name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <Package className="h-5 w-5 text-gray-400" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{product.product_name}</TableCell>
                    <TableCell>{product.sku}</TableCell>
                    <TableCell>
                      {product.category ? (
                        <Badge variant="outline">{product.category}</Badge>
                      ) : "—"}
                    </TableCell>
                    <TableCell className="font-medium">${product.price.toFixed(2)}</TableCell>
                    <TableCell>
                      <span className={cn(
                        "font-medium",
                        product.stock_quantity <= 5 ? "text-red-500" : 
                        product.stock_quantity <= 20 ? "text-amber-500" : 
                        "text-green-600"
                      )}>
                        {product.stock_quantity}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        className={cn(
                          product.status === "active" ? "bg-green-100 text-green-800 hover:bg-green-200" : 
                          product.status === "draft" ? "bg-amber-100 text-amber-800 hover:bg-amber-200" :
                          "bg-gray-100 text-gray-800 hover:bg-gray-200"
                        )}
                        variant="secondary"
                      >
                        {product.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-1">
                        <Button variant="ghost" size="icon" title="View Product" onClick={() => window.open(`/product/${product.id}`, '_blank')}>
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" title="Edit Product" onClick={() => handleEditProduct(product.id)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" title="Delete Product" onClick={() => handleDeleteProduct(product.id)}>
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </SellerLayout>
  );
};

export default SellerProducts;
