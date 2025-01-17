import React, { useState } from 'react';
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
    color: "bg-blue-500"
  },
  { 
    name: "TV & Audio",
    icon: Tv,
    subcategories: ["Smart TVs", "Speakers", "Home Theater"],
    color: "bg-purple-500"
  },
  { 
    name: "Home & Office",
    icon: Home,
    subcategories: ["Furniture", "Decor", "Office Supplies"],
    color: "bg-green-500"
  },
  { 
    name: "Fashion",
    icon: Shirt,
    subcategories: ["Men", "Women", "Kids"],
    color: "bg-pink-500"
  },
  { 
    name: "Health & Beauty",
    icon: Heart,
    subcategories: ["Skincare", "Makeup", "Personal Care"],
    color: "bg-red-500"
  },
  { 
    name: "Computing",
    icon: Laptop,
    subcategories: ["Laptops", "Desktops", "Components"],
    color: "bg-indigo-500"
  },
  { 
    name: "Supermarket",
    icon: ShoppingBag,
    subcategories: ["Groceries", "Household", "Beverages"],
    color: "bg-yellow-500"
  },
  { 
    name: "Baby Products",
    icon: Baby,
    subcategories: ["Diapers", "Feeding", "Toys"],
    color: "bg-orange-500"
  },
  { 
    name: "Sporting Goods",
    icon: Dumbbell,
    subcategories: ["Fitness", "Outdoor", "Team Sports"],
    color: "bg-teal-500"
  }
];

const CategorySidebar = () => {
  const [activeCategory, setActiveCategory] = useState(null);
  const [hoveredCategory, setHoveredCategory] = useState(null);

  return (
    <div className="bg-white rounded-lg overflow-hidden">
      <div className="p-4 bg-gradient-to-r from-gray-800 to-gray-900 text-white">
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
              onClick={() => setActiveCategory(activeCategory === category.name ? null : category.name)}
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
                  ${activeCategory === category.name ? 'text-gray-900' : 'text-gray-600'}
                  ${hoveredCategory === category.name ? 'text-gray-900' : ''}
                `}>
                  {category.name}
                </span>
              </div>
              <ChevronRight className={`h-5 w-5 transition-transform duration-200
                ${activeCategory === category.name ? 'rotate-90' : 'text-gray-400'}
                ${hoveredCategory === category.name ? 'text-gray-900' : 'text-gray-400'}
              `} />
            </button>
            
            {/* Subcategories */}
            <div className={`overflow-hidden transition-all duration-200 bg-gray-50
              ${activeCategory === category.name ? 'max-h-48' : 'max-h-0'}
            `}>
              {category.subcategories.map((subcategory) => (
                <button
                  key={subcategory}
                  className="w-full text-left pl-16 pr-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                >
                  {subcategory}
                </button>
              ))}
            </div>
          </div>
        ))}

        {/* Hover card preview - could be used to show featured items */}
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
            <h3 className="font-bold text-gray-900 mb-2">Featured in {hoveredCategory}</h3>
            <div className="w-full h-32 bg-gray-100 rounded-lg mb-2">
              <img 
                src="/api/placeholder/200/150"
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