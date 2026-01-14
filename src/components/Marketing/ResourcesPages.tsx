import React from 'react';
import { Book, FileText, Code2, Terminal, Cpu } from 'lucide-react';

export const DocumentationPage: React.FC = () => (
    <div className="max-w-6xl mx-auto px-6 py-20">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">Documentation</h1>
        <p className="text-xl text-gray-400 mb-12">Everything you need to build with GuideSoft.</p>

        <div className="grid md:grid-cols-3 gap-6">
            {[
                { icon: Book, title: 'Getting Started', desc: 'Installation, setup, and first steps.' },
                { icon: Code2, title: 'API Reference', desc: 'Detailed API endpoints and usage examples.' },
                { icon: Terminal, title: 'CLI Tools', desc: 'Command line interface documentation.' },
                { icon: Cpu, title: 'AI Models', desc: 'Configuration guide for LLMs.' },
                { icon: FileText, title: 'Tutorials', desc: 'Step-by-step guides for common tasks.' },
            ].map((item, i) => (
                <div key={i} className="p-6 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors cursor-pointer group">
                    <item.icon className="w-8 h-8 text-blue-400 mb-4 group-hover:scale-110 transition-transform" />
                    <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
                    <p className="text-sm text-gray-400">{item.desc}</p>
                </div>
            ))}
        </div>
    </div>
);

export const BlogPage: React.FC = () => (
    <div className="max-w-4xl mx-auto px-6 py-20">
        <h1 className="text-4xl font-bold mb-12 bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">Engineering Blog</h1>

        <div className="space-y-12">
            {[
                {
                    title: 'How we built the fastest AI code editor',
                    date: 'Jan 15, 2026',
                    excerpt: 'A deep dive into the architecture behind GuideSoft\'s sub-millisecond latency.',
                    tag: 'Engineering'
                },
                {
                    title: 'The future of autonomous coding',
                    date: 'Jan 10, 2026',
                    excerpt: 'Why agents are the next big leap in developer productivity.',
                    tag: 'Vision'
                },
                {
                    title: 'Scaling to 10 million users',
                    date: 'Jan 05, 2026',
                    excerpt: 'Lessons learned from scaling our Rust-based backend infrastructure.',
                    tag: 'Infrastructure'
                }
            ].map((post, i) => (
                <article key={i} className="border-b border-white/10 pb-12 last:border-0">
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                        <span>{post.date}</span>
                        <span className="w-1 h-1 rounded-full bg-gray-500" />
                        <span className="text-blue-400">{post.tag}</span>
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-3 hover:text-blue-400 cursor-pointer transition-colors">
                        {post.title}
                    </h2>
                    <p className="text-gray-400 leading-relaxed mb-4">
                        {post.excerpt}
                    </p>
                    <button className="text-blue-400 text-sm font-medium hover:text-blue-300">Read more →</button>
                </article>
            ))}
        </div>
    </div>
);
