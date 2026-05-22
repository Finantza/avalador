/**
 * ONYX CORE SYSTEM
 * Centralized Database, Session, and Progression Engine.
 */

window.OnyxCore = {
    Crypto: {
        async hashSHA256(str) {
            if (!str) return '';
            try {
                const utf8 = new TextEncoder().encode(str);
                const hashBuffer = await crypto.subtle.digest('SHA-256', utf8);
                const hashArray = Array.from(new Uint8Array(hashBuffer));
                const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
                return hashHex;
            } catch (e) {
                console.error("[ONYX CRYPTO] Falha ao computar hash SHA-256:", e);
                return '';
            }
        }
    },
    DB: {
        instance: null,
        async init() {
            if (this.instance) return this.instance;
            return new Promise((resolve) => {
                const timeout = setTimeout(() => resolve(null), 3000);
                try {
                    // v15: question_bank store com índices sd, ano, sda
                    const request = indexedDB.open('OnyxEliteDB', 15);
                    request.onupgradeneeded = (e) => {
                        const db = e.target.result;
                        const oldVer = e.oldVersion;
                        console.log(`[ONYX] Upgrading DB v${oldVer} → v15...`);
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
                        // NOVO: banco persistente de questões indexado por subject+difficulty
                        let qStore;
                        if (!db.objectStoreNames.contains('question_bank')) {
                            qStore = db.createObjectStore('question_bank', { autoIncrement: true });
                            qStore.createIndex('subject', 'subject', { unique: false });
                            qStore.createIndex('difficulty', 'difficulty', { unique: false });
                            qStore.createIndex('sd', 'sd', { unique: false }); // "subject_difficulty"
                            qStore.createIndex('source', 'source', { unique: false });
                            console.log('[ONYX] Store question_bank criado com índices.');
                        } else {
                            qStore = e.target.transaction.objectStore('question_bank');
                        }
                        
                        if (!qStore.indexNames.contains('ano')) {
                            qStore.createIndex('ano', 'ano', { unique: false });
                            console.log('[ONYX] Índice ano adicionado.');
                        }
                        if (!qStore.indexNames.contains('sda')) {
                            qStore.createIndex('sda', 'sda', { unique: false });
                            console.log('[ONYX] Índice composto sda adicionado.');
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
                const hashedPassword = await OnyxCore.Crypto.hashSHA256('1234');
                const tx = this.instance.transaction(['global_stats'], 'readwrite');
                const store = tx.objectStore('global_stats');
                
                const defaultUsers = [
                    { id: 'aluno', password: hashedPassword, level: 1, xp: 0, role: 'aluno', coins: 0, inventory: { tutor: 3, life: 1, fifty: 1, time: 1, skip: 1 } },
                    { id: 'gestor', password: hashedPassword, level: 10, xp: 300, role: 'gestor', coins: 0, inventory: { tutor: 3, life: 1, fifty: 1, time: 1, skip: 1 } },
                    { id: 'responsavel', password: hashedPassword, level: 1, xp: 0, role: 'responsavel', coins: 0, inventory: { tutor: 3, life: 1, fifty: 1, time: 1, skip: 1 } },
                    { id: 'OPERADOR MÓVEL', password: hashedPassword, level: 1, xp: 0, role: 'aluno', coins: 0, inventory: { tutor: 3, life: 1, fifty: 1, time: 1, skip: 1 } },
                    { id: 'OPERADOR TESTE', password: hashedPassword, level: 1, xp: 0, role: 'aluno', coins: 0, inventory: { tutor: 3, life: 1, fifty: 1, time: 1, skip: 1 } }
                ];

                for (const defUser of defaultUsers) {
                    const getReq = store.get(defUser.id);
                    getReq.onsuccess = () => {
                        const existing = getReq.result;
                        if (!existing) {
                            store.put(defUser);
                        } else if (existing.id === 'gestor' && existing.level < 10) {
                            existing.level = 10;
                            existing.xp = Math.max(existing.xp, 300);
                            store.put(existing);
                            console.log("[ONYX CORE] Perfil gestor existente atualizado para nível inicial 10.");
                        }
                    };
                }
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
            if (!db) return { id, level: 1, xp: 0, coins: 0, inventory: { tutor: 3, life: 0, fifty: 0, time: 0, skip: 0 } };
            return new Promise((resolve) => {
                const tx = db.transaction(['global_stats'], 'readonly');
                const request = tx.objectStore('global_stats').get(id);
                request.onsuccess = () => {
                    let result = request.result;
                    if (result) {
                        if (typeof result.coins === 'undefined') result.coins = 0;
                        if (typeof result.inventory === 'undefined') result.inventory = { tutor: 3, life: 0, fifty: 0, time: 0, skip: 0 };
                        else {
                            if (typeof result.inventory.life === 'undefined') result.inventory.life = 0;
                            if (typeof result.inventory.fifty === 'undefined') result.inventory.fifty = 0;
                            if (typeof result.inventory.time === 'undefined') result.inventory.time = 0;
                            if (typeof result.inventory.skip === 'undefined') result.inventory.skip = 0;
                        }
                    }
                    resolve(result || null);
                };
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

        async getRanking() {
            const users = await this.getAllUsers();
            return users
                .sort((a, b) => {
                    const scoreA = (a.level || 1) * 1000 + (a.xp || 0);
                    const scoreB = (b.level || 1) * 1000 + (b.xp || 0);
                    return scoreB - scoreA;
                })
                .slice(0, 10);
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
            
            const rawData = JSON.stringify(dump);
            const signature = await OnyxCore.Crypto.hashSHA256(rawData + "OnyxSaltProtocolSecure1337!");
            
            return JSON.stringify({ data: dump, signature: signature });
        },

        async importDatabase(jsonData) {
            const db = await this.init();
            if (!db) return false;
            
            try {
                const parsed = JSON.parse(jsonData);
                if (!parsed || !parsed.data || !parsed.signature) {
                    console.error("[ONYX SECURITY] Formato de importação inválido ou assinatura ausente.");
                    return false;
                }
                
                const rawData = JSON.stringify(parsed.data);
                const computedSignature = await OnyxCore.Crypto.hashSHA256(rawData + "OnyxSaltProtocolSecure1337!");
                
                if (parsed.signature !== computedSignature) {
                    alert("🚨 [VIOLAÇÃO DE SEGURANÇA ONYX]\nA integridade do backup não pôde ser verificada. O arquivo foi corrompido ou adulterado!");
                    return false;
                }
                
                const dump = parsed.data;
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
        login(user, role) {
            localStorage.setItem('onyx_active_user', user);
            if (role) {
                localStorage.setItem('onyx_active_user_role', role);
            }
            localStorage.removeItem('onyx_manual_logout');
            if (role === 'responsavel') {
                window.location.href = 'parents_portal.html';
            } else {
                window.location.href = 'dashboard.html';
            }
        },
        logout() {
            localStorage.removeItem('onyx_active_user');
            localStorage.removeItem('onyx_active_user_role');
            localStorage.setItem('onyx_manual_logout', 'true');
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
            try {
                const stats = await OnyxCore.DB.getUser(user);
                if (stats && stats.role) {
                    localStorage.setItem('onyx_active_user_role', stats.role);
                }
            } catch(e) {}
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
            desenvolvimento_jogos: 8,
            // ===== CATEGORIA BÔNUS — NÚCLEO TECH AVANÇADO (LVL 20) =====
            engenharia_software: 20,
            redes_computadores: 20,
            banco_de_dados: 20,
            cloud_computing: 20,
            sistemas_embarcados: 20,
            matematica_computacional: 20
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
            "Metodologia Ativa": "Metodologia Ativa (o método de ensino onde o estudante é o protagonista do aprendizado através de desafios práticos)",
            "Neuroplasticidade": "Neuroplasticidade (a incrível capacidade do cérebro de se adaptar, criar novas conexões neuronais e aprender com a prática)",
            "Pensamento Crítico": "Pensamento Crítico (a habilidade cognitiva de analisar fatos, evidências e argumentos de forma lógica e imparcial)",
            "Avaliação Formativa": "Avaliação Formativa (o acompanhamento contínuo do progresso do aluno para ajustar o ensino, sem foco apenas em notas de provas)",
            "Sala de Aula Invertida": "Sala de Aula Invertida (a abordagem em que o aluno estuda a teoria em casa e usa o tempo de aula para tirar dúvidas e praticar)",
            "Álgebra": "Álgebra (o ramo matemático que usa letras para representar valores desconhecidos e desvendar incógnitas)",
            "Geometria": "Geometria (a ciência de medir e desenhar formas, áreas, perímetros e volumes no plano e no espaço)",
            "Estatística": "Estatística (a análise inteligente de dados e gráficos para prever probabilidades e tirar conclusões do mundo real)",
            "Cálculo": "Cálculo (a área da matemática avançada que estuda as taxas de variação de grandezas e o acúmulo de quantidades)",
            "Matriz": "Matriz (uma tabela retangular de números organizados em linhas e colunas usada para transformações e gráficos 3D)",
            "Algoritmo Genético": "Algoritmo Genético (a técnica de otimização matemática inspirada na teoria da evolução biológica e seleção natural)",
            "Probabilidade": "Probabilidade (o ramo da matemática que calcula a chance real de um determinado evento incerto acontecer)",
            "Regressão Linear": "Regressão Linear (o modelo estatístico que analisa a relação entre variáveis para prever tendências futuras)",
            "Termodinâmica": "Termodinâmica (a física térmica que explica as trocas de calor, a energia em movimento e o funcionamento de motores)",
            "Fotossíntese": "Fotossíntese (o incrível processo celular no qual plantas convertem luz, água e CO2 em açúcar e oxigênio para a vida)",
            "Mitocôndria": "Mitocôndria (a usina de energia da célula, responsável por realizar a respiração celular e produzir ATP)",
            "DNA": "DNA (o ácido desoxirribonucleico: a molécula em dupla hélice que carrega a receita genética de toda a sua vida)",
            "Globalização": "Globalização (a conexão global de mercados, culturas, tecnologias e sociedades que encurtou as distâncias mundiais)",
            "Efeito Estufa": "Efeito Estufa (o fenômeno natural que retém calor na atmosfera terrestre mantendo o planeta aquecido e habitável)",
            "Entropia": "Entropia (a medida física da desordem, dispersão de energia ou incerteza de um sistema termodinâmico)",
            "Fissão Nuclear": "Fissão Nuclear (o processo físico de divisão do núcleo de um átomo pesado que libera uma quantidade colossal de energia)",
            "Resiliência Ecológica": "Resiliência Ecológica (a capacidade que um ecossistema tem de absorver perturbações e se recuperar mantendo suas funções)",
            "Cibersegurança": "Cibersegurança (o conjunto de estratégias e ferramentas para blindar sistemas, redes e dados contra invasões cibernéticas)",
            "Empreendedorismo": "Empreendedorismo (a atitude de detectar problemas, planejar soluções inovadoras e gerar impacto social e econômico)",
            "Acessibilidade": "Acessibilidade (a garantia de recursos inclusivos para que todas as pessoas, incluindo neurodivergentes, usem a tecnologia)",
            "Algoritmo": "Algoritmo (a sequência lógica finita e estruturada de passos para o computador resolver um determinado problema)",
            "Array": "Array (uma estrutura organizada como um arquivo de pastas numeradas para guardar vários elementos de dados)",
            "Variável": "Variável (um pequeno espaço nomeado na memória onde o computador armazena temporariamente qualquer dado)",
            "Função": "Função (um bloco de código reutilizável que processa parâmetros de entrada e retorna uma saída específica)",
            "Loop": "Loop (uma estrutura de repetição automática que continua rodando instruções até que a condição seja atendida)",
            "SQL": "SQL (a linguagem oficial de consulta para estruturar, buscar e gerenciar dados organizados em tabelas de bancos de dados)",
            "Machine Learning": "Machine Learning (o ramo da IA que ensina computadores a reconhecer padrões e tomar decisões com base em dados históricos)",
            "Redes Neurais": "Redes Neurais (sistemas de computação inspirados na estrutura do cérebro humano que processam dados complexos de forma paralela)",
            "API": "API (a interface de programação que permite que sistemas e softwares diferentes se comuniquem e troquem dados de forma segura)",
            "Criptografia": "Criptografia (a técnica de codificar mensagens e dados para que apenas destinatários autorizados consigam decifrá-los e lê-los)",
            "DevOps": "DevOps (a cultura de integração que unifica o desenvolvimento de software e a infraestrutura de TI para entregas contínuas)",
            "Blockchain": "Blockchain (o livro de registro digital descentralizado e inviolável que garante a segurança de transações e contratos)",
            "Computação em Nuvem": "Computação em Nuvem (o fornecimento de serviços de computação como servidores, armazenamento e bancos de dados pela internet)",
            "Big Data": "Big Data (a análise de volumes massivos de dados estruturados e não estruturados que chegam em velocidades gigantescas)"
        },
        simplifyText(text) {
            let newText = text;
            let activeDict = {};
            let deleted = [];
            let custom = {};
            
            try {
                deleted = JSON.parse(localStorage.getItem('onyx_deleted_glossary') || '[]');
            } catch(e) {}
            try {
                custom = JSON.parse(localStorage.getItem('onyx_custom_glossary') || '{}');
            } catch(e) {}

            // Load default dictionary excluding deleted ones
            for (const [jargon, explanation] of Object.entries(this.dictionary)) {
                if (!deleted.includes(jargon)) {
                    activeDict[jargon] = explanation;
                }
            }

            // Load custom and AI crawled ones
            for (const [jargon, explanation] of Object.entries(custom)) {
                activeDict[jargon] = explanation;
            }

            for (const [jargon, explanation] of Object.entries(activeDict)) {
                // Escape special regex characters in jargon just in case
                const escapedJargon = jargon.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
                // Use a Unicode-aware word boundary check for Portuguese accented characters
                const regex = new RegExp(`(^|[^A-Za-z0-9_À-ÖØ-öø-ÿ])(${escapedJargon})([^A-Za-z0-9_À-ÖØ-öø-ÿ]|$)`, 'gi');
                newText = newText.replace(regex, `$1<span class="tutor-highlight" style="color:var(--accent); font-weight:bold; cursor:pointer; text-decoration:underline dashed;" onclick="if(window.showTutorHint) window.showTutorHint('${explanation.replace(/'/g, "\\'")}')">$2</span>$3`);
            }
            return newText;
        }
    }
};

// =========================================================================
// GLOBAL ANTI-CHEAT SYSTEM (ONYX PROTOCOL SECURITY)
// =========================================================================
(function() {
    let penaltyTriggered = false;

    function isBypassed() {
        const host = window.location.hostname;
        const isLocal = host === 'localhost' || host === '127.0.0.1' || window.location.protocol === 'file:';
        const isGestor = localStorage.getItem('onyx_active_user_role') === 'gestor';
        return isLocal || isGestor;
    }

    async function triggerGlobalCheatPenalty(reason) {
        if (penaltyTriggered) return;
        if (isBypassed()) {
            console.warn(`[ONYX SECURITY BYPASS] Dev-Sandbox ativo. Ação suspeita ignorada: "${reason}"`);
            return;
        }
        
        const host = window.location.hostname;
        const isLocal = host === 'localhost' || host === '127.0.0.1' || window.location.protocol === 'file:';
        const user = localStorage.getItem('onyx_active_user');
        
        let stats = null;
        if (user && window.OnyxCore && window.OnyxCore.DB) {
            try {
                await window.OnyxCore.DB.init();
                stats = await window.OnyxCore.DB.getUser(user);
            } catch(e) {}
        }
        
        const isGestor = stats && stats.role === 'gestor';
        
        // Developer Bypass Sandbox: Localhost or Gestor role
        if (isLocal || isGestor) {
            console.warn(`[ONYX SECURITY BYPASS] Dev-Sandbox ativo. Ação suspeita ignorada: "${reason}"`);
            return;
        }

        penaltyTriggered = true;

        if (!user) {
            alert(`⚠️ [SEGURANÇA GLOBAL ONYX] Ação Bloqueada / Acesso Não Autorizado (${reason})!`);
            window.location.reload();
            return;
        }
        
        // Amnesty system: first deviation gets warned, second gets penalized
        const warningKey = `onyx_cheat_warn_${user}`;
        const hasBeenWarned = localStorage.getItem(warningKey);
        
        if (!hasBeenWarned) {
            localStorage.setItem(warningKey, 'true');
            alert(`⚠️ [ALERTA DE SEGURANÇA CIBERNÉTICA ONYX]
Ação proibida detectada pelo escudo de segurança: "${reason}".

Esta é uma ADVERTÊNCIA única do Protocolo Onyx. Qualquer desvio futuro ou tentativa de contornar a arena resultará no rebaixamento automático de 1 nível e perda de todo o XP de nível atual!`);
            penaltyTriggered = false; // Reset trigger state to allow warning/penalties to occur in future sessions
            return;
        }

        try {
            if (stats) {
                if (stats.level > 1) {
                    stats.level--;
                }
                stats.xp = 0; // Reset current level XP to 0 as penalty
                await window.OnyxCore.DB.saveUser(stats);
                alert(`⚠️ [SEGURANÇA GLOBAL ONYX] Tentativa recorrente de violação detectada (${reason})! Você violou as diretrizes do protocolo de integridade cibernética. Penalidade severa aplicada: -1 Nível.`);
            }
        } catch (err) {
            console.error("[ANTI-CHEAT GLOBAL] Erro ao aplicar penalidade:", err);
        }
        window.location.href = 'dashboard.html';
    }

    // 1. Context Menu Blocker (Right Click)
    document.addEventListener('contextmenu', (e) => {
        if (isBypassed()) return;
        e.preventDefault();
        e.stopPropagation();
        triggerGlobalCheatPenalty('Clique Direito / Inspecionar');
    });

    // 2. Keyboard Shortcuts Blocker (F12, Inspect, View Source, Copy, Paste, Cut, Print, Save)
    document.addEventListener('keydown', (e) => {
        if (isBypassed()) return;
        const isF12 = e.key === 'F12' || e.keyCode === 123;
        const hasModifier = e.ctrlKey || e.metaKey; // Ctrl on Windows/Linux, Cmd on Mac
        
        // Inspecting combos
        const isInspectI = hasModifier && e.shiftKey && (e.key === 'I' || e.key === 'i');
        const isInspectJ = hasModifier && e.shiftKey && (e.key === 'J' || e.key === 'j');
        const isInspectC = hasModifier && e.shiftKey && (e.key === 'C' || e.key === 'c');
        const isViewSource = hasModifier && (e.key === 'U' || e.key === 'u');
        
        // Copy/Paste/Cut shortcuts
        const isCopy = hasModifier && (e.key === 'C' || e.key === 'c');
        const isPaste = hasModifier && (e.key === 'V' || e.key === 'v');
        const isCut = hasModifier && (e.key === 'X' || e.key === 'x');
        
        // Save and Print shortcuts
        const isSave = hasModifier && (e.key === 'S' || e.key === 's');
        const isPrint = hasModifier && (e.key === 'P' || e.key === 'p');

        if (isF12 || isInspectI || isInspectJ || isInspectC || isViewSource || isCopy || isPaste || isCut || isSave || isPrint) {
            e.preventDefault();
            e.stopPropagation();
            triggerGlobalCheatPenalty('Atalho de Teclado Bloqueado');
        }
    });

    // 3. Document Copy, Paste, Cut Events Blocker
    document.addEventListener('copy', (e) => {
        if (isBypassed()) return;
        e.preventDefault();
        e.stopPropagation();
        triggerGlobalCheatPenalty('Copiar Conteúdo');
    });

    document.addEventListener('paste', (e) => {
        if (isBypassed()) return;
        e.preventDefault();
        e.stopPropagation();
        triggerGlobalCheatPenalty('Colar Conteúdo');
    });

    document.addEventListener('cut', (e) => {
        if (isBypassed()) return;
        e.preventDefault();
        e.stopPropagation();
        triggerGlobalCheatPenalty('Recortar Conteúdo');
    });

    // 4. Block Text Selection (Makes it impossible to highlight code/text)
    document.addEventListener('selectstart', (e) => {
        if (isBypassed()) return;
        e.preventDefault();
    });

    // 5. Block Dragging (Prevents dragging elements/images to desktop/inspect)
    document.addEventListener('dragstart', (e) => {
        if (isBypassed()) return;
        e.preventDefault();
    });

    // 6. Advanced DevTools Console Countermeasure
    try {
        let devtoolsDetector = new Image();
        Object.defineProperty(devtoolsDetector, 'id', {
            get: function() {
                if (isBypassed()) return;
                triggerGlobalCheatPenalty('Invasão de Console de Desenvolvedor');
            }
        });
        setInterval(() => {
            if (isBypassed()) return;
            console.log('%c', devtoolsDetector);
            console.clear();
        }, 1000);
    } catch (e) {}

    // 7. Advanced DevTools Window Mismatch Detector (Docked DevTools)
    setInterval(() => {
        if (isBypassed()) return;
        const threshold = 160;
        const widthThreshold = window.outerWidth - window.innerWidth > threshold;
        const heightThreshold = window.outerHeight - window.innerHeight > threshold;
        if (widthThreshold || heightThreshold) {
            triggerGlobalCheatPenalty('Painel de Desenvolvimento Lateral/Inferior Aberto');
        }
    }, 1000);

    // 8. Infinite debugger loops when devtools are active
    (function() {
        function checkDevToolsPause() {
            if (isBypassed()) return;
            const startTime = performance.now();
            debugger;
            const endTime = performance.now();
            if (endTime - startTime > 100) {
                triggerGlobalCheatPenalty('Depurador de Código / Breakpoint Ativo');
            }
        }
        setInterval(checkDevToolsPause, 1000);
    })();
})();

// =========================================================================
// INTELLIGENT ADAPTIVE DISPLAY ENGINE (ONYX VIDEO & SCROLL CONFIGURATOR)
// =========================================================================
(function() {
    function applyAdaptiveDisplay() {
        const root = document.documentElement;
        
        // 1. Fetch current display configurations
        const screenWidth = window.screen.width;
        const screenHeight = window.screen.height;
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        const pixelRatio = window.devicePixelRatio || 1;
        const isHighDPI = pixelRatio >= 1.5;
        const isLandscape = window.matchMedia("(orientation: landscape)").matches;
        const aspectRatio = viewportWidth / viewportHeight;
        
        // Dynamic logging in console for transparency
        console.log(`[ONYX ADAPTER] Resolução Tela: ${screenWidth}x${screenHeight} | Viewport: ${viewportWidth}x${viewportHeight} | PixelRatio: ${pixelRatio} (HiDPI: ${isHighDPI}) | AspectRatio: ${aspectRatio.toFixed(2)}`);

        // 2. Adjust root styling tokens based on high DPI/scaling factor
        if (isHighDPI) {
            // Retina and high resolution Windows scaling factor tuning
            root.style.setProperty('--glass-border', 'rgba(255, 255, 255, 0.05)');
            root.style.setProperty('--glass-highlight', 'rgba(255, 255, 255, 0.02)');
            document.body.classList.add('onyx-hidpi');
        } else {
            document.body.classList.remove('onyx-hidpi');
        }

        // 3. Aspect Ratio Adjuster for UltraWide monitors
        if (aspectRatio > 2.0) {
            // UltraWide layout optimization (limit stretch)
            const mainApp = document.getElementById('app');
            if (mainApp) {
                mainApp.style.maxWidth = '1800px';
                mainApp.style.margin = '0 auto';
                mainApp.style.boxShadow = '0 0 50px rgba(0,0,0,0.8)';
            }
        }

        // 4. Height scaling: if screen height is very low (prevent elements overflow)
        if (viewportHeight < 650) {
            root.style.setProperty('--display-scale-factor', '0.85');
            document.body.classList.add('onyx-compact-mode');
        } else if (viewportHeight < 800) {
            root.style.setProperty('--display-scale-factor', '0.95');
            document.body.classList.remove('onyx-compact-mode');
        } else {
            root.style.setProperty('--display-scale-factor', '1.0');
            document.body.classList.remove('onyx-compact-mode');
        }

        // 5. Check and dynamically guarantee vertical scrollbar behavior on containers
        const scrollableContainers = [
            document.querySelector('.main-viewport'),
            document.querySelector('.academic-viewport'),
            document.querySelector('.ai-viewport'),
            document.getElementById('ai-chat-window'),
            document.querySelector('.workspace-card')
        ];

        scrollableContainers.forEach(container => {
            if (!container) return;
            // If contents exceed the physical container height, enforce scrollability and premium classes
            if (container.scrollHeight > container.clientHeight) {
                container.style.overflowY = 'auto';
                container.classList.add('onyx-scrollable-active');
            } else {
                container.classList.remove('onyx-scrollable-active');
            }
        });
    }

    // Initialize and bind window resize events
    window.addEventListener('load', applyAdaptiveDisplay);
    window.addEventListener('resize', applyAdaptiveDisplay);
    applyAdaptiveDisplay(); // Immediate execution
})();
