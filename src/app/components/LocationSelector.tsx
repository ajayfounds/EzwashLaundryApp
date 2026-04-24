import React from "react";
import { MapPin, Navigation, Plus, Search } from "lucide-react";
import { motion } from "motion/react";

interface LocationSelectorProps {
  currentLocation: string;
  onSelect: (location: string) => void;
  onClose: () => void;
}

const SAVED_LOCATIONS = [
  { id: "1", type: "Home", address: "123 Main St, Tech Hub" },
  { id: "2", type: "Work", address: "StartUp Tower, 5th Floor" },
  { id: "3", type: "Other", address: "45 Hostel Rd, University Area" },
];

export const LocationSelector = ({ currentLocation, onSelect, onClose }: LocationSelectorProps) => {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, y: "100%" }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: "100%" }}
        className="w-full max-w-md bg-white rounded-t-3xl p-6 h-[80vh] flex flex-col"
      >
        <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-6"></div>
        
        <h2 className="text-xl font-bold text-gray-900 mb-6">Select Location</h2>
        
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search for a new address" 
            className="w-full bg-gray-100 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all"
            autoFocus
          />
        </div>

        <button 
          onClick={() => onSelect("Current Location")}
          className="flex items-center gap-4 p-4 rounded-xl border border-blue-100 bg-blue-50 text-blue-700 font-bold mb-6 hover:bg-blue-100 transition-colors"
        >
          <Navigation size={20} className="fill-current" />
          <div className="text-left">
            <span className="block text-sm">Use Current Location</span>
            <span className="block text-xs font-normal opacity-80">Koramangala, Bangalore</span>
          </div>
        </button>

        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Saved Locations</h3>
        <div className="space-y-3 flex-1 overflow-y-auto">
          {SAVED_LOCATIONS.map((loc) => (
            <button
              key={loc.id}
              onClick={() => onSelect(loc.address)}
              className="w-full flex items-center gap-4 p-3 hover:bg-gray-50 rounded-xl transition-colors group"
            >
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 group-hover:bg-white group-hover:shadow-sm transition-all">
                <MapPin size={20} />
              </div>
              <div className="text-left">
                <span className="block text-sm font-bold text-gray-900">{loc.type}</span>
                <span className="block text-xs text-gray-500">{loc.address}</span>
              </div>
            </button>
          ))}
          
          <button className="w-full flex items-center gap-4 p-3 hover:bg-gray-50 rounded-xl transition-colors text-blue-600">
            <div className="w-10 h-10 rounded-full border border-dashed border-blue-300 flex items-center justify-center">
              <Plus size={20} />
            </div>
            <span className="text-sm font-bold">Add New Address</span>
          </button>
        </div>

        <button 
          onClick={onClose}
          className="w-full py-4 mt-4 bg-gray-100 text-gray-900 font-bold rounded-xl"
        >
          Cancel
        </button>
      </motion.div>
    </div>
  );
};
