import { useRef, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import type { OnMount } from '@monaco-editor/react';
import type * as monaco from 'monaco-editor';
import { useEditorStore } from '../../store/editorStore';
import { inlineCompletionProvider } from '../../services/completion/InlineCompletionProvider';

interface MonacoEditorProps {
    tabId: string;
    value: string;
    language: string;
    onChange: (value: string | undefined) => void;
}

export default function MonacoEditor({ tabId, value, language, onChange }: MonacoEditorProps) {
    const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
    const { settings, selectedProvider } = useEditorStore();

    const handleEditorDidMount: OnMount = (editor, monaco) => {
        editorRef.current = editor;

        // Initialize LSP Service
        import('../../services/lsp/LSPService').then(({ lspService }) => {
            lspService.initialize(monaco);
        });

        // Register inline completion provider for AI-powered suggestions
        monaco.languages.registerInlineCompletionsProvider(
            { pattern: '**' },
            inlineCompletionProvider
        );

        // Update provider settings
        inlineCompletionProvider.setProvider(selectedProvider, settings.aiModel);

        // Configure editor options
        editor.updateOptions({
            fontSize: settings.fontSize,
            tabSize: settings.tabSize,
            wordWrap: settings.wordWrap ? 'on' : 'off',
            minimap: { enabled: settings.minimap },
            lineNumbers: settings.lineNumbers ? 'on' : 'off',
            automaticLayout: true,
            scrollBeyondLastLine: false,
            smoothScrolling: true,
            cursorBlinking: 'smooth',
            cursorSmoothCaretAnimation: 'on',
            fontFamily: 'JetBrains Mono, Fira Code, monospace',
            fontLigatures: true,
            renderWhitespace: 'selection',
            bracketPairColorization: { enabled: true },
            guides: {
                bracketPairs: true,
                indentation: true,
            },
            // Enable inline suggestions
            inlineSuggest: {
                enabled: true,
            },
            quickSuggestions: {
                other: true,
                comments: false,
                strings: false,
            },
        });

        // Add keyboard shortcuts
        editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, async () => {
            // Save file
            const tab = useEditorStore.getState().tabs.find(t => t.id === tabId);
            if (tab && tab.filepath) {
                try {
                    const { fileSystemService } = await import('../../services/filesystem/FileSystemService');
                    await fileSystemService.writeFile(tab.filepath, tab.content);
                    useEditorStore.getState().updateTab(tabId, { isDirty: false });
                    console.log('File saved:', tab.filepath);
                } catch (error) {
                    console.error('Failed to save file:', error);
                    alert('Failed to save file: ' + (error as Error).message);
                }
            }
        });

        // Add context menu actions
        editor.addAction({
            id: 'ai-explain',
            label: 'AI: Explain Selection',
            contextMenuGroupId: 'navigation',
            contextMenuOrder: 1,
            run: (ed) => {
                const selection = ed.getSelection();
                const text = ed.getModel()?.getValueInRange(selection || { startLineNumber: 1, startColumn: 1, endLineNumber: 1, endColumn: 1 });
                if (text) {
                    useEditorStore.getState().triggerAIAction('explain', text);
                }
            }
        });

        editor.addAction({
            id: 'ai-fix',
            label: 'AI: Fix Selection',
            contextMenuGroupId: 'navigation',
            contextMenuOrder: 2,
            run: (ed) => {
                const selection = ed.getSelection();
                const text = ed.getModel()?.getValueInRange(selection || { startLineNumber: 1, startColumn: 1, endLineNumber: 1, endColumn: 1 });
                if (text) {
                    useEditorStore.getState().triggerAIAction('fix', text);
                }
            }
        });

        editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyP, () => {
            // Open command palette
            useEditorStore.getState().toggleCommandPalette();
        });

        // Track cursor position
        editor.onDidChangeCursorPosition((e) => {
            useEditorStore.getState().updateTab(tabId, {
                cursorPosition: { line: e.position.lineNumber, column: e.position.column },
            });
        });
    };

    useEffect(() => {
        // Update provider when selected provider changes
        inlineCompletionProvider.setProvider(selectedProvider, settings.aiModel);
    }, [selectedProvider, settings.aiModel]);

    useEffect(() => {
        if (editorRef.current) {
            editorRef.current.updateOptions({
                fontSize: settings.fontSize,
                tabSize: settings.tabSize,
                wordWrap: settings.wordWrap ? 'on' : 'off',
                minimap: { enabled: settings.minimap },
                lineNumbers: settings.lineNumbers ? 'on' : 'off',
            });
        }
    }, [settings]);

    return (
        <div className="w-full h-full">
            <Editor
                height="100%"
                language={language}
                value={value}
                onChange={onChange}
                onMount={handleEditorDidMount}
                theme={settings.theme === 'dark' ? 'vs-dark' : 'light'}
                options={{
                    fontSize: settings.fontSize,
                    tabSize: settings.tabSize,
                    wordWrap: settings.wordWrap ? 'on' : 'off',
                    minimap: { enabled: settings.minimap },
                    lineNumbers: settings.lineNumbers ? 'on' : 'off',
                }}
            />
        </div>
    );
}
