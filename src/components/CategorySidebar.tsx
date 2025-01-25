import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
  const { category: currentCategory, subcategory: currentSubcategory } = useParams();
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

  const handleCategoryClick = (categoryPath: string, categoryName: string) => {
    navigate(categoryPath);
  };

  const handleSubcategoryClick = (categoryPath: string, subcategory: string) => {
    navigate(`${categoryPath}/${subcategory.toLowerCase()}`);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4 bg-gradient-to-r from-primary to-primary/80 text-white">
        <h2 className="text-xl font-bold">Shop By Category</h2>
      </div>
      
      <div className="relative">
        {categories.map((category) => {
          const isActive = currentCategory === category.name.toLowerCase().replace(/ & /g, '-');
          
          return (
            <div
              key={category.name}
              onMouseEnter={() => setHoveredCategory(category.name)}
              onMouseLeave={() => setHoveredCategory(null)}
              className="relative"
            >
              <button
                onClick={() => handleCategoryClick(category.path, category.name)}
                className={`w-full flex items-center justify-between p-4 hover:bg-gray-50 border-l-4 transition-all duration-200
                  ${isActive ? 'border-primary bg-gray-50' : 'border-transparent'}
                  group
                `}
              >
                <div className="flex items-center space-x-4">
                  <div className={`p-2 rounded-lg transition-colors duration-200
                    ${hoveredCategory === category.name || isActive ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600'}
                  `}>
                    <category.icon className="h-5 w-5" />
                  </div>
                  <span className={`font-medium transition-colors duration-200
                    ${isActive ? 'text-primary' : 'text-gray-600'}
                    ${hoveredCategory === category.name ? 'text-primary' : ''}
                  `}>
                    {category.name}
                  </span>
                </div>
                <ChevronRight className={`h-5 w-5 transition-transform duration-200
                  ${isActive ? 'rotate-90 text-primary' : 'text-gray-400'}
                  ${hoveredCategory === category.name ? 'text-primary' : ''}
                `} />
              </button>
              
              <div className={`overflow-hidden transition-all duration-300
                ${isActive ? 'max-h-48' : 'max-h-0'}
              `}>
                {category.subcategories.map((subcategory) => {
                  const isSubcategoryActive = currentSubcategory === subcategory.toLowerCase();
                  
                  return (
                    <button
                      key={subcategory}
                      onClick={() => handleSubcategoryClick(category.path, subcategory)}
                      className={`w-full text-left pl-16 pr-4 py-2.5 transition-colors
                        ${isSubcategoryActive ? 'text-primary bg-gray-50 font-medium' : 'text-gray-600'}
                        hover:text-primary hover:bg-gray-50
                      `}
                    >
                      {subcategory}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CategorySidebar;