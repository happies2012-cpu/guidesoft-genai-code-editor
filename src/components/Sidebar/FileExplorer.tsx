import { useState } from 'react';
import { FileText, Folder, FolderOpen, ChevronRight, ChevronDown, Plus, File, FolderPlus, Trash2, Edit } from 'lucide-react';
import { useEditorStore } from '../../store/editorStore';
import { fileSystemService } from '../../services/filesystem/FileSystemService';
import type { FileTreeNode, EditorTab } from '../../types';

export default function FileExplorer() {
    const { fileTree, toggleNodeExpanded, addTab, setFileTree } = useEditorStore();
    const [hoveredPath, setHoveredPath] = useState<string | null>(null);
    const [contextMenu, setContextMenu] = useState<{ x: number; y: number; node: FileTreeNode } | null>(null);
    const [showNewFileDialog, setShowNewFileDialog] = useState(false);
    const [showNewFolderDialog, setShowNewFolderDialog] = useState(false);
    const [showRenameDialog, setShowRenameDialog] = useState(false);
    const [newItemName, setNewItemName] = useState('');
    const [selectedNode, setSelectedNode] = useState<FileTreeNode | null>(null);

    const handleOpenFolder = async () => {
        try {
            await fileSystemService.openDirectory();
            await refreshFileTree();
        } catch (error) {
            console.error('Failed to open folder:', error);
        }
    };

    const refreshFileTree = async () => {
        try {
            const tree = await buildFileTree('');
            setFileTree(tree);
        } catch (error) {
            console.error('Failed to refresh file tree:', error);
        }
    };

    const buildFileTree = async (path: string): Promise<FileTreeNode[]> => {
        const entries = await fileSystemService.listDirectory(path);
        const nodes: FileTreeNode[] = [];

        for (const entry of entries) {
            const fullPath = path ? `${path}/${entry.name}` : entry.name;
            const node: FileTreeNode = {
                name: entry.name,
                path: fullPath,
                type: entry.type,
                isExpanded: false,
            };

            if (entry.type === 'directory') {
                node.children = [];
            }

            nodes.push(node);
        }

        return nodes;
    };

    const handleFileClick = async (node: FileTreeNode) => {
        if (node.type === 'file') {
            try {
                const content = await fileSystemService.readFile(node.path);
                const newTab: EditorTab = {
                    id: `tab-${Date.now()}`,
                    filename: node.name,
                    filepath: node.path,
                    language: getLanguageFromFilename(node.name),
                    content,
                    isDirty: false,
                };
                addTab(newTab);
            } catch (error) {
                console.error('Failed to read file:', error);
            }
        } else {
            toggleNodeExpanded(node.path);
            if (!node.isExpanded && (!node.children || node.children.length === 0)) {
                // Load children
                const children = await buildFileTree(node.path);
                useEditorStore.setState((state) => ({
                    fileTree: updateNodeChildren(state.fileTree, node.path, children),
                }));
            }
        }
    };

    const handleContextMenu = (e: React.MouseEvent, node: FileTreeNode) => {
        e.preventDefault();
        setContextMenu({ x: e.clientX, y: e.clientY, node });
        setSelectedNode(node);
    };

    const handleNewFile = () => {
        setShowNewFileDialog(true);
        setContextMenu(null);
    };

    const handleNewFolder = () => {
        setShowNewFolderDialog(true);
        setContextMenu(null);
    };

    const handleRename = () => {
        setNewItemName(selectedNode?.name || '');
        setShowRenameDialog(true);
        setContextMenu(null);
    };

    const handleDelete = async () => {
        if (!selectedNode) return;

        if (confirm(`Are you sure you want to delete ${selectedNode.name}?`)) {
            try {
                if (selectedNode.type === 'file') {
                    await fileSystemService.deleteFile(selectedNode.path);
                } else {
                    await fileSystemService.deleteDirectory(selectedNode.path);
                }
                await refreshFileTree();
            } catch (error) {
                console.error('Failed to delete:', error);
                alert('Failed to delete: ' + (error as Error).message);
            }
        }
        setContextMenu(null);
    };

    const handleCreateFile = async () => {
        if (!newItemName.trim()) return;

        try {
            const basePath = selectedNode?.type === 'directory' ? selectedNode.path : '';
            const filePath = basePath ? `${basePath}/${newItemName}` : newItemName;
            await fileSystemService.createFile(filePath, '');
            await refreshFileTree();
            setShowNewFileDialog(false);
            setNewItemName('');
        } catch (error) {
            console.error('Failed to create file:', error);
            alert('Failed to create file: ' + (error as Error).message);
        }
    };

    const handleCreateFolder = async () => {
        if (!newItemName.trim()) return;

        try {
            const basePath = selectedNode?.type === 'directory' ? selectedNode.path : '';
            const folderPath = basePath ? `${basePath}/${newItemName}` : newItemName;
            await fileSystemService.createDirectory(folderPath);
            await refreshFileTree();
            setShowNewFolderDialog(false);
            setNewItemName('');
        } catch (error) {
            console.error('Failed to create folder:', error);
            alert('Failed to create folder: ' + (error as Error).message);
        }
    };

    const handleRenameItem = async () => {
        if (!newItemName.trim() || !selectedNode) return;

        try {
            const parts = selectedNode.path.split('/');
            parts[parts.length - 1] = newItemName;
            const newPath = parts.join('/');

            if (selectedNode.type === 'file') {
                await fileSystemService.renameFile(selectedNode.path, newPath);
            } else {
                // For directories, we'd need to implement recursive rename
                alert('Directory rename not yet implemented');
                return;
            }

            await refreshFileTree();
            setShowRenameDialog(false);
            setNewItemName('');
        } catch (error) {
            console.error('Failed to rename:', error);
            alert('Failed to rename: ' + (error as Error).message);
        }
    };

    const renderNode = (node: FileTreeNode, depth: number = 0) => {
        const isHovered = hoveredPath === node.path;
        const Icon = node.type === 'directory'
            ? node.isExpanded ? FolderOpen : Folder
            : FileText;

        // Determine color based on git status
        const { gitStatus } = useEditorStore.getState();
        let statusColor = 'text-gray-400';
        if (gitStatus?.modified.some(p => node.path.includes(p))) statusColor = 'text-yellow-500';
        if (gitStatus?.added.some(p => node.path.includes(p))) statusColor = 'text-green-500';
        if (gitStatus?.deleted.some(p => node.path.includes(p))) statusColor = 'text-red-500';
        if (gitStatus?.untracked.some(p => node.path.includes(p))) statusColor = 'text-gray-500';

        return (
            <div key={node.path}>
                <div
                    className={`flex items-center gap-2 px-2 py-1 cursor-pointer transition-colors ${isHovered ? 'bg-dark-hover' : ''}`}
                    style={{ paddingLeft: `${depth * 16 + 8}px` }}
                    onClick={() => handleFileClick(node)}
                    onContextMenu={(e) => handleContextMenu(e, node)}
                    onMouseEnter={() => setHoveredPath(node.path)}
                    onMouseLeave={() => setHoveredPath(null)}
                >
                    {node.type === 'directory' && (
                        <span className="text-gray-500">
                            {node.isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                        </span>
                    )}
                    <Icon size={16} className={node.type === 'directory' ? 'text-primary-500' : statusColor} />
                    <span className={`text-sm ${statusColor === 'text-gray-400' ? 'text-white' : statusColor}`}>{node.name}</span>
                </div>
                {node.type === 'directory' && node.isExpanded && node.children && (
                    <div>
                        {node.children.map((child) => renderNode(child, depth + 1))}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="flex flex-col h-full bg-dark-surface border-r border-dark-border">
            <div className="flex items-center justify-between p-3 border-b border-dark-border">
                <h2 className="font-semibold text-sm uppercase tracking-wide">Explorer</h2>
                <div className="flex gap-1">
                    <button onClick={handleNewFile} className="p-1 hover:bg-dark-hover rounded" title="New file">
                        <Plus size={16} />
                    </button>
                    <button onClick={handleNewFolder} className="p-1 hover:bg-dark-hover rounded" title="New folder">
                        <FolderPlus size={16} />
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar">
                {!fileSystemService.hasDirectoryOpen() ? (
                    <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 p-4">
                        <File size={48} className="mb-4 opacity-50" />
                        <p className="text-sm mb-2">No folder opened</p>
                        <button
                            onClick={handleOpenFolder}
                            className="text-xs text-primary-500 hover:text-primary-400 px-4 py-2 border border-primary-500 rounded"
                        >
                            Open Folder
                        </button>
                    </div>
                ) : (
                    <div className="py-2">
                        {fileTree.map((node) => renderNode(node))}
                    </div>
                )}
            </div>

            {/* Context Menu */}
            {contextMenu && (
                <>
                    <div className="fixed inset-0 z-40" onClick={() => setContextMenu(null)} />
                    <div
                        className="fixed bg-dark-surface border border-dark-border rounded shadow-lg py-1 z-50"
                        style={{ left: contextMenu.x, top: contextMenu.y }}
                    >
                        <button onClick={handleNewFile} className="w-full px-4 py-2 text-left text-sm hover:bg-dark-hover flex items-center gap-2">
                            <Plus size={14} /> New File
                        </button>
                        <button onClick={handleNewFolder} className="w-full px-4 py-2 text-left text-sm hover:bg-dark-hover flex items-center gap-2">
                            <FolderPlus size={14} /> New Folder
                        </button>
                        <button onClick={handleRename} className="w-full px-4 py-2 text-left text-sm hover:bg-dark-hover flex items-center gap-2">
                            <Edit size={14} /> Rename
                        </button>
                        <button onClick={handleDelete} className="w-full px-4 py-2 text-left text-sm hover:bg-dark-hover text-red-500 flex items-center gap-2">
                            <Trash2 size={14} /> Delete
                        </button>
                    </div>
                </>
            )}

            {/* New File Dialog */}
            {showNewFileDialog && (
                <Dialog
                    title="New File"
                    onClose={() => { setShowNewFileDialog(false); setNewItemName(''); }}
                    onConfirm={handleCreateFile}
                >
                    <input
                        type="text"
                        value={newItemName}
                        onChange={(e) => setNewItemName(e.target.value)}
                        placeholder="filename.ext"
                        className="w-full bg-dark-bg border border-dark-border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                        autoFocus
                        onKeyDown={(e) => e.key === 'Enter' && handleCreateFile()}
                    />
                </Dialog>
            )}

            {/* New Folder Dialog */}
            {showNewFolderDialog && (
                <Dialog
                    title="New Folder"
                    onClose={() => { setShowNewFolderDialog(false); setNewItemName(''); }}
                    onConfirm={handleCreateFolder}
                >
                    <input
                        type="text"
                        value={newItemName}
                        onChange={(e) => setNewItemName(e.target.value)}
                        placeholder="folder-name"
                        className="w-full bg-dark-bg border border-dark-border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                        autoFocus
                        onKeyDown={(e) => e.key === 'Enter' && handleCreateFolder()}
                    />
                </Dialog>
            )}

            {/* Rename Dialog */}
            {showRenameDialog && (
                <Dialog
                    title="Rename"
                    onClose={() => { setShowRenameDialog(false); setNewItemName(''); }}
                    onConfirm={handleRenameItem}
                >
                    <input
                        type="text"
                        value={newItemName}
                        onChange={(e) => setNewItemName(e.target.value)}
                        className="w-full bg-dark-bg border border-dark-border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                        autoFocus
                        onKeyDown={(e) => e.key === 'Enter' && handleRenameItem()}
                    />
                </Dialog>
            )}
        </div>
    );
}

// Helper Dialog Component
function Dialog({ title, children, onClose, onConfirm }: {
    title: string;
    children: React.ReactNode;
    onClose: () => void;
    onConfirm: () => void;
}) {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-dark-surface border border-dark-border rounded-lg p-6 w-96">
                <h3 className="text-lg font-semibold mb-4">{title}</h3>
                {children}
                <div className="flex gap-2 justify-end mt-4">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-dark-hover rounded hover:bg-dark-border transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 bg-primary-600 hover:bg-primary-700 rounded transition-colors"
                    >
                        Create
                    </button>
                </div>
            </div>
        </div>
    );
}

// Helper functions
function getLanguageFromFilename(filename: string): string {
    const ext = filename.split('.').pop()?.toLowerCase();
    const languageMap: Record<string, string> = {
        js: 'javascript', jsx: 'javascript', ts: 'typescript', tsx: 'typescript',
        py: 'python', java: 'java', cpp: 'cpp', c: 'c', cs: 'csharp',
        go: 'go', rs: 'rust', rb: 'ruby', php: 'php', html: 'html',
        css: 'css', scss: 'scss', json: 'json', xml: 'xml', md: 'markdown',
        sql: 'sql', sh: 'shell', yaml: 'yaml', yml: 'yaml',
    };
    return languageMap[ext || ''] || 'plaintext';
}

function updateNodeChildren(nodes: FileTreeNode[], path: string, children: FileTreeNode[]): FileTreeNode[] {
    return nodes.map((node) => {
        if (node.path === path) {
            return { ...node, children, isExpanded: true };
        }
        if (node.children) {
            return { ...node, children: updateNodeChildren(node.children, path, children) };
        }
        return node;
    });
}
