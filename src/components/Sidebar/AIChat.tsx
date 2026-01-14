import { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, Trash2, Settings } from 'lucide-react';
import { useEditorStore } from '../../store/editorStore';
import type { AIMessage } from '../../types';

export default function AIChat() {
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const { aiMessages, addAIMessage, clearAIMessages, selectedProvider, aiProviders } =
        useEditorStore();

    const selectedProviderData = aiProviders.find((p) => p.id === selectedProvider);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [aiMessages]);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage: AIMessage = {
            id: Date.now().toString(),
            role: 'user',
            content: input,
            timestamp: Date.now(),
        };

        addAIMessage(userMessage);
        setInput('');
        setIsLoading(true);

        // TODO: Implement actual AI API call
        // For now, simulate a response
        setTimeout(() => {
            const aiResponse: AIMessage = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: `This is a simulated response. AI integration will be implemented in the next phase.\n\nYou asked: "${input}"\n\nProvider: ${selectedProviderData?.name}`,
                timestamp: Date.now(),
            };
            addAIMessage(aiResponse);
            setIsLoading(false);
        }, 1000);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
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
                        onClick={clearAIMessages}
                        className="p-2 hover:bg-dark-hover rounded transition-colors"
                        title="Clear chat"
                    >
                        <Trash2 size={16} />
                    </button>
                    <button
                        className="p-2 hover:bg-dark-hover rounded transition-colors"
                        title="Settings"
                    >
                        <Settings size={16} />
                    </button>
                </div>
            </div>

            {/* Provider Info */}
            <div className="px-4 py-2 bg-dark-bg border-b border-dark-border">
                <p className="text-xs text-gray-400">
                    Using: <span className="text-primary-500">{selectedProviderData?.name}</span>
                </p>
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
                                    className={`max-w-[80%] rounded-lg p-3 ${message.role === 'user'
                                            ? 'bg-primary-600 text-white'
                                            : 'bg-dark-bg text-gray-200'
                                        }`}
                                >
                                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                                    <p className="text-xs opacity-60 mt-1">
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
            <div className="p-4 border-t border-dark-border">
                <div className="flex gap-2">
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Ask AI anything..."
                        className="flex-1 bg-dark-bg border border-dark-border rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary-500 custom-scrollbar"
                        rows={3}
                    />
                    <button
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
        </div>
    );
}
