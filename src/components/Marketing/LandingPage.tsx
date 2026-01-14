import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Zap, Shield, Cpu, Globe, Layers, ArrowRight } from 'lucide-react';

export const LandingPage: React.FC<{ onGetStarted: () => void }> = ({ onGetStarted }) => {
    return (
        <div className="flex flex-col">
            {/* Hero Section */}
            <section className="relative pt-20 pb-32 px-6 overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-orange-500/10 rounded-full blur-[100px] pointer-events-none" />
                <div className="relative max-w-5xl mx-auto text-center z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-orange-400 text-sm font-medium mb-8">
                            <Sparkles size={14} />
                            <span>v2.0 is now live</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8">
                            Build AI Apps <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-red-500 to-purple-600">at Warp Speed</span>
                        </h1>
                        <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
                            The first IDE designed for autonomous coding. Delegate complex tasks to AI agents,
                            automate workflows, and ship production-ready code 10x faster.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <button
                                onClick={onGetStarted}
                                className="w-full sm:w-auto px-8 py-4 bg-white text-black rounded-lg font-bold text-lg hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
                            >
                                Start Building Free <ArrowRight size={20} />
                            </button>
                            <button className="w-full sm:w-auto px-8 py-4 bg-white/5 border border-white/10 rounded-lg font-bold text-lg hover:bg-white/10 transition-colors">
                                View Demo
                            </button>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-24 bg-[#050505]">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Supercharged by Agents</h2>
                        <p className="text-gray-400 max-w-xl mx-auto">
                            Don't just code. Orchestrate. Our multi-agent system handles research, implementation, and testing in parallel.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: <Cpu className="text-orange-400" size={32} />,
                                title: "Autonomous Agents",
                                description: "Dedicated agents for coding, debugging, and documentation that work together to solve complex tasks."
                            },
                            {
                                icon: <Globe className="text-blue-400" size={32} />,
                                title: "Local RAG Intelligence",
                                description: "Your codebase is indexed locally. Ask questions and get instant, context-aware answers without sending code to the cloud."
                            },
                            {
                                icon: <Zap className="text-yellow-400" size={32} />,
                                title: "Lightning Fast",
                                description: "Built on Rust and optimized for performance. Experience zero-latency typing and instant startup times."
                            },
                            {
                                icon: <Shield className="text-green-400" size={32} />,
                                title: "Enterprise Security",
                                description: "Bank-grade encryption and local-first architecture ensure your IP never leaves your machine."
                            },
                            {
                                icon: <Layers className="text-purple-400" size={32} />,
                                title: "Workflow Automation",
                                description: "Chain prompts and actions into reusable workflows. Automate deployments, testing, and more."
                            },
                            {
                                icon: <Sparkles className="text-pink-400" size={32} />,
                                title: "AI Composer",
                                description: "A collaborative canvas where you and the AI work side-by-side to iterate on designs and logic."
                            }
                        ].map((feature, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                className="p-8 rounded-2xl bg-[#0a0a0a] border border-white/5 hover:border-orange-500/30 transition-colors group"
                            >
                                <div className="mb-6 p-4 rounded-xl bg-white/5 w-fit group-hover:bg-white/10 transition-colors">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                                <p className="text-gray-400 leading-relaxed">
                                    {feature.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-32 px-6">
                <div className="max-w-5xl mx-auto p-12 rounded-3xl bg-gradient-to-r from-orange-600 to-red-700 text-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                    <div className="relative z-10">
                        <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to code the future?</h2>
                        <p className="text-orange-100 text-lg mb-10 max-w-2xl mx-auto">
                            Join thousands of developers using GuideSoft to build the next generation of software.
                        </p>
                        <button
                            onClick={onGetStarted}
                            className="px-10 py-4 bg-white text-orange-600 rounded-full font-bold text-lg shadow-xl hover:scale-105 transition-transform"
                        >
                            Get Started Now
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
};
