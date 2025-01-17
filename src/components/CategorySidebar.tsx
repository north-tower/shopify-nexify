import { 
  Smartphone, 
  Tv, 
  Home,
  ShoppingBag,
  Heart,
  Laptop,
  Shirt,
  Baby,
  Dumbbell
} from "lucide-react";

const categories = [
  { name: "Electronics", icon: Smartphone },
  { name: "TV & Audio", icon: Tv },
  { name: "Home & Office", icon: Home },
  { name: "Fashion", icon: Shirt },
  { name: "Health & Beauty", icon: Heart },
  { name: "Computing", icon: Laptop },
  { name: "Supermarket", icon: ShoppingBag },
  { name: "Baby Products", icon: Baby },
  { name: "Sporting Goods", icon: Dumbbell },
];

const CategorySidebar = () => {
  return (
    <div className="bg-white shadow-md rounded-lg p-4">
      <h2 className="font-semibold mb-4">Categories</h2>
      <ul className="space-y-2">
        {categories.map((category) => (
          <li key={category.name}>
            <a
              href="#"
              className="flex items-center space-x-3 px-4 py-2 text-gray-600 hover:bg-secondary rounded-md transition-colors"
            >
              <category.icon className="h-5 w-5" />
              <span>{category.name}</span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CategorySidebar;