import { BaseAgent } from '../BaseAgent';
import type { AgentType } from '../types';
import { contextService } from '../../ai/ContextService';
import { useEditorStore } from '../../../store/editorStore';
import { vectorStoreService } from '../../ai/VectorStoreService';

export class ContextGathererAgent extends BaseAgent {
    public type: AgentType = 'CONTEXT_GATHERER';

    constructor(messageBus: any) {
        super(messageBus);
        this.registerHandler('gather_context', this.gatherContext.bind(this));
    }

    private async gatherContext(data: { query: string }, _context?: any) {
        // 1. Get Open Files Context
        await contextService.refreshContext();
        const tabs = useEditorStore.getState().tabs;
        const openFiles = tabs.map((t: any) => ({ // Map to simpler structure
            path: t.path || t.filepath,
            content: t.content
        }));

        // 2. Scan Project / RAG
        // If query is present, use Vector Search
        let relevantSnippets: any[] = [];
        if (data.query) {
            const docs = await vectorStoreService.search(data.query, 5);
            relevantSnippets = docs.map(d => ({
                path: d.metadata.path,
                content: d.text,
                lines: [d.metadata.lineStart, d.metadata.lineEnd]
            }));
        }

        // 3. Dependency Context (Mocked or simple Package.json read)
        // const pkg = await fileSystemService.readFile('package.json'); ...

        return {
            openFiles,
            relevantSnippets,
            projectStructure: 'Root' // Simplification
        };
    }
}
