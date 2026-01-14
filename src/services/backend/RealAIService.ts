import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: import.meta.env.VITE_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true // Note: In production, use backend proxy
});

export const realAIService = {
    generateCode: async function* (prompt: string, context?: string) {
        const stream = await openai.chat.completions.create({
            model: 'gpt-4',
            messages: [
                {
                    role: 'system',
                    content: 'You are an expert code generator. Generate clean, production-ready code with comments.'
                },
                {
                    role: 'user',
                    content: `${context ? `Context:\n${context}\n\n` : ''}Generate code for: ${prompt}`
                }
            ],
            stream: true,
            temperature: 0.7,
        });

        for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content || '';
            if (content) {
                yield content;
            }
        }
    },

    chat: async function* (messages: Array<{ role: string; content: string }>) {
        const stream = await openai.chat.completions.create({
            model: 'gpt-4',
            messages: messages as any,
            stream: true,
            temperature: 0.7,
        });

        for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content || '';
            if (content) {
                yield content;
            }
        }
    },

    getCompletion: async (code: string, language: string = 'typescript'): Promise<string> => {
        const response = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [
                {
                    role: 'system',
                    content: `You are a code completion assistant for ${language}. Provide only the completion, no explanations.`
                },
                {
                    role: 'user',
                    content: `Complete this code:\n${code}`
                }
            ],
            max_tokens: 100,
            temperature: 0.2,
        });

        return response.choices[0].message.content || '';
    },

    explainCode: async (code: string): Promise<string> => {
        const response = await openai.chat.completions.create({
            model: 'gpt-4',
            messages: [
                {
                    role: 'system',
                    content: 'You are a code explanation expert. Explain code clearly and concisely.'
                },
                {
                    role: 'user',
                    content: `Explain this code:\n${code}`
                }
            ],
            temperature: 0.5,
        });

        return response.choices[0].message.content || '';
    },

    refactorCode: async (code: string, instructions: string): Promise<string> => {
        const response = await openai.chat.completions.create({
            model: 'gpt-4',
            messages: [
                {
                    role: 'system',
                    content: 'You are a code refactoring expert. Provide improved code following best practices.'
                },
                {
                    role: 'user',
                    content: `Refactor this code according to: ${instructions}\n\nCode:\n${code}`
                }
            ],
            temperature: 0.3,
        });

        return response.choices[0].message.content || '';
    }
};
