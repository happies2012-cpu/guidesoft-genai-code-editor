import OpenAI from 'openai';
import type { AICompletionRequest, AICompletionResponse, AICompletionCallback } from '../types';

export class OpenAIProvider {
    private client: OpenAI | null = null;

    initialize(apiKey: string) {
        this.client = new OpenAI({ apiKey, dangerouslyAllowBrowser: true });
    }

    async complete(request: AICompletionRequest): Promise<AICompletionResponse> {
        if (!this.client) {
            throw new Error('OpenAI client not initialized. Please set your API key.');
        }

        const messages: OpenAI.ChatCompletionMessageParam[] = [];

        if (request.systemPrompt) {
            messages.push({
                role: 'system',
                content: request.systemPrompt,
            });
        }

        messages.push({
            role: 'user',
            content: request.context
                ? `Context:\n${request.context}\n\nPrompt:\n${request.prompt}`
                : request.prompt,
        });

        const response = await this.client.chat.completions.create({
            model: request.model || 'gpt-4-turbo',
            messages,
            max_tokens: request.maxTokens || 4096,
            temperature: request.temperature || 0.7,
        });

        const content = response.choices[0]?.message?.content || '';

        return {
            content,
            usage: response.usage ? {
                promptTokens: response.usage.prompt_tokens,
                completionTokens: response.usage.completion_tokens,
                totalTokens: response.usage.total_tokens,
            } : undefined,
            model: response.model,
            provider: 'openai',
        };
    }

    async streamComplete(
        request: AICompletionRequest,
        callback: AICompletionCallback
    ): Promise<void> {
        if (!this.client) {
            throw new Error('OpenAI client not initialized. Please set your API key.');
        }

        const messages: OpenAI.ChatCompletionMessageParam[] = [];

        if (request.systemPrompt) {
            messages.push({
                role: 'system',
                content: request.systemPrompt,
            });
        }

        messages.push({
            role: 'user',
            content: request.context
                ? `Context:\n${request.context}\n\nPrompt:\n${request.prompt}`
                : request.prompt,
        });

        const stream = await this.client.chat.completions.create({
            model: request.model || 'gpt-4-turbo',
            messages,
            max_tokens: request.maxTokens || 4096,
            temperature: request.temperature || 0.7,
            stream: true,
        });

        for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content || '';
            if (content) {
                callback({
                    content,
                    done: false,
                });
            }
        }

        callback({ content: '', done: true });
    }
}
