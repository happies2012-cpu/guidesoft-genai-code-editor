import React, { useState } from 'react';
import { Save, RefreshCw, CheckCircle, AlertTriangle, Key } from 'lucide-react';

interface Vendor {
    id: 'openai' | 'anthropic' | 'mistral' | 'ollama';
    name: string;
    status: 'connected' | 'error' | 'not_configured';
    models: string[];
    apiKey?: string;
}

const INITIAL_VENDORS: Vendor[] = [
    { id: 'openai', name: 'OpenAI', status: 'connected', models: ['gpt-4o', 'gpt-3.5-turbo'], apiKey: 'sk-proj-....................' },
    { id: 'anthropic', name: 'Anthropic', status: 'not_configured', models: ['claude-3-opus', 'claude-3-sonnet'] },
    { id: 'mistral', name: 'Mistral AI', status: 'not_configured', models: ['mistral-large', 'mistral-medium'] },
    { id: 'ollama', name: 'Ollama (Local)', status: 'connected', models: ['llama3', 'codellama'] },
];

export const VendorManagement: React.FC = () => {
    const [vendors, setVendors] = useState(INITIAL_VENDORS);

    const handleSave = (id: string) => {
        // Simulate save
        const newVendors = vendors.map(v =>
            v.id === id ? { ...v, status: 'connected' as const } : v
        );
        setVendors(newVendors);
    };

    return (
        <div className="space-y-8">
            <div className="bg-[#0a0a0a] border border-white/5 rounded-xl p-6">
                <h3 className="text-xl font-bold mb-4">AI Service Providers</h3>
                <p className="text-gray-400 mb-8 max-w-2xl">
                    Configure the generative AI models available to your users. API keys set here act as the system default.
                    Users can override these with their own keys in the editor settings.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {vendors.map((vendor) => (
                        <div key={vendor.id} className="border border-white/5 rounded-xl p-6 bg-black/20 hover:border-white/10 transition-colors">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center font-bold text-lg">
                                        {vendor.name.charAt(0)}
                                    </div>
                                    <div>
                                        <h4 className="font-bold">{vendor.name}</h4>
                                        <div className="flex items-center gap-1.5 mt-1">
                                            {vendor.status === 'connected' ? (
                                                <span className="text-green-400 text-xs flex items-center gap-1"><CheckCircle size={10} /> Active</span>
                                            ) : vendor.status === 'error' ? (
                                                <span className="text-red-400 text-xs flex items-center gap-1"><AlertTriangle size={10} /> Error</span>
                                            ) : (
                                                <span className="text-gray-500 text-xs text-xs flex items-center gap-1">Not Configured</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" className="sr-only peer" checked={vendor.status === 'connected'} readOnly />
                                    <div className="w-9 h-5 bg-gray-700 peer-focus:outline-none ring-0 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-green-500"></div>
                                </label>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-medium text-gray-400 mb-1.5">System API Key</label>
                                    <div className="relative">
                                        <Key className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" size={14} />
                                        <input
                                            type="password"
                                            value={vendor.apiKey || ''}
                                            placeholder="sk-..."
                                            className="w-full bg-black/40 border border-white/10 rounded-lg pl-9 pr-3 py-2 text-sm text-gray-300 focus:outline-none focus:border-white/20 transition-colors placeholder:text-gray-700"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-400 mb-1.5">Available Models</label>
                                    <div className="flex flex-wrap gap-2">
                                        {vendor.models.map(m => (
                                            <span key={m} className="px-2 py-1 bg-white/5 rounded text-xs text-gray-400 border border-white/5">
                                                {m}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <div className="pt-2">
                                    <button
                                        onClick={() => handleSave(vendor.id)}
                                        className="w-full py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                                    >
                                        <Save size={14} /> Save Configuration
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex justify-end">
                <button className="flex items-center gap-2 px-6 py-3 bg-white text-black rounded-lg font-bold hover:bg-gray-200 transition-colors shadow-lg shadow-white/5">
                    <RefreshCw size={18} />
                    Sync Providers
                </button>
            </div>
        </div>
    );
};
