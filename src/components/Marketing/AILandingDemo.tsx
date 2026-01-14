import React, { useState } from 'react';
import { Sparkles, Send, Copy, Check } from 'lucide-react';
import { freeAIService, type AIModel, availableModels } from '../../services/ai/FreeAIModels';

export const AILandingDemo: React.FC = () => {
    const [prompt, setPrompt] = useState('');
    const [generatedCode, setGeneratedCode] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [selectedModel, setSelectedModel] = useState<AIModel>('gemini');
    const [copied, setCopied] = useState(false);

    const samplePrompts = [
        'Create a React login form with validation',
        'Build a REST API endpoint in Node.js',
        'Generate a responsive navbar component',
        'Create a Python function to sort an array'
    ];

    const handleGenerate = async () => {
        if (!prompt || isGenerating) return;

        setIsGenerating(true);
        setGeneratedCode('');

        try {
            const stream = await freeAIService.generateCode(prompt, selectedModel);

            for await (const chunk of stream) {
                setGeneratedCode(prev => prev + chunk);
            }
        } catch (error) {
            setGeneratedCode(`// Error: ${error}`);
        } finally {
            setIsGenerating(false);
        }
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(generatedCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="w-full max-w-6xl mx-auto p-8">
            {/* Header */}
            <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/20 rounded-full border border-purple-500/30 mb-4">
                    <Sparkles size={16} className="text-purple-400" />
                    <span className="text-sm font-medium">Try AI Code Generation</span>
                </div>
                <h2 className="text-4xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-white to-purple-400">
                    Generate Code with AI
                </h2>
                <p className="text-gray-400 text-lg">
                    Type what you want to build, and watch AI write the code for you
                </p>
            </div>

            {/* Demo Interface */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Input Panel */}
                <div className="bg-white/5 rounded-2xl border border-white/10 p-6 backdrop-blur-xl">
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Select AI Model
                        </label>
                        <select
                            value={selectedModel}
                            onChange={(e) => setSelectedModel(e.target.value as AIModel)}
                            className="w-full bg-black/50 border border-white/20 rounded-lg px-4 py-2 text-white focus:border-purple-500 focus:outline-none"
                        >
                            {availableModels.map((model) => (
                                <option key={model.model} value={model.model}>
                                    {model.name} {model.free ? '(Free)' : ''}
                                </option>
                            ))}
                        </select>
                        <p className="text-xs text-gray-500 mt-1">
                            {availableModels.find(m => m.model === selectedModel)?.description}
                        </p>
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            What do you want to build?
                        </label>
                        <textarea
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            placeholder="Example: Create a React component for a todo list"
                            className="w-full h-32 bg-black/50 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none resize-none"
                        />
                    </div>

                    <button
                        onClick={handleGenerate}
                        disabled={!prompt || isGenerating}
                        className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-purple-500/30"
                    >
                        {isGenerating ? (
                            <>
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                Generating...
                            </>
                        ) : (
                            <>
                                <Send size={18} />
                                Generate Code
                            </>
                        )}
                    </button>

                    {/* Sample Prompts */}
                    <div className="mt-6">
                        <p className="text-sm text-gray-400 mb-2">Try these examples:</p>
                        <div className="flex flex-wrap gap-2">
                            {samplePrompts.map((sample, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setPrompt(sample)}
                                    className="text-xs px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full transition-colors"
                                >
                                    {sample}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Output Panel */}
                <div className="bg-white/5 rounded-2xl border border-white/10 p-6 backdrop-blur-xl">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold">Generated Code</h3>
                        {generatedCode && (
                            <button
                                onClick={handleCopy}
                                className="px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-sm flex items-center gap-2 transition-colors"
                            >
                                {copied ? (
                                    <>
                                        <Check size={16} className="text-green-400" />
                                        Copied!
                                    </>
                                ) : (
                                    <>
                                        <Copy size={16} />
                                        Copy
                                    </>
                                )}
                            </button>
                        )}
                    </div>

                    <div className="bg-black/50 rounded-lg p-4 min-h-[300px] max-h-[400px] overflow-auto">
                        {generatedCode ? (
                            <pre className="text-sm font-mono text-green-400 whitespace-pre-wrap">
                                {generatedCode}
                            </pre>
                        ) : (
                            <div className="h-full flex items-center justify-center text-gray-500">
                                <div className="text-center">
                                    <Sparkles size={48} className="mx-auto mb-3 opacity-20" />
                                    <p>Your generated code will appear here</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
