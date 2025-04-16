
import React from "react";
import { Link } from "react-router-dom";
import { ChevronRight, Play, Eye } from "lucide-react";
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious 
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import LiveBadge from "@/components/common/LiveBadge";

interface LiveStream {
  id: string;
  title: string;
  influencer: string;
  influencerImage: string;
  thumbnail: string;
  viewCount: number;
  isLive: boolean;
}

interface LiveNowCarouselProps {
  streams: LiveStream[];
}

const LiveNowCarousel: React.FC<LiveNowCarouselProps> = ({ streams }) => {
  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Live Now</h2>
        <Link to="/live" className="text-sm text-kein-blue flex items-center">
          See all <ChevronRight className="h-4 w-4 ml-1" />
        </Link>
      </div>
      
      <div className="relative -mx-4">
        <Carousel
          className="w-full px-4"
          opts={{
            align: "start",
            loop: false,
          }}
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {streams.map((stream) => (
              <CarouselItem key={stream.id} className="pl-2 md:pl-4 sm:basis-1/2 md:basis-1/3 lg:basis-1/3">
                <Link to={`/live/${stream.id}`} className="block">
                  <div className="relative rounded-lg overflow-hidden aspect-[3/4] shadow-md group">
                    {/* Thumbnail with gradient overlay */}
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-all duration-300"></div>
                    <img 
                      src={stream.thumbnail} 
                      alt={stream.title} 
                      className="w-full h-full object-cover"
                    />
                    
                    {/* Play icon overlay */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="h-14 w-14 bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center">
                        <Play className="h-8 w-8 text-white fill-white" />
                      </div>
                    </div>
                    
                    {/* Live badge */}
                    <div className="absolute top-2 left-2">
                      <LiveBadge size="sm" />
                    </div>
                    
                    {/* Influencer avatar + info */}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-3">
                      <div className="flex items-center mb-2">
                        <img 
                          src={stream.influencerImage} 
                          alt={stream.influencer} 
                          className="w-8 h-8 rounded-full object-cover border border-white/30"
                        />
                        <div className="ml-2">
                          <p className="text-white font-medium text-sm">{stream.influencer}</p>
                          <div className="flex items-center text-white/80 text-xs">
                            <Eye className="h-3 w-3 mr-1" />
                            {stream.viewCount.toLocaleString()}
                          </div>
                        </div>
                      </div>
                      <h3 className="text-white font-medium text-sm line-clamp-2 mb-2">
                        {stream.title}
                      </h3>
                      <Button size="sm" className="w-full bg-kein-coral hover:bg-kein-coral/90 text-white text-xs">
                        Watch Now
                      </Button>
                    </div>
                  </div>
                </Link>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="hidden md:block">
            <CarouselPrevious className="left-1" />
            <CarouselNext className="right-1" />
          </div>
        </Carousel>
      </div>
    </div>
  );
};

export default LiveNowCarousel;
