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
            portugues: 1, algebra: 1, historia: 1, biologia: 1, inclusao_acessibilidade: 1,
            literatura: 2, geometria: 2, geografia: 2, fisica: 2, tecnologia: 2,
            ingles: 3, estatistica: 3, filosofia: 3, quimica: 3, empreendedorismo: 3, projeto_vida: 3,
            artes: 4, matematica_financeira: 4, sociologia: 4, robotica: 4, biblioteca_digital: 4,
            educacao_fisica: 5, programacao: 5, marketing_digital: 5, laboratorio_virtual: 5,
            design_digital: 6, ciencia_de_dados: 6, educacao_financeira: 6,
            producao_audiovisual: 7, inteligencia_artificial: 7, seguranca_informacao: 7,
            desenvolvimento_jogos: 8
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
            "BNCC": "BNCC (Base Nacional Comum Curricular: as diretrizes oficiais que definem as competências essenciais que você deve desenvolver na escola)",
            "Itinerário Formativo": "Itinerário Formativo (a parte flexível do Novo Ensino Médio que permite você se aprofundar na área que mais gosta)",
            "ENEM": "ENEM (Exame Nacional do Ensino Médio: a prova unificada que avalia seu desempenho e abre as portas das universidades)",
            "Álgebra": "Álgebra (o ramo matemático que usa letras para representar valores desconhecidos e desvendar incógnitas)",
            "Geometria": "Geometria (a ciência de medir e desenhar formas, áreas, perímetros e volumes no plano e no espaço)",
            "Estatística": "Estatística (a análise inteligente de dados e gráficos para prever probabilidades e tirar conclusões do mundo real)",
            "Termodinâmica": "Termodinâmica (a física térmica que explica as trocas de calor, a energia em movimento e o funcionamento de motores)",
            "Fotossíntese": "Fotossíntese (o incrível processo celular no qual plantas convertem luz, água e CO2 em açúcar e oxigênio para a vida)",
            "Mitocôndria": "Mitocôndria (a usina de energia da célula, responsável por realizar a respiração celular e produzir ATP)",
            "DNA": "DNA (o ácido desoxirribonucleico: a molécula em dupla hélice que carrega a receita genética de toda a sua vida)",
            "Globalização": "Globalização (a conexão global de mercados, culturas, tecnologias e sociedades que encurtou as distâncias mundiais)",
            "Cibersegurança": "Cibersegurança (o conjunto de estratégias e ferramentas para blindar sistemas, redes e dados contra invasões cibernéticas)",
            "Empreendedorismo": "Empreendedorismo (a atitude de detectar problemas, planejar soluções inovadoras e gerar impacto social e econômico)",
            "Acessibilidade": "Acessibilidade (a garantia de recursos inclusivos para que todas as pessoas, incluindo neurodivergentes, usem a tecnologia)",
            "Algoritmo": "Algoritmo (a sequência lógica finita e estruturada de passos para o computador resolver um determinado problema)",
            "Array": "Array (uma estrutura organizada como um arquivo de pastas numeradas para guardar vários elementos de dados)",
            "Variável": "Variável (um pequeno espaço nomeado na memória onde o computador armazena temporariamente qualquer dado)",
            "Função": "Função (um bloco de código reutilizável que processa parâmetros de entrada e retorna uma saída específica)",
            "Loop": "Loop (uma estrutura de repetição automática que continua rodando instruções até que a condição seja atendida)",
            "SQL": "SQL (a linguagem oficial de consulta para estruturar, buscar e gerenciar dados organizados em tabelas de bancos de dados)"
        },
        simplifyText(text) {
            let newText = text;
            for (const [jargon, explanation] of Object.entries(this.dictionary)) {
                // Escape special regex characters in jargon just in case
                const escapedJargon = jargon.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
                // Use a Unicode-aware word boundary check for Portuguese accented characters
                const regex = new RegExp(`(^|[^A-Za-z0-9_À-ÖØ-öø-ÿ])(${escapedJargon})([^A-Za-z0-9_À-ÖØ-öø-ÿ]|$)`, 'gi');
                newText = newText.replace(regex, `$1<span class="tutor-highlight" style="color:var(--accent); font-weight:bold; cursor:pointer; text-decoration:underline dashed;" onclick="if(window.showTutorHint) window.showTutorHint('${explanation}')">$2</span>$3`);
            }
            return newText;
        }
    }
};

// =========================================================================
// GLOBAL ANTI-CHEAT SYSTEM (ONYX PROTOCOL SECURITY)
// =========================================================================
(function() {
    async function triggerGlobalCheatPenalty(reason) {
        const user = localStorage.getItem('onyx_active_user');
        if (!user) return;
        
        try {
            await OnyxCore.DB.init();
            let stats = await OnyxCore.DB.getUser(user);
            if (stats) {
                if (stats.level > 1) {
                    stats.level--;
                }
                stats.xp = 0; // Reset current level XP to 0 as penalty
                await OnyxCore.DB.saveUser(stats);
                alert(`⚠️ [SEGURANÇA GLOBAL ONYX] Tentativa de ver o código detectada (${reason})! Você violou as diretrizes do protocolo. Penalidade aplicada: -1 Nível.`);
            }
        } catch (err) {
            console.error("[ANTI-CHEAT GLOBAL] Erro ao aplicar penalidade:", err);
        }
        window.location.href = 'dashboard.html';
    }

    // 1. Context Menu Blocker (Right Click)
    document.addEventListener('contextmenu', (e) => {
        const user = localStorage.getItem('onyx_active_user');
        if (!user) return;
        
        e.preventDefault();
        triggerGlobalCheatPenalty('Clique Direito / Inspecionar');
    });

    // 2. Keyboard Shortcuts Blocker (F12, Inspect, View Source)
    document.addEventListener('keydown', (e) => {
        const user = localStorage.getItem('onyx_active_user');
        if (!user) return;

        const isF12 = e.key === 'F12' || e.keyCode === 123;
        const isInspectCombos = e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'i' || e.key === 'J' || e.key === 'j' || e.key === 'C' || e.key === 'c');
        const isViewSource = e.ctrlKey && (e.key === 'U' || e.key === 'u');
        
        if (isF12 || isInspectCombos || isViewSource) {
            e.preventDefault();
            triggerGlobalCheatPenalty('Atalhos de Desenvolvedor');
        }
    });
})();
