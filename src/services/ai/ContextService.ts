import { fileSystemService } from '../filesystem/FileSystemService';

export interface FileContext {
    path: string;
    name: string;
    contentSummary: string;
}

export interface ProjectContext {
    projectName: string;
    fileTree: string; // Simplified string representation
    majorFiles: Record<string, string>; // e.g. package.json content
}

class ContextService {
    private context: ProjectContext | null = null;

    async refreshContext(): Promise<ProjectContext> {
        try {
            console.log('Refreshing project context...');

            // 1. Get package.json if it exists
            const majorFiles: Record<string, string> = {};
            try {
                const packageJson = await fileSystemService.readFile('package.json');
                majorFiles['package.json'] = packageJson;
            } catch (e) {
                // Ignore if not found
            }

            // 2. Build a simplified file tree string
            const treeString = await this.buildSimplifiedTree('', 0);

            this.context = {
                projectName: 'GUIDESOFT GENAI Project',
                fileTree: treeString,
                majorFiles,
            };

            return this.context;
        } catch (error) {
            console.error('Failed to refresh context:', error);
            throw error;
        }
    }

    private async buildSimplifiedTree(path: string, depth: number): Promise<string> {
        if (depth > 5) return ''; // Limit depth

        const entries = await fileSystemService.listDirectory(path);
        let result = '';

        for (const entry of entries) {
            const indent = '  '.repeat(depth);
            result += `${indent}${entry.type === 'directory' ? '📁' : '📄'} ${entry.name}\n`;

            if (entry.type === 'directory' && !['node_modules', '.git', 'dist', 'build'].includes(entry.name)) {
                const subPath = path ? `${path}/${entry.name}` : entry.name;
                result += await this.buildSimplifiedTree(subPath, depth + 1);
            }
        }

        return result;
    }

    getContext(): ProjectContext | null {
        return this.context;
    }

    async getFileContext(path: string): Promise<string> {
        try {
            const content = await fileSystemService.readFile(path);
            // Just return first 1000 chars for context
            return content.substring(0, 1000) + (content.length > 1000 ? '\n...(truncated)' : '');
        } catch (e) {
            return `Could not read file ${path}`;
        }
    }
}

export const contextService = new ContextService();
