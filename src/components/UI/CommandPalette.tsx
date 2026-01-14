import { useState, useEffect, useRef } from 'react';
import { Search, File, FolderOpen, Settings, Terminal, Sparkles, Code } from 'lucide-react';
import { useEditorStore } from '../../store/editorStore';

interface Command {
    id: string;
    label: string;
    description: string;
    icon: React.ReactNode;
    action: () => void;
    keywords: string[];
}

interface CommandPaletteProps {
    onClose: () => void;
}

export default function CommandPalette({ onClose }: CommandPaletteProps) {
    const [search, setSearch] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);
    const {
        toggleSidebar,
        toggleTerminal,
        toggleAIChat,
        clearAIMessages,
        tabs,
        setActiveTab,
    } = useEditorStore();

    const commands: Command[] = [
        {
            id: 'save-file',
            label: 'Save File',
            description: 'Save the current document to disk',
            icon: <File size={16} />,
            action: () => {
                const event = new KeyboardEvent('keydown', {
                    key: 's',
                    code: 'KeyS',
                    ctrlKey: true,
                    metaKey: true,
                });
                document.dispatchEvent(event);
                onClose();
            },
            keywords: ['save', 'persist', 'disk'],
        },
        {
            id: 'toggle-sidebar',
            label: 'Toggle Sidebar',
            description: 'Show or hide the file explorer',
            icon: <FolderOpen size={16} />,
            action: () => { toggleSidebar(); onClose(); },
            keywords: ['sidebar', 'explorer', 'files'],
        },
        {
            id: 'toggle-terminal',
            label: 'Toggle Terminal',
            description: 'Show or hide the terminal panel',
            icon: <Terminal size={16} />,
            action: () => { toggleTerminal(); onClose(); },
            keywords: ['terminal', 'console', 'shell'],
        },
        {
            id: 'toggle-ai',
            label: 'Toggle AI Chat',
            description: 'Show or hide the AI assistant',
            icon: <Sparkles size={16} />,
            action: () => { toggleAIChat(); onClose(); },
            keywords: ['ai', 'chat', 'assistant', 'copilot'],
        },
        {
            id: 'clear-chat',
            label: 'Clear AI Chat',
            description: 'Clear all AI chat messages',
            icon: <Sparkles size={16} />,
            action: () => { clearAIMessages(); onClose(); },
            keywords: ['clear', 'ai', 'chat', 'messages'],
        },
        {
            id: 'format-code',
            label: 'Format Document',
            description: 'Format the current document',
            icon: <Code size={16} />,
            action: () => {
                const event = new KeyboardEvent('keydown', {
                    key: 'f',
                    code: 'KeyF',
                    shiftKey: true,
                    altKey: true,
                });
                document.dispatchEvent(event);
                onClose();
            },
            keywords: ['format', 'prettier', 'beautify', 'code'],
        },
        {
            id: 'new-file',
            label: 'New File',
            description: 'Create a new file in the workspace',
            icon: <File size={16} />,
            action: () => {
                if (!sidebarVisible) toggleSidebar();
                onClose();
            },
            keywords: ['new', 'create', 'file'],
        },
        {
            id: 'git-commit',
            label: 'Git: Commit All',
            description: 'Commit all changes to the repository',
            icon: <Code size={16} />,
            action: () => {
                alert('Commit feature coming soon! Changes are automatically tracked by the agent.');
                onClose();
            },
            keywords: ['git', 'commit', 'save', 'version'],
        },
        {
            id: 'git-push',
            label: 'Git: Push',
            description: 'Push committed changes to remote',
            icon: <Code size={16} />,
            action: () => {
                alert('Push feature coming soon!');
                onClose();
            },
            keywords: ['git', 'push', 'upload', 'remote'],
        },
        ...tabs.map((tab) => ({
            id: `open-${tab.id}`,
            label: `Open: ${tab.filename}`,
            description: tab.filepath || 'Untitled',
            icon: <File size={16} />,
            action: () => { setActiveTab(tab.id); onClose(); },
            keywords: ['open', 'file', tab.filename, tab.filepath || ''],
        })),
        {
            id: 'close-all-tabs',
            label: 'Tabs: Close All',
            description: 'Close all open editor tabs',
            icon: <File size={16} />,
            action: () => { useEditorStore.getState().closeAllTabs(); onClose(); },
            keywords: ['close', 'all', 'tabs', 'clear'],
        },
        {
            id: 'scan-workspace',
            label: 'AI: Scan Workspace',
            description: 'Refresh codebase context for AI',
            icon: <Search size={16} />,
            action: async () => {
                const { contextService } = await import('../../services/ai/ContextService');
                await contextService.refreshContext();
                onClose();
            },
            keywords: ['scan', 'workspace', 'context', 'ai', 'index'],
        },
    ];
    const filteredCommands = commands.filter((cmd) => {
        const searchLower = search.toLowerCase();
        return (
            cmd.label.toLowerCase().includes(searchLower) ||
            cmd.description.toLowerCase().includes(searchLower) ||
            cmd.keywords.some((k) => k.toLowerCase().includes(searchLower))
        );
    });

    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    useEffect(() => {
        setSelectedIndex(0);
    }, [search]);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setSelectedIndex((prev) => Math.min(prev + 1, filteredCommands.length - 1));
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setSelectedIndex((prev) => Math.max(prev - 1, 0));
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (filteredCommands[selectedIndex]) {
                filteredCommands[selectedIndex].action();
            }
        } else if (e.key === 'Escape') {
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center pt-32 z-50">
            <div className="bg-dark-surface border border-dark-border rounded-lg w-[600px] shadow-2xl">
                {/* Search Input */}
                <div className="flex items-center gap-3 p-4 border-b border-dark-border">
                    <Search size={20} className="text-gray-400" />
                    <input
                        ref={inputRef}
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Type a command or search..."
                        className="flex-1 bg-transparent outline-none text-sm"
                    />
                    <kbd className="px-2 py-1 bg-dark-bg rounded text-xs text-gray-500">ESC</kbd>
                </div>

                {/* Commands List */}
                <div className="max-h-96 overflow-y-auto custom-scrollbar">
                    {filteredCommands.length === 0 ? (
                        <div className="p-8 text-center text-gray-500 text-sm">
                            No commands found
                        </div>
                    ) : (
                        filteredCommands.map((cmd, index) => (
                            <button
                                key={cmd.id}
                                onClick={cmd.action}
                                onMouseEnter={() => setSelectedIndex(index)}
                                className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${index === selectedIndex
                                    ? 'bg-primary-600 text-white'
                                    : 'hover:bg-dark-hover'
                                    }`}
                            >
                                <div className={index === selectedIndex ? 'text-white' : 'text-gray-400'}>
                                    {cmd.icon}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="text-sm font-medium truncate">{cmd.label}</div>
                                    <div className={`text-xs truncate ${index === selectedIndex ? 'text-gray-200' : 'text-gray-500'
                                        }`}>
                                        {cmd.description}
                                    </div>
                                </div>
                                {index === selectedIndex && (
                                    <kbd className="px-2 py-1 bg-white bg-opacity-20 rounded text-xs">↵</kbd>
                                )}
                            </button>
                        ))
                    )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between px-4 py-2 border-t border-dark-border text-xs text-gray-500">
                    <div className="flex items-center gap-4">
                        <span>
                            <kbd className="px-1.5 py-0.5 bg-dark-bg rounded">↑↓</kbd> Navigate
                        </span>
                        <span>
                            <kbd className="px-1.5 py-0.5 bg-dark-bg rounded">↵</kbd> Select
                        </span>
                    </div>
                    <span>{filteredCommands.length} commands</span>
                </div>
            </div>
        </div>
    );
}
