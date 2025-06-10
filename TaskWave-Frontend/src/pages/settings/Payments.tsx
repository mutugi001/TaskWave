import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Star, Zap, Crown, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PricingCard } from '@/components/PricingCard';
import { usePayment } from '@/contexts/PaymentContext';
import { toast } from 'sonner';

const Payments = () => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const { checkout } = usePayment();

  const plans = [
    {
      name: 'Basic/Free',
      description: 'Perfect for individuals getting started with task management',
      monthlyPrice: 0,
      yearlyPrice: 0,
      icon: Star,
      color: 'blue',
      features: [
        'Up to 10 projects',
        '50 tasks per project',
        'Basic analytics',
        'Email support',
        'Mobile app access',
        '2GB storage'
      ],
      popular: false
    },
    {
      name: 'Premium',
      description: 'Ideal for teams and power users who need advanced features',
      monthlyPrice: 19,
      yearlyPrice: 190,
      icon: Zap,
      color: 'purple',
      features: [
        'Unlimited projects',
        'Unlimited tasks',
        'Advanced analytics & insights',
        'Priority support',
        'Team collaboration tools',
        'Custom workflows',
        'Time tracking',
        '10GB storage',
        'API access'
      ],
      popular: true
    },
    {
      name: 'Enterprise',
      description: 'For large organizations requiring enterprise-grade solutions',
      monthlyPrice: 39,
      yearlyPrice: 390,
      icon: Crown,
      color: 'gold',
      features: [
        'Everything in Premium',
        'Advanced security controls',
        'Custom integrations',
        'Dedicated account manager',
        'SLA guarantee',
        'Custom reporting',
        'SSO integration',
        'Unlimited storage',
        'White-label options'
      ],
      popular: false
    }
  ];

  const handleCheckout = async (plan: any) => {
    try {
      await checkout(plan);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Star className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                TaskWave
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            Choose Your Plan
          </h1>
          <p className="text-xl text-slate-600 mb-8 max-w-3xl mx-auto">
            Unlock the full potential of TaskWave with our flexible subscription plans.
            Scale your productivity and manage tasks like never before.
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center space-x-4 mb-8">
            <span className={`font-medium ${billingCycle === 'monthly' ? 'text-slate-900' : 'text-slate-500'}`}>
              Monthly
            </span>
            <button
              onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
              className="relative inline-flex h-6 w-11 items-center rounded-full bg-slate-200 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  billingCycle === 'yearly' ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
            <span className={`font-medium ${billingCycle === 'yearly' ? 'text-slate-900' : 'text-slate-500'}`}>
              Yearly
            </span>
            <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">
              Save 20%
            </Badge>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {plans.map((plan, index) => (
            <PricingCard
              key={plan.name}
              plan={plan}
              billingCycle={billingCycle}
              delay={index * 100}
              onCheckout={() => handleCheckout(plan)}
            />
          ))}
        </div>

        {/* Features Comparison */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
          <div className="px-6 py-8 bg-gradient-to-r from-blue-600 to-purple-600">
            <h2 className="text-2xl font-bold text-white text-center">
              Feature Comparison
            </h2>
            <p className="text-blue-100 text-center mt-2">
              See what's included in each plan
            </p>
          </div>

          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-4 px-2 font-semibold text-slate-900">Features</th>
                    <th className="text-center py-4 px-2 font-semibold text-slate-900">Basic</th>
                    <th className="text-center py-4 px-2 font-semibold text-slate-900">Premium</th>
                    <th className="text-center py-4 px-2 font-semibold text-slate-900">Enterprise</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {[
                    { feature: 'Projects', basic: '10', premium: 'Unlimited', enterprise: 'Unlimited' },
                    { feature: 'Tasks per project', basic: '50', premium: 'Unlimited', enterprise: 'Unlimited' },
                    { feature: 'Team members', basic: '1', premium: '10', enterprise: 'Unlimited' },
                    { feature: 'Storage', basic: '2GB', premium: '10GB', enterprise: 'Unlimited' },
                    { feature: 'Analytics', basic: 'Basic', premium: 'Advanced', enterprise: 'Custom' },
                    { feature: 'Support', basic: 'Email', premium: 'Priority', enterprise: 'Dedicated' },
                    { feature: 'API Access', basic: '✗', premium: '✓', enterprise: '✓' },
                    { feature: 'SSO Integration', basic: '✗', premium: '✗', enterprise: '✓' }
                  ].map((row, index) => (
                    <tr key={index} className="hover:bg-slate-50 transition-colors">
                      <td className="py-4 px-2 text-slate-900 font-medium">{row.feature}</td>
                      <td className="py-4 px-2 text-center text-slate-600">{row.basic}</td>
                      <td className="py-4 px-2 text-center text-slate-600">{row.premium}</td>
                      <td className="py-4 px-2 text-center text-slate-600">{row.enterprise}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16 text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-8">
            Frequently Asked Questions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {[
              {
                question: "Can I change my plan anytime?",
                answer: "Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately."
              },
              {
                question: "Is there a free trial?",
                answer: "We offer a 14-day free trial for all our paid plans. No credit card required."
              },
              {
                question: "What payment methods do you accept?",
                answer: "We accept all major credit cards, PayPal, and bank transfers for Enterprise plans."
              },
              {
                question: "Can I cancel anytime?",
                answer: "Yes, you can cancel your subscription at any time. Your access continues until the end of your billing period."
              }
            ].map((faq, index) => (
              <Card key={index} className="text-left hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">{faq.question}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="mt-16 text-center">
          <p className="text-slate-600 mb-4">Trusted by thousands of teams worldwide</p>
          <div className="flex items-center justify-center space-x-8 opacity-60">
            <div className="text-2xl font-bold text-slate-400">10,000+</div>
            <div className="text-slate-400">Active Users</div>
            <div className="text-2xl font-bold text-slate-400">99.9%</div>
            <div className="text-slate-400">Uptime</div>
            <div className="text-2xl font-bold text-slate-400">24/7</div>
            <div className="text-slate-400">Support</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payments;
