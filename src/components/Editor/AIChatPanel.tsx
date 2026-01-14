import React, { useState } from 'react';
import { MessageSquare, Send, X, Sparkles } from 'lucide-react';
import { freeAIService } from '../../services/ai/FreeAIModels';

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

interface AIChatPanelProps {
    isOpen: boolean;
    onClose: () => void;
}

export const AIChatPanel: React.FC<AIChatPanelProps> = ({ isOpen, onClose }) => {
    const [messages, setMessages] = useState<Message[]>([
        { role: 'assistant', content: 'Hi! I\'m your AI coding assistant. Ask me anything about your code!' }
    ]);
    const [input, setInput] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);

    const handleSend = async () => {
        if (!input.trim() || isGenerating) return;

        const userMessage: Message = { role: 'user', content: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsGenerating(true);

        try {
            const stream = await freeAIService.generateCode(input, 'gemini');
            let assistantMessage = '';

            setMessages(prev => [...prev, { role: 'assistant', content: '' }]);

            for await (const chunk of stream) {
                assistantMessage += chunk;
                setMessages(prev => {
                    const newMessages = [...prev];
                    newMessages[newMessages.length - 1].content = assistantMessage;
                    return newMessages;
                });
            }
        } catch (error) {
            setMessages(prev => [...prev, { role: 'assistant', content: `Error: ${error}` }]);
        } finally {
            setIsGenerating(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed right-0 top-0 bottom-0 w-96 bg-[#1a1a1a] border-l border-white/10 shadow-2xl z-40 flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-purple-500/10">
                <div className="flex items-center gap-2">
                    <MessageSquare size={18} className="text-purple-400" />
                    <span className="font-bold">AI Chat</span>
                    <kbd className="ml-2 px-2 py-0.5 bg-white/10 rounded text-xs text-gray-400">Cmd+L</kbd>
                </div>
                <button onClick={onClose} className="p-1 hover:bg-white/10 rounded transition-colors">
                    <X size={18} />
                </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg, idx) => (
                    <div
                        key={idx}
                        className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        {msg.role === 'assistant' && (
                            <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                                <Sparkles size={16} className="text-purple-400" />
                            </div>
                        )}
                        <div
                            className={`max-w-[80%] rounded-lg p-3 ${msg.role === 'user'
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-white/5 text-gray-200'
                                }`}
                        >
                            <pre className="whitespace-pre-wrap text-sm font-sans">{msg.content}</pre>
                        </div>
                    </div>
                ))}
                {isGenerating && (
                    <div className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-400"></div>
                        </div>
                        <div className="bg-white/5 rounded-lg p-3">
                            <span className="text-gray-400 text-sm">Thinking...</span>
                        </div>
                    </div>
                )}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-white/10">
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
                        placeholder="Ask AI anything..."
                        className="flex-1 bg-black/50 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none"
                    />
                    <button
                        onClick={handleSend}
                        disabled={!input.trim() || isGenerating}
                        className="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-all"
                    >
                        <Send size={18} />
                    </button>
                </div>
                <p className="text-xs text-gray-500 mt-2">Press Enter to send, Shift+Enter for new line</p>
            </div>
        </div>
    );
};
