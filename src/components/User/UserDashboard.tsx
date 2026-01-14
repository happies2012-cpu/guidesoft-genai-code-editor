import React, { useState } from 'react';
import { Shield, Key, Cpu, Zap, LogOut } from 'lucide-react';

export const UserDashboard: React.FC<{ onLogout: () => void }> = ({ onLogout }) => {
    const [activeTab, setActiveTab] = useState<'overview' | 'security' | 'ai'>('overview');

    return (
        <div className="flex h-screen bg-[#050505] text-white font-sans">
            {/* Sidebar */}
            <div className="w-64 border-r border-white/10 p-6 flex flex-col">
                <h2 className="text-xl font-bold mb-8 text-blue-400">User Hub</h2>
                <nav className="space-y-2 flex-1">
                    <button
                        onClick={() => setActiveTab('overview')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'overview' ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white'}`}
                    >
                        <Zap size={20} /> Overview
                    </button>
                    <button
                        onClick={() => setActiveTab('security')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'security' ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white'}`}
                    >
                        <Shield size={20} /> Security
                    </button>
                    <button
                        onClick={() => setActiveTab('ai')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'ai' ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white'}`}
                    >
                        <Cpu size={20} /> AI Cursor
                    </button>
                </nav>
                <button onClick={onLogout} className="flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-white/5 rounded-lg transition-colors mt-auto">
                    <LogOut size={20} /> Sign Out
                </button>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-8 overflow-y-auto">
                {activeTab === 'overview' && (
                    <div className="animate-fade-in">
                        <h2 className="text-3xl font-bold mb-6">Welcome back, Developer</h2>
                        <div className="grid grid-cols-3 gap-6 mb-8">
                            <div className="bg-white/5 p-6 rounded-xl border border-white/10">
                                <div className="text-gray-400 mb-2">AI Credits</div>
                                <div className="text-3xl font-bold text-green-400">4,200</div>
                            </div>
                            <div className="bg-white/5 p-6 rounded-xl border border-white/10">
                                <div className="text-gray-400 mb-2">Projects</div>
                                <div className="text-3xl font-bold">12</div>
                            </div>
                            <div className="bg-white/5 p-6 rounded-xl border border-white/10">
                                <div className="text-gray-400 mb-2">Plan</div>
                                <div className="text-3xl font-bold text-purple-400">Pro</div>
                            </div>
                        </div>
                        <h3 className="text-xl font-bold mb-4">Recent Activity</h3>
                        <div className="bg-white/5 rounded-xl border border-white/10 divide-y divide-white/10">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="p-4 flex items-center justify-between hover:bg-white/5 transition-colors">
                                    <div>
                                        <div className="font-medium">Project Alpha</div>
                                        <div className="text-xs text-gray-500">Edited 2 hours ago</div>
                                    </div>
                                    <button className="text-sm text-blue-400 hover:underline">Open Editor</button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'security' && (
                    <div className="max-w-2xl animate-fade-in">
                        <h2 className="text-3xl font-bold mb-6">Security Settings</h2>

                        <div className="bg-white/5 rounded-xl border border-white/10 p-6 mb-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <Shield className="text-green-400" />
                                    <div>
                                        <div className="font-bold">Two-Factor Authentication</div>
                                        <div className="text-sm text-gray-400">Secure your account with 2FA</div>
                                    </div>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" className="sr-only peer" />
                                    <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                                </label>
                            </div>
                        </div>

                        <div className="bg-white/5 rounded-xl border border-white/10 p-6">
                            <h3 className="font-bold mb-4 flex items-center gap-2"><Key size={18} /> Change Password</h3>
                            <div className="space-y-4">
                                <input type="password" placeholder="Current Password" className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3" />
                                <input type="password" placeholder="New Password" className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3" />
                                <button className="px-6 py-2 bg-blue-600 rounded-lg font-bold hover:bg-blue-700">Update Password</button>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'ai' && (
                    <div className="max-w-2xl animate-fade-in">
                        <h2 className="text-3xl font-bold mb-6">AI Cursor Settings</h2>
                        <div className="bg-white/5 rounded-xl border border-white/10 p-6">
                            <h3 className="font-bold mb-4">Model Configuration</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Autocomplete Model</label>
                                    <select className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3">
                                        <option>Claude 3.5 Sonnet (Recommended)</option>
                                        <option>GPT-4o</option>
                                        <option>Llama 3 70B</option>
                                    </select>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span>Inline AI Suggestions</span>
                                    <input type="checkbox" defaultChecked className="toggle" />
                                </div>
                                <div className="flex items-center justify-between">
                                    <span>Auto-Debug on Error</span>
                                    <input type="checkbox" defaultChecked className="toggle" />
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
