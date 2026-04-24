import React, { useState } from "react";
import { 
  ChevronLeft, 
  Minus, 
  Plus, 
  Shirt, 
  Scissors, 
  Waves,
  ShoppingBag,
  ArrowRight
} from "lucide-react";
import { motion } from "motion/react";

interface SelectItemsScreenProps {
  onBack: () => void;
  onNext: (details: { items: string; total: number }) => void;
  providerName: string;
}

const ITEMS = [
  { id: 'shirt', name: 'Shirt/T-Shirt', price: 2, icon: Shirt },
  { id: 'trousers', name: 'Trousers/Jeans', price: 3, icon: Scissors }, // using scissors as placeholder for pants/tailoring
  { id: 'dress', name: 'Dress/Suit', price: 5, icon: ShoppingBag },
  { id: 'bedsheet', name: 'Bed Sheet', price: 4, icon: Waves },
  { id: 'towel', name: 'Towel', price: 1.5, icon: Waves },
  { id: 'other', name: 'Other', price: 2, icon: ShoppingBag },
];

export const SelectItemsScreen = ({ onBack, onNext, providerName }: SelectItemsScreenProps) => {
  const [activeTab, setActiveTab] = useState<'items' | 'weight'>('items');
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [weight, setWeight] = useState(5); // default 5kg

  const handleIncrement = (id: string) => {
    setCounts(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  };

  const handleDecrement = (id: string) => {
    setCounts(prev => {
      const newCount = (prev[id] || 0) - 1;
      if (newCount <= 0) {
        const { [id]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [id]: newCount };
    });
  };

  const calculateTotal = () => {
    if (activeTab === 'weight') {
      return weight * 1.5; // $1.5 per kg
    }
    return ITEMS.reduce((total, item) => {
      return total + (counts[item.id] || 0) * item.price;
    }, 0);
  };

  const getItemSummary = () => {
    if (activeTab === 'weight') {
      return `${weight}kg Wash & Fold`;
    }
    const parts = Object.entries(counts).map(([id, count]) => {
      const item = ITEMS.find(i => i.id === id);
      return item ? `${count}x ${item.name}` : '';
    }).filter(Boolean);
    
    if (parts.length === 0) return "No items selected";
    return parts.join(', ');
  };

  const handleNext = () => {
    const total = calculateTotal();
    if (total === 0) return;
    
    onNext({
      items: getItemSummary(),
      total
    });
  };

  const total = calculateTotal();

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="bg-white px-6 pt-12 pb-4 shadow-sm z-10">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ChevronLeft size={24} className="text-gray-800" />
          </button>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-gray-900">Select Items</h1>
            <p className="text-xs text-gray-500">{providerName}</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="p-4">
        <div className="bg-white p-1 rounded-xl shadow-sm flex">
          <button 
            onClick={() => setActiveTab('items')}
            className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${
              activeTab === 'items' 
                ? 'bg-blue-600 text-white shadow-md' 
                : 'text-gray-500 hover:bg-gray-50'
            }`}
          >
            By Item
          </button>
          <button 
            onClick={() => setActiveTab('weight')}
            className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${
              activeTab === 'weight' 
                ? 'bg-blue-600 text-white shadow-md' 
                : 'text-gray-500 hover:bg-gray-50'
            }`}
          >
            By Weight
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 pb-24">
        {activeTab === 'items' ? (
          <div className="space-y-4">
             <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-2">Individual Items (Iron/Wash)</p>
             {ITEMS.map((item) => {
               const count = counts[item.id] || 0;
               return (
                 <div key={item.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
                   <div className="flex items-center gap-4">
                     <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                       <item.icon size={20} />
                     </div>
                     <div>
                       <h3 className="font-bold text-gray-900">{item.name}</h3>
                       <p className="text-xs text-blue-600 font-bold">${item.price.toFixed(2)}/pc</p>
                     </div>
                   </div>
                   
                   <div className="flex items-center gap-3">
                     {count > 0 && (
                       <>
                         <button 
                           onClick={() => handleDecrement(item.id)}
                           className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50"
                         >
                           <Minus size={16} />
                         </button>
                         <span className="w-4 text-center font-bold text-gray-900">{count}</span>
                       </>
                     )}
                     <button 
                       onClick={() => handleIncrement(item.id)}
                       className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                         count > 0 ? 'bg-blue-600 text-white' : 'border border-gray-200 text-gray-400 hover:border-blue-500 hover:text-blue-500'
                       }`}
                     >
                       <Plus size={16} />
                     </button>
                   </div>
                 </div>
               );
             })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full pb-10">
            <div className="bg-white w-full rounded-3xl shadow-sm border border-gray-100 p-8 flex flex-col items-center">
              <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-6">
                <Waves size={32} />
              </div>
              
              <h3 className="text-gray-500 font-medium mb-1">Estimated Weight</h3>
              <div className="flex items-baseline gap-1 mb-8">
                <span className="text-6xl font-bold text-gray-900">{weight}</span>
                <span className="text-2xl text-gray-400 font-medium">kg</span>
              </div>
              
              <div className="w-full mb-8">
                <div className="flex justify-between text-xs text-gray-400 font-bold uppercase tracking-wider mb-3">
                  <span>1 kg</span>
                  <span>30 kg</span>
                </div>
                <input 
                  type="range" 
                  min="1" 
                  max="30" 
                  step="1"
                  value={weight}
                  onChange={(e) => setWeight(parseInt(e.target.value))}
                  className="w-full h-4 bg-gray-100 rounded-full appearance-none cursor-pointer accent-blue-600 hover:accent-blue-700"
                />
              </div>

              <div className="grid grid-cols-4 gap-2 w-full">
                {[5, 10, 15, 20].map((val) => (
                  <button
                    key={val}
                    onClick={() => setWeight(val)}
                    className={`py-2 rounded-lg text-sm font-bold transition-all ${
                      weight === val 
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-200' 
                        : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {val}kg
                  </button>
                ))}
              </div>
            </div>
            
            <p className="text-center text-gray-400 text-sm mt-8 max-w-xs mx-auto">
              Pricing is based on weight. $1.50 per kg for Wash & Fold service.
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-white border-t border-gray-100 max-w-md mx-auto z-20 pb-safe">
        <div className="flex justify-between items-center mb-4">
          <div>
            <p className="text-xs text-gray-500">Estimated Total</p>
            <p className="text-2xl font-bold text-gray-900">${total.toFixed(2)}</p>
          </div>
          <div className="text-right">
             <p className="text-xs text-gray-500">
               {activeTab === 'items' 
                 ? `${Object.values(counts).reduce((a, b) => a + b, 0)} items` 
                 : `${weight} kg`}
             </p>
          </div>
        </div>
        
        <button 
          onClick={handleNext}
          disabled={total === 0}
          className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
            total > 0 
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 active:scale-[0.98]' 
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }`}
        >
          Continue
          <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
};
