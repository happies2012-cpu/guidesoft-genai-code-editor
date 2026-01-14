import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { PluginManifest, InstalledPlugin } from './types';

// Mock Registry for V1
const MOCK_REGISTRY: PluginManifest[] = [
    {
        id: 'dracula-theme',
        version: '1.0.0',
        name: 'Dracula',
        description: 'Dark theme for professionals.',
        author: 'Dracula Theme',
        type: 'theme',
        theme: {
            colors: {
                'editor.background': '#282a36',
                'editor.foreground': '#f8f8f2',
                'activityBar.background': '#282a36',
                'sideBar.background': '#21222c',
            },
            tokenColors: []
        }
    },
    {
        id: 'synthwave-84',
        version: '0.9.0',
        name: 'SynthWave \'84',
        description: 'Cyberpunk aesthetic with neon glow.',
        author: 'Robb Owen',
        type: 'theme',
        theme: {
            colors: {
                'editor.background': '#262335',
                'editor.foreground': '#ffffff',
                'activityBar.background': '#191622',
                'sideBar.background': '#241b2f',
            },
            tokenColors: []
        }
    },
    {
        id: 'github-dark',
        version: '2.0.0',
        name: 'GitHub Dark',
        description: 'GitHub\'s dark theme.',
        author: 'GitHub',
        type: 'theme',
        theme: {
            colors: {
                'editor.background': '#0d1117',
                'editor.foreground': '#c9d1d9',
                'activityBar.background': '#0d1117',
                'sideBar.background': '#010409',
            },
            tokenColors: []
        }
    }
];

interface PluginState {
    installedPlugins: InstalledPlugin[];
    activeThemeId: string | null;

    installPlugin: (pluginId: string) => void;
    uninstallPlugin: (pluginId: string) => void;
    enableTheme: (pluginId: string) => void;
    getAvailablePlugins: () => Promise<PluginManifest[]>;
}

export const usePluginStore = create<PluginState>()(
    persist(
        (set, get) => ({
            installedPlugins: [],
            activeThemeId: null,

            getAvailablePlugins: async () => {
                // Simulate network request
                await new Promise(resolve => setTimeout(resolve, 500));
                return MOCK_REGISTRY;
            },

            installPlugin: (pluginId) => {
                const manifest = MOCK_REGISTRY.find(p => p.id === pluginId);
                if (!manifest) return;

                set(state => {
                    if (state.installedPlugins.some(p => p.id === pluginId)) return state;
                    return {
                        installedPlugins: [
                            ...state.installedPlugins,
                            { ...manifest, installDate: new Date().toISOString(), isEnabled: true }
                        ]
                    };
                });
            },

            uninstallPlugin: (pluginId) => {
                set(state => ({
                    installedPlugins: state.installedPlugins.filter(p => p.id !== pluginId),
                    activeThemeId: state.activeThemeId === pluginId ? null : state.activeThemeId
                }));
            },

            enableTheme: (pluginId) => {
                const plugin = get().installedPlugins.find(p => p.id === pluginId);
                if (plugin && plugin.type === 'theme') {
                    set({ activeThemeId: pluginId });
                    // In a real app, we would apply CSS variables here or update the Monaco theme
                    console.log(`Applying theme: ${plugin.name}`);
                }
            }
        }),
        {
            name: 'guidesoft-plugins',
        }
    )
);
