// Type definitions for the AI Code Editor

export interface EditorTab {
    id: string;
    filename: string;
    filepath: string;
    language: string;
    content: string;
    isDirty: boolean;
    cursorPosition?: { line: number; column: number };
}

export interface FileTreeNode {
    name: string;
    path: string;
    type: 'file' | 'directory';
    children?: FileTreeNode[];
    isExpanded?: boolean;
}

export interface AIProvider {
    id: string;
    name: string;
    models: string[];
    apiKey?: string;
    endpoint?: string;
    requiresApiKey: boolean;
}

export interface AIMessage {
    id: string;
    role: 'user' | 'assistant' | 'system';
    content: string;
    timestamp: number;
    codeBlocks?: CodeBlock[];
}

export interface CodeBlock {
    language: string;
    code: string;
    filepath?: string;
}

export interface AICompletionRequest {
    provider: string;
    model: string;
    prompt: string;
    context?: string;
    maxTokens?: number;
    temperature?: number;
    stream?: boolean;
}

export interface AICompletionResponse {
    completion: string;
    usage?: {
        promptTokens: number;
        completionTokens: number;
        totalTokens: number;
    };
}

export interface TerminalSession {
    id: string;
    name: string;
    cwd: string;
    isActive: boolean;
}

export interface GitStatus {
    branch: string;
    ahead: number;
    behind: number;
    modified: string[];
    added: string[];
    deleted: string[];
    untracked: string[];
}

export interface LSPDiagnostic {
    severity: 'error' | 'warning' | 'info' | 'hint';
    message: string;
    range: {
        start: { line: number; character: number };
        end: { line: number; character: number };
    };
    source?: string;
}

export interface EditorSettings {
    theme: 'dark' | 'light';
    fontSize: number;
    tabSize: number;
    wordWrap: boolean;
    minimap: boolean;
    lineNumbers: boolean;
    autoSave: boolean;
    aiProvider: string;
    aiModel: string;
}
