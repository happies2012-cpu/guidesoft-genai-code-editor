import React, { useState } from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';

export const InlineAIOverlay: React.FC<{ visible: boolean; onClose: () => void }> = ({ visible, onClose }) => {
    const [prompt, setPrompt] = useState('');
    if (!visible) return null;

    return (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[500px] z-50 animate-in fade-in slide-in-from-top-2">
            <div className="bg-[#1e1e1e] border border-blue-500/50 rounded-lg shadow-2xl overflow-hidden">
                <div className="flex items-center gap-3 p-3">
                    <Sparkles className="text-blue-400" size={18} />
                    <input 
                        autoFocus
                        value={prompt}
                        onChange={e => setPrompt(e.target.value)}
                        placeholder="Edit selection with AI..."
                        className="flex-1 bg-transparent outline-none text-white text-sm"
                        onKeyDown={e => e.key === 'Escape' && onClose()}
                    />
                    <button className="p-1.5 bg-blue-600 rounded text-white hover:bg-blue-700">
                        <ArrowRight size={14} />
                    </button>
                </div>
            </div>
        </div>
    );
};
