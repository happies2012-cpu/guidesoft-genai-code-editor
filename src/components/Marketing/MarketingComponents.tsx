import React from 'react';

export const Features: React.FC = () => (
    <div className="py-20 bg-[#0a0a0a] text-white">
        <h2 className="text-4xl font-bold text-center mb-16 bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">Power Features</h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto px-4">
            {[
                { title: 'AI Autocomplete', desc: 'Predictive ghost text that understands your entire codebase.' },
                { title: 'Visual Workflows', desc: 'Drag-and-drop builder for CI/CD and automation.' },
                { title: 'Cloud Deploy', desc: 'One-click push to Vercel, AWS, or Google Cloud.' },
                { title: 'Team Sync', desc: 'Real-time collaboration with cursor presence.' },
                { title: 'Security Shield', desc: 'WAF and dependency scanning built-in.' },
                { title: 'Mobile Builder', desc: 'Generate React Native apps from text prompts.' }
            ].map((f, i) => (
                <div key={i} className="p-6 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                    <h3 className="text-xl font-bold mb-2 text-blue-400">{f.title}</h3>
                    <p className="text-gray-400">{f.desc}</p>
                </div>
            ))}
        </div>
    </div>
);

export const Footer: React.FC = () => (
    <footer className="py-12 bg-black text-gray-500 border-t border-white/10">
        <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-4 gap-8 mb-8">
            <div>
                <h4 className="text-white font-bold mb-4">GuideSoft</h4>
                <p className="text-sm">The 10x Developer Platform.</p>
            </div>
            <div>
                <h4 className="text-white font-bold mb-4">Product</h4>
                <ul className="space-y-2 text-sm">
                    <li>Editor</li>
                    <li>Workflows</li>
                    <li>Pricing</li>
                </ul>
            </div>
            <div>
                <h4 className="text-white font-bold mb-4">Resources</h4>
                <ul className="space-y-2 text-sm">
                    <li>Documentation</li>
                    <li>Blog</li>
                    <li>Community</li>
                </ul>
            </div>
            <div>
                <h4 className="text-white font-bold mb-4">Legal</h4>
                <ul className="space-y-2 text-sm">
                    <li>Privacy Policy</li>
                    <li>Terms of Service</li>
                </ul>
            </div>
        </div>
        <div className="text-center text-xs">
            © 2026 GuideSoft AI. All rights reserved.
        </div>
    </footer>
);
