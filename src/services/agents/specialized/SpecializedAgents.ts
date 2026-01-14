import { BaseAgent } from '../BaseAgent';
import type { AgentType, AgentMessage } from '../types';
import { agentService } from '../../ai/AgentService';
import type { AgentAction } from '../../ai/AgentService';
import { useApprovalStore } from '../../../store/approvalStore';

export class CodeExecutorAgent extends BaseAgent {
    type: AgentType = 'CODE_EXECUTOR';

    constructor(messageBus: (message: AgentMessage) => void) {
        super(messageBus);
        this.registerHandler('execute_actions', this.execute.bind(this));
    }

    private async execute(data: { actions: AgentAction[] }) {
        const results = [];
        for (const action of data.actions) {
            // Approval Gate
            if (action.type === 'write_file' || action.type === 'delete_file') {
                const approved = await useApprovalStore.getState().requestApproval(
                    action.type === 'write_file' ? 'file_write' : 'file_delete',
                    `Requested to ${action.type === 'write_file' ? 'write to' : 'delete'} ${action.payload.path || 'a file'}`,
                    action.type === 'write_file' ? { path: action.payload.path, content: action.payload.content } : { path: action.payload.path }
                );

                if (!approved) {
                    results.push({ action, success: false, error: 'User denied permission' });
                    continue;
                }
            }

            try {
                const output = await agentService.executeAction(action);
                results.push({ action, success: true, output });
            } catch (e) {
                results.push({ action, success: false, error: (e as Error).message });
            }
        }
        return results;
    }
}

export class ValidatorAgent extends BaseAgent {
    type: AgentType = 'VALIDATOR';

    constructor(messageBus: (message: AgentMessage) => void) {
        super(messageBus);
        this.registerHandler('validate', this.validate.bind(this));
    }

    private async validate() {
        // Placeholder for syntax validation / linting logic
        return { valid: true, errors: [] };
    }
}

export class IterationAgent extends BaseAgent {
    type: AgentType = 'ITERATION';

    constructor(messageBus: (message: AgentMessage) => void) {
        super(messageBus);
        this.registerHandler('analyze_feedback', this.analyze.bind(this));
    }

    private async analyze() {
        // AI Logic to suggest fixes
        return { suggestion: 'Fix lines...' };
    }
}

export class TerminalExecutorAgent extends BaseAgent {
    type: AgentType = 'TERMINAL';

    constructor(messageBus: (message: AgentMessage) => void) {
        super(messageBus);
        this.registerHandler('run_command', this.runCommand.bind(this));
    }

    private async runCommand(data: { command: string }) {
        // Approval Gate
        const approved = await useApprovalStore.getState().requestApproval(
            'command_exec',
            'Requested to execute a shell command',
            { command: data.command }
        );

        if (!approved) {
            return { output: '', error: 'User denied permission' };
        }

        // In a browser environment, we use WebContainer or similar. 
        // For now, let's assume agentService has a capability or we stub it.
        // agentService.executeAction({ type: 'command', command: data.command })
        return { output: 'Command execution simulated/delegated' };
    }
}

export class BrowserAutomationAgent extends BaseAgent {
    type: AgentType = 'BROWSER';
    constructor(messageBus: (message: AgentMessage) => void) { super(messageBus); }
}

export class DocumentationAgent extends BaseAgent {
    type: AgentType = 'DOCUMENTATION';
    constructor(messageBus: (message: AgentMessage) => void) { super(messageBus); }
}

export class DebuggingAgent extends BaseAgent {
    type: AgentType = 'DEBUGGING';
    constructor(messageBus: (message: AgentMessage) => void) { super(messageBus); }
}

export class RefactoringAgent extends BaseAgent {
    type: AgentType = 'REFACTORING';
    constructor(messageBus: (message: AgentMessage) => void) { super(messageBus); }
}
