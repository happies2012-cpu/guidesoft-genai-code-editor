export type AgentType =
    | 'ORCHESTRATOR'
    | 'CONTEXT_GATHERER'
    | 'GENERATIVE_AI'
    | 'CODE_EXECUTOR'
    | 'VALIDATOR'
    | 'ITERATION'
    | 'TERMINAL'
    | 'BROWSER'
    | 'DOCUMENTATION'
    | 'DEBUGGING'
    | 'REFACTORING'
    | 'GEN_ANDROID'
    | 'GEN_C'
    | 'GEN_CPP'
    | 'GEN_CSHARP'
    | 'GEN_CSS'
    | 'GEN_EXCEL'
    | 'GEN_HTML'
    | 'GEN_JAVA'
    | 'GEN_JAVASCRIPT'
    | 'GEN_JQUERY'
    | 'GEN_MYSQL'
    | 'GEN_PHP'
    | 'GEN_PYTHON'
    | 'GEN_REGEX'
    | 'GEN_SQL'
    | 'GEN_SQLSERVER'
    | 'GEN_VBNET';

export type AgentStatus = 'idle' | 'working' | 'waiting' | 'error' | 'success';

export interface AgentMessage {
    id: string;
    from: AgentType;
    to: AgentType;
    type: 'request' | 'response' | 'notification' | 'error';
    payload: {
        action: string;
        data?: any;
        context?: any;
        priority?: 'high' | 'medium' | 'low';
    };
    timestamp: string;
}

export interface AgentTask {
    id: string;
    description: string;
    assignedTo?: AgentType;
    status: 'pending' | 'in-progress' | 'completed' | 'failed';
    dependencies?: string[];
    result?: any;
}

export interface AgentPlan {
    id: string;
    originalRequest: string;
    tasks: AgentTask[];
    status: 'planning' | 'executing' | 'completed' | 'failed';
}

export interface IAgent {
    id: string;
    type: AgentType;
    status: AgentStatus;

    process(message: AgentMessage): Promise<void>;
    registerHandler(action: string, handler: (data: any, context?: any) => Promise<any>): void;
}
