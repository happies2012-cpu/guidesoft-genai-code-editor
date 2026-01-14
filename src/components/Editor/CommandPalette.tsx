import React, { useState, useEffect } from 'react';
import { Command } from 'lucide-react';

interface CommandPaletteProps {
    isOpen: boolean;
    onClose: () => void;
    onExecute: (command: string) => void;
}

interface CommandItem {
    id: string;
    label: string;
    description: string;
    shortcut?: string;
    category: string;
}

const commands: CommandItem[] = [
    // File commands
    { id: 'file.new', label: 'New File', description: 'Create a new file', shortcut: 'Cmd+N', category: 'File' },
    { id: 'file.open', label: 'Open File', description: 'Open an existing file', shortcut: 'Cmd+O', category: 'File' },
    { id: 'file.save', label: 'Save', description: 'Save current file', shortcut: 'Cmd+S', category: 'File' },

    // AI commands
    { id: 'ai.generate', label: 'Generate Code', description: 'Generate code with AI', shortcut: 'Cmd+G', category: 'AI' },
    { id: 'ai.explain', label: 'Explain Code', description: 'Get AI explanation', shortcut: 'Cmd+E', category: 'AI' },
    { id: 'ai.refactor', label: 'Refactor', description: 'AI-powered refactoring', shortcut: 'Cmd+R', category: 'AI' },
    { id: 'ai.chat', label: 'AI Chat', description: 'Open AI chat panel', shortcut: 'Cmd+L', category: 'AI' },
    { id: 'ai.inline', label: 'Inline AI Edit', description: 'Edit with AI inline', shortcut: 'Cmd+K', category: 'AI' },

    // Editor commands
    { id: 'editor.format', label: 'Format Document', description: 'Format current file', shortcut: 'Shift+Alt+F', category: 'Editor' },
    { id: 'editor.find', label: 'Find', description: 'Find in file', shortcut: 'Cmd+F', category: 'Editor' },
    { id: 'editor.replace', label: 'Replace', description: 'Find and replace', shortcut: 'Cmd+H', category: 'Editor' },
    { id: 'editor.split', label: 'Split Editor', description: 'Split editor pane', shortcut: 'Cmd+\\', category: 'Editor' },

    // View commands
    { id: 'view.terminal', label: 'Toggle Terminal', description: 'Show/hide terminal', shortcut: 'Ctrl+`', category: 'View' },
    { id: 'view.sidebar', label: 'Toggle Sidebar', description: 'Show/hide sidebar', shortcut: 'Cmd+B', category: 'View' },
    { id: 'view.minimap', label: 'Toggle Minimap', description: 'Show/hide minimap', shortcut: 'Cmd+M', category: 'View' },
];

export const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose, onExecute }) => {
    const [search, setSearch] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(0);

    const filteredCommands = commands.filter(cmd =>
        cmd.label.toLowerCase().includes(search.toLowerCase()) ||
        cmd.description.toLowerCase().includes(search.toLowerCase())
    );

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!isOpen) return;

            if (e.key === 'Escape') {
                onClose();
            } else if (e.key === 'ArrowDown') {
                e.preventDefault();
                setSelectedIndex(prev => (prev + 1) % filteredCommands.length);
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                setSelectedIndex(prev => (prev - 1 + filteredCommands.length) % filteredCommands.length);
            } else if (e.key === 'Enter') {
                e.preventDefault();
                if (filteredCommands[selectedIndex]) {
                    onExecute(filteredCommands[selectedIndex].id);
                    onClose();
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, selectedIndex, filteredCommands, onClose, onExecute]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start justify-center pt-32">
            <div className="w-full max-w-2xl bg-[#1a1a1a] border border-white/10 rounded-xl shadow-2xl overflow-hidden">
                {/* Search Input */}
                <div className="flex items-center gap-3 px-4 py-3 border-b border-white/10">
                    <Command size={20} className="text-purple-400" />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setSelectedIndex(0);
                        }}
                        placeholder="Type a command or search..."
                        className="flex-1 bg-transparent outline-none text-white placeholder-gray-500"
                        autoFocus
                    />
                    <kbd className="px-2 py-1 bg-white/10 rounded text-xs text-gray-400">Esc</kbd>
                </div>

                {/* Commands List */}
                <div className="max-h-96 overflow-y-auto">
                    {filteredCommands.length === 0 ? (
                        <div className="px-4 py-8 text-center text-gray-500">
                            No commands found
                        </div>
                    ) : (
                        filteredCommands.map((cmd, idx) => (
                            <button
                                key={cmd.id}
                                onClick={() => {
                                    onExecute(cmd.id);
                                    onClose();
                                }}
                                className={`w-full flex items-center justify-between px-4 py-3 hover:bg-white/5 transition-colors ${idx === selectedIndex ? 'bg-purple-500/20 border-l-2 border-purple-500' : ''
                                    }`}
                            >
                                <div className="flex-1 text-left">
                                    <div className="font-medium text-white">{cmd.label}</div>
                                    <div className="text-sm text-gray-400">{cmd.description}</div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-xs text-gray-500">{cmd.category}</span>
                                    {cmd.shortcut && (
                                        <kbd className="px-2 py-1 bg-white/10 rounded text-xs text-gray-400">
                                            {cmd.shortcut}
                                        </kbd>
                                    )}
                                </div>
                            </button>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};
