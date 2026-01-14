import React from 'react';
import { LayoutDashboard, Users, Settings, LogOut, Code, Bell } from 'lucide-react';

interface AdminLayoutProps {
    children: React.ReactNode;
    currentPage: 'overview' | 'users' | 'vendors' | 'settings';
    onNavigate: (page: 'overview' | 'users' | 'vendors' | 'settings') => void;
    onLogout: () => void;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
    children,
    currentPage,
    onNavigate,
    onLogout
}) => {
    const navItems = [
        { id: 'overview', label: 'Overview', icon: <LayoutDashboard size={20} /> },
        { id: 'users', label: 'User Management', icon: <Users size={20} /> },
        { id: 'vendors', label: 'Vendor & AI', icon: <Code size={20} /> },
        { id: 'settings', label: 'Settings', icon: <Settings size={20} /> },
    ] as const;

    return (
        <div className="flex h-screen bg-[#050505] text-white font-sans selection:bg-orange-500/30">
            {/* Sidebar */}
            <aside className="w-64 border-r border-white/5 bg-[#0a0a0a] flex flex-col">
                <div className="p-6 border-b border-white/5 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center shadow-lg shadow-red-500/20">
                        <Code size={18} className="text-white" />
                    </div>
                    <div>
                        <h1 className="font-bold text-lg tracking-tight">GuideSoft</h1>
                        <span className="text-xs text-red-400 font-mono">ADMIN CONSOLE</span>
                    </div>
                </div>

                <nav className="flex-1 p-4 space-y-1">
                    {navItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => onNavigate(item.id)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${currentPage === item.id
                                ? 'bg-red-600/10 text-red-400 border border-red-600/20'
                                : 'text-gray-400 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            {item.icon}
                            {item.label}
                        </button>
                    ))}
                </nav>

                <div className="p-4 border-t border-white/5">
                    <button
                        onClick={onLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                    >
                        <LogOut size={20} />
                        Exit Admin
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Header */}
                <header className="h-16 border-b border-white/5 bg-[#0a0a0a]/50 backdrop-blur-sm flex items-center justify-between px-8">
                    <h2 className="text-lg font-semibold capitalize">{currentPage.replace('-', ' ')}</h2>

                    <div className="flex items-center gap-6">
                        <button className="relative text-gray-400 hover:text-white transition-colors">
                            <Bell size={20} />
                            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full" />
                        </button>
                        <div className="flex items-center gap-3 pl-6 border-l border-white/5">
                            <div className="text-right hidden sm:block">
                                <div className="text-sm font-medium text-white">Admin User</div>
                                <div className="text-xs text-gray-500">Super Admin</div>
                            </div>
                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gray-700 to-gray-600 border border-white/10" />
                        </div>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-8">
                    <div className="max-w-6xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
};
