import { fileSystemService } from '../filesystem/FileSystemService';

interface DocumentVector {
    id: string;
    text: string;
    vector: Float32Array;
    metadata: {
        path: string;
        lineStart: number;
        lineEnd: number;
    };
}

class VectorStoreService {
    private worker: Worker | null = null;
    private documents: DocumentVector[] = [];
    private pendingRequests: Map<string, { resolve: (val: any) => void; reject: (err: any) => void }> = new Map();
    private isModelLoaded = false;

    constructor() {
        // We will initialize the worker lazily or explicitly
    }

    async initialize() {
        if (this.worker) return;

        // Initialize worker
        this.worker = new Worker(new URL('../../workers/embeddings.worker.ts', import.meta.url), {
            type: 'module'
        });

        this.worker.onmessage = (event) => {
            const { id, status, embedding, error } = event.data;
            const request = this.pendingRequests.get(id);

            if (request) {
                if (error) request.reject(new Error(error));
                else if (status === 'ready') {
                    this.isModelLoaded = true;
                    request.resolve(true);
                } else if (embedding) {
                    request.resolve(embedding);
                }
                this.pendingRequests.delete(id);
            }
        };

        // Load model
        await this.sendMessage({ task: 'load' });
    }

    private sendMessage(payload: any): Promise<any> {
        return new Promise((resolve, reject) => {
            const id = Math.random().toString(36).substring(7);
            this.pendingRequests.set(id, { resolve, reject });
            this.worker?.postMessage({ ...payload, id });
        });
    }

    private chunkText(text: string, maxChunkSize = 512): string[] {
        // Simple chunking by lines for code
        const lines = text.split('\n');
        const chunks: string[] = [];
        let currentChunk: string[] = [];
        let currentLength = 0;

        for (const line of lines) {
            if (currentLength + line.length > maxChunkSize) {
                if (currentChunk.length > 0) chunks.push(currentChunk.join('\n'));
                currentChunk = [line];
                currentLength = line.length;
            } else {
                currentChunk.push(line);
                currentLength += line.length + 1; // +1 for newline
            }
        }
        if (currentChunk.length > 0) chunks.push(currentChunk.join('\n'));
        return chunks;
    }

    async indexFile(path: string, content: string) {
        if (!this.isModelLoaded) await this.initialize();

        const chunks = this.chunkText(content);

        // Remove old docs for this file
        this.documents = this.documents.filter(d => d.metadata.path !== path);

        let lineOffset = 1;
        for (const chunk of chunks) {
            const vectorArray = await this.sendMessage({ task: 'extract', text: chunk });
            const vector = new Float32Array(vectorArray); // Convert object/array back to TypedArray if needed

            const lineCount = chunk.split('\n').length;

            this.documents.push({
                id: Math.random().toString(36),
                text: chunk,
                vector,
                metadata: {
                    path,
                    lineStart: lineOffset,
                    lineEnd: lineOffset + lineCount - 1
                }
            });
            lineOffset += lineCount;
        }
    }

    async indexWorkspace() {
        const files = await fileSystemService.listAllFiles('');
        for (const file of files) {
            // Skip large or binary files logic here similar to SearchService
            if (file.name.endsWith('.png') || file.name.endsWith('.jpg') || file.name.endsWith('.json')) continue;

            try {
                const content = await fileSystemService.readFile(file.path);
                if (content.length < 50000) { // Limit size
                    await this.indexFile(file.path, content);
                }
            } catch (e) {
                console.warn('Failed to index', file.path);
            }
        }
    }

    private cosineSimilarity(a: Float32Array, b: Float32Array): number {
        let dot = 0;
        let normA = 0;
        let normB = 0;
        for (let i = 0; i < a.length; i++) {
            dot += a[i] * b[i];
            normA += a[i] * a[i];
            normB += b[i] * b[i];
        }
        return dot / (Math.sqrt(normA) * Math.sqrt(normB));
    }

    async search(query: string, topK = 5): Promise<DocumentVector[]> {
        if (!this.isModelLoaded) await this.initialize();

        const queryVectorArray = await this.sendMessage({ task: 'extract', text: query });
        const queryVector = new Float32Array(queryVectorArray);

        const scored = this.documents.map(doc => ({
            doc,
            score: this.cosineSimilarity(queryVector, doc.vector)
        }));

        scored.sort((a, b) => b.score - a.score);
        return scored.slice(0, topK).map(s => s.doc);
    }
}

export const vectorStoreService = new VectorStoreService();
