import React from 'react';
import { ArrowRight, Github, Twitter, Linkedin, Code } from 'lucide-react';

interface MarketingLayoutProps {
    children: React.ReactNode;
    onNavigate: (page: 'landing' | 'pricing' | 'faq' | 'docs' | 'blog' | 'about' | 'careers' | 'contact' | 'privacy' | 'terms') => void;
    onGetStarted: () => void;
    currentPage: string;
}

export const MarketingLayout: React.FC<MarketingLayoutProps> = ({
    children,
    onNavigate,
    onGetStarted,
    currentPage
}) => {
    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col font-sans selection:bg-orange-500/30">
            {/* Navbar */}
            <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#0a0a0a]/80 backdrop-blur-md">
                {/* ... existing navbar content ... */}
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div
                        className="flex items-center gap-2 cursor-pointer group"
                        onClick={() => onNavigate('landing')}
                    >
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center shadow-lg shadow-orange-500/20 group-hover:shadow-orange-500/40 transition-shadow">
                            <Code size={18} className="text-white" />
                        </div>
                        <span className="font-bold text-lg tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-orange-100 to-orange-400">
                            GuideSoft
                        </span>
                    </div>

                    <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-400">
                        <button
                            onClick={() => onNavigate('landing')}
                            className={`hover:text-white transition-colors ${currentPage === 'landing' ? 'text-white' : ''}`}
                        >
                            Features
                        </button>
                        <button
                            onClick={() => onNavigate('pricing')}
                            className={`hover:text-white transition-colors ${currentPage === 'pricing' ? 'text-white' : ''}`}
                        >
                            Pricing
                        </button>
                        <button
                            onClick={() => onNavigate('faq')}
                            className={`hover:text-white transition-colors ${currentPage === 'faq' ? 'text-white' : ''}`}
                        >
                            FAQ
                        </button>
                        <button
                            onClick={() => onNavigate('blog')}
                            className={`hover:text-white transition-colors ${currentPage === 'blog' ? 'text-white' : ''}`}
                        >
                            Blog
                        </button>
                    </div>

                    <div className="flex items-center gap-4">
                        <button
                            onClick={onGetStarted}
                            className="hidden md:flex items-center gap-2 text-sm font-medium text-gray-300 hover:text-white transition-colors"
                        >
                            Sign In
                        </button>
                        <button
                            onClick={onGetStarted}
                            className="px-4 py-2 bg-gradient-to-r from-orange-500 to-red-600 rounded-full text-sm font-bold text-white shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
                        >
                            Get Started <ArrowRight size={16} />
                        </button>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="flex-1 mt-16 flex flex-col">
                {children}
            </main>

            {/* Footer */}
            <footer className="border-t border-white/5 bg-[#050505] py-12 mt-20">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                        <div className="col-span-1 md:col-span-2">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-6 h-6 rounded bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
                                    <Code size={14} className="text-white" />
                                </div>
                                <span className="font-bold text-lg text-white">GuideSoft</span>
                            </div>
                            <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
                                The next-generation AI code editor built for speed, autonomy, and developer happiness.
                                Build faster with specialized agents and intelligent workflows.
                            </p>
                        </div>

                        <div>
                            <h4 className="font-bold text-white mb-4">Product</h4>
                            <ul className="space-y-2 text-sm text-gray-400">
                                <li><button onClick={() => onNavigate('landing')} className="hover:text-orange-400 transition-colors">Features</button></li>
                                <li><button onClick={() => onNavigate('pricing')} className="hover:text-orange-400 transition-colors">Pricing</button></li>
                                <li><button onClick={() => onNavigate('faq')} className="hover:text-orange-400 transition-colors">FAQ</button></li>
                                <li><button onClick={() => onNavigate('docs')} className="hover:text-orange-400 transition-colors">Documentation</button></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-bold text-white mb-4">Company</h4>
                            <ul className="space-y-2 text-sm text-gray-400">
                                <li><button onClick={() => onNavigate('about')} className="hover:text-orange-400 transition-colors">About</button></li>
                                <li><button onClick={() => onNavigate('blog')} className="hover:text-orange-400 transition-colors">Blog</button></li>
                                <li><button onClick={() => onNavigate('careers')} className="hover:text-orange-400 transition-colors">Careers</button></li>
                                <li><button onClick={() => onNavigate('contact')} className="hover:text-orange-400 transition-colors">Contact</button></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-bold text-white mb-4">Legal</h4>
                            <ul className="space-y-2 text-sm text-gray-400">
                                <li><button onClick={() => onNavigate('privacy')} className="hover:text-orange-400 transition-colors">Privacy Policy</button></li>
                                <li><button onClick={() => onNavigate('terms')} className="hover:text-orange-400 transition-colors">Terms of Service</button></li>
                            </ul>
                        </div>
                    </div>

                    <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
                        <p className="text-sm text-gray-500">
                            © 2026 GuideSoft Inc. All rights reserved.
                        </p>
                        <div className="flex items-center gap-6 text-gray-500">
                            <a href="#" className="hover:text-white transition-colors"><Github size={20} /></a>
                            <a href="#" className="hover:text-white transition-colors"><Twitter size={20} /></a>
                            <a href="#" className="hover:text-white transition-colors"><Linkedin size={20} /></a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};
