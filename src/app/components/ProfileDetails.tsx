import React, { useState } from "react";
import { ChevronLeft, User, Mail, Phone, MapPin, Trash2, Plus, Bell, Lock, Shield, Eye, EyeOff } from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";

// --- Wrappers ---

interface SubPageProps {
  title: string;
  onBack: () => void;
  children: React.ReactNode;
}

const SubPage = ({ title, onBack, children }: SubPageProps) => (
  <div className="flex flex-col h-full bg-gray-50">
    <header className="bg-white px-6 pt-12 pb-4 shadow-sm z-10 flex items-center gap-4">
      <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
        <ChevronLeft size={24} />
      </button>
      <h1 className="text-xl font-bold text-gray-900">{title}</h1>
    </header>
    <div className="flex-1 overflow-y-auto px-6 py-6">
      {children}
    </div>
  </div>
);

// --- Sections ---

export const PersonalInfo = ({ onBack }: { onBack: () => void }) => {
  const [isEditing, setIsEditing] = useState(false);
  
  return (
    <SubPage title="Personal Info" onBack={onBack}>
      <div className="flex flex-col items-center mb-8">
        <div className="w-24 h-24 rounded-full bg-gray-200 overflow-hidden mb-4 relative group">
          <img 
            src="https://images.unsplash.com/photo-1753161023962-665967602405?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYXBweSUyMGN1c3RvbWVyJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzY5ODE4MzE0fDA&ixlib=rb-4.1.0&q=80&w=1080" 
            alt="Profile" 
            className="w-full h-full object-cover" 
          />
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
             <span className="text-white text-xs font-bold">Edit</span>
          </div>
        </div>
        <h2 className="text-lg font-bold">Alex Johnson</h2>
      </div>

      <form className="space-y-5">
        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700 ml-1">Full Name</label>
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="text" 
              defaultValue="Alex Johnson"
              className="w-full bg-white border border-gray-100 text-gray-900 rounded-xl py-3.5 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-200"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700 ml-1">Email Address</label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="email" 
              defaultValue="alex.j@example.com"
              className="w-full bg-white border border-gray-100 text-gray-900 rounded-xl py-3.5 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-200"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700 ml-1">Phone Number</label>
          <div className="relative">
            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="tel" 
              defaultValue="+1 (555) 000-8888"
              className="w-full bg-white border border-gray-100 text-gray-900 rounded-xl py-3.5 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-200"
            />
          </div>
        </div>

        <button 
          type="button"
          onClick={() => {
            toast.success("Profile updated successfully!");
            onBack();
          }}
          className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-200 active:scale-[0.98] transition-all mt-8"
        >
          Save Changes
        </button>
      </form>
    </SubPage>
  );
};

export const SavedAddresses = ({ onBack }: { onBack: () => void }) => {
  return (
    <SubPage title="Saved Addresses" onBack={onBack}>
      <div className="space-y-4">
        {[
          { type: "Home", address: "123 Main St, Tech Hub", icon: MapPin },
          { type: "Work", address: "StartUp Tower, 5th Floor", icon: MapPin },
        ].map((loc, i) => (
          <div key={i} className="bg-white p-4 rounded-xl border border-gray-100 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
                <loc.icon size={20} />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">{loc.type}</h3>
                <p className="text-xs text-gray-500">{loc.address}</p>
              </div>
            </div>
            <button className="p-2 text-gray-400 hover:text-red-500 transition-colors">
              <Trash2 size={18} />
            </button>
          </div>
        ))}

        <button className="w-full py-4 border border-dashed border-blue-300 rounded-xl text-blue-600 font-bold flex items-center justify-center gap-2 hover:bg-blue-50 transition-colors">
          <Plus size={20} />
          Add New Address
        </button>
      </div>
    </SubPage>
  );
};

export const NotificationSettings = ({ onBack }: { onBack: () => void }) => {
  const [toggles, setToggles] = useState({
    orders: true,
    promos: false,
    security: true,
    news: true
  });

  const toggle = (key: keyof typeof toggles) => {
    setToggles(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <SubPage title="Notifications" onBack={onBack}>
      <div className="space-y-6 bg-white p-6 rounded-2xl shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
              <Bell size={20} />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">Order Updates</h3>
              <p className="text-xs text-gray-500">Get alerts for pickup & delivery</p>
            </div>
          </div>
          <button 
            onClick={() => toggle('orders')}
            className={`w-12 h-6 rounded-full p-1 transition-colors ${toggles.orders ? 'bg-blue-600' : 'bg-gray-200'}`}
          >
            <div className={`w-4 h-4 bg-white rounded-full transition-transform ${toggles.orders ? 'translate-x-6' : 'translate-x-0'}`} />
          </button>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-purple-50 rounded-full flex items-center justify-center text-purple-600">
              <Plus size={20} />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">Promotions</h3>
              <p className="text-xs text-gray-500">Discounts and special offers</p>
            </div>
          </div>
          <button 
            onClick={() => toggle('promos')}
            className={`w-12 h-6 rounded-full p-1 transition-colors ${toggles.promos ? 'bg-blue-600' : 'bg-gray-200'}`}
          >
            <div className={`w-4 h-4 bg-white rounded-full transition-transform ${toggles.promos ? 'translate-x-6' : 'translate-x-0'}`} />
          </button>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-red-50 rounded-full flex items-center justify-center text-red-600">
              <Shield size={20} />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">Security Alerts</h3>
              <p className="text-xs text-gray-500">Login attempts and password changes</p>
            </div>
          </div>
          <button 
            onClick={() => toggle('security')}
            className={`w-12 h-6 rounded-full p-1 transition-colors ${toggles.security ? 'bg-blue-600' : 'bg-gray-200'}`}
          >
            <div className={`w-4 h-4 bg-white rounded-full transition-transform ${toggles.security ? 'translate-x-6' : 'translate-x-0'}`} />
          </button>
        </div>
      </div>
    </SubPage>
  );
};

export const PrivacySecurity = ({ onBack }: { onBack: () => void }) => {
  return (
    <SubPage title="Privacy & Security" onBack={onBack}>
      <div className="bg-white p-6 rounded-2xl shadow-sm space-y-6">
        <button className="w-full flex items-center justify-between group">
          <div className="flex items-center gap-4">
             <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
               <Lock size={20} />
             </div>
             <span className="font-bold text-gray-900">Change Password</span>
          </div>
          <ChevronLeft size={20} className="rotate-180 text-gray-300" />
        </button>

        <button className="w-full flex items-center justify-between group">
          <div className="flex items-center gap-4">
             <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
               <Shield size={20} />
             </div>
             <span className="font-bold text-gray-900">Two-Factor Authentication</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-gray-400">Off</span>
            <ChevronLeft size={20} className="rotate-180 text-gray-300" />
          </div>
        </button>

        <div className="pt-4 border-t border-gray-100">
          <button className="text-red-500 text-sm font-bold hover:underline">
            Delete Account
          </button>
          <p className="text-[10px] text-gray-400 mt-1">
            Permanently delete your account and all data.
          </p>
        </div>
      </div>

      <div className="mt-8">
        <h3 className="text-sm font-bold text-gray-900 mb-2">Legal</h3>
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <button className="w-full p-4 text-left text-sm font-medium text-gray-600 hover:bg-gray-50 border-b border-gray-50 flex justify-between">
            Terms of Service
            <ChevronLeft size={16} className="rotate-180 text-gray-300" />
          </button>
          <button className="w-full p-4 text-left text-sm font-medium text-gray-600 hover:bg-gray-50 flex justify-between">
            Privacy Policy
            <ChevronLeft size={16} className="rotate-180 text-gray-300" />
          </button>
        </div>
      </div>
    </SubPage>
  );
};
