import React, { useState } from 'react';
import { Sparkles, Send, X } from 'lucide-react';
import { freeAIService } from '../../services/ai/FreeAIModels';

interface InlineAIEditProps {
    isOpen: boolean;
    onClose: () => void;
    selectedText: string;
    onReplace: (newText: string) => void;
}

export const InlineAIEdit: React.FC<InlineAIEditProps> = ({ isOpen, onClose, selectedText, onReplace }) => {
    const [prompt, setPrompt] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedText, setGeneratedText] = useState('');

    const handleGenerate = async () => {
        if (!prompt) return;

        setIsGenerating(true);
        setGeneratedText('');

        try {
            const fullPrompt = `${prompt}\n\nOriginal code:\n${selectedText}`;
            const stream = await freeAIService.generateCode(fullPrompt, 'gemini');

            for await (const chunk of stream) {
                setGeneratedText(prev => prev + chunk);
            }
        } catch (error) {
            setGeneratedText(`// Error: ${error}`);
        } finally {
            setIsGenerating(false);
        }
    };

    const handleAccept = () => {
        if (generatedText) {
            onReplace(generatedText);
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="w-full max-w-4xl bg-[#1a1a1a] border border-white/10 rounded-xl shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-purple-500/10">
                    <div className="flex items-center gap-2">
                        <Sparkles size={18} className="text-purple-400" />
                        <span className="font-bold">Inline AI Edit</span>
                    </div>
                    <button onClick={onClose} className="p-1 hover:bg-white/10 rounded transition-colors">
                        <X size={18} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-4">
                    {/* Original Code */}
                    <div className="mb-4">
                        <label className="block text-sm text-gray-400 mb-2">Selected Code:</label>
                        <pre className="bg-black/50 rounded-lg p-3 text-sm text-gray-300 max-h-32 overflow-auto">
                            {selectedText || 'No code selected'}
                        </pre>
                    </div>

                    {/* Prompt Input */}
                    <div className="mb-4">
                        <label className="block text-sm text-gray-400 mb-2">What do you want to do?</label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                                placeholder="e.g., Add error handling, Refactor to use async/await, Add comments..."
                                className="flex-1 bg-black/50 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none"
                                autoFocus
                            />
                            <button
                                onClick={handleGenerate}
                                disabled={!prompt || isGenerating}
                                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-bold flex items-center gap-2 transition-all"
                            >
                                {isGenerating ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                        Generating...
                                    </>
                                ) : (
                                    <>
                                        <Send size={16} />
                                        Generate
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Generated Code */}
                    {generatedText && (
                        <div className="mb-4">
                            <label className="block text-sm text-gray-400 mb-2">Generated Code:</label>
                            <pre className="bg-black/50 rounded-lg p-3 text-sm text-green-400 max-h-64 overflow-auto">
                                {generatedText}
                            </pre>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex justify-end gap-2">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleAccept}
                            disabled={!generatedText}
                            className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-bold transition-all"
                        >
                            Accept & Replace
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
