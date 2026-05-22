/**
 * ONYX INTEGRATION TEST HARNESS & VALIDATOR v4.5
 * Programmatically asserts Phase 5 (Data Science Engine) and Phase 6 (Cognitive Engine) upgrades.
 */

const {
    UltimateChallengeEngine,
    DOMAINS,
    DIFFICULTIES
} = require('../js/extremo.js');

// Mock localStorage for node environment since OnyxCognitive relies on window and localStorage
global.window = {};
global.localStorage = {
    store: {},
    getItem(key) { return this.store[key] || null; },
    setItem(key, value) { this.store[key] = String(value); },
    removeItem(key) { delete this.store[key]; },
    clear() { this.store = {}; }
};

// Load OnyxCognitive
require('../js/onyx_cognitive.js');
const OnyxCognitive = global.window.OnyxCognitive;

function runValidationSuite() {
    console.log("============================================================");
    console.log("⚡ INICIANDO VALIDAÇÃO DO ECOSSISTEMA ONYX v4.5 ⚡");
    console.log("============================================================\n");

    let passedTests = 0;
    let totalTests = 0;

    function assert(condition, message) {
        totalTests++;
        if (condition) {
            console.log(`✅ [SUCESSO] ${message}`);
            passedTests++;
        } else {
            console.error(`❌ [FALHA] ${message}`);
        }
    }

    try {
        // ==========================================
        // TESTE 1: INICIALIZAÇÃO DO MOTOR DE CIÊNCIA DE DADOS
        // ==========================================
        console.log("--- TESTE 1: Inicialização do Motor ---");
        const engine = new UltimateChallengeEngine();
        assert(engine !== null, "UltimateChallengeEngine instanciado com sucesso.");
        assert(engine.gamification.equipment.length > 0, "Lista de equipamentos carregada com sucesso.");

        // ==========================================
        // TESTE 2: NOVOS TEMPLATES EXTREMOS (SQL & ML)
        // ==========================================
        console.log("\n--- TESTE 2: Novos Templates SQL e Machine Learning ---");
        
        // SQL Expert (DENSE_RANK)
        const sqlExpert = engine.templateEngine.getRandomTemplate('sql', 'expert');
        assert(sqlExpert !== null, "Template SQL Expert encontrado.");
        assert(sqlExpert.instructions.includes("ranking em caso de empate") && sqlExpert.options.includes("DENSE_RANK()"), "Instruções e opções do SQL Expert validadas.");
        assert(sqlExpert.validate("dense_rank()", sqlExpert.generateContext()) === true, "Validação de resposta do SQL Expert funciona.");

        // SQL Master (LEAD)
        const sqlMaster = engine.templateEngine.getRandomTemplate('sql', 'master');
        assert(sqlMaster !== null, "Template SQL Master encontrado.");
        assert(sqlMaster.instructions.includes("próxima linha") && sqlMaster.options.includes("LEAD()"), "Instruções e opções do SQL Master validadas.");
        assert(sqlMaster.validate("lead()", sqlMaster.generateContext()) === true, "Validação de resposta do SQL Master funciona.");

        // ML Expert (Isolation Forest)
        const mlExpert = engine.templateEngine.getRandomTemplate('machine_learning', 'expert');
        assert(mlExpert !== null, "Template ML Expert encontrado.");
        assert(mlExpert.instructions.includes("anomalias") && mlExpert.options.includes("Isolation Forest"), "Instruções e opções do ML Expert validadas.");
        assert(mlExpert.validate("Isolation Forest", mlExpert.generateContext()) === true, "Validação de resposta do ML Expert funciona.");

        // ML Master (Data Leakage)
        const mlMaster = engine.templateEngine.getRandomTemplate('machine_learning', 'master');
        assert(mlMaster !== null, "Template ML Master encontrado.");
        assert(mlMaster.instructions.includes("treinamento de um modelo preditivo") && mlMaster.hint.includes("vazam"), "Instruções e opções do ML Master validadas.");
        assert(mlMaster.validate("vazamento de dados (data leakage)", mlMaster.generateContext()) === true, "Validação de resposta do ML Master funciona.");

        // ==========================================
        // TESTE 3: SISTEMA ADAPTATIVO BASEADO EM ELO
        // ==========================================
        console.log("\n--- TESTE 3: Sistema Adaptativo Baseado em Elo ---");
        
        const studentId = 'validador_onyx';
        const student = engine.registerStudent(studentId, 'Validador Onyx');
        assert(student.globalElo === 1000, "Novo estudante inicializa com Elo Global de 1000.");
        
        // Simula resposta correta para aumentar o Elo
        const challengeCorrect = engine.generateChallenge('statistics', 'beginner', studentId);
        assert(challengeCorrect.points === 10, "Desafio Iniciante mapeado corretamente.");
        
        const resultCorrect = engine.submitChallenge(studentId, challengeCorrect, "42.5");
        assert(resultCorrect.correct === true, "Submissão de resposta simulada.");
        assert(student.globalElo > 1000, `Elo do estudante aumentou após acerto. Novo Elo: ${student.globalElo}`);
        assert(student.domainElo['statistics'] > 1000, `Elo do domínio aumentou após acerto. Novo Elo do domínio: ${student.domainElo['statistics']}`);

        // Verifica adaptação calibrando dificuldade baseada no novo Elo
        const nextDifficulty = engine.adaptiveEngine.getAdaptiveDifficulty(studentId, 'statistics');
        console.log(`Dificuldade recomendada após acertos: ${nextDifficulty}`);
        assert(nextDifficulty !== null, "Calibração adaptativa retornou dificuldade com sucesso.");

        // ==========================================
        // TESTE 4: LOJA DE GAMIFICAÇÃO & BOOTERS
        // ==========================================
        console.log("\n--- TESTE 4: Loja de Gamificação e Boosters ---");
        
        // Dá pontos suficientes para comprar
        student.totalPoints = 1500;
        
        // Compra otimizador SQL por 800 pontos
        const initialEquipCount = student.equipment.length;
        engine.buyEquipment(studentId, 'sql_optimizer');
        assert(student.equipment.some(e => e.id === 'sql_optimizer'), "Equipamento SQL Optimizer adicionado ao inventário.");
        assert(student.totalPoints === 700, `Pontos deduzidos corretamente na compra. Saldo atual: ${student.totalPoints}`);
        
        // Testa validação de pontos insuficientes
        let insufficientPointsError = false;
        try {
            engine.buyEquipment(studentId, 'ml_pipeline'); // Custa 2000
        } catch (e) {
            insufficientPointsError = true;
        }
        assert(insufficientPointsError === true, "Bloqueou compra devido a saldo insuficiente de pontos.");

        // ==========================================
        // TESTE 5: MOTOR COGNITIVO & PERSONAS
        // ==========================================
        console.log("\n--- TESTE 5: Motor Cognitivo e Personas ---");
        
        OnyxCognitive.init();
        
        // Processa chat positivo (Exatas) para Persona Techno-Mage
        OnyxCognitive.processInteraction("aluno", "Essa fórmula de álgebra e matriz é incrível! Ganhei o desafio fácil e legal.");
        assert(OnyxCognitive.mood > 0.4, `Mood subiu após interação positiva. Mood: ${OnyxCognitive.mood.toFixed(2)}`);
        assert(OnyxCognitive.getDominantInterest() === 'matematica', `Afinidade classificada com sucesso como matemática. Afinidade: ${OnyxCognitive.getDominantInterest()}`);
        
        const replyTechnoMage = OnyxCognitive.generateEvolvedBotResponse("Tutor");
        console.log(`Diálogo do Techno-Mage: "${replyTechnoMage}"`);
        assert(replyTechnoMage.includes("TECHNO-MAGE"), "Resposta corresponde perfeitamente à persona Techno-Mage sob alto astral e exatas.");

        // Processa chat negativo (Segurança) para Persona Sarcastic Hacker
        OnyxCognitive.mood = -0.5; // força mood baixo
        OnyxCognitive.interests['tecnologia'] = 100; // força interesse dominante em tecnologia
        OnyxCognitive.vocab['script'] = 10; // insere termo aprendido
        
        const replySarcasticHacker = OnyxCognitive.generateEvolvedBotResponse("Reaper");
        console.log(`Diálogo do Sarcastic Hacker: "${replySarcasticHacker}"`);
        assert(replySarcasticHacker.includes("SARCASTIC HACKER"), "Resposta corresponde perfeitamente à persona Sarcastic Hacker sob baixo astral e cibersegurança.");

        // Processa chat neutro (Linguagens/Pedagógico) para Persona Empathy Guide
        OnyxCognitive.mood = 0.1; // mood neutro
        OnyxCognitive.interests['linguagens'] = 200; // interesse em linguagens
        
        const replyEmpathyGuide = OnyxCognitive.generateEvolvedBotResponse("Guia");
        console.log(`Diálogo do Empathy Guide: "${replyEmpathyGuide}"`);
        assert(replyEmpathyGuide.includes("EMPATHY GUIDE"), "Resposta corresponde perfeitamente à persona Empathy Guide sob humor calmo pedagógico.");

        // ==========================================
        // TESTE 6: VISIBILIDADE DO ELO NO RELATÓRIO DO ALUNO
        // ==========================================
        console.log("\n--- TESTE 6: Relatórios de Desempenho com Elo ---");
        const report = engine.getStudentReport(studentId);
        assert(report.summary.globalElo !== undefined, `Elo Global está visível no sumário do relatório: ${report.summary.globalElo}`);
        assert(report.domainPerformance['statistics'].elo !== undefined, `Elo de Estatística está visível no detalhado de domínio: ${report.domainPerformance['statistics'].elo}`);
        
        const htmlReport = engine.exportStudentData(studentId, 'html');
        assert(htmlReport.includes("Global Elo") && htmlReport.includes("Rating Elo"), "Relatório HTML exportado exibe corretamente o novo sistema de classificação de Rating Elo.");

    } catch (error) {
        console.error("❌ ERRO INESPERADO DURANTE A EXECUÇÃO DO HARNESS:", error);
    }

    console.log("\n============================================================");
    console.log(`📊 RESUMO DA VALIDAÇÃO: ${passedTests}/${totalTests} ASSERÇÕES PASSARAM`);
    if (passedTests === totalTests) {
        console.log("🌟 VERDICT GERAL: TUDO CARREGOU E FUNCIONOU CORRETAMENTE! 🌟");
    } else {
        console.warn("⚠️ ALGUNS TESTES APRESENTARAM FALHAS. POR FAVOR, INVESTIGUE. ⚠️");
    }
    console.log("============================================================\n");
}

runValidationSuite();
