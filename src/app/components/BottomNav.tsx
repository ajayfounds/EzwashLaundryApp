import React from "react";
import { Home, ShoppingBag, MessageCircle, User } from "lucide-react";

interface BottomNavProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentTab, setCurrentTab }) => {
  const tabs = [
    { id: "home", icon: Home, label: "Home" },
    { id: "orders", icon: ShoppingBag, label: "Orders" },
    { id: "inbox", icon: MessageCircle, label: "Inbox" },
    { id: "profile", icon: User, label: "Profile" },
  ];

  return (
    <div className="w-full bg-white border-t border-gray-100 px-6 pt-3 pb-8 flex justify-between items-center z-50 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] shrink-0">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = currentTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => setCurrentTab(tab.id)}
            className={`flex flex-col items-center space-y-1 transition-colors ${
              isActive ? "text-blue-600" : "text-gray-400 hover:text-gray-600"
            }`}
          >
            <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
            <span className="text-[10px] font-medium">{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
};
