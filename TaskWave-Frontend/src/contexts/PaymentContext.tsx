import React, { createContext, useContext } from 'react';
import * as PaymentService from '../services/paymentService';
import { useAuth } from './AuthContext';
import { loadStripe } from '@stripe/stripe-js';

// Replace with your actual Stripe publishable key
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY || 'pk_test_XXXXXXXXXXXXXXXXXXXX');

interface PaymentContextType {
  checkout: (plan: any) => Promise<void>;
}

const PaymentContext = createContext<PaymentContextType | undefined>(undefined);

export const PaymentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();

  const checkout = async (plan: any): Promise<void> => {
    if (!user) {
      throw new Error('User must be authenticated to perform checkout.');
    }

    try {
      const stripe = await stripePromise;
      if (!stripe) {
        throw new Error('Stripe failed to load.');
      }

      const { id: sessionId } = await PaymentService.checkoutWithStripe(plan);

      const result = await stripe.redirectToCheckout({ sessionId });

      if (result.error) {
        console.error('Stripe redirect error:', result.error.message);
        throw new Error(result.error.message);
      }
    } catch (err) {
      console.error('Checkout failed:', err);
      throw err;
    }
  };

  const value: PaymentContextType = {
    checkout,
  };

  return (
    <PaymentContext.Provider value={value}>
      {children}
    </PaymentContext.Provider>
  );
};

export const usePayment = () => {
  const context = useContext(PaymentContext);
  if (!context) {
    throw new Error('usePayment must be used within a PaymentProvider');
  }
  return context;
};
