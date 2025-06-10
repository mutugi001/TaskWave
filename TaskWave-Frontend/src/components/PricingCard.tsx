import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Plan } from '@/types/Plan';

interface PricingCardProps {
  plan: Plan;
  billingCycle: 'monthly' | 'yearly';
  delay?: number;
  onCheckout: () => void;
}

export const PricingCard: React.FC<PricingCardProps> = ({ plan, billingCycle, delay = 0, onCheckout }) => {
  const [isHovered, setIsHovered] = useState(false);
  const price = billingCycle === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice;

  return (
    <Card
      className="relative overflow-visible border-2 hover:shadow-xl transition-shadow duration-300"
      style={{ transitionDelay: `${delay}ms` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {plan.popular && (
        <Badge
          variant="secondary"
          className="absolute top-4 right-4 bg-blue-500 text-white border-none shadow-md"
        >
          Popular
        </Badge>
      )}
      <CardHeader className="space-y-2">
        <CardTitle className="text-2xl font-bold flex items-center space-x-2">
          {React.createElement(plan.icon as React.ComponentType<{ className?: string }>, { className: "h-6 w-6 text-blue-500" })}
          <span>{plan.name}</span>
        </CardTitle>
        <CardDescription className="text-slate-500">
          {plan.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="text-6xl font-extrabold">
          ${price}
          <span className="text-sm text-slate-500 ml-2">
            /{billingCycle === 'monthly' ? 'month' : 'year'}
          </span>
        </div>
        <ul className="grid gap-2">
          {plan.features.map((feature) => (
            <li key={feature} className="flex items-center space-x-2">
              <Check className="h-4 w-4 text-green-500" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        <Button className="w-full" onClick={onCheckout}>
          Choose Plan
        </Button>
      </CardFooter>
    </Card>
  );
};
