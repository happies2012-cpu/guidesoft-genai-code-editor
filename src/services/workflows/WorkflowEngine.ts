import { create } from 'zustand';
import type { Workflow, WorkflowResult } from './types';

interface WorkflowState {
    activeWorkflows: Record<string, Workflow>;
    results: Record<string, WorkflowResult>;

    startWorkflow: (workflow: Workflow) => Promise<void>;
    stopWorkflow: (workflowId: string) => void;
}

export const useWorkflowStore = create<WorkflowState>((set) => ({
    activeWorkflows: {},
    results: {},

    startWorkflow: async (workflow) => {
        console.log(`Starting Workflow: ${workflow.name}`);
        set(state => ({
            activeWorkflows: { ...state.activeWorkflows, [workflow.id]: { ...workflow, status: 'running' } }
        }));

        // Mock Execution Loop
        for (const step of workflow.steps) {
            console.log(`Executing Step: ${step.name} (${step.type})`);
            await new Promise(resolve => setTimeout(resolve, 800)); // Simulate work
        }

        set(state => ({
            activeWorkflows: { ...state.activeWorkflows, [workflow.id]: { ...workflow, status: 'completed' } }
        }));
        console.log(`Workflow Completed: ${workflow.name}`);
    },

    stopWorkflow: (workflowId) => {
        set(state => {
            const newWorkflows = { ...state.activeWorkflows };
            delete newWorkflows[workflowId];
            return { activeWorkflows: newWorkflows };
        });
    }
}));
