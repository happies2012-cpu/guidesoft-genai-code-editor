export interface WorkflowStep {
    id: string;
    type: 'prompt' | 'code' | 'review' | 'terminal';
    name: string;
    description?: string;
    params: Record<string, any>;
    dependencies?: string[]; // IDs of steps that must complete first
}

export interface Workflow {
    id: string;
    name: string;
    description: string;
    steps: WorkflowStep[];
    status: 'idle' | 'running' | 'completed' | 'failed';
}

export interface WorkflowResult {
    workflowId: string;
    stepResults: Record<string, any>; // stepId -> result
    finalOutput: any;
}
