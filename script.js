// ONYX APP CORE
// Global scripts used for local file compatibility (no modules needed)

// --- ADVANCED KNOWLEDGE DATABASE MANAGER (IndexedDB) ---
const QuestionDB = {
    dbName: 'AvaladorOnyxDB',
    dbVersion: 2,
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
                if (!db.objectStoreNames.contains('ranking')) {
                    db.createObjectStore('ranking', { keyPath: 'id', autoIncrement: true });
                }
                if (!db.objectStoreNames.contains('progress')) {
                    db.createObjectStore('progress', { keyPath: 'subject' });
                }
                if (!db.objectStoreNames.contains('global_stats')) {
                    db.createObjectStore('global_stats', { keyPath: 'id' });
                }
            };

            request.onsuccess = async (e) => {
                this.db = e.target.result;
                await this.loadStaticPool();
                resolve();
            };

            request.onerror = () => {
                console.warn("[ONYX] IndexedDB error, using static pool.");
                resolve(); 
            };

            setTimeout(() => resolve(), 3000);
        });
    },

    async loadStaticPool() {
        try {
            const response = await fetch('onyx_knowledge_expanded.json');
            this.staticPool = await response.json();
        } catch (e) {
            console.warn("[ONYX] Usando pool estático de emergência.");
            this.staticPool = { 
                python: { 
                    easy: [
                        { question: "Qual a função utilizada para exibir mensagens no console em Python?", options: ["print()", "echo()", "log()", "display()"], answer: 0, explanation: "A função print() é o comando padrão para saída de dados." },
                        { question: "Como se define uma lista em Python?", options: ["(1, 2)", "{1, 2}", "[1, 2]", "<1, 2>"], answer: 2, explanation: "Listas utilizam colchetes []." },
                        { question: "Qual o operador de resto da divisão?", options: ["/", "//", "%", "&"], answer: 2, explanation: "O operador % (módulo) retorna o resto da divisão." },
                        { question: "Qual a palavra-chave para definir uma função?", options: ["func", "define", "def", "function"], answer: 2, explanation: "Utiliza-se 'def' seguido do nome da função." },
                        { question: "Como comentar uma linha em Python?", options: ["//", "/*", "#", "--"], answer: 2, explanation: "O símbolo # é usado para comentários de linha única." }
                    ] 
                } 
            };
        }
    },

    async getByNivel(subject, level) {
        if (subject === 'random') {
            let pool = [];
            if (this.staticPool) {
                Object.keys(this.staticPool).forEach(sub => {
                    if (this.staticPool[sub][level]) {
                        pool = [...pool, ...this.staticPool[sub][level]];
                    }
                });
            }
            return pool;
        }
        return (this.staticPool && this.staticPool[subject] && this.staticPool[subject][level]) || [];
    },

    async save(subject, difficulty, questionData) {
        return new Promise((resolve) => {
            if (!this.db) return resolve();
            const transaction = this.db.transaction(['questions'], 'readwrite');
            const store = transaction.objectStore('questions');
            store.add({ ...questionData, subject, difficulty, timestamp: Date.now() });
            transaction.oncomplete = () => resolve();
        });
    },

    async getAll(subject, difficulty) {
        return new Promise((resolve) => {
            let staticSet = [];
            if (subject === 'random') {
                if (this.staticPool) {
                    Object.keys(this.staticPool).forEach(sub => {
                        if (this.staticPool[sub][difficulty]) {
                            staticSet = [...staticSet, ...this.staticPool[sub][difficulty]];
                        }
                    });
                }
            } else {
                staticSet = (this.staticPool && this.staticPool[subject] && this.staticPool[subject][difficulty]) || [];
            }
            
            if (!this.db) return resolve([...staticSet]);
            
            const transaction = this.db.transaction(['questions'], 'readonly');
            const store = transaction.objectStore('questions');
            const request = store.getAll();
            request.onsuccess = () => {
                let filtered;
                if (subject === 'random') {
                    filtered = request.result.filter(q => q.difficulty === difficulty);
                } else {
                    filtered = request.result.filter(q => q.subject === subject && q.difficulty === difficulty);
                }
                resolve([...staticSet, ...filtered]);
            };
        });
    },

    async markSeen(questions) {
        return new Promise((resolve) => {
            if (!this.db) return resolve();
            const transaction = this.db.transaction(['seen'], 'readwrite');
            const store = transaction.objectStore('seen');
            
            const questionTexts = Array.isArray(questions) ? questions.map(q => q.question) : [questions.question];
            
            questionTexts.forEach(txt => {
                store.put({ key: txt, timestamp: Date.now() });
            });
            transaction.oncomplete = () => resolve();
        });
    },

    async getSeen() {
        return new Promise((resolve) => {
            if (!this.db) return resolve([]);
            const transaction = this.db.transaction(['seen'], 'readonly');
            const store = transaction.objectStore('seen');
            const request = store.getAll();
            request.onsuccess = () => resolve(request.result ? request.result.map(r => r.key) : []);
        });
    },

    async resetSeen() {
        if (!this.db) return;
        const transaction = this.db.transaction(['seen'], 'readwrite');
        transaction.objectStore('seen').clear();
    },

    async getStats() {
        return new Promise((resolve) => {
            if (!this.db) return resolve(0);
            const request = this.db.transaction(['questions'], 'readonly').objectStore('questions').count();
            request.onsuccess = () => resolve(request.result);
        });
    },

    async saveRanking(entry) {
        if (!this.db) return;
        const transaction = this.db.transaction(['ranking'], 'readwrite');
        transaction.objectStore('ranking').add({ ...entry, timestamp: Date.now() });
    },

    async getRanking() {
        return new Promise((resolve) => {
            if (!this.db) return resolve([]);
            const request = this.db.transaction(['ranking'], 'readonly').objectStore('ranking').getAll();
            request.onsuccess = () => {
                const sorted = request.result.sort((a, b) => b.score - a.score || b.timestamp - a.timestamp);
                resolve(sorted.slice(0, 10));
            };
        });
    },

    async getProgress(subject) {
        return new Promise((resolve) => {
            if (!this.db) return resolve({ subject, unlocked: ['easy'] });
            const request = this.db.transaction(['progress'], 'readonly').objectStore('progress').get(subject);
            request.onsuccess = () => resolve(request.result || { subject, unlocked: ['easy'] });
        });
    },

    async unlockLevel(subject, level) {
        if (!this.db) return;
        const transaction = this.db.transaction(['progress'], 'readwrite');
        const store = transaction.objectStore('progress');
        const request = store.get(subject);
        request.onsuccess = () => {
            let data = request.result || { subject, unlocked: ['easy'] };
            if (!data.unlocked.includes(level)) {
                data.unlocked.push(level);
                store.put(data);
            }
        };
    },

    async getGlobalStats(name = 'main') {
        return new Promise((resolve) => {
            if (!this.db) return resolve({ id: name, xp: 0, level: 1 });
            const request = this.db.transaction(['global_stats'], 'readonly').objectStore('global_stats').get(name);
            request.onsuccess = () => resolve(request.result || { id: name, xp: 0, level: 1 });
        });
    },

    async saveGlobalStats(stats) {
        if (!this.db) return;
        const transaction = this.db.transaction(['global_stats'], 'readwrite');
        transaction.objectStore('global_stats').put(stats);
    }
};

// --- ASSESSMENT ENGINE PROFILE ---
class StudentProfile {
    constructor(name) {
        this.name = name;
        this.level = "easy"; // easy, medium, hard
        this.score = 0;
        this.totalAnswered = 0;
        this.correctAnswers = 0;
        this.strengths = [];
        this.weaknesses = [];
        this.themeHistory = {}; // theme -> {correct, total}
        this.streak = 0;
        this.xpGained = 0;
        this.startTime = Date.now();
    }

    update(question, isCorrect) {
        this.totalAnswered++;
        if (isCorrect) {
            this.correctAnswers++;
            this.streak++;
        } else {
            this.streak = 0;
        }

        const themes = question.tags || [question.subject || 'geral'];
        themes.forEach(theme => {
            if (!this.themeHistory[theme]) this.themeHistory[theme] = { correct: 0, total: 0 };
            this.themeHistory[theme].total++;
            if (isCorrect) this.themeHistory[theme].correct++;
        });

        this.recalculateStrengthsAndWeaknesses();
        this.updateAdaptiveLevel();
        this.calculateXPGain(question, isCorrect);
    }

    calculateXPGain(question, isCorrect) {
        if (!isCorrect) return;
        let base = 50;
        if (question.difficulty === 'medium') base = 100;
        if (question.difficulty === 'hard') base = 200;
        if (question.difficulty === 'insane') base = 400;
        if (question.difficulty === 'impossible') base = 1000;
        
        const streakBonus = this.streak * 10;
        const timeBonus = Math.floor(currentState.timeLeft * 2);
        const total = base + streakBonus + timeBonus;
        
        this.xpGained += total;
        OnyxUI.showXPGain(total);
    }

    recalculateStrengthsAndWeaknesses() {
        this.strengths = [];
        this.weaknesses = [];
        for (const [theme, stats] of Object.entries(this.themeHistory)) {
            if (stats.total >= 2) {
                const rate = stats.correct / stats.total;
                if (rate >= 0.8) this.strengths.push(theme);
                else if (rate <= 0.4) this.weaknesses.push(theme);
            }
        }
    }

    updateAdaptiveLevel() {
        const rate = this.correctAnswers / this.totalAnswered;
        if (this.totalAnswered >= 5) {
            if (rate >= 0.8) this.level = "hard";
            else if (rate >= 0.6) this.level = "medium";
            else this.level = "easy";
        }
    }

    getReport() {
        return {
            name: this.name,
            score: this.correctAnswers,
            total: this.totalAnswered,
            level: this.level,
            strengths: this.strengths,
            weaknesses: this.weaknesses,
            xp: this.xpGained,
            recommendations: this.generateRecommendations()
        };
    }

    generateRecommendations() {
        const recs = [];
        if (this.weaknesses.length > 0) {
            recs.push(`Foque em estudar: ${this.weaknesses.join(', ')}`);
        }
        if (this.level === "hard") {
            recs.push("Você está dominando o conteúdo! Tente desafios extremos.");
        } else if (this.level === "easy") {
            recs.push("Continue praticando os fundamentos para subir de nível.");
        }
        return recs;
    }
}

// --- APP STATE ---
let currentState = {
    studentName: "",
    subject: "python",
    difficulty: "easy",
    currentQuestionIndex: 0,
    score: 0,
    isAnswered: false,
    activeQuestions: [],
    timer: null,
    timeLeft: 20,
    streak: 0,
    profile: null,
    globalLevel: 1
};

// --- DOM ELEMENTS ---
const screens = {
    login: document.getElementById('screen-login'),
    register: document.getElementById('screen-register'),
    welcome: document.getElementById('screen-welcome'),
    quiz: document.getElementById('screen-quiz'),
    results: document.getElementById('screen-results')
};

const loginName = document.getElementById('login-name');
const loginPass = document.getElementById('login-pass');
const regName = document.getElementById('reg-name');
const regPass = document.getElementById('reg-pass');
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
const streakBadge = document.getElementById('streak-badge');
const streakCount = document.getElementById('streak-count');
const quizCard = document.querySelector('.quiz-card');
const btnShowRanking = document.getElementById('btn-show-ranking');
const btnHideRanking = document.getElementById('btn-hide-ranking');
const rankingSection = document.getElementById('ranking-section');
const rankingList = document.getElementById('ranking-list');
const welcomeControls = document.getElementById('welcome-controls');

const challengeOverlay = document.getElementById('random-challenge');
const challengeWarning = document.getElementById('challenge-warning');
const challengeTask = document.getElementById('challenge-task');
const challengeInput = document.getElementById('challenge-input');
const btnSubmitChallenge = document.getElementById('btn-submit-challenge');

let subjectBtns = document.querySelectorAll('.btn-subject');
let difficultyBtns = document.querySelectorAll('.btn-difficulty');

// --- INITIALIZATION ---
async function init() {
    console.log("[ONYX] Iniciando sistema...");
    OnyxUI.updateStatus('init...');
    OnyxUI.initClock();

    // Force splash hide after delay
    setTimeout(() => {
        const splash = document.getElementById('splash-screen');
        if (splash && splash.style.display !== 'none') {
            console.log("[ONYX] Ocultando splash screen.");
            splash.style.opacity = '0';
            setTimeout(() => {
                splash.style.display = 'none';
                const lastUser = localStorage.getItem('onyx_last_user');
                if (lastUser) {
                    showScreen('welcome');
                } else {
                    showScreen('login');
                }
            }, 600);
        }
    }, 1500);

    try {
        console.log("[ONYX] Inicializando Banco de Dados...");
        await QuestionDB.init();
        console.log("[ONYX] DB pronto. Atualizando interface...");
        await createTestUser(); // Initialize test user
        updateDBStats();
        
        // Auto-login last user
        const lastUser = localStorage.getItem('onyx_last_user');
        if (lastUser) {
            loginName.value = lastUser;
            loginUser('auto'); 
        } else {
            // Ensure everything is hidden/locked for non-registered users
            OnyxUI.updateStatus('ready');
        }
    } catch (err) {
        console.error("[ONYX] Erro crítico na inicialização:", err);
        OnyxUI.updateStatus('error');
        showScreen('welcome');
    }

    setupEventListeners();
}

async function createTestUser() {
    const testUserName = "OPERADOR TESTE";
    const existing = await QuestionDB.getGlobalStats(testUserName);
    
    // Check if test user already has a password (exists)
    if (!existing.password) {
        console.log("[ONYX] Criando usuário de teste padrão...");
        existing.password = "1234";
        existing.xp = 500;
        existing.level = 2; // Start at level 2 to show unlocked content
        await QuestionDB.saveGlobalStats(existing);
        OnyxUI.addReasoningLog("Usuário de TESTE criado: OPERADOR TESTE / 1234");
    }
}

function setupEventListeners() {
    document.getElementById('btn-do-login').addEventListener('click', () => loginUser('login'));
    document.getElementById('btn-do-register').addEventListener('click', () => loginUser('register'));
    document.getElementById('btn-goto-register').addEventListener('click', () => showScreen('register'));
    document.getElementById('btn-goto-login').addEventListener('click', () => showScreen('login'));

    document.getElementById('btn-logout').addEventListener('click', logoutUser);
    document.getElementById('btn-logout-header').addEventListener('click', logoutUser);
    document.getElementById('btn-dashboard').addEventListener('click', showDashboard);
    document.getElementById('btn-close-dashboard').addEventListener('click', () => {
        document.getElementById('dashboard-overlay').classList.remove('active');
    });
    btnStart.addEventListener('click', startQuiz);
    btnRestart.addEventListener('click', restartQuiz);
    btnDownload.addEventListener('click', downloadReport);
    btnFullscreen.addEventListener('click', toggleFullscreen);
    btnShowRanking.addEventListener('click', showRanking);
    btnHideRanking.addEventListener('click', hideRanking);
    btnSubmitChallenge.addEventListener('click', checkChallenge);
    document.getElementById('btn-init-protocol').addEventListener('click', finalizeStart);

    loginPass.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') loginUser('login');
    });

    regPass.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') loginUser('register');
    });

    challengeInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') checkChallenge();
    });

    subjectBtns.forEach(btn => {
        btn.addEventListener('click', async () => {
            subjectBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentState.subject = btn.dataset.subject;
            await updateDifficultyLocks(currentState.globalLevel);
            OnyxUI.applyTheme(btn.dataset.subject);
            OnyxUI.playFeedback('click');
        });
    });

    difficultyBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            if (btn.classList.contains('locked')) {
                OnyxUI.playFeedback('error');
                return;
            }
            difficultyBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentState.difficulty = btn.dataset.difficulty;
            OnyxUI.playFeedback('click');
        });
    });

    // Keyboard shortcuts
    window.addEventListener('keydown', (e) => {
        if (currentState.isAnswered || !screens.quiz.classList.contains('active')) return;
        if (['1', '2', '3', '4'].includes(e.key)) {
            const index = parseInt(e.key) - 1;
            const btns = optionsContainer.querySelectorAll('.option-btn');
            if (btns[index]) btns[index].click();
        }
    });
}

// --- AUTH LOGIC ---
let currentAuthMode = 'login';


async function loginUser(mode) {
    let name = "";
    let pass = "";
    const isAutoLogin = (mode === 'auto');

    if (mode === 'login' || isAutoLogin) {
        name = loginName.value.trim();
        pass = loginPass.value.trim();
    } else if (mode === 'register') {
        name = regName.value.trim();
        pass = regPass.value.trim();
    }
    
    if (!isAutoLogin && (!name || !pass)) {
        OnyxUI.playFeedback('error');
        alert("ERRO: Identificação e Senha são necessárias.");
        return;
    }

    if (mode === 'register' && name.split(/\s+/).length < 2) {
        OnyxUI.playFeedback('error');
        alert("ERRO DE PROTOCOLO: O cadastro exige NOME COMPLETO para identificação única.");
        return;
    }

    // Check if user exists
    const existingUser = await QuestionDB.getGlobalStats(name);
    const userExists = existingUser && existingUser.password;

    if (mode === 'register') {
        if (userExists) {
            OnyxUI.playFeedback('error');
            alert("ERRO: Este usuário já está cadastrado. Utilize a tela de LOGIN.");
            return;
        }
        // Save new user with password
        existingUser.password = pass;
        await QuestionDB.saveGlobalStats(existingUser);
    } else {
        // Login mode (including auto)
        if (!userExists) {
            if (isAutoLogin) return; // Silent fail on auto-login
            OnyxUI.playFeedback('error');
            alert("ERRO: Usuário não encontrado. Verifique os dados ou realize o CADASTRO.");
            return;
        }
        if (existingUser.password !== pass && !isAutoLogin) {
            OnyxUI.playFeedback('error');
            alert("ERRO: Senha incorreta para o operador " + name.toUpperCase());
            return;
        }
    }

    OnyxUI.playFeedback('success');
    currentState.studentName = name;
    localStorage.setItem('onyx_last_user', name);
    
    showScreen('welcome');
    document.getElementById('logged-user-name').textContent = name;
    
    const stats = await QuestionDB.getGlobalStats(name);
    currentState.globalLevel = stats.level;
    updateProgressionUI(stats);
    OnyxUI.addReasoningLog(`Sessão iniciada para: ${name.toUpperCase()}`);
}

function logoutUser() {
    localStorage.removeItem('onyx_last_user');
    location.reload();
}

async function showDashboard() {
    const stats = await QuestionDB.getGlobalStats(currentState.studentName);
    const container = document.getElementById('dashboard-content');
    
    const unlockedSubjects = Object.keys(ProgressionConfig.subjects).filter(s => stats.level >= ProgressionConfig.subjects[s]);
    const unlockedDiffs = Object.keys(ProgressionConfig.difficulties).filter(d => stats.level >= ProgressionConfig.difficulties[d]);
    
    container.innerHTML = `
        <div class="briefing-item">
            <span class="b-label">XP TOTAL:</span>
            <span class="b-value">${stats.xp} XP</span>
        </div>
        <div class="briefing-item">
            <span class="b-label">NÍVEL ATUAL:</span>
            <span class="b-value">${stats.level}</span>
        </div>
        <div class="briefing-item" style="margin-top: 20px;">
            <span class="b-label">MATÉRIAS LIBERADAS:</span>
        </div>
        <div class="new-unlocks" style="justify-content: flex-start;">
            ${unlockedSubjects.map(s => `<span class="unlock-item" style="font-size: 0.7rem;">${getSubjectLabel(s)}</span>`).join('')}
        </div>
        <div class="briefing-item" style="margin-top: 20px;">
            <span class="b-label">DIFICULDADES:</span>
        </div>
        <div class="new-unlocks" style="justify-content: flex-start;">
            ${unlockedDiffs.map(d => `<span class="unlock-item" style="font-size: 0.7rem;">${getDifficultyLabel(d)}</span>`).join('')}
        </div>
    `;
    
    document.getElementById('dashboard-overlay').classList.add('active');
}

// --- CORE LOGIC ---
async function startQuiz() {
    const name = currentState.studentName;
    if (!name) return;

    OnyxUI.updateStatus('loading questions');
    btnStart.disabled = true;
    btnStart.textContent = "PROCESSANDO...";

    currentState.studentName = name;
    currentState.profile = new StudentProfile(name);
    currentState.currentQuestionIndex = 0;
    currentState.score = 0;
    currentState.streak = 0;

    const subject = currentState.subject;
    const difficulty = currentState.difficulty;
    
    showBriefing(subject, difficulty);
}

function showBriefing(subject, difficulty) {
    OnyxUI.playFeedback('click');
    document.getElementById('briefing-subject').textContent = getSubjectLabel(subject);
    document.getElementById('briefing-diff').textContent = getDifficultyLabel(difficulty).toUpperCase();
    document.getElementById('briefing-risk').textContent = difficulty === 'easy' ? 'BAIXO' : (difficulty === 'medium' ? 'MÉDIO' : 'ALTO');
    
    const briefingText = document.getElementById('briefing-text');
    OnyxUI.scrambleText(briefingText, "Sincronizando com o núcleo da rede... Prepare-se para a extração de conhecimento.", 1500);
    
    document.getElementById('mission-briefing').classList.add('active');
    
    // Auto-initiate after 3.5 seconds
    const startBtn = document.getElementById('btn-init-protocol');
    let countdown = 3;
    startBtn.textContent = `INICIANDO EM ${countdown}...`;
    
    const interval = setInterval(() => {
        countdown--;
        if (countdown > 0) {
            startBtn.textContent = `INICIANDO EM ${countdown}...`;
        } else {
            clearInterval(interval);
            finalizeStart();
        }
    }, 1000);

    // Allow manual skip
    startBtn.onclick = () => {
        clearInterval(interval);
        finalizeStart();
    };
}

async function finalizeStart() {
    document.getElementById('mission-briefing').classList.remove('active');
    document.getElementById('btn-init-protocol').textContent = "INICIAR PROTOCOLO";
    OnyxUI.playFeedback('success');
    
    const subject = currentState.subject;
    const difficulty = currentState.difficulty;
    
    let availablePool = await QuestionDB.getAll(subject, difficulty);
    const seenList = await QuestionDB.getSeen();
    availablePool = availablePool.filter(q => !seenList.includes(q.question));

    if (availablePool.length < 10) {
        await QuestionDB.resetSeen();
        availablePool = await QuestionDB.getAll(subject, difficulty);
    }

    const selectedFromPool = OnyxEngines.shuffle(availablePool).slice(0, 10);
    
    let selectedAI = [];
    if (selectedFromPool.length < 10) {
        selectedAI = await generateAIQuestions(subject, difficulty, 10 - selectedFromPool.length);
    }
    
    currentState.activeQuestions = OnyxEngines.shuffle([...selectedFromPool, ...selectedAI]);
    await QuestionDB.markSeen(currentState.activeQuestions);

    OnyxUI.updateStatus('active');
    displayName.textContent = `${name} | ${getSubjectLabel(subject)} (${getDifficultyLabel(difficulty)})`;
    showScreen('quiz');
    loadQuestion();
    
    btnStart.disabled = false;
    btnStart.textContent = "Começar Avaliação";
}

async function generateAIQuestions(subject, difficulty, count) {
    const questions = [];
    const subjectsWithEngines = ['frontend', 'backend', 'cybersecurity', 'cloud_devops', 'logic', 'python', 'sql', 'data_science'];
    
    for (let i = 0; i < count; i++) {
        let activeSubject = subject;
        if (subject === 'random') {
            activeSubject = subjectsWithEngines[Math.floor(Math.random() * subjectsWithEngines.length)];
        }

        let q;
        if (activeSubject === 'frontend') q = OnyxEngines.engineFrontend(difficulty);
        else if (activeSubject === 'backend') q = OnyxEngines.engineBackend(difficulty);
        else if (activeSubject === 'cybersecurity') q = OnyxEngines.engineCybersecurity(difficulty);
        else if (activeSubject === 'cloud_devops') q = OnyxEngines.engineCloudDevops(difficulty);
        else q = OnyxEngines.engineHybrid(activeSubject, difficulty);
        
        questions.push(q);
        await QuestionDB.save(activeSubject, difficulty, q);
    }
    return questions;
}

async function loadQuestion() {
    currentState.isAnswered = false;
    const q = currentState.activeQuestions[currentState.currentQuestionIndex];
    if (!q) return finishQuiz();

    OnyxUI.clearReasoningLogs();
    await simulateAIThinking();

    progressBar.style.width = `${(currentState.currentQuestionIndex / currentState.activeQuestions.length) * 100}%`;
    currentQDisplay.textContent = currentState.currentQuestionIndex + 1;
    
    OnyxUI.scrambleText(questionText, q.question, 600);
    
    optionsContainer.innerHTML = '';
    q.options.forEach((opt, index) => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.textContent = opt;
        btn.onclick = () => selectOption(index, btn);
        optionsContainer.appendChild(btn);
    });

    startTimer();
}

async function simulateAIThinking() {
    const logs = [
        "Iniciando análise de heurística...",
        "Consultando banco de dados ONYX...",
        "Validando complexidade da questão...",
        "Sincronizando padrões cognitivos...",
        "Aguardando resposta do núcleo..."
    ];
    for (const log of logs) {
        OnyxUI.addReasoningLog(log);
        await new Promise(r => setTimeout(r, 150 + Math.random() * 200));
    }
}

function selectOption(index, btn) {
    if (currentState.isAnswered) return;
    stopTimer();
    currentState.isAnswered = true;
    
    const q = currentState.activeQuestions[currentState.currentQuestionIndex];
    const allBtns = optionsContainer.querySelectorAll('.option-btn');
    const isCorrect = (index === q.answer);

    if (currentState.profile) {
        currentState.profile.update(q, isCorrect);
    }

    if (isCorrect) {
        btn.classList.add('correct');
        currentState.score++;
        currentState.streak++;
        OnyxUI.playFeedback('success');
        const rect = btn.getBoundingClientRect();
        OnyxUI.createParticles(rect.left + rect.width/2, rect.top + rect.height/2, '#10b981');
    } else {
        btn.classList.add('wrong');
        allBtns[q.answer].classList.add('correct');
        currentState.streak = 0;
        OnyxUI.playFeedback('error');
        if (quizCard) {
            quizCard.classList.add('shake');
            setTimeout(() => quizCard.classList.remove('shake'), 400);
        }
    }

    if (q.explanation) {
        OnyxUI.addReasoningLog(`Explicação: ${q.explanation}`);
    }
    
    updateStreakDisplay();
    setTimeout(async () => {
        currentState.currentQuestionIndex++;
        if (currentState.currentQuestionIndex < currentState.activeQuestions.length) {
            // Random Challenge Trigger (15% chance)
            if (Math.random() < 0.15) {
                triggerRandomChallenge();
                return; // Stop until challenge is done
            }

            if (currentState.currentQuestionIndex === 5 && currentState.profile) {
                await adaptRemainingQuestions();
            }
            loadQuestion();
        } else finishQuiz();
    }, isCorrect ? 800 : 3000);
}

const globalChallenges = [
    { t: "Qual o comando para listar arquivos em Linux?", a: "ls" },
    { t: "O que significa CSS?", a: "Cascading Style Sheets" },
    { t: "Qual a tag HTML para links?", a: "a" },
    { t: "Quanto é 2 + 2 * 2?", a: "6" },
    { t: "Qual o protocolo padrão da Web?", a: "http" },
    { t: "Qual comando Git inicia um repositório?", a: "git init" },
    { t: "O que significa SQL?", a: "Structured Query Language" },
    { t: "Qual a porta padrão do HTTP?", a: "80" }
];

async function triggerRandomChallenge() {
    OnyxUI.playFeedback('alert');
    
    const seen = await QuestionDB.getSeen();
    const available = globalChallenges.filter(c => !seen.includes(c.t));
    
    const pool = available.length > 0 ? available : globalChallenges;
    const pick = pool[Math.floor(Math.random() * pool.length)];
    
    challengeTask.textContent = pick.t;
    challengeInput.value = "";
    challengeInput.dataset.answer = pick.a;
    
    await QuestionDB.markSeen([{ question: pick.t }]);
    
    challengeWarning.classList.add('active');
    setTimeout(() => {
        challengeWarning.classList.remove('active');
        challengeOverlay.classList.add('active');
        challengeInput.focus();
    }, 2000);
}

function checkChallenge() {
    const val = challengeInput.value.trim().toLowerCase();
    const ans = challengeInput.dataset.answer.toLowerCase();
    
    challengeOverlay.classList.remove('active');
    
    if (val === ans) {
        OnyxUI.addReasoningLog("DESAFIO CONCLUÍDO: Bônus de XP concedido.");
        currentState.score += 0.5; // Bonus
        OnyxUI.playFeedback('success');
    } else {
        OnyxUI.addReasoningLog("DESAFIO FALHOU: Resposta incorreta.");
        OnyxUI.playFeedback('error');
    }
    
    // Continue quiz
    if (currentState.currentQuestionIndex === 5 && currentState.profile) {
        adaptRemainingQuestions().then(() => loadQuestion());
    } else {
        loadQuestion();
    }
}

async function adaptRemainingQuestions() {
    const p = currentState.profile;
    const currentSubject = currentState.subject;
    const nextLevel = p.level;
    
    OnyxUI.addReasoningLog(`Adaptando dificuldade para: ${nextLevel.toUpperCase()}`);
    
    let newBatch = await QuestionDB.getByNivel(currentSubject, nextLevel);
    const seen = await QuestionDB.getSeen();
    newBatch = newBatch.filter(q => !seen.includes(q.question));
    
    if (newBatch.length > 0) {
        const replacement = OnyxEngines.shuffle(newBatch).slice(0, 5);
        currentState.activeQuestions.splice(currentState.currentQuestionIndex, 5, ...replacement);
        await QuestionDB.markSeen(replacement);
    }
}

function finishQuiz() {
    stopTimer();
    finalName.textContent = currentState.studentName;
    finalScore.textContent = currentState.score;
    finalLevel.textContent = getDifficultyLabel(currentState.difficulty);
    
    const report = currentState.profile ? currentState.profile.getReport() : null;
    if (report) {
        OnyxUI.showDetailedReport(report);
        setTimeout(() => drawSkillRadar(report), 500);
    }

    QuestionDB.saveRanking({
        name: currentState.studentName,
        score: currentState.score,
        subject: currentState.subject,
        difficulty: currentState.difficulty
    });

    showScreen('results');
    OnyxUI.updateStatus('completed');
    handleGlobalProgress(currentState.profile.xpGained);
}

function drawSkillRadar(report) {
    const canvas = document.getElementById('skill-radar');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const labels = Object.keys(report.themeHistory);
    if (labels.length < 3) return; // Need at least 3 points for a radar
    
    const size = 400;
    canvas.width = size;
    canvas.height = size;
    const center = size / 2;
    const radius = size * 0.4;
    
    // Clear
    ctx.clearRect(0, 0, size, size);
    
    // Draw Axis
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 1;
    labels.forEach((l, i) => {
        const angle = (Math.PI * 2 * i) / labels.length - Math.PI / 2;
        ctx.beginPath();
        ctx.moveTo(center, center);
        ctx.lineTo(center + Math.cos(angle) * radius, center + Math.sin(angle) * radius);
        ctx.stroke();
    });
    
    // Draw Data
    ctx.beginPath();
    ctx.fillStyle = 'hsla(190, 90%, 50%, 0.3)';
    ctx.strokeStyle = 'hsl(190, 90%, 50%)';
    ctx.lineWidth = 3;
    
    labels.forEach((l, i) => {
        const angle = (Math.PI * 2 * i) / labels.length - Math.PI / 2;
        const score = report.themeHistory[l].correct / report.themeHistory[l].total;
        const r = radius * score;
        const x = center + Math.cos(angle) * r;
        const y = center + Math.sin(angle) * r;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
    });
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    
    // Draw Labels
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 12px JetBrains Mono';
    ctx.textAlign = 'center';
    labels.forEach((l, i) => {
        const angle = (Math.PI * 2 * i) / labels.length - Math.PI / 2;
        const x = center + Math.cos(angle) * (radius + 25);
        const y = center + Math.sin(angle) * (radius + 25);
        ctx.fillText(l.toUpperCase(), x, y);
    });
}

async function handleGlobalProgress(xpToAdd) {
    let stats = await QuestionDB.getGlobalStats(currentState.studentName);
    stats.xp += xpToAdd;
    
    const newLevel = Math.floor(stats.xp / 1000) + 1;
    const levelUp = newLevel > stats.level;
    stats.level = newLevel;
    currentState.globalLevel = newLevel;
    
    await QuestionDB.saveGlobalStats(stats);
    OnyxUI.showSaveNotification();
    
    const nextLevel = findNextUnlockLevel(stats.level);
    const nextUnlocks = nextLevel ? getUnlocksForLevel(nextLevel) : [];
    
    OnyxUI.renderXPProgress(stats, xpToAdd, nextUnlocks[0] || null);
    updateProgressionUI(stats);
    
    if (levelUp) {
        OnyxUI.playFeedback('success');
        OnyxUI.addReasoningLog(`PROMOÇÃO: Nível global elevado para ${stats.level}`);
        
        const unlocks = getUnlocksForLevel(stats.level);
        OnyxUI.showLevelUpAnimation(stats.level, unlocks);
        
        // Update UI immediately
        updateSubjectLocks(stats.level);
        updateDifficultyLocks(stats.level);
    }
}

// --- PROGRESSION CONFIGURATION ---
const ProgressionConfig = {
    subjects: {
        python: 1,
        logic: 2, informatics: 2,
        sql: 3, algoritmos: 3, english: 3,
        frontend: 4, backend: 4, numpy: 4,
        pandas: 5, testes: 5, poo: 5,
        software_eng: 6, data_science: 6, cybersecurity: 6,
        machine_learning: 7, cloud_devops: 7,
        cryptography: 8, philosophy: 8,
        random: 10
    },
    difficulties: {
        easy: 1,
        medium: 3,
        hard: 5,
        insane: 7,
        impossible: 10
    }
};

function getUnlocksForLevel(level) {
    const unlocks = [];
    for (const [sub, req] of Object.entries(ProgressionConfig.subjects)) {
        if (req === level) unlocks.push(getSubjectLabel(sub));
    }
    for (const [diff, req] of Object.entries(ProgressionConfig.difficulties)) {
        if (req === level) unlocks.push(`Dificuldade ${getDifficultyLabel(diff)}`);
    }
    return unlocks;
}

function updateProgressionUI(stats) {
    OnyxUI.renderGlobalStatsHeader(stats);
    updateSubjectLocks(stats.level);
    updateDifficultyLocks(stats.level);
    
    const nextLevel = findNextUnlockLevel(stats.level);
    if (nextLevel) {
        const nextUnlocks = getUnlocksForLevel(nextLevel);
        OnyxUI.renderNextUnlocksHint(nextLevel, nextUnlocks);
    } else {
        OnyxUI.renderNextUnlocksHint(null, []);
    }
}

function findNextUnlockLevel(currentLevel) {
    const allReqs = [
        ...Object.values(ProgressionConfig.subjects),
        ...Object.values(ProgressionConfig.difficulties)
    ];
    const uniqueReqs = [...new Set(allReqs)].filter(l => l > currentLevel).sort((a, b) => a - b);
    return uniqueReqs[0] || null;
}

// --- HELPERS ---
function startTimer() {
    stopTimer();
    currentState.timeLeft = 20;
    updateTimerDisplay();
    currentState.timer = setInterval(() => {
        currentState.timeLeft--;
        updateTimerDisplay();
        if (currentState.timeLeft <= 0) handleTimeOut();
    }, 1000);
}

function stopTimer() { clearInterval(currentState.timer); }

function updateTimerDisplay() {
    timerText.textContent = `${currentState.timeLeft}s`;
    timerContainer.classList.toggle('warning', currentState.timeLeft <= 5);
}

function handleTimeOut() {
    if (currentState.isAnswered) return;
    currentState.isAnswered = true;
    OnyxUI.playFeedback('error');
    questionText.textContent = "TEMPO ESGOTADO!";
    setTimeout(() => {
        currentState.currentQuestionIndex++;
        if (currentState.currentQuestionIndex < currentState.activeQuestions.length) loadQuestion();
        else finishQuiz();
    }, 2000);
}

function showScreen(key) {
    Object.values(screens).forEach(s => {
        if (s) s.classList.remove('active');
    });
    if (screens[key]) screens[key].classList.add('active');
}

function getSubjectLabel(s) {
    const labels = { 
        python: 'Python Pro',
        numpy: 'NumPy Data Science',
        pandas: 'Pandas Data Analysis',
        sql: 'Database SQL',
        machine_learning: 'ML & AI',
        testes: 'Software Testing',
        poo: 'OOP Architecture',
        algoritmos: 'Algorithms & Data',
        logic: 'Lógica & Raciocínio', 
        informatics: 'Sistemas & Hardware',
        english: 'Technical English',
        data_science: 'Data Science & AI',
        frontend: 'Frontend Engineering', 
        backend: 'Backend Architecture', 
        software_eng: 'Software Engineering',
        cybersecurity: 'Cybersecurity Ops', 
        cloud_devops: 'Cloud & DevOps',
        cryptography: 'Cryptography & Sec',
        philosophy: 'Ethics & Philosophy',
        random: 'Aleatórios (Mixed)'
    };
    return labels[s] || s.toUpperCase();
}

function getDifficultyLabel(d) {
    const labels = { easy: 'Fácil', medium: 'Médio', hard: 'Difícil', insane: 'Insano', impossible: 'Impossível' };
    return labels[d] || d;
}

async function updateDBStats() {
    const count = await QuestionDB.getStats();
    dbStatsDisplay.textContent = `ONYX DB | ${count > 0 ? count : 420} ANALYTICS`;
}
async function updateDifficultyLocks(globalLevel = 1) {
    difficultyBtns.forEach(btn => {
        const level = btn.dataset.difficulty;
        const requiredLevel = ProgressionConfig.difficulties[level] || 1;
        const isUnlocked = globalLevel >= requiredLevel;
        
        btn.classList.toggle('locked', !isUnlocked);
        btn.style.opacity = isUnlocked ? "1" : "0.4";
        btn.style.pointerEvents = isUnlocked ? "auto" : "none";
        
        if (!isUnlocked) {
            btn.setAttribute('title', `Bloqueado: Requer Nível Global ${requiredLevel}`);
            
            if (!btn.querySelector('.lock-overlay-mini')) {
                const lock = document.createElement('div');
                lock.className = 'lock-overlay-mini';
                lock.innerHTML = `<span>LVL ${requiredLevel}</span>`;
                btn.appendChild(lock);
            }
        } else {
            btn.removeAttribute('title');
            const lock = btn.querySelector('.lock-overlay-mini');
            if (lock) lock.remove();
        }
    });
}

function updateSubjectLocks(globalLevel = 1) {
    subjectBtns.forEach(btn => {
        const sub = btn.dataset.subject;
        const required = ProgressionConfig.subjects[sub] || 1;
        const isUnlocked = globalLevel >= required;

        btn.classList.toggle('subject-locked', !isUnlocked);
        if (!isUnlocked) {
            btn.style.opacity = "0.3";
            btn.style.pointerEvents = "none";
            btn.setAttribute('title', `Bloqueado: Desbloqueia no Nível ${required}`);
            
            if (!btn.querySelector('.lock-overlay')) {
                const lock = document.createElement('div');
                lock.className = 'lock-overlay';
                lock.innerHTML = `<span>REQUER LVL ${required}</span>`;
                btn.appendChild(lock);
            }
        } else {
            btn.style.opacity = "1";
            btn.style.pointerEvents = "auto";
            btn.removeAttribute('title');
            const lock = btn.querySelector('.lock-overlay');
            if (lock) lock.remove();
        }
    });
}

function updateStreakDisplay() {
    streakBadge.classList.toggle('active', currentState.streak > 1);
    streakCount.textContent = currentState.streak;
}

function toggleFullscreen() {
    if (!document.fullscreenElement) document.documentElement.requestFullscreen();
    else document.exitFullscreen();
}

function downloadReport() {
    const date = new Date().toLocaleString('pt-BR');
    const report = `
╔════════════════════════════════════════════╗
║         ONYX ASSESSMENT REPORT             ║
╠════════════════════════════════════════════╣
  STUDENT:    ${currentState.studentName}
  SUBJECT:    ${getSubjectLabel(currentState.subject)}
  DIFFICULTY: ${getDifficultyLabel(currentState.difficulty)}
  DATE:       ${date}
  SCORE:      ${currentState.score} / ${currentState.activeQuestions.length}
╚════════════════════════════════════════════╝
    `.trim();

    const blob = new Blob([report], { type: 'text/plain' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `ONYX_REPORT_${currentState.studentName.replace(/\s/g, '_')}.txt`;
    a.click();
}

async function showRanking() {
    rankingList.innerHTML = 'Acessando ranking...';
    const ranking = await QuestionDB.getRanking();
    rankingList.innerHTML = ranking.map((r, i) => `
        <div class="ranking-item">
            <div class="rank-number">#${i+1}</div>
            <div class="rank-name">${r.name}</div>
            <div class="rank-score">${r.score} pts</div>
        </div>
    `).join('') || 'Nenhum registro.';
    rankingSection.classList.add('active');
}

function hideRanking() {
    rankingSection.classList.remove('active');
}

function restartQuiz() {
    showScreen('welcome');
}

init();
