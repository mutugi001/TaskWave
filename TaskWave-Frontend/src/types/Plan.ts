// write the plan type definition
export interface Plan {
  name: string; // Name of the plan
  description: string; // Description of the plan
  monthlyPrice: number; // Monthly price of the plan
  yearlyPrice: number; // Yearly price of the plan
  icon: React.ComponentType; // Icon component for the plan
  color: string; // Color associated with the plan
  features: string[]; // List of features included in the plan
  popular: boolean; // Indicates if the plan is popular
  id: string; // Unique identifier for the plan
  stripePriceId: string; // Stripe price ID for the plan
  stripeProductId: string; // Stripe product ID for the plan
  billingCycle: 'monthly' | 'yearly'; // Billing cycle for the plan
  delay?: number; // Optional delay for animations or effects
  isActive?: boolean; // Indicates if the plan is currently active
  isSelected?: boolean; // Indicates if the plan is currently selected
  isDisabled?: boolean; // Indicates if the plan is currently disabled
  isFree?: boolean; // Indicates if the plan is free
  isTrial?: boolean; // Indicates if the plan is a trial plan
  trialPeriodDays?: number; // Number of days for the trial period
  maxUsers?: number; // Maximum number of users allowed in the plan
  maxStorage?: number; // Maximum storage allowed in the plan
  maxProjects?: number; // Maximum number of projects allowed in the plan
  maxIntegrations?: number; // Maximum number of integrations allowed in the plan
  maxAutomations?: number; // Maximum number of automations allowed in the plan
  maxTasks?: number; // Maximum number of tasks allowed in the plan
  maxSubtasks?: number; // Maximum number of subtasks allowed in the plan
  maxComments?: number; // Maximum number of comments allowed in the plan
  maxAttachments?: number; // Maximum number of attachments allowed in the plan
  maxLabels?: number; // Maximum number of labels allowed in the plan
  maxCustomFields?: number; // Maximum number of custom fields allowed in the plan
  maxViews?: number; // Maximum number of views allowed in the plan
  maxTemplates?: number; // Maximum number of templates allowed in the plan
};
