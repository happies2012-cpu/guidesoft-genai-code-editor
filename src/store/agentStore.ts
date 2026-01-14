import { create } from 'zustand';
import type { AgentType, AgentStatus, AgentMessage } from '../services/agents/types';

interface AgentState {
    agents: Record<AgentType, AgentStatus>;
    logs: AgentMessage[];
    activePlanId: string | null;

    updateAgentStatus: (type: AgentType, status: AgentStatus) => void;
    addLog: (message: AgentMessage) => void;
    setActivePlan: (planId: string | null) => void;
}

export const useAgentStore = create<AgentState>((set) => ({
    agents: {
        'ORCHESTRATOR': 'idle',
        'CONTEXT_GATHERER': 'idle',
        'GENERATIVE_AI': 'idle',
        'CODE_EXECUTOR': 'idle',
        'VALIDATOR': 'idle',
        'ITERATION': 'idle',
        'TERMINAL': 'idle',
        'BROWSER': 'idle',
        'DOCUMENTATION': 'idle',
        'DEBUGGING': 'idle',
        'REFACTORING': 'idle',
        'GEN_ANDROID': 'idle',
        'GEN_C': 'idle',
        'GEN_CPP': 'idle',
        'GEN_CSHARP': 'idle',
        'GEN_CSS': 'idle',
        'GEN_EXCEL': 'idle',
        'GEN_HTML': 'idle',
        'GEN_JAVA': 'idle',
        'GEN_JAVASCRIPT': 'idle',
        'GEN_JQUERY': 'idle',
        'GEN_MYSQL': 'idle',
        'GEN_PHP': 'idle',
        'GEN_PYTHON': 'idle',
        'GEN_REGEX': 'idle',
        'GEN_SQL': 'idle',
        'GEN_SQLSERVER': 'idle',
        'GEN_VBNET': 'idle'
    },
    logs: [],
    activePlanId: null,

    updateAgentStatus: (type, status) => set((state) => ({
        agents: { ...state.agents, [type]: status }
    })),

    addLog: (message) => set((state) => ({
        logs: [...state.logs, message]
    })),

    setActivePlan: (planId) => set({ activePlanId: planId })
}));
