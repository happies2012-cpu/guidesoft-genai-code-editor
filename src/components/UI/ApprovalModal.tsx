import { useApprovalStore } from '../../store/approvalStore';
import { AlertTriangle, Check, X, FileCode, Terminal } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ApprovalData {
    path?: string;
    content?: string;
    command?: string;
    [key: string]: unknown;
}

export default function ApprovalModal() {
    const { pendingRequests, approveRequest, rejectRequest } = useApprovalStore();

    if (pendingRequests.length === 0) return null;

    // Handle one request at a time
    const request = pendingRequests[0];

    return (
        <AnimatePresence>
            <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-[#1e1e1e] border border-orange-500/50 rounded-lg shadow-2xl w-full max-w-2xl overflow-hidden"
                >
                    {/* Header */}
                    <div className="bg-orange-500/10 border-b border-orange-500/20 p-4 flex items-center gap-3">
                        <div className="p-2 bg-orange-500/20 rounded-full text-orange-400 animate-pulse">
                            <AlertTriangle size={24} />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-orange-100">Action Approval Required</h3>
                            <p className="text-xs text-orange-300/70">The agent is requesting permission to execute an action.</p>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                        <div className="mb-4">
                            <div className="flex items-center gap-2 text-sm text-gray-400 mb-1 uppercase tracking-wider font-bold">
                                {request.type === 'file_write' ? <FileCode size={16} /> : <Terminal size={16} />}
                                {request.type === 'file_write' ? 'Write to File' : request.type === 'command_exec' ? 'Execute Command' : 'Action'}
                            </div>
                            <div className="text-xl text-white font-medium mb-4">{request.description}</div>
                        </div>

                        {/* Code/Data Preview */}
                        <div className="bg-black/50 rounded p-4 border border-white/5 font-mono text-sm overflow-auto max-h-60">
                            <pre className="text-gray-300">
                                {request.type === 'file_write'
                                    ? `// ${(request.data as ApprovalData).path}\n\n${(request.data as ApprovalData).content}`
                                    : (request.data as ApprovalData).command || JSON.stringify(request.data, null, 2)
                                }
                            </pre>
                        </div>
                    </div>

                    {/* Footer / Actions */}
                    <div className="p-4 bg-black/20 border-t border-white/5 flex justify-end gap-3">
                        <button
                            onClick={() => rejectRequest(request.id)}
                            className="flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 rounded transition-colors"
                        >
                            <X size={18} />
                            Reject
                        </button>
                        <button
                            onClick={() => approveRequest(request.id)}
                            className="flex items-center gap-2 px-6 py-2 bg-green-500 hover:bg-green-600 text-white font-bold rounded shadow-lg shadow-green-500/20 transition-all hover:scale-105"
                        >
                            <Check size={18} />
                            Approve
                        </button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
