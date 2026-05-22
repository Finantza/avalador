/**
 * ONYX ENGINES 4.0 - HYBRID HEURISTIC ENGINE
 * Ported logic from assessment_engine.py (Python) for advanced profiling.
 */

window.OnyxEngines = {
    // Ported Heuristic: Adaptive performance weight
    // Ported Heuristic: Adaptive performance weight with Standard Deviation, Streaks, and Tutor scaling
    calculateHeuristicScore(correct, total, timeSpent, difficulty, options = {}) {
        const accuracy = (correct / total);
        const diffWeight = { easy: 1, medium: 1.5, hard: 2.2, insane: 3.5, impossible: 5 }[difficulty] || 1;
        
        // 1. Time Bonus calculation
        let timeBonus = Math.max(0, (200 - timeSpent) / 200); // Max 200s per mission
        
        // 2. Velocity Consistency (Standard Deviation of speed per question)
        let consistencyBonus = 0;
        const historyTimes = options.historyTimes || [];
        if (historyTimes.length > 1) {
            const meanTime = historyTimes.reduce((sum, t) => sum + t, 0) / historyTimes.length;
            const variance = historyTimes.reduce((sum, t) => sum + Math.pow(t - meanTime, 2), 0) / historyTimes.length;
            const stdDev = Math.sqrt(variance);
            
            // Standard Deviation adaptation: low deviation at fast speeds gets a consistency bonus
            if (stdDev < 4.0 && meanTime < 10.0) {
                // Highly consistent and fast!
                consistencyBonus = Math.max(0, 15 - (stdDev * 2.5)); // up to +15 points
            } else if (stdDev < 2.0) {
                // Extremely consistent speed
                consistencyBonus = 10;
            }
        }
        
        // 3. Streak Milestones Multiplier
        let streakMultiplier = 1.0;
        const maxStreak = options.maxStreak || options.streak || 0;
        if (maxStreak >= 10) {
            streakMultiplier = 2.0; // 10+ streak
        } else if (maxStreak >= 5) {
            streakMultiplier = 1.5; // 5+ streak
        } else if (maxStreak >= 3) {
            streakMultiplier = 1.2; // 3+ streak
        }
        
        // 4. Tutor-Assistance Score Scaling
        let tutorScale = 1.0;
        const tutorConsultedCount = options.tutorConsultedCount || 0;
        if (tutorConsultedCount > 0) {
            // Deduct proportional to help frequency: max 15% penalty
            tutorScale = Math.max(0.85, 1.0 - (tutorConsultedCount / total) * 0.15);
        } else if (options.tutorConsulted) {
            tutorScale = 0.90; // flat 10% penalty if tutor was consulted
        }

        // Final Upgraded Heuristic Score
        const baseCalculated = (accuracy * 100) * diffWeight * streakMultiplier;
        const efficiencyPoints = (timeBonus * 20) + consistencyBonus;
        
        const finalScore = Math.floor((baseCalculated + efficiencyPoints) * tutorScale);
        return Math.max(0, finalScore);
    },

    // Profiling Engine: Analyzes historical data to find weaknesses, cognitive style and XP projections
    async generateProfileInsight(userId) {
        const history = await window.OnyxCore.DB.getHistory(userId);
        
        // Subject to BNCC Area mapping
        const subjectToCat = {
            portugues: 'linguagens', literatura: 'linguagens', ingles: 'linguagens', artes: 'linguagens', educacao_fisica: 'linguagens',
            algebra: 'matematica', geometria: 'matematica', estatistica: 'matematica', matematica_financeira: 'matematica',
            fisica: 'natureza', quimica: 'natureza', biologia: 'natureza',
            historia: 'humanas', geografia: 'humanas', filosofia: 'humanas', sociologia: 'humanas',
            tecnologia: 'itinerarios', programacao: 'itinerarios', robotica: 'itinerarios', empreendedorismo: 'itinerarios',
            ciencia_de_dados: 'itinerarios', inteligencia_artificial: 'itinerarios', educacao_financeira: 'itinerarios', marketing_digital: 'itinerarios',
            desenvolvimento_jogos: 'itinerarios', seguranca_informacao: 'itinerarios', design_digital: 'itinerarios', producao_audiovisual: 'itinerarios',
            biblioteca_digital: 'extras', laboratorio_virtual: 'extras', projeto_vida: 'extras', inclusao_acessibilidade: 'extras'
        };

        const defaultProfile = {
            status: 'INSUFFICIENT_DATA',
            recommendation: 'Realize sua primeira missão de treinamento para calibrar os sensores cognitivos da BNCC.',
            accuracyAvg: 0,
            weakness: 'N/A',
            trend: 'ESTÁVEL',
            trendColor: 'var(--primary)',
            dropoutRisk: 'BAIXO',
            dropoutRiskColor: 'var(--success)',
            engagementLevel: 20,
            cognitiveStyle: 'Novato',
            cognitiveStyleDesc: 'Dados insuficientes para mapear seu estilo cognitivo.',
            xpEstimateText: 'Complete missões para calcular projeção de progresso.',
            competenciesMap: { linguagens: 0, matematica: 0, natureza: 0, humanas: 0, itinerarios: 0, extras: 0 }
        };

        if (history.length < 1) {
            return defaultProfile;
        }

        const statsMap = {};
        const catMap = { linguagens: { tot: 0, corr: 0 }, matematica: { tot: 0, corr: 0 }, natureza: { tot: 0, corr: 0 }, humanas: { tot: 0, corr: 0 }, itinerarios: { tot: 0, corr: 0 }, extras: { tot: 0, corr: 0 } };

        let totalTimeSpent = 0;
        let totalTimesCount = 0;
        let totalTutorConsulted = 0;

        history.forEach(h => {
            const sub = h.subject || 'portugues';
            const cat = subjectToCat[sub] || 'linguagens';
            
            if (!statsMap[sub]) statsMap[sub] = { total: 0, correct: 0 };
            statsMap[sub].total += 10;
            statsMap[sub].correct += h.score;

            catMap[cat].tot += 10;
            catMap[cat].corr += h.score;

            // Extra metrics if saved
            if (h.timeSpent) {
                totalTimeSpent += h.timeSpent;
                totalTimesCount += 10; // 10 questions per mission
            }
            if (h.tutorConsultedCount) {
                totalTutorConsulted += h.tutorConsultedCount;
            }
        });

        const profiles = Object.entries(statsMap).map(([subject, data]) => {
            const overallAccuracy = (data.correct / data.total) * 100;
            return { subject, accuracy: overallAccuracy };
        });

        const weakness = profiles.sort((a, b) => a.accuracy - b.accuracy)[0];
        const accuracyAvg = parseFloat((profiles.reduce((acc, p) => acc + p.accuracy, 0) / profiles.length).toFixed(1));
        
        // Calculate Category Averages
        const competenciesMap = {};
        Object.entries(catMap).forEach(([cat, data]) => {
            competenciesMap[cat] = data.tot > 0 ? Math.round((data.corr / data.tot) * 100) : 0;
        });

        // Trend Analysis
        const globalRecent = history.slice(-5);
        const globalRecentAvg = (globalRecent.reduce((acc, h) => acc + h.score, 0) / (globalRecent.length * 10)) * 100;
        
        let trend = 'ESTÁVEL';
        let trendColor = 'var(--primary)';
        if (globalRecentAvg > accuracyAvg + 3) { trend = 'EM ASCENSÃO'; trendColor = 'var(--success)'; }
        else if (globalRecentAvg < accuracyAvg - 3) { trend = 'EM DECLÍNIO'; trendColor = 'var(--error)'; }

        // AI Predictive Analytics: Dropout Risk
        let dropoutRisk = 'BAIXO';
        let dropoutRiskColor = 'var(--success)';
        if (accuracyAvg < 55) {
            dropoutRisk = 'ALTO';
            dropoutRiskColor = 'var(--error)';
        } else if (accuracyAvg < 70) {
            dropoutRisk = 'MÉDIO';
            dropoutRiskColor = 'var(--accent)';
        }

        // Engagement Index (0 - 100)
        const engagementLevel = Math.min(100, Math.round((history.length * 15) + (accuracyAvg * 0.3)));

        // Cognitive Style Classifier
        // Default average speed per question (approx. 10s if not stored)
        const avgTimePerQuestion = totalTimesCount > 0 ? (totalTimeSpent / totalTimesCount) : 10.0;
        let cognitiveStyle = 'Aprendiz Metódico';
        let cognitiveStyleDesc = 'Respostas ponderadas com taxa de acerto equilibrada.';

        if (accuracyAvg >= 80) {
            if (avgTimePerQuestion < 7.0) {
                cognitiveStyle = 'Speedrunner';
                cognitiveStyleDesc = 'Reflexos cognitivos ultra-rápidos com altíssima precisão.';
            } else if (avgTimePerQuestion >= 7.0 && avgTimePerQuestion < 13.0) {
                cognitiveStyle = 'Perfeccionista';
                cognitiveStyleDesc = 'Cadência ideal e foco absoluto em precisão perfeita.';
            } else {
                cognitiveStyle = 'Analista Preciso';
                cognitiveStyleDesc = 'Lento e cirúrgico. Estudo de alternativas com alto rigor analítico.';
            }
        } else {
            if (avgTimePerQuestion < 7.0) {
                cognitiveStyle = 'Explorador Impulsivo';
                cognitiveStyleDesc = 'Respostas apressadas. Requer foco em leitura atenta dos enunciados.';
            } else {
                cognitiveStyle = 'Aprendiz Metódico';
                cognitiveStyleDesc = 'Respostas ponderadas. Ótimo progresso em ritmo de consolidação.';
            }
        }

        // XP Prediction Projection
        let xpEstimateText = 'Sensores calibrando próximo nível...';
        try {
            const userStats = await window.OnyxCore.DB.getUser(userId);
            if (userStats) {
                const currentLevel = userStats.level || 1;
                const currentXP = userStats.xp || 0;
                const nextXP = currentLevel * 100;
                const remainingXP = nextXP - currentXP;
                
                // Calculate average XP per history mission
                const validXPMissions = history.filter(h => !h.failed);
                const avgXPPerMission = validXPMissions.length > 0
                    ? validXPMissions.reduce((sum, h) => sum + (h.xpGained || 0), 0) / validXPMissions.length
                    : 45; // fallback
                
                const missionsNeeded = Math.ceil(remainingXP / Math.max(10, avgXPPerMission));
                const estTimeSeconds = missionsNeeded * Math.max(30, avgTimePerQuestion * 10);
                const estTimeText = estTimeSeconds > 60
                    ? `${Math.round(estTimeSeconds / 60)} min`
                    : `${Math.round(estTimeSeconds)}s`;
                
                xpEstimateText = `Faltam aproximadamente ${missionsNeeded} missões (${estTimeText} de foco) para evoluir ao LVL ${currentLevel + 1}.`;
            }
        } catch(e) {}

        return {
            status: 'OPERATIONAL',
            accuracyAvg,
            weakness: weakness.subject.toUpperCase(),
            trend,
            trendColor,
            dropoutRisk,
            dropoutRiskColor,
            engagementLevel,
            competenciesMap,
            cognitiveStyle,
            cognitiveStyleDesc,
            xpEstimateText,
            recommendation: `Sensores indicam atenção especial ao domínio de ${weakness.subject.toUpperCase()}. Sua curva cognitiva está ${trend}. Estilo: ${cognitiveStyle}.`
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

    normalizeQuestionText(q) {
        if (!q) return "";
        return String(q).replace(/^\[[^\]]+\d+\]\s*/gi, '').trim().toLowerCase();
    },

    DataBank: null, // Loaded from onyx_database.js

    CloudSyncEngine: {
        _decodeHTML(html) {
            const txt = document.createElement('textarea');
            txt.innerHTML = html;
            return txt.value;
        },
        async _fetchWithRetry(url, retries = 3, delay = 1000) {
            for (let i = 0; i < retries; i++) {
                try {
                    const response = await fetch(url);
                    if (response.status === 429) {
                        console.warn(`[CLOUD_SYNC] Rate limit (429) detectado. Re-agendando tentativa ${i + 1}/${retries} em ${delay * 2}ms...`);
                        await new Promise(r => setTimeout(r, delay * 2));
                        continue;
                    }
                    if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
                    const data = await response.json();
                    
                    if (data.response_code === 5) {
                        console.warn(`[CLOUD_SYNC] OpenTDB Rate Limit (código 5) detectado. Re-agendando tentativa ${i + 1}/${retries} em ${delay * 2}ms...`);
                        await new Promise(r => setTimeout(r, delay * 2));
                        continue;
                    }
                    return data;
                } catch (err) {
                    if (i === retries - 1) throw err;
                    console.warn(`[CLOUD_SYNC] Falha na conexão. Tentando novamente em ${delay}ms...`, err);
                    await new Promise(r => setTimeout(r, delay));
                    delay *= 2; // exponential backoff
                }
            }
        },
        async syncOpenTDB() {
            const categories = [
                { id: 18, name: 'Computer Science' },
                { id: 19, name: 'Mathematics' },
                { id: 22, name: 'Geography' },
                { id: 17, name: 'Science & Nature' }
            ];
            
            let totalSynced = 0;
            const newQuestions = [];
            
            for (const cat of categories) {
                try {
                    // Fetch 5 questions per category to avoid hitting heavy rate limits
                    const url = `https://opentdb.com/api.php?amount=5&category=${cat.id}&type=multiple`;
                    const data = await this._fetchWithRetry(url);
                    
                    if (data && data.response_code === 0 && data.results) {
                        data.results.forEach(item => {
                            const diff = item.difficulty; // 'easy', 'medium', 'hard'
                            const qText = this._decodeHTML(item.question);
                            const correctAns = this._decodeHTML(item.correct_answer);
                            const options = item.incorrect_answers.map(opt => this._decodeHTML(opt));
                            
                            // Map to Onyx disciplines
                            let targetSubject = 'portugues'; // fallback
                            if (cat.id === 18) {
                                targetSubject = 'seguranca_informacao'; // CS -> Information Security
                            } else if (cat.id === 19) {
                                const lowerQ = qText.toLowerCase();
                                if (lowerQ.includes('triangle') || lowerQ.includes('geometry') || lowerQ.includes('angle') || lowerQ.includes('area') || lowerQ.includes('square')) {
                                    targetSubject = 'geometria';
                                } else {
                                    targetSubject = 'algebra';
                                }
                            } else if (cat.id === 22) {
                                targetSubject = 'geografia';
                            } else if (cat.id === 17) {
                                const lowerQ = qText.toLowerCase();
                                if (lowerQ.includes('chemical') || lowerQ.includes('atom') || lowerQ.includes('element') || lowerQ.includes('acid')) {
                                    targetSubject = 'quimica';
                                } else if (lowerQ.includes('physics') || lowerQ.includes('gravity') || lowerQ.includes('force') || lowerQ.includes('energy')) {
                                    targetSubject = 'fisica';
                                } else {
                                    targetSubject = 'biologia';
                                }
                            }
                            
                            newQuestions.push({
                                subject: targetSubject,
                                difficulty: diff,
                                data: {
                                    q: `[CLOUD_SYNC] ${qText}`,
                                    a: correctAns,
                                    d: options,
                                    concept: `CloudSync - ${cat.name}`,
                                    explanation: `Questão sincronizada da nuvem (OpenTDB) para a competência de ${targetSubject.toUpperCase()}.`,
                                    hint: `Essa questão foi importada via API externa para calibrar seu nível interdisciplinar.`
                                }
                            });
                        });
                    }
                    
                    // Respect API rate limits (wait 2 seconds between categories)
                    await new Promise(r => setTimeout(r, 2000));
                    
                } catch (catErr) {
                    console.error(`[CLOUD_SYNC] Falha ao sincronizar categoria ${cat.name}:`, catErr);
                }
            }
            
            if (newQuestions.length > 0) {
                if (window.OnyxCore) {
                    await window.OnyxCore.DB.saveDynamicQuestions(newQuestions);
                }
                totalSynced = newQuestions.length;
            }
            
            console.log(`[CLOUD_SYNC] Sincronização concluída com sucesso. ${totalSynced} novas questões injetadas.`);
            return totalSynced;
        }
    },

    TrendSensingDatabase: {
        algebra: [
            {
                q: "Um estudo de 2026 estimou que o treinamento de modelos avançados de IA generativa consome energia equivalente a 40 residências brasileiras por ano. A pegada de carbono de um grande Data Center cresce linearmente conforme a quantidade de consultas recebidas. Se o centro emite 0,5 gramas de CO2 por requisição padrão de IA, e a média de requisições por segundo é de 80.000 requisições globais. Em 1 hora de operação contínua, a quantidade total de emissão de carbono de CO2 em toneladas será igual a:",
                a: "144,0 toneladas",
                d: ["14,4 toneladas", "2,4 toneladas", "72,0 toneladas", "288,0 toneladas"],
                explanation: "Pegada de Carbono de IA: 80.000 req/s * 3600s = 288.000.000 req/hora. Multiplicado por 0,5g por req = 144.000.000 gramas = 144.000 kg = 144 toneladas de CO2 por hora.",
                hint: "Lembre-se de converter segundos para horas e gramas para toneladas métricas.",
                concept: "Pegada Ecológica de IA",
                difficulty: "hard"
            },
            {
                q: "No processo de transição para o Hidrogênio Verde (H2V), a eficiência energética de células de eletrólise tem crescido devido aos incentivos globais. Em uma planta de refino experimental em alta na atualidade, obteve-se um rendimento útil de 72% na conversão de energia elétrica de fonte solar em energia química do H2. Se o custo bruto de produção de energia elétrica solar no complexo é de R$ 0,15 por kWh, o valor efetivo aproveitado de energia química acumulada por kWh de hidrogênio gerado custará aproximadamente:",
                a: "R$ 0,21",
                d: ["R$ 0,11", "R$ 0,26", "R$ 0,32", "R$ 0,18"],
                explanation: "Matemática e Rendimento de Hidrogênio Verde: Custo efetivo = Custo bruto / Rendimento = 0,15 / 0,72 = R$ 0,208 (R$ 0,21 aproximado).",
                hint: "Divida o custo unitário bruto pelo percentual de eficiência para achar o valor real.",
                concept: "Transição Energética e Eficiência",
                difficulty: "hard"
            },
            {
                q: "O acúmulo de e-waste (lixo eletrônico) global cresce de forma preocupante. Dados das agências ambientais mundiais indicam que o acúmulo de e-waste no Brasil no ano n (a partir de 2020) é modelado pela expressão E(n) = 1,4 + 0,15n em milhões de toneladas de lixo eletrônico descartado por ano. O acúmulo total estimado descartado anualmente no ano de 2026 (n = 6) será de:",
                a: "2,30 milhões de toneladas",
                d: ["2,15 milhões de toneladas", "1,95 milhões de toneladas", "2,45 milhões de toneladas", "2,60 milhões de toneladas"],
                explanation: "Estimativa de E-Waste: substituindo n = 6 na equação temos E(6) = 1,4 + 0,15 * 6 = 1,4 + 0,90 = 2,30 milhões de toneladas.",
                hint: "Substitua n por 6 (anos decorridos desde 2020) na equação do modelo linear fornecido.",
                concept: "Progressão Linear e E-Waste",
                difficulty: "medium"
            }
        ],
        biologia: [
            {
                q: "A elevação de 1,5°C nas temperaturas médias brasileiras nas últimas décadas acelerou o metabolismo e o ciclo reprodutivo do vetor Aedes aegypti. Biólogos explicam que temperaturas elevadas reduzem o período de incubação extrínseco do vírus da Dengue no mosquito de 14 para 7 dias, estendendo a transmissão geográfica para regiões anteriormente frias no Sul do país. Essa expansão vetorial epidêmica decorre diretamente de qual fenômeno fisiológico ou ecológico ligado às mudanças climáticas?",
                a: "Redução do ciclo de desenvolvimento larval impulsionado por reações químicas metabólicas catalisadas pelo calor",
                d: ["Mutação genética imediata no genoma viral induzida pela radiação infravermelha solar", "Aumento da umidade relativa do ar induzida pela seca no Centro-Oeste", "Seleção natural de mosquitos que respiram exclusivamente gás carbônico de efeito estufa", "Substituição do vírus por bactérias fotossintetizantes oportunistas"],
                explanation: "Fisiologia e Clima: O aumento de temperatura atua como um catalisador térmico para as reações enzimáticas e metabólicas de insetos ectotérmicos como o mosquito, acelerando seu desenvolvimento larval.",
                hint: "Insetos não regulam a própria temperatura corporal. O calor externo dita a velocidade metabólica.",
                concept: "Metabolismo Ectotérmico e Clima",
                difficulty: "hard"
            }
        ],
        quimica: [
            {
                q: "O hidrogênio verde desponta como pilar para a descarbonização industrial. Quimicamente, ele é obtido através da eletrólise da água usando eletricidade limpa de fontes renováveis. Durante a eletrólise ácida da água, ocorre a oxidação de moléculas de água no anodo e a redução de íons no catodo. A equação de meia-reação global que representa o processo catódico (onde o gás hidrogênio é gerado) é:",
                a: "2H⁺ + 2e⁻ → H₂",
                d: ["2H₂O + 2e⁻ → H₂ + 2OH⁻", "O₂ + 4H⁺ + 4e⁻ → 2H₂O", "2H₂O → O₂ + 4H⁺ + 4e⁻", "H₂ → 2H⁺ + 2e⁻"],
                explanation: "Química da Eletrólise: No catodo ocorre o processo de redução, onde prótons H+ recebem elétrons para formar gás hidrogênio gasoso H2.",
                hint: "Lembre-se que redução envolve ganho de elétrons no catodo (polo negativo).",
                concept: "Redução Eletroquímica do Hidrogênio",
                difficulty: "hard"
            }
        ],
        fisica: [
            {
                q: "Estudos geofísicos em alta na atualidade alertam que o Sol atingiu seu pico de activity magnética de ciclo de 11 anos, gerando intensas ejeções de massa coronal. Ao colidir com a magnetosfera terrestre, esse plasma induz Correntes Geomagneticamente Induzidas (GICs) de baixíssima frequência em cabos metálicos de transmissão elétrica de longa distância. De acordo com os princípios do eletromagnetismo, o surgimento dessas correntes induzidas em transformadores de energia se explica por qual lei física?",
                a: "Lei da Indução de Faraday, provocada pela variação temporal do fluxo de campo magnético solar",
                d: ["Lei de Coulomb, provocada pelo acúmulo estático de cargas na fiação subterrânea", "Lei de Ohm, indicando que a resistência do cobre cai a zero sob calor solar", "Efeito Joule, que transforma energia luminosa solar diretamente em corrente alternada", "Princípio da Superposição de Ondas Sonoras ionosféricas"],
                explanation: "Eletromagnetismo e Tempestades Solares: A Lei da Indução de Faraday estabelece que a variação temporal de um fluxo de campo magnético gera uma força eletromotriz induzida em condutores metálicos fechados.",
                hint: "Correntes elétricas induzidas aparecem devido a campos magnéticos variáveis no tempo.",
                concept: "Leis de Indução Eletromagnética",
                difficulty: "hard"
            }
        ],
        historia: [
            {
                q: "Relatórios sociológicos recentes em alta denunciam as precárias condições de trabalho de milhares de jovens do Sul Global contratados para atuar na 'anotação manual de dados' (rotulando imagens de violência e filtrando discurso de ódio) para treinar grandes modelos de inteligência artificial de corporações do Norte Global. Esse cenário socioeconômico contemporâneo ilustra o conceito de:",
                a: "Neocolonialismo digital, perpetuando a divisão internacional do trabalho no capitalismo cognitivo de plataformas",
                d: ["Democracia participativa virtual, permitindo ascensão de renda universal equitativa", "Desindustrialização sustentável, onde máquinas substituem a agricultura periférica", "Solidariedade orgânica clássica durkheimiana de bem-estar social universal", "Coerção social descentralizada por sindicatos agropecuários multinacionais"],
                explanation: "Sociologia da Tecnologia: A exploração de mão de obra barata no Sul Global para alimentar monopólios tecnológicos do Norte Global perpetua dependências geopolíticas coloniais sob novas vestes de Big Techs.",
                hint: "Analise a divisão geográfica global entre fornecedores de mão de obra barata e donos da tecnologia.",
                concept: "Divisão do Trabalho e Big Techs",
                difficulty: "hard"
            },
            {
                q: "A escolha de Belém do Pará para sediar a COP30 reacendeu o debate sobre o papel estratégico das florestas tropicais na geopolítica ambiental internacional. Economistas climáticos discutem a implementação de mechanisms de Crédito de Carbono para financiar a proteção da biodiversidade amazônica. Sob a perspectiva da sociologia ambiental e das Relações Internacionais, a governança da Amazônia e os créditos de carbono frequentemente enfrentam críticas relativas a:",
                a: "Mercantilização da natureza e risco de 'greenwashing' corporativo sem mudanças estruturais de emissões industriais",
                d: ["Centralização absoluta dos fundos ambientais em bancos exclusivamente municipais da Amazônia", "Redução drástica na demanda global de energias solares em países emergentes", "Aumento na imigração desregulada de operários têxteis europeus para o interior florestal", "Eliminação de impostos sobre minérios não-metálicos importados"],
                explanation: "Geopolítica Ambiental: A monetização das florestas via créditos de carbono é frequentemente criticada por transformar ecossistemas em mercadorias financeiras, facilitando que indústrias poluidoras comprem compensações sem reduzir suas pegadas originais de combustíveis fósseis.",
                hint: "Crédito de carbono cria um ativo comercial que pode servir como desculpa para não poluir menos.",
                concept: "Geopolítica de Crédito de Carbono",
                difficulty: "hard"
            },
            {
                q: "O deslocamento forçado de populações devido a secas severas na região do Sahel, queimadas crônicas na América do Sul e o aumento do nível do mar em ilhas do Pacífico criou a categoria contemporânea em alta dos 'Refugiados Climáticos'. A ausência de um tratado internacional com valor jurídico que reconheça o estatuto desses refugiados sob a égide da ONU reflete:",
                a: "Lacuna institucional na Convenção de Genebra de 1951, que restringe refúgio a perseguições estritamente políticas, raciais ou religiosas",
                d: ["Excesso de acordos de livre circulação de pessoas entre os continentes em crise climática", "Declínio nas emissões industriais que reduziu a relevância do debate nas assembleias globais", "Recusa absoluta de ajuda humanitária por parte de ONGs no hemisfério Sul", "Vetores migratórios restritos apenas ao interior territorial do norte europeu"],
                explanation: "Geopolítica e Refugiados: A Convenção da ONU sobre o Estatuto dos Refugiados de 1951 não contempla causas climáticas e ambientais como critérios de asilo, deixando dezenas de milhões de migrantes ambientais em grave vulnerabilidade jurídica internacional.",
                hint: "A definição clássica de refugiado da ONU de pós-guerra foca apenas em ameaças humanas ou ideológicas.",
                concept: "Vulnerabilidade de Migrantes Climáticos",
                difficulty: "hard"
            }
        ],
        portugues: [
            {
                q: "Artigos jornalísticos contemporâneos expõem como a proliferação de clones de voz por IA generativa de alta fidelidade e 'deepfakes' em redes sociais corrói a barreira clássica entre o real e o simulado na arena pública. Esse ecossistema de comunicação caracterizado pela facilidade em forjar provas multimídia e espalhar boatos emocionais hiper-realistas define as práticas discursivas da chamada era da:",
                a: "Pós-verdade, em que crenças pessoais e simulacros tecnológicos suplantam fatos objetivos na opinião pública",
                d: ["Iluminismo digital, que restabelece a razão pura como base do discurso racional", "Inclusão midiática anárquica, eliminando quaisquer filtros algorítmicos das redes sociais", "Neutralidade discursiva, na qual todos os interlocutores concordam cientificamente", "Supremacia da oralidade analógica tradicional das mídias impressas"],
                explanation: "Estudos de Comunicação e Linguagens: A facilidade de falsificação de áudios e vídeos via IA impulsiona a era da pós-verdade, na qual fatos empíricos objetivos perdem força comunicativa frente a simulacros sintéticos projetados para apelo emocional polarizado.",
                hint: "Pense no enfraquecimento dos fatos científicos diante de simulações digitais cativantes.",
                concept: "Linguagem Sintética e Pós-Verdade",
                difficulty: "hard"
            },
            {
                q: "O design de interfaces de redes sociais atuais foca em engajamento contínuo baseado em algoritmos de recomendação preditiva. Esses sistemas de inteligência artificial filtram o feed priorizando publicações que despertam reações emocionais extremas, como indignação moral ou pertencimento tribal. Linguistas e semiólogos apontam que essa arquitetura algorítmica transforma a comunicação social em:",
                a: "Bolhas de eco polarizadas, que reduzem a alteridade dialógica e inviabilizam o consenso democrático",
                d: ["Ágora democrática plena, onde todas as vozes e dialetos gozam de visibilidade idêntica", "Redes de letramento tradicional, resgatando a sintaxe acadêmica clássica do século XIX", "Sistemas autônomos de tradução que eliminam as barreiras pragmáticas regionais", "Ambientes neutros isentos de fins comerciais ou de monetização corporativa"],
                explanation: "Linguagem e Redes Sociais: Os algoritmos priorizam conteúdos polarizadores para maximizar o tempo de tela do usuário, agrupando indivíduos em 'bolhas' isoladas que rejeitam o debate saudável e reduzem o convívio democrático construtivo.",
                hint: "Feed preditivo isola usuários com os mesmos gostos e opiniões extremistas, silenciando o contraditório.",
                concept: "Polarização e Câmaras de Eco",
                difficulty: "hard"
            },
            {
                q: "Com o avanço e popularização de feeds infinitos de microvídeos verticais de 15 segundos acompanhados de legendas automáticas e trilhas aceleradas, pesquisadores de cognição observam uma alteração profunda na atenção concentrada de crianças e adolescentes. O consumo ininterrupto desse formato estimula a dependência química de dopamina cerebral e afeta a capacidade de processamento de textos longos. Sob a ótica da neurociência da linguagem, esse fenômeno resulta em:",
                a: "Atrofia da atenção profunda e comprometimento da leitura crítica de longa duração",
                d: ["Aumento imediato no QI verbal e aceleração na interpretação de textos literários clássicos", "Substituição integral da língua escrita pela linguagem de sinais universal de computadores", "Eliminação de desvios gramaticais informais devido ao uso de inteligência sintética", "Estabilidade perfeita na estrutura dos lobos frontais sem alterações sinápticas"],
                explanation: "Linguagem e Letramento Digital: Microvídeos treinam o cérebro para estímulos hiper-curtos de dopamina rápida, gerando fadiga e atrofia no processamento de leituras densas e profundas que exigem atenção sustentada.",
                hint: "A dopamina de curtíssimo prazo reduz o foco necessário para decodificar textos longos.",
                concept: "Letramento na Era de Microtelas",
                difficulty: "hard"
            }
        ],
        ingles: [
            {
                q: "The rise of generative AI has sparked intense global debate. While some argue that artificial systems can replicate human creativity, others maintain that art requires an authentic conscious experience. Technology might mimic style, but it cannot feel the weight of existence.\n\nO fragmento de texto em inglês reflete sobre a ascensão da Inteligência Artificial Generativa. De acordo com o autor, o fator limitante que impede a tecnologia de replicar integralmente a arte humana é:",
                a: "A ausência de uma experiência consciente e sentimental genuína ligada à existência humana.",
                d: [
                    "A incapacidade de emular styles estéticos clássicos do século XIX.",
                    "O alto custo de processamento energético dos data centers mundiais.",
                    "A ausência de algoritmos preditivos baseados na web semântica.",
                    "A restrição legal de direitos autorais imposta pelo Sul Global."
                ],
                explanation: "O texto afirma explicitamente que a tecnologia pode imitar estilos ('mimic style'), mas não consegue sentir o peso da existência ('cannot feel the weight of existence'), o que remete à experiência consciente e emocional humana.",
                hint: "Associe a incapacidade descrita ('cannot feel the weight of existence') com sentimentos e consciência humana.",
                concept: "Leitura Instrumental de IA",
                difficulty: "medium"
            },
            {
                q: "Climate change is no longer a distant threat; it is our current reality. Young activists worldwide are raising their voices, demanding that world leaders move beyond empty promises and invest in green infrastructure. Our future is not negotiable.\n\nNo texto opinativo apresentado, a expressão em inglês 'move beyond empty promises' é utilizada para indicar que os jovens ativistas exigem dos líderes mundiais:",
                a: "Ações concretas e investimentos reais, superando discursos e promessas vazias.",
                d: [
                    "O adiamento das metas de emissão de carbono pactuadas na COP30.",
                    "A facilitação de rotas de asilo para refugiados políticos do Sahel.",
                    "A privatização de florestas tropicais para venda de ativos comerciais.",
                    "O fim das manifestações estudantis em defesa do clima."
                ],
                explanation: "O termo 'empty promises' significa promessas vazias. Exigir que líderes 'move beyond' (vão além de) tais promessas significa cobrar medidas práticas e investimentos reais.",
                hint: "Pense na cobrança dos jovens por atitude real ao invés de discursos teóricos.",
                concept: "Identificação de Expressão",
                difficulty: "medium"
            },
            {
                q: "We live in an age of hyper-connection, yet we have never been more isolated. The endless vertical scroll of social media feeds design-engineered to capture our attention has transformed conversation into short interactions. We look at screens instead of eyes.\n\nA reflexão apresentada em inglês discute as contradições do uso de redes sociais. O paradoxo central apontado pelo autor reside no fato de que:",
                a: "O excesso de conexão digital reduziu a profundidade dos diálogos e ampliou o isolamento presencial.",
                d: [
                    "A alta velocidade da internet impede a tradução automática das mensagens eletrônicas.",
                    "Os microvídeos acelerados geram um ganho no processamento intelectual de crianças.",
                    "A facilidade de uso de telas aumentou o letramento clássico e a leitura literária.",
                    "As mídias analógicas impressas substituíram por completo as plataformas digitais."
                ],
                explanation: "O autor destaca a contradição ('paradox') de estarmos em uma era de hiperconexão ('hyper-connection'), mas ao mesmo tempo nos sentirmos mais isolados ('isolated'), onde interações cara a cara são trocadas por toques rápidos em telas.",
                hint: "Observe a contradição ('yet we have never been more isolated') de estar conectado eletronicamente e isolado pessoalmente.",
                concept: "Identificação de Paradoxo",
                difficulty: "medium"
            },
            {
                q: "An API, or Application Programming Interface, acts as a contract between two software systems. It defines the methods and data formats that applications can use to communicate with each other, enabling developers to integrate services without accessing the internal source code.\n\nCom base no texto técnico em inglês, a função principal de uma API é:",
                a: "Definir as regras de comunicação entre sistemas de software, permitindo integrações sem acesso ao código-fonte interno.",
                d: [
                    "Substituir completamente os bancos de dados relacionais por planilhas em nuvem.",
                    "Criptografar o código-fonte para impedir cópias ilegais de aplicativos proprietários.",
                    "Fornecer ao usuário final uma interface gráfica de botões e menus interativos.",
                    "Transferir fisicamente servidores entre data centers de diferentes continentes."
                ],
                explanation: "O texto define API como um 'contrato' ('contract') que define métodos e formatos de dados ('methods and data formats') para que sistemas se comuniquem ('communicate') sem precisar acessar o código interno ('without accessing the internal source code').",
                hint: "Foque na palavra 'contract' e na ideia de comunicação entre sistemas sem expor o código interno.",
                concept: "Tech Vocabulary — API",
                difficulty: "hard"
            },
            {
                q: "Debugging is one of the most critical skills in software development. When a program behaves unexpectedly, developers must trace the execution flow, inspect variable values, and identify the root cause of the failure. A good debugger is as important as a good coder.\n\nNo contexto do desenvolvimento de software descrito no texto em inglês, 'debugging' refere-se a:",
                a: "O processo de identificar e corrigir erros no comportamento inesperado de um programa.",
                d: [
                    "O ato de compilar o código-fonte para gerar um arquivo executável final distribuível.",
                    "A instalação automática de atualizações de segurança em servidores de produção.",
                    "A técnica de escrever testes automatizados antes de codificar qualquer funcionalidade.",
                    "O processo de otimizar a velocidade de carregamento de páginas web com cache."
                ],
                explanation: "O texto explica que 'debugging' envolve rastrear o fluxo de execução ('trace the execution flow'), inspecionar variáveis ('inspect variable values') e identificar a causa raiz de uma falha ('root cause of the failure') — ou seja, encontrar e corrigir bugs.",
                hint: "A palavra 'bug' em inglês técnico significa erro de software. 'Debug' = remover o bug.",
                concept: "Tech Vocabulary — Debugging",
                difficulty: "hard"
            },
            {
                q: "Open source software refers to programs whose source code is publicly available for anyone to view, modify, and distribute. This collaborative model has driven innovation across the tech industry, enabling communities to build powerful tools like the Linux operating system and the Python programming language.\n\nDe acordo com o trecho em inglês, a característica central do software de código aberto (open source) é:",
                a: "A disponibilidade pública do código-fonte, que permite que qualquer pessoa visualize, modifique e distribua o programa.",
                d: [
                    "A obrigatoriedade de pagamento de licença comercial para uso em empresas privadas.",
                    "O bloqueio do código-fonte para proteger patentes registradas pelos desenvolvedores.",
                    "A restrição de uso exclusivo para governos e instituições públicas de ensino.",
                    "A proibição de qualquer modificação para garantir a estabilidade da versão original."
                ],
                explanation: "O texto define open source como programas cujo código-fonte é 'publicly available' (disponível publicamente) para qualquer um 'view, modify, and distribute' (ver, modificar e distribuir), exemplificado por Linux e Python.",
                hint: "'Open' = aberto. 'Source' = código-fonte. Foco na liberdade de acesso e modificação.",
                concept: "Tech Vocabulary — Open Source",
                difficulty: "easy"
            },
            {
                q: "In networking, bandwidth refers to the maximum rate of data transfer across a given path. It is commonly measured in bits per second (bps) and determines how much data can be transmitted simultaneously. Higher bandwidth allows more data to flow, resulting in faster internet connections and smoother streaming experiences.\n\nSegundo o texto técnico em inglês, 'bandwidth' (largura de banda) é melhor definido como:",
                a: "A taxa máxima de transferência de dados em uma rede, medida em bits por segundo, que determina a quantidade de dados transmitidos simultaneamente.",
                d: [
                    "O espaço físico em disco rígido disponível para armazenar arquivos de vídeo em streaming.",
                    "O número de usuários conectados simultaneamente a um servidor de autenticação.",
                    "A frequência de ondas de rádio usada para transmitir sinais de satélite GPS.",
                    "O protocolo de segurança que criptografa dados em redes Wi-Fi públicas."
                ],
                explanation: "O texto define bandwidth como 'maximum rate of data transfer' (taxa máxima de transferência de dados), medida em 'bits per second (bps)', determinando quanta informação pode ser transmitida ao mesmo tempo.",
                hint: "'Band' = faixa; 'width' = largura. Pense na 'largura' do cano por onde passam os dados.",
                concept: "Tech Vocabulary — Networking",
                difficulty: "medium"
            },
            {
                q: "Agile is a software development methodology based on iterative progress, collaboration, and flexibility. Teams work in short cycles called sprints, delivering functional software frequently and responding quickly to change. The Scrum framework is one of the most widely adopted Agile implementations in the tech industry.\n\nCom base no texto em inglês sobre metodologia Ágil, qual é a principal vantagem do desenvolvimento por 'sprints'?",
                a: "Entregar software funcional com frequência e responder rapidamente a mudanças, por meio de ciclos curtos e iterativos.",
                d: [
                    "Eliminar completamente a necessidade de documentação formal em projetos de grande escala.",
                    "Garantir que apenas um desenvolvedor trabalhe em cada módulo de forma isolada.",
                    "Fixar todos os requisitos do projeto antes de iniciar qualquer linha de código.",
                    "Substituir reuniões diárias por relatórios mensais escritos para a gerência."
                ],
                explanation: "O texto define Agile como baseado em 'iterative progress' (progresso iterativo) e 'short cycles called sprints' (ciclos curtos chamados sprints), com o objetivo de 'delivering functional software frequently' e 'responding quickly to change'.",
                hint: "'Sprint' = corrida curta. Cada sprint entrega algo funcional. A agilidade está em ciclos rápidos e adaptáveis.",
                concept: "Tech Vocabulary — Agile & Scrum",
                difficulty: "hard"
            },
            {
                q: "Deployment is the process of releasing a software application to a production environment where end users can access it. Modern DevOps practices use automated pipelines to streamline deployment, reducing human error and enabling continuous delivery of new features and bug fixes.\n\nO texto técnico em inglês descreve 'deployment' como um processo relacionado a:",
                a: "Lançar uma aplicação para o ambiente de produção onde usuários finais podem acessá-la, geralmente automatizado por pipelines de DevOps.",
                d: [
                    "Escrever os requisitos funcionais de um sistema antes da fase de prototipagem inicial.",
                    "Migrar fisicamente servidores para novos data centers durante janelas de manutenção.",
                    "Realizar testes unitários de regressão em código recém-escrito por desenvolvedores júnior.",
                    "Criptografar o banco de dados de produção contra ataques de injeção de SQL."
                ],
                explanation: "O texto define deployment como 'releasing a software application to a production environment' (lançar para o ambiente de produção), automatizado por 'pipelines' para 'continuous delivery' (entrega contínua) de novas funcionalidades.",
                hint: "'Deploy' = implantar/lançar. O 'ambiente de produção' é onde o usuário real usa o sistema.",
                concept: "Tech Vocabulary — Deployment & DevOps",
                difficulty: "hard"
            }
        ]
    },

    QuestionEngine: {
        generateNewProceduralQuestion(subject, difficulty) {
            const sub = subject || 'portugues';
            const lvl = difficulty || 'medium';
            const randomId = Math.floor(Math.random() * 1000000);
            
            let q = "";
            let a = "";
            let d = [];
            let concept = "BNCC-GEN";
            let explanation = "";
            let hint = "";

            if (sub === 'portugues') {
                const plurals = [
                    { s: 'cidadão', p: 'cidadãos', err: ['cidadões', 'cidadães', 'cidadãoes'] },
                    { s: 'caráter', p: 'caracteres', err: ['caráteres', 'caraters', 'carateres'] },
                    { s: 'tabelião', p: 'tabeliães', err: ['tabeliãos', 'tabeliões', 'tabeliãoes'] },
                    { s: 'júnior', p: 'juniores', err: ['júniors', 'juniores', 'júniorees'] }
                ];
                const item = plurals[Math.floor(Math.random() * plurals.length)];
                q = `Identifique a flexão de número correta para o substantivo "${item.s}". Qual é o plural gramatical adequado de acordo com a norma-padrão?`;
                a = item.p;
                d = item.err;
                concept = "Morfossintaxe e Plural";
                explanation = `O plural de "${item.s}" é "${item.p}" segundo as normas gramaticais.`;
                hint = "Lembre-se de que as palavras que mudam de tônica ou que terminam em -ão têm plurais específicos.";
            } else if (sub === 'literatura') {
                const books = [
                    { t: 'Dom Casmurro', a: 'Machado de Assis', e: 'Realismo' },
                    { t: 'O Cortiço', a: 'Aluísio Azevedo', e: 'Naturalismo' },
                    { t: 'Vidas Secas', a: 'Graciliano Ramos', e: 'Modernismo' },
                    { t: 'Iracema', a: 'José de Alencar', e: 'Romantismo' }
                ];
                const book = books[Math.floor(Math.random() * books.length)];
                q = `A obra clássica "${book.t}", um dos marcos da literatura nacional, pertence a qual autor e escola literária?`;
                a = `${book.a} (${book.e})`;
                d = [`Clarice Lispector (Modernismo)`, `José de Alencar (Realismo)`, `Machado de Assis (Romantismo)`].filter(x => x !== `${book.a} (${book.e})`).slice(0, 3);
                concept = "Escolas Literárias Brasileiras";
                explanation = `"${book.t}" é de autoria de ${book.a} e pertence à escola do ${book.e}.`;
                hint = "Relacione o autor à estética realista, romântica ou modernista.";
            } else if (sub === 'ingles') {
                const words = [
                    { en: 'bandwidth', pt: 'largura de banda', desc: 'taxa máxima de transmissão de dados' },
                    { en: 'deployment', pt: 'implantação/lançamento', desc: 'processo de disponibilizar o software' },
                    { en: 'debugging', pt: 'depuração de código', desc: 'processo de encontrar e corrigir erros' }
                ];
                const word = words[Math.floor(Math.random() * words.length)];
                q = `In technical English for computing and networks, what is the meaning and context of the term "${word.en}"?`;
                a = `${word.pt}: ${word.desc}`;
                d = [`Interface gráfica com o usuário final`, `Configuração de hardware local`, `Exclusão definitiva de banco de dados`];
                concept = "Inglês Técnico Instrumental";
                explanation = `"${word.en}" traduz-se como ${word.pt}, referindo-se a: ${word.desc}.`;
                hint = "Pense no jargão técnico utilizado por desenvolvedores de software no dia a dia.";
            } else if (sub === 'artes') {
                const styles = [
                    { n: 'Semana de Arte Moderna de 1922', c: 'romper com o academicismo e criar uma arte genuinamente brasileira' },
                    { n: 'Cubismo', c: 'geometrização das formas e representação sob múltiplos pontos de vista' },
                    { n: 'Expressionismo', c: 'deformação da realidade para expressar emoções subjetivas e angústias' }
                ];
                const style = styles[Math.floor(Math.random() * styles.length)];
                q = `Qual é a proposta estética fundamental do movimento artístico conhecido como "${style.n}"?`;
                a = style.c;
                d = [`Representação fiel e fotográfica da realidade objetiva`, `Uso exclusivo de cores pastéis sem contrastes`, `Foco exclusivo na arte clássica greco-romana medieval`];
                concept = "História da Arte e Movimentos Estéticos";
                explanation = `O movimento "${style.n}" tem como proposta: ${style.c}.`;
                hint = "Lembre-se de que a arte moderna buscou novas linguagens e rompeu com a imitação clássica.";
            } else if (sub === 'educacao_fisica') {
                const health = [
                    { t: 'Frequência Cardíaca Máxima', d: '220 menos a idade do indivíduo' },
                    { t: 'IMC (Índice de Massa Corporal)', d: 'peso dividido pela altura elevada ao quadrado' },
                    { t: 'Atividade Aeróbica', d: 'exercício de longa duração e intensidade moderada que consome oxigênio' }
                ];
                const item = health[Math.floor(Math.random() * health.length)];
                q = `No estudo de fisiologia do exercício e saúde corporal, qual é a definição e método de medição para "${item.t}"?`;
                a = item.d;
                d = [`O dobro da pressão arterial sistólica sistêmica`, `O volume de ar inspirado por minuto no repouso`, `A quantidade total de gordura visceral acumulada`];
                concept = "Fisiologia e Saúde Corporal";
                explanation = `O conceito de "${item.t}" refere-se a: ${item.d}.`;
                hint = "Pense nos cálculos simples aplicados à saúde física e aos exercícios físicos orientados.";
            } else if (sub === 'algebra') {
                const aVal = 2 + Math.floor(Math.random() * 5);
                const bVal = 5 + Math.floor(Math.random() * 10);
                const xVal = 3 + Math.floor(Math.random() * 4);
                const yVal = aVal * xVal + bVal;
                q = `Dada a função afim f(x) = ${aVal}x + ${bVal}, qual é o valor de f(${xVal})?`;
                a = `${yVal}`;
                d = [`${yVal - 3}`, `${yVal + 3}`, `${aVal * xVal}`, `${bVal}`];
                concept = "Funções e Modelagem Algébrica";
                explanation = `Substituindo x por ${xVal} na equação: f(${xVal}) = ${aVal} * ${xVal} + ${bVal} = ${aVal * xVal} + ${bVal} = ${yVal}.`;
                hint = "Substitua o valor de x na expressão linear dada e execute as operações aritméticas.";
            } else if (sub === 'geometria') {
                const base = 4 + Math.floor(Math.random() * 6);
                const height = 5 + Math.floor(Math.random() * 6);
                const area = (base * height) / 2;
                q = `Um triângulo retângulo possui uma base de ${base} cm e uma altura de ${height} cm. Qual é a área deste triângulo em cm²?`;
                a = `${area} cm²`;
                d = [`${base * height} cm²`, `${(base * height) / 4} cm²`, `${area + 5} cm²`, `10 cm²`];
                concept = "Cálculo de Áreas Geométricas";
                explanation = `A área do triângulo é calculada pela fórmula (base * altura) / 2. Logo: (${base} * ${height}) / 2 = ${area} cm².`;
                hint = "Aplique a fórmula padrão de área de triângulos dividindo o produto da base pela altura por 2.";
            } else if (sub === 'estatistica') {
                const numbers = [];
                let sum = 0;
                for (let i = 0; i < 5; i++) {
                    const num = 10 + Math.floor(Math.random() * 20);
                    numbers.push(num);
                    sum += num;
                }
                const mean = (sum / 5).toFixed(1);
                q = `Dada a seguinte amostra de dados numéricos coletados em laboratório: [${numbers.join(', ')}]. A média aritmética aproximada dessa amostra é igual a:`;
                a = `${mean}`;
                d = [`${(sum / 4).toFixed(1)}`, `${(sum / 6).toFixed(1)}`, `${(sum / 5 - 2).toFixed(1)}`, `0.0`];
                concept = "Medidas de Tendência Central";
                explanation = `A média aritmética é a soma dos elementos dividida pela quantidade de elementos: (${numbers.join(' + ')}) / 5 = ${sum} / 5 = ${mean}.`;
                hint = "Some todos os 5 valores da lista e divida o resultado obtido exatamente por 5.";
            } else if (sub === 'matematica_financeira') {
                const capital = 1000 * (1 + Math.floor(Math.random() * 5));
                const rate = 5 + Math.floor(Math.random() * 6);
                const interest = capital * (rate / 100);
                q = `Um capital inicial de R$ ${capital},00 é aplicado sob o regime de juros simples com uma taxa de ${rate}% ao ano. O rendimento obtido em 1 ano será de:`;
                a = `R$ ${interest.toFixed(2)}`;
                d = [`R$ ${(interest * 2).toFixed(2)}`, `R$ ${(interest / 2).toFixed(2)}`, `R$ ${capital.toFixed(2)}`, `R$ 100.00`];
                concept = "Juros Simples e Capitalização";
                explanation = `Juros = Capital * Taxa * Tempo. Logo: ${capital} * (${rate}/100) * 1 = ${interest.toFixed(2)}.`;
                hint = "Aplique o percentual da taxa anual diretamente sobre o capital inicial aplicado.";
            } else if (sub === 'fisica') {
                const force = 10 + Math.floor(Math.random() * 41);
                const mass = 2 + Math.floor(Math.random() * 9);
                const accel = (force / mass).toFixed(2);
                q = `De acordo com a Segunda Lei de Newton (F = m.a), se uma força resultante constante de ${force} N é aplicada a um bloco de massa ${mass} kg, qual será a aceleração adquirida pelo bloco em m/s²?`;
                a = `${accel} m/s²`;
                d = [`${(force * mass).toFixed(2)} m/s²`, `${(mass / force).toFixed(2)} m/s²`, `${accel - 1} m/s²`, `9.8 m/s²`];
                concept = "Dinâmica e Leis de Newton";
                explanation = `A aceleração é dada por a = F / m. Calculando: ${force} N / ${mass} kg = ${accel} m/s².`;
                hint = "Isole a aceleração 'a' dividindo a força 'F' aplicada pela massa 'm' do objeto.";
            } else if (sub === 'quimica') {
                const mass = 10 + Math.floor(Math.random() * 50);
                const volume = 250 + Math.floor(Math.random() * 751);
                const conc = (mass / (volume / 1000)).toFixed(2);
                q = `Em uma aula prática de soluções químicas, um estudante dissolve ${mass}g de sal em um béquer contendo exatamente ${volume} mL de água. A concentração comum da solução resultante em g/L é igual a:`;
                a = `${conc} g/L`;
                d = [`${(mass * 2).toFixed(2)} g/L`, `${(mass / volume).toFixed(2)} g/L`, `${(conc / 2).toFixed(2)} g/L`, `1.00 g/L`];
                concept = "Concentração de Soluções";
                explanation = `Concentração = Massa (g) / Volume (L). Volume de ${volume} mL = ${volume / 1000} L. Logo, ${mass}g / ${volume / 1000}L = ${conc} g/L.`;
                hint = "Converta o volume do béquer de mililitros (mL) para litros (L) antes de dividir a massa.";
            } else if (sub === 'biologia') {
                const bio = [
                    { t: 'DNA (Ácido Desoxirribonucleico)', c: 'molécula de dupla hélice que carrega as instruções genéticas' },
                    { t: 'Mitocôndria', c: 'organela celular responsável pela respiração celular e síntese de ATP' },
                    { t: 'Fotossíntese', c: 'processo celular de conversão de energia luminosa em energia química' }
                ];
                const item = bio[Math.floor(Math.random() * bio.length)];
                q = `No estudo de citologia e genética no Ensino Médio, qual é a definição e papel celular do elemento "${item.t}"?`;
                a = item.c;
                d = [`Eliminação de resíduos metabólicos gasosos por difusão simples`, `Criação de barreiras lipídicas externas contra vírus`, `Síntese exclusiva de clorofila livre na parede celular`];
                concept = "Biologia Celular e Genética";
                explanation = `O elemento "${item.t}" realiza o seguinte papel: ${item.c}.`;
                hint = "Lembre-se das principais estruturas e funções das organelas da célula.";
            } else if (sub === 'historia') {
                const events = [
                    { y: '1889', n: 'Proclamação da República', f: 'o fim da monarquia constitucional brasileira' },
                    { y: '1822', n: 'Independência do Brasil', f: 'o rompimento do pacto colonial com Portugal' },
                    { y: '1888', n: 'Assinatura da Lei Áurea', f: 'a abolição formal do regime de escravidão' }
                ];
                const ev = events[Math.floor(Math.random() * events.length)];
                q = `O marco histórico da "${ev.n}", ocorrido no ano de ${ev.y}, teve como consequência estrutural direta na história do Brasil:`;
                a = ev.f;
                d = [`A criação instantânea da primeira constituição federalista`, `O início da colonização holandesa na região Nordeste`, `A transferência da capital federal de Salvador para o Rio de Janeiro`];
                concept = "História do Brasil";
                explanation = `A "${ev.n}" ocorrida em ${ev.y} resultou em: ${ev.f}.`;
                hint = "Relacione o ano do marco histórico com a transição política correspondente.";
            } else if (sub === 'geografia') {
                const geos = [
                    { n: 'Efeito Estufa', c: 'fenômeno natural que retém calor na atmosfera terrestre mantendo o planeta habitável' },
                    { n: 'El Niño', c: 'aquecimento anômalo das águas superficiais do Oceano Pacífico Equatorial' },
                    { n: 'Curvas de Nível', c: 'linhas que unem pontos de mesma altitude para representar o relevo em mapas' }
                ];
                const geo = geos[Math.floor(Math.random() * geos.length)];
                q = `Na análise cartográfica e no estudo de climatologia geográfica, qual é o conceito que define o termo "${geo.n}"?`;
                a = geo.c;
                d = [`A taxa de natalidade dividida pela mortalidade regional`, `O movimento de rotação da Terra ao redor do Sol`, `A divisão geopolítica dos blocos econômicos europeus`];
                concept = "Geografia Física e Ambiental";
                explanation = `O termo "${geo.n}" conceitua-se como: ${geo.c}.`;
                hint = "Pense nas dinâmicas térmicas do planeta ou nas formas de mapeamento do terreno.";
            } else if (sub === 'filosofia') {
                const phils = [
                    { n: 'Sócrates', c: 'o método da maiêutica através do diálogo para dar parto às ideias' },
                    { n: 'Immanuel Kant', c: 'o imperativo categórico que estabelece o dever moral universal' },
                    { n: 'René Descartes', c: 'o racionalismo fundamentado no método da dúvida metódica' }
                ];
                const phil = phils[Math.floor(Math.random() * phils.length)];
                q = `Qual é o pilar filosófico fundamental defendido pelo pensador clássico "${phil.n}" na história do pensamento ocidental?`;
                a = phil.c;
                d = [`O empirismo radical focado exclusivamente na intuição mística`, `A negação completa da existência de qualquer lei moral social`, `A valorização absoluta do determinismo geográfico físico`];
                concept = "História da Filosofia e Ética";
                explanation = `O filósofo "${phil.n}" formulou e defendeu: ${phil.c}.`;
                hint = "Lembre-se das frases e métodos mais famosos associados ao pensador da questão.";
            } else if (sub === 'sociologia') {
                const socs = [
                    { n: 'Émile Durkheim', c: 'o fato social como objeto de estudo coercitivo e exterior ao indivíduo' },
                    { n: 'Max Weber', c: 'a ação social compreensiva e a teoria da burocracia racional' },
                    { n: 'Karl Marx', c: 'a luta de classes como motor histórico das transformações sociais' }
                ];
                const soc = socs[Math.floor(Math.random() * socs.length)];
                q = `No âmbito do desenvolvimento das ciências sociais, qual é o conceito central formulado por "${soc.n}" para analisar a estrutura social?`;
                a = soc.c;
                d = [`O tecnicismo escolar focado na produtividade industrial`, `O existencialismo poético subjetivo individualista`, `A teoria do caos quântico aplicada à psicologia familiar`];
                concept = "Teoria Sociológica Clássica";
                explanation = `O clássico da sociologia "${soc.n}" estabelece: ${soc.c}.`;
                hint = "Lembre-se dos termos-chave como classes, burocracia, ou fatos sociais.";
            } else if (sub === 'tecnologia') {
                const techTerms = [
                    { t: 'Computação em Nuvem', d: 'provedores de infraestrutura que fornecem servidores e bancos de dados sob demanda via internet' },
                    { t: 'API RESTful', d: 'padrão de interface que permite a comunicação entre sistemas através do protocolo HTTP' },
                    { t: 'Endereço IP', d: 'identificador numérico único associado a cada dispositivo conectado a uma rede' }
                ];
                const item = techTerms[Math.floor(Math.random() * techTerms.length)];
                q = `Na infraestrutura de tecnologia de redes modernas e arquiteturas web, qual é a definição exata de "${item.t}"?`;
                a = item.d;
                d = [`O circuito eletrônico interno que acelera o processador`, `A linguagem exclusiva para formatação de planilhas locais`, `A criptografia física aplicada a cabos ópticos subterrâneos`];
                concept = "Infraestrutura de Redes e Sistemas";
                explanation = `"${item.t}" é definido como: ${item.d}.`;
                hint = "Pense na forma como computadores se comunicam e compartilham recursos online.";
            } else if (sub === 'programacao') {
                const varNames = ['contador', 'total', 'limite', 'soma', 'resultado'];
                const varName = varNames[Math.floor(Math.random() * varNames.length)];
                const initialVal = Math.floor(Math.random() * 5);
                const steps = 3 + Math.floor(Math.random() * 5);
                const correctVal = initialVal + steps;
                q = `Considere o seguinte trecho de código em Python:\n\n${varName} = ${initialVal}\nfor i in range(${steps}):\n    ${varName} += 1\n\nQual será o valor da variável "${varName}" após a execução do loop?`;
                a = `${correctVal}`;
                d = [`${correctVal - 1}`, `${correctVal + 1}`, `${initialVal}`, `0`];
                concept = "Estruturas de Repetição";
                explanation = `O loop range(${steps}) executa exatamente ${steps} vezes. Como a variável começa com ${initialVal} e é incrementada em 1 a cada iteração, o valor final será ${initialVal} + ${steps} = ${correctVal}.`;
                hint = "Lembre-se de que a função range(n) repete o loop n vezes, incrementando o contador em 1 a cada iteração.";
            } else if (sub === 'robotica') {
                const roboTerms = [
                    { t: 'Sensor Ultrassônico', d: 'sensor que calcula a distância de obstáculos medindo o tempo de ida e volta de ondas sonoras' },
                    { t: 'Servomotor', d: 'atuador eletromecânico que permite controle preciso da posição angular de eixos rotativos' },
                    { t: 'Arduino UNO', d: 'placa de prototipagem eletrônica baseada em microcontrolador com portas digitais e analógicas' }
                ];
                const item = roboTerms[Math.floor(Math.random() * roboTerms.length)];
                q = `No desenvolvimento de projetos de automação e robótica educativa, qual é o papel técnico do dispositivo "${item.t}"?`;
                a = item.d;
                d = [`Um conversor de corrente contínua para alta voltagem química`, `Um módulo que simula conexões neurais biológicas no ar`, `Um software de renderização gráfica 3D offline`];
                concept = "Hardware e Sensores Eletrônicos";
                explanation = `O componente "${item.t}" desempenha a função de: ${item.d}.`;
                hint = "Pense em como os robôs coletam informações ambientais ou realizam movimentos físicos controlados.";
            } else if (sub === 'empreendedorismo') {
                const empTerms = [
                    { t: 'M.V.P. (Produto Mínimo Viável)', d: 'versão simplificada de um produto com recursos mínimos para testar hipóteses com clientes' },
                    { t: 'Pitch', d: 'apresentação verbal ultrarrápida projetada para convencer investidores sobre a viabilidade de uma startup' },
                    { t: 'Business Model Canvas', d: 'mapa visual contendo nove blocos para estruturar a proposta de valor e a operação de um negócio' }
                ];
                const item = empTerms[Math.floor(Math.random() * empTerms.length)];
                q = `No ecossistema de startups e na criação de novos empreendimentos de sucesso, qual é o conceito prático associado a "${item.t}"?`;
                a = item.d;
                d = [`O lucro líquido final apurado após auditoria anual externa`, `Um contrato legal formal para contratação de operários industriais`, `A taxa de juros composta cobrada por bancos estatais`];
                concept = "Validação e Modelagem de Negócios";
                explanation = `A ferramenta/conceito de "${item.t}" atua como: ${item.d}.`;
                hint = "Lembre-se de conceitos de validação rápida com o cliente e apresentações sintéticas a investidores.";
            } else if (sub === 'ciencia_de_dados') {
                const dataTerms = [
                    { t: 'Limpeza de Dados (Data Cleaning)', d: 'processo de identificar, corrigir ou remover dados incorretos, inconsistentes ou nulos em uma base' },
                    { t: 'DataFrame', d: 'estrutura bidimensional em formato de tabela com colunas de diferentes tipos organizada em linhas indexadas' },
                    { t: 'Algoritmo K-Means', d: 'método de aprendizado não supervisionado que agrupa dados por proximidade matemática e centroides' }
                ];
                const item = dataTerms[Math.floor(Math.random() * dataTerms.length)];
                q = `No ciclo de análise e ciência de dados aplicadas, qual é a definição e utilidade prática para "${item.t}"?`;
                a = item.d;
                d = [`O armazenamento físico de servidores em fitas magnéticas antigas`, `A criptografia que protege a transmissão de e-mails em redes locais`, `A renderização de sprites gráficos em jogos digitais`];
                concept = "Processamento e Preparação de Dados";
                explanation = `A técnica/estrutura de "${item.t}" é responsável por: ${item.d}.`;
                hint = "Lembre-se de termos clássicos da biblioteca Pandas do Python e algoritmos de agrupamento.";
            } else if (sub === 'inteligencia_artificial') {
                const iaTerms = [
                    { t: 'Rede Neural Artificial', d: 'modelo computacional inspirado no sistema nervoso biológico que aprende relações complexas em dados' },
                    { t: 'Aprendizado de Máquina (Machine Learning)', d: 'campo da IA que treina computadores para identificar padrões e prever dados sem regras explícitas' },
                    { t: 'LLM (Large Language Model)', d: 'redes profundas de atenção e bilhões de parâmetros que compreendem e geram textos semelhantes a humanos' }
                ];
                const item = iaTerms[Math.floor(Math.random() * iaTerms.length)];
                q = `No estudo de tecnologias emergentes e algoritmos cognitivos de Inteligência Artificial, o conceito de "${item.t}" descreve:`;
                a = item.d;
                d = [`Uma sequência fixa de chaves criptográficas para servidores locais`, `A alteração da velocidade do processador físico de hardware`, `Um sistema de detecção de vírus em arquivos compactados`];
                concept = "Modelos Heurísticos e Redes Neurais";
                explanation = `"${item.t}" define-se na inteligência artificial como: ${item.d}.`;
                hint = "Associe o termo ao aprendizado estatístico baseado em dados e processamento neural profundo.";
            } else if (sub === 'educacao_financeira') {
                const finTerms = [
                    { t: 'Reserva de Emergência', d: 'montante equivalente a 6 meses de despesas básicas mantido em investimentos de alta liquidez' },
                    { t: 'Inflação', d: 'processo contínuo de aumento dos preços de bens e serviços que corrói o poder de compra' },
                    { t: 'Diversificação de Portfólio', d: 'distribuição de recursos financeiros em diferentes classes de ativos para mitigar riscos de perdas' }
                ];
                const item = finTerms[Math.floor(Math.random() * finTerms.length)];
                q = `Na organização de finanças pessoais e poupança ativa no Ensino Médio, qual é a definição e importância prática de "${item.t}"?`;
                a = item.d;
                d = [`A contratação de empréstimos com taxas de juros flutuantes`, `O preenchimento de declarações fiscais de exportações multinacionais`, `O pagamento de juros de mora a bancos centrais nacionais`];
                concept = "Planejamento e Saúde Financeira";
                explanation = `Garantir estabilidade pessoal exige entender que "${item.t}" representa: ${item.d}.`;
                hint = "Pense na prevenção de imprevistos cotidianos, na mitigação de riscos ou nos efeitos da perda do valor do dinheiro.";
            } else if (sub === 'marketing_digital') {
                const mktTerms = [
                    { t: 'S.E.O. (Search Engine Optimization)', d: 'otimização técnica de páginas web para melhorar seu posicionamento orgânico em mecanismos de busca' },
                    { t: 'C.T.A. (Call to Action)', d: 'chamadas textuais ou botões que incentivam o usuário a tomar uma ação imediata desejada' },
                    { t: 'Funil de Vendas', d: 'modelo estratégico que representa a jornada do consumidor desde a descoberta até a decisão de compra' }
                ];
                const item = mktTerms[Math.floor(Math.random() * mktTerms.length)];
                q = `Nas estratégias modernas de marketing de conversão e comunicação digital nas redes, qual é a definição de "${item.t}"?`;
                a = item.d;
                d = [`A criptografia aplicada a formulários de e-mails corporativos`, `A exclusão de dados inativos em servidores SQL remotos`, `A velocidade em bits transmitida em cabos de conexão Wi-Fi`];
                concept = "Branding e Conversão Digital";
                explanation = `"${item.t}" opera como: ${item.d}.`;
                hint = "Lembre-se de termos como otimização para o Google, taxas de conversão ou atração de público qualificado.";
            } else if (sub === 'desenvolvimento_jogos') {
                const gameTerms = [
                    { t: 'Game Loop', d: 'o ciclo central e contínuo responsável por atualizar a física do jogo e desenhar os frames na tela' },
                    { t: 'Hitbox', d: 'forma geométrica bidimensional invisível associada a um objeto que monitora e detecta colisões' },
                    { t: 'Game Engine (Motor de Jogo)', d: 'software especializado que provê ferramentas reutilizáveis de renderização gráfica, física e áudio' }
                ];
                const item = gameTerms[Math.floor(Math.random() * gameTerms.length)];
                q = `Na arquitetura técnica de desenvolvimento de jogos digitais sob engines modernas, o termo "${item.t}" refere-se a:`;
                a = item.d;
                d = [`O armazenamento físico de arquivos binários compilados em nuvem`, `O controle de permissões de usuários logados no servidor multi-player`, `A taxa de compressão aplicada a trilhas de áudio MIDI`];
                concept = "Arquitetura e Engenharia de Jogos";
                explanation = `"${item.t}" representa fundamentalmente: ${item.d}.`;
                hint = "Pense no ciclo constante de execução do jogo ou nos mecanismos básicos de colisões e motores gráficos.";
            } else if (sub === 'seguranca_informacao') {
                const secTerms = [
                    { t: 'Criptografia Simétrica', d: 'algoritmo que utiliza uma única chave secreta compartilhada para cifrar e decifrar dados' },
                    { t: 'Phishing', d: 'ataque cibernético baseado em engenharia social que simula páginas legítimas para roubar credenciais' },
                    { t: 'Autenticação de Dois Fatores (2FA)', d: 'mecanismo de segurança que exige duas evidências de identidade distintas antes de liberar o login' }
                ];
                const item = secTerms[Math.floor(Math.random() * secTerms.length)];
                q = `Na proteção de sistemas e segurança cibernética corporativa ou pessoal, qual é a definição e importância prática de "${item.t}"?`;
                a = item.d;
                d = [`O fechamento físico de portas de armários contendo servidores locais`, `A alteração da velocidade e latência de modems Wi-Fi residenciais`, `O processo de formatação total de unidades de disco rígido corrompidas`];
                concept = "Ameaças Cibernéticas e Mitigações";
                explanation = `Garantir a integridade digital exige conhecer que "${item.t}" refere-se a: ${item.d}.`;
                hint = "Associe o termo a golpes em redes sociais, chaves matemáticas de proteção, ou etapas extras de senhas.";
            } else if (sub === 'design_digital') {
                const designTerms = [
                    { t: 'UI/UX Design', d: 'planejamento focado na estética e facilidade de interação e usabilidade global do usuário' },
                    { t: 'Wireframe', d: 'esboço ou esqueleto estrutural de baixa fidelidade para organizar o layout e conteúdo de um aplicativo' },
                    { t: 'Psicologia das Cores', d: 'estudo das reações emocionais e comportamentos que diferentes paletas de cores causam no usuário' }
                ];
                const item = designTerms[Math.floor(Math.random() * designTerms.length)];
                q = `No desenvolvimento e prototipagem de produtos digitais com foco em interfaces gráficas, qual é a definição prática de "${item.t}"?`;
                a = item.d;
                d = [`A compilação de código CSS em linguagem binária pura`, `A velocidade de renderização em frames por segundo da placa de vídeo`, `O controle físico de contraste dos monitores de tubo analógicos`];
                concept = "Prototipagem e Experiência do Usuário";
                explanation = `"${item.t}" é definido no design como: ${item.d}.`;
                hint = "Lembre-se de conceitos como rascunhos rápidos no Figma, usabilidade de botões ou harmonia estética de paletas.";
            } else if (sub === 'producao_audiovisual') {
                const audioTerms = [
                    { t: 'Storyboard', d: 'guia gráfico sequencial composto por desenhos das cenas planejadas para o vídeo' },
                    { t: 'Cromaqui (Chroma Key)', d: 'técnica de pós-produção que consiste em remover o fundo verde para inserir cenários virtuais' },
                    { t: 'Mixagem de Áudio', d: 'processo de ajustar e harmonizar volumes, frequências e efeitos de trilhas sonoras e falas' }
                ];
                const item = audioTerms[Math.floor(Math.random() * audioTerms.length)];
                q = `No processo técnico de pós-produção e edição de vídeo profissional na área de multimídia, qual é a utilidade prática de "${item.t}"?`;
                a = item.d;
                d = [`A compressão de arquivos HTML em pacotes executáveis ZIP locais`, `A velocidade em bits da conexão de upload de vídeos em redes Wi-Fi`, `O controle físico de voltagem de gravadores de áudio analógicos`];
                concept = "Edição e Montagem Multimídia";
                explanation = `Na produção multimídia, a técnica/ferramenta de "${item.t}" serve para: ${item.d}.`;
                hint = "Pense no planejamento visual em quadrinhos, na substituição de fundos ou na qualidade sonora final.";
            } else if (sub === 'biblioteca_digital') {
                const bibTerms = [
                    { t: 'Citação Indireta', d: 'redação com suas próprias palavras das ideias de um autor pesquisado, mantendo a menção à fonte' },
                    { t: 'Norma ABNT NBR 6023', d: 'diretriz nacional responsável pela padronização e estruturação formal de referências acadêmicas' },
                    { t: 'Plágio Acadêmico', d: 'apropriação indébita de conceitos, frases ou obras inteiras de outros autores sem conceder o devido crédito' }
                ];
                const item = bibTerms[Math.floor(Math.random() * bibTerms.length)];
                q = `Na elaboração de trabalhos de pesquisa e letramento acadêmico segundo os padrões nacionais vigentes, a definição de "${item.t}" é:`;
                a = item.d;
                d = [`A exclusão automática de arquivos duplicados no disco local`, `A velocidade de impressão de relatórios digitais físicos`, `A compilação de código de banco de dados SQL em planilhas simples`];
                concept = "Metodologia Científica e Normas";
                explanation = `Para garantir a ética e o padrão do trabalho científico, "${item.t}" conceitua-se como: ${item.d}.`;
                hint = "Observe regras de escrita formal, ética na pesquisa ou leis de formatação de monografias.";
            } else if (sub === 'laboratorio_virtual') {
                const labTerms = [
                    { t: 'Simulador Virtual de Circuitos', d: 'ambiente virtual interativo para montar placas digitais e testar resistores de forma segura e sem custos físicos' },
                    { t: 'Vidraria de Segurança Virtual', d: 'representação visual digital de reagentes e béquer projetada para evitar acidentes químicos em laboratório real' },
                    { t: 'Experimento Controlled Heurístico', d: 'simulação matemática de laboratório onde variáveis físicas e químicas podem ser alteradas para testar hipóteses' }
                ];
                const item = labTerms[Math.floor(Math.random() * labTerms.length)];
                q = `No uso de plataformas e ambientes gráficos de laboratórios virtuais de física e química no Novo Ensino Médio, o recurso de "${item.t}" serve para:`;
                a = item.d;
                d = [`Eliminar a necessidade de estudar leis teóricas da física clássica`, `Criptografar dados pessoais do aluno em servidores escolares remotos`, `Acelerar o processador central do computador rodando simulações 3D offline`];
                concept = "Simulações Científicas Virtuais";
                explanation = `A ferramenta de "${item.t}" permite: ${item.d}.`;
                hint = "Lembre-se das vantagens práticas das simulações digitais em evitar riscos e custos associados aos experimentos físicos.";
            } else if (sub === 'projeto_vida') {
                const pvTerms = [
                    { t: 'Metas S.M.A.R.T.', d: 'metas que são específicas, mensuráveis, atingíveis, relevantes e com prazo temporal bem definido' },
                    { t: 'Análise S.W.O.T. / F.O.F.A. pessoal', d: 'mapeamento estratégico de forças e fraquezas (internas) e oportunidades e ameaças (externas)' },
                    { t: 'Plano de Ação Estruturado', d: 'roteiro prático contendo as etapas, recursos necessários e prazos reais para atingir um objetivo' }
                ];
                const item = pvTerms[Math.floor(Math.random() * pvTerms.length)];
                q = `No planejamento estratégico de carreira, autoconhecimento e Projeto de Vida no Novo Ensino Médio, qual é a definição e importância prática de "${item.t}"?`;
                a = item.d;
                d = [`A especulação financeira de ativos na bolsa de valores regional`, `A contratação compulsória de seguros residenciais privados contra acidentes`, `A exclusão de notas escolares baixas do histórico escolar`];
                concept = "Autoconhecimento e Planejamento Pessoal";
                explanation = `A ferramenta de "${item.t}" auxilia na organização do futuro, permitindo: ${item.d}.`;
                hint = "Pense em objetivos bem definidos e de curto/médio prazo ou no autodiagnóstico de virtudes e fraquezas.";
            } else if (sub === 'inclusao_acessibilidade') {
                const incTerms = [
                    { t: 'Texto Alternativo (Alt Text)', d: 'descrições de imagens digitais lidas por leitores de tela para guiar alunos com deficiência visual' },
                    { t: 'Contraste Mínimo WCAG 2.1 (AA)', d: 'diretriz web que exige contraste de cores de 4.5:1 para garantir a legibilidade universal do texto' },
                    { t: 'Desenho Universal para Aprendizagem (DUA)', d: 'modelo pedagógico que provê múltiplas formas de engajamento, representação e expressão do saber' }
                ];
                const item = incTerms[Math.floor(Math.random() * incTerms.length)];
                q = `Na construção de ambientes educacionais acessíveis e inclusão escolar digital, qual é o conceito associado ao termo "${item.t}"?`;
                a = item.d;
                d = [`A velocidade de conexão para estudantes que residem em zonas rurais`, `A criptografia que impede a reprodução não autorizada do material de aula`, `A conversão automática de notas baixas para aprovação compulsória`];
                concept = "Acessibilidade Escolar Digital";
                explanation = `Para garantir uma escola digital plenamente inclusiva, o recurso de "${item.t}" atua para: ${item.d}.`;
                hint = "Pense em normas WCAG de contraste de cores, descrição textual de mídias ou formatos flexíveis de engajamento pedagógico.";
            } else {
                // Fallback for safety
                q = `Questão de diagnóstico geral de proficiência na disciplina de ${sub}. Qual das seguintes alternativas apresenta o entendimento cientificamente aceito para este campo de estudos?`;
                a = `A aplicação do método empírico fundamentado para validação de hipóteses e conceitos práticos`;
                d = [
                    `A rejeição total a dados estruturados em prol de pura adivinhação intuitiva`,
                    `A formatação física offline sem qualquer vínculo a recursos digitais`,
                    `A substituição de todas as etapas de estudo por IA sem qualquer revisão humana`
                ];
                concept = "Proficiência Interdisciplinar";
                explanation = `Qualquer campo científico ou acadêmico se baseia em fundamentação teórica e validação empírica.`;
                hint = "Lembre-se de buscar a opção focada no rigor metodológico e científico.";
            }

            // Guard the base question text
            const baseQ = q;

            // Generate dynamic contextual parameterization
            const nomesAlunos = ['Mariana', 'Pedro', 'Ana Clara', 'Gustavo', 'Beatriz', 'Lucas', 'Sofia', 'Rodrigo', 'Larissa', 'Bruno', 'Gabriel', 'Letícia', 'Felipe', 'Camila', 'Matheus', 'Júlia', 'Thiago', 'Manuela', 'Enzo', 'Valentina'];
            const escolas = ['Colégio Central', 'Escola Técnica Nacional', 'Liceu de Ciências', 'Instituto de Tecnologia', 'Escola Estadual Cora Coralina', 'Liceu de Humanidades', 'Instituto Federal de Tecnologia', 'Colégio D. Pedro II'];
            const randChoice = (arr) => arr[Math.floor(Math.random() * arr.length)];

            // 35% chance to inject randomized student and school context
            if (Math.random() < 0.35) {
                const student = randChoice(nomesAlunos);
                const school = randChoice(escolas);
                const intros = [
                    `Durante uma atividade prática no ${school}, o(a) estudante ${student} se deparou com o seguinte problema:\n`,
                    `Para um trabalho escolar no ${school}, ${student} precisa analisar a seguinte questão:\n`,
                    `No simulado de preparação do ${school}, a questão formulada para o(a) aluno(a) ${student} diz:\n`,
                    `Ao realizar um teste no laboratório do ${school}, ${student} registrou a seguinte dúvida:\n`
                ];
                q = randChoice(intros) + q;
            }

            return {
                id: `procedural-gen-${randomId}`,
                text: `[ONYX PROTOCOL] ${subject.toUpperCase()} (${difficulty.toUpperCase()}):\n${q}`,
                options: window.OnyxEngines.shuffle([a, ...d]),
                correct: 0,
                explanation: explanation,
                hint: hint,
                concept: concept,
                rawQText: q,
                baseQText: baseQ,
                rawAns: a,
                rawDistractors: d
            };
        },
        async generateQuestions(userId, subject, difficulty, count = 10, year = 'all') {
            let pool = [];

            // ── TIER 1: OnyxDBManager (IndexedDB indexado — mais rápido) ────────
            if (window.OnyxDBManager) {
                try {
                    const reqYear = (year && year !== 'all') ? parseInt(year) : null;
                    const banked = await window.OnyxDBManager.getPool(subject, difficulty, reqYear);
                    if (banked.length > 0) {
                        pool = banked;
                        console.log(`[QuestionEngine] DBManager: ${pool.length} questões para ${subject}/${difficulty} (Ano: ${year})`);
                    }
                } catch(e) { console.warn('[QuestionEngine] DBManager falhou, usando fallback.', e); }
            }

            // ── TIER 2: TrendSensingDatabase (questões contextuais curadas) ─────
            if (pool.length < count) {
                const trendDB = window.OnyxEngines.TrendSensingDatabase || {};
                const hasTrend = trendDB[subject] && trendDB[subject].length > 0;
                if (hasTrend || window.currentSimulateEdition === 'trends') {
                    const matchedTrend = (trendDB[subject] || []).filter(q => q.difficulty === difficulty);
                    pool = [...pool, ...matchedTrend];
                }
            }

            // ── TIER 3: OnyxDatabase (gerador procedural local) ──────────────────
            if (pool.length < count) {
                const staticDB = window.OnyxDatabase || {};
                if (typeof staticDB.getFreshPool === 'function') {
                    pool = [...pool, ...staticDB.getFreshPool(subject, difficulty)];
                } else if (staticDB[subject]) {
                    const d = staticDB[subject];
                    pool = [...pool, ...(d[difficulty] || d['easy'] || [])];
                }
            }

            // ── Merge legacy CloudSync questions ────────────────────────────────
            if (window.OnyxCore) {
                try {
                    const dynQ = await window.OnyxCore.DB.getDynamicQuestions();
                    const matched = dynQ
                        .filter(q => q.subject === subject && q.difficulty === difficulty)
                        .map(q => q.data);
                    pool = [...pool, ...matched];
                } catch(e) {}
            }

            // ── Deduplicar com Normalização de Textos (Anti-Prefix Loophole) ─────
            const seenText = new Set();
            pool = pool.filter(item => {
                if (item && item.q) {
                    const cleanQ = item.baseQText || item.q;
                    const norm = window.OnyxEngines.normalizeQuestionText(cleanQ);
                    if (!seenText.has(norm)) {
                        seenText.add(norm);
                        return true;
                    }
                }
                return false;
            });

            // Garantir que todas as questões possuem um ano letivo (1, 2 ou 3)
            pool.forEach((q, idx) => {
                if (!q.ano) {
                    q.ano = (idx % 3) + 1;
                }
            });

            // ── Filtrar por Ano Letivo (1º, 2º ou 3º Ano do Ensino Médio) ──────────
            if (year && year !== 'all') {
                const reqYear = parseInt(year);
                pool = pool.filter(q => q.ano === reqYear);
            }

            if (pool.length === 0) return [];

            // ── Anti-Repetição Adaptativa ────────────────────────────────────────
            let stats = { seenQuestions: [] };
            if (userId && window.OnyxCore) {
                const fetched = await window.OnyxCore.DB.getUser(userId);
                if (fetched) stats = fetched;
                if (!stats.seenQuestions) stats.seenQuestions = [];
            }

            let unseenPool = pool.filter(q => !stats.seenQuestions.includes(q.q));

            // Se o pool de não vistas for insuficiente, recicla as questões vistas deste assunto/dificuldade
            if (unseenPool.length < count && pool.length > 0) {
                console.log(`[ONYX ENGINE] Pool de não vistas baixo (${unseenPool.length}/${count}). Reciclando questões de ${subject}/${difficulty}.`);
                const poolTexts = pool.map(q => q.q);
                stats.seenQuestions = stats.seenQuestions.filter(qText => !poolTexts.includes(qText));
                unseenPool = pool.filter(q => !stats.seenQuestions.includes(q.q));
            }

            // ── Geração Procedural sob demanda (deficit) ─────────────────────────
            if (unseenPool.length < count) {
                const deficit = count - unseenPool.length;
                const newRaw = [];
                for (let i = 0; i < deficit; i++) {
                    let gen;
                    let norm;
                    let attempts = 0;
                    const maxAttempts = 15;
                    
                    do {
                        gen = window.OnyxEngines.QuestionEngine.generateNewProceduralQuestion(subject, difficulty);
                        const cleanQ = gen.baseQText || gen.rawQText;
                        norm = window.OnyxEngines.normalizeQuestionText(cleanQ);
                        attempts++;
                    } while (seenText.has(norm) && attempts < maxAttempts);

                    seenText.add(norm);

                    const targetYear = year !== 'all' ? parseInt(year) : (Math.floor(Math.random() * 3) + 1);
                    const fmt = {
                        q: gen.rawQText, a: gen.rawAns, d: gen.rawDistractors,
                        explanation: gen.explanation, hint: gen.hint, concept: gen.concept,
                        ano: targetYear,
                        baseQText: gen.baseQText
                    };
                    newRaw.push(fmt);
                    unseenPool.push(fmt);
                }

                // Persistir no OnyxDBManager (question_bank) — caminho principal
                if (window.OnyxDBManager && newRaw.length > 0) {
                    window.OnyxDBManager.saveQuestions(subject, difficulty, newRaw)
                        .then(n => console.log(`[QuestionEngine] ${n} novas questões salvas no DBManager.`));
                }

                // Também persiste no store legado dynamic_questions (compatibilidade)
                if (window.OnyxCore && newRaw.length > 0) {
                    const legacyFmt = newRaw.map((q, idx) => ({
                        id: `proc-${subject}-${difficulty}-${Date.now()}-${idx}`,
                        subject, difficulty, data: q
                    }));
                    window.OnyxCore.DB.saveDynamicQuestions(legacyFmt);
                }
            }

            const shuffledPool = window.OnyxEngines.shuffle(unseenPool);
            let selection = [];
            if (shuffledPool.length > 0) {
                while (selection.length < count) {
                    selection = selection.concat(window.OnyxEngines.shuffle(shuffledPool));
                }
                selection = selection.slice(0, count);
            }
            const questions = [];
            
            selection.forEach((pick) => {
                if (userId && !stats.seenQuestions.includes(pick.q)) {
                    stats.seenQuestions.push(pick.q);
                }
                const options = window.OnyxEngines.shuffle([pick.a, ...pick.d]);
                const yearLabels = { 1: "1º Ano", 2: "2º Ano", 3: "3º Ano" };
                const label = yearLabels[pick.ano || 1] || "1º Ano";
                questions.push({
                    id: pick.q,
                    text: `[ONYX PROTOCOL] ${subject.toUpperCase()} (${difficulty.toUpperCase()}) - ${label}:\n${pick.q}`,
                    options: options,
                    correct: options.indexOf(pick.a),
                    explanation: pick.explanation || `Explicando a competência: ${pick.q}`,
                    hint: pick.hint || 'Revise a analogia sugerida pelo OnyxTutor para responder com clareza.',
                    concept: pick.concept || 'BNCC-CORE',
                    ano: pick.ano || 1
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
