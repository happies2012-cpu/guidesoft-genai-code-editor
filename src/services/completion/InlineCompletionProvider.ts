import * as monaco from 'monaco-editor';
import { aiService } from '../ai/AIService';

export class InlineCompletionProvider implements monaco.languages.InlineCompletionsProvider {
    private provider: string;
    private model: string;
    private debounceTimer: NodeJS.Timeout | null = null;
    private lastCompletion: string = '';

    constructor(provider: string = 'anthropic', model: string = 'claude-sonnet-4-20250514') {
        this.provider = provider;
        this.model = model;
    }

    async provideInlineCompletions(
        model: monaco.editor.ITextModel,
        position: monaco.Position,
        context: monaco.languages.InlineCompletionContext,
        token: monaco.CancellationToken
    ): Promise<monaco.languages.InlineCompletions | undefined> {
        // Clear previous debounce
        if (this.debounceTimer) {
            clearTimeout(this.debounceTimer);
        }

        // Don't provide completions if user is actively typing
        if (context.triggerKind === monaco.languages.InlineCompletionTriggerKind.Automatic) {
            // Debounce to avoid too many API calls
            return new Promise((resolve) => {
                this.debounceTimer = setTimeout(async () => {
                    const completion = await this.getCompletion(model, position, token);
                    resolve(completion);
                }, 500);
            });
        }

        return this.getCompletion(model, position, token);
    }

    private async getCompletion(
        model: monaco.editor.ITextModel,
        position: monaco.Position,
        token: monaco.CancellationToken
    ): Promise<monaco.languages.InlineCompletions | undefined> {
        try {
            // Check if provider has API key
            if (this.provider !== 'ollama' && !aiService.hasApiKey(this.provider)) {
                return undefined;
            }

            // Get context before cursor
            const textBeforeCursor = model.getValueInRange({
                startLineNumber: Math.max(1, position.lineNumber - 20),
                startColumn: 1,
                endLineNumber: position.lineNumber,
                endColumn: position.column,
            });

            // Get text after cursor for context
            const textAfterCursor = model.getValueInRange({
                startLineNumber: position.lineNumber,
                startColumn: position.column,
                endLineNumber: Math.min(model.getLineCount(), position.lineNumber + 5),
                endColumn: model.getLineMaxColumn(Math.min(model.getLineCount(), position.lineNumber + 5)),
            });

            // Get file language
            const language = model.getLanguageId();

            // Build prompt
            const prompt = `Complete the following ${language} code. Only provide the completion, no explanations.

Context before cursor:
\`\`\`${language}
${textBeforeCursor}
\`\`\`

Context after cursor:
\`\`\`${language}
${textAfterCursor}
\`\`\`

Provide only the code completion that should be inserted at the cursor position. Do not repeat the context.`;

            // Get AI completion
            const response = await aiService.complete({
                provider: this.provider,
                model: this.model,
                prompt,
                systemPrompt: 'You are a code completion AI. Provide only the code that should be inserted, without any explanations or markdown formatting.',
                maxTokens: 256,
                temperature: 0.3,
            });

            if (token.isCancellationRequested) {
                return undefined;
            }

            // Clean up the response
            let completion = response.content.trim();

            // Remove markdown code blocks if present
            completion = completion.replace(/^```[\w]*\n/, '').replace(/\n```$/, '');

            // Remove any leading/trailing quotes
            completion = completion.replace(/^["']|["']$/g, '');

            this.lastCompletion = completion;

            if (!completion) {
                return undefined;
            }

            return {
                items: [
                    {
                        insertText: completion,
                        range: {
                            startLineNumber: position.lineNumber,
                            startColumn: position.column,
                            endLineNumber: position.lineNumber,
                            endColumn: position.column,
                        },
                        command: {
                            id: 'editor.action.inlineSuggest.trigger',
                            title: 'Re-trigger Inline Suggest',
                        },
                    },
                ],
            };
        } catch (error) {
            console.error('Inline completion error:', error);
            return undefined;
        }
    }

    freeInlineCompletions(): void {
        // Cleanup if needed
    }

    setProvider(provider: string, model: string) {
        this.provider = provider;
        this.model = model;
    }
}

export const inlineCompletionProvider = new InlineCompletionProvider();
