import React from "react";
import { Star, MapPin, Clock } from "lucide-react";

interface ProviderProps {
  id: string;
  name: string;
  image: string;
  rating: number;
  reviews: number;
  distance: string;
  deliveryTime: string;
  price: string;
  services: string[];
  onClick: () => void;
}

export const ProviderCard: React.FC<ProviderProps> = ({
  name,
  image,
  rating,
  reviews,
  distance,
  deliveryTime,
  price,
  services = [],
  onClick,
}) => {
  return (
    <div 
      onClick={onClick}
      className="bg-white rounded-2xl p-3 shadow-sm border border-gray-100 active:scale-[0.98] transition-transform cursor-pointer"
    >
      <div className="flex gap-4">
        <div className="relative w-24 h-24 flex-shrink-0">
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover rounded-xl"
          />
          <div className="absolute top-1 right-1 bg-white/90 backdrop-blur-sm px-1.5 py-0.5 rounded-md flex items-center gap-0.5 shadow-sm">
            <Star size={10} className="text-yellow-500 fill-yellow-500" />
            <span className="text-[10px] font-bold text-gray-800">{rating}</span>
            <span className="text-[8px] text-gray-500">({reviews})</span>
          </div>
        </div>
        
        <div className="flex-1 flex flex-col justify-between py-0.5">
          <div>
            <h3 className="font-bold text-gray-900 leading-tight mb-1">{name}</h3>
            <div className="flex items-center text-gray-500 text-xs mb-2">
              <MapPin size={12} className="mr-1" />
              <span>{distance}</span>
              <span className="mx-1.5">•</span>
              <Clock size={12} className="mr-1" />
              <span>{deliveryTime}</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {services.slice(0, 2).map((service, i) => (
                <span key={i} className="px-1.5 py-0.5 bg-gray-100 text-gray-600 text-[10px] font-medium rounded-md">
                  {service}
                </span>
              ))}
            </div>
          </div>
          
          <div className="flex items-end justify-between mt-2">
            <div className="text-blue-600 font-bold text-sm">
              {price}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
