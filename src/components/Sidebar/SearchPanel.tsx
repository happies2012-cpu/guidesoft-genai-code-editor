import React, { useState } from 'react';
import { Search, CaseSensitive, Regex, ChevronRight, ChevronDown, Loader2 } from 'lucide-react';
import { useEditorStore } from '../../store/editorStore';
import { searchService } from '../../services/search/SearchService';


export const SearchPanel: React.FC = () => {
    const {
        searchQuery, setSearchQuery,
        searchResults, setSearchResults,
        isSearching, setIsSearching,
        openFile
    } = useEditorStore();

    const [isCaseSensitive, setIsCaseSensitive] = useState(false);
    const [isRegex, setIsRegex] = useState(false);
    const [expandedFiles, setExpandedFiles] = useState<Record<string, boolean>>({});

    const handleSearch = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!searchQuery.trim()) return;

        setIsSearching(true);
        try {
            const results = await searchService.searchFiles(searchQuery, {
                caseSensitive: isCaseSensitive,
                useRegex: isRegex
            });
            setSearchResults(results);

            // Auto expand all if few results
            if (results.length < 10) {
                const newExpanded: Record<string, boolean> = {};
                results.forEach(r => newExpanded[r.file] = true);
                setExpandedFiles(newExpanded);
            }
        } finally {
            setIsSearching(false);
        }
    };

    const toggleFile = (path: string) => {
        setExpandedFiles(prev => ({ ...prev, [path]: !prev[path] }));
    };

    const handleMatchClick = async (path: string, _line: number) => {
        await openFile(path);
        // Note: Ideally we'd scroll to line here. 
        // For now, opening the file is the first step.
    };

    return (
        <div className="flex flex-col h-full bg-dark-bg text-gray-300">
            <div className="p-4 border-b border-white/10">
                <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">Search</h2>
                <form onSubmit={handleSearch}>
                    <div className="relative">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search in files..."
                            className="w-full bg-dark-console text-sm rounded px-3 py-2 pl-9 border border-white/10 focus:border-blue-500 focus:outline-none"
                        />
                        <Search size={14} className="absolute left-3 top-2.5 text-gray-500" />
                    </div>

                    <div className="flex gap-2 mt-2">
                        <button
                            type="button"
                            onClick={() => setIsCaseSensitive(!isCaseSensitive)}
                            className={`p-1 rounded ${isCaseSensitive ? 'bg-blue-500/20 text-blue-400' : 'hover:bg-white/5 text-gray-500'}`}
                            title="Match Case"
                        >
                            <CaseSensitive size={16} />
                        </button>
                        <button
                            type="button"
                            onClick={() => setIsRegex(!isRegex)}
                            className={`p-1 rounded ${isRegex ? 'bg-blue-500/20 text-blue-400' : 'hover:bg-white/5 text-gray-500'}`}
                            title="Use Regular Expression"
                        >
                            <Regex size={16} />
                        </button>
                        <div className="flex-1" />
                        <button type="submit" className="hidden" /> {/* Allow enter key */}
                    </div>
                </form>
            </div>

            <div className="flex-1 overflow-y-auto p-2">
                {isSearching ? (
                    <div className="flex items-center justify-center h-20 text-gray-500">
                        <Loader2 className="animate-spin mr-2" size={16} />
                        Searching...
                    </div>
                ) : searchResults.length > 0 ? (
                    <div className="space-y-1">
                        <div className="text-xs text-gray-500 mb-2 px-2">
                            Found {searchResults.reduce((acc, r) => acc + r.matches.length, 0)} matches in {searchResults.length} files
                        </div>
                        {searchResults.map(result => (
                            <div key={result.file} className="overflow-hidden">
                                <button
                                    onClick={() => toggleFile(result.file)}
                                    className="flex items-center w-full px-2 py-1 hover:bg-white/5 rounded text-left"
                                >
                                    {expandedFiles[result.file] ? (
                                        <ChevronDown size={14} className="mr-1 text-gray-500" />
                                    ) : (
                                        <ChevronRight size={14} className="mr-1 text-gray-500" />
                                    )}
                                    <span className="text-sm font-medium truncate" title={result.file}>
                                        {result.filename}
                                    </span>
                                    <span className="ml-auto text-xs bg-white/10 rounded px-1.5 text-gray-400">
                                        {result.matches.length}
                                    </span>
                                </button>

                                {expandedFiles[result.file] && (
                                    <div className="ml-4 pl-2 border-l border-white/10 mt-1">
                                        {result.matches.map((match, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => handleMatchClick(result.file, match.line)}
                                                className="block w-full text-left px-2 py-1 text-xs hover:bg-white/10 rounded truncate font-mono text-gray-400"
                                            >
                                                <span className="text-blue-400 mr-2">{match.line}:</span>
                                                {match.text.trim()}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                ) : searchQuery && !isSearching ? (
                    <div className="text-center text-gray-500 mt-10 text-sm">
                        No results found.
                    </div>
                ) : null}
            </div>
        </div>
    );
};
