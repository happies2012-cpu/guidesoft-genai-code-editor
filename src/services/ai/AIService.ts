import { AnthropicProvider } from './providers/anthropic';
import { OpenAIProvider } from './providers/openai';
import { GeminiProvider } from './providers/gemini';
import { OllamaProvider } from './providers/ollama';
import type { AICompletionRequest, AICompletionResponse, AICompletionCallback } from './types';

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
        return provider.complete(request);
    }

    async streamComplete(
        request: AICompletionRequest,
        callback: AICompletionCallback
    ): Promise<void> {
        const provider = this.getProvider(request.provider);
        return provider.streamComplete(request, callback);
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
