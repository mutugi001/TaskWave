import React from 'react';
import apiClient from '@/api/axiosConfig';
import { loadStripe } from '@stripe/stripe-js';
import { Plan } from '@/types/Plan';

const stripePromise = loadStripe('pk_test_XXXXXXXXXXXXXXXX'); // Your public key

export const checkoutWithStripe = async (plan: Plan): Promise<{ id: string }> => {
  console.log('Initiating checkout with plan:', plan);
  const response = await apiClient.post('/api/create-checkout-session', { plan });
  return response.data; // should return { id: 'session_id' }
};

export default checkoutWithStripe;


