import React from 'react';
import { Split } from 'lucide-react';

export const ComposerCanvas: React.FC = () => {
    return (
        <div className="h-full flex text-gray-400 justify-center items-center flex-col gap-4">
            <Split size={48} className="opacity-20" />
            <p>Multi-File Agent Workspace</p>
            <div className="text-xs opacity-50">Drag files here to edit together</div>
        </div>
    );
};
