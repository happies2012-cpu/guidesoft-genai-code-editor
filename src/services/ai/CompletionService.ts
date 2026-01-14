export const completionService = {
    getCompletion: async (code: string, cursorOffset: number) => {
        // Mock prediction based on last character
        if (code[cursorOffset - 1] === '.') return ['map', 'filter', 'reduce'];
        return [];
    }
};
