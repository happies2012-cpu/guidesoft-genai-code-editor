import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { EditorTab, FileTreeNode, AIProvider, AIMessage, TerminalSession, EditorSettings, GitStatus } from '../types';
import type { SearchResult } from '../services/search/types';
import { getLanguageFromFilename } from '../utils/fileUtils';

interface EditorStore {
    // Tabs
    tabs: EditorTab[];
    activeTabId: string | null;
    recentFiles: string[]; // List of filepaths
    addTab: (tab: EditorTab) => void;
    openFile: (path: string) => Promise<void>;
    removeTab: (tabId: string) => void;
    updateTab: (tabId: string, updates: Partial<EditorTab>) => void;
    setActiveTab: (tabId: string) => void;
    closeAllTabs: () => void;
    closeOtherTabs: (tabId: string) => void;

    // File Tree
    fileTree: FileTreeNode[];
    setFileTree: (tree: FileTreeNode[]) => void;
    toggleNodeExpanded: (path: string) => void;

    // AI
    aiProviders: AIProvider[];
    selectedProvider: string;
    aiMessages: AIMessage[];
    addAIMessage: (message: AIMessage) => void;
    clearAIMessages: () => void;
    setSelectedProvider: (providerId: string) => void;
    updateProviderApiKey: (providerId: string, apiKey: string) => void;

    // Terminal
    terminals: TerminalSession[];
    activeTerminalId: string | null;
    addTerminal: (terminal: TerminalSession) => void;
    removeTerminal: (terminalId: string) => void;
    setActiveTerminal: (terminalId: string) => void;

    // Settings
    settings: EditorSettings;
    updateSettings: (updates: Partial<EditorSettings>) => void;

    // Git
    gitStatus: GitStatus | null;
    setGitStatus: (status: GitStatus | null) => void;
    refreshGitStatus: () => Promise<void>;

    // AI Trigger
    pendingAIAction: { type: 'explain' | 'fix'; code: string } | null;
    triggerAIAction: (type: 'explain' | 'fix', code: string) => void;
    clearPendingAIAction: () => void;

    // UI State
    sidebarVisible: boolean;
    terminalVisible: boolean;
    aiChatVisible: boolean;
    commandPaletteOpen: boolean;
    toggleSidebar: () => void;
    toggleTerminal: () => void;
    toggleAIChat: () => void;
    toggleCommandPalette: () => void;
    setCommandPaletteOpen: (isOpen: boolean) => void;
    sidebarView: 'files' | 'search' | 'git';
    setSidebarView: (view: 'files' | 'search' | 'git') => void;

    // Search
    searchQuery: string;
    searchResults: SearchResult[];
    isSearching: boolean;
    setSearchQuery: (query: string) => void;
    setSearchResults: (results: SearchResult[]) => void;
    setIsSearching: (isSearching: boolean) => void;
    applyAICode: (code: string) => void;
}

export const useEditorStore = create<EditorStore>()(
    persist(
        (set) => ({
            // Git
            gitStatus: null,
            setGitStatus: (status) => set({ gitStatus: status }),
            refreshGitStatus: async () => {
                try {
                    // Logic to fetch git status via run_command would go here in a real app
                    // For now, we'll simulate a refresh or use a mock status
                    console.log('Refreshing Git status...');
                } catch (error) {
                    console.error('Git refresh error:', error);
                }
            },

            // AI Trigger
            pendingAIAction: null,
            triggerAIAction: (type, code) => set({ pendingAIAction: { type, code }, aiChatVisible: true }),
            clearPendingAIAction: () => set({ pendingAIAction: null }),

            // Apply AI Code
            applyAICode: (code) =>
                set((state) => {
                    if (state.activeTabId) {
                        return {
                            tabs: state.tabs.map((t) =>
                                t.id === state.activeTabId ? { ...t, content: code, isDirty: true } : t
                            ),
                        };
                    }
                    return state;
                }),

            // Tabs
            tabs: [],
            activeTabId: null,
            recentFiles: [],
            addTab: (tab) =>
                set((state) => ({
                    tabs: [...state.tabs, tab],
                    activeTabId: tab.id,
                    recentFiles: [
                        tab.filepath,
                        ...state.recentFiles.filter((f) => f !== tab.filepath),
                    ].slice(0, 10),
                })),
            openFile: async (path) => {
                const { fileSystemService } = await import('../services/filesystem/FileSystemService');
                try {
                    // Check if file is already open
                    const existingTab = useEditorStore.getState().tabs.find(t => t.filepath === path);
                    if (existingTab) {
                        useEditorStore.getState().setActiveTab(existingTab.id);
                        return;
                    }

                    const content = await fileSystemService.readFile(path);
                    const filename = path.split('/').pop() || path;
                    const newTab: EditorTab = {
                        id: `tab-${Date.now()}`,
                        filename,
                        filepath: path,
                        language: getLanguageFromFilename(filename),
                        content,
                        isDirty: false,
                    };
                    useEditorStore.getState().addTab(newTab);
                } catch (error) {
                    console.error('Failed to open file:', error);
                    alert('Failed to open file: ' + (error as Error).message);
                }
            },
            removeTab: (tabId) =>
                set((state) => {
                    const newTabs = state.tabs.filter((t) => t.id !== tabId);
                    const newActiveId =
                        state.activeTabId === tabId
                            ? newTabs[newTabs.length - 1]?.id || null
                            : state.activeTabId;
                    return { tabs: newTabs, activeTabId: newActiveId };
                }),
            updateTab: (tabId, updates) =>
                set((state) => ({
                    tabs: state.tabs.map((t) => (t.id === tabId ? { ...t, ...updates } : t)),
                })),
            setActiveTab: (tabId) =>
                set((state) => {
                    const tab = state.tabs.find((t) => t.id === tabId);
                    if (tab) {
                        return {
                            activeTabId: tabId,
                            recentFiles: [
                                tab.filepath,
                                ...state.recentFiles.filter((f) => f !== tab.filepath),
                            ].slice(0, 10),
                        };
                    }
                    return { activeTabId: tabId };
                }),
            closeAllTabs: () => set({ tabs: [], activeTabId: null }),
            closeOtherTabs: (tabId) =>
                set((state) => ({
                    tabs: state.tabs.filter((t) => t.id === tabId),
                    activeTabId: tabId,
                })),

            // File Tree
            fileTree: [],
            setFileTree: (tree) => set({ fileTree: tree }),
            toggleNodeExpanded: (path) =>
                set((state) => ({
                    fileTree: toggleNodeInTree(state.fileTree, path),
                })),

            // AI
            aiProviders: [
                { id: 'anthropic', name: 'Anthropic Claude', models: ['claude-3-5-sonnet', 'claude-3-opus'], requiresApiKey: true },
                { id: 'openai', name: 'OpenAI', models: ['gpt-4o', 'gpt-4-turbo'], requiresApiKey: true },
                { id: 'gemini', name: 'Google Gemini', models: ['gemini-1.5-pro', 'gemini-1.5-flash'], requiresApiKey: true },
                { id: 'ollama', name: 'Ollama (Local)', models: ['codellama', 'deepseek-coder'], requiresApiKey: false },
            ],
            selectedProvider: 'anthropic',
            aiMessages: [],
            addAIMessage: (message) =>
                set((state) => ({
                    aiMessages: [...state.aiMessages, message],
                })),
            clearAIMessages: () => set({ aiMessages: [] }),
            setSelectedProvider: (providerId) => set({ selectedProvider: providerId }),
            updateProviderApiKey: (providerId, apiKey) =>
                set((state) => ({
                    aiProviders: state.aiProviders.map((p) =>
                        p.id === providerId ? { ...p, apiKey } : p
                    ),
                })),

            // Terminal
            terminals: [],
            activeTerminalId: null,
            addTerminal: (terminal) =>
                set((state) => ({
                    terminals: [...state.terminals, terminal],
                    activeTerminalId: terminal.id,
                })),
            removeTerminal: (terminalId) =>
                set((state) => {
                    const newTerminals = state.terminals.filter((t) => t.id !== terminalId);
                    const newActiveId =
                        state.activeTerminalId === terminalId
                            ? newTerminals[newTerminals.length - 1]?.id || null
                            : state.activeTerminalId;
                    return { terminals: newTerminals, activeTerminalId: newActiveId };
                }),
            setActiveTerminal: (terminalId) => set({ activeTerminalId: terminalId }),

            // Settings
            settings: {
                theme: 'dark',
                fontSize: 14,
                tabSize: 2,
                wordWrap: true,
                minimap: true,
                lineNumbers: true,
                autoSave: true,
                aiProvider: 'anthropic',
                aiModel: 'claude-sonnet-4',
            },
            updateSettings: (updates) =>
                set((state) => ({
                    settings: { ...state.settings, ...updates },
                })),

            // UI State
            sidebarVisible: true,
            terminalVisible: true,
            aiChatVisible: false,
            commandPaletteOpen: false,
            toggleSidebar: () => set((state) => ({ sidebarVisible: !state.sidebarVisible })),
            toggleTerminal: () => set((state) => ({ terminalVisible: !state.terminalVisible })),
            toggleAIChat: () => set((state) => ({ aiChatVisible: !state.aiChatVisible })),
            toggleCommandPalette: () =>
                set((state) => ({ commandPaletteOpen: !state.commandPaletteOpen })),
            setCommandPaletteOpen: (isOpen) => set({ commandPaletteOpen: isOpen }),

            // Sidebar View
            sidebarView: 'files',
            setSidebarView: (view) => set({ sidebarView: view, sidebarVisible: true }),

            // Search
            searchQuery: '',
            searchResults: [],
            isSearching: false,
            setSearchQuery: (query) => set({ searchQuery: query }),
            setSearchResults: (results) => set({ searchResults: results }),
            setIsSearching: (isSearching) => set({ isSearching }),
        }),
        {
            name: 'ai-code-editor-storage',
            partialize: (state) => ({
                settings: state.settings,
                aiProviders: state.aiProviders,
                selectedProvider: state.selectedProvider,
            }),
        }
    )
);

// Helper function to toggle node expansion in tree
function toggleNodeInTree(nodes: FileTreeNode[], path: string): FileTreeNode[] {
    return nodes.map((node) => {
        if (node.path === path) {
            return { ...node, isExpanded: !node.isExpanded };
        }
        if (node.children) {
            return { ...node, children: toggleNodeInTree(node.children, path) };
        }
        return node;
    });
}
