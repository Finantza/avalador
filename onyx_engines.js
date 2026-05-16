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

    DataBank: null, // Loaded from onyx_database.js

    QuestionEngine: {
        generateQuestions(subject, difficulty, count = 10) {
            const db = window.OnyxDatabase || {};
            const subjectData = db[subject] || db['matematica'];
            const pool = subjectData[difficulty] || subjectData['easy'];
            
            if (!pool || pool.length === 0) return [];

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

            return questions;
        }
    }
};
