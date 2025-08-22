import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import type { CarouselApi } from "@/components/ui/carousel";

interface Promotion {
  id: string;
  title: string;
  description: string;
  color: string;
  image: string;
  buttonText: string;
  buttonLink: string;
  isReels?: boolean;
}

interface PromotionsCarouselProps {
  promotions: Promotion[];
  onReelsClick?: () => void;
  className?: string;
}

const PromotionsCarousel: React.FC<PromotionsCarouselProps> = ({ 
  promotions, 
  onReelsClick,
  className = ""
}) => {
  const navigate = useNavigate();
  const [activeSlide, setActiveSlide] = useState(0);
  const [carouselApi, setCarouselApi] = useState<CarouselApi | null>(null);

  const handleButtonClick = (link: string, isReels?: boolean) => (event: React.MouseEvent) => {
    event.preventDefault();
    if (isReels && onReelsClick) {
      onReelsClick();
    } else if (link.startsWith('/')) {
      navigate(link);
    }
  };

  // Update active slide when carousel changes
  React.useEffect(() => {
    if (!carouselApi) return;
    
    const onSelect = () => {
      setActiveSlide(carouselApi.selectedScrollSnap());
    };
    
    carouselApi.on("select", onSelect);
    return () => {
      carouselApi.off("select", onSelect);
    };
  }, [carouselApi]);

  return (
    <div className={`mb-6 ${className}`}>
      <Carousel 
        className="w-full" 
        opts={{ loop: true }}
        setApi={setCarouselApi}
      >
        <CarouselContent>
          {promotions.map(promo => (
            <CarouselItem key={promo.id} className="pl-1 md:basis-1/2 lg:basis-1/3">
              <div className={`rounded-lg p-6 ${promo.color} text-white h-44 relative overflow-hidden`}>
                <div className="relative z-10 max-w-[70%]">
                  <h3 className="text-xl font-bold">{promo.title}</h3>
                  <p className="mt-1 text-white/90 mb-3 text-xs">{promo.description}</p>
                  <Button 
                    variant="secondary" 
                    className={`mt-2 font-bold text-lg flex items-center space-x-2 ${
                      promo.isReels 
                        ? "bg-white text-purple-600 hover:bg-gray-100" 
                        : "bg-white text-blue-600 hover:bg-gray-100"
                    }`}
                    onClick={handleButtonClick(promo.buttonLink, promo.isReels)}
                  >
                    {promo.isReels && <Play className="h-4 w-4" />}
                    <span>{promo.buttonText}</span>
                  </Button>
                </div>
                <img 
                  src={promo.image} 
                  alt={promo.title} 
                  className="absolute right-0 bottom-0 h-full opacity-90 object-cover object-right" 
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-1 hidden md:flex" />
        <CarouselNext className="right-1 hidden md:flex" />
        <div className="flex justify-center gap-1 mt-3">
          {promotions.map((_, index) => (
            <div 
              key={index} 
              className={`h-1.5 w-5 rounded-full transition-colors duration-300 ${
                index === activeSlide ? "bg-kein-blue" : "bg-gray-300"
              }`} 
            />
          ))}
        </div>
      </Carousel>
    </div>
  );
};

export default PromotionsCarousel;
