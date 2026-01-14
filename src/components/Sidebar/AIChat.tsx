import { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { Send, Sparkles, Trash2, Settings, Key, Search, Loader2, Copy, FileOutput, Check } from 'lucide-react';
import { useEditorStore } from '../../store/editorStore';
import { aiService } from '../../services/ai/AIService';
import { contextService } from '../../services/ai/ContextService';
import { vectorStoreService } from '../../services/ai/VectorStoreService';
import { agentSystemInstance } from '../../services/agents/AgentSystem';
import type { AIMessage } from '../../types';

export default function AIChat() {
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showApiKeyModal, setShowApiKeyModal] = useState(false);
    const [apiKey, setApiKey] = useState('');
    const [isComposerMode, setIsComposerMode] = useState(false);
    const [pendingImages, setPendingImages] = useState<string[]>([]);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [isScanning, setIsScanning] = useState(false);
    const { aiMessages, addAIMessage, clearAIMessages, selectedProvider, aiProviders, settings, pendingAIAction, clearPendingAIAction, applyAICode } =
        useEditorStore();

    const selectedProviderData = aiProviders.find((p) => p.id === selectedProvider);

    useEffect(() => {
        if (pendingAIAction) {
            const prompt = pendingAIAction.type === 'explain'
                ? `Please explain the following code snippet:\n\n\`\`\`\n${pendingAIAction.code}\n\`\`\``
                : `Please help me find and fix any bugs in this code snippet:\n\n\`\`\`\n${pendingAIAction.code}\n\`\`\``;

            setInput(prompt);
            clearPendingAIAction();
            // We delay handleSend slightly to ensure state is updated
            setTimeout(() => {
                const sendBtn = document.getElementById('ai-send-btn');
                sendBtn?.click();
            }, 100);
        }
    }, [pendingAIAction]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [aiMessages]);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        // Check if API key is set for the provider
        if (selectedProvider !== 'ollama' && !aiService.hasApiKey(selectedProvider)) {
            setShowApiKeyModal(true);
            return;
        }

        const userMessage: AIMessage = {
            id: Date.now().toString(),
            role: 'user',
            content: input,
            timestamp: Date.now(),
        };

        addAIMessage(userMessage);
        const userInput = input;
        const imagesToSend = [...pendingImages];
        setInput('');
        setPendingImages([]);
        setIsLoading(true);

        try {
            // RAG Retrieval
            let augmentedPrompt = userInput;
            const relevantDocs = await vectorStoreService.search(userInput);
            if (relevantDocs.length > 0) {
                const contextBlock = relevantDocs.map(d =>
                    `File: ${d.metadata.path} (Lines ${d.metadata.lineStart}-${d.metadata.lineEnd})\n\`\`\`\n${d.text}\n\`\`\``
                ).join('\n\n');
                augmentedPrompt = `Using the following context from the codebase:\n${contextBlock}\n\nQuestion: ${userInput}`;
                console.log('RAG Context added:', relevantDocs.length, 'chunks');
            }
            // Create AI response message placeholder
            const aiResponseId = (Date.now() + 1).toString();
            const aiResponse: AIMessage = {
                id: aiResponseId,
                role: 'assistant',
                content: '',
                timestamp: Date.now(),
            };
            addAIMessage(aiResponse);

            if (isComposerMode) {
                // COMPOSER MODE FLOW
                // Update specific status
                useEditorStore.setState((state) => ({
                    aiMessages: state.aiMessages.map((msg) =>
                        msg.id === aiResponseId ? { ...msg, content: 'Planning and executing changes...' } : msg
                    ),
                }));

                // Agent System Integration (Phase 16)
                const resultText = await agentSystemInstance.orchestrator.processRequest(augmentedPrompt);

                // Update UI with result
                useEditorStore.setState((state) => ({
                    aiMessages: state.aiMessages.map((msg) =>
                        msg.id === aiResponseId ? {
                            ...msg,
                            content: resultText
                        } : msg
                    ),
                }));
            } else {
                let fullContent = '';
                await aiService.streamComplete(
                    {
                        provider: selectedProvider,
                        model: settings.aiModel,
                        prompt: augmentedPrompt,
                        images: imagesToSend,
                        temperature: 0.7,
                    },
                    (chunk) => {
                        if (!chunk.done) {
                            fullContent += chunk.content;
                            useEditorStore.setState((state) => ({
                                aiMessages: state.aiMessages.map((msg) =>
                                    msg.id === aiResponseId ? { ...msg, content: fullContent } : msg
                                ),
                            }));
                        }
                    }
                );
            }

            setIsLoading(false);
        } catch (error) {
            console.error('AI completion error:', error);
            const errorMessage: AIMessage = {
                id: (Date.now() + 2).toString(),
                role: 'assistant',
                content: `Error: ${error instanceof Error ? error.message : 'Failed to get AI response'}.`,
                timestamp: Date.now(),
            };
            addAIMessage(errorMessage);
            setIsLoading(false);
        }
    };

    const handleSaveApiKey = () => {
        if (apiKey.trim()) {
            aiService.setApiKey(selectedProvider, apiKey.trim());
            setShowApiKeyModal(false);
            setApiKey('');
        }
    };

    const handleScanWorkspace = async () => {
        setIsScanning(true);
        try {
            await contextService.refreshContext();
            await vectorStoreService.indexWorkspace(); // New RAG Indexing
            alert('Workspace indexed for Semantic Search!');
            console.log('Workspace scanned and indexed successfully');
        } catch (error) {
            console.error('Scan failed:', error);
            alert('Scan failed: ' + (error as Error).message);
        } finally {
            setIsScanning(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const handleFileRead = (file: File) => {
        if (!file.type.startsWith('image/')) return;
        const reader = new FileReader();
        reader.onload = (e) => {
            if (typeof e.target?.result === 'string') {
                setPendingImages(prev => [...prev, e.target!.result as string]);
            }
        };
        reader.readAsDataURL(file);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        if (e.dataTransfer.files) {
            Array.from(e.dataTransfer.files).forEach(handleFileRead);
        }
    };

    const handlePaste = (e: React.ClipboardEvent) => {
        if (e.clipboardData.files) {
            Array.from(e.clipboardData.files).forEach(handleFileRead);
        }
    };

    // Custom Code Block component with Apply button
    const CodeBlock = ({ inline, className, children, ...props }: any) => {
        const [copied, setCopied] = useState(false);
        const code = String(children).replace(/\n$/, '');
        const match = /language-(\w+)/.exec(className || '');

        const handleCopy = () => {
            navigator.clipboard.writeText(code);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        };

        const handleApply = () => {
            applyAICode(code);
            alert('Code applied to active file!');
        };

        if (inline) {
            return <code className="bg-dark-bg px-1 rounded text-orange-400" {...props}>{children}</code>;
        }

        return (
            <div className="relative group my-2 border border-dark-border rounded-lg overflow-hidden">
                <div className="flex items-center justify-between px-3 py-1.5 bg-dark-bg/50 border-b border-dark-border">
                    <span className="text-xs text-gray-400 uppercase font-medium">{match ? match[1] : 'code'}</span>
                    <div className="flex gap-2">
                        <button
                            onClick={handleCopy}
                            className="p-1 hover:bg-dark-hover rounded transition-colors text-gray-400 hover:text-white"
                            title="Copy code"
                        >
                            {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                        </button>
                        <button
                            onClick={handleApply}
                            className="p-1 hover:bg-dark-hover rounded transition-colors text-primary-500 hover:text-primary-400"
                            title="Apply to active file"
                        >
                            <FileOutput size={14} />
                        </button>
                    </div>
                </div>
                <div className="p-3 bg-dark-bg/30 text-xs font-mono overflow-x-auto custom-scrollbar">
                    <pre><code className={className} {...props}>{children}</code></pre>
                </div>
            </div>
        );
    };

    return (
        <div className="flex flex-col h-full bg-dark-surface border-l border-dark-border">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-dark-border">
                <div className="flex items-center gap-2">
                    <Sparkles className="text-primary-500" size={20} />
                    <h2 className="font-semibold">AI Assistant</h2>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={handleScanWorkspace}
                        disabled={isScanning}
                        className={`p-2 hover:bg-dark-hover rounded transition-colors ${isScanning ? 'animate-spin' : ''}`}
                        title="Scan Workspace for Context"
                    >
                        {isScanning ? <Loader2 size={16} /> : <Search size={16} />}
                    </button>
                    <button
                        onClick={clearAIMessages}
                        className="p-2 hover:bg-dark-hover rounded transition-colors"
                        title="Clear chat"
                    >
                        <Trash2 size={16} />
                    </button>
                    <button
                        onClick={() => setShowApiKeyModal(true)}
                        className="p-2 hover:bg-dark-hover rounded transition-colors"
                        title="API Key Settings"
                    >
                        <Settings size={16} />
                    </button>
                </div>
            </div>

            {/* Provider Info & Composer Toggle */}
            <div className="px-4 py-2 bg-dark-bg border-b border-dark-border flex justify-between items-center">
                <p className="text-xs text-gray-400">
                    Using: <span className="text-primary-500">{selectedProviderData?.name}</span>
                    {selectedProvider !== 'ollama' && !aiService.hasApiKey(selectedProvider) && (
                        <span className="text-yellow-500 ml-2">(API key not set)</span>
                    )}
                </p>
                <button
                    onClick={() => setIsComposerMode(!isComposerMode)}
                    className={`text-xs px-2 py-1 rounded border transition-colors ${isComposerMode
                        ? 'bg-purple-500/20 border-purple-500 text-purple-400'
                        : 'border-white/10 text-gray-500 hover:text-white'
                        }`}
                >
                    {isComposerMode ? 'Composer: ON' : 'Composer: OFF'}
                </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-4">
                {aiMessages.length === 0 ? (
                    <div className="flex items-center justify-center h-full text-center text-gray-500">
                        <div>
                            <Sparkles className="mx-auto mb-4 text-primary-500" size={48} />
                            <h3 className="text-lg font-semibold mb-2">AI Assistant Ready</h3>
                            <p className="text-sm">
                                Ask me anything about your code, request explanations, or get help with debugging.
                            </p>
                        </div>
                    </div>
                ) : (
                    <>
                        {aiMessages.map((message) => (
                            <div
                                key={message.id}
                                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-[90%] rounded-lg p-3 ${message.role === 'user'
                                        ? 'bg-primary-600 text-white shadow-lg'
                                        : 'bg-dark-bg text-gray-200 border border-dark-border'
                                        }`}
                                >
                                    <div className="markdown-content">
                                        <ReactMarkdown
                                            components={{
                                                code: CodeBlock,
                                            }}
                                        >
                                            {message.content}
                                        </ReactMarkdown>
                                    </div>
                                    <p className="text-[10px] opacity-40 mt-2 text-right">
                                        {new Date(message.timestamp).toLocaleTimeString()}
                                    </p>
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="bg-dark-bg rounded-lg p-3">
                                    <div className="flex gap-1">
                                        <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" />
                                        <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce delay-100" />
                                        <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce delay-200" />
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </>
                )}
            </div>

            {/* Input */}
            <div
                className="p-4 border-t border-dark-border"
                onDrop={handleDrop}
                onDragOver={e => e.preventDefault()}
            >
                {pendingImages.length > 0 && (
                    <div className="flex gap-2 mb-2 overflow-x-auto pb-2">
                        {pendingImages.map((img, idx) => (
                            <div key={idx} className="relative group flex-shrink-0">
                                <img src={img} alt="Preview" className="h-16 w-16 object-cover rounded border border-white/20" />
                                <button
                                    onClick={() => setPendingImages(prev => prev.filter((_, i) => i !== idx))}
                                    className="absolute -top-1 -right-1 bg-red-500 rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <Trash2 size={10} className="text-white" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
                <div className="flex gap-2">
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        onPaste={handlePaste}
                        placeholder="Ask AI anything... (Drag images here)"
                        className="flex-1 bg-dark-bg border border-dark-border rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary-500 custom-scrollbar"
                        rows={3}
                    />
                    <button
                        id="ai-send-btn"
                        onClick={handleSend}
                        disabled={!input.trim() || isLoading}
                        className="px-4 py-2 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-700 disabled:cursor-not-allowed rounded-lg transition-colors ai-glow"
                    >
                        <Send size={18} />
                    </button>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                    Press Enter to send, Shift+Enter for new line
                </p>
            </div>

            {/* API Key Modal */}
            {showApiKeyModal && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-dark-surface border border-dark-border rounded-lg p-6 w-96">
                        <div className="flex items-center gap-2 mb-4">
                            <Key className="text-primary-500" size={24} />
                            <h3 className="text-lg font-semibold">Set API Key</h3>
                        </div>
                        <p className="text-sm text-gray-400 mb-4">
                            Enter your API key for {selectedProviderData?.name}
                        </p>
                        <input
                            type="password"
                            value={apiKey}
                            onChange={(e) => setApiKey(e.target.value)}
                            placeholder="sk-..."
                            className="w-full bg-dark-bg border border-dark-border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 mb-4"
                            autoFocus
                        />
                        <div className="flex gap-2 justify-end">
                            <button
                                onClick={() => {
                                    setShowApiKeyModal(false);
                                    setApiKey('');
                                }}
                                className="px-4 py-2 bg-dark-hover rounded hover:bg-dark-border transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSaveApiKey}
                                className="px-4 py-2 bg-primary-600 hover:bg-primary-700 rounded transition-colors"
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
