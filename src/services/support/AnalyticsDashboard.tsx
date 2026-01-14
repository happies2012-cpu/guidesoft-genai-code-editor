import React from 'react';

export const AnalyticsDashboard: React.FC = () => (
    <div className="p-8">
        <div className="grid grid-cols-4 gap-6 mb-8">
            {['Total Views', 'Active Users', ' Bounce Rate', 'Avg. Session'].map(metric => (
                <div key={metric} className="bg-white/5 border border-white/10 p-6 rounded-xl">
                    <div className="text-gray-400 text-sm">{metric}</div>
                    <div className="text-2xl font-bold mt-2">1,234</div>
                </div>
            ))}
        </div>
    </div>
);
