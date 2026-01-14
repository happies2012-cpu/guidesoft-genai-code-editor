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

            // Auto-save logic moved to useEffect
            useEffect(() => {
                if (!settings.autoSave || !activeTab || !activeTab.isDirty || !activeTab.filepath) return; // Added !activeTab.filepath check

                const timer = setTimeout(async () => {
                    const { fileSystemService } = await import('../../services/filesystem/FileSystemService');
                    try {
                        await fileSystemService.writeFile(activeTab.filepath, activeTab.content);
                        updateTab(activeTab.id, { isDirty: false });
                        console.log(`Auto-saved ${activeTab.filename}`);
                    } catch (error) {
                        console.error('Auto-save failed:', error);
                    }
                }, 1500);

                return () => clearTimeout(timer);
            }, [activeTab?.content, activeTab?.isDirty, activeTab?.filepath, settings.autoSave, activeTab?.id, activeTab?.filename, updateTab]); // Added dependencies

            const handleEditorChange = (value: string | undefined) => {
                if (activeTabId && value !== undefined) {
                    updateTab(activeTabId, { content: value, isDirty: true });
                }
            };

            // New welcome screen rendering
            if (!activeTab) {
                return (
                    <div className="flex flex-col h-full bg-dark-bg">
                        <TabBar />
                        <div className="flex-1 flex items-center justify-center p-8 overflow-y-auto">
                            <div className="max-w-2xl w-full">
                                <div className="text-center mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
                                    <img src="/logo.png" alt="GUIDESOFT GENAI" className="w-24 h-24 mx-auto mb-6 drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]" />
                                    <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-white to-gray-500 bg-clip-text text-transparent">
                                        GUIDESOFT GENAI
                                    </h1>
                                    <p className="text-gray-400 text-lg max-w-md mx-auto">
                                        The next generation AI-powered code editor for professional developers.
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
                                    <div className="space-y-4">
                                        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider px-2">Recent Files</h3>
                                        <div className="space-y-1 bg-dark-surface/30 p-2 rounded-xl border border-dark-border/50">
                                            {recentFiles.length > 0 ? (
                                                recentFiles.map((path) => (
                                                    <button
                                                        key={path}
                                                        onClick={() => openFile(path)}
                                                        className="w-full text-left px-3 py-2 rounded-lg hover:bg-dark-hover transition-colors group flex items-center justify-between"
                                                    >
                                                        <div className="flex items-center gap-3 overflow-hidden">
                                                            <span className="text-primary-500 group-hover:scale-110 transition-transform">📄</span>
                                                            <div className="flex flex-col overflow-hidden">
                                                                <span className="text-sm text-gray-200 truncate">{path.split('/').pop()}</span>
                                                                <span className="text-[10px] text-gray-500 truncate">{path}</span>
                                                            </div>
                                                        </div>
                                                    </button>
                                                ))
                                            ) : (
                                                <div className="px-3 py-6 text-center text-gray-600 text-sm italic">
                                                    No recent files. Open a folder to get started.
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider px-2">Quick Actions</h3>
                                        <div className="grid grid-cols-1 gap-2">
                                            <button className="flex items-center gap-3 px-4 py-3 bg-dark-surface hover:bg-dark-hover rounded-xl border border-dark-border transition-all hover:scale-[1.02] active:scale-95 group">
                                                <div className="w-8 h-8 rounded-lg bg-primary-900/30 flex items-center justify-center text-primary-500 group-hover:bg-primary-500 group-hover:text-white transition-colors">
                                                    ⌘P
                                                </div>
                                                <div className="text-left">
                                                    <div className="text-sm font-medium text-gray-200">Command Palette</div>
                                                    <div className="text-[10px] text-gray-500">Search files and commands</div>
                                                </div>
                                            </button>
                                            <button className="flex items-center gap-3 px-4 py-3 bg-dark-surface hover:bg-dark-hover rounded-xl border border-dark-border transition-all hover:scale-[1.02] active:scale-95 group">
                                                <div className="w-8 h-8 rounded-lg bg-orange-900/30 flex items-center justify-center text-orange-500 group-hover:bg-orange-500 group-hover:text-white transition-colors">
                                                    /
                                                </div>
                                                <div className="text-left">
                                                    <div className="text-sm font-medium text-gray-200">AI Chat</div>
                                                    <div className="text-[10px] text-gray-500">Ask the assistant anything</div>
                                                </div>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            }

            return (
                <div className="flex flex-col h-full bg-dark-bg">
                    <TabBar />
                    <Breadcrumbs />
                    <div className="flex-1 overflow-hidden">
                        <MonacoEditor
                            key={activeTab.id}
                            tabId={activeTab.id}
                            value={activeTab.content}
                            language={activeTab.language}
                            onChange={handleEditorChange}
                        />
                    </div>
                </div>
            );
        }
        ```
