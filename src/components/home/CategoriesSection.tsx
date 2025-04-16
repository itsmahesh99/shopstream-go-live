
import React from "react";
import { Link } from "react-router-dom";

interface Category {
  id: string;
  name: string;
  count: number;
  image: string;
}

interface CategoriesSectionProps {
  categories: Category[];
}

const CategoriesSection: React.FC<CategoriesSectionProps> = ({ categories }) => {
  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold mb-4">Categories</h2>
      <div className="grid grid-cols-4 gap-4">
        {categories.slice(0, 8).map((category) => (
          <Link
            to={`/search?category=${category.name}`}
            key={category.id}
            className="flex flex-col items-center"
          >
            <div className="w-full aspect-square rounded-md overflow-hidden mb-2">
              <img
                src={category.image}
                alt={category.name}
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-sm font-medium">{category.name}</span>
            <span className="text-xs text-gray-500">{category.count}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CategoriesSection;
