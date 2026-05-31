const fs = require('fs');
const path = require('path');

// 1. Mock window
global.window = {};

// 2. Load onyx_database.js
const absoluteDbPath = 'e:\\documentos\\GitHub\\GitHub\\avaliiador\\avalador\\js\\onyx_database.js';
const dbCode = fs.readFileSync(absoluteDbPath, 'utf8');
eval(dbCode);

const onyxDatabase = global.window.OnyxDatabase;
console.log('OnyxDatabase procedural engine loaded successfully.');

// 3. Load JSON files
const expandedPath = 'e:\\documentos\\GitHub\\GitHub\\avaliiador\\avalador\\data\\onyx_knowledge_expanded.json';
const knowledgePath = 'e:\\documentos\\GitHub\\GitHub\\avaliiador\\avalador\\data\\knowledge_db.json';

const expandedData = JSON.parse(fs.readFileSync(expandedPath, 'utf8'));
const knowledgeData = JSON.parse(fs.readFileSync(knowledgePath, 'utf8'));
console.log('Curated JSON datasets loaded successfully.');

// 4. Set up the target subjects object
const finalSubjects = {};
const subjects = [
    'portugues', 'literatura', 'ingles', 'artes', 'educacao_fisica',
    'algebra', 'geometria', 'estatistica', 'matematica_financeira',
    'fisica', 'quimica', 'biologia',
    'historia', 'geografia', 'filosofia', 'sociologia',
    'tecnologia', 'programacao', 'robotica', 'empreendedorismo',
    'ciencia_de_dados', 'inteligencia_artificial', 'educacao_financeira', 'marketing_digital',
    'desenvolvimento_jogos', 'seguranca_informacao', 'design_digital', 'producao_audiovisual',
    'biblioteca_digital', 'laboratorio_virtual', 'projeto_vida', 'inclusao_acessibilidade',
    // ===== NÚCLEO TECH AVANÇADO =====
    'engenharia_software', 'redes_computadores', 'banco_de_dados', 'cloud_computing', 'sistemas_embarcados', 'matematica_computacional',
    // ===== NÚCLEO AVANÇADO HUMANAS E EXATAS =====
    'calculo_diferencial', 'geopolitica_contemporanea', 'fisica_moderna', 'antropologia_cultural', 'quimica_quantica',
    'historiografia_critica', 'astrofisica_cosmologia', 'filosofia_da_mente', 'algebra_linear', 'sociologia_do_trabalho',
    'quimica_organica_avancada', 'arqueologia_e_patrimonio', 'termodinamica_avancada', 'epistemologia_avancada'
];
const difficulties = ['easy', 'medium', 'hard', 'insane', 'impossible'];

// Initialize empty structure
subjects.forEach(subj => {
    finalSubjects[subj] = {};
    difficulties.forEach(diff => {
        finalSubjects[subj][diff] = [];
    });
});

// A helper to track unique questions per subject+difficulty to avoid duplicates
const seen = new Set();
function getKey(subj, diff, qText) {
    return `${subj}_${diff}_${qText.trim().toLowerCase()}`;
}

// 5. Populate from procedural database
subjects.forEach(subj => {
    difficulties.forEach(diff => {
        const list = onyxDatabase[subj] && onyxDatabase[subj][diff] ? onyxDatabase[subj][diff] : [];
        list.forEach(q => {
            // Check structure
            if (!q.q || !q.a || !Array.isArray(q.d)) return;
            const key = getKey(subj, diff, q.q);
            if (!seen.has(key)) {
                seen.add(key);
                finalSubjects[subj][diff].push({
                    q: q.q,
                    a: q.a,
                    d: q.d,
                    explanation: q.explanation || '',
                    hint: q.hint || '',
                    concept: q.concept || 'BNCC'
                });
            }
        });
    });
});
console.log(`Populated procedural questions. Unique questions tracked: ${seen.size}`);

// 6. Map curated questions from JSON datasets
const mapping = {
    'english': 'ingles',
    'philosophy': 'filosofia',
    'estatistica': 'estatistica',
    'data_science': 'ciencia_de_dados',
    'pandas': 'ciencia_de_dados',
    'numpy': 'ciencia_de_dados',
    'sql': 'ciencia_de_dados',
    'visualizacao': 'ciencia_de_dados',
    'banco_dados': 'ciencia_de_dados',
    'cybersecurity': 'seguranca_informacao',
    'cryptography': 'seguranca_informacao',
    'python': 'programacao',
    'logic': 'programacao',
    'algoritmos': 'programacao',
    'poo': 'programacao',
    'apis': 'programacao',
    'testes': 'programacao',
    'software_eng': 'programacao',
    'machine_learning': 'inteligencia_artificial',
    'frontend': 'design_digital',
    'backend': 'programacao',
    'cloud_devops': 'tecnologia',
    'informatics': 'tecnologia',
    'git': 'tecnologia',
    'devops': 'tecnologia'
};

function addCuratedData(dataset) {
    for (const [sourceSubj, diffs] of Object.entries(dataset)) {
        const targetSubj = mapping[sourceSubj];
        if (!targetSubj) {
            console.log(`Skipping subject from JSON: ${sourceSubj} (no mapping defined)`);
            continue;
        }
        for (const [diff, questions] of Object.entries(diffs)) {
            // Map diff to closest difficulty supported: easy, medium, hard, insane, impossible
            let targetDiff = diff.toLowerCase();
            if (targetDiff === 'extreme') targetDiff = 'insane';
            if (!difficulties.includes(targetDiff)) {
                targetDiff = 'medium'; // fallback
            }

            questions.forEach(item => {
                const questionText = item.question || item.q;
                if (!questionText) return;

                let correctAns = '';
                let distractors = [];

                if (item.options && Array.isArray(item.options)) {
                    const ansIdx = typeof item.answer === 'number' ? item.answer : 0;
                    correctAns = item.options[ansIdx];
                    distractors = item.options.filter((_, idx) => idx !== ansIdx);
                } else if (item.a && Array.isArray(item.d)) {
                    correctAns = item.a;
                    distractors = item.d;
                } else {
                    return; // skip if invalid
                }

                if (!correctAns) return;

                const key = getKey(targetSubj, targetDiff, questionText);
                if (!seen.has(key)) {
                    seen.add(key);
                    finalSubjects[targetSubj][targetDiff].push({
                        q: questionText,
                        a: correctAns,
                        d: distractors,
                        explanation: item.explanation || '',
                        hint: item.hint || '',
                        concept: item.concept || 'BNCC-CORE'
                    });
                }
            });
        }
    }
}

addCuratedData(expandedData);
addCuratedData(knowledgeData);
console.log(`Populated curated questions. Total unique questions overall: ${seen.size}`);

// 7. Write to onyx_database.db (valid JSON)
const outputPath = 'e:\\documentos\\GitHub\\GitHub\\avaliiador\\avalador\\data\\onyx_database.db';
const outputJson = {
    subjects: finalSubjects
};
fs.writeFileSync(outputPath, JSON.stringify(outputJson, null, 2), 'utf8');
console.log(`Successfully wrote database seed file to ${outputPath}`);

// 8. Print stats
console.log('\n=== SEED DATABASE STATS ===');
let grandTotal = 0;
subjects.forEach(subj => {
    let subjTotal = 0;
    const diffBreakdown = difficulties.map(diff => {
        const count = finalSubjects[subj][diff].length;
        subjTotal += count;
        grandTotal += count;
        return `${diff}:${count}`;
    }).join(', ');
    console.log(`${subj}: total ${subjTotal} (${diffBreakdown})`);
});
console.log(`\nGrand Total: ${grandTotal} questions across 32 subjects!`);
