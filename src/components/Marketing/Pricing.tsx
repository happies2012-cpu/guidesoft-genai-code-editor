import React from 'react';

export const Pricing: React.FC = () => (
    <div className="py-20 bg-black text-white">
        <h2 className="text-4xl font-bold text-center mb-12">Enterprise-Grade Pricing</h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto px-4">
            {['Starter', 'Pro', 'Enterprise'].map(tier => (
                <div key={tier} className="p-8 rounded-2xl border border-white/10 bg-white/5 hover:border-blue-500/50 transition-colors">
                    <h3 className="text-2xl font-bold mb-4">{tier}</h3>
                    <p className="text-gray-400 mb-6">Perfect for {tier.toLowerCase()} users.</p>
                    <div className="flex flex-col gap-3">
                        <button className="w-full py-3 bg-blue-600 rounded-lg hover:bg-blue-700 font-bold flex items-center justify-center gap-2">
                            <span>📱</span> Pay with UPI / GPay
                        </button>
                        <button className="w-full py-3 bg-white/10 rounded-lg hover:bg-white/20 font-bold flex items-center justify-center gap-2">
                            <span>🔳</span> Scan QR Code
                        </button>
                    </div>
                </div>
            ))}
        </div>
    </div>
);
