import { useRef, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import type { OnMount } from '@monaco-editor/react';
import type * as monaco from 'monaco-editor';
import { useEditorStore } from '../../store/editorStore';

interface MonacoEditorProps {
    tabId: string;
    value: string;
    language: string;
    onChange: (value: string | undefined) => void;
}

export default function MonacoEditor({ tabId, value, language, onChange }: MonacoEditorProps) {
    const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
    const { settings } = useEditorStore();

    const handleEditorDidMount: OnMount = (editor, monaco) => {
        editorRef.current = editor;

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
        });

        // Add keyboard shortcuts
        editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
            // Save file
            console.log('Save file');
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
