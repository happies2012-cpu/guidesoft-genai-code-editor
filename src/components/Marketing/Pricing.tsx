import React from 'react';
import { Check, Sparkles, Zap, Crown } from 'lucide-react';

export const Pricing: React.FC = () => {
    const tiers = [
        {
            name: 'Free',
            price: '₹0',
            period: 'forever',
            description: 'Perfect for learning and personal projects',
            features: [
                '500 AI completions/month',
                'Basic code generation',
                '1 project',
                'Community support',
                'Standard models (GPT-3.5)',
            ],
            cta: 'Get Started',
            icon: <Sparkles className="text-blue-400" />,
            popular: false
        },
        {
            name: 'Pro',
            price: '₹999',
            period: '/month',
            description: 'For professional developers',
            features: [
                'Unlimited AI completions',
                'Advanced code generation',
                'Unlimited projects',
                'Priority support',
                'Premium models (GPT-4, Claude)',
                'Multi-file editing',
                'Real-time collaboration',
                'Custom AI training',
            ],
            cta: 'Start Free Trial',
            icon: <Zap className="text-yellow-400" />,
            popular: true
        },
        {
            name: 'Enterprise',
            price: 'Custom',
            period: 'pricing',
            description: 'For teams and organizations',
            features: [
                'Everything in Pro',
                'Dedicated support',
                'SSO & SAML',
                'Custom deployment',
                'SLA guarantees',
                'Advanced security',
                'Audit logs',
                'Team analytics',
                'Custom integrations',
            ],
            cta: 'Contact Sales',
            icon: <Crown className="text-purple-400" />,
            popular: false
        }
    ];

    return (
        <div className="py-20 bg-gradient-to-b from-black via-[#0a0a0a] to-black text-white min-h-screen">
            <div className="max-w-7xl mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                        Choose Your Plan
                    </h2>
                    <p className="text-xl text-gray-400">Start free, upgrade as you grow</p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 mb-16">
                    {tiers.map((tier) => (
                        <div
                            key={tier.name}
                            className={`relative p-8 rounded-2xl border transition-all duration-300 hover:scale-105 ${tier.popular
                                    ? 'bg-gradient-to-b from-blue-900/20 to-purple-900/20 border-blue-500 shadow-2xl shadow-blue-500/20'
                                    : 'bg-white/5 border-white/10 hover:border-white/20'
                                }`}
                        >
                            {tier.popular && (
                                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                                    <span className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-1 rounded-full text-sm font-bold">
                                        MOST POPULAR
                                    </span>
                                </div>
                            )}

                            <div className="flex items-center gap-3 mb-4">
                                {tier.icon}
                                <h3 className="text-2xl font-bold">{tier.name}</h3>
                            </div>

                            <div className="mb-4">
                                <span className="text-4xl font-bold">{tier.price}</span>
                                <span className="text-gray-400 ml-2">{tier.period}</span>
                            </div>

                            <p className="text-gray-400 mb-6 h-12">{tier.description}</p>

                            <ul className="space-y-3 mb-8">
                                {tier.features.map((feature, idx) => (
                                    <li key={idx} className="flex items-start gap-2">
                                        <Check size={20} className="text-green-400 flex-shrink-0 mt-0.5" />
                                        <span className="text-sm">{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            <div className="space-y-3">
                                <button className={`w-full py-3 rounded-lg font-bold transition-all ${tier.popular
                                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg shadow-blue-500/50'
                                        : 'bg-white/10 hover:bg-white/20'
                                    }`}>
                                    {tier.cta}
                                </button>

                                {tier.name !== 'Enterprise' && (
                                    <button className="w-full py-3 bg-white/5 hover:bg-white/10 rounded-lg font-bold flex items-center justify-center gap-2 transition-colors border border-white/10">
                                        <span>📱</span> Pay with UPI / GPay
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Feature Comparison Matrix */}
                <div className="bg-white/5 rounded-2xl border border-white/10 p-8">
                    <h3 className="text-2xl font-bold mb-8 text-center">Feature Comparison</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-white/10">
                                    <th className="text-left py-4 px-4">Feature</th>
                                    <th className="text-center py-4 px-4">Free</th>
                                    <th className="text-center py-4 px-4">Pro</th>
                                    <th className="text-center py-4 px-4">Enterprise</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm">
                                {[
                                    ['AI Completions', '500/mo', 'Unlimited', 'Unlimited'],
                                    ['Projects', '1', 'Unlimited', 'Unlimited'],
                                    ['Team Members', '1', '1', 'Unlimited'],
                                    ['AI Models', 'Basic', 'Premium', 'Custom'],
                                    ['Support', 'Community', 'Priority', 'Dedicated'],
                                    ['Collaboration', '✗', '✓', '✓'],
                                    ['SSO/SAML', '✗', '✗', '✓'],
                                    ['SLA', '✗', '✗', '✓'],
                                ].map(([feature, free, pro, enterprise], idx) => (
                                    <tr key={idx} className="border-b border-white/5 hover:bg-white/5">
                                        <td className="py-3 px-4 text-gray-300">{feature}</td>
                                        <td className="py-3 px-4 text-center text-gray-400">{free}</td>
                                        <td className="py-3 px-4 text-center text-blue-400 font-semibold">{pro}</td>
                                        <td className="py-3 px-4 text-center text-purple-400 font-semibold">{enterprise}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};
