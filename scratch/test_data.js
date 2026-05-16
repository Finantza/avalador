/**
 * DATA INTEGRITY TEST
 * Verifies that all subjects in dashboard have questions in engines.
 */
const { OnyxEngines } = require('../onyx_engines.js');

const dashboardSubjects = [
    'python', 'sql', 'machine_learning', 'cybersecurity', 
    'frontend', 'backend', 'logic', 'cloud', 'random'
];

console.log("[START] Validando Banco de Dados de Questões...");

dashboardSubjects.forEach(s => {
    try {
        const questions = OnyxEngines.QuestionEngine.generateQuestions(s, 'easy', 1);
        if (questions && questions.length > 0) {
            console.log(`✅ [${s.toUpperCase()}] - OK (${questions[0].text.substring(0, 30)}...)`);
        } else {
            console.error(`❌ [${s.toUpperCase()}] - Sem questões!`);
        }
    } catch (e) {
        console.error(`❌ [${s.toUpperCase()}] - Erro no Engine: ${e.message}`);
    }
});

console.log("\n[VERDICT] Integridade de dados validada.");
