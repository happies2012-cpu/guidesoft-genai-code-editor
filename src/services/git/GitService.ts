import git from 'isomorphic-git';
import LightningFS from '@isomorphic-git/lightning-fs';
import { Buffer } from 'buffer';
import type { GitFileStatus, GitCommitOptions } from './types';

// Polyfill Buffer for the browser environment if needed (Vite usually handles this, but isomorphic-git needs it)
if (typeof window !== 'undefined') {
    (window as any).Buffer = Buffer;
}

const fs = new LightningFS('fs');

class GitService {
    private dir = '/repo';

    constructor() {
        // Ensure directory exists
        this.ensureDir();
    }

    private async ensureDir() {
        try {
            await fs.promises.mkdir(this.dir);
        } catch (e) {
            // Ignore if exists
        }
    }

    async init() {
        await this.ensureDir();
        await git.init({ fs, dir: this.dir });
    }

    /**
     * Mirrors a file from the Editor (Disk) to the Git FS (LightningFS)
     * This is crucial because isomorphic-git operates on LightningFS, not the user's disk.
     */
    async syncFile(path: string, content: string) {
        // Strip the root path if needed, we store everything relative in /repo
        const relativePath = this.getRelativePath(path);

        // Ensure parent dirs exist in FS
        const parts = relativePath.split('/');
        let currentDir = this.dir;
        for (let i = 0; i < parts.length - 1; i++) {
            currentDir += '/' + parts[i];
            try {
                await fs.promises.mkdir(currentDir);
            } catch (e) { }
        }

        await fs.promises.writeFile(`${this.dir}/${relativePath}`, content, 'utf8');
    }

    async getStatus(): Promise<GitFileStatus[]> {
        const statuses: GitFileStatus[] = [];

        const files = await git.listFiles({ fs, dir: this.dir });

        for (const file of files) {
            const status = await git.status({ fs, dir: this.dir, filepath: file });

            // Map git status to our type
            let myStatus: GitFileStatus['status'] = 'unmodified';
            if (status === 'modified') myStatus = 'modified';
            if (status === 'added' || status === '*added') myStatus = 'added';
            if (status === 'deleted') myStatus = 'deleted';
            if (status === 'absent') myStatus = 'untracked'; // Shouldn't happen if in listFiles

            if (myStatus !== 'unmodified') {
                statuses.push({
                    path: file,
                    status: myStatus,
                    staged: status === 'added' || status === 'modified' // Simplified stage logic
                });
            }
        }

        // Check for untracked files (simplification: we rely on syncFile being called)

        return statuses;
    }

    async stageFile(path: string) {
        const relativePath = this.getRelativePath(path);
        await git.add({ fs, dir: this.dir, filepath: relativePath });
    }

    async commit(options: GitCommitOptions) {
        return await git.commit({
            fs,
            dir: this.dir,
            message: options.message,
            author: options.author
        });
    }

    private getRelativePath(path: string): string {
        // Ideally we know the project root. For now, assume path matches 
        // structure or just use filename if flat.
        // If path starts with /, remove it.
        return path.startsWith('/') ? path.slice(1) : path;
    }
}

export const gitService = new GitService();
