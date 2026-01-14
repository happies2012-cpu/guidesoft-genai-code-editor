import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, X } from 'lucide-react';

export const PricingPage: React.FC<{ onGetStarted: () => void }> = ({ onGetStarted }) => {
    const [annual, setAnnual] = useState(true);

    return (
        <div className="py-24 px-6 bg-[#050505]">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold mb-6">Simple, transparent pricing</h1>
                    <p className="text-gray-400 text-lg mb-8">
                        Everything you need to build faster, scaled to your needs.
                    </p>

                    <div className="inline-flex items-center p-1 bg-white/5 rounded-full border border-white/10">
                        <button
                            onClick={() => setAnnual(false)}
                            className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${!annual ? 'bg-orange-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                        >
                            Monthly
                        </button>
                        <button
                            onClick={() => setAnnual(true)}
                            className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${annual ? 'bg-orange-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                        >
                            Yearly <span className="text-xs ml-1 opacity-80">(Save 20%)</span>
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                    {/* Free Tier */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="p-8 rounded-2xl bg-[#0a0a0a] border border-white/5 flex flex-col"
                    >
                        <h3 className="text-xl font-bold mb-2">Hobby</h3>
                        <div className="text-3xl font-bold mb-6">$0<span className="text-lg text-gray-500 font-normal">/mo</span></div>
                        <p className="text-gray-400 text-sm mb-8">Perfect for side projects and learning.</p>

                        <div className="space-y-4 mb-8 flex-1">
                            <Feature>Unlimited Public Projects</Feature>
                            <Feature>Basic AI Completions</Feature>
                            <Feature>Community Support</Feature>
                            <Feature disabled>Auto-Dev workflows</Feature>
                            <Feature disabled>Local RAG Indexing</Feature>
                        </div>

                        <button
                            onClick={onGetStarted}
                            className="w-full py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg font-bold transition-colors"
                        >
                            Get Started
                        </button>
                    </motion.div>

                    {/* Pro Tier */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="relative p-8 rounded-2xl bg-[#121212] border border-orange-500/50 flex flex-col shadow-2xl shadow-orange-500/10"
                    >
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 py-1 bg-gradient-to-r from-orange-500 to-red-600 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg">
                            Most Popular
                        </div>
                        <h3 className="text-xl font-bold mb-2 text-white">Pro</h3>
                        <div className="text-3xl font-bold mb-6 text-white">
                            ${annual ? '15' : '19'}
                            <span className="text-lg text-gray-500 font-normal">/mo</span>
                        </div>
                        <p className="text-gray-400 text-sm mb-8">For professional developers shipping code.</p>

                        <div className="space-y-4 mb-8 flex-1">
                            <Feature>Unlimited Private Projects</Feature>
                            <Feature>Advanced AI (GPT-4 / Claude 3)</Feature>
                            <Feature>Local RAG Indexing (Unlimited)</Feature>
                            <Feature>Auto-Dev Workflows</Feature>
                            <Feature>Priority Support</Feature>
                        </div>

                        <button
                            onClick={onGetStarted}
                            className="w-full py-3 bg-gradient-to-r from-orange-500 to-red-600 rounded-lg font-bold text-white shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 hover:scale-[1.02] transition-all"
                        >
                            Start Pro Trial
                        </button>
                    </motion.div>

                    {/* Team Tier */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="p-8 rounded-2xl bg-[#0a0a0a] border border-white/5 flex flex-col"
                    >
                        <h3 className="text-xl font-bold mb-2">Team</h3>
                        <div className="text-3xl font-bold mb-6">
                            ${annual ? '39' : '49'}
                            <span className="text-lg text-gray-500 font-normal">/user</span>
                        </div>
                        <p className="text-gray-400 text-sm mb-8">For teams building scalable software together.</p>

                        <div className="space-y-4 mb-8 flex-1">
                            <Feature>Everything in Pro</Feature>
                            <Feature>Shared Workspaces</Feature>
                            <Feature>Centralized Billing</Feature>
                            <Feature>SSO / SAML</Feature>
                            <Feature>Dedicated Success Manager</Feature>
                        </div>

                        <button
                            onClick={onGetStarted}
                            className="w-full py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg font-bold transition-colors"
                        >
                            Contact Sales
                        </button>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

const Feature: React.FC<{ children: React.ReactNode; disabled?: boolean }> = ({ children, disabled }) => (
    <div className={`flex items-center gap-3 ${disabled ? 'text-gray-600' : 'text-gray-300'}`}>
        {disabled ? <X size={18} className="text-gray-700" /> : <Check size={18} className="text-orange-500" />}
        <span className="text-sm">{children}</span>
    </div>
);
