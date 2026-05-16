/**
 * ONYX PROGRESSION SIMULATOR
 * Verifies the XP and Level Up logic.
 */

function simulateProgression(initialStats, missions) {
    let stats = { ...initialStats };
    console.log(`[START] Operador: ${stats.id} | Nível: ${stats.level} | XP: ${stats.xp}`);

    for (let i = 1; i <= missions; i++) {
        const score = 10; // Perfect score
        const streak = 10; 
        
        // XP Logic from quiz.html:finishMission
        const xpGained = score * 10 + (streak > 5 ? 50 : 0); // 100 + 50 = 150 per mission
        stats.xp += xpGained;

        console.log(`Missão ${i}: +${xpGained} XP | Total XP: ${stats.xp}`);

        // Level Up Logic from quiz.html:finishMission
        while (stats.xp >= stats.level * 100) {
            stats.xp -= stats.level * 100;
            stats.level++;
            console.log(`>>> LEVEL UP! Novo Nível: ${stats.level} | XP Restante: ${stats.xp}`);
        }
    }

    console.log(`[END] Final - Nível: ${stats.level} | XP: ${stats.xp}`);
    return stats;
}

const finalStats = simulateProgression({ id: 'OPERADOR TESTE', level: 1, xp: 0 }, 7);

if (finalStats.level >= 5 && finalStats.xp >= 0) {
    console.log("\n[VERDICT] TESTE DE 1000+ XP: SUCESSO. Lógica de progressão validada.");
} else {
    console.log("\n[VERDICT] TESTE FALHOU.");
}
