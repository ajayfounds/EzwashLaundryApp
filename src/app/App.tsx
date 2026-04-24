import React, { useState, useEffect } from "react";
import { Toaster, toast } from "sonner";
import { supabase } from "./utils/supabase/client";
import { BottomNav } from "./components/BottomNav";
import { ProviderCard } from "./components/ProviderCard";
import { NotificationsScreen } from "./components/NotificationsScreen";
import { LocationSelector } from "./components/LocationSelector";
import { ReviewModal } from "./components/ReviewModal";
import { PersonalInfo, SavedAddresses, NotificationSettings, PrivacySecurity } from "./components/ProfileDetails";
import { SplashScreen } from "./components/SplashScreen";
import { SelectItemsScreen } from "./components/SelectItemsScreen";
import { 
  MapPin, 
  Search, 
  Filter, 
  Bell, 
  ChevronLeft, 
  Star, 
  Clock, 
  ShieldCheck, 
  Calendar,
  CreditCard,
  CheckCircle2,
  Phone,
  MessageSquare,
  MoreVertical,
  Package,
  Truck,
  Shirt,
  Sparkles,
  User,
  ShoppingBag,
  ArrowRight,
  Send
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

// Types
interface ServiceProvider {
  id: string;
  name: string;
  image: string;
  rating: number;
  reviews: number;
  distance: string;
  deliveryTime: string;
  price: string;
  description: string;
  services: string[];
  address: string;
}

interface Order {
  id: string;
  providerName: string;
  status: 'Pending' | 'Picked Up' | 'In Progress' | 'Out for Delivery' | 'Delivered';
  date: string;
  items: string;
  total: string;
}

interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
  isMe: boolean;
}

interface Conversation {
  id: string;
  providerId: string;
  providerName: string;
  providerImage: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  messages: Message[];
}

// Mock Data
const CONVERSATIONS: Conversation[] = [
  {
    id: "c1",
    providerId: "1",
    providerName: "Sparkle Clean Laundry",
    providerImage: "https://images.unsplash.com/photo-1689588035701-b1a59512a192?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBsYXVuZHJ5JTIwc2VydmljZSUyMGludGVyaW9yfGVufDF8fHx8MTc2OTgyMTI5M3ww&ixlib=rb-4.1.0&q=80&w=1080",
    lastMessage: "Your laundry will be delivered by 5 PM today.",
    lastMessageTime: "10:30 AM",
    unreadCount: 2,
    messages: [
      { id: "m1", senderId: "1", text: "Hello! Just confirming your pickup time.", timestamp: "Yesterday, 4:00 PM", isMe: false },
      { id: "m2", senderId: "user", text: "Yes, 10 AM works perfectly.", timestamp: "Yesterday, 4:05 PM", isMe: true },
      { id: "m3", senderId: "1", text: "Great! Our driver will be there.", timestamp: "Yesterday, 4:06 PM", isMe: false },
      { id: "m4", senderId: "1", text: "Your laundry has been picked up.", timestamp: "Today, 10:15 AM", isMe: false },
      { id: "m5", senderId: "1", text: "Your laundry will be delivered by 5 PM today.", timestamp: "10:30 AM", isMe: false },
    ]
  },
  {
    id: "c2",
    providerId: "2",
    providerName: "Iron Man Pressing",
    providerImage: "https://images.unsplash.com/photo-1740684589228-54b6fba08985?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBpcm9uaW5nJTIwY2xvdGhlcyUyMHN0ZWFtfGVufDF8fHx8MTc2OTgyMTI5NHww&ixlib=rb-4.1.0&q=80&w=1080",
    lastMessage: "Are the shirts starched?",
    lastMessageTime: "Yesterday",
    unreadCount: 0,
    messages: [
      { id: "m1", senderId: "user", text: "Hi, do you do express delivery?", timestamp: "Mon, 2:00 PM", isMe: true },
      { id: "m2", senderId: "2", text: "Yes, we can deliver in 6 hours for extra charge.", timestamp: "Mon, 2:10 PM", isMe: false },
      { id: "m3", senderId: "user", text: "Okay, I have 5 shirts for ironing.", timestamp: "Mon, 2:15 PM", isMe: true },
      { id: "m4", senderId: "user", text: "Are the shirts starched?", timestamp: "Yesterday, 9:00 AM", isMe: true },
    ]
  }
];

// Mock Data
const PROVIDERS: ServiceProvider[] = [
  {
    id: "1",
    name: "Sparkle Clean Laundry",
    image: "https://images.unsplash.com/photo-1689588035701-b1a59512a192?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBsYXVuZHJ5JTIwc2VydmljZSUyMGludGVyaW9yfGVufDF8fHx8MTc2OTgyMTI5M3ww&ixlib=rb-4.1.0&q=80&w=1080",
    rating: 4.8,
    reviews: 124,
    distance: "0.8 km",
    deliveryTime: "24 hrs",
    price: "$2.5/kg",
    description: "Premium laundry service with eco-friendly detergents. We specialize in delicate fabrics and express delivery.",
    services: ["Wash & Fold", "Ironing", "Dry Cleaning"],
    address: "123 Main St, Tech Hub"
  },
  {
    id: "2",
    name: "Iron Man Pressing",
    image: "https://images.unsplash.com/photo-1740684589228-54b6fba08985?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBpcm9uaW5nJTIwY2xvdGhlcyUyMHN0ZWFtfGVufDF8fHx8MTc2OTgyMTI5NHww&ixlib=rb-4.1.0&q=80&w=1080",
    rating: 4.6,
    reviews: 89,
    distance: "1.2 km",
    deliveryTime: "6 hrs",
    price: "$1.0/pc",
    description: "Professional steam ironing service. Get crisp, wrinkle-free clothes delivered to your doorstep.",
    services: ["Ironing", "Starch"],
    address: "45 Hostel Rd, University Area"
  },
  {
    id: "3",
    name: "Quick Wash Hub",
    image: "https://images.unsplash.com/photo-1766727923581-d4df2f4e9308?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdGFjayUyMG9mJTIwY2xlYW4lMjBmb2xkZWQlMjB0b3dlbHN8ZW58MXx8fHwxNzY5ODIxMjk0fDA&ixlib=rb-4.1.0&q=80&w=1080",
    rating: 4.5,
    reviews: 210,
    distance: "2.5 km",
    deliveryTime: "48 hrs",
    price: "$2.0/kg",
    description: "Affordable bulk laundry solutions for students and working professionals.",
    services: ["Wash & Fold", "Bedding"],
    address: "78 PG Lane, City Center"
  }
];

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  // Auth state removed as requested - app is now open access
  const [currentTab, setCurrentTab] = useState("home");
  const [selectedProvider, setSelectedProvider] = useState<ServiceProvider | null>(null);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [isBooking, setIsBooking] = useState(false);
  const [bookingStep, setBookingStep] = useState<'select' | 'schedule'>('select');
  const [orderDetails, setOrderDetails] = useState<{ items: string, total: number } | null>(null);
  
  // New State
  const [showNotifications, setShowNotifications] = useState(false);
  const [showLocationSelector, setShowLocationSelector] = useState(false);
  const [currentLocation, setCurrentLocation] = useState("Koramangala, Bangalore");
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewTargetProvider, setReviewTargetProvider] = useState<string | null>(null);
  const [profileSubPage, setProfileSubPage] = useState<string | null>(null);

  // Auth effects removed

  const [activeOrders, setActiveOrders] = useState<Order[]>([
    {
      id: "ORD-7782",
      providerName: "Sparkle Clean Laundry",
      status: "In Progress",
      date: "Today, 10:30 AM",
      items: "5kg Wash & Fold",
      total: "$12.50"
    },
    {
      id: "ORD-7781",
      providerName: "Quick Iron Service",
      status: "Delivered",
      date: "Yesterday, 4:00 PM",
      items: "3 Shirts, 2 Pants (Ironing)",
      total: "$8.00"
    },
    {
      id: "ORD-7780",
      providerName: "Eco Dry Cleaners",
      status: "Cancelled",
      date: "Jan 28, 2:15 PM",
      items: "1 Suit (Dry Clean)",
      total: "$15.00"
    },
    {
      id: "ORD-7779",
      providerName: "Sparkle Clean Laundry",
      status: "Delivered",
      date: "Jan 25, 9:00 AM",
      items: "Bedding Set (Wash & Iron)",
      total: "$22.00"
    }
  ]);

  // Handle creating a new order
  const handleBookOrder = (paymentMethod: string) => {
    setIsBooking(false);
    setSelectedProvider(null);
    setCurrentTab("orders");
    setOrderDetails(null);
    setBookingStep('select');
    
    // Create new order
    const newOrder: Order = {
      id: `ORD-${Math.floor(Math.random() * 10000)}`,
      providerName: selectedProvider?.name || "Laundry Service",
      status: "Pending",
      date: "Just now",
      items: orderDetails?.items || "Selected Items",
      total: orderDetails?.total ? `$${orderDetails.total.toFixed(2)}` : "$15.00"
    };
    
    setActiveOrders([newOrder, ...activeOrders]);
    
    // Add a completed order for review demo purposes if none exist
    const hasCompletedOrder = activeOrders.some(o => o.status === 'Delivered');
    if (!hasCompletedOrder) {
       setTimeout(() => {
          setActiveOrders(prev => [
            ...prev,
            {
              id: "ORD-COMPLETED-1",
              providerName: selectedProvider?.name || "Laundry Service",
              status: "Delivered",
              date: "2 days ago",
              items: "2kg Ironing",
              total: "$5.00"
            }
          ]);
          toast.info("A past order has been marked as delivered for you to review!");
       }, 5000);
    }
  };

  const handleLogin = () => {
    // setIsAuthenticated(true);
    toast.success("Welcome back!");
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    // setIsAuthenticated(false);
    setCurrentTab("home");
    toast.success("Logged out successfully");
  };
  
  const handleReviewSubmit = (rating: number, comment: string) => {
    setShowReviewModal(false);
    toast.success("Thanks for your feedback!");
    // logic to save review would go here
  };

  const renderContent = () => {
    if (showSplash) {
      return <SplashScreen onComplete={() => setShowSplash(false)} />;
    }

    if (showNotifications) {
      return <NotificationsScreen onBack={() => setShowNotifications(false)} />;
    }

    // Profile Sub-pages
    if (currentTab === "profile" && profileSubPage) {
      switch (profileSubPage) {
        case "personal":
          return <PersonalInfo onBack={() => setProfileSubPage(null)} />;
        case "addresses":
          return <SavedAddresses onBack={() => setProfileSubPage(null)} />;
        case "notifications":
          return <NotificationSettings onBack={() => setProfileSubPage(null)} />;
        case "privacy":
          return <PrivacySecurity onBack={() => setProfileSubPage(null)} />;
        default:
          setProfileSubPage(null);
      }
    }

    if (selectedProvider) {
      if (isBooking) {
        if (bookingStep === 'select') {
          return (
            <SelectItemsScreen 
              providerName={selectedProvider.name}
              onBack={() => setIsBooking(false)}
              onNext={(details) => {
                setOrderDetails(details);
                setBookingStep('schedule');
              }}
            />
          );
        }
        return (
          <BookingScreen 
            provider={selectedProvider} 
            total={orderDetails?.total}
            onBack={() => setBookingStep('select')}
            onConfirm={handleBookOrder}
          />
        );
      }
      return (
        <ProviderDetail 
          provider={selectedProvider} 
          onBack={() => setSelectedProvider(null)}
          onBook={() => {
            setBookingStep('select');
            setIsBooking(true);
          }}
          onWriteReview={() => {
            setReviewTargetProvider(selectedProvider.name);
            setShowReviewModal(true);
          }}
        />
      );
    }

    if (selectedConversation) {
      return (
        <ChatScreen 
          conversation={selectedConversation} 
          onBack={() => setSelectedConversation(null)} 
        />
      );
    }

    switch (currentTab) {
      case "home":
        return (
          <HomeScreen 
            onSelectProvider={setSelectedProvider} 
            onNotificationClick={() => setShowNotifications(true)}
            onLocationClick={() => setShowLocationSelector(true)}
            currentLocation={currentLocation}
          />
        );
      case "orders":
        return (
          <OrdersScreen 
            orders={activeOrders} 
            onReview={(providerName) => {
              setReviewTargetProvider(providerName);
              setShowReviewModal(true);
            }}
          />
        );
      case "inbox":
        return <InboxScreen onSelectConversation={setSelectedConversation} />;
      case "profile":
        return <ProfileScreen onLogout={handleLogout} onNavigate={setProfileSubPage} />;
      default:
        return <HomeScreen onSelectProvider={setSelectedProvider} />;
    }
  };

  return (
    <div className="bg-gray-50 h-screen w-full font-sans text-gray-900 flex justify-center overflow-hidden">
      <Toaster position="top-center" />
      <div className="w-full max-w-md bg-white h-full shadow-2xl relative overflow-hidden flex flex-col">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentTab + (showNotifications ? "-notif" : "") + (selectedProvider ? "-detail" : "") + (isBooking ? "-booking" : "") + (selectedConversation ? "-chat" : "")}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="flex-1 relative overflow-hidden flex flex-col"
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
        
        {!showSplash && !selectedProvider && !selectedConversation && !showNotifications && (
          <BottomNav currentTab={currentTab} setCurrentTab={setCurrentTab} />
        )}

        <AnimatePresence>
          {showLocationSelector && (
            <LocationSelector 
              currentLocation={currentLocation}
              onSelect={(loc) => {
                setCurrentLocation(loc);
                setShowLocationSelector(false);
              }}
              onClose={() => setShowLocationSelector(false)}
            />
          )}
          {showReviewModal && (
            <ReviewModal 
              providerName={reviewTargetProvider || "Provider"}
              onClose={() => setShowReviewModal(false)}
              onSubmit={handleReviewSubmit}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// --- Screens ---

const HomeScreen = ({ 
  onSelectProvider, 
  onNotificationClick, 
  onLocationClick,
  currentLocation
}: { 
  onSelectProvider: (p: ServiceProvider) => void,
  onNotificationClick: () => void,
  onLocationClick: () => void,
  currentLocation: string
}) => (
  <div className="flex flex-col h-full">
    {/* Header */}
    <header className="px-6 pt-12 pb-4 bg-white sticky top-0 z-10">
      <div className="flex justify-between items-center mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
             <div className="w-6 h-6 bg-blue-600 rounded-lg flex items-center justify-center">
                <Sparkles size={14} className="text-white" />
             </div>
             <h1 className="text-xl font-bold text-gray-900 tracking-tight">EZwash</h1>
          </div>
          <div 
            className="flex items-center gap-1 cursor-pointer"
            onClick={onLocationClick}
          >
            <MapPin size={14} className="text-gray-400" />
            <span className="font-medium text-[rgb(25,26,29)] text-xs truncate max-w-[200px] text-[17px]">{currentLocation}</span>
            <span className="text-gray-400 text-[10px]">▼</span>
          </div>
        </div>
        <button 
          onClick={onNotificationClick}
          className="relative p-2 bg-[rgb(6,122,229)] rounded-full hover:bg-gray-100 transition-colors text-[rgb(234,235,237)] text-center"
        >
          <Bell size={20} className="text-white" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white text-[rgb(237,237,237)]"></span>
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <input 
          type="text" 
          placeholder="Search for laundry, ironing..." 
          className="w-full bg-gray-100 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all"
        />
        <button className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 bg-white rounded-lg shadow-sm">
          <Filter size={14} className="text-gray-600" />
        </button>
      </div>
    </header>

    <div className="flex-1 overflow-y-auto pb-6 px-6">
      {/* Services */}
      <section className="mt-4 mb-8">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Services</h2>
        <div className="grid grid-cols-4 gap-4">
          {[
            { name: "Wash", icon: Sparkles, color: "bg-blue-100 text-blue-600" },
            { name: "Ironing", icon: Shirt, color: "bg-purple-100 text-purple-600" },
            { name: "Dry Clean", icon: ShieldCheck, color: "bg-orange-100 text-orange-600" },
            { name: "Shoe Care", icon: Package, color: "bg-green-100 text-green-600" },
          ].map((s, i) => (
            <div key={i} className="flex flex-col items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${s.color}`}>
                <s.icon size={24} />
              </div>
              <span className="text-xs font-medium text-gray-700">{s.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Promotion */}
      <div className="mb-8 relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 p-5 text-white shadow-lg">
        <div className="relative z-10 w-2/3">
          <p className="text-xs font-medium text-blue-100 mb-1">New User Special</p>
          <h3 className="text-xl font-bold mb-2">Get 20% OFF</h3>
          <p className="text-xs text-blue-100 mb-3">On your first laundry & ironing order.</p>
          <button className="bg-white text-blue-600 px-4 py-1.5 rounded-lg text-xs font-bold hover:bg-blue-50 transition-colors">
            Claim Now
          </button>
        </div>
        <img 
          src="https://images.unsplash.com/photo-1766727923581-d4df2f4e9308?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdGFjayUyMG9mJTIwY2xlYW4lMjBmb2xkZWQlMjB0b3dlbHN8ZW58MXx8fHwxNzY5ODIxMjk0fDA&ixlib=rb-4.1.0&q=80&w=1080"
          alt="Clean Clothes"
          className="absolute -right-4 top-1/2 -translate-y-1/2 w-32 h-32 object-cover rounded-full border-4 border-white/20"
        />
      </div>

      {/* Nearby Providers */}
      <section>
        <div className="flex justify-between items-end mb-4">
          <h2 className="text-lg font-bold text-gray-900">Nearby Providers</h2>
          <button className="text-xs font-bold text-blue-600">See All</button>
        </div>
        
        <div className="space-y-4">
          {PROVIDERS.map((provider) => (
            <ProviderCard 
              key={provider.id}
              {...provider}
              onClick={() => onSelectProvider(provider)}
            />
          ))}
        </div>
      </section>
    </div>
  </div>
);

const ProviderDetail = ({ 
  provider, 
  onBack, 
  onBook,
  onWriteReview
}: { 
  provider: ServiceProvider, 
  onBack: () => void, 
  onBook: () => void,
  onWriteReview: () => void
}) => (
  <div className="flex flex-col h-full bg-white">
    <div className="relative h-64">
      <img 
        src={provider.image} 
        alt={provider.name} 
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
      <button 
        onClick={onBack}
        className="absolute top-12 left-6 p-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/30 transition-colors"
      >
        <ChevronLeft size={24} />
      </button>
      
      <div className="absolute bottom-6 left-6 right-6 text-white">
        <h1 className="text-2xl font-bold mb-2">{provider.name}</h1>
        <div className="flex items-center gap-4 text-sm font-medium">
          <div className="flex items-center gap-1 bg-yellow-400/20 backdrop-blur-sm px-2 py-0.5 rounded-lg text-yellow-300">
            <Star size={14} className="fill-current" />
            <span>{provider.rating} ({provider.reviews})</span>
          </div>
          <span className="flex items-center gap-1"><MapPin size={14} /> {provider.distance}</span>
          <span className="flex items-center gap-1"><Clock size={14} /> {provider.deliveryTime}</span>
        </div>
      </div>
    </div>

    <div className="flex-1 overflow-y-auto px-6 py-6 -mt-4 bg-white rounded-t-3xl relative z-10">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="font-bold text-lg mb-1">About</h3>
          <p className="text-gray-500 text-sm leading-relaxed">{provider.description}</p>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="font-bold text-lg mb-3">Services & Pricing</h3>
        <div className="grid grid-cols-2 gap-3">
          {provider.services.map((service, i) => (
            <div key={i} className="border border-gray-100 p-3 rounded-xl flex justify-between items-center hover:border-blue-100 hover:bg-blue-50 transition-colors cursor-pointer">
              <span className="text-sm font-medium text-gray-700">{service}</span>
              <span className="text-xs font-bold text-blue-600">{provider.price}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-bold text-lg">Reviews</h3>
          <button 
            onClick={onWriteReview}
            className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors"
          >
            Write a Review
          </button>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-xl mb-4">
          <div className="flex items-center gap-4">
            <div className="text-center min-w-[60px]">
              <div className="text-3xl font-bold text-gray-900">{provider.rating}</div>
              <div className="flex text-yellow-400 justify-center gap-0.5 mb-1">
                <Star size={10} fill="currentColor" />
                <Star size={10} fill="currentColor" />
                <Star size={10} fill="currentColor" />
                <Star size={10} fill="currentColor" />
                <Star size={10} fill="currentColor" />
              </div>
              <div className="text-[10px] text-gray-500">{provider.reviews} reviews</div>
            </div>
            <div className="flex-1 space-y-1">
              {[
                { label: '5', pct: 'w-[70%]' },
                { label: '4', pct: 'w-[20%]' },
                { label: '3', pct: 'w-[5%]' },
                { label: '2', pct: 'w-[3%]' },
                { label: '1', pct: 'w-[2%]' },
              ].map((r) => (
                <div key={r.label} className="flex items-center gap-2">
                  <span className="text-[10px] font-medium text-gray-500 w-3 text-right">{r.label}</span>
                  <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div className={`h-full bg-yellow-400 rounded-full ${r.pct}`}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <div className="flex text-yellow-400">
                <Star size={12} fill="currentColor" />
                <Star size={12} fill="currentColor" />
                <Star size={12} fill="currentColor" />
                <Star size={12} fill="currentColor" />
                <Star size={12} fill="currentColor" />
              </div>
              <span className="text-xs font-bold text-gray-900">Amazing Service!</span>
            </div>
            <p className="text-xs text-gray-500 leading-relaxed">
              "My clothes came back smelling so fresh and perfectly folded. The delivery was right on time too. Highly recommended!"
            </p>
            <p className="text-[10px] text-gray-400 mt-2">- Sarah K., 2 days ago</p>
          </div>
          
           <div className="bg-gray-50 p-4 rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <div className="flex text-yellow-400">
                <Star size={12} fill="currentColor" />
                <Star size={12} fill="currentColor" />
                <Star size={12} fill="currentColor" />
                <Star size={12} fill="currentColor" />
                <Star size={12} className="text-gray-300" />
              </div>
              <span className="text-xs font-bold text-gray-900">Good, but late</span>
            </div>
            <p className="text-xs text-gray-500 leading-relaxed">
              "Quality is great, but the pickup was 20 minutes late. Otherwise everything was perfect."
            </p>
            <p className="text-[10px] text-gray-400 mt-2">- Mike R., 1 week ago</p>
          </div>
        </div>
        
        <button className="w-full py-3 text-xs font-bold text-gray-500 mt-2">
          View all {provider.reviews} reviews
        </button>
      </div>

      <div className="mb-24">
        <h3 className="font-bold text-lg mb-3">Address</h3>
        <div className="flex items-start gap-3 bg-gray-50 p-4 rounded-xl">
          <MapPin className="text-gray-400 mt-1" size={20} />
          <div>
            <p className="text-sm font-medium text-gray-900">{provider.address}</p>
            <p className="text-xs text-gray-500 mt-0.5">Open 8:00 AM - 9:00 PM</p>
          </div>
        </div>
      </div>
    </div>

    <div className="fixed bottom-0 left-0 right-0 p-6 bg-white border-t border-gray-100 max-w-md mx-auto z-20 pb-safe">
      <button 
        onClick={onBook}
        className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-200 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
      >
        Book Service
        <ArrowRight size={20} />
      </button>
    </div>
  </div>
);

const BookingScreen = ({ provider, onBack, onConfirm, total }: { provider: ServiceProvider, onBack: () => void, onConfirm: (method: string) => void, total?: number }) => {
  const [selectedDateIndex, setSelectedDateIndex] = useState(0);
  const [selectedTime, setSelectedTime] = useState('09:00 AM');
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [processingState, setProcessingState] = useState<'idle' | 'processing' | 'success'>('idle');
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);

  const handleConfirm = () => {
    if (paymentMethod === 'cod') {
      onConfirm(paymentMethod);
    } else {
      setProcessingState('processing');
      setTimeout(() => {
        setProcessingState('success');
        setTimeout(() => {
          onConfirm(paymentMethod);
        }, 1500);
      }, 2000);
    }
  };

  // Generate next 30 days
  const dates = React.useMemo(() => Array.from({ length: 30 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return {
      day: d.toLocaleDateString('en-US', { weekday: 'short' }),
      date: d.getDate(),
      month: d.toLocaleDateString('en-US', { month: 'short' })
    };
  }), []);

  const times = ['09:00 AM', '11:00 AM', '01:00 PM', '03:00 PM', '05:00 PM', '07:00 PM'];

  // Center the selected date
  useEffect(() => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const selectedEl = container.children[selectedDateIndex] as HTMLElement;
      
      if (selectedEl) {
        const scrollLeft = selectedEl.offsetLeft - (container.offsetWidth / 2) + (selectedEl.offsetWidth / 2);
        container.scrollTo({ left: scrollLeft, behavior: 'smooth' });
      }
    }
  }, [selectedDateIndex]);

  return (
  <div className="flex flex-col h-full bg-gray-50 relative">
    {processingState !== 'idle' && (
      <div className="absolute inset-0 z-50 bg-white flex flex-col items-center justify-center">
        {processingState === 'processing' ? (
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Processing Payment</h3>
            <p className="text-gray-500">Please do not close this screen...</p>
          </div>
        ) : (
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center"
          >
            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 size={40} />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h3>
            <p className="text-gray-500">Your booking has been confirmed.</p>
          </motion.div>
        )}
      </div>
    )}

    <header className="bg-white px-6 pt-12 pb-4 shadow-sm z-20">
      <div className="flex items-center gap-4">
        <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-lg font-bold">Schedule Pickup</h1>
      </div>
    </header>

    <div className="flex-1 overflow-y-auto pb-safe no-scrollbar">
      {/* 3D Date Dial */}
      <div className="bg-white pt-6 pb-8 mb-6 shadow-sm relative overflow-hidden">
        <h3 className="font-bold text-gray-900 px-6 mb-4 flex items-center gap-2">
          <Calendar size={18} className="text-blue-600" />
          Select Date
        </h3>
        
        <div className="relative w-full h-32 flex items-center">
           {/* Gradient Overlays for Depth */}
           <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"></div>
           <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"></div>
           
           <div 
             ref={scrollContainerRef}
             className="flex items-center gap-4 overflow-x-auto px-[calc(50%-2rem)] no-scrollbar snap-x snap-mandatory w-full h-full py-2"
             style={{ perspective: '1000px' }}
           >
             {dates.map((item, i) => {
               const isSelected = i === selectedDateIndex;
               const dist = Math.abs(selectedDateIndex - i);
               const isNearby = dist === 1;
               
               return (
                 <button 
                   key={i} 
                   onClick={() => setSelectedDateIndex(i)}
                   className={`
                     relative flex-shrink-0 flex flex-col items-center justify-center 
                     w-16 h-24 rounded-2xl transition-all duration-500 ease-out snap-center border
                     ${isSelected 
                       ? 'bg-blue-600 border-blue-600 text-white shadow-xl shadow-blue-200 z-10' 
                       : 'bg-white border-gray-100 text-gray-400 hover:border-blue-200'
                     }
                   `}
                   style={{
                     transform: isSelected 
                       ? 'scale(1.1) translateZ(0px)' 
                       : `scale(${isNearby ? 0.9 : 0.75}) rotateY(${i < selectedDateIndex ? 25 : -25}deg) translateZ(-${dist * 10}px)`,
                     opacity: isSelected ? 1 : Math.max(0.3, 1 - dist * 0.3)
                   }}
                 >
                   <span className={`text-[10px] font-bold uppercase tracking-wider mb-1 ${isSelected ? 'text-blue-100' : 'text-gray-400'}`}>
                     {item.month}
                   </span>
                   <span className="text-2xl font-bold leading-none mb-1">{item.date}</span>
                   <span className={`text-xs font-medium ${isSelected ? 'text-blue-100' : 'text-gray-400'}`}>
                     {item.day}
                   </span>
                 </button>
               );
             })}
           </div>
        </div>
      </div>

      <div className="px-6 space-y-6">
        <div className="bg-white p-5 rounded-2xl shadow-sm">
          <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Clock size={18} className="text-blue-600" />
            Pickup Time
          </h3>
          <div className="grid grid-cols-3 gap-3">
            {times.map((time, i) => (
              <button 
                key={i} 
                onClick={() => setSelectedTime(time)}
                className={`py-2 rounded-lg text-sm font-medium border transition-all ${
                  selectedTime === time 
                    ? 'bg-blue-50 border-blue-200 text-blue-700 ring-1 ring-blue-200' 
                    : 'bg-white border-gray-100 text-gray-600 hover:border-gray-200'
                }`}
              >
                {time}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm mb-20">
          <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <CreditCard size={18} className="text-blue-600" />
            Payment Method
          </h3>
          <div className="space-y-3">
            <label 
              className={`flex items-center justify-between p-3 border rounded-xl cursor-pointer transition-all ${
                paymentMethod === 'upi' ? 'border-blue-200 bg-blue-50/50 ring-1 ring-blue-100' : 'border-gray-100 hover:border-gray-200'
              }`}
              onClick={() => setPaymentMethod('upi')}
            >
              <div className="flex items-center gap-3">
                <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                  paymentMethod === 'upi' ? 'border-blue-600' : 'border-gray-300'
                }`}>
                  {paymentMethod === 'upi' && <div className="w-2 h-2 rounded-full bg-blue-600" />}
                </div>
                <span className="font-medium text-gray-900">UPI / GPay</span>
              </div>
              <img src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_Pay_logo.svg" className="h-4 opacity-0" alt="icon" />
            </label>
            
            <label 
              className={`flex items-center justify-between p-3 border rounded-xl cursor-pointer transition-all ${
                paymentMethod === 'cod' ? 'border-blue-200 bg-blue-50/50 ring-1 ring-blue-100' : 'border-gray-100 hover:border-gray-200'
              }`}
              onClick={() => setPaymentMethod('cod')}
            >
              <div className="flex items-center gap-3">
                <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                  paymentMethod === 'cod' ? 'border-blue-600' : 'border-gray-300'
                }`}>
                  {paymentMethod === 'cod' && <div className="w-2 h-2 rounded-full bg-blue-600" />}
                </div>
                <span className="font-medium text-gray-600">Cash on Delivery</span>
              </div>
            </label>
          </div>
        </div>
      </div>
    </div>

    <div className="bg-white border-t border-gray-100 p-6 pb-safe fixed bottom-0 left-0 right-0 max-w-md mx-auto z-30">
      <div className="flex justify-between items-center mb-4">
        <span className="text-gray-500 text-sm">Total Estimate</span>
        <span className="text-xl font-bold text-gray-900">{total ? `$${total.toFixed(2)}` : "$15.00"}</span>
      </div>
      <button 
        onClick={handleConfirm}
        className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-200 active:scale-[0.98] transition-all"
      >
        {paymentMethod === 'cod' ? 'Confirm Booking' : 'Pay & Confirm'}
      </button>
    </div>
  </div>
  );
};

const OrdersScreen = ({ orders, onReview }: { orders: Order[], onReview: (providerName: string) => void }) => (
  <div className="flex flex-col h-full bg-gray-50 pt-12 px-6 overflow-y-auto pb-safe">
    <h1 className="text-2xl font-bold text-gray-900 mb-6">My Orders</h1>
    <div className="space-y-4">
      {orders.map((order) => (
        <div key={order.id} className="bg-white p-5 rounded-2xl shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div>
              <span className={`text-xs font-bold px-2 py-1 rounded-md mb-2 inline-block ${
                order.status === 'Delivered' 
                  ? 'bg-green-100 text-green-700' 
                  : order.status === 'Cancelled'
                    ? 'bg-red-50 text-red-600'
                    : 'bg-blue-50 text-blue-600'
              }`}>
                {order.status}
              </span>
              <h3 className="font-bold text-gray-900">{order.providerName}</h3>
              <p className="text-xs text-gray-500 mt-1">{order.date}</p>
            </div>
            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
              <Package size={20} className="text-gray-600" />
            </div>
          </div>
          
          <div className="border-t border-b border-gray-50 py-3 mb-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">{order.items}</span>
              <span className="font-medium text-gray-900">{order.total}</span>
            </div>
          </div>

          <div className="flex gap-3">
            {order.status === 'Delivered' ? (
              <button 
                onClick={() => onReview(order.providerName)}
                className="flex-1 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-sm shadow-lg shadow-blue-200 hover:bg-blue-700 transition-colors"
              >
                Rate & Review
              </button>
            ) : order.status === 'Cancelled' ? (
              <button className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-bold text-sm hover:bg-gray-50 transition-colors">
                Reorder
              </button>
            ) : (
              <button className="flex-1 py-2.5 rounded-xl border border-blue-600 text-blue-600 font-bold text-sm hover:bg-blue-50 transition-colors">
                Track Order
              </button>
            )}
            <button className="w-10 flex items-center justify-center rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50">
              <MessageSquare size={18} />
            </button>
          </div>
        </div>
      ))}

      {orders.length === 0 && (
        <div className="text-center py-20">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShoppingBag size={32} className="text-gray-400" />
          </div>
          <p className="text-gray-500 font-medium">No active orders</p>
          <p className="text-xs text-gray-400 mt-1">Book a service to get started</p>
        </div>
      )}
    </div>
  </div>
);

const InboxScreen = ({ onSelectConversation }: { onSelectConversation: (c: Conversation) => void }) => (
  <div className="flex flex-col h-full bg-white pt-12">
    <div className="px-6 mb-4">
      <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
    </div>
    <div className="flex-1 overflow-y-auto">
      {CONVERSATIONS.map((conversation) => (
        <div 
          key={conversation.id} 
          onClick={() => onSelectConversation(conversation)}
          className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 cursor-pointer border-b border-gray-50 transition-colors"
        >
          <div className="relative">
            <img 
              src={conversation.providerImage} 
              alt={conversation.providerName} 
              className="w-12 h-12 rounded-full object-cover"
            />
            {conversation.unreadCount > 0 && (
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-center mb-1">
              <h3 className="font-bold text-gray-900 text-sm">{conversation.providerName}</h3>
              <span className={`text-[10px] ${conversation.unreadCount > 0 ? 'text-blue-600 font-bold' : 'text-gray-400'}`}>
                {conversation.lastMessageTime}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <p className={`text-sm truncate ${conversation.unreadCount > 0 ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
                {conversation.lastMessage}
              </p>
              {conversation.unreadCount > 0 && (
                <div className="min-w-[18px] h-[18px] bg-blue-600 rounded-full flex items-center justify-center ml-2">
                  <span className="text-[10px] text-white font-bold">{conversation.unreadCount}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const ChatScreen = ({ conversation, onBack }: { conversation: Conversation, onBack: () => void }) => {
  const [messages, setMessages] = useState(conversation.messages);
  const [inputText, setInputText] = useState("");
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newMessage: Message = {
      id: `m-${Date.now()}`,
      senderId: "user",
      text: inputText,
      timestamp: "Just now",
      isMe: true
    };

    setMessages([...messages, newMessage]);
    setInputText("");

    // Simulate response
    setTimeout(() => {
      const response: Message = {
        id: `m-${Date.now() + 1}`,
        senderId: conversation.providerId,
        text: "Thanks for your message! We'll get back to you shortly.",
        timestamp: "Just now",
        isMe: false
      };
      setMessages(prev => [...prev, response]);
    }, 1000);
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      <header className="bg-white px-4 py-3 shadow-sm z-10 flex items-center gap-3 pt-12 pb-4">
        <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <ChevronLeft size={24} />
        </button>
        <div className="w-10 h-10 rounded-full overflow-hidden">
          <img src={conversation.providerImage} alt={conversation.providerName} className="w-full h-full object-cover" />
        </div>
        <div>
          <h3 className="font-bold text-gray-900 text-sm">{conversation.providerName}</h3>
          <span className="text-xs text-green-500 font-medium flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
            Online
          </span>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex ${msg.isMe ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`
                max-w-[75%] px-4 py-3 rounded-2xl text-sm
                ${msg.isMe 
                  ? 'bg-blue-600 text-white rounded-tr-sm shadow-blue-100' 
                  : 'bg-white text-gray-800 rounded-tl-sm shadow-sm border border-gray-100'
                }
              `}
            >
              <p>{msg.text}</p>
              <p className={`text-[10px] mt-1 text-right ${msg.isMe ? 'text-blue-100' : 'text-gray-400'}`}>
                {msg.timestamp}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-white border-t border-gray-100 pb-safe">
        <form 
          onSubmit={handleSendMessage}
          className="flex items-center gap-2 bg-gray-50 rounded-full px-4 py-2 border border-gray-200 focus-within:border-blue-300 focus-within:ring-2 focus-within:ring-blue-100 transition-all"
        >
          <input 
            type="text" 
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 bg-transparent border-none outline-none text-sm py-2"
          />
          <button 
            type="submit"
            disabled={!inputText.trim()}
            className={`p-2 rounded-full transition-colors ${
              inputText.trim() 
                ? 'bg-blue-600 text-white hover:bg-blue-700' 
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  );
};

const ProfileScreen = ({ onLogout, onNavigate }: { onLogout: () => void, onNavigate: (page: string) => void }) => (
  <div className="flex flex-col h-full bg-gray-50 pt-12 overflow-y-auto pb-safe">
    <div className="px-6 mb-8 flex items-center gap-4">
      <div className="w-16 h-16 rounded-full bg-gray-200 overflow-hidden">
        <img src="https://images.unsplash.com/photo-1753161023962-665967602405?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYXBweSUyMGN1c3RvbWVyJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzY5ODE4MzE0fDA&ixlib=rb-4.1.0&q=80&w=1080" alt="Profile" className="w-full h-full object-cover" />
      </div>
      <div>
        <h1 className="text-xl font-bold text-gray-900">Alex Johnson</h1>
        <p className="text-sm text-gray-500">alex.j@example.com</p>
      </div>
    </div>

    <div className="bg-white flex-1 rounded-t-3xl shadow-sm px-6 py-8 space-y-6">
      <section>
        <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Account</h2>
        <div className="space-y-4">
          <div 
            onClick={() => onNavigate('personal')}
            className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-xl cursor-pointer transition-colors"
          >
            <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-600"><User size={20} /></div>
            <span className="font-medium text-gray-900">Personal Info</span>
          </div>
          <div 
            onClick={() => onNavigate('addresses')}
            className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-xl cursor-pointer transition-colors"
          >
            <div className="w-10 h-10 bg-purple-50 rounded-full flex items-center justify-center text-purple-600"><MapPin size={20} /></div>
            <span className="font-medium text-gray-900">Saved Addresses</span>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Settings</h2>
        <div className="space-y-4">
          <div 
            onClick={() => onNavigate('notifications')}
            className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-xl cursor-pointer transition-colors"
          >
            <div className="w-10 h-10 bg-orange-50 rounded-full flex items-center justify-center text-orange-600"><Bell size={20} /></div>
            <span className="font-medium text-gray-900">Notifications</span>
          </div>
          <div 
            onClick={() => onNavigate('privacy')}
            className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-xl cursor-pointer transition-colors"
          >
            <div className="w-10 h-10 bg-red-50 rounded-full flex items-center justify-center text-red-600"><ShieldCheck size={20} /></div>
            <span className="font-medium text-gray-900">Privacy & Security</span>
          </div>
        </div>
      </section>
      
      <button 
        onClick={onLogout}
        className="w-full py-3 text-red-500 font-bold bg-red-50 rounded-xl mt-4 hover:bg-red-100 transition-colors"
      >
        Log Out
      </button>
    </div>
  </div>
);
