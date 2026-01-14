import React from 'react';
import { Sparkles, Zap } from 'lucide-react';

interface PricingTier {
    name: string;
    price: number;
    period: string;
    description: string;
    features: string[];
    cta: string;
    popular?: boolean;
    enterprise?: boolean;
}

const pricingTiers: PricingTier[] = [
    {
        name: 'Hobby',
        price: 10,
        period: 'month',
        description: 'Perfect for individual developers',
        features: [
            '500 AI completions/month',
            '2 active projects',
            'Basic AI models',
            'Community support',
            'Code generation',
            'Basic autocomplete'
        ],
        cta: 'Start 14-day trial'
    },
    {
        name: 'Pro',
        price: 20,
        period: 'month',
        description: 'For professional developers',
        features: [
            'Unlimited AI completions',
            'Unlimited projects',
            'All AI models (GPT-4, Claude, Gemini)',
            'Priority support',
            'Advanced code generation',
            'Multi-file editing',
            'AI refactoring',
            'Code explanations',
            'Custom snippets'
        ],
        cta: 'Start 14-day trial',
        popular: true
    },
    {
        name: 'Team',
        price: 50,
        period: 'user/month',
        description: 'For collaborative teams',
        features: [
            'Everything in Pro',
            'Team collaboration',
            'Shared workspaces',
            'Admin dashboard',
            'Usage analytics',
            'Team management',
            'SSO (coming soon)',
            'Audit logs'
        ],
        cta: 'Start 14-day trial'
    },
    {
        name: 'Enterprise',
        price: 200,
        period: 'month',
        description: 'For large organizations',
        features: [
            'Everything in Team',
            'Custom AI models',
            'On-premise deployment',
            '99.9% SLA guarantee',
            'Dedicated support',
            'Custom integrations',
            'Advanced security',
            'Training & onboarding',
            'Custom contracts'
        ],
        cta: 'Contact Sales',
        enterprise: true
    }
];

export const NewPricing: React.FC = () => {
    return (
        <div className="min-h-screen bg-gradient-to-b from-black via-purple-900/20 to-black text-white py-20 px-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/20 rounded-full border border-purple-500/30 mb-6">
                        <Sparkles size={16} className="text-purple-400" />
                        <span className="text-sm">Simple, transparent pricing</span>
                    </div>
                    <h1 className="text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-purple-400">
                        Choose Your Plan
                    </h1>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                        Start with a 14-day free trial. No credit card required. Cancel anytime.
                    </p>
                </div>

                {/* Pricing Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                    {pricingTiers.map((tier) => (
                        <div
                            key={tier.name}
                            className={`relative rounded-2xl p-8 border transition-all hover:scale-105 ${tier.popular
                                ? 'bg-gradient-to-b from-purple-900/40 to-black border-purple-500 shadow-2xl shadow-purple-500/20'
                                : 'bg-white/5 border-white/10 hover:border-white/20'
                                }`}
                        >
                            {tier.popular && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full text-sm font-bold">
                                    Most Popular
                                </div>
                            )}

                            <div className="mb-6">
                                <h3 className="text-2xl font-bold mb-2">{tier.name}</h3>
                                <p className="text-gray-400 text-sm mb-4">{tier.description}</p>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-5xl font-bold">${tier.price}</span>
                                    <span className="text-gray-400">/{tier.period}</span>
                                </div>
                            </div>

                            <button
                                className={`w-full py-3 rounded-lg font-bold mb-6 transition-all ${tier.popular
                                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg shadow-purple-500/30'
                                    : tier.enterprise
                                        ? 'bg-white text-black hover:bg-gray-200'
                                        : 'bg-white/10 hover:bg-white/20'
                                    }`}
                            >
                                {tier.cta}
                            </button>

                            <ul className="space-y-3">
                                {tier.features.map((feature, idx) => (
                                    <li key={idx} className="flex items-start gap-2 text-sm">
                                        <Zap size={16} className="text-purple-400 mt-0.5 flex-shrink-0" />
                                        <span className="text-gray-300">{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Feature Comparison */}
                <div className="bg-white/5 rounded-2xl border border-white/10 p-8">
                    <h2 className="text-3xl font-bold mb-8 text-center">Feature Comparison</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-white/10">
                                    <th className="text-left py-4 px-4">Feature</th>
                                    <th className="text-center py-4 px-4">Hobby</th>
                                    <th className="text-center py-4 px-4">Pro</th>
                                    <th className="text-center py-4 px-4">Team</th>
                                    <th className="text-center py-4 px-4">Enterprise</th>
                                </tr>
                            </thead>
                            <tbody>
                                {[
                                    ['AI Completions', '500/mo', 'Unlimited', 'Unlimited', 'Unlimited'],
                                    ['Projects', '2', 'Unlimited', 'Unlimited', 'Unlimited'],
                                    ['AI Models', 'Basic', 'All', 'All', 'All + Custom'],
                                    ['Support', 'Community', 'Priority', 'Priority', 'Dedicated'],
                                    ['Team Features', '—', '—', '✓', '✓'],
                                    ['SSO', '—', '—', 'Soon', '✓'],
                                    ['On-Premise', '—', '—', '—', '✓'],
                                    ['SLA', '—', '—', '—', '99.9%']
                                ].map((row, idx) => (
                                    <tr key={idx} className="border-b border-white/5">
                                        <td className="py-4 px-4 font-medium">{row[0]}</td>
                                        <td className="py-4 px-4 text-center text-gray-400">{row[1]}</td>
                                        <td className="py-4 px-4 text-center text-gray-400">{row[2]}</td>
                                        <td className="py-4 px-4 text-center text-gray-400">{row[3]}</td>
                                        <td className="py-4 px-4 text-center text-gray-400">{row[4]}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* FAQ */}
                <div className="mt-16 text-center">
                    <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
                    <p className="text-gray-400 mb-8">
                        Have questions? <a href="#" className="text-purple-400 hover:text-purple-300">Contact our sales team</a>
                    </p>
                </div>
            </div>
        </div>
    );
};
