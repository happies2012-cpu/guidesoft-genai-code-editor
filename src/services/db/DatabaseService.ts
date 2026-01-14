import { openDB, type DBSchema, type IDBPDatabase } from 'idb';

interface AppDB extends DBSchema {
    users: {
        key: string;
        value: {
            id: string;
            email: string;
            role: 'admin' | 'user';
            created_at: string;
        };
    };
    projects: {
        key: string;
        value: {
            id: string;
            name: string;
            user_id: string;
            content: Record<string, unknown>;
            updated_at: string;
        };
    };
}

class DatabaseService {
    private db: IDBPDatabase<AppDB> | null = null;
    private dbName = 'GuideSoftDB';

    async init() {
        this.db = await openDB<AppDB>(this.dbName, 1, {
            upgrade(db) {
                if (!db.objectStoreNames.contains('users')) {
                    db.createObjectStore('users', { keyPath: 'id' });
                }
                if (!db.objectStoreNames.contains('projects')) {
                    db.createObjectStore('projects', { keyPath: 'id' });
                }
            },
        });
        console.log('✅ GuideSoft Local Database Initialized (IndexedDB)');
    }

    // Supabase-like syntax wrapper
    from(table: 'users' | 'projects') {
        return {
            select: async (query?: Record<string, unknown>) => {
                if (!this.db) await this.init();
                const tx = this.db!.transaction(table, 'readonly');
                const store = tx.objectStore(table);
                const allItems = await store.getAll();
                // Simple mock filtering
                if (query) {
                    // Basic filtering logic could go here
                }
                return { data: allItems, error: null };
            },
            insert: async (data: Record<string, unknown>) => {
                if (!this.db) await this.init();
                const tx = this.db!.transaction(table, 'readwrite');
                const store = tx.objectStore(table);
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                await store.put(data as any);
                return { data, error: null };
            },
            update: async (id: string, updates: Record<string, unknown>) => {
                if (!this.db) await this.init();
                const tx = this.db!.transaction(table, 'readwrite');
                const store = tx.objectStore(table);
                const item = await store.get(id);
                if (item) {
                    const updated = { ...item, ...updates };
                    await store.put(updated);
                    return { data: updated, error: null };
                }
                return { data: null, error: 'Not found' };
            }
        };
    }
}

export const dbService = new DatabaseService();
