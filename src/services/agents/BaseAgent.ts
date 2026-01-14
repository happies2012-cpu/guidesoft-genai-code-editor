import type { AgentType, AgentStatus, AgentMessage, IAgent } from './types';

type MessageHandler = (data: any, context?: any) => Promise<any>;

export abstract class BaseAgent implements IAgent {
    public id: string;
    public abstract type: AgentType;
    public status: AgentStatus = 'idle';

    private handlers: Map<string, MessageHandler> = new Map();
    protected messageBus: (message: AgentMessage) => void;

    constructor(messageBus: (message: AgentMessage) => void) {
        this.id = Math.random().toString(36).substring(7);
        this.messageBus = messageBus;
    }

    registerHandler(action: string, handler: MessageHandler) {
        this.handlers.set(action, handler);
    }

    async process(message: AgentMessage): Promise<void> {
        try {
            const handler = this.handlers.get(message.payload.action);
            if (!handler) {
                console.warn(`[${this.type}] No handler for action: ${message.payload.action}`);
                return;
            }

            this.updateStatus('working');
            await handler(message.payload.data, message.payload.context);
            this.updateStatus('idle');

        } catch (error) {
            console.error(`[${this.type}] Error processing message:`, error);
            this.updateStatus('error');

            // Notify orchestrator of error
            this.send({
                to: 'ORCHESTRATOR',
                type: 'error',
                payload: {
                    action: 'error_report',
                    data: { error: (error as Error).message, originalMessageId: message.id }
                }
            });
        }
    }

    protected send(message: Omit<AgentMessage, 'id' | 'from' | 'timestamp'>) {
        const fullMessage: AgentMessage = {
            id: Math.random().toString(36).substring(7),
            from: this.type,
            timestamp: new Date().toISOString(),
            ...message
        };
        this.messageBus(fullMessage);
    }

    protected updateStatus(status: AgentStatus) {
        this.status = status;
        // Optionally notify orchestrator of status change
    }
}
