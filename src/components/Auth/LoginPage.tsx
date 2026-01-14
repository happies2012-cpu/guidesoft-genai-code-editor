import React, { useState } from 'react';
import { authService } from '../../services/enterprise/AuthService';
import { currentUserService } from '../../services/access/AccessControl';

export const LoginPage: React.FC<{ onLogin: () => void }> = ({ onLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        await new Promise(r => setTimeout(r, 1000));
        const result = await authService.loginWithProvider('google'); // Mock
        if (result.success && email && password) {
            // Set user access (grants Super Admin to pranu21m@gmail.com)
            currentUserService.setUser(email);
            onLogin();
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen flex bg-black text-white">
            {/* Left Panel: Branding */}
            <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-blue-900 via-black to-purple-900 relative overflow-hidden items-center justify-center p-12">
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
                <div className="relative z-10 max-w-lg">
                    <h1 className="text-6xl font-bold mb-6 leading-tight">
                        Code with <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-green-400">Superpowers</span>
                    </h1>
                    <p className="text-xl text-gray-300 mb-8">
                        The only IDE that writes, debugs, and deploys full-stack apps for you.
                        Secure, Enterprise-Ready, and Autonomous.
                    </p>
                    <div className="flex gap-4">
                        <div className="px-4 py-2 bg-white/10 rounded-lg backdrop-blur text-sm">🛡️ SOC2 Compliant</div>
                        <div className="px-4 py-2 bg-white/10 rounded-lg backdrop-blur text-sm">⚡ 10x Faster</div>
                    </div>
                </div>
            </div>

            {/* Right Panel: Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-[#050505]">
                <div className="max-w-md w-full">
                    <h2 className="text-3xl font-bold mb-2">Welcome Back</h2>
                    <p className="text-gray-400 mb-8">Enter your credentials to access the workspace.</p>

                    <form onSubmit={handleLogin} className="space-y-5">
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus:border-blue-500 focus:outline-none transition-colors"
                                placeholder="developer@example.com"
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus:border-blue-500 focus:outline-none transition-colors"
                                placeholder="••••••••"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-transform active:scale-95 flex items-center justify-center shadow-lg shadow-blue-900/20"
                        >
                            {loading ? 'Authenticating...' : 'Sign In'}
                        </button>
                    </form>

                    <div className="mt-8 pt-8 border-t border-white/10">
                        <p className="text-center text-gray-500 text-sm mb-4">Or continue with enterprise SSO</p>
                        <div className="grid grid-cols-2 gap-4">
                            <button className="py-3 px-4 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 flex items-center justify-center gap-2 transition-colors">
                                <span className="font-bold">Google</span>
                            </button>
                            <button className="py-3 px-4 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 flex items-center justify-center gap-2 transition-colors">
                                <span className="font-bold">GitHub</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
