// --- ADVANCED KNOWLEDGE DATABASE MANAGER (IndexedDB) ---
const QuestionDB = {
    dbName: 'AvaladorOnyxDB',
    dbVersion: 1,
    db: null,
    staticPool: null,

    async init() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.dbVersion);
            
            request.onupgradeneeded = (e) => {
                const db = e.target.result;
                if (!db.objectStoreNames.contains('questions')) {
                    db.createObjectStore('questions', { keyPath: 'id', autoIncrement: true });
                }
                if (!db.objectStoreNames.contains('seen')) {
                    db.createObjectStore('seen', { keyPath: 'key' });
                }
            };

            request.onsuccess = async (e) => {
                this.db = e.target.result;
                await this.loadStaticPool();
                resolve();
            };

            request.onerror = () => reject('Erro ao abrir IndexedDB');
        });
    },

    async loadStaticPool() {
        try {
            const response = await fetch('knowledge_db.json');
            this.staticPool = await response.json();
            console.log("[ONYX] Base de conhecimento carregada com sucesso.");
        } catch (e) {
            console.warn("[ONYX] Erro ao carregar JSON externo, usando fallback.");
            this.staticPool = { logic: { easy: [], medium: [], hard: [], extreme: [] }, english: { easy: [], medium: [], hard: [], extreme: [] }, informatics: { easy: [], medium: [], hard: [], extreme: [] }, data_science: { easy: [], medium: [], hard: [], extreme: [] } };
        }
    },

    async save(subject, difficulty, questionData) {
        const transaction = this.db.transaction(['questions'], 'readwrite');
        const store = transaction.objectStore('questions');
        store.add({ ...questionData, subject, difficulty, timestamp: Date.now() });
    },

    async getAll(subject, difficulty) {
        return new Promise((resolve) => {
            const transaction = this.db.transaction(['questions'], 'readonly');
            const store = transaction.objectStore('questions');
            const request = store.getAll();
            request.onsuccess = () => {
                const filtered = request.result.filter(q => q.subject === subject && q.difficulty === difficulty);
                const staticSet = (this.staticPool[subject] && this.staticPool[subject][difficulty]) || [];
                resolve([...staticSet, ...filtered]);
            };
        });
    },

    async markSeen(subject, difficulty, questions) {
        const key = `${subject}_${difficulty}`;
        const transaction = this.db.transaction(['seen'], 'readwrite');
        const store = transaction.objectStore('seen');
        const request = store.get(key);
        
        const questionTexts = Array.isArray(questions) ? questions.map(q => q.question) : [questions.question];
        
        request.onsuccess = () => {
            let data = request.result || { key, list: [] };
            questionTexts.forEach(txt => {
                if (!data.list.includes(txt)) {
                    data.list.push(txt);
                }
            });
            store.put(data);
        };
    },

    async getSeen(subject, difficulty) {
        return new Promise((resolve) => {
            const key = `${subject}_${difficulty}`;
            const transaction = this.db.transaction(['seen'], 'readonly');
            const store = transaction.objectStore('seen');
            const request = store.get(key);
            request.onsuccess = () => resolve(request.result ? request.result.list : []);
        });
    },

    async resetSeen(subject, difficulty) {
        const key = `${subject}_${difficulty}`;
        const transaction = this.db.transaction(['seen'], 'readwrite');
        const store = transaction.objectStore('seen');
        store.delete(key);
    },

    async getStats() {
        return new Promise((resolve) => {
            const transaction = this.db.transaction(['questions'], 'readonly');
            const store = transaction.objectStore('questions');
            const request = store.count();
            request.onsuccess = () => resolve(request.result);
        });
    }
};

// App State
let currentState = {
    studentName: "",
    subject: "logic",
    difficulty: "easy",
    currentQuestionIndex: 0,
    score: 0,
    isAnswered: false,
    activeQuestions: []
};

// DOM Elements
const screens = {
    welcome: document.getElementById('screen-welcome'),
    quiz: document.getElementById('screen-quiz'),
    results: document.getElementById('screen-results')
};

const inputName = document.getElementById('student-name');
const btnStart = document.getElementById('btn-start');
const btnRestart = document.getElementById('btn-restart');
const btnDownload = document.getElementById('btn-download');
const btnFullscreen = document.getElementById('btn-fullscreen');
const questionText = document.getElementById('question-text');
const optionsContainer = document.getElementById('options-container');
const progressBar = document.getElementById('progress-bar');
const currentQDisplay = document.getElementById('current-q');
const displayName = document.getElementById('display-name');
const finalName = document.getElementById('final-name');
const finalScore = document.getElementById('final-score');
const finalLevel = document.getElementById('final-level');
const dbStatsDisplay = document.getElementById('db-stats');

const subjectBtns = document.querySelectorAll('.btn-subject');
const difficultyBtns = document.querySelectorAll('.btn-difficulty');

// Initialize
async function init() {
    btnStart.addEventListener('click', startQuiz);
    btnRestart.addEventListener('click', restartQuiz);
    btnDownload.addEventListener('click', downloadReport);
    btnFullscreen.addEventListener('click', toggleFullscreen);

    subjectBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            subjectBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentState.subject = btn.dataset.subject;
        });
    });

    difficultyBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            difficultyBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentState.difficulty = btn.dataset.difficulty;
        });
    });

    await QuestionDB.init();
    updateDBStats();

    const splash = document.getElementById('splash-screen');
    const status = splash.querySelector('.status-text');
    
    setTimeout(() => { status.textContent = "Carregando ONYX Core..."; }, 1200);
    setTimeout(() => { status.textContent = "Otimizando Neurônios..."; }, 2500);
    setTimeout(() => { splash.classList.add('hidden'); }, 3500);
}

function toggleFullscreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(err => {
            console.error(`Erro ao ativar tela cheia: ${err.message}`);
        });
        btnFullscreen.innerHTML = '<span class="icon">❐</span>';
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
            btnFullscreen.innerHTML = '<span class="icon">⛶</span>';
        }
    }
}

async function updateDBStats() {
    const count = await QuestionDB.getStats();
    dbStatsDisplay.textContent = `ONYX Intelligence | ${count + 350} Casos de Treinamento`;
}

// --- ONYX INTELLIGENCE MODULE ---
const OnyxCore = {
    // Simulated Chain-of-Thought
    async simulateReasoning() {
        const indicator = document.getElementById('reasoning-indicator');
        if (!indicator) return;
        
        indicator.classList.add('active');
        return new Promise(resolve => {
            const delay = 400 + Math.random() * 800; // Efficient reasoning
            setTimeout(() => {
                indicator.classList.remove('active');
                resolve();
            }, delay);
        });
    },

    // Precision Filter: Ensures no duplicate options and logical consistency
    validateQuestion(q) {
        if (!q.question || q.options.length < 2) return false;
        
        // Check for duplicates
        const uniqueOptions = new Set(q.options.map(o => o.toString().toLowerCase().trim()));
        if (uniqueOptions.size !== q.options.length) return false;
        
        // Ensure answer index is valid
        if (q.answer < 0 || q.answer >= q.options.length) return false;
        
        return true;
    },

    // Efficiency: Optimized shuffling using Fisher-Yates
    fastShuffle(array) {
        const arr = [...array];
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    }
};

// --- HYBRID ENGINE: CROSS-SUBJECT REASONING ---
function engineHybrid(subject, diff) {
    const subjects = ['logic', 'english', 'informatics', 'data_science'];
    const other = subjects.filter(s => s !== subject)[Math.floor(Math.random() * 3)];
    
    const questions = {
        'logic_english': { q: "Qual a tradução de 'Short-circuit evaluation' e o que significa?", a: "Avaliação de curto-circuito; para a execução se o resultado já é conhecido", o: ["Avaliação curta; pula o erro", "Circuito de dados; limpa o cache", "Pequena avaliação; soma valores"] },
        'ds_informatics': { q: "Onde um 'Data Lake' é geralmente hospedado em arquiteturas modernas?", a: "Cloud Storage (S3/Azure Blob)", o: ["Memória RAM local", "Pendrive de segurança", "Fita magnética"] },
        'logic_ds': { q: "Qual a complexidade Big O ideal para uma busca em um banco de dados indexado?", a: "O(log n) ou O(1)", o: ["O(n^2)", "O(n!)", "O(2^n)"] }
    };
    
    const key = [subject, other].sort().join('_');
    const pick = questions[key] || questions['logic_english'];
    
    const options = shuffle([pick.a, ...pick.o]);
    return { 
        question: `[ONYX HYBRID] ${pick.q}`, 
        options: options, 
        answer: options.indexOf(pick.a) 
    };
}

async function generateQuestions(subject, difficulty) {
    const questions = [];
    const targetDifficulty = difficulty === 'insane' ? 'extreme' : difficulty;
    
    // SELF-GENERATION 2.0: Deep Reasoning & Hybrid Logic
    for (let i = 0; i < 5; i++) {
        let q;
        const roll = Math.random();
        
        // Hybrid Logic: Cross-pollination of subjects (10% chance)
        if (roll > 0.9) {
            q = engineHybrid(subject, targetDifficulty);
        } else {
            if (subject === 'logic') q = engineLogic(targetDifficulty);
            else if (subject === 'english') q = engineEnglish(targetDifficulty);
            else if (subject === 'informatics') q = engineInformatics(targetDifficulty);
            else q = engineDataScience(targetDifficulty);
        }

        // Ensure uniqueness within the batch
        const isDuplicate = questions.some(existing => existing.question === q.question);
        if (!isDuplicate) {
            questions.push(q);
            await QuestionDB.save(subject, targetDifficulty, q);
            await QuestionDB.markSeen(subject, targetDifficulty, q);
        }
    }

    updateDBStats();
    return questions;
}

// Logical Heuristic Engine: Difficulty-Aware
function engineLogic(diff) {
    const level = diff === 'easy' ? 0 : (diff === 'medium' ? 1 : (diff === 'hard' ? 2 : 3));
    const scenarios = ['execution', 'complexity', 'logic_tree', 'interpretation', 'data_structures'];
    let scenario = scenarios[Math.floor(Math.random() * scenarios.length)];
    
    // Bias scenario by level
    if (level === 0) scenario = Math.random() > 0.3 ? 'execution' : 'interpretation';
    if (level >= 2) scenario = Math.random() > 0.5 ? 'complexity' : (Math.random() > 0.5 ? 'data_structures' : 'logic_tree');

    let q, options, answer;

    if (scenario === 'interpretation') {
        const sub = ["O script", "A função", "O servidor", "O banco de dados"][Math.floor(Math.random() * 4)];
        const traits = [
            ["é rápido", "é eficiente"],
            ["executa em paralelo", "usa async/await"],
            ["tem vazamento de memória", "está sobrecarregado"],
            ["lança uma exceção crítica", "está em deadlock"]
        ][level];
        const trait = traits[Math.floor(Math.random() * traits.length)];
        
        q = `[IA Nativa] Interpretação Lógica:\nPremissa: Se o evento X ocorre, então ${sub} ${trait}.\nO evento X ocorreu.\n\nQual a conclusão?`;
        answer = `${sub} ${trait}`;
        options = shuffle([answer, `${sub} não ${trait}`, "Nada acontece", "Erro de sintaxe"]);

    } else if (scenario === 'execution') {
        const startVal = Math.floor(Math.random() * (10 * (level + 1)));
        const ops = [['+', '-'], ['*', '+'], ['*', '//'], ['**', '%']][level];
        const op = ops[Math.floor(Math.random() * ops.length)];
        const mod = Math.floor(Math.random() * 5) + 2;
        let res;
        try { res = eval(`${startVal} ${op} ${mod}`); } catch(e) { res = startVal + mod; }

        q = `[IA Nativa] Simulação de Código (Python):\nx = ${startVal}\nx = x ${op} ${mod}\nQual o valor final de x?`;
        answer = res.toString();
        options = shuffle([answer, (res + 1).toString(), (res - 1).toString(), (res * 2).toString()]);

    } else if (scenario === 'complexity') {
        const complexities = ["O(1)", "O(log n)", "O(n)", "O(n log n)", "O(n^2)", "O(2^n)"];
        const scenarios_bigo = [
            "Acesso a um índice de lista",
            "Busca Binária em lista ordenada",
            "Busca Simples em lista desordenada",
            "Merge Sort (Melhor caso)",
            "Dois loops aninhados",
            "Fibonacci Recursivo sem memoização",
            "Acesso a elemento em Hash Table",
            "Inversão de uma lista encadeada"
        ];
        const idx = Math.min(level + Math.floor(Math.random() * 4), 5);
        q = `[IA Nativa] Complexidade de Algoritmo:\nQual a complexidade Big O de: ${scenarios_bigo[idx]}?`;
        answer = complexities[idx] || "O(n)";
        options = shuffle([answer, "O(n)", "O(1)", "O(n^3)"]);

    } else if (scenario === 'data_structures') {
        const ds_questions = [
            { q: "Qual estrutura usa LIFO (Last-In, First-Out)?", a: "Pilha (Stack)" },
            { q: "Qual estrutura usa FIFO (First-In, First-Out)?", a: "Fila (Queue)" },
            { q: "Qual estrutura armazena pares Chave-Valor?", a: "Dicionário (Dict)" },
            { q: "Qual estrutura garante que não há duplicatas?", a: "Conjunto (Set)" },
            { q: "Qual estrutura é melhor para buscas por índice?", a: "Vetor (Array)" },
            { q: "Qual estrutura representa relações hierárquicas?", a: "Árvore (Tree)" }
        ];
        const pick = ds_questions[Math.floor(Math.random() * ds_questions.length)];
        q = `[IA Nativa] Estrutura de Dados:\n${pick.q}`;
        answer = pick.a;
        options = shuffle([answer, "Lista", "Tupla", "Grafo"]);

    } else { // logic_tree / riddles
        if (level >= 2 && Math.random() > 0.6) {
            const riddles = [
                { q: "Um caracol sobe 3m e escorrega 2m. Muro de 30m. Quanto tempo?", a: "28 horas" },
                { q: "Três caixas (A, O, M) mal etiquetadas. Qual abrir para saber tudo?", a: "Mista (Mixed)" },
                { q: "Se 5 máquinas levam 5min para fazer 5 itens, 100 máquinas levam quanto para 100?", a: "5 minutos" }
            ];
            const pick = riddles[Math.floor(Math.random() * riddles.length)];
            q = `[IA Nativa] Desafio de Raciocínio:\n${pick.q}`;
            answer = pick.a;
            options = shuffle([answer, "30 horas", "100 minutos", "Caixa A"]);
        } else {
            const v1 = Math.random() > 0.5;
            const v2 = Math.random() > 0.5;
            const logic_ops = ["AND", "OR", "XOR", "NAND"];
            const op = logic_ops[Math.min(level, 3)];
            let res;
            if (op === "AND") res = v1 && v2;
            else if (op === "OR") res = v1 || v2;
            else if (op === "XOR") res = (v1 || v2) && !(v1 && v2);
            else res = !(v1 && v2);

            q = `[IA Nativa] Lógica Booleana:\nQual o resultado de: ${v1} ${op} ${v2}?`;
            answer = res ? "True" : "False";
            options = shuffle(["True", "False", "None", "Error"]);
        }
    }

    return { question: q, options: options, answer: options.indexOf(answer) };
}

// English Heuristic Engine: Difficulty-Aware
function engineEnglish(diff) {
    const level = diff === 'easy' ? 0 : (diff === 'medium' ? 1 : (diff === 'hard' ? 2 : 3));
    const wordPool = [
        [
            ["Print", "Imprimir"], ["Save", "Salvar"], ["File", "Arquivo"], ["Back", "Voltar"],
            ["Folder", "Pasta"], ["Key", "Chave"], ["Error", "Erro"], ["Name", "Nome"],
            ["Code", "Código"], ["Text", "Texto"]
        ],
        [
            ["Warning", "Aviso"], ["Success", "Sucesso"], ["Feature", "Recurso/Funcionalidade"], ["Bug", "Erro/Falha"],
            ["Update", "Atualizar"], ["Delete", "Apagar"], ["Search", "Pesquisar"], ["Input", "Entrada"],
            ["Output", "Saída"], ["Device", "Dispositivo"]
        ],
        [
            ["Framework", "Arcabouço"], ["Legacy", "Legado"], ["Refactoring", "Refatoração"], ["Snippet", "Fragmento"],
            ["Deployment", "Implantação"], ["Backend", "Retaguarda"], ["Frontend", "Interface"], ["Query", "Consulta"],
            ["Database", "Banco de Dados"], ["Middleware", "Intermediário"]
        ],
        [
            ["Scalability", "Escalabilidade"], ["Idempotency", "Idempotência"], ["Throughput", "Vazão/Capacidade"], ["Overhead", "Sobrecarga"],
            ["Asynchronous", "Assíncrono"], ["Concurrency", "Concorrência"], ["Encryption", "Criptografia"], ["Resilience", "Resiliência"],
            ["Infrastructure", "Infraestrutura"], ["Latency", "Latência"]
        ]
    ][level];
    
    const pair = wordPool[Math.floor(Math.random() * wordPool.length)];
    const types = ["translate", "context"];
    const type = level > 1 ? types[Math.floor(Math.random() * 2)] : "translate";

    let q, answer, options;

    if (type === "translate") {
        q = `[IA Nativa] Vocabulário Técnico:\nQual a tradução mais adequada para '${pair[0]}'?`;
        answer = pair[1];
        options = shuffle([answer, "Configuração", "Rede", "Interface", "Dispositivo"]);
    } else {
        const sentences = {
            "Scalability": "The system's capacity to handle a growing amount of work.",
            "Idempotency": "The property of certain operations that can be applied multiple times without changing the result.",
            "Throughput": "The rate at which a system processes a certain amount of data.",
            "Overhead": "Excess or indirect computation time or memory required by an operation."
        };
        q = `[IA Nativa] Technical Comprehension:\n'${sentences[pair[0]]}'\nWhich term matches this definition?`;
        answer = pair[0];
        options = shuffle([answer, "Latency", "Bandwidth", "Concurrency", "Availability"]);
    }

    return { question: q, options: options, answer: options.indexOf(answer) };
}

// Informatics Heuristic Engine: Difficulty-Aware
function engineInformatics(diff) {
    const level = diff === 'easy' ? 0 : (diff === 'medium' ? 1 : (diff === 'hard' ? 2 : 3));
    const topics = ['hardware', 'networking', 'security', 'os', 'cloud', 'devops'];
    const topic = topics[Math.floor(Math.random() * topics.length)];

    let q, answer, options;

    if (topic === 'hardware') {
        const items = [
            { q: "Qual componente é o 'cérebro' do PC?", a: "CPU" },
            { q: "Qual memória é volátil e temporária?", a: "RAM" },
            { q: "Onde os dados são salvos permanentemente?", a: "SSD/HD" },
            { q: "O que é 'Overclocking'?", a: "Aumentar a frequência do clock" },
            { q: "O que significa 'TDP' em processadores?", a: "Potência de Design Térmico" }
        ];
        const pick = items[Math.min(level + Math.floor(Math.random() * 2), items.length - 1)];
        q = `[IA Nativa] Hardware:\n${pick.q}`;
        answer = pick.a;
        options = shuffle([answer, "GPU", "Placa Mãe", "Fonte", "Cache"]);

    } else if (topic === 'networking') {
        const items = [
            { q: "Qual o protocolo padrão da Web?", a: "HTTP" },
            { q: "Qual porta é usada pelo SSH?", a: "22" },
            { q: "O que o DNS faz?", a: "Converte nomes em IPs" },
            { q: "Em qual camada do modelo OSI opera o IP?", a: "Camada de Rede (3)" },
            { q: "Qual protocolo garante a entrega de pacotes?", a: "TCP" }
        ];
        const pick = items[Math.min(level + Math.floor(Math.random() * 2), items.length - 1)];
        q = `[IA Nativa] Redes:\n${pick.q}`;
        answer = pick.a;
        options = shuffle([answer, "UDP", "FTP", "ICMP", "MAC"]);

    } else if (topic === 'cloud') {
        const items = [
            { q: "O que significa 'SaaS'?", a: "Software como Serviço" },
            { q: "Qual o serviço de armazenamento da AWS?", a: "S3" },
            { q: "O que é 'Serverless'?", a: "Execução de código sem gerenciar servidor" },
            { q: "Qual a principal vantagem da Nuvem?", a: "Escalabilidade sob demanda" }
        ];
        const pick = items[Math.min(level, items.length - 1)];
        q = `[IA Nativa] Cloud Computing:\n${pick.q}`;
        answer = pick.a;
        options = shuffle([answer, "Hardware local", "Backup físico", "VPN"]);

    } else if (topic === 'devops') {
        const items = [
            { q: "O que significa 'CI/CD'?", a: "Integração e Entrega Contínua" },
            { q: "Para que serve o Docker?", a: "Criação de containers isolados" },
            { q: "O que é 'Infrastructure as Code' (IaC)?", a: "Gerenciar infra via scripts" },
            { q: "Qual o objetivo do DevOps?", a: "Aproximar Dev e Ops" }
        ];
        const pick = items[Math.min(level, items.length - 1)];
        q = `[IA Nativa] DevOps:\n${pick.q}`;
        answer = pick.a;
        options = shuffle([answer, "Apenas programar", "Limpar o HD", "Manual"]);

    } else if (topic === 'security') {
        const items = [
            { q: "O que protege contra tráfego não autorizado?", a: "Firewall" },
            { q: "O que é 'Phishing'?", a: "Isca para obter dados" },
            { q: "O que é 'Ransomware'?", a: "Vírus que sequestra dados" },
            { q: "O que é um ataque 'DDoS'?", a: "Ataque de negação de serviço distribuído" }
        ];
        const pick = items[Math.min(level + Math.floor(Math.random() * 2), items.length - 1)];
        q = `[IA Nativa] Cibersegurança:\n${pick.q}`;
        answer = pick.a;
        options = shuffle([answer, "Antivírus", "Proxy", "VPN", "Hash"]);

    } else { // os
        const items = [
            { q: "Qual atalho copia um arquivo?", a: "Ctrl + C" },
            { q: "O que é o Kernel?", a: "Núcleo do sistema" },
            { q: "O que é 'Virtualização'?", a: "Rodar um SO dentro de outro" },
            { q: "O que significa 'Shell'?", a: "Interface de linha de comando" }
        ];
        const pick = items[Math.min(level + Math.floor(Math.random() * 2), items.length - 1)];
        q = `[IA Nativa] Sistemas Operacionais:\n${pick.q}`;
        answer = pick.a;
        options = shuffle([answer, "Root", "Desktop", "Bios", "Log"]);
    }

    return { question: q, options: options, answer: options.indexOf(answer) };
}

// Data Science Heuristic Engine: Difficulty-Aware
function engineDataScience(diff) {
    const level = diff === 'easy' ? 0 : (diff === 'medium' ? 1 : (diff === 'hard' ? 2 : 3));
    const topics = ['storage', 'transformation', 'treatment', 'databases', 'ml', 'stats'];
    const topic = topics[Math.floor(Math.random() * topics.length)];

    let q, answer, options;

    if (topic === 'ml') {
        const items = [
            { q: "O que é Aprendizado Supervisionado?", a: "Usa dados rotulados para prever saídas" },
            { q: "O que é Overfitting?", a: "Modelo decora o ruído e não generaliza" },
            { q: "Qual a diferença entre Classificação e Regressão?", a: "Classificação prevê categorias, Regressão prevê números" },
            { q: "O que é uma Matriz de Confusão?", a: "Tabela para avaliar performance de classificação" }
        ];
        const pick = items[Math.min(level, items.length - 1)];
        q = `[ONYX Core] Machine Learning:\n${pick.q}`;
        answer = pick.a;
        options = shuffle([answer, "Backup de dados", "Limpeza física", "Rede local"]);

    } else if (topic === 'stats') {
        const items = [
            { q: "O que é a Média?", a: "Soma de valores dividida pela quantidade" },
            { q: "O que é o Desvio Padrão?", a: "Medida de dispersão dos dados" },
            { q: "O que é uma Correlação?", a: "Relação entre duas variáveis" },
            { q: "O que é um P-valor?", a: "Probabilidade de observar o resultado por acaso" }
        ];
        const pick = items[Math.min(level, items.length - 1)];
        q = `[ONYX Core] Estatística:\n${pick.q}`;
        answer = pick.a;
        options = shuffle([answer, "Um erro de SQL", "Uma cor de gráfico", "Um tipo de HD"]);

    } else if (topic === 'storage') {
        const items = [
            { q: "O que é um 'Data Warehouse'?", a: "Armazém central de dados integrados" },
            { q: "Qual a principal característica de um 'Data Lake'?", a: "Armazena dados brutos e não estruturados" },
            { q: "O que significa 'Redundância' no armazenamento?", a: "Duplicação de dados para segurança" },
            { q: "Qual a diferença entre armazenamento SQL e NoSQL?", a: "SQL é relacional, NoSQL é não-relacional" }
        ];
        const pick = items[level];
        q = `[ONYX Core] Armazenamento:\n${pick.q}`;
        answer = pick.a;
        options = shuffle([answer, "Backup físico", "Memória RAM", "Processamento", "Cache"]);

    } else if (topic === 'transformation') {
        const items = [
            { q: "O que significa a sigla ETL?", a: "Extract, Transform, Load" },
            { q: "O que é 'Data Normalization'?", a: "Redução de redundância e dependência" },
            { q: "O que faz a operação 'Pivot' em dados?", a: "Transforma linhas em colunas" },
            { q: "O que é 'MapReduce'?", a: "Modelo de processamento paralelo para Big Data" }
        ];
        const pick = items[level];
        q = `[ONYX Core] Transformação:\n${pick.q}`;
        answer = pick.a;
        options = shuffle([answer, "Criptografia", "Compressão", "Backup", "Indexação"]);

    } else if (topic === 'treatment') {
        const items = [
            { q: "O que é 'Data Cleaning'?", a: "Remoção de dados inconsistentes ou errados" },
            { q: "O que são 'Outliers'?", a: "Dados que fogem drasticamente do padrão" },
            { q: "Como tratamos 'Missing Values' (valores nulos)?", a: "Remoção ou Imputação (preenchimento)" },
            { q: "O que é 'Anonymization'?", a: "Remoção de informações de identificação pessoal" }
        ];
        const pick = items[level];
        q = `[ONYX Core] Tratamento:\n${pick.q}`;
        answer = pick.a;
        options = shuffle([answer, "Deleção total", "Cópia", "Impressão", "Ordenação"]);

    } else { // databases
        const items = [
            { q: "O que é uma 'Primary Key'?", a: "Identificador único de um registro" },
            { q: "O que faz o comando 'SELECT'?", a: "Consulta dados em uma tabela" },
            { q: "O que é um 'Join' em SQL?", a: "Combinação de linhas de duas ou mais tabelas" },
            { q: "O que é 'ACID' em bancos de dados?", a: "Conjunto de propriedades de transação" }
        ];
        const pick = items[level];
        q = `[ONYX Core] Bancos de Dados:\n${pick.q}`;
        answer = pick.a;
        options = shuffle([answer, "Backup", "Update", "Delete", "Drop"]);
    }

    return { question: q, options: options, answer: options.indexOf(answer) };
}

function shuffle(array) { return OnyxCore.fastShuffle(array); }
function shuffleAndSlice(array, count) { return shuffle(array).slice(0, count); }

// Main Logic
async function startQuiz() {
    const name = inputName.value.trim();
    if (!name) { alert("Nome obrigatório!"); return; }

    currentState.studentName = name;
    currentState.currentQuestionIndex = 0;
    currentState.score = 0;
    
    const subject = currentState.subject;
    const difficulty = currentState.difficulty === 'insane' ? 'extreme' : currentState.difficulty;
    
    let availablePool = await QuestionDB.getAll(subject, difficulty);
    const seenList = await QuestionDB.getSeen(subject, difficulty);
    
    availablePool = availablePool.filter(q => !seenList.includes(q.question));
    
    // If pool is too small, reset cycle but keep very recent ones excluded
    if (availablePool.length < 10) {
        console.log(`[ONYX] Pool de questões (${subject}/${difficulty}) esgotado. Reiniciando ciclo...`);
        const recentlySeen = seenList.slice(-7); // Keep the last 7 to avoid immediate repeats
        await QuestionDB.resetSeen(subject, difficulty);
        
        // Re-mark recently seen questions
        recentlySeen.forEach(async txt => {
            await QuestionDB.markSeen(subject, difficulty, { question: txt });
        });
        
        const freshPool = await QuestionDB.getAll(subject, difficulty);
        availablePool = freshPool.filter(q => !recentlySeen.includes(q.question));
    }

    // Mix 10 static questions with 5 fresh AI questions
    const selectedStatic = shuffleAndSlice(availablePool, 10);
    const selectedAI = (await generateQuestions(subject, difficulty)).slice(0, 5);
    
    // Mark static questions as seen
    QuestionDB.markSeen(subject, difficulty, selectedStatic);
    // Mark AI questions as seen as well (even though they are new, they shouldn't repeat in next test)
    QuestionDB.markSeen(subject, difficulty, selectedAI);

    currentState.activeQuestions = shuffle([...selectedStatic, ...selectedAI]);
    
    const subLabels = { 'logic': 'Lógica', 'english': 'Inglês', 'informatics': 'Informática', 'data_science': 'Armazenamento e Tratamento' };
    displayName.textContent = `${name} | ${subLabels[currentState.subject]} (${getDifficultyLabel(currentState.difficulty)})`;
    showScreen('quiz');
    loadQuestion();
}

function getDifficultyLabel(diff) {
    return { 'easy': 'Fácil', 'medium': 'Médio', 'hard': 'Difícil', 'extreme': 'Extremo', 'insane': 'Insano' }[diff];
}

async function loadQuestion() {
    currentState.isAnswered = false;
    const q = currentState.activeQuestions[currentState.currentQuestionIndex];
    
    // GEMMA 4: Reasoning phase for precision
    await OnyxCore.simulateReasoning();

    progressBar.style.width = `${(currentState.currentQuestionIndex / 15) * 100}%`;
    currentQDisplay.textContent = currentState.currentQuestionIndex + 1;

    questionText.style.opacity = 0;
    setTimeout(() => {
        questionText.innerHTML = q.question;
        questionText.style.opacity = 1;
        optionsContainer.innerHTML = '';
        
        // Find max length for character alignment
        const maxLen = Math.max(...q.options.map(opt => opt.toString().length)) + 2;
        
        q.options.forEach((opt, index) => {
            const btn = document.createElement('button');
            btn.className = 'option-btn';
            
            // Pad options to have the same number of characters
            let paddedOpt = opt.toString();
            while (paddedOpt.length < maxLen) {
                paddedOpt += ' '; // Use normal space (white-space: pre handles it)
            }
            
            btn.textContent = paddedOpt;
            btn.onclick = () => selectOption(index, btn);
            optionsContainer.appendChild(btn);
        });
    }, 200);
}

function selectOption(index, btn) {
    if (currentState.isAnswered) return;
    currentState.isAnswered = true;
    const q = currentState.activeQuestions[currentState.currentQuestionIndex];
    const allBtns = optionsContainer.querySelectorAll('.option-btn');

    if (index === q.answer) {
        currentState.score++;
        btn.classList.add('correct');
    } else {
        btn.classList.add('wrong');
        allBtns[q.answer].classList.add('correct');
    }

    setTimeout(() => {
        currentState.currentQuestionIndex++;
        if (currentState.currentQuestionIndex < 15) loadQuestion();
        else finishQuiz();
    }, 1200);
}

function finishQuiz() {
    progressBar.style.width = '100%';
    finalName.textContent = currentState.studentName;
    finalScore.textContent = currentState.score;
    finalLevel.textContent = getDifficultyLabel(currentState.difficulty);
    showScreen('results');
}

function restartQuiz() { showScreen('welcome'); inputName.value = ""; }

function downloadReport() {
    const date = new Date().toLocaleString('pt-BR');
    const total = 15;
    const perc = ((currentState.score / total) * 100).toFixed(1);
    const subLabels = { 
        'logic': 'Lógica de Programação', 
        'english': 'Inglês Aplicado', 
        'informatics': 'Informática Básica',
        'data_science': 'Armazenamento, Transformação e Tratamento de Dados'
    };
    const sub = subLabels[currentState.subject];
    
    let report = `
=========================================
        AVALIAÇÃO CIÊNCIA DE DADOS
=========================================
ALUNO: ${currentState.studentName}
MATÉRIA: ${sub}
DIFICULDADE: ${getDifficultyLabel(currentState.difficulty)}
DATA: ${date}

RESULTADO: ${currentState.score} / ${total} (${perc}%)
SISTEMA: ONYX Neural Engine v4.0
=========================================`.trim();

    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `relatorio_${currentState.studentName.replace(/\s/g, '_')}.txt`;
    a.click();
}

function showScreen(screenKey) {
    Object.values(screens).forEach(s => s.classList.remove('active'));
    screens[screenKey].classList.add('active');
}

init();
