import { create } from 'zustand';

export interface ApprovalRequest {
    id: string;
    type: 'file_write' | 'command_exec' | 'file_delete';
    description: string;
    data: unknown;
    resolve: (value: boolean) => void;
}

interface ApprovalState {
    pendingRequests: ApprovalRequest[];
    requireApproval: boolean;

    setRequireApproval: (enabled: boolean) => void;
    requestApproval: (type: ApprovalRequest['type'], description: string, data: unknown) => Promise<boolean>;
    approveRequest: (id: string) => void;
    rejectRequest: (id: string) => void;
}

export const useApprovalStore = create<ApprovalState>((set, get) => ({
    pendingRequests: [],
    requireApproval: true, // Default to Supervised Mode

    setRequireApproval: (enabled) => set({ requireApproval: enabled }),

    requestApproval: (type, description, data) => {
        const { requireApproval } = get();
        if (!requireApproval) return Promise.resolve(true);

        return new Promise((resolve) => {
            const id = Math.random().toString(36).substring(7);
            set((state) => ({
                pendingRequests: [...state.pendingRequests, { id, type, description, data, resolve }]
            }));
        });
    },

    approveRequest: (id) => {
        const req = get().pendingRequests.find(r => r.id === id);
        if (req) {
            req.resolve(true);
            set((state) => ({ pendingRequests: state.pendingRequests.filter(r => r.id !== id) }));
        }
    },

    rejectRequest: (id) => {
        const req = get().pendingRequests.find(r => r.id === id);
        if (req) {
            req.resolve(false);
            set((state) => ({ pendingRequests: state.pendingRequests.filter(r => r.id !== id) }));
        }
    }
}));
