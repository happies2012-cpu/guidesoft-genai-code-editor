import { fileSystemService } from '../filesystem/FileSystemService';
import { aiService } from './AIService';
import { COMPOSER_SYSTEM_PROMPT } from './AIPrompts';
import type { AIMessage } from '../../types';

export interface AgentAction {
    type: 'write_file' | 'read_file' | 'list_dir' | 'delete_file' | 'execute_command';
    payload: Record<string, any>;
}

class AgentService {

    /**
     * Parsing the AI response to find action blocks.
     * Format: ```action:command { "json": "payload" } ```
     */
    parseActions(response: string): AgentAction[] {
        const actions: AgentAction[] = [];
        const regex = /```action:(\w+)\s*([\s\S]*?)```/g;

        let match;
        while ((match = regex.exec(response)) !== null) {
            try {
                const type = match[1] as AgentAction['type'];
                const payload = JSON.parse(match[2]);
                actions.push({ type, payload });
            } catch (e) {
                console.error('Failed to parse agent action JSON', e);
            }
        }
        return actions;
    }

    async executeAction(action: AgentAction): Promise<string> {
        try {
            switch (action.type) {
                case 'write_file': {
                    // payload: { path: string, content: string }
                    await fileSystemService.createFile(action.payload.path, action.payload.content);
                    return `Successfully wrote to ${action.payload.path}`;
                }

                case 'read_file': {
                    // payload: { path: string }
                    const content = await fileSystemService.readFile(action.payload.path);
                    return `File Content (${action.payload.path}):\n${content}`;
                }

                case 'list_dir': {
                    // payload: { path: string }
                    const intentPath = action.payload.path || ''; // root if empty
                    const files = await fileSystemService.listDirectory(intentPath);
                    return `Directory Listing (${intentPath || 'root'}):\n${files.map(f => `- ${f.name} (${f.type})`).join('\n')}`;
                }

                default:
                    return `Unknown action type: ${action.type}`;
            }
        } catch (error) {
            return `Error executing ${action.type}: ${(error as Error).message}`;
        }
    }

    /**
     * Primary entry point for "Composer" mode.
     * Sends the prompt with the COMPOSER system prompt.
     */
    async processComposerRequest(userMessage: string, history: AIMessage[]): Promise<{ response: string, actions: AgentAction[] }> {
        // Construct full context with system prompt
        // Note: In a real implementation, we'd manage the prompt array carefully.
        // Here we rely on AIService to take our system prompt override if we pass it,
        // OR we just prepend it to the history for this special call.

        const fullPrompt = `${COMPOSER_SYSTEM_PROMPT}\n\nUser Request: ${userMessage}`;

        const response = await aiService.getCompletion(
            fullPrompt,
            history,
            'anthropic', // default to smartest model for agent
            'claude-3-opus'
        );

        const actions = this.parseActions(response);
        return { response, actions };
    }
}

export const agentService = new AgentService();
