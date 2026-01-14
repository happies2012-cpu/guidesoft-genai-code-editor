import Anthropic from '@anthropic-ai/sdk';
import type { AICompletionRequest, AICompletionResponse, AICompletionCallback } from '../types';

export class AnthropicProvider {
    private client: Anthropic | null = null;

    initialize(apiKey: string) {
        this.client = new Anthropic({ apiKey, dangerouslyAllowBrowser: true });
    }

    async complete(request: AICompletionRequest): Promise<AICompletionResponse> {
        if (!this.client) {
            throw new Error('Anthropic client not initialized. Please set your API key.');
        }

        const contentBlocks: Anthropic.ContentBlockParam[] = [];

        if (request.images && request.images.length > 0) {
            request.images.forEach(img => {
                const base64Data = img.includes('base64,') ? img.split('base64,')[1] : img;
                contentBlocks.push({
                    type: 'image',
                    source: {
                        type: 'base64',
                        media_type: 'image/png',
                        data: base64Data,
                    }
                });
            });
        }

        const promptText = request.context
            ? `Context:\n${request.context}\n\nPrompt:\n${request.prompt}`
            : request.prompt;

        contentBlocks.push({ type: 'text', text: promptText });

        const messages: Anthropic.MessageParam[] = [
            {
                role: 'user',
                content: contentBlocks,
            },
        ];

        const response = await this.client.messages.create({
            model: request.model || 'claude-sonnet-4-20250514',
            max_tokens: request.maxTokens || 4096,
            temperature: request.temperature || 0.7,
            system: request.systemPrompt || 'You are a helpful AI coding assistant.',
            messages,
        });

        const content = response.content[0];
        const text = content.type === 'text' ? content.text : '';

        return {
            content: text,
            usage: {
                promptTokens: response.usage.input_tokens,
                completionTokens: response.usage.output_tokens,
                totalTokens: response.usage.input_tokens + response.usage.output_tokens,
            },
            model: response.model,
            provider: 'anthropic',
        };
    }

    async streamComplete(
        request: AICompletionRequest,
        callback: AICompletionCallback
    ): Promise<void> {
        if (!this.client) {
            throw new Error('Anthropic client not initialized. Please set your API key.');
        }

        const messages: Anthropic.MessageParam[] = [
            {
                role: 'user',
                content: request.context
                    ? `Context:\n${request.context}\n\nPrompt:\n${request.prompt}`
                    : request.prompt,
            },
        ];

        const stream = await this.client.messages.create({
            model: request.model || 'claude-sonnet-4-20250514',
            max_tokens: request.maxTokens || 4096,
            temperature: request.temperature || 0.7,
            system: request.systemPrompt || 'You are a helpful AI coding assistant.',
            messages,
            stream: true,
        });

        for await (const chunk of stream) {
            if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text_delta') {
                callback({
                    content: chunk.delta.text,
                    done: false,
                });
            }
        }

        callback({ content: '', done: true });
    }
}
