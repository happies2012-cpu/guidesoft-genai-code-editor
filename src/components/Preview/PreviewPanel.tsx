import React, { useMemo } from 'react';
import { Sandpack } from '@codesandbox/sandpack-react';
import { monokaiPro } from '@codesandbox/sandpack-themes';
import { useEditorStore } from '../../store/editorStore';

export const PreviewPanel: React.FC = () => {
    const { tabs, activeTabId } = useEditorStore();

    // Convert open tabs to Sandpack files
    const files = useMemo(() => {
        const sandpackFiles: Record<string, string> = {};

        // Default template files if nothing is open
        if (tabs.length === 0) {
            return {
                '/App.js': `export default function App() {
  return <h1>Hello GuideSoft! Open a file to start editing.</h1>
}`
            };
        }

        tabs.forEach(tab => {
            // Sandpack expects paths starting with /
            // We strip the root path if possible or just use basename
            // Simple approach: Use the filename. If conflict, append ID.
            // Ideally we use relative paths.

            const path = tab.filepath;
            // Clean up absolute path for Sandpack (it wants relative to project root)
            // Assuming our project root is typically /Users/mac/mycursor/ai-code-editor
            // We can't know for sure, so we just use the filename for the "active" one or mapped structure.

            // For a robust preview, we really need the whole file tree. 
            // But tabs only have open files.
            // Let's just key them by filename for now
            const key = path.startsWith('/') ? path.split('/').pop()! : path;

            sandpackFiles[`/${key}`] = tab.content;
        });

        return sandpackFiles;
    }, [tabs]);

    // Determine the main file to show based on active tab
    const activeFile = useMemo(() => {
        const activeTab = tabs.find(t => t.id === activeTabId);
        if (activeTab) {
            const name = activeTab.filepath.split('/').pop()!;
            return `/${name}`;
        }
        return Object.keys(files)[0];
    }, [tabs, activeTabId, files]);

    return (
        <div className="h-full w-full bg-dark-bg border-l border-dark-border flex flex-col">
            <div className="p-2 border-b border-dark-border text-xs font-semibold text-gray-400">
                Live Preview (Sandpack)
            </div>
            <div className="flex-1 overflow-hidden">
                <Sandpack
                    template="react"
                    theme={monokaiPro}
                    files={files}
                    options={{
                        activeFile: activeFile,
                        visibleFiles: Object.keys(files),
                        showNavigator: true,
                        showLineNumbers: true,
                        wrapContent: true,
                        editorHeight: '100%',
                    }}
                    customSetup={{
                        dependencies: {
                            "lucide-react": "latest"
                        }
                    }}
                />
            </div>
        </div>
    );
};
