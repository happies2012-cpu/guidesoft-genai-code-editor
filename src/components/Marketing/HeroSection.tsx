import React from 'react';
import { ArrowRight, Code } from 'lucide-react';

export const HeroSection: React.FC<{ onGetStarted: () => void }> = ({ onGetStarted }) => {
    return (
        <div className="relative min-h-[80vh] flex items-center justify-center overflow-hidden bg-[#050505]">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-pink-900/20 pointer-events-none" />
            <div className="z-10 text-center max-w-4xl px-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm text-blue-400 mb-8 animate-fade-in">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                    </span>
                    V3.0 Now Available
                </div>
                <h1 className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-6 tracking-tight">
                    Code at the Speed of Thought
                </h1>
                <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
                    The ultimate AI-powered IDE. Built for 10x developers.
                    Now with Enterprise Security, Cloud Deployment, and Visual Workflows.
                </p>
                <div className="flex items-center justify-center gap-4">
                    <button onClick={onGetStarted} className="px-8 py-4 bg-white text-black font-bold rounded-xl hover:scale-105 transition-transform flex items-center gap-2">
                        Start Coding Free <ArrowRight size={20} />
                    </button>
                    <button className="px-8 py-4 bg-white/10 text-white font-bold rounded-xl hover:bg-white/20 transition-colors flex items-center gap-2">
                        <Code size={20} /> View Demo
                    </button>
                </div>
            </div>
        </div>
    );
};
