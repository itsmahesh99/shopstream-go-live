
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/contexts/CartContext";
import { useNavigate } from "react-router-dom";

export interface ProductOptionsHookProps {
  product: {
    id: string;
    title: string;
    images: string[];
    price: number;
    discountPrice?: number;
    colors: string[];
    sizes: string[];
  };
  onAddToCart?: (options: ProductOptions) => void;
  onBuyNow?: (options: ProductOptions) => void;
}

export interface ProductOptions {
  color: string;
  size: string;
  quantity: number;
}

export const useProductOptions = ({ product, onAddToCart, onBuyNow }: ProductOptionsHookProps) => {
  const { toast } = useToast();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [selectedColor, setSelectedColor] = useState(product.colors[0] || "");
  const [selectedSize, setSelectedSize] = useState("M");
  const [quantity, setQuantity] = useState(1);
  
  const handleAddToCart = () => {
    const cartItem = {
      id: product.id,
      title: product.title,
      price: product.price,
      discountPrice: product.discountPrice,
      image: getColorImage(selectedColor),
      color: selectedColor,
      size: selectedSize,
      quantity: quantity
    };
    
    if (onAddToCart) {
      onAddToCart({ color: selectedColor, size: selectedSize, quantity });
    } else {
      addToCart(cartItem);
      toast({
        title: "Added to cart",
        description: `${product.title} (${selectedColor}, ${selectedSize}) has been added to your cart`,
      });
    }
  };
  
  const handleBuyNow = () => {
    const cartItem = {
      id: product.id,
      title: product.title,
      price: product.price,
      discountPrice: product.discountPrice,
      image: getColorImage(selectedColor),
      color: selectedColor,
      size: selectedSize,
      quantity: quantity
    };
    
    if (onBuyNow) {
      onBuyNow({ color: selectedColor, size: selectedSize, quantity });
    } else {
      addToCart(cartItem);
      toast({
        title: "Proceeding to checkout",
        description: "Taking you to the checkout page",
      });
      navigate("/cart");
    }
  };
  
  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };
  
  const increaseQuantity = () => {
    setQuantity(quantity + 1);
  };

  const getColorImage = (color: string) => {
    const colorIndex = product.colors.indexOf(color);
    return product.images[colorIndex % product.images.length];
  };

  return {
    selectedColor,
    setSelectedColor,
    selectedSize,
    setSelectedSize,
    quantity,
    decreaseQuantity,
    increaseQuantity,
    handleAddToCart,
    handleBuyNow,
    getColorImage
  };
};
