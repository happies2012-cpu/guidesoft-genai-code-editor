import type { AgentMessage, AgentType, IAgent } from './types';

export class AgentOrchestrator {
    private agents: Map<AgentType, IAgent> = new Map();
    // private plans: Map<string, AgentPlan> = new Map();

    constructor() {
        // Self-register as orchestrator if needed, but mainly manages others
    }

    private listeners: Set<(message: AgentMessage) => void> = new Set();

    registerAgent(agent: IAgent) {
        this.agents.set(agent.type, agent);
        console.log(`[Orchestrator] Registered agent: ${agent.type}`);
    }

    getAgent(type: AgentType): IAgent | undefined {
        return this.agents.get(type);
    }

    subscribe(listener: (message: AgentMessage) => void) {
        this.listeners.add(listener);
        return () => this.listeners.delete(listener);
    }

    private notifyListeners(message: AgentMessage) {
        this.listeners.forEach(listener => listener(message));
    }

    // Central Message Bus
    dispatch(message: AgentMessage) {
        // console.log(`[Bus] ${message.from} -> ${message.to}: ${message.type}`, message.payload.action);

        // 1. Notify global listeners (e.g. UI, processRequest waiters)
        this.notifyListeners(message);

        // 2. Route to target agent
        const targetAgent = this.agents.get(message.to);
        if (targetAgent) {
            targetAgent.process(message);
        } else {
            console.warn(`[Orchestrator] Target agent not found: ${message.to}`);
        }
    }

    // Entry Point for UI
    async processRequest(userRequest: string): Promise<string> {
        const planId = Math.random().toString(36).substring(7);
        console.log(`[Orchestrator] Processing request: ${userRequest} (Plan: ${planId})`);

        const genAIAgent = this.agents.get('GENERATIVE_AI');
        if (!genAIAgent) throw new Error('Generative AI Agent not initialized');

        return new Promise((resolve, reject) => {
            const cleanup = this.subscribe((msg) => {
                // Check if this message is the completion of OUR task
                // We assume the GenAI agent will send a 'task_completed' message to ORCHESTRATOR with context.planId
                if (msg.to === 'ORCHESTRATOR' &&
                    msg.from === 'GENERATIVE_AI' &&
                    msg.payload.action === 'task_completed' &&
                    msg.payload.context?.planId === planId) {

                    cleanup();
                    resolve(msg.payload.data.result);
                }

                if (msg.payload.action === 'error' && msg.payload.context?.planId === planId) {
                    cleanup();
                    reject(new Error(msg.payload.data.error));
                }
            });

            this.dispatch({
                id: Math.random().toString(),
                from: 'ORCHESTRATOR',
                to: 'GENERATIVE_AI',
                type: 'request',
                timestamp: new Date().toISOString(),
                payload: {
                    action: 'generate_code',
                    data: { prompt: userRequest },
                    context: { planId }
                }
            });
        });
    }
}
