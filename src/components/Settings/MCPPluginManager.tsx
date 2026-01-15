import React, { useState, useEffect } from 'react';
import { Download, Trash2, Settings as SettingsIcon, Check } from 'lucide-react';
import { mcpService, type MCPPlugin } from '../../services/mcp/MCPPluginService';

export const MCPPluginManager: React.FC = () => {
    const [availablePlugins, setAvailablePlugins] = useState<MCPPlugin[]>([]);
    const [installedPlugins, setInstalledPlugins] = useState<MCPPlugin[]>([]);
    const [loading, setLoading] = useState(true);

    const loadPlugins = async () => {
        const available = await mcpService.getAvailablePlugins();
        const installed = mcpService.getInstalledPlugins();
        setAvailablePlugins(available);
        setInstalledPlugins(installed);
        setLoading(false);
    };

    useEffect(() => {
        setTimeout(loadPlugins, 0);
    }, []);

    const handleInstall = (pluginId: string) => {
        if (mcpService.installPlugin(pluginId)) {
            setLoading(true);
            loadPlugins();
        }
    };

    const handleUninstall = (pluginId: string) => {
        if (mcpService.uninstallPlugin(pluginId)) {
            setLoading(true);
            loadPlugins();
        }
    };

    const isInstalled = (pluginId: string) => {
        return installedPlugins.some(p => p.id === pluginId);
    };

    if (loading) {
        return <div className="p-8 text-center text-gray-400">Loading plugins...</div>;
    }

    return (
        <div className="p-6">
            <div className="mb-8">
                <h2 className="text-2xl font-bold mb-2">MCP Plugins</h2>
                <p className="text-gray-400">Extend your AI with Model Context Protocol plugins</p>
            </div>

            <div className="grid gap-4">
                {availablePlugins.map(plugin => {
                    const installed = isInstalled(plugin.id);
                    return (
                        <div
                            key={plugin.id}
                            className="bg-white/5 border border-white/10 rounded-xl p-6 hover:border-white/20 transition-colors"
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h3 className="text-lg font-bold">{plugin.name}</h3>
                                        {plugin.isFree && (
                                            <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full border border-green-500/30">
                                                FREE
                                            </span>
                                        )}
                                        {installed && (
                                            <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-full border border-blue-500/30 flex items-center gap-1">
                                                <Check size={12} /> Installed
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-gray-400 text-sm mb-3">{plugin.description}</p>
                                    <div className="flex items-center gap-4 text-xs text-gray-500">
                                        <span>v{plugin.version}</span>
                                        <span>•</span>
                                        <span>{plugin.author}</span>
                                        <span>•</span>
                                        <span className="capitalize">{plugin.category}</span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 ml-4">
                                    {installed ? (
                                        <>
                                            <button
                                                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                                                title="Configure"
                                            >
                                                <SettingsIcon size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleUninstall(plugin.id)}
                                                className="p-2 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors"
                                                title="Uninstall"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </>
                                    ) : (
                                        <button
                                            onClick={() => handleInstall(plugin.id)}
                                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-bold flex items-center gap-2 transition-colors"
                                        >
                                            <Download size={16} />
                                            Install
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
