// Minimal browser mock for Node environment
global.window = {
    OnyxEngines: {}
};
global.document = {
    createElement: () => ({ innerHTML: "", value: "" })
};

// Load Onyx Modules
require('../js/onyx_database.js');
const enginesContent = require('fs').readFileSync(__dirname + '/../js/onyx_engines.js', 'utf8');

// Evaluate the engines file to load it into global.window
eval(enginesContent);

// Test variables
const subject = 'quimica';
const difficulty = 'hard';

console.log("=== RUNNING QUIZ ISOLATION TEST ===");
console.log(`Targeting Subject: ${subject.toUpperCase()}, Difficulty: ${difficulty.toUpperCase()}\n`);

// Simulate Question Generation
(async () => {
    try {
        const questions = await global.window.OnyxEngines.QuestionEngine.generateQuestions('test-user', subject, difficulty, 5);
        let success = true;

        questions.forEach((q, index) => {
            console.log(`[Q${index + 1}] Text: "${q.text.substring(0, 70)}..."`);
            console.log(`     Concept: ${q.concept}`);
            
            // Check headers
            const header = `[ONYX PROTOCOL] ${subject.toUpperCase()} (${difficulty.toUpperCase()}):`;
            if (!q.text.startsWith(header)) {
                console.error(`❌ Leak detected! Question prefix does not match expected: ${header}`);
                success = false;
            }
        });

        if (success) {
            console.log("\n✅ SUCCESS: All generated questions are perfectly isolated by Subject and Difficulty!");
        } else {
            console.log("\n❌ FAILURE: Leaks were detected in the question pool.");
        }
    } catch (e) {
        console.error("Test execution failed:", e);
    }
})();
