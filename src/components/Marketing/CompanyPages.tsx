import React from 'react';
import { Mail, MapPin, Phone } from 'lucide-react';

export const AboutPage: React.FC = () => (
    <div className="max-w-4xl mx-auto px-6 py-20">
        <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">About GuideSoft</h1>
        <div className="prose prose-invert prose-lg">
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                GuideSoft is on a mission to democratize software engineering. We believe that with the right AI tools, anyone can become a 10x developer.
            </p>
            <p className="text-gray-400 mb-6">
                Founded in 2026, we've built the world's first truly autonomous coding environment. Our platform doesn't just autocomplete your code; it understands your intent, anticipates your needs, and helps you architect robust solutions.
            </p>
            <div className="grid md:grid-cols-3 gap-8 my-12">
                {[
                    { stat: '10M+', label: 'Lines of Code' },
                    { stat: '50k+', label: 'Developers' },
                    { stat: '99.9%', label: 'Uptime' }
                ].map((s, i) => (
                    <div key={i} className="text-center p-6 bg-white/5 rounded-2xl border border-white/10">
                        <div className="text-3xl font-bold text-white mb-2">{s.stat}</div>
                        <div className="text-sm text-gray-400">{s.label}</div>
                    </div>
                ))}
            </div>
        </div>
    </div>
);

export const CareersPage: React.FC = () => (
    <div className="max-w-4xl mx-auto px-6 py-20">
        <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-green-400 to-cyan-500 bg-clip-text text-transparent">Join Our Team</h1>
        <p className="text-xl text-gray-400 mb-12">Help us build the future of software development.</p>

        <div className="space-y-6">
            {[
                { role: 'Senior AI Engineer', dept: 'Engineering', loc: 'Remote', type: 'Full-time' },
                { role: 'Product Designer', dept: 'Design', loc: 'San Francisco', type: 'Full-time' },
                { role: 'Developer Advocate', dept: 'Marketing', loc: 'Remote', type: 'Full-time' }
            ].map((job, i) => (
                <div key={i} className="flex flex-col md:flex-row md:items-center justify-between p-6 bg-white/5 rounded-xl border border-white/10 hover:border-white/20 transition-colors group cursor-pointer">
                    <div>
                        <h3 className="text-xl font-semibold text-white group-hover:text-blue-400 transition-colors">{job.role}</h3>
                        <div className="flex gap-4 mt-2 text-sm text-gray-400">
                            <span>{job.dept}</span>
                            <span>•</span>
                            <span>{job.loc}</span>
                        </div>
                    </div>
                    <span className="mt-4 md:mt-0 px-4 py-1 rounded-full bg-white/10 text-xs font-medium text-gray-300">
                        {job.type}
                    </span>
                </div>
            ))}
        </div>
    </div>
);

export const ContactPage: React.FC = () => (
    <div className="max-w-4xl mx-auto px-6 py-20">
        <div className="grid md:grid-cols-2 gap-12">
            <div>
                <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">Get in Touch</h1>
                <p className="text-gray-400 mb-8">
                    Have questions about our enterprise plans or need technical support? We're here to help.
                </p>
                <div className="space-y-6">
                    <div className="flex items-center gap-4 text-gray-300">
                        <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center">
                            <Mail size={20} className="text-blue-400" />
                        </div>
                        <div>
                            <div className="text-sm text-gray-500">Email</div>
                            <div>support@guidesoft.ai</div>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 text-gray-300">
                        <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center">
                            <MapPin size={20} className="text-green-400" />
                        </div>
                        <div>
                            <div className="text-sm text-gray-500">Office</div>
                            <div>1 Market St, San Francisco, CA</div>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 text-gray-300">
                        <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center">
                            <Phone size={20} className="text-purple-400" />
                        </div>
                        <div>
                            <div className="text-sm text-gray-500">Phone</div>
                            <div>+1 (555) 123-4567</div>
                        </div>
                    </div>
                </div>
            </div>
            <form className="bg-white/5 p-8 rounded-2xl border border-white/10 space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Name</label>
                    <input type="text" className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500 transition-colors" placeholder="John Doe" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Email</label>
                    <input type="email" className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500 transition-colors" placeholder="john@company.com" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Message</label>
                    <textarea rows={4} className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500 transition-colors" placeholder="How can we help?" />
                </div>
                <button type="button" className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg transition-colors">
                    Send Message
                </button>
            </form>
        </div>
    </div>
);
