// File System Service using File System Access API

interface FileSystemAccessWindow extends Window {
    showDirectoryPicker(options?: { mode?: 'read' | 'readwrite' }): Promise<FileSystemDirectoryHandle>;
}

export class FileSystemService {
    private directoryHandle: FileSystemDirectoryHandle | null = null;

    async openDirectory(): Promise<FileSystemDirectoryHandle> {
        try {
            const handle = await (window as unknown as FileSystemAccessWindow).showDirectoryPicker({
                mode: 'readwrite',
            });
            this.directoryHandle = handle;
            return handle;
        } catch (error) {
            throw new Error('Failed to open directory: ' + (error as Error).message);
        }
    }

    async readFile(path: string): Promise<string> {
        if (!this.directoryHandle) {
            throw new Error('No directory opened');
        }

        try {
            const fileHandle = await this.getFileHandle(path);
            const file = await fileHandle.getFile();
            return await file.text();
        } catch (error) {
            throw new Error('Failed to read file: ' + (error as Error).message);
        }
    }

    async writeFile(path: string, content: string): Promise<void> {
        if (!this.directoryHandle) {
            throw new Error('No directory opened');
        }

        try {
            const fileHandle = await this.getFileHandle(path, true);
            const writable = await fileHandle.createWritable();
            await writable.write(content);
            await writable.close();
        } catch (error) {
            throw new Error('Failed to write file: ' + (error as Error).message);
        }
    }

    async createFile(path: string, content: string = ''): Promise<void> {
        await this.writeFile(path, content);
    }

    async deleteFile(path: string): Promise<void> {
        if (!this.directoryHandle) {
            throw new Error('No directory opened');
        }

        try {
            const parts = path.split('/').filter(p => p);
            const fileName = parts.pop()!;
            const dirHandle = await this.getDirectoryHandle(parts);
            await dirHandle.removeEntry(fileName);
        } catch (error) {
            throw new Error('Failed to delete file: ' + (error as Error).message);
        }
    }

    async renameFile(oldPath: string, newPath: string): Promise<void> {
        // File System Access API doesn't support rename directly
        // We need to copy and delete
        const content = await this.readFile(oldPath);
        await this.createFile(newPath, content);
        await this.deleteFile(oldPath);
    }

    async createDirectory(path: string): Promise<void> {
        if (!this.directoryHandle) {
            throw new Error('No directory opened');
        }

        try {
            const parts = path.split('/').filter(p => p);
            await this.getDirectoryHandle(parts, true);
        } catch (error) {
            throw new Error('Failed to create directory: ' + (error as Error).message);
        }
    }

    async deleteDirectory(path: string): Promise<void> {
        if (!this.directoryHandle) {
            throw new Error('No directory opened');
        }

        try {
            const parts = path.split('/').filter(p => p);
            const dirName = parts.pop()!;
            const parentHandle = await this.getDirectoryHandle(parts);
            await parentHandle.removeEntry(dirName, { recursive: true });
        } catch (error) {
            throw new Error('Failed to delete directory: ' + (error as Error).message);
        }
    }

    async listDirectory(path: string = ''): Promise<{ name: string; type: 'file' | 'directory' }[]> {
        if (!this.directoryHandle) {
            throw new Error('No directory opened');
        }

        try {
            const parts = path.split('/').filter(p => p);
            const dirHandle = parts.length > 0
                ? await this.getDirectoryHandle(parts)
                : this.directoryHandle;

            const entries: { name: string; type: 'file' | 'directory' }[] = [];

            // @ts-expect-error - WebKit API specific - TS definition might vary for async iterator
            for await (const [name, handle] of dirHandle.entries()) {
                entries.push({
                    name: name,
                    type: handle.kind === 'directory' ? 'directory' : 'file',
                });
            }

            return entries.sort((a, b) => {
                // Directories first, then files
                if (a.type !== b.type) {
                    return a.type === 'directory' ? -1 : 1;
                }
                return a.name.localeCompare(b.name);
            });
        } catch (error) {
            throw new Error('Failed to list directory: ' + (error as Error).message);
        }
    }

    async listAllFiles(dirPath: string = ''): Promise<{ name: string; path: string }[]> {
        const entries = await this.listDirectory(dirPath);
        let results: { name: string; path: string }[] = [];

        for (const entry of entries) {
            const fullPath = dirPath ? `${dirPath}/${entry.name}` : entry.name;
            if (entry.type === 'file') {
                results.push({ name: entry.name, path: fullPath });
            } else {
                if (entry.name === 'node_modules' || entry.name === '.git' || entry.name === 'dist') continue; // Simple exclusion
                const subFiles = await this.listAllFiles(fullPath);
                results = results.concat(subFiles);
            }
        }
        return results;
    }

    private async getFileHandle(
        path: string,
        create: boolean = false
    ): Promise<FileSystemFileHandle> {
        const parts = path.split('/').filter(p => p);
        const fileName = parts.pop()!;
        const dirHandle = await this.getDirectoryHandle(parts);
        return await dirHandle.getFileHandle(fileName, { create });
    }

    private async getDirectoryHandle(
        parts: string[],
        create: boolean = false
    ): Promise<FileSystemDirectoryHandle> {
        let currentHandle = this.directoryHandle!;

        for (const part of parts) {
            currentHandle = await currentHandle.getDirectoryHandle(part, { create });
        }

        return currentHandle;
    }

    hasDirectoryOpen(): boolean {
        return this.directoryHandle !== null;
    }

    getDirectoryName(): string | null {
        return this.directoryHandle?.name || null;
    }
}

export const fileSystemService = new FileSystemService();
