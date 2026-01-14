import React, { useEffect } from 'react';

interface GhostTextProps {
    suggestion: string;
    onAccept: () => void;
    onReject: () => void;
}

export const GhostText: React.FC<GhostTextProps> = ({ suggestion, onAccept, onReject }) => {
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Tab' && suggestion) {
                e.preventDefault();
                onAccept();
            } else if (e.key === 'Escape') {
                onReject();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [suggestion, onAccept, onReject]);

    if (!suggestion) return null;

    return (
        <span className="text-gray-500 italic opacity-60">
            {suggestion}
            <span className="ml-2 text-xs bg-blue-500/20 px-2 py-1 rounded">
                Tab to accept
            </span>
        </span>
    );
};

// AI Autocomplete Service
export const aiAutocompleteService = {
    getSuggestion: async (): Promise<string> => {
        // Simulate AI suggestion
        await new Promise(r => setTimeout(r, 300));

        const suggestions = [
            'const result = await fetch(url);',
            'return data.map(item => item.id);',
            'if (error) { console.error(error); }',
            'export default function Component() {',
        ];

        return suggestions[Math.floor(Math.random() * suggestions.length)];
    },
};
