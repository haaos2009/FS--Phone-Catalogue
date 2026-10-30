import type React from 'react';
import type { Product } from '../../../types/Product';
import { useAppActions, useAppState } from '../../../store/store';
import { Star } from 'lucide-react';
import { useState } from 'react';

type ProductRatingProps = {
  product: Product;
};

export const ProductRating: React.FC<ProductRatingProps> = ({ product }) => {
  const currentRating = useAppState((state) => state.ratings[product.id] || 0);
  const { addProductReview } = useAppActions();

  const [isLoading, setIsLoading] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  const displayRating = Math.round(currentRating);
  const stars = [1, 2, 3, 4, 5];

  const handleRate = async (starNumber: number) => {
    try {
      setIsLoading(true);
      setFeedbackMessage(null);
      await addProductReview(product, starNumber);
      setFeedbackMessage('Thank you for your feedback!');
      setTimeout(() => setFeedbackMessage(null), 3000);
    } catch {
      setFeedbackMessage('Failed to save the rating');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-2">
        <div
          className={`flex ${isLoading ? 'opacity-50 pointer-events-none' : ''}`}
        >
          {stars.map((starNumber) => {
            const isActive = starNumber <= displayRating;
            return (
              <button
                key={starNumber}
                type="button"
                disabled={isLoading}
                onClick={() => handleRate(starNumber)}
                className="p-0.5 transition-transform duration-150 hover:scale-110 focus:outline-none"
                title={`Rate ${starNumber}`}
              >
                <Star
                  size={20}
                  className={`${
                    isActive ?
                      'stroke-amber-500 fill-amber-400'
                    : 'stroke-gray-300 fill-transparent'
                  } cursor-pointer`}
                />
              </button>
            );
          })}
        </div>

        <span className="text-xs font-semibold text-gray-500">
          {currentRating > 0 ? `${currentRating}/5` : '0/5'}
        </span>
      </div>

      {feedbackMessage && (
        <span className="text-[10px] text-gray-400 animate-fade-in">
          {feedbackMessage}
        </span>
      )}
    </div>
  );
};
