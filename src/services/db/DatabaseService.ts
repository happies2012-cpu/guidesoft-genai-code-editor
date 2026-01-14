// IndexedDB Wrapper for Local Persistence
export interface LocalProject {
    id: string;
    name: string;
    lastData: string;
    files: Record<string, string>;
}

export const db = {
    saveProject: async (project: LocalProject) => {
        localStorage.setItem(`project_${project.id}`, JSON.stringify(project));
        console.log('Project saved to LocalStorage');
    },
    loadProject: (id: string): LocalProject | null => {
        const data = localStorage.getItem(`project_${id}`);
        return data ? JSON.parse(data) : null;
    }
};
