
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Package, Plus, Edit, Trash2, Search } from "lucide-react";
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
  const [sellerId, setSellerId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

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
  const { data: products, isLoading, error } = useQuery({
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

  // Filtered products based on search
  const filteredProducts = products?.filter(product => 
    product.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        <div className="flex items-center">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        
        {/* Products table */}
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">Image</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock</TableHead>
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
                  <TableCell colSpan={8} className="text-center py-8 text-red-500">
                    Error loading products
                  </TableCell>
                </TableRow>
              ) : filteredProducts?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    {searchTerm ? (
                      <div>
                        <p>No products matching "{searchTerm}"</p>
                        <Button 
                          variant="link" 
                          onClick={() => setSearchTerm("")}
                          className="mt-2"
                        >
                          Clear search
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
                  <TableRow key={product.id}>
                    <TableCell>
                      <div className="h-10 w-10 rounded overflow-hidden bg-gray-100 flex items-center justify-center">
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
                    <TableCell>{product.category || "—"}</TableCell>
                    <TableCell>${product.price.toFixed(2)}</TableCell>
                    <TableCell>{product.stock_quantity}</TableCell>
                    <TableCell>
                      <span 
                        className={`px-2 py-1 text-xs rounded-full ${
                          product.status === "active" 
                            ? "bg-green-100 text-green-800" 
                            : product.status === "draft"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {product.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button variant="ghost" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
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
