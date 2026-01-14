import { useEffect, useState } from 'react';
import { usePluginStore } from '../../services/plugins/PluginService';
import type { PluginManifest } from '../../services/plugins/types';
import { Download, Check, Trash2, Palette, Search } from 'lucide-react';
import { motion } from 'framer-motion';

export const ThemeMarketplace = () => {
    const { getAvailablePlugins, installedPlugins, installPlugin, uninstallPlugin, enableTheme, activeThemeId } = usePluginStore();
    const [available, setAvailable] = useState<PluginManifest[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        getAvailablePlugins().then(plugins => {
            setAvailable(plugins);
            setLoading(false);
        });
    }, [getAvailablePlugins]);

    const filtered = available.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

    const isInstalled = (id: string) => installedPlugins.some(p => p.id === id);
    const isActive = (id: string) => activeThemeId === id;

    if (loading) return <div className="p-8 text-center text-gray-400">Loading Marketplace...</div>;

    return (
        <div className="h-full flex flex-col">
            <div className="flex items-center gap-4 mb-6 sticky top-0 bg-[#1e1e1e] z-10 py-2">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                    <input
                        type="text"
                        placeholder="Search themes..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full bg-black/20 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm text-gray-200 focus:outline-none focus:border-orange-500/50 transition-colors"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-4">
                {filtered.map(plugin => {
                    const installed = isInstalled(plugin.id);
                    const active = isActive(plugin.id);

                    return (
                        <motion.div
                            key={plugin.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`
                                relative group overflow-hidden rounded-xl border p-4 transition-all
                                ${active ? 'bg-orange-500/10 border-orange-500/50' : 'bg-white/5 border-white/5 hover:border-white/10'}
                            `}
                        >
                            <div className="flex justify-between items-start mb-3">
                                <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg">
                                    <Palette size={20} className="text-white" />
                                </div>
                                {active && (
                                    <span className="px-2 py-1 text-xs font-bold bg-orange-500 text-white rounded-full flex items-center gap-1">
                                        <Check size={12} /> Active
                                    </span>
                                )}
                            </div>

                            <h3 className="font-bold text-gray-100 mb-1">{plugin.name}</h3>
                            <p className="text-xs text-gray-400 mb-4 h-8 line-clamp-2">{plugin.description}</p>

                            <div className="flex items-center gap-2 mt-auto">
                                {!installed ? (
                                    <button
                                        onClick={() => installPlugin(plugin.id)}
                                        className="flex-1 flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white text-sm py-2 rounded-lg transition-colors"
                                    >
                                        <Download size={16} /> Install
                                    </button>
                                ) : (
                                    <>
                                        <button
                                            onClick={() => enableTheme(plugin.id)}
                                            disabled={active}
                                            className={`
                                                flex-1 flex items-center justify-center gap-2 text-sm py-2 rounded-lg transition-colors font-medium
                                                ${active
                                                    ? 'bg-transparent text-orange-400 cursor-default'
                                                    : 'bg-orange-600 hover:bg-orange-700 text-white'
                                                }
                                            `}
                                        >
                                            {active ? 'Applied' : 'Apply'}
                                        </button>
                                        <button
                                            onClick={() => uninstallPlugin(plugin.id)}
                                            className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                                            title="Uninstall"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </>
                                )}
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
};
