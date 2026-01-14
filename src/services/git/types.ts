export interface GitFileStatus {
    path: string;
    status: 'modified' | 'added' | 'deleted' | 'untracked' | 'unmodified';
    staged: boolean;
}

export interface GitCommitOptions {
    message: string;
    author: {
        name: string;
        email: string;
    };
}
