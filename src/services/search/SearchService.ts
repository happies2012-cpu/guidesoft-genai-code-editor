import { fileSystemService } from '../filesystem/FileSystemService';
import type { SearchResult, SearchMatch, SearchOptions } from './types';

class SearchService {
    private MAX_MATCHES_PER_FILE = 1000;
    private MAX_FILE_SIZE = 1024 * 1024; // 1MB limit for search

    async searchFiles(query: string, options: SearchOptions): Promise<SearchResult[]> {
        if (!query) return [];

        const results: SearchResult[] = [];
        const files = await this.getAllFiles('');

        for (const file of files) {
            // Skip huge files or binary-like files (simple check)
            if (file.name.endsWith('.png') || file.name.endsWith('.jpg') || file.name.endsWith('.ico')) continue;

            try {
                const content = await fileSystemService.readFile(file.path);

                // Skip large files
                if (content.length > this.MAX_FILE_SIZE) continue;

                const matches = this.findMatchesInContent(content, query, options);

                if (matches.length > 0) {
                    results.push({
                        file: file.path,
                        filename: file.name,
                        matches
                    });
                }
            } catch (error) {
                console.warn(`Failed to search file ${file.path}`, error);
            }
        }

        return results;
    }

    private async getAllFiles(dirPath: string): Promise<{ path: string; name: string }[]> {
        const result: { path: string; name: string }[] = [];
        const entries = await fileSystemService.listDirectory(dirPath);

        for (const entry of entries) {
            const fullPath = dirPath ? `${dirPath}/${entry.name}` : entry.name;

            if (entry.type === 'file') {
                result.push({ path: fullPath, name: entry.name });
            } else if (entry.type === 'directory') {
                // Skip common huge folders
                if (['node_modules', '.git', 'dist', 'build', '.DS_Store'].includes(entry.name)) continue;

                const subFiles = await this.getAllFiles(fullPath);
                result.push(...subFiles);
            }
        }

        return result;
    }

    private findMatchesInContent(content: string, query: string, options: SearchOptions): SearchMatch[] {
        const matches: SearchMatch[] = [];
        const lines = content.split('\n');

        let regex: RegExp;
        try {
            const flags = options.caseSensitive ? 'g' : 'gi';
            regex = options.useRegex
                ? new RegExp(query, flags)
                : new RegExp(query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), flags); // Escape special chars
        } catch (e) {
            return []; // Invalid regex
        }

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            let match;

            // Reset lastIndex for global regex
            regex.lastIndex = 0;

            while ((match = regex.exec(line)) !== null) {
                matches.push({
                    line: i + 1,
                    column: match.index + 1,
                    text: line,
                    matchText: match[0]
                });

                if (matches.length >= this.MAX_MATCHES_PER_FILE) break;

                // Avoid infinite loop with zero-width matches
                if (match.index === regex.lastIndex) regex.lastIndex++;
            }
        }

        return matches;
    }
}

export const searchService = new SearchService();
