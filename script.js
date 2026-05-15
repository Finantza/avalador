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
            console.log("[ONYX] Base de conhecimento expandida carregada.");
        } catch (e) {
            console.warn("[ONYX] Erro ao carregar base expandida. Usando fallback.");
            this.staticPool = { logic: { easy: [], medium: [], hard: [] } };
        }
    },

    async getByNivel(subject, level) {
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
            const staticSet = (this.staticPool && this.staticPool[subject] && this.staticPool[subject][difficulty]) || [];
            if (!this.db) return resolve([...staticSet]);
            
            const transaction = this.db.transaction(['questions'], 'readonly');
            const store = transaction.objectStore('questions');
            const request = store.getAll();
            request.onsuccess = () => {
                const filtered = request.result.filter(q => q.subject === subject && q.difficulty === difficulty);
                resolve([...staticSet, ...filtered]);
            };
        });
    },

    async markSeen(subject, difficulty, questions) {
        return new Promise((resolve) => {
            if (!this.db) return resolve();
            const key = `${subject}_${difficulty}`;
            const transaction = this.db.transaction(['seen'], 'readwrite');
            const store = transaction.objectStore('seen');
            const getRequest = store.get(key);
            
            const questionTexts = Array.isArray(questions) ? questions.map(q => q.question) : [questions.question];
            
            getRequest.onsuccess = () => {
                let data = getRequest.result || { key, list: [] };
                questionTexts.forEach(txt => {
                    if (!data.list.includes(txt)) data.list.push(txt);
                });
                store.put(data);
                transaction.oncomplete = () => resolve();
            };
        });
    },

    async getSeen(subject, difficulty) {
        return new Promise((resolve) => {
            if (!this.db) return resolve([]);
            const key = `${subject}_${difficulty}`;
            const transaction = this.db.transaction(['seen'], 'readonly');
            const store = transaction.objectStore('seen');
            const request = store.get(key);
            request.onsuccess = () => resolve(request.result ? request.result.list : []);
        });
    },

    async resetSeen(subject, difficulty) {
        if (!this.db) return;
        const key = `${subject}_${difficulty}`;
        const transaction = this.db.transaction(['seen'], 'readwrite');
        transaction.objectStore('seen').delete(key);
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
    subject: "logic",
    difficulty: "easy",
    currentQuestionIndex: 0,
    score: 0,
    isAnswered: false,
    activeQuestions: [],
    timer: null,
    timeLeft: 20,
    streak: 0,
    profile: null
};

// --- DOM ELEMENTS ---
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

const subjectBtns = document.querySelectorAll('.btn-subject');
const difficultyBtns = document.querySelectorAll('.btn-difficulty');

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
                showScreen('welcome');
            }, 600);
        }
    }, 1500);

    try {
        console.log("[ONYX] Inicializando Banco de Dados...");
        await QuestionDB.init();
        console.log("[ONYX] DB pronto. Atualizando interface...");
        updateDBStats();
        updateDifficultyLocks();
        OnyxUI.updateStatus('ready');
    } catch (err) {
        console.error("[ONYX] Erro crítico na inicialização:", err);
        OnyxUI.updateStatus('error');
        showScreen('welcome');
    }

    setupEventListeners();
}

function setupEventListeners() {
    btnStart.addEventListener('click', startQuiz);
    btnRestart.addEventListener('click', restartQuiz);
    btnDownload.addEventListener('click', downloadReport);
    btnFullscreen.addEventListener('click', toggleFullscreen);
    btnShowRanking.addEventListener('click', showRanking);
    btnHideRanking.addEventListener('click', hideRanking);
    btnSubmitChallenge.addEventListener('click', checkChallenge);
    
    challengeInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') checkChallenge();
    });

    subjectBtns.forEach(btn => {
        btn.addEventListener('click', async () => {
            subjectBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentState.subject = btn.dataset.subject;
            await updateDifficultyLocks();
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

// --- CORE LOGIC ---
async function startQuiz() {
    const name = inputName.value.trim();
    if (name.split(/\s+/).length < 2) {
        alert("ERRO: Insira seu NOME COMPLETO.");
        return;
    }

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
    
    let availablePool = await QuestionDB.getAll(subject, difficulty);
    const seenList = await QuestionDB.getSeen(subject, difficulty);
    availablePool = availablePool.filter(q => !seenList.includes(q.question));

    if (availablePool.length < 10) {
        await QuestionDB.resetSeen(subject, difficulty);
        availablePool = await QuestionDB.getAll(subject, difficulty);
    }

    const selectedFromPool = OnyxEngines.shuffle(availablePool).slice(0, 10);
    
    let selectedAI = [];
    if (selectedFromPool.length < 10) {
        selectedAI = await generateAIQuestions(subject, difficulty, 10 - selectedFromPool.length);
    }
    
    currentState.activeQuestions = OnyxEngines.shuffle([...selectedFromPool, ...selectedAI]);
    await QuestionDB.markSeen(subject, difficulty, currentState.activeQuestions);

    OnyxUI.updateStatus('active');
    displayName.textContent = `${name} | ${getSubjectLabel(subject)} (${getDifficultyLabel(difficulty)})`;
    showScreen('quiz');
    loadQuestion();
    
    btnStart.disabled = false;
    btnStart.textContent = "Começar Avaliação";
}

async function generateAIQuestions(subject, difficulty, count) {
    const questions = [];
    for (let i = 0; i < count; i++) {
        let q;
        if (subject === 'frontend') q = OnyxEngines.engineFrontend(difficulty);
        else if (subject === 'backend') q = OnyxEngines.engineBackend(difficulty);
        else if (subject === 'cybersecurity') q = OnyxEngines.engineCybersecurity(difficulty);
        else if (subject === 'cloud_devops') q = OnyxEngines.engineCloudDevops(difficulty);
        else q = OnyxEngines.engineHybrid(subject, difficulty);
        
        questions.push(q);
        await QuestionDB.save(subject, difficulty, q);
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
            if (currentState.currentQuestionIndex === 5 && currentState.profile) {
                await adaptRemainingQuestions();
            }
            loadQuestion();
        } else finishQuiz();
    }, isCorrect ? 800 : 3000);
}

async function adaptRemainingQuestions() {
    const p = currentState.profile;
    const currentSubject = currentState.subject;
    const nextLevel = p.level;
    
    OnyxUI.addReasoningLog(`Adaptando dificuldade para: ${nextLevel.toUpperCase()}`);
    
    let newBatch = await QuestionDB.getByNivel(currentSubject, nextLevel);
    const seen = await QuestionDB.getSeen(currentSubject, nextLevel);
    newBatch = newBatch.filter(q => !seen.includes(q.question));
    
    if (newBatch.length > 0) {
        const replacement = OnyxEngines.shuffle(newBatch).slice(0, 5);
        currentState.activeQuestions.splice(currentState.currentQuestionIndex, 5, ...replacement);
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
    }

    QuestionDB.saveRanking({
        name: currentState.studentName,
        score: currentState.score,
        subject: currentState.subject,
        difficulty: currentState.difficulty
    });

    if (currentState.score / currentState.activeQuestions.length >= 0.6) {
        const progression = ['easy', 'medium', 'hard', 'insane', 'impossible'];
        const next = progression[progression.indexOf(currentState.difficulty) + 1];
        if (next) QuestionDB.unlockLevel(currentState.subject, next);
    }

    showScreen('results');
    OnyxUI.updateStatus('completed');
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
        logic: 'Lógica', 
        informatics: 'Informática',
        english: 'Inglês',
        data_science: 'Ciência de Dados',
        frontend: 'Frontend', 
        backend: 'Backend', 
        cybersecurity: 'Segurança', 
        cloud_devops: 'DevOps',
        python: 'Python',
        numpy: 'NumPy',
        pandas: 'Pandas',
        sql: 'SQL',
        machine_learning: 'Machine Learning',
        testes: 'Testes',
        poo: 'POO',
        algoritmos: 'Algoritmos',
        philosophy: 'Filosofia',
        cryptography: 'Criptografia'
    };
    return labels[s] || s;
}

function getDifficultyLabel(d) {
    const labels = { easy: 'Fácil', medium: 'Médio', hard: 'Difícil', insane: 'Insano', impossible: 'Impossível' };
    return labels[d] || d;
}

async function updateDBStats() {
    const count = await QuestionDB.getStats();
    dbStatsDisplay.textContent = `ONYX DB | ${count > 0 ? count : 420} ANALYTICS`;
}

async function updateDifficultyLocks() {
    const progress = await QuestionDB.getProgress(currentState.subject);
    difficultyBtns.forEach(btn => {
        const level = btn.dataset.difficulty;
        const isUnlocked = progress.unlocked.includes(level);
        btn.classList.toggle('locked', !isUnlocked);
        btn.style.opacity = isUnlocked ? "1" : "0.4";
        btn.style.pointerEvents = isUnlocked ? "auto" : "none";
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
    welcomeControls.style.display = 'none';
    rankingSection.style.display = 'block';
    rankingList.innerHTML = 'Acessando ranking...';
    const ranking = await QuestionDB.getRanking();
    rankingList.innerHTML = ranking.map((r, i) => `
        <div class="ranking-item">
            <div class="rank-number">#${i+1}</div>
            <div class="rank-name">${r.name}</div>
            <div class="rank-score">${r.score} pts</div>
        </div>
    `).join('') || 'Nenhum registro.';
}

function hideRanking() {
    rankingSection.style.display = 'none';
    welcomeControls.style.display = 'block';
}

function restartQuiz() {
    showScreen('welcome');
}

init();
