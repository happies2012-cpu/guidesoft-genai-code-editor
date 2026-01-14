// AI Service Types

export interface AIProvider {
    id: string;
    name: string;
    models: AIModel[];
    requiresApiKey: boolean;
}

export interface AIModel {
    id: string;
    name: string;
    contextWindow: number;
    maxTokens: number;
}

export interface AICompletionRequest {
    provider: string;
    model: string;
    prompt: string;
    systemPrompt?: string;
    context?: string;
    maxTokens?: number;
    temperature?: number;
    stream?: boolean;
    images?: string[];
}

export interface AICompletionResponse {
    content: string;
    usage?: {
        promptTokens: number;
        completionTokens: number;
        totalTokens: number;
    };
    model: string;
    provider: string;
}

export interface AIStreamChunk {
    content: string;
    done: boolean;
}

export type AICompletionCallback = (chunk: AIStreamChunk) => void;
