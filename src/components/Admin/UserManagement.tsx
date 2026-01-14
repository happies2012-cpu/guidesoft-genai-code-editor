import React, { useState } from 'react';
import { Search, Shield, Ban, Trash2, Mail } from 'lucide-react';

interface User {
    id: string;
    name: string;
    email: string;
    role: 'admin' | 'user' | 'pro';
    status: 'active' | 'inactive' | 'banned';
    joinDate: string;
}

const MOCK_USERS: User[] = [
    { id: '1', name: 'Leanne Graham', email: 'sincere@april.biz', role: 'admin', status: 'active', joinDate: '2025-12-01' },
    { id: '2', name: 'Ervin Howell', email: 'shanna@melissa.tv', role: 'pro', status: 'active', joinDate: '2025-12-05' },
    { id: '3', name: 'Clementine Bauch', email: 'nathan@yesenia.net', role: 'user', status: 'inactive', joinDate: '2026-01-02' },
    { id: '4', name: 'Patricia Lebsack', email: 'julianne.oconner@kory.org', role: 'user', status: 'active', joinDate: '2026-01-10' },
    { id: '5', name: 'Chelsey Dietrich', email: 'lucio_het@Annie.ca', role: 'pro', status: 'banned', joinDate: '2025-11-20' },
];

export const UserManagement: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [users, setUsers] = useState(MOCK_USERS);

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleDelete = (id: string) => {
        if (confirm('Are you sure you want to delete this user?')) {
            setUsers(users.filter(u => u.id !== id));
        }
    };

    return (
        <div className="bg-[#0a0a0a] border border-white/5 rounded-xl overflow-hidden">
            {/* Toolbar */}
            <div className="p-6 border-b border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="relative w-full sm:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                    <input
                        type="text"
                        placeholder="Search users..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-black/20 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm text-gray-200 focus:outline-none focus:border-red-500/50 transition-colors"
                    />
                </div>
                <div className="flex gap-2">
                    <button className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm font-medium transition-colors">
                        Export CSV
                    </button>
                    <button className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors shadow-lg shadow-red-500/20">
                        Add User
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-gray-400">
                    <thead className="bg-white/5 text-gray-200 font-medium uppercase text-xs tracking-wider">
                        <tr>
                            <th className="px-6 py-4">User</th>
                            <th className="px-6 py-4">Role</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4">Joined</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {filteredUsers.map((user) => (
                            <tr key={user.id} className="hover:bg-white/5 transition-colors group">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-700 to-gray-600 border border-white/10 flex items-center justify-center text-xs font-bold text-white">
                                            {user.name.charAt(0)}
                                        </div>
                                        <div>
                                            <div className="font-medium text-white">{user.name}</div>
                                            <div className="text-xs text-gray-500">{user.email}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium border ${user.role === 'admin' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' :
                                        user.role === 'pro' ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' :
                                            'bg-gray-500/10 text-gray-400 border-gray-500/20'
                                        }`}>
                                        {user.role === 'admin' && <Shield size={10} />}
                                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium ${user.status === 'active' ? 'text-green-400' :
                                        user.status === 'banned' ? 'text-red-400' :
                                            'text-yellow-400'
                                        }`}>
                                        <span className={`w-1.5 h-1.5 rounded-full ${user.status === 'active' ? 'bg-green-400' :
                                            user.status === 'banned' ? 'bg-red-400' :
                                                'bg-yellow-400'
                                            }`} />
                                        {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                                    </span>
                                </td>
                                <td className="px-6 py-4 tabular-nums">
                                    {user.joinDate}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors" title="Email">
                                            <Mail size={16} />
                                        </button>
                                        <button className="p-2 hover:bg-red-500/10 rounded-lg text-gray-400 hover:text-red-400 transition-colors" title="Ban User">
                                            <Ban size={16} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(user.id)}
                                            className="p-2 hover:bg-red-500/10 rounded-lg text-gray-400 hover:text-red-400 transition-colors"
                                            title="Delete User"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination Mock */}
            <div className="p-4 border-t border-white/5 flex items-center justify-between text-xs text-gray-500">
                <span>Showing {filteredUsers.length} of {users.length} users</span>
                <div className="flex gap-2">
                    <button className="px-3 py-1 hover:bg-white/5 rounded border border-transparent hover:border-white/10 transition-colors disabled:opacity-50" disabled>Previous</button>
                    <button className="px-3 py-1 hover:bg-white/5 rounded border border-transparent hover:border-white/10 transition-colors">Next</button>
                </div>
            </div>
        </div>
    );
};
