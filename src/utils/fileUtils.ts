import type { FileTreeNode } from '../types';

export function getLanguageFromFilename(filename: string): string {
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

export function updateNodeChildren(nodes: FileTreeNode[], path: string, children: FileTreeNode[]): FileTreeNode[] {
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
