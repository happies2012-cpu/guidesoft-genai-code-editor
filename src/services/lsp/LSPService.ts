import type * as monaco from 'monaco-editor';

export interface Diagnostic {
    message: string;
    severity: 'error' | 'warning' | 'info' | 'hint';
    range: {
        startLineNumber: number;
        startColumn: number;
        endLineNumber: number;
        endColumn: number;
    };
}

class LSPService {
    private monaco: typeof monaco | null = null;

    initialize(monacoInstance: typeof monaco) {
        this.monaco = monacoInstance;
        console.log('LSP Service initialized');

        // Configure default TS/JS diagnostics
        const languages = monacoInstance.languages as unknown as {
            typescript: {
                typescriptDefaults: { setDiagnosticsOptions: (options: unknown) => void };
                javascriptDefaults: { setDiagnosticsOptions: (options: unknown) => void };
            }
        };

        if (languages.typescript) {
            languages.typescript.typescriptDefaults.setDiagnosticsOptions({
                noSemanticValidation: false,
                noSyntaxValidation: false,
            });

            languages.typescript.javascriptDefaults.setDiagnosticsOptions({
                noSemanticValidation: false,
                noSyntaxValidation: false,
            });
        }
    }

    // Manual diagnostic setting if needed
    setDiagnostics(model: monaco.editor.ITextModel, diagnostics: Diagnostic[]) {
        if (!this.monaco) return;

        const markers: monaco.editor.IMarkerData[] = diagnostics.map(d => ({
            message: d.message,
            severity: this.mapSeverity(d.severity),
            ...d.range
        }));

        this.monaco.editor.setModelMarkers(model, 'lsp-service', markers);
    }

    private mapSeverity(s: string): number {
        if (!this.monaco) return 1;
        switch (s) {
            case 'error': return this.monaco.MarkerSeverity.Error;
            case 'warning': return this.monaco.MarkerSeverity.Warning;
            case 'info': return this.monaco.MarkerSeverity.Info;
            case 'hint': return this.monaco.MarkerSeverity.Hint;
            default: return this.monaco.MarkerSeverity.Info;
        }
    }

    // Simple syntax check helper
    async performSyntaxCheck(content: string, language: string): Promise<Diagnostic[]> {
        const diagnostics: Diagnostic[] = [];

        if (language === 'javascript' || language === 'typescript') {
            try {
                // Simple eval-based syntax check (safe because it's just parsing)
                // In a real app, use a worker with acorn or typescript compiler
                new Function(content);
            } catch (err: unknown) {
                const e = err as { message: string; loc?: { line: number; column: number } };
                if (e.loc) {
                    diagnostics.push({
                        message: e.message,
                        severity: 'error',
                        range: {
                            startLineNumber: e.loc.line,
                            startColumn: e.loc.column,
                            endLineNumber: e.loc.line,
                            endColumn: e.loc.column + 1
                        }
                    });
                } else {
                    // Fallback for general syntax error
                    diagnostics.push({
                        message: e.message,
                        severity: 'error',
                        range: {
                            startLineNumber: 1,
                            startColumn: 1,
                            endLineNumber: 1,
                            endColumn: 10
                        }
                    });
                }
            }
        }

        return diagnostics;
    }
}

export const lspService = new LSPService();
