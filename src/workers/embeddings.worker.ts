import { pipeline, env } from '@xenova/transformers';

// Skip local checks for browser
env.allowLocalModels = false;
env.useBrowserCache = true;

let extractor: any = null;

self.addEventListener('message', async (event) => {
    const { id, text, task } = event.data;

    try {
        if (task === 'load') {
            if (!extractor) {
                // Feature extraction pipeline
                extractor = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
            }
            self.postMessage({ id, status: 'ready' });
            return;
        }

        if (task === 'extract') {
            if (!extractor) throw new Error('Model not loaded');

            // Generate embedding (cls token or mean pooling)
            const output = await extractor(text, { pooling: 'mean', normalize: true });
            self.postMessage({ id, embedding: output.data });
        }
    } catch (error) {
        self.postMessage({ id, error: (error as Error).message });
    }
});
