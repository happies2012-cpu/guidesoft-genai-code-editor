import { AnthropicProvider } from './providers/anthropic';
import { OpenAIProvider } from './providers/openai';
import { GeminiProvider } from './providers/gemini';
import { OllamaProvider } from './providers/ollama';
import type { AICompletionRequest, AICompletionResponse, AICompletionCallback } from './types';

import { contextService } from './ContextService';
import { EDITOR_SYSTEM_PROMPT } from './AIPrompts';
import type { AIMessage } from '../../types';

class AIService {
    private anthropic = new AnthropicProvider();
    private openai = new OpenAIProvider();
    private gemini = new GeminiProvider();
    private ollama = new OllamaProvider();

    private apiKeys: Record<string, string> = {};

    setApiKey(provider: string, apiKey: string) {
        this.apiKeys[provider] = apiKey;

        switch (provider) {
            case 'anthropic':
                this.anthropic.initialize(apiKey);
                break;
            case 'openai':
                this.openai.initialize(apiKey);
                break;
            case 'gemini':
                this.gemini.initialize(apiKey);
                break;
            case 'ollama':
                this.ollama.initialize(apiKey); // For custom endpoint
                break;
        }
    }

    hasApiKey(provider: string): boolean {
        return !!this.apiKeys[provider];
    }

    async complete(request: AICompletionRequest): Promise<AICompletionResponse> {
        const provider = this.getProvider(request.provider);
        const requestWithContext = this.injectContext(request);
        return provider.complete(requestWithContext);
    }

    async streamComplete(
        request: AICompletionRequest,
        callback: AICompletionCallback
    ): Promise<void> {
        const provider = this.getProvider(request.provider);
        const requestWithContext = this.injectContext(request);
        return provider.streamComplete(requestWithContext, callback);
    }

    // Helper for AgentService to get full completion text
    async getCompletion(prompt: string, _history: AIMessage[], provider: string, model: string): Promise<string> {
        const response = await this.complete({
            provider,
            model,
            prompt,
        });
        return response.content;
    }

    private injectContext(request: AICompletionRequest): AICompletionRequest {
        const context = contextService.getContext();

        if (!context) return request;

        const contextSummary = `[Project Context]
Structure:
${context.fileTree}

Key Files Summary:
${Object.entries(context.majorFiles)
                .map(([path, content]) => `File: ${path}\n${(content as string).substring(0, 300)}`)
                .join('\n')}
---
`;
        return {
            ...request,
            prompt: `${EDITOR_SYSTEM_PROMPT}\n\n${contextSummary}\n\nUser Question: ${request.prompt}`,
        };
    }

    private getProvider(providerId: string) {
        switch (providerId) {
            case 'anthropic':
                if (!this.hasApiKey('anthropic')) {
                    throw new Error('Anthropic API key not set');
                }
                return this.anthropic;
            case 'openai':
                if (!this.hasApiKey('openai')) {
                    throw new Error('OpenAI API key not set');
                }
                return this.openai;
            case 'gemini':
                if (!this.hasApiKey('gemini')) {
                    throw new Error('Gemini API key not set');
                }
                return this.gemini;
            case 'ollama':
                return this.ollama; // No API key required for local
            default:
                throw new Error(`Unknown provider: ${providerId}`);
        }
    }
}

export const aiService = new AIService();
