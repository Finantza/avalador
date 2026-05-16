/**
 * ONYX ENGINES 4.0 - HYBRID HEURISTIC ENGINE
 * Ported logic from assessment_engine.py (Python) for advanced profiling.
 */

window.OnyxEngines = {
    // Ported Heuristic: Adaptive performance weight
    calculateHeuristicScore(correct, total, timeSpent, difficulty) {
        const accuracy = (correct / total);
        const timeBonus = Math.max(0, (200 - timeSpent) / 200); // Max 200s per mission
        const diffWeight = { easy: 1, medium: 1.5, hard: 2.2, insane: 3.5, impossible: 5 }[difficulty] || 1;
        
        // Final Score = (Accuracy * 100) * Difficulty + Time Efficiency
        return Math.floor((accuracy * 100) * diffWeight + (timeBonus * 20));
    },

    // Profiling Engine: Analyzes historical data to find weaknesses
    async generateProfileInsight(userId) {
        const history = await window.OnyxCore.DB.getHistory(userId);
        if (history.length === 0) return { status: 'INSUFFICIENT_DATA', recommendation: 'Realize mais missões.' };

        const statsMap = {};
        history.forEach(h => {
            if (!statsMap[h.subject]) statsMap[h.subject] = { total: 0, correct: 0 };
            statsMap[h.subject].total += 10;
            statsMap[h.subject].correct += h.score;
        });

        const profiles = Object.entries(statsMap).map(([subject, data]) => ({
            subject,
            accuracy: (data.correct / data.total) * 100
        }));

        // Sort by lowest accuracy
        const weakness = profiles.sort((a, b) => a.accuracy - b.accuracy)[0];
        
        return {
            status: 'OPERATIONAL',
            accuracyAvg: (profiles.reduce((acc, p) => acc + p.accuracy, 0) / profiles.length).toFixed(1),
            weakness: weakness.subject.toUpperCase(),
            recommendation: `Foque em ${weakness.subject.toUpperCase()} para equilibrar seu perfil.`
        };
    },

    shuffle(array) {
        const arr = [...array];
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    },

    DataBank: {
        matematica: {
            easy: [{ q: "15 + 27?", a: "42", d: ["40", "32", "44"] }, { q: "8 x 7?", a: "56", d: ["54", "48", "63"] }],
            medium: [{ q: "Raiz de 169?", a: "13", d: ["12", "14", "15"] }, { q: "2^6?", a: "64", d: ["32", "128", "12"] }],
            hard: [{ q: "Derivada de sen(x)?", a: "cos(x)", d: ["-sen(x)", "sec(x)", "tg(x)"] }]
        },
        portugues: {
            easy: [{ q: "Sinônimo de 'Feliz'?", a: "Alegre", d: ["Triste", "Rápido", "Longe"] }],
            medium: [{ q: "Antônimo de 'Efémero'?", a: "Perene", d: ["Curto", "Rápido", "Vazio"] }],
            hard: [{ q: "Figura de linguagem: 'O sol sorriu'?", a: "Personificação", d: ["Hipérbole", "Ironia", "Metáfora"] }]
        },
        python: {
            easy: [{ q: "Saída de print(2+2)?", a: "4", d: ["22", "Error", "None"] }],
            medium: [{ q: "Criar uma lista?", a: "[]", d: ["{}", "()", "list()"] }],
            hard: [{ q: "O que é um Decorator?", a: "Wrapper de função", d: ["Loop", "Variável", "Classe"] }]
        },
        machine_learning: {
            easy: [{ q: "O que é ML?", a: "Aprendizado por dados", d: ["Programação manual", "Hardware", "Internet"] }],
            medium: [{ q: "O que é K-Means?", a: "Agrupamento (Clustering)", d: ["Classificação", "Regressão", "Rede Neural"] }],
            hard: [{ q: "O que é Gradient Descent?", a: "Otimização de pesos", d: ["Tipo de dado", "Loop infinito", "Backup"] }]
        },
        cybersecurity: {
            easy: [{ q: "O que é Firewall?", a: "Barreira de rede", d: ["Antivírus", "Hardware", "Senha"] }],
            medium: [{ q: "O que é SQL Injection?", a: "Injeção de comandos SQL", d: ["Vírus", "Spam", "Phishing"] }],
            hard: [{ q: "O que é Zero-day?", a: "Vulnerabilidade desconhecida", d: ["Ataque antigo", "Backup", "Criptografia"] }]
        }
        // ... (Adding others generically for space, but keeping the core active)
    },

    QuestionEngine: {
        generateQuestions(subject, difficulty, count = 10) {
            const subjectData = window.OnyxEngines.DataBank[subject] || window.OnyxEngines.DataBank['matematica'];
            const pool = subjectData[difficulty] || subjectData['easy'] || Object.values(subjectData)[0];
            const shuffledPool = window.OnyxEngines.shuffle(pool);
            const selection = shuffledPool.slice(0, count);
            const questions = [];
            selection.forEach((pick) => {
                const options = window.OnyxEngines.shuffle([pick.a, ...pick.d]);
                questions.push({
                    text: `[ONYX PROTOCOL] ${subject.toUpperCase()} (${difficulty.toUpperCase()}):\n${pick.q}`,
                    options: options,
                    correct: options.indexOf(pick.a)
                });
            });
            while (questions.length < count) {
                const pick = shuffledPool[Math.floor(Math.random() * shuffledPool.length)];
                const options = window.OnyxEngines.shuffle([pick.a, ...pick.d]);
                questions.push({
                    text: `[ONYX REPEAT] ${subject.toUpperCase()}:\n${pick.q}`,
                    options: options,
                    correct: options.indexOf(pick.a)
                });
            }
            return questions;
        }
    }
};
