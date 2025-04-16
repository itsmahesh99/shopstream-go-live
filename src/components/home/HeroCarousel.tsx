
import React from "react";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";

const HeroCarousel: React.FC = () => {
  return (
    <Carousel className="w-full mb-6">
      <CarouselContent>
        <CarouselItem>
          <div className="bg-kein-yellow rounded-xl p-6 h-40 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-1/2 h-full">
              <img
                src="/lovable-uploads/f8d1a83b-970d-4d3a-966a-e0e1deaddb20.png"
                alt="Kein Live"
                className="h-full object-cover object-center"
              />
            </div>
            <div className="w-1/2">
              <h2 className="text-2xl font-bold mb-2">Kein Live</h2>
              <p className="text-sm">
                Watch live streams of your favorite influencers and shop instantly with just one click!
              </p>
            </div>
          </div>
        </CarouselItem>
        <CarouselItem>
          <div className="bg-kein-lightblue rounded-xl p-6 h-40 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-1/2 h-full">
              <img
                src="/lovable-uploads/7c48c057-d4b0-4193-9473-be6c8eee605c.png"
                alt="Tech Sales"
                className="h-full object-cover object-center"
              />
            </div>
            <div className="w-1/2">
              <h2 className="text-2xl font-bold mb-2">Tech Sales</h2>
              <p className="text-sm">
                Exclusive discounts on the latest gadgets! Shop during live streams for extra perks.
              </p>
            </div>
          </div>
        </CarouselItem>
      </CarouselContent>
      <div className="flex justify-center mt-4">
        <div className="flex space-x-2">
          <div className="w-2 h-2 rounded-full bg-kein-blue"></div>
          <div className="w-2 h-2 rounded-full bg-gray-300"></div>
          <div className="w-2 h-2 rounded-full bg-gray-300"></div>
          <div className="w-2 h-2 rounded-full bg-gray-300"></div>
        </div>
      </div>
    </Carousel>
  );
};

export default HeroCarousel;
