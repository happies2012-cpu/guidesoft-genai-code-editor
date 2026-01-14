import { useState } from 'react';
import { X, Settings as SettingsIcon, Sparkles, Code, Terminal, Palette } from 'lucide-react';
import { useEditorStore } from '../../store/editorStore';

interface SettingsPanelProps {
    onClose: () => void;
}

export default function SettingsPanel({ onClose }: SettingsPanelProps) {
    const { settings, updateSettings, aiProviders, selectedProvider, setSelectedProvider } = useEditorStore();
    const [activeTab, setActiveTab] = useState<'editor' | 'ai' | 'terminal' | 'appearance'>('editor');

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-dark-surface border border-dark-border rounded-lg w-[800px] h-[600px] flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-dark-border">
                    <div className="flex items-center gap-2">
                        <SettingsIcon size={20} className="text-primary-500" />
                        <h2 className="text-lg font-semibold">Settings</h2>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-dark-hover rounded transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <div className="flex flex-1 overflow-hidden">
                    {/* Sidebar */}
                    <div className="w-48 border-r border-dark-border p-2">
                        <button
                            onClick={() => setActiveTab('editor')}
                            className={`w-full flex items-center gap-2 px-3 py-2 rounded text-sm ${activeTab === 'editor' ? 'bg-primary-600 text-white' : 'hover:bg-dark-hover'
                                }`}
                        >
                            <Code size={16} />
                            Editor
                        </button>
                        <button
                            onClick={() => setActiveTab('ai')}
                            className={`w-full flex items-center gap-2 px-3 py-2 rounded text-sm mt-1 ${activeTab === 'ai' ? 'bg-primary-600 text-white' : 'hover:bg-dark-hover'
                                }`}
                        >
                            <Sparkles size={16} />
                            AI
                        </button>
                        <button
                            onClick={() => setActiveTab('terminal')}
                            className={`w-full flex items-center gap-2 px-3 py-2 rounded text-sm mt-1 ${activeTab === 'terminal' ? 'bg-primary-600 text-white' : 'hover:bg-dark-hover'
                                }`}
                        >
                            <Terminal size={16} />
                            Terminal
                        </button>
                        <button
                            onClick={() => setActiveTab('appearance')}
                            className={`w-full flex items-center gap-2 px-3 py-2 rounded text-sm mt-1 ${activeTab === 'appearance' ? 'bg-primary-600 text-white' : 'hover:bg-dark-hover'
                                }`}
                        >
                            <Palette size={16} />
                            Appearance
                        </button>
                    </div>

                    {/* Content */}
                    <div className="flex-1 p-6 overflow-y-auto custom-scrollbar">
                        {activeTab === 'editor' && (
                            <div className="space-y-6">
                                <h3 className="text-lg font-semibold mb-4">Editor Settings</h3>

                                <div>
                                    <label className="block text-sm font-medium mb-2">Font Size</label>
                                    <input
                                        type="number"
                                        value={settings.fontSize}
                                        onChange={(e) => updateSettings({ fontSize: parseInt(e.target.value) })}
                                        className="w-32 bg-dark-bg border border-dark-border rounded px-3 py-2 text-sm"
                                        min="10"
                                        max="24"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">Tab Size</label>
                                    <input
                                        type="number"
                                        value={settings.tabSize}
                                        onChange={(e) => updateSettings({ tabSize: parseInt(e.target.value) })}
                                        className="w-32 bg-dark-bg border border-dark-border rounded px-3 py-2 text-sm"
                                        min="2"
                                        max="8"
                                    />
                                </div>

                                <div className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        id="wordWrap"
                                        checked={settings.wordWrap}
                                        onChange={(e) => updateSettings({ wordWrap: e.target.checked })}
                                        className="w-4 h-4"
                                    />
                                    <label htmlFor="wordWrap" className="text-sm">Enable Word Wrap</label>
                                </div>

                                <div className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        id="minimap"
                                        checked={settings.minimap}
                                        onChange={(e) => updateSettings({ minimap: e.target.checked })}
                                        className="w-4 h-4"
                                    />
                                    <label htmlFor="minimap" className="text-sm">Show Minimap</label>
                                </div>

                                <div className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        id="lineNumbers"
                                        checked={settings.lineNumbers}
                                        onChange={(e) => updateSettings({ lineNumbers: e.target.checked })}
                                        className="w-4 h-4"
                                    />
                                    <label htmlFor="lineNumbers" className="text-sm">Show Line Numbers</label>
                                </div>

                                <div className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        id="autoSave"
                                        checked={settings.autoSave}
                                        onChange={(e) => updateSettings({ autoSave: e.target.checked })}
                                        className="w-4 h-4"
                                    />
                                    <label htmlFor="autoSave" className="text-sm">Auto Save</label>
                                </div>
                            </div>
                        )}

                        {activeTab === 'ai' && (
                            <div className="space-y-6">
                                <h3 className="text-lg font-semibold mb-4">AI Settings</h3>

                                <div>
                                    <label className="block text-sm font-medium mb-2">AI Provider</label>
                                    <select
                                        value={selectedProvider}
                                        onChange={(e) => setSelectedProvider(e.target.value)}
                                        className="w-full bg-dark-bg border border-dark-border rounded px-3 py-2 text-sm"
                                    >
                                        {aiProviders.map((provider) => (
                                            <option key={provider.id} value={provider.id}>
                                                {provider.name}
                                            </option>
                                        ))}
                                    </select>
                                    <p className="text-xs text-gray-500 mt-1">
                                        Selected: {aiProviders.find(p => p.id === selectedProvider)?.name}
                                    </p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">Default Model</label>
                                    <select
                                        value={settings.aiModel}
                                        onChange={(e) => updateSettings({ aiModel: e.target.value })}
                                        className="w-full bg-dark-bg border border-dark-border rounded px-3 py-2 text-sm"
                                    >
                                        {aiProviders
                                            .find(p => p.id === selectedProvider)
                                            ?.models.map((model) => (
                                                <option key={model} value={model}>
                                                    {model}
                                                </option>
                                            ))}
                                    </select>
                                </div>

                                <div className="bg-dark-bg border border-dark-border rounded p-4">
                                    <h4 className="text-sm font-semibold mb-2">API Keys</h4>
                                    <p className="text-xs text-gray-400 mb-3">
                                        Configure your API keys in the AI Chat panel (click the Settings icon)
                                    </p>
                                    <div className="space-y-2">
                                        {aiProviders.map((provider) => (
                                            <div key={provider.id} className="flex items-center justify-between text-xs">
                                                <span>{provider.name}</span>
                                                <span className={provider.requiresApiKey ? 'text-yellow-500' : 'text-green-500'}>
                                                    {provider.requiresApiKey ? 'API Key Required' : 'No Key Required'}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'terminal' && (
                            <div className="space-y-6">
                                <h3 className="text-lg font-semibold mb-4">Terminal Settings</h3>

                                <div className="bg-dark-bg border border-dark-border rounded p-4">
                                    <p className="text-sm text-gray-400">
                                        Terminal settings will be available in future updates.
                                    </p>
                                    <p className="text-xs text-gray-500 mt-2">
                                        Features coming soon: custom shell, font size, scrollback buffer, etc.
                                    </p>
                                </div>
                            </div>
                        )}

                        {activeTab === 'appearance' && (
                            <div className="space-y-6">
                                <h3 className="text-lg font-semibold mb-4">Appearance Settings</h3>

                                <div>
                                    <label className="block text-sm font-medium mb-2">Theme</label>
                                    <select
                                        value={settings.theme}
                                        onChange={(e) => updateSettings({ theme: e.target.value as 'dark' | 'light' })}
                                        className="w-full bg-dark-bg border border-dark-border rounded px-3 py-2 text-sm"
                                    >
                                        <option value="dark">Dark</option>
                                        <option value="light">Light (Coming Soon)</option>
                                    </select>
                                </div>

                                <div className="bg-dark-bg border border-dark-border rounded p-4">
                                    <h4 className="text-sm font-semibold mb-2">Current Theme: GUIDESOFT GENAI Dark</h4>
                                    <p className="text-xs text-gray-400">
                                        Cursor-inspired dark theme with blue accents
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-2 p-4 border-t border-dark-border">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-primary-600 hover:bg-primary-700 rounded transition-colors"
                    >
                        Done
                    </button>
                </div>
            </div>
        </div>
    );
}
