import React, { useState } from 'react';
import { authService } from '../../services/enterprise/AuthService';
import { currentUserService } from '../../services/access/AccessControl';

export const SignupPage: React.FC<{ onSignup: () => void; onSwitchToLogin: () => void }> = ({ onSignup, onSwitchToLogin }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (password.length < 8) {
            setError('Password must be at least 8 characters');
            return;
        }

        setLoading(true);
        await new Promise(r => setTimeout(r, 1000));

        // Mock signup - in production, this would call a real API
        const result = await authService.loginWithProvider('google');
        if (result.success && email && password && name) {
            currentUserService.setUser(email);
            onSignup();
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen flex bg-black text-white">
            {/* Left Panel: Branding */}
            <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-purple-900 via-black to-blue-900 relative overflow-hidden items-center justify-center p-12">
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
                <div className="relative z-10 max-w-lg">
                    <h1 className="text-6xl font-bold mb-6 leading-tight">
                        Join the <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">AI Revolution</span>
                    </h1>
                    <p className="text-xl text-gray-300 mb-8">
                        Build faster with AI-powered code generation. Join thousands of developers already using GuideSoft.
                    </p>
                    <div className="flex gap-4">
                        <div className="px-4 py-2 bg-white/10 rounded-lg backdrop-blur text-sm">🚀 10x Productivity</div>
                        <div className="px-4 py-2 bg-white/10 rounded-lg backdrop-blur text-sm">✨ AI-Powered</div>
                    </div>
                </div>
            </div>

            {/* Right Panel: Signup Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-[#050505]">
                <div className="max-w-md w-full">
                    <h2 className="text-3xl font-bold mb-2">Create Account</h2>
                    <p className="text-gray-400 mb-8">Start building with AI today</p>

                    {error && (
                        <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSignup} className="space-y-5">
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Full Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={e => setName(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus:border-purple-500 focus:outline-none transition-colors"
                                placeholder="John Doe"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus:border-purple-500 focus:outline-none transition-colors"
                                placeholder="developer@example.com"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus:border-purple-500 focus:outline-none transition-colors"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Confirm Password</label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={e => setConfirmPassword(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus:border-purple-500 focus:outline-none transition-colors"
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-3 rounded-lg transition-transform active:scale-95 flex items-center justify-center shadow-lg shadow-purple-900/20"
                        >
                            {loading ? 'Creating Account...' : 'Sign Up'}
                        </button>
                    </form>

                    <div className="mt-8 pt-8 border-t border-white/10">
                        <p className="text-center text-gray-500 text-sm mb-4">Or sign up with</p>
                        <div className="grid grid-cols-2 gap-4">
                            <button className="py-3 px-4 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 flex items-center justify-center gap-2 transition-colors">
                                <span className="font-bold">Google</span>
                            </button>
                            <button className="py-3 px-4 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 flex items-center justify-center gap-2 transition-colors">
                                <span className="font-bold">GitHub</span>
                            </button>
                        </div>
                    </div>

                    <p className="text-center text-sm text-gray-500 mt-6">
                        Already have an account?{' '}
                        <button onClick={onSwitchToLogin} className="text-purple-400 hover:text-purple-300 font-semibold">
                            Sign In
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};
