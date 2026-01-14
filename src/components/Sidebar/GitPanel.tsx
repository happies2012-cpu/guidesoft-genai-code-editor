import React, { useState, useEffect } from 'react';
import { GitBranch, RefreshCw, Plus, GitCommit } from 'lucide-react';
import { gitService } from '../../services/git/GitService';
import type { GitFileStatus } from '../../services/git/types';

export const GitPanel: React.FC = () => {
    // We can use global store for shared status later, for now we load locally

    const [commitMessage, setCommitMessage] = useState('');
    const [isCommitting, setIsCommitting] = useState(false);
    const [files, setFiles] = useState<GitFileStatus[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadStatus();
    }, []);

    const loadStatus = async () => {
        try {
            await gitService.init(); // Auto-init for now
            const status = await gitService.getStatus();
            setFiles(status);
        } catch (e) {
            setError((e as Error).message);
        }
    };

    const handleStage = async (path: string) => {
        try {
            await gitService.stageFile(path);
            await loadStatus();
        } catch (e) {
            setError((e as Error).message);
        }
    };

    const handleCommit = async () => {
        if (!commitMessage) return;
        setIsCommitting(true);
        try {
            await gitService.commit({
                message: commitMessage,
                author: { name: 'User', email: 'user@example.com' } // TODO: Make configurable
            });
            setCommitMessage('');
            await loadStatus();
        } catch (e) {
            setError((e as Error).message);
        } finally {
            setIsCommitting(false);
        }
    };

    return (
        <div className="flex flex-col h-full bg-dark-bg text-gray-300">
            <div className="p-4 border-b border-white/10 flex justify-between items-center">
                <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-400">Source Control</h2>
                <div className="flex gap-2">
                    <button onClick={loadStatus} className="p-1 hover:bg-white/10 rounded" title="Refresh Status">
                        <RefreshCw size={14} />
                    </button>
                    <button className="p-1 hover:bg-white/10 rounded" title="Checkout Branch">
                        <GitBranch size={14} />
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-2">
                {error && (
                    <div className="p-2 mb-2 bg-red-500/20 text-red-400 text-xs rounded border border-red-500/30">
                        {error}
                    </div>
                )}

                {files.length === 0 ? (
                    <div className="text-center text-gray-500 mt-10 text-sm">
                        No changes detected.
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div>
                            <div className="text-xs font-semibold text-gray-500 mb-2 px-2 uppercase">Changes</div>
                            {files.map(file => (
                                <div key={file.path} className="flex items-center group px-2 py-1 hover:bg-white/5 rounded">
                                    <span className={`mr-2 font-mono font-bold text-[10px] w-4 text-center ${file.status === 'modified' ? 'text-yellow-500' :
                                        file.status === 'added' ? 'text-green-500' :
                                            file.status === 'deleted' ? 'text-red-500' : 'text-gray-500'
                                        }`}>
                                        {file.status === 'modified' ? 'M' : file.status === 'added' ? 'A' : 'D'}
                                    </span>
                                    <span className="text-sm truncate flex-1">{file.path}</span>
                                    <button
                                        onClick={() => handleStage(file.path)}
                                        className="opacity-0 group-hover:opacity-100 p-1 hover:bg-white/10 rounded text-blue-400"
                                        title="Stage Changes"
                                    >
                                        <Plus size={14} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <div className="p-4 border-t border-white/10">
                <textarea
                    className="w-full bg-dark-console text-sm rounded p-2 border border-white/10 focus:border-blue-500 focus:outline-none resize-none h-20 mb-2"
                    placeholder="Message (Cmd+Enter to commit)"
                    value={commitMessage}
                    onChange={e => setCommitMessage(e.target.value)}
                    onKeyDown={e => {
                        if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                            handleCommit();
                        }
                    }}
                />
                <button
                    onClick={handleCommit}
                    disabled={isCommitting || files.length === 0}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium py-2 rounded flex items-center justify-center gap-2"
                >
                    {isCommitting ? <RefreshCw size={14} className="animate-spin" /> : <GitCommit size={14} />}
                    Commit
                </button>
            </div>
        </div>
    );
};
