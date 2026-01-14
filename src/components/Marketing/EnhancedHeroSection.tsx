import React from 'react';
import { Sparkles, Code2, Zap, Users, Shield, Rocket } from 'lucide-react';

export const EnhancedHeroSection: React.FC = () => {
    return (
        <div className="relative min-h-screen bg-gradient-to-br from-black via-purple-900/20 to-black text-white overflow-hidden">
            {/* Animated Background */}
            <div className="absolute inset-0 bg-[url('/hero-bg.png')] bg-cover bg-center opacity-30"></div>
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-900/10 to-black"></div>

            {/* Grid Pattern Overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(139,92,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.03)_1px,transparent_1px)] bg-[size:50px_50px]"></div>

            {/* Content */}
            <div className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-20">
                {/* Logo */}
                <div className="flex justify-center mb-8">
                    <img src="/logo.png" alt="GuideSoft" className="h-16" />
                </div>

                {/* Main Headline */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/20 rounded-full border border-purple-500/30 mb-6 backdrop-blur-sm">
                        <Sparkles size={16} className="text-purple-400 animate-pulse" />
                        <span className="text-sm font-medium">AI-Powered Code Editor</span>
                    </div>

                    <h1 className="text-7xl md:text-8xl font-bold mb-6 leading-tight">
                        Build 10x Faster
                        <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 animate-gradient">
                            with AI
                        </span>
                    </h1>

                    <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-12 leading-relaxed">
                        The most advanced AI code editor. Write code with natural language,
                        get instant completions, and deploy in seconds.
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
                        <button className="group px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all shadow-2xl shadow-purple-500/30 hover:scale-105">
                            <Rocket size={20} className="group-hover:rotate-12 transition-transform" />
                            Start 14-Day Trial
                        </button>
                        <button className="px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 rounded-xl font-bold text-lg transition-all hover:scale-105">
                            Watch Demo
                        </button>
                    </div>
                </div>

                {/* Feature Pills */}
                <div className="flex flex-wrap justify-center gap-4 mb-20">
                    {[
                        { icon: Code2, text: 'AI Code Generation' },
                        { icon: Zap, text: 'Instant Completions' },
                        { icon: Users, text: 'Team Collaboration' },
                        { icon: Shield, text: 'Enterprise Security' }
                    ].map((feature, idx) => (
                        <div
                            key={idx}
                            className="flex items-center gap-2 px-6 py-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full hover:bg-white/10 transition-all hover:scale-105 cursor-pointer"
                        >
                            <feature.icon size={18} className="text-purple-400" />
                            <span className="text-sm font-medium">{feature.text}</span>
                        </div>
                    ))}
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
                    {[
                        { value: '100K+', label: 'Developers' },
                        { value: '1M+', label: 'Lines Generated' },
                        { value: '99.9%', label: 'Uptime' },
                        { value: '10x', label: 'Faster Coding' }
                    ].map((stat, idx) => (
                        <div key={idx} className="text-center">
                            <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400 mb-2">
                                {stat.value}
                            </div>
                            <div className="text-sm text-gray-400">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Glow Effects */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
    );
};
