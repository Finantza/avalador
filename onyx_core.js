/**
 * ONYX CORE SYSTEM
 * Shared logic for Database and Global State management across multiple pages.
 */

window.OnyxCore = {
    // Database Interface (IndexedDB)
    DB: {
        dbName: "OnyxEvolutionDB",
        version: 4,
        db: null,

        async init() {
            return new Promise((resolve, reject) => {
                const request = indexedDB.open(this.dbName, this.version);
                request.onupgradeneeded = (e) => {
                    const db = e.target.result;
                    if (!db.objectStoreNames.contains('global_stats')) {
                        db.createObjectStore('global_stats', { keyPath: 'id' });
                    }
                    if (!db.objectStoreNames.contains('history')) {
                        db.createObjectStore('history', { keyPath: 'id', autoIncrement: true });
                    }
                };
                request.onsuccess = (e) => {
                    this.db = e.target.result;
                    resolve(this.db);
                };
                request.onerror = (e) => reject(e.target.error);
            });
        },

        async getUser(name) {
            if (!this.db) await this.init();
            return new Promise((resolve) => {
                const tx = this.db.transaction('global_stats', 'readonly');
                const store = tx.objectStore('global_stats');
                const request = store.get(name);
                request.onsuccess = () => resolve(request.result || { id: name, xp: 0, level: 1 });
            });
        },

        async saveUser(data) {
            if (!this.db) await this.init();
            return new Promise((resolve) => {
                const tx = this.db.transaction('global_stats', 'readwrite');
                const store = tx.objectStore('global_stats');
                store.put(data);
                tx.oncomplete = () => resolve();
            });
        },

        async saveHistory(entry) {
            if (!this.db) await this.init();
            return new Promise((resolve) => {
                const tx = this.db.transaction('history', 'readwrite');
                const store = tx.objectStore('history');
                store.add({ ...entry, timestamp: Date.now() });
                tx.oncomplete = () => resolve();
            });
        },

        async getRanking() {
            if (!this.db) await this.init();
            return new Promise((resolve) => {
                const tx = this.db.transaction('global_stats', 'readonly');
                const store = tx.objectStore('global_stats');
                const request = store.getAll();
                request.onsuccess = () => {
                    const users = request.result;
                    resolve(users.sort((a, b) => b.xp - a.xp).slice(0, 10));
                };
            });
        },

        async createTestUser() {
            const testName = "OPERADOR TESTE";
            const user = await this.getUser(testName);
            if (!user.password) {
                user.password = "1234";
                user.xp = 500;
                user.level = 2;
                await this.saveUser(user);
                console.log("[ONYX] Usuário de teste criado.");
            }
        }
    },

    // Session Management
    Session: {
        getCurrentUser() {
            return localStorage.getItem('onyx_active_user');
        },
        setCurrentUser(name) {
            localStorage.setItem('onyx_active_user', name);
        },
        logout() {
            localStorage.removeItem('onyx_active_user');
            window.location.href = 'index.html';
        },
        checkAuth() {
            if (!this.getCurrentUser()) {
                window.location.href = 'index.html';
            }
        }
    }
};
