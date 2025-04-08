
import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import ProductOptionsSheet from "./ProductOptionsSheet";
import CountdownTimer from "./CountdownTimer";

// Example data - this would usually come from your API or props
const productExample = {
  id: "1",
  title: "Women solid top and jeans",
  price: 999,
  discountPrice: 499,
  images: [
    "/lovable-uploads/37fa901f-5b94-426f-ac68-07a4249941e7.png",
    "/lovable-uploads/f8d1a83b-970d-4d3a-966a-e0e1deaddb20.png",
    "/lovable-uploads/a758d528-4f86-47ab-8952-b84d3f2e2b2c.png",
    "/lovable-uploads/0652f2bb-af03-464d-856b-32325f54b8c6.png",
  ],
  colors: ["Pink", "Yellow", "Red", "Purple"],
  sizes: ["S", "M", "L", "XL", "XXL", "XXXL"],
};

// Future date for countdown example - 2 days from now
const futureDate = new Date();
futureDate.setDate(futureDate.getDate() + 2);

const ExampleUsage = () => {
  const handleAddToCart = (options: { color: string; size: string; quantity: number }) => {
    console.log("Added to cart:", options);
    // Implement your add to cart logic here
  };

  const handleBuyNow = (options: { color: string; size: string; quantity: number }) => {
    console.log("Buy now:", options);
    // Implement your buy now logic here
  };

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-xl font-bold mb-4">Product Options Example</h1>
      
      <div>
        <ProductOptionsSheet
          product={productExample}
          triggerButton={
            <Button>Select Options</Button>
          }
          onAddToCart={handleAddToCart}
          onBuyNow={handleBuyNow}
        />
      </div>

      <div className="border rounded-lg p-4">
        <h2 className="text-lg font-semibold mb-2">Limited Time Deal Example</h2>
        <div className="mb-3">
          <CountdownTimer endTime={futureDate} />
        </div>
        <Link to="/limited-deal/flash-deal-1">
          <Button className="w-full bg-kein-coral">
            View Limited Time Deal
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default ExampleUsage;
