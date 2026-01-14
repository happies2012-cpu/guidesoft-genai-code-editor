import { BaseAgent } from '../BaseAgent';
import type { AgentType } from '../types';
import { agentService } from '../../ai/AgentService';
// We might need to mock or reuse AIMessage types
import type { AIMessage } from '../../../types';

export class GenerativeAIAgent extends BaseAgent {
    public type: AgentType = 'GENERATIVE_AI';

    constructor(messageBus: any) {
        super(messageBus);
        this.registerHandler('generate_code', this.generateCode.bind(this));
    }

    private async generateCode(data: { prompt: string }, context?: any) {
        console.log('[GenerativeAI] working on:', data.prompt);

        try {
            // Reusing existing powerful Agent Logic
            // We need to construct a fake conversation history for the agentService if it expects one
            const mockHistory: AIMessage[] = [];

            // Or better, we delegate to AgentService's processComposerRequest 
            // processComposerRequest returns { response: string, actions: any[] }

            // Note: AgentService might need UI state updates (useEditorStore) which we can't do easily here.
            // Ideally AgentService is pure logic. It seems tied to store?
            // "Updated AIChat.tsx to enable Composer Mode... modified handleSend to use agentService"
            // Let's check AgentService.ts to see if it's pure or specific.
            // Assuming it's relatively pure or we can use it.

            const result = await agentService.processComposerRequest(data.prompt, mockHistory);

            // Execute actions? agentService returns actions but doesn't execute them fully? 
            // In AIChat, we loop and execute `agentService.executeAction`.
            // We should do that here too.

            let executionLog = '';
            for (const action of result.actions) {
                const output = await agentService.executeAction(action);
                executionLog += `Action: ${action.type} -> ${output}\n`;
            }

            const finalResponse = result.response + '\n\n' + executionLog;

            // Notify completion
            this.send({
                to: 'ORCHESTRATOR',
                type: 'response',
                payload: {
                    action: 'task_completed',
                    data: { result: finalResponse },
                    context: context // Pass back planId
                }
            });

            return finalResponse;

        } catch (error) {
            this.send({
                to: 'ORCHESTRATOR',
                type: 'error',
                payload: {
                    action: 'error',
                    data: { error: (error as Error).message },
                    context: context
                }
            });
            throw error;
        }
    }
}
