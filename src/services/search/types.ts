export interface SearchMatch {
    line: number;
    column: number;
    text: string;     // The full line content
    matchText: string; // The specific text that matched
}

export interface SearchResult {
    file: string;     // Absolute path
    filename: string; // Basename
    matches: SearchMatch[];
}

export interface SearchOptions {
    caseSensitive: boolean;
    useRegex: boolean;
    exclude?: string[];
}
