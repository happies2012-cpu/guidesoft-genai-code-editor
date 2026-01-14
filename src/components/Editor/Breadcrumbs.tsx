import { ChevronRight, File, Folder } from 'lucide-react';
import { useEditorStore } from '../../store/editorStore';

export default function Breadcrumbs() {
    const { tabs, activeTabId } = useEditorStore();
    const activeTab = tabs.find((t) => t.id === activeTabId);

    if (!activeTab || !activeTab.filepath) {
        return (
            <div className="flex items-center gap-2 px-4 py-1.5 bg-dark-bg border-b border-dark-border min-h-[32px]">
                <span className="text-xs text-gray-500 italic">No file selected</span>
            </div>
        );
    }

    // Split path into parts, removing empty strings (e.g. from leading slash)
    const pathParts = activeTab.filepath.split('/').filter(Boolean);

    return (
        <div className="flex items-center gap-1.5 px-4 py-1.5 bg-dark-bg border-b border-dark-border overflow-x-auto no-scrollbar min-h-[32px] select-none">
            <div className="flex items-center gap-1 text-gray-500 hover:text-gray-300 cursor-pointer transition-colors">
                <Folder size={14} />
            </div>

            {pathParts.map((part, index) => (
                <div key={index} className="flex items-center gap-1.5 whitespace-nowrap">
                    <ChevronRight size={12} className="text-gray-600 flex-shrink-0" />
                    <div
                        className={`flex items-center gap-1 text-xs cursor-pointer transition-colors ${index === pathParts.length - 1
                                ? 'text-primary-400 font-medium'
                                : 'text-gray-400 hover:text-gray-200'
                            }`}
                    >
                        {index === pathParts.length - 1 && <File size={12} className="flex-shrink-0" />}
                        <span>{part}</span>
                    </div>
                </div>
            ))}
        </div>
    );
}
