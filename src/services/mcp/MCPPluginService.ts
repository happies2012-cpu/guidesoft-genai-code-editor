// MCP (Model Context Protocol) Plugin Service
export interface MCPPlugin {
    id: string;
    name: string;
    description: string;
    version: string;
    author: string;
    category: 'context' | 'tool' | 'integration';
    isFree: boolean;
    config?: Record<string, unknown>;
}

const FREE_MCP_PLUGINS: MCPPlugin[] = [
    {
        id: 'filesystem-context',
        name: 'Filesystem Context',
        description: 'Provides file and directory context to AI',
        version: '1.0.0',
        author: 'GuideSoft',
        category: 'context',
        isFree: true
    },
    {
        id: 'git-context',
        name: 'Git Context',
        description: 'Provides git history and diff context',
        version: '1.0.0',
        author: 'GuideSoft',
        category: 'context',
        isFree: true
    },
    {
        id: 'web-search',
        name: 'Web Search',
        description: 'Search the web for documentation and examples',
        version: '1.0.0',
        author: 'GuideSoft',
        category: 'tool',
        isFree: true
    },
    {
        id: 'terminal-executor',
        name: 'Terminal Executor',
        description: 'Execute terminal commands safely',
        version: '1.0.0',
        author: 'GuideSoft',
        category: 'tool',
        isFree: true
    },
    {
        id: 'github-integration',
        name: 'GitHub Integration',
        description: 'Connect to GitHub repositories',
        version: '1.0.0',
        author: 'GuideSoft',
        category: 'integration',
        isFree: true
    }
];

export const mcpService = {
    getAvailablePlugins: async (): Promise<MCPPlugin[]> => {
        // Simulate API call
        await new Promise(r => setTimeout(r, 500));
        return FREE_MCP_PLUGINS;
    },

    getInstalledPlugins: (): MCPPlugin[] => {
        const installed = localStorage.getItem('mcp_installed_plugins');
        return installed ? JSON.parse(installed) : [];
    },

    installPlugin: (pluginId: string): boolean => {
        const plugin = FREE_MCP_PLUGINS.find(p => p.id === pluginId);
        if (!plugin) return false;

        const installed = mcpService.getInstalledPlugins();
        if (installed.find(p => p.id === pluginId)) {
            return false; // Already installed
        }

        installed.push(plugin);
        localStorage.setItem('mcp_installed_plugins', JSON.stringify(installed));
        console.log(`✅ MCP Plugin installed: ${plugin.name}`);
        return true;
    },

    uninstallPlugin: (pluginId: string): boolean => {
        const installed = mcpService.getInstalledPlugins();
        const filtered = installed.filter(p => p.id !== pluginId);

        if (filtered.length === installed.length) {
            return false; // Plugin not found
        }

        localStorage.setItem('mcp_installed_plugins', JSON.stringify(filtered));
        console.log(`🗑️ MCP Plugin uninstalled: ${pluginId}`);
        return true;
    },

    configurePlugin: (pluginId: string, config: Record<string, unknown>): boolean => {
        const installed = mcpService.getInstalledPlugins();
        const plugin = installed.find(p => p.id === pluginId);

        if (!plugin) return false;

        plugin.config = config;
        localStorage.setItem('mcp_installed_plugins', JSON.stringify(installed));
        return true;
    }
};
