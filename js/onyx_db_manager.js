/**
 * ONYX DB MANAGER v1.0
 * Gerenciador persistente de questões via IndexedDB.
 * Faz seed a partir de /data/onyx_database.db (JSON),
 * indexa por [subject, difficulty] e persiste novas questões geradas.
 */

window.OnyxDBManager = {
    SEED_FLAG: 'onyx_qbank_seeded_v1',
    SEED_FILE: 'data/onyx_database.db',

    // ─── SEED ────────────────────────────────────────────────────────────────
    async seed(force = false) {
        if (localStorage.getItem(this.SEED_FLAG) && !force) {
            console.log('[DBManager] Banco já populado. Pulando seed.');
            return { status: 'skipped' };
        }
        try {
            console.log('[DBManager] Carregando arquivo seed...');
            const resp = await fetch(this.SEED_FILE + '?v=' + Date.now());
            if (!resp.ok) throw new Error('Arquivo seed não encontrado: ' + this.SEED_FILE);
            const seed = await resp.json();
            const subjects = seed.subjects || {};
            let total = 0;

            const db = await window.OnyxCore.DB.init();
            if (!db) throw new Error('IndexedDB não inicializado');

            for (const [subject, diffs] of Object.entries(subjects)) {
                for (const [difficulty, questions] of Object.entries(diffs)) {
                    if (!Array.isArray(questions) || questions.length === 0) continue;
                    await new Promise((resolve, reject) => {
                        const tx = db.transaction(['question_bank'], 'readwrite');
                        const store = tx.objectStore('question_bank');
                        questions.forEach(q => {
                            store.put({
                                subject,
                                difficulty,
                                sd: `${subject}_${difficulty}`,
                                source: 'seed',
                                q: q.q, a: q.a, d: q.d,
                                explanation: q.explanation || '',
                                hint: q.hint || '',
                                concept: q.concept || 'BNCC'
                            });
                        });
                        tx.oncomplete = () => resolve();
                        tx.onerror = () => reject(tx.error);
                    });
                    total += questions.length;
                }
            }
            localStorage.setItem(this.SEED_FLAG, Date.now().toString());
            console.log(`[DBManager] ${total} questões carregadas do seed.`);
            return { status: 'seeded', count: total };
        } catch (err) {
            console.error('[DBManager] Seed falhou:', err);
            return { status: 'error', error: err.message };
        }
    },

    // ─── GET POOL ─────────────────────────────────────────────────────────────
    async getPool(subject, difficulty) {
        const db = await window.OnyxCore.DB.init();
        if (!db) return [];
        return new Promise(resolve => {
            try {
                const tx = db.transaction(['question_bank'], 'readonly');
                const idx = tx.objectStore('question_bank').index('sd');
                const req = idx.getAll(`${subject}_${difficulty}`);
                req.onsuccess = () => resolve(req.result || []);
                req.onerror = () => resolve([]);
            } catch (e) { resolve([]); }
        });
    },

    // ─── SAVE NEW QUESTIONS ───────────────────────────────────────────────────
    async saveQuestions(subject, difficulty, questions) {
        const db = await window.OnyxCore.DB.init();
        if (!db || !questions || questions.length === 0) return 0;

        // Evitar duplicatas: buscar textos existentes
        const existing = await this.getPool(subject, difficulty);
        const existingTexts = new Set(existing.map(q => q.q));

        return new Promise(resolve => {
            try {
                const tx = db.transaction(['question_bank'], 'readwrite');
                const store = tx.objectStore('question_bank');
                let saved = 0;
                questions.forEach(q => {
                    if (q.q && !existingTexts.has(q.q)) {
                        store.put({
                            subject, difficulty,
                            sd: `${subject}_${difficulty}`,
                            source: 'generated',
                            savedAt: Date.now(),
                            q: q.q, a: q.a, d: q.d,
                            explanation: q.explanation || '',
                            hint: q.hint || '',
                            concept: q.concept || 'BNCC-GEN'
                        });
                        saved++;
                    }
                });
                tx.oncomplete = () => resolve(saved);
                tx.onerror = () => resolve(0);
            } catch (e) { resolve(0); }
        });
    },

    // ─── COUNT ────────────────────────────────────────────────────────────────
    async getCount(subject, difficulty) {
        const db = await window.OnyxCore.DB.init();
        if (!db) return 0;
        return new Promise(resolve => {
            try {
                const tx = db.transaction(['question_bank'], 'readonly');
                const idx = tx.objectStore('question_bank').index('sd');
                const req = idx.count(`${subject}_${difficulty}`);
                req.onsuccess = () => resolve(req.result || 0);
                req.onerror = () => resolve(0);
            } catch (e) { resolve(0); }
        });
    },

    // ─── STATS ────────────────────────────────────────────────────────────────
    async getStats() {
        const db = await window.OnyxCore.DB.init();
        if (!db) return {};
        return new Promise(resolve => {
            try {
                const tx = db.transaction(['question_bank'], 'readonly');
                const req = tx.objectStore('question_bank').getAll();
                req.onsuccess = () => {
                    const stats = {};
                    (req.result || []).forEach(item => {
                        const key = `${item.subject}/${item.difficulty}`;
                        if (!stats[key]) stats[key] = { total: 0, seed: 0, generated: 0 };
                        stats[key].total++;
                        if (item.source === 'seed') stats[key].seed++;
                        else stats[key].generated++;
                    });
                    resolve(stats);
                };
                req.onerror = () => resolve({});
            } catch (e) { resolve({}); }
        });
    },

    // ─── EXPORT / DOWNLOAD ────────────────────────────────────────────────────
    async exportJSON() {
        const db = await window.OnyxCore.DB.init();
        if (!db) return null;
        return new Promise(resolve => {
            const tx = db.transaction(['question_bank'], 'readonly');
            const req = tx.objectStore('question_bank').getAll();
            req.onsuccess = () => {
                const dump = {
                    version: 1,
                    exported_at: new Date().toISOString(),
                    subjects: {}
                };
                (req.result || []).forEach(item => {
                    if (!dump.subjects[item.subject]) dump.subjects[item.subject] = {};
                    if (!dump.subjects[item.subject][item.difficulty]) dump.subjects[item.subject][item.difficulty] = [];
                    dump.subjects[item.subject][item.difficulty].push({
                        q: item.q, a: item.a, d: item.d,
                        explanation: item.explanation,
                        hint: item.hint,
                        concept: item.concept
                    });
                });
                resolve(JSON.stringify(dump, null, 2));
            };
            req.onerror = () => resolve(null);
        });
    },

    async downloadDB() {
        const json = await this.exportJSON();
        if (!json) { alert('[DBManager] Nada para exportar.'); return; }
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'onyx_database.db';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    },

    // ─── AUTO-INIT ────────────────────────────────────────────────────────────
    async init() {
        await window.OnyxCore.DB.init();
        await this.seed();
        const stats = await this.getStats();
        const total = Object.values(stats).reduce((s, v) => s + v.total, 0);
        console.log(`[DBManager] Banco ativo — ${total} questões indexadas.`, stats);
        return stats;
    }
};
