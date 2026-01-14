export interface GitStatus {
    branch: string;
    modified: string[];
    added: string[];
    deleted: string[];
    untracked: string[];
}

class GitService {
    async getStatus(): Promise<GitStatus> {
        try {
            // In a real desktop app, we'd use simple-git or similar.
            // Here we can simulate it or if we were running in a real dev environment, 
            // we'd use the provided terminal tools.
            // For the web demo, we'll provide a way to sync this.
            return {
                branch: 'master',
                modified: [],
                added: [],
                deleted: [],
                untracked: [],
            };
        } catch (error) {
            console.error('Git status error:', error);
            throw error;
        }
    }
}

export const gitService = new GitService();
