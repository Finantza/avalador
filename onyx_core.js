/**
 * ONYX CORE SYSTEM
 * Centralized Database, Session, and Progression Engine.
 */

window.OnyxCore = {
    DB: {
        instance: null,
        async init() {
            if (this.instance) return this.instance;
            return new Promise((resolve) => {
                const timeout = setTimeout(() => resolve(null), 3000);
                try {
                    // Increased version to 13 to support Cloud Sync
                    const request = indexedDB.open('OnyxEliteDB', 13);
                    request.onupgradeneeded = (e) => {
                        const db = e.target.result;
                        console.log("[ONYX] Upgrading DB to v13...");
                        if (!db.objectStoreNames.contains('global_stats')) {
                            db.createObjectStore('global_stats', { keyPath: 'id' });
                        }
                        if (!db.objectStoreNames.contains('history')) {
                            db.createObjectStore('history', { keyPath: 'timestamp' });
                        }
                        if (!db.objectStoreNames.contains('cached_questions')) {
                            db.createObjectStore('cached_questions', { keyPath: 'id' });
                        }
                        if (!db.objectStoreNames.contains('dynamic_questions')) {
                            db.createObjectStore('dynamic_questions', { autoIncrement: true });
                        }
                    };
                    request.onsuccess = (e) => {
                        clearTimeout(timeout);
                        this.instance = e.target.result;
                        this.createTestUser();
                        resolve(this.instance);
                    };
                    request.onerror = () => resolve(null);
                } catch (err) { resolve(null); }
            });
        },

        async createTestUser() {
            if (!this.instance) return;
            try {
                const tx = this.instance.transaction(['global_stats'], 'readwrite');
                tx.objectStore('global_stats').put({ id: 'OPERADOR TESTE', password: '1234', level: 1, xp: 0 });
            } catch(e) {}
        },

        async saveQuestions(subject, difficulty, questions) {
            const db = await this.init();
            if (!db) return;
            try {
                const tx = db.transaction(['cached_questions'], 'readwrite');
                tx.objectStore('cached_questions').put({
                    id: `${subject}_${difficulty}`,
                    data: questions,
                    timestamp: Date.now()
                });
            } catch(e) { console.error("[ONYX] Erro ao salvar cache:", e); }
        },

        async saveDynamicQuestions(questionsArray) {
            const db = await this.init();
            if (!db) return;
            try {
                const tx = db.transaction(['dynamic_questions'], 'readwrite');
                const store = tx.objectStore('dynamic_questions');
                questionsArray.forEach(q => store.put(q));
            } catch(e) { console.error("[ONYX] Erro ao salvar questões dinâmicas:", e); }
        },

        async getDynamicQuestions() {
            const db = await this.init();
            if (!db) return [];
            return new Promise((resolve) => {
                const tx = db.transaction(['dynamic_questions'], 'readonly');
                const request = tx.objectStore('dynamic_questions').getAll();
                request.onsuccess = () => resolve(request.result || []);
                request.onerror = () => resolve([]);
            });
        },

        async getQuestions(subject, difficulty) {
            const db = await this.init();
            if (!db) return null;
            try {
                return new Promise((resolve) => {
                    const tx = db.transaction(['cached_questions'], 'readonly');
                    const request = tx.objectStore('cached_questions').get(`${subject}_${difficulty}`);
                    request.onsuccess = () => resolve(request.result ? request.result.data : null);
                    request.onerror = () => resolve(null);
                });
            } catch(e) { return null; }
        },

        async getUser(id) {
            const db = await this.init();
            if (!db) return { id, level: 1, xp: 0 };
            return new Promise((resolve) => {
                const tx = db.transaction(['global_stats'], 'readonly');
                const request = tx.objectStore('global_stats').get(id);
                request.onsuccess = () => resolve(request.result || null);
                request.onerror = () => resolve(null);
            });
        },

        async saveUser(user) {
            const db = await this.init();
            if (!db) return false;
            return new Promise((resolve) => {
                const tx = db.transaction(['global_stats'], 'readwrite');
                tx.objectStore('global_stats').put(user);
                tx.oncomplete = () => resolve(true);
            });
        },

        async getAllUsers() {
            const db = await this.init();
            if (!db) return [];
            return new Promise((resolve) => {
                const tx = db.transaction(['global_stats'], 'readonly');
                const request = tx.objectStore('global_stats').getAll();
                request.onsuccess = () => resolve(request.result || []);
                request.onerror = () => resolve([]);
            });
        },

        async saveHistory(entry) {
            const db = await this.init();
            if (!db) return;
            entry.timestamp = Date.now();
            try {
                const tx = db.transaction(['history'], 'readwrite');
                tx.objectStore('history').add(entry);
            } catch(e) {}
        },

        async getHistory(userId) {
            const db = await this.init();
            if (!db) return [];
            return new Promise((resolve) => {
                const tx = db.transaction(['history'], 'readonly');
                const store = tx.objectStore('history');
                const request = store.getAll();
                request.onsuccess = () => {
                    const filtered = request.result
                        .filter(h => h.user === userId)
                        .sort((a, b) => b.timestamp - a.timestamp);
                    resolve(filtered);
                };
                request.onerror = () => resolve([]);
            });
        },

        async exportDatabase() {
            const db = await this.init();
            if (!db) return null;
            
            const dump = { global_stats: [], history: [], dynamic_questions: [] };
            const stores = Object.keys(dump);
            
            for (let s of stores) {
                dump[s] = await new Promise(resolve => {
                    const tx = db.transaction([s], 'readonly');
                    const req = tx.objectStore(s).getAll();
                    req.onsuccess = () => resolve(req.result || []);
                    req.onerror = () => resolve([]);
                });
            }
            
            return JSON.stringify(dump);
        },

        async importDatabase(jsonData) {
            const db = await this.init();
            if (!db) return false;
            
            try {
                const dump = JSON.parse(jsonData);
                const stores = Object.keys(dump);
                
                for (let s of stores) {
                    if (db.objectStoreNames.contains(s) && dump[s].length > 0) {
                        await new Promise((resolve, reject) => {
                            const tx = db.transaction([s], 'readwrite');
                            const store = tx.objectStore(s);
                            store.clear().onsuccess = () => {
                                dump[s].forEach(item => store.put(item));
                            };
                            tx.oncomplete = () => resolve(true);
                            tx.onerror = () => reject();
                        });
                    }
                }
                return true;
            } catch(e) {
                console.error("[ONYX] Erro ao importar BD:", e);
                return false;
            }
        },

        async createInternalSnapshot() {
            try {
                const dataStr = await this.exportDatabase();
                if (dataStr) {
                    localStorage.setItem('onyx_internal_vault', dataStr);
                    return true;
                }
                return false;
            } catch(e) { return false; }
        },

        async restoreInternalSnapshot() {
            const dataStr = localStorage.getItem('onyx_internal_vault');
            if (!dataStr) return false;
            return await this.importDatabase(dataStr);
        }
    },

    Session: {
        login(user) {
            localStorage.setItem('onyx_active_user', user);
            window.location.href = 'dashboard.html';
        },
        logout() {
            localStorage.removeItem('onyx_active_user');
            window.location.href = 'index.html';
        },
        getCurrentUser() {
            return localStorage.getItem('onyx_active_user');
        },
        async checkAuth() {
            const user = this.getCurrentUser();
            if (!user) {
                window.location.href = 'index.html';
                return null;
            }
            await OnyxCore.DB.init();
            return user;
        }
    },

    ProgressionConfig: {
        subjects: {
            matematica: 1, portugues: 1, historia: 2, geografia: 2, biologia: 3, fisica: 3, quimica: 3,
            filosofia: 4, sociologia: 4, ingles: 5, artes: 5, literatura: 5,
            python: 6, estatistica: 6, probabilidade: 6, data_manipulation: 7, data_viz: 7,
            big_data: 8, machine_learning: 9, deep_learning: 10, nlp: 10, cybersecurity: 11
        },
        difficulties: { 
            easy: 1, 
            medium: 2, 
            hard: 3, 
            insane: 4, 
            impossible: 5 
        }
    },

    Tutor: {
        dictionary: {
            "Array": "Array (uma lista organizada, como gavetas numeradas num armário)",
            "Variável": "Variável (uma caixinha com um nome onde você guarda um dado, como um número ou texto)",
            "Função": "Função (uma pequena máquina: você põe algo dentro, ela processa e devolve um resultado)",
            "Loop": "Loop (um ciclo de repetição, como dar várias voltas num quarteirão até cansar)",
            "While": "While (enquanto uma condição for verdade, repita a ação)",
            "For": "For (um ciclo de repetição onde você sabe exatamente quantas vezes vai rodar)",
            "If/Else": "If/Else (um cruzamento: SE chover, pegue o guarda-chuva, SENÃO, vá de óculos de sol)",
            "SQL": "SQL (uma linguagem para fazer perguntas a um Banco de Dados, como pesquisar no Google)",
            "Select": "Select (comando para 'buscar/selecionar' dados numa tabela)",
            "Join": "Join (comando para grudar/unir duas tabelas diferentes usando algo em comum)",
            "Machine Learning": "Machine Learning (quando o computador aprende a reconhecer padrões sozinho, sem você precisar programar todas as regras)",
            "Algoritmo": "Algoritmo (uma receita de bolo passo a passo que o computador deve seguir)",
            "String": "String (um texto, uma palavra ou frase, sempre entre aspas)",
            "Integer": "Integer (um número inteiro, sem vírgula, como 1, 2 ou 10)",
            "Float": "Float (um número quebrado, com vírgula, como 3.14)",
            "Boolean": "Boolean (um valor lógico que só pode ser Verdadeiro ou Falso)",
            "Sintaxe": "Sintaxe (a regra de como escrever o código, igual as regras de gramática do português)",
            "Bug": "Bug (um defeito ou erro na lógica do código que faz ele não funcionar como deveria)"
        },
        simplifyText(text) {
            let newText = text;
            for (const [jargon, explanation] of Object.entries(this.dictionary)) {
                // Use word boundaries to avoid replacing parts of other words
                const regex = new RegExp(`\\b${jargon}\\b`, 'gi');
                newText = newText.replace(regex, `<span class="tutor-highlight" style="color:var(--accent); font-weight:bold; cursor:pointer; text-decoration:underline dashed;" onclick="if(window.showTutorHint) window.showTutorHint('${explanation}')">$&</span>`);
            }
            return newText;
        }
    }
};
