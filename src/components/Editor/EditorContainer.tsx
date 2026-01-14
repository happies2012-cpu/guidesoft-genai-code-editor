import TabBar from './TabBar';
import MonacoEditor from './MonacoEditor';
import Breadcrumbs from './Breadcrumbs';
import { useEditorStore } from '../../store/editorStore';

export default function EditorContainer() {
    const { tabs, activeTabId, updateTab } = useEditorStore();
    const activeTab = tabs.find((t) => t.id === activeTabId);

    const handleEditorChange = (value: string | undefined) => {
        if (activeTab && value !== undefined) {
            updateTab(activeTab.id, {
                content: value,
                isDirty: true,
            });
        }
    };

    return (
        <div className="flex flex-col h-full bg-dark-bg">
            <TabBar />
            <Breadcrumbs />
            <div className="flex-1 overflow-hidden">
                {activeTab ? (
                    <MonacoEditor
                        key={activeTab.id}
                        tabId={activeTab.id}
                        value={activeTab.content}
                        language={activeTab.language}
                        onChange={handleEditorChange}
                    />
                ) : (
                    <div className="flex items-center justify-center h-full text-gray-500">
                        <div className="text-center">
                            <img src="/logo.png" alt="GUIDESOFT GENAI" className="h-16 w-auto mx-auto mb-4" />
                            <h2 className="text-2xl font-semibold mb-2">GUIDESOFT GENAI</h2>
                            <p className="text-sm">AI-Powered Code Editor</p>
                            <p className="text-sm mt-2">Open a file to start editing</p>
                            <p className="text-xs mt-4 text-gray-600">
                                Press <kbd className="px-2 py-1 bg-dark-surface rounded">Cmd/Ctrl + P</kbd> to open
                                command palette
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
