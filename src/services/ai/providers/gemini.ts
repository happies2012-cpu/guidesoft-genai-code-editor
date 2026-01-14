import { GoogleGenerativeAI } from '@google/generative-ai';
import type { AICompletionRequest, AICompletionResponse, AICompletionCallback } from '../types';

export class GeminiProvider {
    private client: GoogleGenerativeAI | null = null;

    initialize(apiKey: string) {
        this.client = new GoogleGenerativeAI(apiKey);
    }

    async complete(request: AICompletionRequest): Promise<AICompletionResponse> {
        if (!this.client) {
            throw new Error('Gemini client not initialized. Please set your API key.');
        }

        const model = this.client.getGenerativeModel({
            model: request.model || 'gemini-pro',
            systemInstruction: request.systemPrompt || 'You are a helpful AI coding assistant.',
        });

        const prompt = request.context
            ? `Context:\n${request.context}\n\nPrompt:\n${request.prompt}`
            : request.prompt;

        const result = await model.generateContent(prompt);
        const response = result.response;
        const content = response.text();

        return {
            content,
            usage: undefined, // Gemini doesn't provide token usage in the same way
            model: request.model || 'gemini-pro',
            provider: 'gemini',
        };
    }

    async streamComplete(
        request: AICompletionRequest,
        callback: AICompletionCallback
    ): Promise<void> {
        if (!this.client) {
            throw new Error('Gemini client not initialized. Please set your API key.');
        }

        const model = this.client.getGenerativeModel({
            model: request.model || 'gemini-pro',
            systemInstruction: request.systemPrompt || 'You are a helpful AI coding assistant.',
        });

        const prompt = request.context
            ? `Context:\n${request.context}\n\nPrompt:\n${request.prompt}`
            : request.prompt;

        const result = await model.generateContentStream(prompt);

        for await (const chunk of result.stream) {
            const text = chunk.text();
            if (text) {
                callback({
                    content: text,
                    done: false,
                });
            }
        }

        callback({ content: '', done: true });
    }
}
