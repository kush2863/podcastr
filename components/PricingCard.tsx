"use client"
import { cardData } from '@/constants';
import React from 'react';
import { loadStripe } from '@stripe/stripe-js';

import { useState } from 'react';
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!);

const PricingCard = ({ priceId }: { priceId: string }) => {
  
    const [loading, setLoading] = useState(false);
  
    const handleCheckout = async () => {
      setLoading(true);
      const stripe = await stripePromise;
  
      try {
        const response = await fetch('/api/checkout_sessions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ priceId }),
        });
  
        const { url } = await response.json();
        window.location.href = url;
      } catch (error) {
        console.error('Error redirecting to checkout:', error);
      } finally {
        setLoading(false);
      }
    };
  
  
    return (
        <div className="w-full py-[5rem] md:py-[8rem] px-4 text-gray-900">
          <div className="max-w-[1240px] mx-auto grid md:grid-cols-2 gap-8 text-white-1">
            {cardData.map((card, index) => (
              <div
                key={index}
                className="bg-white shadow-xl rounded-lg overflow-hidden hover:scale-105 transition-transform duration-300 border border-orange-1"
              >
                
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-center py-4">
                    {card.title}
                  </h2>
                  <p className="text-center text-4xl font-extrabold mb-4">{card.price}</p>
                  <div className="text-center font-medium">
                    {card.features.map((feature, idx) => (
                      <p
                        key={idx}
                        className={`py-2 border-b ${idx === 0 ? "mt-4" : ""} ${idx === card.features.length - 1 ? "border-none" : ""}`}
                      >
                        {feature}
                      </p>
                    ))}
                  </div>
                  {index !== 0 && ( 
                                <div className="flex justify-center">
                                    <button onClick={(e)=>handleCheckout()}
                                        className="bg-whitetext-white hover:bg-orange-1 hover:text-white duration-150 w-full rounded-md font-medium my-6 py-3 transition-colors"  >
                                        Start Trial
                                    </button>
                                </div>
                            )}
                </div>
              </div>
            ))}
          </div>
        </div>
      );
};

export default PricingCard;
