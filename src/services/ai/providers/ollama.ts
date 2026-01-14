import type { AICompletionRequest, AICompletionResponse, AICompletionCallback } from '../types';

export class OllamaProvider {
    private baseUrl: string = 'http://localhost:11434';

    initialize(endpoint?: string) {
        if (endpoint) {
            this.baseUrl = endpoint;
        }
    }

    async complete(request: AICompletionRequest): Promise<AICompletionResponse> {
        const response = await fetch(`${this.baseUrl}/api/generate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: request.model || 'codellama',
                prompt: request.context
                    ? `${request.systemPrompt || 'You are a helpful AI coding assistant.'}\n\nContext:\n${request.context}\n\nPrompt:\n${request.prompt}`
                    : request.prompt,
                stream: false,
                options: {
                    temperature: request.temperature || 0.7,
                    num_predict: request.maxTokens || 4096,
                },
            }),
        });

        if (!response.ok) {
            throw new Error(`Ollama request failed: ${response.statusText}`);
        }

        const data = await response.json();

        return {
            content: data.response,
            usage: undefined,
            model: request.model || 'codellama',
            provider: 'ollama',
        };
    }

    async streamComplete(
        request: AICompletionRequest,
        callback: AICompletionCallback
    ): Promise<void> {
        const response = await fetch(`${this.baseUrl}/api/generate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: request.model || 'codellama',
                prompt: request.context
                    ? `${request.systemPrompt || 'You are a helpful AI coding assistant.'}\n\nContext:\n${request.context}\n\nPrompt:\n${request.prompt}`
                    : request.prompt,
                stream: true,
                options: {
                    temperature: request.temperature || 0.7,
                    num_predict: request.maxTokens || 4096,
                },
            }),
        });

        if (!response.ok) {
            throw new Error(`Ollama request failed: ${response.statusText}`);
        }

        const reader = response.body?.getReader();
        if (!reader) {
            throw new Error('No response body');
        }

        const decoder = new TextDecoder();

        while (true) {
            const { done, value } = await reader.read();

            if (done) {
                callback({ content: '', done: true });
                break;
            }

            const chunk = decoder.decode(value);
            const lines = chunk.split('\n').filter(line => line.trim());

            for (const line of lines) {
                try {
                    const data = JSON.parse(line);
                    if (data.response) {
                        callback({
                            content: data.response,
                            done: false,
                        });
                    }
                    if (data.done) {
                        callback({ content: '', done: true });
                        return;
                    }
                } catch (e) {
                    // Skip invalid JSON lines
                }
            }
        }
    }
}
