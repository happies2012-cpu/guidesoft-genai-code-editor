import { useState } from 'react';
import { FileText, Folder, FolderOpen, ChevronRight, ChevronDown, Plus, File } from 'lucide-react';
import { useEditorStore } from '../../store/editorStore';
import type { FileTreeNode, EditorTab } from '../../types';

export default function FileExplorer() {
    const { fileTree, toggleNodeExpanded, addTab } = useEditorStore();
    const [hoveredPath, setHoveredPath] = useState<string | null>(null);

    const handleFileClick = (node: FileTreeNode) => {
        if (node.type === 'file') {
            // Create a new tab for the file
            const newTab: EditorTab = {
                id: `tab-${Date.now()}`,
                filename: node.name,
                filepath: node.path,
                language: getLanguageFromFilename(node.name),
                content: '// File content will be loaded here\n',
                isDirty: false,
            };
            addTab(newTab);
        } else {
            toggleNodeExpanded(node.path);
        }
    };

    const renderNode = (node: FileTreeNode, depth: number = 0) => {
        const isHovered = hoveredPath === node.path;
        const Icon =
            node.type === 'directory'
                ? node.isExpanded
                    ? FolderOpen
                    : Folder
                : FileText;

        return (
            <div key={node.path}>
                <div
                    className={`
            flex items-center gap-2 px-2 py-1 cursor-pointer transition-colors
            ${isHovered ? 'bg-dark-hover' : ''}
          `}
                    style={{ paddingLeft: `${depth * 16 + 8}px` }}
                    onClick={() => handleFileClick(node)}
                    onMouseEnter={() => setHoveredPath(node.path)}
                    onMouseLeave={() => setHoveredPath(null)}
                >
                    {node.type === 'directory' && (
                        <span className="text-gray-500">
                            {node.isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                        </span>
                    )}
                    <Icon size={16} className={node.type === 'directory' ? 'text-primary-500' : 'text-gray-400'} />
                    <span className="text-sm">{node.name}</span>
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
            {/* Header */}
            <div className="flex items-center justify-between p-3 border-b border-dark-border">
                <h2 className="font-semibold text-sm uppercase tracking-wide">Explorer</h2>
                <button
                    className="p-1 hover:bg-dark-hover rounded transition-colors"
                    title="New file"
                >
                    <Plus size={16} />
                </button>
            </div>

            {/* File Tree */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
                {fileTree.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 p-4">
                        <File size={48} className="mb-4 opacity-50" />
                        <p className="text-sm mb-2">No folder opened</p>
                        <button className="text-xs text-primary-500 hover:text-primary-400">
                            Open Folder
                        </button>
                    </div>
                ) : (
                    <div className="py-2">
                        {fileTree.map((node) => renderNode(node))}
                    </div>
                )}
            </div>
        </div>
    );
}

// Helper function to determine language from filename
function getLanguageFromFilename(filename: string): string {
    const ext = filename.split('.').pop()?.toLowerCase();
    const languageMap: Record<string, string> = {
        js: 'javascript',
        jsx: 'javascript',
        ts: 'typescript',
        tsx: 'typescript',
        py: 'python',
        java: 'java',
        cpp: 'cpp',
        c: 'c',
        cs: 'csharp',
        go: 'go',
        rs: 'rust',
        rb: 'ruby',
        php: 'php',
        html: 'html',
        css: 'css',
        scss: 'scss',
        json: 'json',
        xml: 'xml',
        md: 'markdown',
        sql: 'sql',
        sh: 'shell',
        yaml: 'yaml',
        yml: 'yaml',
    };
    return languageMap[ext || ''] || 'plaintext';
}
