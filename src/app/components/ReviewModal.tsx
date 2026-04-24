import React, { useState } from "react";
import { Star, X } from "lucide-react";
import { motion } from "motion/react";

interface ReviewModalProps {
  onClose: () => void;
  onSubmit: (rating: number, comment: string) => void;
  providerName: string;
}

export const ReviewModal = ({ onClose, onSubmit, providerName }: ReviewModalProps) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [hoverRating, setHoverRating] = useState(0);

  const handleSubmit = () => {
    if (rating > 0) {
      onSubmit(rating, comment);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl relative"
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X size={20} />
        </button>

        <div className="text-center mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Rate your experience</h2>
          <p className="text-sm text-gray-500">How was your service with <br/> <span className="font-bold text-gray-800">{providerName}</span>?</p>
        </div>

        <div className="flex justify-center gap-2 mb-8">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              className="p-1 transition-transform hover:scale-110 active:scale-95 focus:outline-none"
            >
              <Star 
                size={32} 
                className={`${
                  (hoverRating || rating) >= star 
                    ? "fill-yellow-400 text-yellow-400" 
                    : "fill-gray-100 text-gray-200"
                } transition-colors`} 
              />
            </button>
          ))}
        </div>

        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Write your feedback here..."
          className="w-full h-32 bg-gray-50 rounded-xl p-4 text-sm mb-6 resize-none focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all"
        />

        <button 
          onClick={handleSubmit}
          disabled={rating === 0}
          className={`w-full py-4 rounded-xl font-bold text-white transition-all ${
            rating > 0 
              ? "bg-blue-600 shadow-lg shadow-blue-200 hover:bg-blue-700 active:scale-[0.98]" 
              : "bg-gray-200 cursor-not-allowed"
          }`}
        >
          Submit Review
        </button>
      </motion.div>
    </div>
  );
};
