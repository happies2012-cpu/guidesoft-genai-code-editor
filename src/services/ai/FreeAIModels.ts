// Free AI Models Service - Integrates multiple free AI providers

export type AIModel = 'gpt-3.5' | 'gemini' | 'mistral' | 'groq' | 'codellama' | 'starcoder';

interface AIProvider {
    name: string;
    model: AIModel;
    free: boolean;
    rateLimit: string;
    description: string;
}

export const availableModels: AIProvider[] = [
    {
        name: 'GPT-3.5 Turbo',
        model: 'gpt-3.5',
        free: false,
        rateLimit: 'API key required',
        description: 'Fast, versatile model from OpenAI'
    },
    {
        name: 'Google Gemini',
        model: 'gemini',
        free: true,
        rateLimit: '60 requests/min',
        description: 'Google\'s powerful multimodal AI'
    },
    {
        name: 'Mistral AI',
        model: 'mistral',
        free: true,
        rateLimit: '100 requests/min',
        description: 'Open-source, efficient model'
    },
    {
        name: 'Groq (Fast)',
        model: 'groq',
        free: true,
        rateLimit: 'Unlimited (fast inference)',
        description: 'Ultra-fast inference engine'
    },
    {
        name: 'CodeLlama',
        model: 'codellama',
        free: true,
        rateLimit: '50 requests/min',
        description: 'Meta\'s code-specialized model'
    },
    {
        name: 'StarCoder',
        model: 'starcoder',
        free: true,
        rateLimit: '30 requests/min',
        description: 'Hugging Face code model'
    }
];

export const freeAIService = {
    async generateCode(prompt: string, model: AIModel = 'gemini'): Promise<AsyncGenerator<string>> {
        switch (model) {
            case 'gemini':
                return this.geminiGenerate(prompt);
            case 'mistral':
                return this.mistralGenerate(prompt);
            case 'groq':
                return this.groqGenerate(prompt);
            case 'codellama':
                return this.codeLlamaGenerate(prompt);
            case 'starcoder':
                return this.starCoderGenerate(prompt);
            default:
                return this.geminiGenerate(prompt);
        }
    },

    async *geminiGenerate(prompt: string): AsyncGenerator<string> {
        // Google Gemini API (free tier)
        const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
        if (!apiKey) {
            yield '// Error: Gemini API key not configured\n';
            return;
        }

        try {
            const response = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        contents: [{ parts: [{ text: `Generate code for: ${prompt}` }] }]
                    })
                }
            );

            const data = await response.json();
            const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

            // Simulate streaming
            for (let i = 0; i < text.length; i += 10) {
                yield text.slice(i, i + 10);
                await new Promise(r => setTimeout(r, 50));
            }
        } catch (error) {
            yield `// Error: ${error}\n`;
        }
    },

    async *mistralGenerate(prompt: string): AsyncGenerator<string> {
        // Mistral AI (free API)
        const apiKey = import.meta.env.VITE_MISTRAL_API_KEY;
        if (!apiKey) {
            yield '// Error: Mistral API key not configured\n';
            return;
        }

        try {
            const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    model: 'mistral-tiny',
                    messages: [{ role: 'user', content: `Generate code for: ${prompt}` }],
                    stream: true
                })
            });

            const reader = response.body?.getReader();
            if (!reader) return;

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const text = new TextDecoder().decode(value);
                yield text;
            }
        } catch (error) {
            yield `// Error: ${error}\n`;
        }
    },

    async *groqGenerate(prompt: string): AsyncGenerator<string> {
        // Groq (ultra-fast, free)
        const apiKey = import.meta.env.VITE_GROQ_API_KEY;
        if (!apiKey) {
            yield '// Error: Groq API key not configured\n';
            return;
        }

        try {
            const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    model: 'mixtral-8x7b-32768',
                    messages: [{ role: 'user', content: `Generate code for: ${prompt}` }],
                    stream: true
                })
            });

            const reader = response.body?.getReader();
            if (!reader) return;

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const text = new TextDecoder().decode(value);
                yield text;
            }
        } catch (error) {
            yield `// Error: ${error}\n`;
        }
    },

    async *codeLlamaGenerate(prompt: string): AsyncGenerator<string> {
        // CodeLlama via Hugging Face
        const apiKey = import.meta.env.VITE_HF_API_KEY;
        if (!apiKey) {
            yield '// Error: Hugging Face API key not configured\n';
            return;
        }

        try {
            const response = await fetch(
                'https://api-inference.huggingface.co/models/codellama/CodeLlama-7b-hf',
                {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${apiKey}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ inputs: prompt })
                }
            );

            const data = await response.json();
            const text = data[0]?.generated_text || '';

            for (let i = 0; i < text.length; i += 10) {
                yield text.slice(i, i + 10);
                await new Promise(r => setTimeout(r, 50));
            }
        } catch (error) {
            yield `// Error: ${error}\n`;
        }
    },

    async *starCoderGenerate(prompt: string): AsyncGenerator<string> {
        // StarCoder via Hugging Face
        const apiKey = import.meta.env.VITE_HF_API_KEY;
        if (!apiKey) {
            yield '// Error: Hugging Face API key not configured\n';
            return;
        }

        try {
            const response = await fetch(
                'https://api-inference.huggingface.co/models/bigcode/starcoder',
                {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${apiKey}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ inputs: prompt })
                }
            );

            const data = await response.json();
            const text = data[0]?.generated_text || '';

            for (let i = 0; i < text.length; i += 10) {
                yield text.slice(i, i + 10);
                await new Promise(r => setTimeout(r, 50));
            }
        } catch (error) {
            yield `// Error: ${error}\n`;
        }
    }
};
