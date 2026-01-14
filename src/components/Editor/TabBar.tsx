import { X } from 'lucide-react';
import { useEditorStore } from '../../store/editorStore';

export default function TabBar() {
    const { tabs, activeTabId, setActiveTab, removeTab } = useEditorStore();

    const handleTabClick = (tabId: string) => {
        setActiveTab(tabId);
    };

    const handleCloseTab = (e: React.MouseEvent, tabId: string) => {
        e.stopPropagation();
        removeTab(tabId);
    };

    return (
        <div className="flex items-center bg-dark-surface border-b border-dark-border overflow-x-auto custom-scrollbar">
            {tabs.map((tab) => (
                <div
                    key={tab.id}
                    onClick={() => handleTabClick(tab.id)}
                    className={`
            group flex items-center gap-2 px-4 py-2 border-r border-dark-border cursor-pointer
            transition-colors min-w-[120px] max-w-[200px]
            ${activeTabId === tab.id
                            ? 'bg-dark-bg text-white'
                            : 'bg-dark-surface text-gray-400 hover:bg-dark-hover hover:text-white'
                        }
          `}
                >
                    <span className="flex-1 truncate text-sm">
                        {tab.isDirty && <span className="text-primary-500 mr-1">●</span>}
                        {tab.filename}
                    </span>
                    <button
                        onClick={(e) => handleCloseTab(e, tab.id)}
                        className="opacity-0 group-hover:opacity-100 hover:bg-dark-border rounded p-0.5 transition-opacity"
                    >
                        <X size={14} />
                    </button>
                </div>
            ))}
            {tabs.length === 0 && (
                <div className="flex items-center justify-center w-full h-full text-gray-500 text-sm">
                    No files open
                </div>
            )}
        </div>
    );
}
