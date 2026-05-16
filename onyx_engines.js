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

    // Profiling Engine: Analyzes historical data to find weaknesses and trends
    async generateProfileInsight(userId) {
        const history = await window.OnyxCore.DB.getHistory(userId);
        if (history.length < 3) return { status: 'INSUFFICIENT_DATA', recommendation: 'Realize mais missões para calibrar o motor heurístico.', accuracyAvg: 0, weakness: 'N/A', trend: 'N/A' };

        const statsMap = {};
        history.forEach(h => {
            if (!statsMap[h.subject]) statsMap[h.subject] = { total: 0, correct: 0, recent: [] };
            statsMap[h.subject].total += 10;
            statsMap[h.subject].correct += h.score;
            statsMap[h.subject].recent.push(h.score);
        });

        const profiles = Object.entries(statsMap).map(([subject, data]) => {
            const overallAccuracy = (data.correct / data.total) * 100;
            return {
                subject,
                accuracy: overallAccuracy
            };
        });

        const weakness = profiles.sort((a, b) => a.accuracy - b.accuracy)[0];
        const accuracyAvg = (profiles.reduce((acc, p) => acc + p.accuracy, 0) / profiles.length).toFixed(1);
        
        // Trend Analysis (Last 5 missions globally vs Overall)
        const globalRecent = history.slice(0, 5);
        const globalRecentAvg = (globalRecent.reduce((acc, h) => acc + h.score, 0) / (globalRecent.length * 10)) * 100;
        
        let trend = 'ESTÁVEL';
        let trendColor = 'var(--primary)';
        if (globalRecentAvg > accuracyAvg + 5) { trend = 'EM ASCENSÃO'; trendColor = 'var(--success)'; }
        else if (globalRecentAvg < accuracyAvg - 5) { trend = 'EM DECLÍNIO'; trendColor = 'var(--error)'; }

        return {
            status: 'OPERATIONAL',
            accuracyAvg,
            weakness: weakness.subject.toUpperCase(),
            trend,
            trendColor,
            recommendation: `Foque em ${weakness.subject.toUpperCase()}. Sua tendência atual é ${trend}.`
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

    CloudSyncEngine: {
        _decodeHTML(html) {
            const txt = document.createElement('textarea');
            txt.innerHTML = html;
            return txt.value;
        },
        async syncOpenTDB() {
            try {
                // Fetch 15 computer science questions from OpenTDB
                const response = await fetch('https://opentdb.com/api.php?amount=15&category=18&type=multiple');
                const data = await response.json();
                if (data.response_code !== 0) return 0;

                const newQuestions = [];
                data.results.forEach(item => {
                    const diff = item.difficulty; // 'easy', 'medium', 'hard'
                    const qText = this._decodeHTML(item.question);
                    const correctAns = this._decodeHTML(item.correct_answer);
                    const options = item.incorrect_answers.map(opt => this._decodeHTML(opt));
                    
                    // We only have 3 incorrect + 1 correct = 4 options. Onyx handles 4 options.
                    // We need to map this to Onyx schema: { q: "", a: "", d: ["", "", ""] }
                    newQuestions.push({
                        subject: 'cybersecurity', // mapping CS to cybersecurity for Onyx domains
                        difficulty: diff,
                        data: {
                            q: `[CLOUD_SYNC] ${qText}`,
                            a: correctAns,
                            d: options
                        }
                    });
                });

                // Save to IndexedDB
                if (window.OnyxCore) {
                    await window.OnyxCore.DB.saveDynamicQuestions(newQuestions);
                }
                
                return newQuestions.length;
            } catch (err) {
                console.error("[CLOUD_SYNC] Sync failed:", err);
                return 0;
            }
        }
    },

    QuestionEngine: {
        async generateQuestions(userId, subject, difficulty, count = 10) {
            const db = window.OnyxDatabase || {};
            const subjectData = db[subject] || db['matematica'];
            let pool = subjectData[difficulty] || subjectData['easy'] || [];
            
            // Merge Dynamic Questions from CloudSync (IndexedDB)
            if (window.OnyxCore) {
                const dynQ = await window.OnyxCore.DB.getDynamicQuestions();
                const matchedDynQ = dynQ.filter(q => q.subject === subject && q.difficulty === difficulty).map(q => q.data);
                pool = [...pool, ...matchedDynQ];
            }
            
            // Deduplicate pool to ensure we never have identical questions
            const uniquePool = [];
            const seenText = new Set();
            pool.forEach(item => {
                if (item && item.q && !seenText.has(item.q)) {
                    seenText.add(item.q);
                    uniquePool.push(item);
                }
            });
            pool = uniquePool;
            
            if (!pool || pool.length === 0) return [];

            // Adaptive Anti-Repetition Engine
            let stats = { seenQuestions: [] };
            if (userId && window.OnyxCore) {
                const fetchedStats = await window.OnyxCore.DB.getUser(userId);
                if (fetchedStats) stats = fetchedStats;
                if (!stats.seenQuestions) stats.seenQuestions = [];
            }
            
            // Prioritize unseen questions
            let unseenPool = pool.filter(q => !stats.seenQuestions.includes(q.q));
            
            // Fallback if we exhaust unseen pool (Reset seen registry for this pool's items)
            if (unseenPool.length < count) {
                if (userId) {
                    // Remove current pool's questions from global seen list so they can be recycled
                    const poolQuestionTexts = pool.map(p => p.q);
                    stats.seenQuestions = stats.seenQuestions.filter(qText => !poolQuestionTexts.includes(qText));
                }
                unseenPool = pool; 
            }

            const shuffledPool = window.OnyxEngines.shuffle(unseenPool);
            const selection = shuffledPool.slice(0, count);
            const questions = [];
            
            selection.forEach((pick) => {
                if (userId && !stats.seenQuestions.includes(pick.q)) {
                    stats.seenQuestions.push(pick.q);
                }
                const options = window.OnyxEngines.shuffle([pick.a, ...pick.d]);
                questions.push({
                    id: pick.q,
                    text: `[ONYX PROTOCOL] ${subject.toUpperCase()} (${difficulty.toUpperCase()}):\n${pick.q}`,
                    options: options,
                    correct: options.indexOf(pick.a)
                });
            });

            // Async save state
            if (userId && window.OnyxCore) {
                if (stats.seenQuestions.length > 500) stats.seenQuestions = stats.seenQuestions.slice(-500); // memory optimization
                window.OnyxCore.DB.saveUser(stats);
            }

            return questions;
        }
    }
};
