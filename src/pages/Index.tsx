import Navbar from "@/components/Navbar";
import CategorySidebar from "@/components/CategorySidebar";
import FlashSales from "@/components/FlashSales";
import ProductCard from "@/components/ProductCard";

// Sample products data
const products = [
  {
    id: 1,
    title: "Hisense 94 Liters Single Door Refrigerator",
    price: 16499,
    originalPrice: 22999,
    image: "/placeholder.svg",
    discount: 28,
  },
  {
    id: 2,
    title: "Vision Plus 32\" Digital HD LED TV",
    price: 9599,
    originalPrice: 15999,
    image: "/placeholder.svg",
    discount: 40,
  },
  {
    id: 3,
    title: "Nunix 50 * 60cm Cooker",
    price: 22990,
    originalPrice: 25000,
    image: "/placeholder.svg",
    discount: 8,
  },
  {
    id: 4,
    title: "Infinix Smart 8 6.6\" HD+",
    price: 8999,
    originalPrice: 10000,
    image: "/placeholder.svg",
    discount: 10,
  },
  {
    id: 5,
    title: "Bluetooth Selfie Stick Tripod",
    price: 275,
    originalPrice: 550,
    image: "/placeholder.svg",
    discount: 50,
  },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-12 gap-6">
          {/* Sidebar */}
          <div className="col-span-3">
            <CategorySidebar />
          </div>
          
          {/* Main Content */}
          <div className="col-span-9">
            <FlashSales />
            
            {/* Products Grid */}
            <div className="mt-8">
              <h2 className="text-xl font-bold mb-6">Featured Products</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} {...product} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;