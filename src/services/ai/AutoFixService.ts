export const autoFixService = {
    scanForBugs: async (fileContent: string) => {
        // Mock static analysis
        const bugs = [];
        if (fileContent.includes('any')) bugs.push('Avoid using "any" type.');
        if (fileContent.includes('console.log')) bugs.push('Remove debug logging.');
        return bugs;
    }
};
