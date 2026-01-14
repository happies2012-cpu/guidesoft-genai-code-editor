import { useRef, useEffect } from 'react';
import { useAgentStore } from '../../store/agentStore';
import type { AgentType } from '../../services/agents/types';
import { Activity, Terminal, Shield, Cpu, MessageSquare, Code, Play } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const getAgentIcon = (type: AgentType) => {
    if (type.startsWith('GEN_')) return <Code size={14} className="text-blue-400" />;
    switch (type) {
        case 'ORCHESTRATOR': return <Cpu size={14} className="text-purple-400" />;
        case 'CONTEXT_GATHERER': return <Shield size={14} className="text-yellow-400" />;
        case 'GENERATIVE_AI': return <MessageSquare size={14} className="text-green-400" />;
        case 'CODE_EXECUTOR': return <Play size={14} className="text-red-400" />;
        default: return <Activity size={14} className="text-gray-400" />;
    }
};

const getAgentName = (type: AgentType) => {
    if (type.startsWith('GEN_')) return type.replace('GEN_', '') + ' Gen';
    return type.replace('_', ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
};

export default function AgentStatusPanel() {
    const { agents, logs } = useAgentStore();
    const scrollRef = useRef<HTMLDivElement>(null);

    // Auto-scroll logs
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [logs]);

    const activeAgents = Object.entries(agents).filter(([_, status]) => status !== 'idle');
    // const idleAgents = Object.entries(agents).filter(([_, status]) => status === 'idle');

    return (
        <div className="flex flex-col h-full bg-[#1e1e1e] border-l border-white/10 text-xs font-mono">
            <div className="p-2 border-b border-white/10 bg-black/20 font-bold text-gray-300 flex items-center gap-2">
                <Cpu size={16} /> AGENT SYSTEM v3.0
            </div>

            {/* Active Agents Grid */}
            <div className="p-3 bg-black/10 border-b border-white/10 min-h-[100px]">
                <h3 className="text-gray-500 mb-2 uppercase tracking-wider text-[10px]">Active Agents</h3>
                <div className="grid grid-cols-2 gap-2">
                    <AnimatePresence>
                        {activeAgents.length === 0 && <span className="text-gray-600 italic col-span-2">System Idle</span>}
                        {activeAgents.map(([type, status]) => (
                            <motion.div
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                key={type}
                                className="flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 p-2 rounded"
                            >
                                <div className="animate-pulse">{getAgentIcon(type as AgentType)}</div>
                                <div className="flex flex-col">
                                    <span className="text-blue-300 font-bold truncate max-w-[100px]">{getAgentName(type as AgentType)}</span>
                                    <span className="text-[10px] text-blue-400/60 uppercase">{status}</span>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </div>

            {/* Logs Stream */}
            <div className="flex-1 flex flex-col min-h-0">
                <div className="p-2 bg-black/20 border-b border-white/10 text-gray-500 flex justify-between items-center">
                    <span className="uppercase tracking-wider text-[10px] flex items-center gap-2"><Terminal size={12} /> Activity Log</span>
                </div>
                <div className="flex-1 overflow-y-auto p-2 space-y-1 font-mono text-[11px]" ref={scrollRef}>
                    {logs.map((log) => (
                        <div key={log.id} className="flex gap-2 hover:bg-white/5 p-1 rounded">
                            <span className="text-gray-600 select-none">[{log.timestamp.split('T')[1].split('.')[0]}]</span>
                            <span className={`${log.type === 'error' ? 'text-red-400' : 'text-green-400'} font-bold`}>
                                {log.from === 'ORCHESTRATOR' ? '>' : '<'}
                            </span>
                            <div className="flex-1 break-words">
                                <span className="text-purple-300">{log.from}</span>
                                <span className="text-gray-500 mx-1">→</span>
                                <span className="text-yellow-300">{log.to}</span>
                                <span className="block text-gray-400 mt-0.5 ml-2 border-l border-gray-700 pl-2">
                                    {log.payload.action}
                                </span>
                            </div>
                        </div>
                    ))}
                    {logs.length === 0 && <div className="text-gray-700 text-center mt-10">Use Agent Chat to see activity...</div>}
                </div>
            </div>
        </div>
    );
}
