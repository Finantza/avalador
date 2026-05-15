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
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['questions'], 'readwrite');
            const store = transaction.objectStore('questions');
            const request = store.add({ ...questionData, subject, difficulty, timestamp: Date.now() });
            request.onsuccess = () => resolve();
            request.onerror = () => reject();
        });
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
        return new Promise((resolve, reject) => {
            const key = `${subject}_${difficulty}`;
            const transaction = this.db.transaction(['seen'], 'readwrite');
            const store = transaction.objectStore('seen');
            const getRequest = store.get(key);
            
            const questionTexts = Array.isArray(questions) ? questions.map(q => q.question) : [questions.question];
            
            getRequest.onsuccess = () => {
                let data = getRequest.result || { key, list: [] };
                questionTexts.forEach(txt => {
                    if (!data.list.includes(txt)) {
                        data.list.push(txt);
                    }
                });
                const putRequest = store.put(data);
                putRequest.onsuccess = () => resolve();
                putRequest.onerror = () => reject();
            };
            getRequest.onerror = () => reject();
        });
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
    activeQuestions: [],
    timer: null,
    timeLeft: 15
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
const timerContainer = document.getElementById('timer-container');
const timerText = document.getElementById('timer-text');

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
    initCodeRain();

    const splash = document.getElementById('splash-screen');
    const status = splash.querySelector('.status-text');
    const loaderFill = splash.querySelector('.loader-fill');
    
    setTimeout(() => { 
        status.textContent = "Carregando ONYX Core..."; 
        if (loaderFill) loaderFill.style.width = "20%";
    }, 1000);
    
    setTimeout(() => { 
        status.textContent = "Sincronizando Banco Neural..."; 
        if (loaderFill) loaderFill.style.width = "40%";
    }, 2000);

    setTimeout(() => { 
        status.textContent = "Otimizando Neurônios..."; 
        if (loaderFill) loaderFill.style.width = "70%";
    }, 3500);
    
    setTimeout(() => { 
        if (loaderFill) loaderFill.style.width = "100%";
        splash.classList.add('hidden'); 
    }, 5000);
}

function initCodeRain() {
    const container = document.getElementById('code-rain');
    if (!container) return;
    
    const width = window.innerWidth;
    const columnWidth = 25; // Approximate width of each binary column in pixels
    const columnCount = Math.floor(width / columnWidth) + 10; // Add extra for coverage

    for (let i = 0; i < columnCount; i++) {
        const line = document.createElement('div');
        line.className = 'code-line';
        
        // Generate a random string of 0s and 1s
        let binaryStr = "";
        const len = Math.floor(Math.random() * 20) + 10;
        for(let j=0; j<len; j++) binaryStr += Math.random() > 0.5 ? "1" : "0";
        
        line.textContent = binaryStr;
        line.style.left = `${(i / columnCount) * 100}%`; // Evenly distributed
        line.style.animationDuration = `${Math.random() * 2 + 1.5}s`;
        line.style.animationDelay = `${Math.random() * 5}s`;
        line.style.fontSize = `${Math.random() * 8 + 14}px`;
        line.style.opacity = Math.random() * 0.4 + 0.1;
        container.appendChild(line);
    }
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
    const scenarios = ['execution', 'complexity', 'logic_tree', 'interpretation', 'data_structures', 'regex'];
    let scenario = scenarios[Math.floor(Math.random() * scenarios.length)];
    
    // Bias scenario by level
    if (level === 0) scenario = Math.random() > 0.3 ? 'execution' : 'interpretation';
    if (level >= 2) scenario = Math.random() > 0.5 ? 'complexity' : (Math.random() > 0.4 ? 'regex' : 'logic_tree');

    let q, options, answer;

    if (scenario === 'interpretation') {
        const items = [
            { q: "Premissa: Se X ocorre, o servidor para.", a: "O servidor para imediatamente", d: ["O script falha na linha 1", "A rede reinicia o fluxo", "O banco entra em backup"] },
            { q: "Premissa: Async/Await evita o bloqueio.", a: "A execução continua em paralelo", d: ["O código trava até o retorno", "O loop de eventos é deletado", "O cache é limpo via hardware"] },
            { q: "Premissa: Overfitting indica alta variância.", a: "O modelo falha em dados novos", d: ["O modelo decora os dados de teste", "A acurácia sobe no mundo real", "O erro de treino é muito alto"] },
            { q: "Premissa: Sharding divide o banco.", a: "A carga é distribuída entre nós", d: ["Os dados são todos duplicados", "A latência sobe exponencialmente", "A chave primária é removida"] }
        ];
        const pick = items[level];
        q = `[IA ONYX] Dedução Lógica:\n${pick.q}\nX ocorreu.\nConclusão:`;
        answer = pick.a;
        options = shuffle([answer, ...pick.d]);

    } else if (scenario === 'execution') {
        const startVal = Math.floor(Math.random() * (20 * (level + 1)));
        const ops = [['+', '-'], ['*', '+'], ['*', '//'], ['**', '%']][level];
        const op = ops[Math.floor(Math.random() * ops.length)];
        const mod = Math.floor(Math.random() * 5) + 2;
        let res;
        try { res = eval(`${startVal} ${op} ${mod}`); } catch(e) { res = startVal + mod; }

        q = `[IA ONYX] Runtime Simulation:\nx = ${startVal}\nx = x ${op} ${mod}\nValue of x?`;
        answer = res.toString();
        const dist1 = (res + (Math.random() > 0.5 ? 1 : -1)).toString();
        const dist2 = (res * 2).toString();
        const dist3 = Math.floor(res / 2).toString();
        options = shuffle([answer, dist1, dist2, dist3]);

    } else if (scenario === 'complexity') {
        const complexities = ["O(1)", "O(log n)", "O(n)", "O(n log n)", "O(n^2)", "O(2^n)"];
        const cases = [
            { s: "Hash Map lookup", a: "O(1)" },
            { s: "Binary Search", a: "O(log n)" },
            { s: "Linear Scan", a: "O(n)" },
            { s: "Heap Sort", a: "O(n log n)" },
            { s: "Nested Loops", a: "O(n^2)" },
            { s: "TSP Brute Force", a: "O(2^n)" }
        ];
        const pick = cases[Math.min(level + 2, 5)];
        q = `[IA ONYX] Big O Analysis:\nComplexity of: ${pick.s}?`;
        answer = pick.a;
        options = shuffle([answer, "O(n log n)", "O(n!)", "O(n^3)"]);

    } else if (scenario === 'regex') {
        const patterns = [
            { p: "^[0-9]+$", s: "123", a: "Match numérico completo", d: ["Contém apenas letras", "Inicia com dígito", "Formato de data ISO"] },
            { p: "\\w+@\\w+", s: "a@b", a: "Padrão básico de e-mail", d: ["Inicia com caractere especial", "Busca por números decimais", "Fim de linha encontrado"] },
            { p: ".*\\d{2}$", s: "abc12", a: "Termina com dois dígitos", d: ["Contém apenas 2 números", "Possui letras no início", "Não possui correspondência"] }
        ];
        const pick = patterns[Math.min(level, 2)];
        q = `[IA ONYX] RegEx Engine:\nPattern: /${pick.p}/\nString: "${pick.s}"\nResult?`;
        answer = pick.a;
        options = shuffle([answer, ...pick.d]);

    } else if (scenario === 'data_structures') {
        const items = [
            { q: "Estrutura para Caminhamento BFS?", a: "Fila (Queue) com FIFO", d: ["Pilha (Stack) com LIFO", "Grafo Acíclico Dirigido", "Árvore Binária de Busca"] },
            { q: "Melhor para remoção no início?", a: "Lista Encadeada (Linked List)", d: ["Vetor Dinâmico (ArrayList)", "Hash Table com Colisão", "Pilha com Array Fixo"] }
        ];
        const pick = items[Math.min(level, 1)];
        q = `[IA ONYX] Data Architecture:\n${pick.q}`;
        answer = pick.a;
        options = shuffle([answer, ...pick.d]);

    } else { // insane logic / extreme riddles
        const insane = [
            { q: "P vs NP: Se P=NP, o que é verdade?", a: "Toda solução verificável é fácil de achar", d: ["Criptografia AES torna-se impossível", "Algoritmos quânticos param de funcionar", "Problemas polinomiais são insolúveis"] },
            { q: "Teorema de CAP: Num sistema distribuído...", a: "Não há Consistência, Disp. e Partição simultâneos", d: ["A latência é sempre zero na rede local", "A persistência é garantida via Hardware", "O consenso é atingido por força bruta"] }
        ];
        const pick = insane[Math.min(level - 2, 1)];
        q = `[IA ONYX] Advanced Theory:\n${pick.q}`;
        answer = pick.a;
        options = shuffle([answer, ...pick.d]);
    }

    return { question: q, options: options, answer: options.indexOf(answer) };
}

// English Heuristic Engine: Difficulty-Aware
function engineEnglish(diff) {
    const level = diff === 'easy' ? 0 : (diff === 'medium' ? 1 : (diff === 'hard' ? 2 : 3));
    
    const scenarios = {
        0: [ // Easy
            { q: "Qual a tradução para 'Save'?", a: "Salvar o progresso", d: ["Sair do sistema", "Excluir arquivo", "Mudar a senha"] },
            { q: "O que significa 'File'?", a: "Arquivo de dados", d: ["Fila de espera", "Fio de conexão", "Pasta vazia"] }
        ],
        1: [ // Medium
            { q: "Significado de 'Feature'?", a: "Recurso ou funcionalidade", d: ["Falha ou erro crítico", "Atraso no processamento", "Manual de instruções"] },
            { q: "Tradução de 'Update'?", a: "Atualizar o software", d: ["Deletar o banco", "Criar novo perfil", "Enviar por e-mail"] }
        ],
        2: [ // Hard
            { q: "O que é 'Refactoring'?", a: "Reestruturar o código interno", d: ["Criar novas funcionalidades", "Traduzir para outra língua", "Deletar módulos antigos"] },
            { q: "Tradução de 'Middleware'?", a: "Software intermediário de rede", d: ["Hardware de baixo custo", "Interface final do usuário", "Criptografia de disco"] }
        ],
        3: [ // Insane
            { q: "Definição de 'Idempotency'?", a: "Operação com resultado constante", d: ["Velocidade máxima de rede", "Criptografia de ponta a ponta", "Processamento em paralelo"] },
            { q: "Tradução de 'Throughput'?", a: "Volume de dados por tempo", d: ["Latência mínima de resposta", "Capacidade total de disco", "Segurança contra ataques"] }
        ]
    };

    const currentLevel = scenarios[level];
    const pick = currentLevel[Math.floor(Math.random() * currentLevel.length)];
    
    const q = `[IA ONYX] Technical English:\n${pick.q}`;
    const answer = pick.a;
    const options = shuffle([answer, ...pick.d]);

    return { question: q, options: options, answer: options.indexOf(answer) };
}

// Informatics Heuristic Engine: Difficulty-Aware
function engineInformatics(diff) {
    const level = diff === 'easy' ? 0 : (diff === 'medium' ? 1 : (diff === 'hard' ? 2 : 3));
    
    const scenarios = {
        0: [ // Easy
            { q: "Qual a função principal da Memória RAM?", a: "Armazenamento volátil de dados em uso", d: ["Processamento central de cálculos lógicos", "Exibição de interfaces gráficas complexas", "Armazenamento permanente de arquivos locais"] }
        ],
        1: [ // Medium
            { q: "O que define o 'Kernel' de um sistema?", a: "O núcleo que gerencia hardware e software", d: ["A interface visual de interação do usuário", "O antivírus que protege contra malwares", "O hardware responsável pela conexão de rede"] }
        ],
        2: [ // Hard
            { q: "Qual o propósito do Modelo OSI em redes?", a: "Padronizar a comunicação entre sistemas", d: ["Criptografar dados sensíveis no disco rígido", "Otimizar o consumo de energia do processador", "Gerenciar o processo de boot do hardware"] }
        ],
        3: [ // Insane
            { q: "O que é Criptografia de Chave Assimétrica?", a: "Uso de um par de chaves pública e privada", d: ["Uma única chave secreta para cifrar e decifrar", "Transmissão de dados sem nenhuma segurança real", "Um algoritmo focado apenas em compressão de ZIP"] }
        ]
    };

    const currentLevel = scenarios[level];
    const pick = currentLevel[Math.floor(Math.random() * currentLevel.length)];
    
    const q = `[IA ONYX] Computing Infrastructure:\n${pick.q}`;
    const answer = pick.a;
    const options = shuffle([answer, ...pick.d]);

    return { question: q, options: options, answer: options.indexOf(answer) };
}

function engineHybrid(subject, diff) {
    const q = `[IA ONYX] Hybrid Intelligence:\nQual a relação entre ${subject} e ${diff}?`;
    const answer = "Integração sistêmica de alta complexidade";
    const options = shuffle([answer, "Independência total de fluxos de dados", "Conflito de hardware em ambiente local", "Erro de redundância cíclica no servidor"]);
    return { question: q, options: options, answer: options.indexOf(answer) };
}

// Data Science Heuristic Engine: Difficulty-Aware
function engineDataScience(diff) {
    const level = diff === 'easy' ? 0 : (diff === 'medium' ? 1 : (diff === 'hard' ? 2 : 3));
    const topics = ['ml', 'stats', 'storage', 'transformation', 'treatment', 'databases', 'architecture'];
    const topic = topics[Math.floor(Math.random() * topics.length)];

    let q, answer, options;

    const scenarios = {
        'ml': [
            { q: "O que é Aprendizado Supervisionado?", a: "Usa dados rotulados para prever saídas", d: ["Analisa padrões sem nenhuma supervisão", "Cria categorias baseadas em clusters", "Limpa dados ruidosos automaticamente"] },
            { q: "O que é 'Regularização' em ML?", a: "Técnica para evitar overfitting do modelo", d: ["Aumento da taxa de aprendizado fixo", "Remoção de colunas duplicadas no CSV", "Processo de normalização de hardware"] },
            { q: "Explique 'Backpropagation'?", a: "Ajuste de pesos via gradiente descendente", d: ["Cópia de segurança de redes neurais", "Processamento de dados do fim para o início", "Algoritmo de busca em largura em grafos"] }
        ],
        'stats': [
            { q: "O que é o Desvio Padrão?", a: "Medida da dispersão em torno da média", d: ["Diferença entre o maior e menor valor", "Soma de todos os valores da amostra", "Valor central que divide os dados em dois"] },
            { q: "O que é a 'Distribuição Normal'?", a: "Curva em sino onde média=mediana=moda", d: ["Sequência de números aleatórios lineares", "Padrão de crescimento exponencial de dados", "Gráfico que mostra apenas valores nulos"] }
        ],
        'architecture': [
            { q: "Diferença entre OLTP e OLAP?", a: "OLTP foca transação, OLAP foca análise", d: ["OLTP é para Cloud, OLAP é para Local", "OLTP usa NoSQL, OLAP usa apenas SQL", "OLTP é assíncrono, OLAP é síncrono"] },
            { q: "O que é 'Eventual Consistency'?", a: "Dados ficam iguais após tempo sem escrita", d: ["O banco de dados nunca perde informação", "A consistência é garantida via Hardware", "Os dados são validados por cada usuário"] }
        ]
    };

    const currentTopic = scenarios[topic] || scenarios['ml'];
    const pick = currentTopic[Math.min(level, currentTopic.length - 1)];
    
    q = `[IA ONYX] ${topic.toUpperCase()}:\n${pick.q}`;
    answer = pick.a;
    options = shuffle([answer, ...pick.d]);

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
    let difficulty = currentState.difficulty;
    
    // Map internal difficulty keys
    const diffMapping = {
        'easy': 'easy',
        'medium': 'medium',
        'hard': 'hard',
        'insane': 'extreme',
        'impossible': 'impossible'
    };
    
    const targetDifficulty = diffMapping[difficulty] || 'easy';
    
    let availablePool = await QuestionDB.getAll(subject, targetDifficulty);
    const seenList = await QuestionDB.getSeen(subject, difficulty);
    
    availablePool = availablePool.filter(q => !seenList.includes(q.question));
    
        // If pool is too small, reset cycle but keep very recent ones excluded
        if (availablePool.length < 10) {
            console.log(`[ONYX] Pool de questões (${subject}/${difficulty}) esgotado. Reiniciando ciclo...`);
            const recentlySeen = seenList.slice(-7); // Keep the last 7 to avoid immediate repeats
            await QuestionDB.resetSeen(subject, difficulty);
            
            // Re-mark recently seen questions (sequentially to avoid race conditions)
            for (const txt of recentlySeen) {
                await QuestionDB.markSeen(subject, difficulty, { question: txt });
            }
            
            const freshPool = await QuestionDB.getAll(subject, difficulty);
            availablePool = freshPool.filter(q => !recentlySeen.includes(q.question));
        }

        // Mix 10 static questions with 5 fresh AI questions
        const selectedStatic = shuffleAndSlice(availablePool, 10);
        const selectedAI = (await generateQuestions(subject, difficulty)).slice(0, 5);
        
        const finalPool = [...selectedStatic, ...selectedAI];
        if (finalPool.length === 0) {
            alert("Erro crítico: Não foi possível carregar ou gerar questões para este nível. Tente mudar a dificuldade.");
            return;
        }

        // Mark as seen (sequentially)
        await QuestionDB.markSeen(subject, difficulty, selectedStatic);
        await QuestionDB.markSeen(subject, difficulty, selectedAI);

        currentState.activeQuestions = shuffle(finalPool);
    
    const subLabels = { 'logic': 'Lógica', 'english': 'Inglês', 'informatics': 'Informática', 'data_science': 'Armazenamento e Tratamento' };
    displayName.textContent = `${name} | ${subLabels[currentState.subject]} (${getDifficultyLabel(currentState.difficulty)})`;
    showScreen('quiz');
    loadQuestion();
}

function getDifficultyLabel(diff) {
    return { 'easy': 'Fácil', 'medium': 'Médio', 'hard': 'Difícil', 'extreme': 'Extremo', 'insane': 'Insano' }[diff];
}

function startTimer() {
    stopTimer();
    currentState.timeLeft = 15;
    updateTimerDisplay();
    
    currentState.timer = setInterval(() => {
        currentState.timeLeft--;
        updateTimerDisplay();
        
        if (currentState.timeLeft <= 5) {
            timerContainer.classList.add('warning');
        } else {
            timerContainer.classList.remove('warning');
        }
        
        if (currentState.timeLeft <= 0) {
            stopTimer();
            handleTimeOut();
        }
    }, 1000);
}

function stopTimer() {
    if (currentState.timer) {
        clearInterval(currentState.timer);
        currentState.timer = null;
    }
}

function updateTimerDisplay() {
    timerText.textContent = `${currentState.timeLeft}s`;
}

function handleTimeOut() {
    if (currentState.isAnswered) return;
    
    const q = currentState.activeQuestions[currentState.currentQuestionIndex];
    const allBtns = optionsContainer.querySelectorAll('.option-btn');
    
    currentState.isAnswered = true;
    
    // Show correct answer
    allBtns[q.answer].classList.add('correct');
    
    // Scramble the question text to say "TIME EXPIRED"
    scrambleText(questionText, "TEMPO ESGOTADO!");
    
    setTimeout(() => {
        currentState.currentQuestionIndex++;
        if (currentState.currentQuestionIndex < 15) loadQuestion();
        else finishQuiz();
    }, 2000);
}

async function loadQuestion() {
    currentState.isAnswered = false;
    const q = currentState.activeQuestions[currentState.currentQuestionIndex];
    
    // Show reasoning indicator without blocking
    if (OnyxCore.simulateReasoning) OnyxCore.simulateReasoning();

    progressBar.style.width = `${(currentState.currentQuestionIndex / 15) * 100}%`;
    currentQDisplay.textContent = currentState.currentQuestionIndex + 1;

    // Set text instantly instead of scrambling
    questionText.textContent = q.question;
    
    optionsContainer.innerHTML = '';
    const maxLen = Math.max(...q.options.map(opt => opt.toString().length)) + 2;
    
    q.options.forEach((opt, index) => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        
        let paddedOpt = opt.toString();
        while (paddedOpt.length < maxLen) {
            paddedOpt += ' ';
        }
        
        btn.textContent = paddedOpt;
        btn.onclick = () => selectOption(index, btn);
        optionsContainer.appendChild(btn);
    });

    startTimer();
}

function selectOption(index, btn) {
    if (currentState.isAnswered) return;
    stopTimer();
    currentState.isAnswered = true;
    
    const q = currentState.activeQuestions[currentState.currentQuestionIndex];
    const allBtns = optionsContainer.querySelectorAll('.option-btn');

    const isCorrect = (index === q.answer);

    if (isCorrect) {
        btn.classList.add('correct');
        currentState.score++;
        if (OnyxCore.playFeedback) OnyxCore.playFeedback('success');
    } else {
        btn.classList.add('wrong');
        allBtns[q.answer].classList.add('correct');
        if (OnyxCore.playFeedback) OnyxCore.playFeedback('error');
    }

    // "quando o jogador acerta a questao ela deve iir automaticamente para proximo"
    // If correct, go fast. If wrong, wait a bit to show correct answer.
    const delay = isCorrect ? 600 : 1200;

    setTimeout(() => {
        currentState.currentQuestionIndex++;
        if (currentState.currentQuestionIndex < 15) loadQuestion();
        else finishQuiz();
    }, delay);
}

function finishQuiz() {
    stopTimer();
    progressBar.style.width = '100%';
    finalName.textContent = currentState.studentName;
    finalScore.textContent = currentState.score;
    finalLevel.textContent = getDifficultyLabel(currentState.difficulty);
    showScreen('results');
}

function restartQuiz() { 
    stopTimer();
    showScreen('welcome'); 
    inputName.value = ""; 
}

function scrambleText(element, targetText) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()_+';
    let iteration = 0;
    const interval = setInterval(() => {
        element.textContent = targetText.split("")
            .map((char, index) => {
                if (index < iteration) return targetText[index];
                return chars[Math.floor(Math.random() * chars.length)];
            })
            .join("");
        
        if (iteration >= targetText.length) clearInterval(interval);
        iteration += 1 / 2; // Speed of decryption
    }, 30);
}

function downloadReport() {
    const date = new Date().toLocaleString('pt-BR');
    const total = 15;
    const perc = ((currentState.score / total) * 100).toFixed(1);
    const subLabels = { 
        'logic': 'Lógica de Programação', 
        'english': 'Inglês Aplicado', 
        'informatics': 'Informática Básica',
        'data_science': 'Ciência de Dados e Armazenamento',
        'cybersecurity': 'Cibersegurança e Infraestrutura',
        'software_eng': 'Engenharia de Software e Padrões',
        'philosophy': 'Filosofia da Computação e Ética',
        'cryptography': 'Criptografia e Teoria da Informação'
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
