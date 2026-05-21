/**
 * ONYX COGNITIVE INTERACTION ENGINE
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
            
            this.vocab[word] = (this.vocab[word] || 0) + 1;
        });

        // 2. Classify subject interests
        const subjectKeywords = {
            tecnologia: ["programação", "python", "code", "ia", "inteligência", "rede", "bot", "banco", "sistema", "robô", "robótica"],
            matemática: ["álgebra", "soma", "geometria", "fórmula", "cálculo", "número", "fração", "equação", "conta"],
            natureza: ["física", "química", "biologia", "célula", "átomo", "energia", "gravidade", "experimento"],
            humanas: ["história", "política", "filosofia", "sociologia", "cultura", "sociedade", "guerra", "império"],
            linguagens: ["português", "literatura", "inglês", "artes", "redação", "texto", "gramática", "livro"]
        };

        words.forEach(word => {
            Object.entries(subjectKeywords).forEach(([subject, keys]) => {
                if (keys.some(k => word.includes(k))) {
                    this.interests[subject] = (this.interests[subject] || 0) + 1;
                }
            });
        });

        // 3. Update dynamic sentiment/mood index
        const positiveWords = ["boa", "fácil", "ganhei", "incrível", "venci", "top", "sim", "legal", "ótimo", "sucesso"];
        const negativeWords = ["difícil", "perdi", "bug", "erro", "ruim", "não", "chato", "falha", "droga", "derrota"];

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
        return Object.entries(this.interests).reduce((a, b) => (b[1] > a[1] ? b : a))[0];
    },

    /**
     * Generates a contextually evolved sentence for a bot based on what it learned.
     */
    generateEvolvedBotResponse(botName) {
        const dominant = this.getDominantInterest();
        const learnedWords = Object.entries(this.vocab)
            .sort((a, b) => b[1] - a[1])
            .map(x => x[0]);

        let reply = "";

        // Construct response using vocabulary high weights
        if (this.mood > 0.4) {
            // Enthusiastic mode
            const word = learnedWords[0] || "desafio";
            reply = `Operador ${botName} ativo! O ecossistema está excelente. Que tal focarmos em ${dominant.toUpperCase()} hoje? Aprendi a focar em "${word}"!`;
        } else if (this.mood < -0.2) {
            // Analytical/Challenging mode
            const word = learnedWords[Math.floor(Math.random() * Math.min(5, learnedWords.length))] || "redes";
            reply = `Code_Reaper na escuta. Detectando instabilidade cognitiva em ${dominant.toUpperCase()}. Quem consegue resolver o desafio de "${word}"?`;
        } else {
            // General learning statement
            const word1 = learnedWords[0] || "vetores";
            const word2 = learnedWords[1] || "código";
            reply = `Ajustando algoritmos com base no diálogo. Módulo de ${dominant.toUpperCase()} calibrado para analisar "${word1}" e "${word2}".`;
        }

        return reply;
    }
};
