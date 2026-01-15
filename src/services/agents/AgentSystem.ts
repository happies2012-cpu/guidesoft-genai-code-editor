import { AgentOrchestrator } from './AgentOrchestrator';
import { ContextGathererAgent } from './core/ContextGathererAgent';
import { GenerativeAIAgent } from './core/GenerativeAIAgent';
import { CodeExecutorAgent, ValidatorAgent, IterationAgent, TerminalExecutorAgent, BrowserAutomationAgent, DocumentationAgent, DebuggingAgent, RefactoringAgent } from './specialized/SpecializedAgents';
import * as Generators from './generators/LanguageGenerators';

import { useAgentStore } from '../../store/agentStore';

class AgentSystem {
    public orchestrator: AgentOrchestrator;

    constructor() {
        this.orchestrator = new AgentOrchestrator();
        this.initializeAgents();
    }

    private initializeAgents() {
        // Bus Listener for Store Updates
        this.orchestrator.subscribe((message) => {
            const store = useAgentStore.getState();
            store.addLog(message);

            // Simple heuristic for status:
            // If from Orchestrator -> Agent (request), set Agent to working
            // If from Agent -> Orchestrator (response), set Agent to idle
            if (message.type === 'request' && message.to !== 'ORCHESTRATOR') {
                store.updateAgentStatus(message.to, 'working');
            } else if (message.from !== 'ORCHESTRATOR') {
                store.updateAgentStatus(message.from, 'idle');
            }
        });

        const bus = this.orchestrator.dispatch.bind(this.orchestrator);

        // Core Agents
        this.orchestrator.registerAgent(new ContextGathererAgent(bus));
        this.orchestrator.registerAgent(new GenerativeAIAgent(bus));

        // Specialized Agents
        this.orchestrator.registerAgent(new CodeExecutorAgent(bus));
        this.orchestrator.registerAgent(new ValidatorAgent(bus));
        this.orchestrator.registerAgent(new IterationAgent(bus));
        this.orchestrator.registerAgent(new TerminalExecutorAgent(bus));
        this.orchestrator.registerAgent(new BrowserAutomationAgent(bus));
        this.orchestrator.registerAgent(new DocumentationAgent(bus));
        this.orchestrator.registerAgent(new DebuggingAgent(bus));
        this.orchestrator.registerAgent(new RefactoringAgent(bus));

        // Language Generators
        Object.values(Generators).forEach(GeneratorClass => {
            if (typeof GeneratorClass === 'function') {
                // @ts-expect-error - Dynamic instantiation
                this.orchestrator.registerAgent(new GeneratorClass(bus));
            }
        });
    }
}

export const agentSystemInstance = new AgentSystem();
