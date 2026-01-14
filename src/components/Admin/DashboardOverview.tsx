import React from 'react';
import { Users, DollarSign, Activity, TrendingUp, Clock, FileCode } from 'lucide-react';

export const DashboardOverview: React.FC = () => {
    return (
        <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: 'Total Users', value: '12,345', sub: '+12% this month', icon: <Users size={24} />, color: 'text-blue-500' },
                    { label: 'Monthly Revenue', value: '$45,230', sub: '+8% vs last month', icon: <DollarSign size={24} />, color: 'text-green-500' },
                    { label: 'Active Sessions', value: '1,203', sub: 'Currently online', icon: <Activity size={24} />, color: 'text-orange-500' },
                    { label: 'Churn Rate', value: '2.1%', sub: '-0.5% improvement', icon: <TrendingUp size={24} />, color: 'text-purple-500' },
                ].map((stat, idx) => (
                    <div key={idx} className="bg-[#0a0a0a] border border-white/5 rounded-xl p-6 hover:border-white/10 transition-colors">
                        <div className="flex justify-between items-start mb-4">
                            <div className={`p-3 rounded-lg bg-white/5 ${stat.color}`}>
                                {stat.icon}
                            </div>
                            <span className={`text-xs font-medium px-2 py-1 rounded-full ${stat.sub.includes('+') ? 'bg-green-500/10 text-green-500' : stat.sub.includes('-') ? 'bg-blue-500/10 text-blue-500' : 'bg-orange-500/10 text-orange-500'}`}>
                                {stat.sub}
                            </span>
                        </div>
                        <h3 className="text-3xl font-bold mb-1">{stat.value}</h3>
                        <p className="text-gray-400 text-sm">{stat.label}</p>
                    </div>
                ))}
            </div>

            {/* Charts & Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Chart Area */}
                <div className="lg:col-span-2 bg-[#0a0a0a] border border-white/5 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-lg font-bold">Revenue Growth</h3>
                        <select className="bg-black/20 border border-white/10 rounded-lg px-3 py-1 text-sm text-gray-400">
                            <option>Last 30 Days</option>
                            <option>Last Quarter</option>
                            <option>Last Year</option>
                        </select>
                    </div>

                    {/* Placeholder Chart Visualization */}
                    <div className="h-64 flex items-end justify-between px-4 gap-2">
                        {[40, 65, 45, 80, 55, 70, 90, 60, 75, 85, 95, 100].map((h, i) => (
                            <div key={i} className="w-full bg-gradient-to-t from-red-900/20 to-red-600/50 rounded-t-sm hover:from-red-900/40 hover:to-red-500/80 transition-all relative group" style={{ height: `${h}%` }}>
                                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white text-black text-xs font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                    ${h}k
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between mt-4 text-xs text-gray-500 px-2">
                        <span>Jan 1</span>
                        <span>Jan 8</span>
                        <span>Jan 15</span>
                        <span>Jan 22</span>
                    </div>
                </div>

                {/* Activity Feed */}
                <div className="bg-[#0a0a0a] border border-white/5 rounded-xl p-6">
                    <h3 className="text-lg font-bold mb-6">Recent Activity</h3>
                    <div className="space-y-6">
                        {[
                            { user: 'Sarah Connor', action: 'upgraded to Pro', time: '2m ago', icon: <DollarSign size={14} /> },
                            { user: 'John Doe', action: 'deployed Project X', time: '15m ago', icon: <Clock size={14} /> },
                            { user: 'Alex Smith', action: 'invited 3 team members', time: '1h ago', icon: <Users size={14} /> },
                            { user: 'System', action: 'Backup completed', time: '4h ago', icon: <FileCode size={14} /> },
                            { user: 'Jane Doe', action: 'reported a bug', time: '5h ago', icon: <Activity size={14} /> },
                        ].map((activity, idx) => (
                            <div key={idx} className="flex items-start gap-3">
                                <div className="mt-1 w-2 h-2 rounded-full bg-red-500" />
                                <div>
                                    <p className="text-sm text-gray-300">
                                        <span className="font-semibold text-white">{activity.user}</span> {activity.action}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button className="w-full mt-6 py-2 text-sm text-gray-400 hover:text-white border border-white/5 hover:border-white/10 rounded-lg transition-colors">
                        View All Activity
                    </button>
                </div>
            </div>
        </div>
    );
};
