import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Smartphone, 
  Tv, 
  Home,
  ShoppingBag,
  Heart,
  Laptop,
  Shirt,
  Baby,
  Dumbbell,
  ChevronRight
} from "lucide-react";

const categories = [
  { 
    name: "Electronics",
    icon: Smartphone,
    subcategories: ["Phones", "Tablets", "Accessories"],
    color: "bg-primary",
    path: "/category/electronics"
  },
  { 
    name: "TV & Audio",
    icon: Tv,
    subcategories: ["Smart TVs", "Speakers", "Home Theater"],
    color: "bg-primary",
    path: "/category/tv-audio"
  },
  { 
    name: "Home & Office",
    icon: Home,
    subcategories: ["Furniture", "Decor", "Office Supplies"],
    color: "bg-primary",
    path: "/category/home-office"
  },
  { 
    name: "Fashion",
    icon: Shirt,
    subcategories: ["Men", "Women", "Kids"],
    color: "bg-primary",
    path: "/category/fashion"
  },
  { 
    name: "Health & Beauty",
    icon: Heart,
    subcategories: ["Skincare", "Makeup", "Personal Care"],
    color: "bg-primary",
    path: "/category/health-beauty"
  },
  { 
    name: "Computing",
    icon: Laptop,
    subcategories: ["Laptops", "Desktops", "Components"],
    color: "bg-primary",
    path: "/category/computing"
  },
  { 
    name: "Supermarket",
    icon: ShoppingBag,
    subcategories: ["Groceries", "Household", "Beverages"],
    color: "bg-primary",
    path: "/category/supermarket"
  },
  { 
    name: "Baby Products",
    icon: Baby,
    subcategories: ["Diapers", "Feeding", "Toys"],
    color: "bg-primary",
    path: "/category/baby"
  },
  { 
    name: "Sporting Goods",
    icon: Dumbbell,
    subcategories: ["Fitness", "Outdoor", "Team Sports"],
    color: "bg-primary",
    path: "/category/sports"
  }
];

const CategorySidebar = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

  const handleCategoryClick = (categoryPath: string, categoryName: string) => {
    setActiveCategory(activeCategory === categoryName ? null : categoryName);
    navigate(categoryPath);
  };

  const handleSubcategoryClick = (categoryPath: string, subcategory: string) => {
    navigate(`${categoryPath}/${subcategory.toLowerCase()}`);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4 bg-gradient-to-r from-primary to-secondary text-white">
        <h2 className="text-xl font-bold">Shop By Category</h2>
      </div>
      
      <div className="relative">
        {categories.map((category, index) => (
          <div
            key={category.name}
            onMouseEnter={() => setHoveredCategory(category.name)}
            onMouseLeave={() => setHoveredCategory(null)}
          >
            <button
              onClick={() => handleCategoryClick(category.path, category.name)}
              className={`w-full flex items-center justify-between p-4 hover:bg-gray-50 border-l-4 transition-all duration-200 relative group
                ${activeCategory === category.name ? `${category.color} border-l-4 bg-gray-50` : 'border-transparent'}
                ${index !== categories.length - 1 ? 'border-b border-gray-100' : ''}
              `}
            >
              <div className="flex items-center space-x-4">
                <div className={`p-2 rounded-lg transition-colors duration-200
                  ${hoveredCategory === category.name ? category.color : 'bg-gray-100'}
                  ${hoveredCategory === category.name ? 'text-white' : 'text-gray-600'}
                `}>
                  <category.icon className="h-5 w-5" />
                </div>
                <span className={`font-medium transition-colors duration-200
                  ${activeCategory === category.name ? 'text-primary' : 'text-gray-600'}
                  ${hoveredCategory === category.name ? 'text-primary' : ''}
                `}>
                  {category.name}
                </span>
              </div>
              <ChevronRight className={`h-5 w-5 transition-transform duration-200
                ${activeCategory === category.name ? 'rotate-90 text-primary' : 'text-gray-400'}
                ${hoveredCategory === category.name ? 'text-primary' : 'text-gray-400'}
              `} />
            </button>
            
            {/* Subcategories */}
            <div className={`overflow-hidden transition-all duration-200 bg-gray-50
              ${activeCategory === category.name ? 'max-h-48' : 'max-h-0'}
            `}>
              {category.subcategories.map((subcategory) => (
                <button
                  key={subcategory}
                  onClick={() => handleSubcategoryClick(category.path, subcategory)}
                  className="w-full text-left pl-16 pr-4 py-2 text-gray-600 hover:text-primary hover:bg-gray-100 transition-colors"
                >
                  {subcategory}
                </button>
              ))}
            </div>
          </div>
        ))}

        {/* Hover card preview */}
        <div
          className={`absolute left-full top-0 ml-2 w-48 bg-white rounded-lg shadow-lg transition-opacity duration-200 pointer-events-none
            ${hoveredCategory ? 'opacity-100' : 'opacity-0'}
          `}
          style={{ 
            display: hoveredCategory ? 'block' : 'none',
            zIndex: 50 
          }}
        >
          <div className="p-4">
            <h3 className="font-bold text-primary mb-2">Featured in {hoveredCategory}</h3>
            <div className="w-full h-32 bg-gray-100 rounded-lg mb-2">
              <img 
                src="/placeholder.svg"
                alt="Category preview"
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
            <p className="text-sm text-gray-600">Explore our selection of top products</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategorySidebar;