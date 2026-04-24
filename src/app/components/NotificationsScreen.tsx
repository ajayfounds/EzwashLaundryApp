import React from "react";
import { ChevronLeft, Bell, Package, Tag, Info } from "lucide-react";
import { motion } from "motion/react";

interface Notification {
  id: string;
  type: 'order' | 'promo' | 'system';
  title: string;
  message: string;
  time: string;
  read: boolean;
}

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: "1",
    type: "order",
    title: "Driver is on the way",
    message: "Your laundry from Sparkle Clean is being delivered.",
    time: "2 mins ago",
    read: false
  },
  {
    id: "2",
    type: "promo",
    title: "50% Off Ironing",
    message: "Use code IRON50 for your next order. Valid until Sunday.",
    time: "2 hours ago",
    read: false
  },
  {
    id: "3",
    type: "system",
    title: "Account Verified",
    message: "Your email has been successfully verified.",
    time: "1 day ago",
    read: true
  },
  {
    id: "4",
    type: "order",
    title: "Order Delivered",
    message: "Order #1234 has been delivered. Please rate your experience.",
    time: "2 days ago",
    read: true
  }
];

export const NotificationsScreen = ({ onBack }: { onBack: () => void }) => {
  return (
    <div className="flex flex-col h-full bg-gray-50">
      <header className="bg-white px-6 pt-12 pb-4 shadow-sm z-10 flex items-center gap-4">
        <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-xl font-bold text-gray-900">Notifications</h1>
      </header>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {MOCK_NOTIFICATIONS.map((notif, i) => (
          <motion.div
            key={notif.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className={`p-4 rounded-2xl border ${
              notif.read ? 'bg-white border-gray-100' : 'bg-blue-50 border-blue-100'
            }`}
          >
            <div className="flex gap-4">
              <div className={`
                w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0
                ${notif.type === 'order' ? 'bg-blue-100 text-blue-600' : 
                  notif.type === 'promo' ? 'bg-purple-100 text-purple-600' : 'bg-gray-100 text-gray-600'}
              `}>
                {notif.type === 'order' && <Package size={20} />}
                {notif.type === 'promo' && <Tag size={20} />}
                {notif.type === 'system' && <Info size={20} />}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start mb-1">
                  <h3 className={`font-bold text-sm ${notif.read ? 'text-gray-900' : 'text-blue-900'}`}>
                    {notif.title}
                  </h3>
                  <span className="text-[10px] text-gray-400">{notif.time}</span>
                </div>
                <p className={`text-sm ${notif.read ? 'text-gray-500' : 'text-blue-800'}`}>
                  {notif.message}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
