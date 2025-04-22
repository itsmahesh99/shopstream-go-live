
import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";

const HeroCarousel = () => {
  const banners = [
    "/lovable-uploads/7c48c057-d4b0-4193-9473-be6c8eee605c.png",
    "/lovable-uploads/f8d1a83b-970d-4d3a-966a-e0e1deaddb20.png",
    "/lovable-uploads/521c827c-efca-4963-a702-e528830c.png",
  ];

  return (
    <div className="w-full px-0 mb-6">
      <Carousel>
        <CarouselContent className="-ml-0">
          {banners.map((banner, index) => (
            <CarouselItem key={index} className="pl-0">
              <div className="w-full aspect-[16/9]">
                <img 
                  src={banner} 
                  alt={`Hero banner ${index + 1}`} 
                  className="w-full h-full object-cover rounded-none"
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-2 z-10" />
        <CarouselNext className="right-2 z-10" />
      </Carousel>
    </div>
  );
};

export default HeroCarousel;
