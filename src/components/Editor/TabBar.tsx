import { useState } from 'react';
import { X, MoreHorizontal } from 'lucide-react';
import { useEditorStore } from '../../store/editorStore';

export default function TabBar() {
    const { tabs, activeTabId, setActiveTab, removeTab, closeAllTabs, closeOtherTabs } = useEditorStore();
    const [contextMenu, setContextMenu] = useState<{ x: number; y: number; tabId: string } | null>(null);

    const handleTabClick = (tabId: string) => {
        setActiveTab(tabId);
    };

    const handleCloseTab = (e: React.MouseEvent, tabId: string) => {
        e.stopPropagation();
        removeTab(tabId);
    };

    const handleContextMenu = (e: React.MouseEvent, tabId: string) => {
        e.preventDefault();
        setContextMenu({ x: e.clientX, y: e.clientY, tabId });
    };

    return (
        <div className="flex items-center bg-dark-surface border-b border-dark-border overflow-x-auto custom-scrollbar h-10">
            {tabs.map((tab) => (
                <div
                    key={tab.id}
                    onClick={() => handleTabClick(tab.id)}
                    onContextMenu={(e) => handleContextMenu(e, tab.id)}
                    className={`
            group flex items-center gap-2 px-4 py-2 border-r border-dark-border cursor-pointer
            transition-colors min-w-[120px] max-w-[200px] h-full
            ${activeTabId === tab.id
                            ? 'bg-dark-bg text-white border-t-2 border-t-primary-500'
                            : 'bg-dark-surface text-gray-400 hover:bg-dark-hover hover:text-white'
                        }
          `}
                >
                    <span className="flex-1 truncate text-xs font-medium">
                        {tab.isDirty && <span className="text-primary-500 mr-1.5 inline-block w-2 h-2 rounded-full border border-primary-900 bg-primary-500 shadow-[0_0_5px_rgba(59,130,246,0.5)]"></span>}
                        {tab.filename}
                    </span>
                    <button
                        onClick={(e) => handleCloseTab(e, tab.id)}
                        className="opacity-0 group-hover:opacity-100 hover:bg-dark-hover rounded p-0.5 transition-opacity"
                    >
                        <X size={14} />
                    </button>
                </div>
            ))}
            {tabs.length === 0 && (
                <div className="flex items-center justify-center w-full h-full text-gray-600 text-xs italic bg-dark-bg/30">
                    No files open
                </div>
            )}

            {/* Context Menu */}
            {contextMenu && (
                <>
                    <div className="fixed inset-0 z-40" onClick={() => setContextMenu(null)} />
                    <div
                        className="fixed bg-dark-surface border border-dark-border rounded shadow-xl py-1 z-50 min-w-[160px]"
                        style={{ left: contextMenu.x, top: contextMenu.y }}
                    >
                        <button
                            onClick={() => { removeTab(contextMenu.tabId); setContextMenu(null); }}
                            className="w-full px-4 py-1.5 text-left text-xs hover:bg-dark-hover flex items-center gap-2"
                        >
                            Close
                        </button>
                        <button
                            onClick={() => { closeOtherTabs(contextMenu.tabId); setContextMenu(null); }}
                            className="w-full px-4 py-1.5 text-left text-xs hover:bg-dark-hover flex items-center gap-2 border-t border-dark-border/50"
                        >
                            Close Others
                        </button>
                        <button
                            onClick={() => { closeAllTabs(); setContextMenu(null); }}
                            className="w-full px-4 py-1.5 text-left text-xs hover:bg-dark-hover flex items-center gap-2"
                        >
                            Close All
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}
