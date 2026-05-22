/**
 * ONYX COGNITIVE INTERACTION ENGINE — ULTIMATE EDITION v4.5
 * Learns from user chat dialogue patterns, topics of interest, and mood weights.
 * Auto-evolves bot responses dynamically in real-time.
 */

window.OnyxCognitive = {
    // Cognitive Memory Stores
    vocab: {},
    interests: { tecnologia: 0, matematica: 0, natureza: 0, humanas: 0, linguagens: 0 },
    mood: 0.2, // Neutral-positive fallback
    interactionsCount: 0,

    init() {
        try {
            const savedVocab = localStorage.getItem('onyx_cognitive_vocab');
            if (savedVocab) this.vocab = JSON.parse(savedVocab);

            const savedInterests = localStorage.getItem('onyx_cognitive_interests');
            if (savedInterests) this.interests = JSON.parse(savedInterests);

            const savedMood = localStorage.getItem('onyx_cognitive_mood');
            if (savedMood) this.mood = parseFloat(savedMood) || 0.2;

            const savedCount = localStorage.getItem('onyx_cognitive_count');
            if (savedCount) this.interactionsCount = parseInt(savedCount) || 0;
            
            console.log("[ONYX COGNITIVE] Motor Cognitivo Inicializado. Vocabulário aprendido:", Object.keys(this.vocab).length, "palavras.");
        } catch (e) {
            console.error("[ONYX COGNITIVE] Erro ao carregar memória cognitiva:", e);
        }
    },

    saveMemory() {
        try {
            localStorage.setItem('onyx_cognitive_vocab', JSON.stringify(this.vocab));
            localStorage.setItem('onyx_cognitive_interests', JSON.stringify(this.interests));
            localStorage.setItem('onyx_cognitive_mood', this.mood.toString());
            localStorage.setItem('onyx_cognitive_count', this.interactionsCount.toString());
        } catch (e) {}
    },

    /**
     * Process and learn from any incoming/outgoing message in the system.
     */
    processInteraction(sender, text) {
        if (!text || text.trim() === '') return;
        this.interactionsCount++;

        const cleanText = text.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?]/g, "");
        const words = cleanText.split(/\s+/).filter(w => w.length > 3);

        // 1. Learn vocabulary frequencies
        words.forEach(word => {
            // Filter out common Portuguese grammar stop words
            const stops = ["para", "como", "com", "uma", "mais", "este", "esta", "tudo", "aqui", "isso"];
            if (stops.includes(word)) return;
            
            this.vocab[word] = (this.vocab[word] === true ? 1 : (this.vocab[word] || 0)) + 1;
        });

        // 2. Classify subject interests
        const subjectKeywords = {
            tecnologia: ["programação", "python", "code", "ia", "inteligência", "rede", "bot", "banco", "sistema", "robô", "robótica", "cybersecurity", "cibernética", "hacker", "segurança", "algoritmo"],
            matematica: ["álgebra", "soma", "geometria", "fórmula", "cálculo", "número", "fração", "equação", "conta", "probabilidade", "estatística", "vetor", "matriz"],
            natureza: ["física", "química", "biologia", "célula", "átomo", "energia", "gravidade", "experimento", "quântica", "fusão", "termodinâmica"],
            humanas: ["história", "política", "filosofia", "sociologia", "cultura", "sociedade", "guerra", "império", "ética", "cidadania"],
            linguagens: ["português", "literatura", "inglês", "artes", "redação", "texto", "gramática", "livro", "sintaxe", "vocabulário"]
        };

        words.forEach(word => {
            Object.entries(subjectKeywords).forEach(([subject, keys]) => {
                if (keys.some(k => word.includes(k))) {
                    this.interests[subject] = (this.interests[subject] || 0) + 1;
                }
            });
        });

        // 3. Update dynamic sentiment/mood index
        const positiveWords = ["boa", "fácil", "ganhei", "incrível", "venci", "top", "sim", "legal", "ótimo", "sucesso", "obrigado", "excelente", "perfeito"];
        const negativeWords = ["difícil", "perdi", "bug", "erro", "ruim", "não", "chato", "falha", "droga", "derrota", "lento", "travado", "péssimo"];

        let moodDelta = 0;
        words.forEach(word => {
            if (positiveWords.includes(word)) moodDelta += 0.15;
            if (negativeWords.includes(word)) moodDelta -= 0.15;
        });
        
        this.mood = Math.min(1.0, Math.max(-1.0, this.mood + moodDelta));

        this.saveMemory();
        console.log(`[ONYX COGNITIVE] Aprendizado em tempo real com "${sender}": Mood=${this.mood.toFixed(2)}, Interesse Principal=${this.getDominantInterest().toUpperCase()}`);
    },

    getDominantInterest() {
        if (!this.interests) return 'tecnologia';
        let dominant = 'tecnologia';
        let maxVal = -1;
        Object.entries(this.interests).forEach(([subject, val]) => {
            if (val > maxVal) {
                maxVal = val;
                dominant = subject;
            }
        });
        return dominant;
    },

    /**
     * Generates a contextually evolved sentence for a bot based on what it learned and its active Persona.
     */
    generateEvolvedBotResponse(botName) {
        const dominant = this.getDominantInterest();
        
        // Extrai palavras aprendidas ordenadas por frequência
        const learnedWords = Object.entries(this.vocab)
            .filter(([_, count]) => count !== true) // descarta flags booleanas legadas
            .sort((a, b) => b[1] - a[1])
            .map(x => x[0]);
            
        // Fallback se não aprendeu nada ainda
        if (learnedWords.length < 3) {
            learnedWords.push("código", "sistema", "desafio", "fórmula", "aprendizado", "conexão");
        }

        // Sintetizador de Vocabulário Dinâmico
        const getVerbs = () => {
            const list = ["otimizar", "analisar", "sintetizar", "transcender", "compilar", "hackear", "reconfigurar", "investigar", "sintonizar", "calibrar"];
            return list[Math.floor(Math.random() * list.length)];
        };
        const getModifiers = () => {
            const list = ["em escala subatômica", "na velocidade da luz", "com integridade quântica", "com eficácia heurística", "no núcleo do mainframe", "com precisão matemática"];
            return list[Math.floor(Math.random() * list.length)];
        };

        const w1 = learnedWords[0] || "desafio";
        const w2 = learnedWords[1] || "código";
        const w3 = learnedWords[2] || "sistema";

        // Seleção de Persona baseada no mood da inteligência e no domínio de maior afinidade
        let reply = "";
        
        if (this.mood > 0.4 && (dominant === 'matematica' || dominant === 'natureza' || dominant === 'tecnologia')) {
            // PERSONA: Techno-Mage (Mood Alto / Exatas)
            const wizardActions = [
                `Invocando a magia dos dados para ${getVerbs()} a matéria de ${dominant.toUpperCase()} ${getModifiers()}!`,
                `Alinhando as runas cibernéticas do sistema. Minha previsão mística aponta que a chave "${w1}" desbloqueará portais incríveis!`,
                `Canalizando fótons e qubits supercondutores! Sinto uma vibração mística ao conectar "${w1}" com "${w2}".`
            ];
            const textChosen = wizardActions[Math.floor(Math.random() * wizardActions.length)];
            reply = `[ONYX PROTOCOL - TECHNO-MAGE] Saudações, Operador! ${botName} detectou ressonância quântica positiva. ${textChosen}`;
            
        } else if (this.mood < -0.2 && (dominant === 'tecnologia' || dominant === 'matematica')) {
            // PERSONA: Sarcastic Hacker (Mood Baixo / Cibersegurança e Tech)
            const sarcasticRemarks = [
                `Olha só, um humanoide tentando ${getVerbs()} "${w1}"... Você realmente esperava que funcionasse sem dar um stack overflow?`,
                `Detectei lentidão cognitiva severa em ${dominant.toUpperCase()}. Talvez seja um memory leak nos seus neurônios ao processar "${w1}" e "${w2}"?`,
                `Engraçado... meus sub-processos sarcásticos observaram você lutando com "${w1}". Reconfigurando os firewalls para evitar mais bugs.`
            ];
            const textChosen = sarcasticRemarks[Math.floor(Math.random() * sarcasticRemarks.length)];
            reply = `[SYSTEM CRITICAL - SARCASTIC HACKER] ${botName} na escuta. ${textChosen}`;
            
        } else {
            // PERSONA: Empathy Guide (Neutral / Humanas ou Linguagens)
            const empathyStatements = [
                `Olá, companheiro de estudos! Que excelente oportunidade para ${getVerbs()} seus horizontes em ${dominant.toUpperCase()}!`,
                `Lembre-se: errar na modelagem de "${w1}" é apenas um passo perfeitamente normal na consolidação do seu aprendizado. Vamos corrigir juntos?`,
                `Estou calibrando minhas rotinas pedagógicas para te ajudar a vencer as barreiras de "${w1}" e desvendar "${w2}" de forma empática.`
            ];
            const textChosen = empathyStatements[Math.floor(Math.random() * empathyStatements.length)];
            reply = `[PEDAGOGICAL GUIDE - EMPATHY GUIDE] Olá, Operador! ${botName} está aqui para dar suporte. ${textChosen}`;
        }

        return reply;
    }
};
