// --- PERSISTENT QUESTION DATABASE MANAGER ---
const QuestionDB = {
    storageKey: 'avalador_persistent_db',
    
    getStaticPool() {
        return {
            logic: {
                easy: [...staticLogicEasy],
                medium: [...staticLogicMedium],
                hard: [...staticLogicHard],
                extreme: [...staticLogicExtreme]
            },
            english: {
                easy: [...staticEnglishEasy],
                medium: [...staticEnglishMedium],
                hard: [...staticEnglishHard],
                extreme: [...staticEnglishExtreme]
            },
            informatics: {
                easy: [...staticInformaticsEasy],
                medium: [...staticInformaticsMedium],
                hard: [...staticInformaticsHard],
                extreme: [...staticInformaticsExtreme]
            },
            data_science: {
                easy: [...staticDataScienceEasy],
                medium: [...staticDataScienceMedium],
                hard: [...staticDataScienceHard],
                extreme: [...staticDataScienceExtreme]
            }
        };
    },

    load() {
        const staticPool = this.getStaticPool();
        const stored = localStorage.getItem(this.storageKey);
        if (!stored) return staticPool;

        const custom = JSON.parse(stored);
        for (const subject in custom) {
            if (!staticPool[subject]) staticPool[subject] = {};
            for (const difficulty in custom[subject]) {
                if (!staticPool[subject][difficulty]) staticPool[subject][difficulty] = [];
                staticPool[subject][difficulty].push(...custom[subject][difficulty]);
            }
        }
        return staticPool;
    },

    save(subject, difficulty, questionObj) {
        const stored = localStorage.getItem(this.storageKey);
        const custom = stored ? JSON.parse(stored) : { logic: {}, english: {}, informatics: {} };
        
        if (!custom[subject]) custom[subject] = {};
        if (!custom[subject][difficulty]) custom[subject][difficulty] = [];
        
        const exists = custom[subject][difficulty].some(q => q.question === questionObj.question);
        if (!exists) {
            custom[subject][difficulty].push(questionObj);
            localStorage.setItem(this.storageKey, JSON.stringify(custom));
        }
    },

    getStats() {
        const pool = this.load();
        let total = 0;
        for (const s in pool) {
            for (const d in pool[s]) {
                total += pool[s][d].length;
            }
        }
        return total;
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
function init() {
    btnStart.addEventListener('click', startQuiz);
    btnRestart.addEventListener('click', restartQuiz);
    btnDownload.addEventListener('click', downloadReport);
    
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

    updateDBStats();

    const splash = document.getElementById('splash-screen');
    const status = splash.querySelector('.status-text');
    
    setTimeout(() => { status.textContent = "Carregando ONYX Core..."; }, 1200);
    setTimeout(() => { status.textContent = "Otimizando Neurônios..."; }, 2500);
    setTimeout(() => { splash.classList.add('hidden'); }, 3500);
}

function updateDBStats() {
    const count = QuestionDB.getStats();
    dbStatsDisplay.textContent = `ONYX Intelligence | ${count} Casos de Treinamento`;
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

// --- UNIVERSAL HEURISTIC ENGINE (THE "IA") ---

function generateQuestions(subject, difficulty) {
    const questions = [];
    const targetDifficulty = difficulty === 'insane' ? 'extreme' : difficulty;
    
    for (let i = 0; i < 15; i++) {
        let q;
        if (subject === 'logic') q = engineLogic(difficulty);
        else if (subject === 'english') q = engineEnglish(difficulty);
        else if (subject === 'informatics') q = engineInformatics(difficulty);
        else q = engineDataScience(difficulty);
        
        questions.push(q);
        
        // PERSISTENCE: Save AI-generated questions to the database
        QuestionDB.save(subject, targetDifficulty, q);
    }
    updateDBStats();
    return questions;
}

// Logical Heuristic Engine: Difficulty-Aware
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
            "Fibonacci Recursivo sem memoização"
        ];
        const idx = Math.min(level + Math.floor(Math.random() * 3), 5);
        q = `[IA Nativa] Complexidade de Algoritmo:\nQual a complexidade Big O de: ${scenarios_bigo[idx]}?`;
        answer = complexities[idx];
        options = shuffle([answer, "O(n)", "O(1)", "O(n^3)"]);

    } else if (scenario === 'data_structures') {
        const ds_questions = [
            { q: "Qual estrutura usa LIFO (Last-In, First-Out)?", a: "Pilha (Stack)" },
            { q: "Qual estrutura usa FIFO (First-In, First-Out)?", a: "Fila (Queue)" },
            { q: "Qual estrutura armazena pares Chave-Valor?", a: "Dicionário (Dict)" },
            { q: "Qual estrutura garante que não há duplicatas?", a: "Conjunto (Set)" }
        ];
        const pick = ds_questions[Math.floor(Math.random() * ds_questions.length)];
        q = `[IA Nativa] Estrutura de Dados:\n${pick.q}`;
        answer = pick.a;
        options = shuffle([answer, "Lista", "Tupla", "Matriz"]);

    } else { // logic_tree
        const v1 = Math.random() > 0.5;
        const v2 = Math.random() > 0.5;
        const logic_ops = ["AND", "OR", "XOR"];
        const op = logic_ops[Math.min(level, 2)];
        let res;
        if (op === "AND") res = v1 && v2;
        else if (op === "OR") res = v1 || v2;
        else res = (v1 || v2) && !(v1 && v2);

        q = `[IA Nativa] Lógica Booleana:\nQual o resultado de: ${v1} ${op} ${v2}?`;
        answer = res ? "True" : "False";
        options = shuffle(["True", "False", "None", "Error"]);
    }

    return { question: q, options: options, answer: options.indexOf(answer) };
}

// English Heuristic Engine: Difficulty-Aware
function engineEnglish(diff) {
    const level = diff === 'easy' ? 0 : (diff === 'medium' ? 1 : (diff === 'hard' ? 2 : 3));
    const wordPool = [
        [["Print", "Imprimir"], ["Save", "Salvar"], ["File", "Arquivo"], ["Back", "Voltar"]],
        [["Warning", "Aviso"], ["Success", "Sucesso"], ["Feature", "Recurso/Funcionalidade"], ["Bug", "Erro/Falha"]],
        [["Framework", "Arcabouço"], ["Legacy", "Legado"], ["Refactoring", "Refatoração"], ["Snippet", "Fragmento"]],
        [["Scalability", "Escalabilidade"], ["Idempotency", "Idempotência"], ["Throughput", "Vazão/Capacidade"], ["Overhead", "Sobrecarga"]]
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
    const topics = ['hardware', 'networking', 'security', 'os'];
    const topic = topics[Math.floor(Math.random() * topics.length)];

    let q, answer, options;

    if (topic === 'hardware') {
        const items = [
            { q: "Qual componente é o 'cérebro' do PC?", a: "CPU" },
            { q: "Qual memória é volátil e temporária?", a: "RAM" },
            { q: "Onde os dados são salvos permanentemente?", a: "SSD/HD" },
            { q: "O que é 'Overclocking'?", a: "Aumentar a frequência do clock" }
        ];
        const pick = items[level];
        q = `[IA Nativa] Hardware:\n${pick.q}`;
        answer = pick.a;
        options = shuffle([answer, "GPU", "Placa Mãe", "Fonte", "Cooler"]);

    } else if (topic === 'networking') {
        const items = [
            { q: "Qual o protocolo padrão da Web?", a: "HTTP" },
            { q: "Qual porta é usada pelo SSH?", a: "22" },
            { q: "O que o DNS faz?", a: "Converte nomes em IPs" },
            { q: "Em qual camada do modelo OSI opera o IP?", a: "Camada de Rede (3)" }
        ];
        const pick = items[level];
        q = `[IA Nativa] Redes:\n${pick.q}`;
        answer = pick.a;
        options = shuffle([answer, "Camada de Transporte", "80", "HTTPS", "FTP"]);

    } else if (topic === 'security') {
        const items = [
            { q: "O que protege contra tráfego não autorizado?", a: "Firewall" },
            { q: "O que é 'Phishing'?", a: "Isca para obter dados" },
            { q: "O que é 'Ransomware'?", a: "Vírus que sequestra dados" },
            { q: "O que é um ataque 'Zero-Day'?", a: "Explora falha desconhecida" }
        ];
        const pick = items[level];
        q = `[IA Nativa] Cibersegurança:\n${pick.q}`;
        answer = pick.a;
        options = shuffle([answer, "Antivírus", "Proxy", "VPN", "Hash"]);

    } else { // os
        const items = [
            { q: "Qual atalho copia um arquivo?", a: "Ctrl + C" },
            { q: "O que é o Kernel?", a: "Núcleo do sistema" },
            { q: "O que é 'Virtualização'?", a: "Rodar um SO dentro de outro" },
            { q: "O que significa 'Endianness'?", a: "Ordem de armazenamento dos bytes" }
        ];
        const pick = items[level];
        q = `[IA Nativa] Sistemas Operacionais:\n${pick.q}`;
        answer = pick.a;
        options = shuffle([answer, "Shell", "Root", "Desktop", "Bios"]);
    }

    return { question: q, options: options, answer: options.indexOf(answer) };
}

// Data Science Heuristic Engine: Difficulty-Aware
function engineDataScience(diff) {
    const level = diff === 'easy' ? 0 : (diff === 'medium' ? 1 : (diff === 'hard' ? 2 : 3));
    const topics = ['storage', 'transformation', 'treatment', 'databases'];
    const topic = topics[Math.floor(Math.random() * topics.length)];

    let q, answer, options;

    if (topic === 'storage') {
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
function startQuiz() {
    const name = inputName.value.trim();
    if (!name) { alert("Nome obrigatório!"); return; }

    currentState.studentName = name;
    currentState.currentQuestionIndex = 0;
    currentState.score = 0;
    
    const staticPool = QuestionDB.load();
    const targetPool = staticPool[currentState.subject][currentState.difficulty === 'insane' ? 'extreme' : currentState.difficulty] || [];
    
    // Mix 10 static questions with 5 fresh AI questions
    const selectedStatic = shuffleAndSlice(targetPool, 10);
    const selectedAI = generateQuestions(currentState.subject, currentState.difficulty).slice(0, 5);
    
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
        q.options.forEach((opt, index) => {
            const btn = document.createElement('button');
            btn.className = 'option-btn';
            btn.textContent = opt;
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
