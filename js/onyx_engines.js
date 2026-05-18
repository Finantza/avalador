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

        if (history.length < 1) {
            return {
                status: 'INSUFFICIENT_DATA',
                recommendation: 'Realize sua primeira missão de treinamento para calibrar os sensores cognitivos da BNCC.',
                accuracyAvg: 0,
                weakness: 'N/A',
                trend: 'ESTÁVEL',
                trendColor: 'var(--primary)',
                dropoutRisk: 'BAIXO',
                dropoutRiskColor: 'var(--success)',
                engagementLevel: 20,
                competenciesMap: { linguagens: 0, matematica: 0, natureza: 0, humanas: 0, itinerarios: 0, extras: 0 }
            };
        }

        const statsMap = {};
        const catMap = { linguagens: { tot: 0, corr: 0 }, matematica: { tot: 0, corr: 0 }, natureza: { tot: 0, corr: 0 }, humanas: { tot: 0, corr: 0 }, itinerarios: { tot: 0, corr: 0 }, extras: { tot: 0, corr: 0 } };

        history.forEach(h => {
            const sub = h.subject || 'portugues';
            const cat = subjectToCat[sub] || 'linguagens';
            
            if (!statsMap[sub]) statsMap[sub] = { total: 0, correct: 0 };
            statsMap[sub].total += 10;
            statsMap[sub].correct += h.score;

            catMap[cat].tot += 10;
            catMap[cat].corr += h.score;
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
            recommendation: `Sensores indicam atenção especial ao domínio de ${weakness.subject.toUpperCase()}. Sua curva cognitiva está ${trend}.`
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
    TrendSensingDatabase: {
        algebra: [
            {
                q: "Um estudo de 2026 estimou que o treinamento de modelos avançados de IA generativa consome energia equivalente a 40 residências brasileiras por ano. A pegada de carbono de um grande Data Center cresce linearmente conforme a quantidade de consultas recebidas. Se o centro emite 0,5 gramas de CO2 por requisição padrão de IA, e a média de requisições por segundo é de 80.000 requisições globais. Em 1 hora de operação contínua, a quantidade total de emissão de carbono de CO2 em toneladas será igual a:",
                a: "144,0 toneladas",
                d: ["14,4 toneladas", "2,4 toneladas", "72,0 toneladas", "288,0 toneladas"],
                explanation: "Pegada de Carbono de IA: 80.000 req/s * 3600s = 288.000.000 req/hora. Multiplicado por 0,5g por req = 144.000.000 gramas = 144.000 kg = 144 toneladas de CO2 por hora.",
                hint: "Lembre-se de converter segundos para horas e gramas para toneladas métricas.",
                concept: "Pegada Ecológica de IA"
            },
            {
                q: "No processo de transição para o Hidrogênio Verde (H2V), a eficiência energética de células de eletrólise tem crescido devido aos incentivos globais. Em uma planta de refino experimental em alta na atualidade, obteve-se um rendimento útil de 72% na conversão de energia elétrica de fonte solar em energia química do H2. Se o custo bruto de produção de energia elétrica solar no complexo é de R$ 0,15 por kWh, o valor efetivo aproveitado de energia química acumulada por kWh de hidrogênio gerado custará aproximadamente:",
                a: "R$ 0,21",
                d: ["R$ 0,11", "R$ 0,26", "R$ 0,32", "R$ 0,18"],
                explanation: "Matemática e Rendimento de Hidrogênio Verde: Custo efetivo = Custo bruto / Rendimento = 0,15 / 0,72 = R$ 0,208 (R$ 0,21 aproximado).",
                hint: "Divida o custo unitário bruto pelo percentual de eficiência para achar o valor real.",
                concept: "Transição Energética e Eficiência"
            },
            {
                q: "O acúmulo de e-waste (lixo eletrônico) global cresce de forma preocupante. Dados das agências ambientais mundiais indicam que o acúmulo de e-waste no Brasil no ano n (a partir de 2020) é modelado pela expressão E(n) = 1,4 + 0,15n em milhões de toneladas de lixo eletrônico descartado por ano. O acúmulo total estimado descartado anualmente no ano de 2026 (n = 6) será de:",
                a: "2,30 milhões de toneladas",
                d: ["2,15 milhões de toneladas", "1,95 milhões de toneladas", "2,45 milhões de toneladas", "2,60 milhões de toneladas"],
                explanation: "Estimativa de E-Waste: substituindo n = 6 na equação temos E(6) = 1,4 + 0,15 * 6 = 1,4 + 0,90 = 2,30 milhões de toneladas.",
                hint: "Substitua n por 6 (anos decorridos desde 2020) na equação do modelo linear fornecido.",
                concept: "Progressão Linear e E-Waste"
            }
        ],
        biologia: [
            {
                q: "A elevação de 1,5°C nas temperaturas médias brasileiras nas últimas décadas acelerou o metabolismo e o ciclo reprodutivo do vetor Aedes aegypti. Biólogos explicam que temperaturas elevadas reduzem o período de incubação extrínseco do vírus da Dengue no mosquito de 14 para 7 dias, estendendo a transmissão geográfica para regiões anteriormente frias no Sul do país. Essa expansão vetorial epidêmica decorre diretamente de qual fenômeno fisiológico ou ecológico ligado às mudanças climáticas?",
                a: "Redução do ciclo de desenvolvimento larval impulsionado por reações químicas metabólicas catalisadas pelo calor",
                d: ["Mutação genética imediata no genoma viral induzida pela radiação infravermelha solar", "Aumento da umidade relativa do ar induzida pela seca no Centro-Oeste", "Seleção natural de mosquitos que respiram exclusivamente gás carbônico de efeito estufa", "Substituição do vírus por bactérias fotossintetizantes oportunistas"],
                explanation: "Fisiologia e Clima: O aumento de temperatura atua como um catalisador térmico para as reações enzimáticas e metabólicas de insetos ectotérmicos como o mosquito, acelerando seu desenvolvimento larval.",
                hint: "Insetos não regulam a própria temperatura corporal. O calor externo dita a velocidade metabólica.",
                concept: "Metabolismo Ectotérmico e Clima"
            },
            {
                q: "O hidrogênio verde desponta como pilar para a descarbonização industrial. Quimicamente, ele é obtido através da eletrólise da água usando eletricidade limpa de fontes renováveis. Durante a eletrólise ácida da água, ocorre a oxidação de moléculas de água no anodo e a redução de íons no catodo. A equação de meia-reação global que representa o processo catódico (onde o gás hidrogênio é gerado) é:",
                a: "2H⁺ + 2e⁻ → H₂",
                d: ["2H₂O + 2e⁻ → H₂ + 2OH⁻", "O₂ + 4H⁺ + 4e⁻ → 2H₂O", "2H₂O → O₂ + 4H⁺ + 4e⁻", "H₂ → 2H⁺ + 2e⁻"],
                explanation: "Química da Eletrólise: No catodo ocorre o processo de redução, onde prótons H+ recebem elétrons para formar gás hidrogênio gasoso H2.",
                hint: "Lembre-se que redução envolve ganho de elétrons no catodo (polo negativo).",
                concept: "Redução Eletroquímica do Hidrogênio"
            },
            {
                q: "Estudos geofísicos em alta na atualidade alertam que o Sol atingiu seu pico de atividade magnética de ciclo de 11 anos, gerando intensas ejeções de massa coronal. Ao colidir com a magnetosfera terrestre, esse plasma induz Correntes Geomagneticamente Induzidas (GICs) de baixíssima frequência em cabos metálicos de transmissão elétrica de longa distância. De acordo com os princípios do eletromagnetismo, o surgimento dessas correntes induzidas em transformadores de energia se explica por qual lei física?",
                a: "Lei da Indução de Faraday, provocada pela variação temporal do fluxo de campo magnético solar",
                d: ["Lei de Coulomb, provocada pelo acúmulo estático de cargas na fiação subterrânea", "Lei de Ohm, indicando que a resistência do cobre cai a zero sob calor solar", "Efeito Joule, que transforma energia luminosa solar diretamente em corrente alternada", "Princípio da Superposição de Ondas Sonoras ionosféricas"],
                explanation: "Eletromagnetismo e Tempestades Solares: A Lei da Indução de Faraday estabelece que a variação temporal de um fluxo de campo magnético gera uma força eletromotriz induzida em condutores metálicos fechados.",
                hint: "Correntes elétricas induzidas aparecem devido a campos magnéticos variáveis no tempo.",
                concept: "Leis de Indução Eletromagnética"
            }
        ],
        historia: [
            {
                q: "Relatórios sociológicos recentes em alta denunciam as precárias condições de trabalho de milhares de jovens do Sul Global contratados para atuar na 'anotação manual de dados' (rotulando imagens de violência e filtrando discurso de ódio) para treinar grandes modelos de inteligência artificial de corporações do Norte Global. Esse cenário socioeconômico contemporâneo ilustra o conceito de:",
                a: "Neocolonialismo digital, perpetuando a divisão internacional do trabalho no capitalismo cognitivo de plataformas",
                d: ["Democracia participativa virtual, permitindo ascensão de renda universal equitativa", "Desindustrialização sustentável, onde máquinas substituem a agricultura periférica", "Solidariedade orgânica clássica durkheimiana de bem-estar social universal", "Coerção social descentralizada por sindicatos agropecuários multinacionais"],
                explanation: "Sociologia da Tecnologia: A exploração de mão de obra barata no Sul Global para alimentar monopólios tecnológicos do Norte Global perpetua dependências geopolíticas coloniais sob novas vestes de Big Techs.",
                hint: "Analise a divisão geográfica global entre fornecedores de mão de obra barata e donos da tecnologia.",
                concept: "Divisão do Trabalho e Big Techs"
            },
            {
                q: "A escolha de Belém do Pará para sediar a COP30 reacendeu o debate sobre o papel estratégico das florestas tropicais na geopolítica ambiental internacional. Economistas climáticos discutem a implementação de mechanisms de Crédito de Carbono para financiar a proteção da biodiversidade amazônica. Sob a perspectiva da sociologia ambiental e das Relações Internacionais, a governança da Amazônia e os créditos de carbono frequentemente enfrentam críticas relativas a:",
                a: "Mercantilização da natureza e risco de 'greenwashing' corporativo sem mudanças estruturais de emissões industriais",
                d: ["Centralização absoluta dos fundos ambientais em bancos exclusivamente municipais da Amazônia", "Redução drástica na demanda global de energias solares em países emergentes", "Aumento na imigração desregulada de operários têxteis europeus para o interior florestal", "Eliminação de impostos sobre minérios não-metálicos importados"],
                explanation: "Geopolítica Ambiental: A monetização das florestas via créditos de carbono é frequentemente criticada por transformar ecossistemas em mercadorias financeiras, facilitando que indústrias poluidoras comprem compensações sem reduzir suas pegadas originais de combustíveis fósseis.",
                hint: "Crédito de carbono cria um ativo comercial que pode servir como desculpa para não poluir menos.",
                concept: "Geopolítica de Crédito de Carbono"
            },
            {
                q: "O deslocamento forçado de populações devido a secas severas na região do Sahel, queimadas crônicas na América do Sul e o aumento do nível do mar em ilhas do Pacífico criou a categoria contemporânea em alta dos 'Refugiados Climáticos'. A ausência de um tratado internacional com valor jurídico que reconheça o estatuto desses refugiados sob a égide da ONU reflete:",
                a: "Lacuna institucional na Convenção de Genebra de 1951, que restringe refúgio a perseguições estritamente políticas, raciais ou religiosas",
                d: ["Excesso de acordos de livre circulação de pessoas entre os continentes em crise climática", "Declínio nas emissões industriais que reduziu a relevância do debate nas assembleias globais", "Recusa absoluta de ajuda humanitária por parte de ONGs no hemisfério Sul", "Vetores migratórios restritos apenas ao interior territorial do norte europeu"],
                explanation: "Geopolítica e Refugiados: A Convenção da ONU sobre o Estatuto dos Refugiados de 1951 não contempla causas climáticas e ambientais como critérios de asilo, deixando dezenas de milhões de migrantes ambientais em grave vulnerabilidade jurídica internacional.",
                hint: "A definição clássica de refugiado da ONU de pós-guerra foca apenas em ameaças humanas ou ideológicas.",
                concept: "Vulnerabilidade de Migrantes Climáticos"
            }
        ],
        portugues: [
            {
                q: "Artigos jornalísticos contemporâneos expõem como a proliferação de clones de voz por IA generativa de alta fidelidade e 'deepfakes' em redes sociais corrói a barreira clássica entre o real e o simulado na arena pública. Esse ecossistema de comunicação caracterizado pela facilidade em forjar provas multimídia e espalhar boatos emocionais hiper-realistas define as práticas discursivas da chamada era da:",
                a: "Pós-verdade, em que crenças pessoais e simulacros tecnológicos suplantam fatos objetivos na opinião pública",
                d: ["Iluminismo digital, que restabelece a razão pura como base do discurso racional", "Inclusão midiática anárquica, eliminando quaisquer filtros algorítmicos das redes sociais", "Neutralidade discursiva, na qual todos os interlocutores concordam cientificamente", "Supremacia da oralidade analógica tradicional das mídias impressas"],
                explanation: "Estudos de Comunicação e Linguagens: A facilidade de falsificação de áudios e vídeos via IA impulsiona a era da pós-verdade, na qual fatos empíricos objetivos perdem força comunicativa frente a simulacros sintéticos projetados para apelo emocional polarizado.",
                hint: "Pense no enfraquecimento dos fatos científicos diante de simulações digitais cativantes.",
                concept: "Linguagem Sintética e Pós-Verdade"
            },
            {
                q: "O design de interfaces de redes sociais atuais foca em engajamento contínuo baseado em algoritmos de recomendação preditiva. Esses sistemas de inteligência artificial filtram o feed priorizando publicações que despertam reações emocionais extremas, como indignação moral ou pertencimento tribal. Linguistas e semiólogos apontam que essa arquitetura algorítmica transforma a comunicação social em:",
                a: "Bolhas de eco polarizadas, que reduzem a alteridade dialógica e inviabilizam o consenso democrático",
                d: ["Ágora democrática plena, onde todas as vozes e dialetos gozam de visibilidade idêntica", "Redes de letramento tradicional, resgatando a sintaxe acadêmica clássica do século XIX", "Sistemas autônomos de tradução que eliminam as barreiras pragmáticas regionais", "Ambientes neutros isentos de fins comerciais ou de monetização corporativa"],
                explanation: "Linguagem e Redes Sociais: Os algoritmos priorizam conteúdos polarizadores para maximizar o tempo de tela do usuário, agrupando indivíduos em 'bolhas' isoladas que rejeitam o debate saudável e reduzem o convívio democrático construtivo.",
                hint: "Feed preditivo isola usuários com os mesmos gostos e opiniões extremistas, silenciando o contraditório.",
                concept: "Polarização e Câmaras de Eco"
            },
            {
                q: "Com o avanço e popularização de feeds infinitos de microvídeos verticais de 15 segundos acompanhados de legendas automáticas e trilhas aceleradas, pesquisadores de cognição observam uma alteração profunda na atenção concentrada de crianças e adolescentes. O consumo ininterrupto desse formato estimula a dependência química de dopamina cerebral e afeta a capacidade de processamento de textos longos. Sob a ótica da neurociência da linguagem, esse fenômeno resulta em:",
                a: "Atrofia da atenção profunda e comprometimento da leitura crítica de longa duração",
                d: ["Aumento imediato no QI verbal e aceleração na interpretação de textos literários clássicos", "Substituição integral da língua escrita pela linguagem de sinais universal de computadores", "Eliminação de desvios gramaticais informais devido ao uso de inteligência sintética", "Estabilidade perfeita na estrutura dos lobos frontais sem alterações sinápticas"],
                explanation: "Linguagem e Letramento Digital: Microvídeos treinam o cérebro para estímulos hiper-curtos de dopamina rápida, gerando fadiga e atrofia no processamento de leituras densas e profundas que exigem atenção sustentada.",
                hint: "A dopamina de curtíssimo prazo reduz o foco necessário para decodificar textos longos.",
                concept: "Letramento na Era de Microtelas"
            }
        ],
        ingles: [
            {
                q: "The rise of generative AI has sparked intense global debate. While some argue that artificial systems can replicate human creativity, others maintain that art requires an authentic conscious experience. Technology might mimic style, but it cannot feel the weight of existence.\n\nO fragmento de texto em inglês reflete sobre a ascensão da Inteligência Artificial Generativa. De acordo com o autor, o fator limitante que impede a tecnologia de replicar integralmente a arte humana é:",
                a: "A ausência de uma experiência consciente e sentimental genuína ligada à existência humana.",
                d: [
                    "A incapacidade de emular estilos estéticos clássicos do século XIX.",
                    "O alto custo de processamento energético dos data centers mundiais.",
                    "A ausência de algoritmos preditivos baseados na web semântica.",
                    "A restrição legal de direitos autorais imposta pelo Sul Global."
                ],
                explanation: "O texto afirma explicitamente que a tecnologia pode imitar estilos ('mimic style'), mas não consegue sentir o peso da existência ('cannot feel the weight of existence'), o que remete à experiência consciente e emocional humana.",
                hint: "Associe a incapacidade descrita ('cannot feel the weight of existence') com sentimentos e consciência humana.",
                concept: "Leitura Instrumental de IA"
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
                concept: "Identificação de Expressão"
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
                concept: "Identificação de Paradoxo"
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
                concept: "Tech Vocabulary — API"
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
                concept: "Tech Vocabulary — Debugging"
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
                concept: "Tech Vocabulary — Open Source"
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
                concept: "Tech Vocabulary — Networking"
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
                concept: "Tech Vocabulary — Agile & Scrum"
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
                concept: "Tech Vocabulary — Deployment & DevOps"
            }
        ]
    },

    QuestionEngine: {
        generateNewProceduralQuestion(subject, difficulty) {
            // Map every platform subject to a procedural generation group
            const subjectGroupMap = {
                // Linguagens
                portugues: 'linguagens', literatura: 'linguagens', ingles: 'ingles',
                artes: 'linguagens', educacao_fisica: 'linguagens',
                // Matemática
                algebra: 'matematica', geometria: 'matematica', estatistica: 'matematica',
                matematica_financeira: 'matematica',
                // Ciências da Natureza
                fisica: 'ciencias', quimica: 'ciencias', biologia: 'ciencias',
                // Ciências Humanas
                historia: 'humanas', geografia: 'humanas', filosofia: 'humanas', sociologia: 'humanas',
                // Itinerários / Tecnologia
                tecnologia: 'matematica', programacao: 'matematica', robotica: 'ciencias',
                empreendedorismo: 'humanas', ciencia_de_dados: 'matematica',
                inteligencia_artificial: 'ciencias', educacao_financeira: 'matematica',
                marketing_digital: 'humanas', desenvolvimento_jogos: 'matematica',
                seguranca_informacao: 'ciencias', design_digital: 'linguagens',
                producao_audiovisual: 'linguagens',
                // Extras
                biblioteca_digital: 'linguagens', laboratorio_virtual: 'ciencias',
                projeto_vida: 'humanas', inclusao_acessibilidade: 'linguagens'
            };
            const sub = subjectGroupMap[subject] || 'humanas';
            const diffs = ['easy', 'medium', 'hard'];
            const diff = diffs.includes(difficulty) ? difficulty : 'medium';
            
            const randomId = Math.floor(Math.random() * 1000000);
            let q = "";
            let a = "";
            let d = [];
            let concept = "BNCC-GEN";
            let explanation = "";
            let hint = "";
            
            if (sub === 'matematica') {
                const templates = [
                    () => {
                        const growth = 10 + Math.floor(Math.random() * 31); // 10% to 40%
                        const initial = 5 + Math.floor(Math.random() * 21); // 5 to 25 million
                        const year = 2024 + Math.floor(Math.random() * 3); // 2024 to 2026
                        const correctVal = (initial * (1 + growth / 100)).toFixed(2);
                        
                        q = `Uma edtech brasileira de inteligência artificial registrou uma taxa de crescimento anual de faturamento de ${growth}% no ano de ${year}. Sabendo que o faturamento da empresa no ano anterior era de R$ ${initial},00 milhões, o faturamento estimado alcançado nesta edição em milhões é igual a:`;
                        a = `R$ ${correctVal} milhões`;
                        d = [
                            `R$ ${(initial * (1 + (growth - 5) / 100)).toFixed(2)} milhões`,
                            `R$ ${(initial * (1 + (growth + 5) / 100)).toFixed(2)} milhões`,
                            `R$ ${(initial * 1.05).toFixed(2)} milhões`,
                            `R$ ${(initial * (1.10 + growth/100)).toFixed(2)} milhões`
                        ];
                        concept = "Matemática Financeira";
                        explanation = `Faturamento = Faturamento Anterior * (1 + Taxa de Crescimento). Portanto: ${initial} * (1 + ${growth}/100) = ${correctVal} milhões.`;
                        hint = "Utilize a fórmula padrão de juros compostos ou fator multiplicativo de acréscimo linear.";
                    },
                    () => {
                        const acc = 85 + Math.floor(Math.random() * 11); // 85% to 95%
                        const batch = 100 + Math.floor(Math.random() * 401); // 100 to 500
                        const correctVal = Math.round(batch * (acc / 100));
                        
                        q = `Um corretor automático por IA foi calibrado para analisar redações do ENEM. O motor possui uma taxa de acurácia comprovada de ${acc}% na identificação de desvios da Competência I. Ao avaliar um lote de ${batch} redações nesta rodada, o número aproximado de redações avaliadas com perfeita precisão estatística é:`;
                        a = `${correctVal} redações`;
                        d = [
                            `${correctVal - 15} redações`,
                            `${correctVal + 25} redações`,
                            `${Math.round(batch * 0.70)} redações`,
                            `${Math.round(batch * 0.50)} redações`
                        ];
                        concept = "Estatística Computacional";
                        explanation = `Quantidade de acertos estimados = Total de redações * Taxa de acurácia. Calculando: ${batch} * (${acc}/100) = ${correctVal} redações precisas.`;
                        hint = "Multiplique o tamanho total do lote pela taxa percentual de precisão da IA.";
                    },
                    () => {
                        const users = 50 + Math.floor(Math.random() * 151); // 50 to 200 users
                        const rate = 2 + Math.floor(Math.random() * 4); // 2 to 5 MB/s
                        const durationSec = 3600; // 1 hour
                        const correctVal = ((users * rate * durationSec) / 1024).toFixed(1);
                        
                        q = `Uma rede de laboratório escolar do Novo Ensino Médio consome uma média de ${rate} MB/s de tráfego de dados por segundo para cada um dos seus ${users} usuários ativos navegando na plataforma de simulados. O volume total acumulado de dados trafegados na rede em 1 hora de simulação contínua, expresso em Gigabytes (GB), é de aproximadamente:`;
                        a = `${correctVal} GB`;
                        d = [
                            `${(correctVal * 0.8).toFixed(1)} GB`,
                            `${(correctVal * 1.2).toFixed(1)} GB`,
                            `${(users * rate).toFixed(1)} GB`,
                            `${((users * rate * 60) / 1024).toFixed(1)} GB`
                        ];
                        concept = "Análise de Tráfego de Redes";
                        explanation = `Tráfego total = Usuários * Taxa de dados por segundo * Segundos em 1 hora. Portanto: ${users} * ${rate} MB/s * 3600s = ${users * rate * 3600} Megabytes. Convertendo para Gigabytes (dividindo por 1024) temos ${correctVal} GB.`;
                        hint = "Converta o tempo de 1 hora para segundos (3600s), calcule o tráfego em Megabytes e depois divida por 1024 para converter para Gigabytes.";
                    }
                ];
                templates[Math.floor(Math.random() * templates.length)]();
            } else if (sub === 'ciencias') {
                const templates = [
                    () => {
                        const massNaOH = 40 + Math.floor(Math.random() * 41); // 40g to 80g
                        const molesNaOH = (massNaOH / 40).toFixed(2); // NaOH molar mass = 40g/mol
                        const molesH2SO4 = (molesNaOH / 2).toFixed(2); // H2SO4 + 2NaOH -> Na2SO4 + 2H2O
                        
                        q = `Para tratar resíduos de descarte químico ácida contendo ácido sulfúrico (H₂SO₄), um laboratório de química adiciona exatamente ${massNaOH}g de hidróxido de sódio (NaOH) purificado para promover a neutralização completa. Sabendo que a reação balanceada é: H₂SO₄ + 2NaOH → Na₂SO₄ + 2H₂O. A quantidade de matéria em mols de H₂SO₄ que será completamente neutralizada por essa massa de base é igual a:`;
                        a = `${molesH2SO4} mols`;
                        d = [
                            `${molesNaOH} mols`,
                            `${(molesNaOH * 2).toFixed(2)} mols`,
                            `${(molesH2SO4 * 1.5).toFixed(2)} mols`,
                            `${(molesH2SO4 / 2).toFixed(2)} mols`
                        ];
                        concept = "Estequiometria e Neutralização";
                        explanation = `Massa molar do NaOH = 40g/mol. Número de mols de NaOH = ${massNaOH}g / 40g/mol = ${molesNaOH} mols. Pela estequiometria 1:2, o número de mols de ácido neutralizado é a metade da base: ${molesNaOH} / 2 = ${molesH2SO4} mols de H₂SO₄.`;
                        hint = "Converta primeiro a massa de NaOH para mols usando sua massa molar (40g/mol) e observe a proporção molar de 1 para 2 da equação química balanceada.";
                    },
                    () => {
                        const area = 2 + Math.floor(Math.random() * 5); // 2 to 6 m²
                        const solarRad = 800 + Math.floor(Math.random() * 401); // 800 to 1200 W/m²
                        const efficiency = 15 + Math.floor(Math.random() * 11); // 15% to 25%
                        const correctVal = Math.round(area * solarRad * (efficiency / 100));
                        
                        q = `Um painel solar fotovoltaico de ${area} m² de área é instalado no teto de um laboratório verde escolar. A irradiação solar média local no momento é de ${solarRad} W/m² e a eficiência de conversão elétrica das células de silício é de ${efficiency}%. A potência elétrica útil gerada pelo painel sob essas condições de iluminação é de:`;
                        a = `${correctVal} W`;
                        d = [
                            `${Math.round(area * solarRad)} W`,
                            `${Math.round(area * solarRad * 0.50)} W`,
                            `${correctVal - 80} W`,
                            `${correctVal + 120} W`
                        ];
                        concept = "Termodinâmica e Energia Solar";
                        explanation = `Potência Útil = Área * Irradiação * Eficiência. Calculando: ${area} * ${solarRad} * (${efficiency}/100) = ${correctVal} Watts de potência útil gerada.`;
                        hint = "Multiplique a irradiação solar incidente pela área do painel para obter a potência total recebida, e então aplique a taxa percentual de eficiência de conversão.";
                    },
                    () => {
                        const baseTemp = 20 + Math.floor(Math.random() * 11); // 20 to 30 C
                        const factor = 1.5 + (Math.random() * 1.5); // 1.5 to 3.0
                        const cycles = 3 + Math.floor(Math.random() * 3); // 3 to 5 cycles
                        const finalPop = Math.round(100 * Math.pow(factor, cycles));
                        
                        q = `Em um experimento biológico sobre dispersão epidêmica em alta temperatura, uma cultura inicial de 100 bactérias ectotérmicas patogênicas é submetida a um estresse térmico controlado de ${baseTemp}°C. A população bacteriana cresce de acordo com a progressão geométrica exponencial $P(t) = 100 \\cdot (${factor.toFixed(1)})^{t}$ a cada ciclo t de incubação. O número total de bactérias esperado após ${cycles} ciclos t de exposição contínua é de:`;
                        a = `${finalPop} bactérias`;
                        d = [
                            `${finalPop - 120} bactérias`,
                            `${finalPop + 250} bactérias`,
                            `${Math.round(100 * factor * cycles)} bactérias`,
                            `${finalPop * 2} bactérias`
                        ];
                        concept = "Cinética e Reprodução Microbiana";
                        explanation = `População final = População Inicial * Fator^Ciclos. Portanto: 100 * (${factor.toFixed(1)})^${cycles} = ${finalPop} bactérias ativas.`;
                        hint = "Eleve o fator multiplicativo de crescimento bacteriano ao expoente que representa os ciclos e depois multiplique pelo tamanho da população inicial.";
                    }
                ];
                templates[Math.floor(Math.random() * templates.length)]();
            } else if (sub === 'humanas') {
                const templates = [
                    () => {
                        const philosopher = ["Zygmunt Bauman", "Michel Foucault", "Karl Marx", "Immanuel Kant"][Math.floor(Math.random() * 4)];
                        const topic = ["Modernidade Líquida", "Biopoder e Vigilância", "Alienação do Trabalho", "Imperativo Categórico"][["Zygmunt Bauman", "Michel Foucault", "Karl Marx", "Immanuel Kant"].indexOf(philosopher)];
                        
                        q = `No contexto sociopolítico atual de rápidas mudanças impulsionadas pelas tecnologias digitais, a perda de vínculos sociais estáveis e a volatilidade das relações de consumo são temas centrais de reflexão. A teoria que analisa essa fragmentação social contemporânea das instituições e a fragilidade das relações humanas sob o conceito de "${topic}" foi formulada por qual pensador clássico/contemporâneo?`;
                        a = philosopher;
                        d = [
                            "Émile Durkheim",
                            "Max Weber",
                            "Auguste Comte",
                            philosopher === "Karl Marx" ? "Michel Foucault" : "Karl Marx"
                        ];
                        concept = "Teoria Sociológica Contemporânea";
                        explanation = `A teoria de "${topic}" que discute a fragmentação das relações e instituições na atualidade é uma marca da obra do pensador ${philosopher}.`;
                        hint = "Associe o conceito filosófico do tema líquido, de controle corporal ou de mais-valia industrial ao autor clássico correspondente.";
                    },
                    () => {
                        const city = ["Belém (COP30)", "São Paulo", "Rio de Janeiro", "Curitiba"][Math.floor(Math.random() * 4)];
                        
                        q = `A reestruturação urbana de grandes centros urbanos brasileiros, a exemplo das intervenções em infraestrutura e governança na cidade de ${city}, reflete a integração dos espaços locais aos fluxos globais da chamada globalização. Esse fenômeno geográfico e socioeconômico frequentemente gera contradições marcadas por qual impacto socioespacial estrutural?`;
                        a = "Segregação socioespacial e gentrificação de bairros históricos com exclusão de populações de baixa renda";
                        d = [
                            "Distribuição homogênea de renda e democratização integral de todos os territórios periféricos",
                            "Descentralização absoluta de redes de transporte rodoviário com eliminação de veículos elétricos",
                            "Redução drástica no custo de moradia nas áreas centrais com incentivo à agricultura camponesa",
                            "Eliminação completa de conexões virtuais com redes de satélite internacionais"
                        ];
                        concept = "Geografia Urbana e Globalização";
                        explanation = "A modernização urbana voltada a atrair investimentos globais causa a valorização imobiliária desproporcional (gentrificação) e empurra os moradores tradicionais de baixa renda para as periferias (segregação).";
                        hint = "Pense na contradição clássica da valorização imobiliária que encarece o custo de vida e exclui os mais pobres.";
                    },
                    () => {
                        q = "A aprovação da Lei de Diretrizes e Bases da Educação Nacional (LDB) e as diretrizes curriculares da BNCC no Brasil buscam unificar competências para preparar os estudantes para o mercado de trabalho digital. Sob o ponto de vista histórico-crítico, a adequação de currículos escolares às necessidades da divisão técnica do trabalho do mercado capitalista atende a qual modelo de desenvolvimento socioeconômico?";
                        a = "Tecnicismo e instrumentalização do aprendizado focado na produtividade industrial e corporativa";
                        d = [
                            "Humanismo integral focado no ócio criativo clássico grego de contemplação pura",
                            "Educação libertadora freireana baseada na superação de classes sem especialização técnica",
                            "Anarquismo pedagógico de autogestão absoluta das salas de aula sem avaliações estatais",
                            "Escolástica medieval clássica focada na exegese teológica dogmática"
                        ];
                        concept = "História da Educação no Brasil";
                        explanation = "O alinhamento curricular voltado exclusivamente a preencher postos de trabalho e atender à eficiência operacional caracteriza o modelo tecnicista-instrumental da pedagogia produtivista.";
                        hint = "O modelo focado na produtividade e eficácia técnica das competências do mercado chama-se tecnicismo.";
                    }
                ];
                templates[Math.floor(Math.random() * templates.length)]();
            } else if (sub === 'linguagens') {
                const templates = [
                    () => {
                        q = "Considere o enunciado: 'Se a Inteligência Artificial serve como potente assistente cognitivo, sua autonomia irrestrita pode eclipsar a autoria intelectual dos estudantes.' A conjunção oracional 'Se' empregada na frase acima estabelece uma relação de sentido de:";
                        a = "Condição, indicando a hipótese para a ocorrência do fato principal apresentado na oração subsequente";
                        d = [
                            "Concessão, atenuando o contraste óbvio entre as ideias expostas nas duas orações",
                            "Causa, justificando o motivo biológico do desenvolvimento intelectual humano",
                            "Tempo, sinalizando o momento cronológico exato em que a tecnologia foi programada",
                            "Conseqüência, revelando o efeito consumado das práticas escolares regulamentadas"
                        ];
                        concept = "Sintaxe de Períodos Compostos";
                        explanation = "A conjunção subordinativa 'Se' introduz uma oração condicional, representando uma condição/hipótese para que o efeito de eclipsar a autoria ocorra.";
                        hint = "Substitua a conjunção 'Se' por 'Caso' e note a estrutura de hipótese condicional.";
                    },
                    () => {
                        q = "A proliferação de gêneros digitais textuais (como memes, podcasts escolares, infográficos interativos e microvídeos informativos) no Novo Ensino Médio exige um letramento de mídia avançado dos estudantes. A característica essencial que define a linguagem desses novos genres textuais no ambiente de redes digitais é:";
                        a = "Multimodalidade, integrando linguagem verbal escrita com recursos sonoros, visuais e cinéticos";
                        d = [
                            "Monocromia, restringindo a comunicação a caracteres alfanuméricos estritamente formais",
                            "Linearidade clássica rígida, impedindo a navegação por hiperlinks ou atalhos multimídia",
                            "Oralidade pura informal, vedando qualquer tipo de registro ou escrita ortográfica regulamentar",
                            "Ausência de intencionalidade discursiva ou de apelo argumentativo ao interlocutor"
                        ];
                        concept = "Gêneros Textuais e Letramento Digital";
                        explanation = "Gêneros textuais digitais utilizam diferentes modos de representação simultâneos (texto, imagem, áudio, animação), caracterizando a multimodalidade textual.";
                        hint = "Considere a fusão de textos verbais, imagens, áudios e vídeos operando juntos em um mesmo post.";
                    },
                    () => {
                        q = "Em campanhas oficiais de conscientização estudantil sobre saúde mental e cyberbullying nas redes escolares, costuma-se empregar predominantemente a Função Conativa (ou Apelativa) da linguagem. A marca gramatical e estilística que atesta a presença dessa função nos textos de propaganda é o uso frequente de:";
                        a = "Verbos no imperativo e pronomes de segunda pessoa com o objetivo de persuadir e direcionar a conduta do leitor";
                        d = [
                            "Vocabulário denotativo estritamente objetivo focado em descrever fatos científicos de terceiros",
                            "Metáforas herméticas e rimas ricas com foco exclusivo na estética e sonoridade poética da mensagem",
                            "Interrogações existenciais em tom melancólico expressando sentimentos íntimos do próprio emissor",
                            "Termos técnicos e jargões computacionais sem menção ao receptor da informação"
                        ];
                        concept = "Funções da Linguagem";
                        explanation = "A função conativa (ou apelativa) foca no receptor, buscando influenciar seu comportamento. Suas marcas típicas são verbos no imperativo (ex: 'participe', 'ajude') e pronomes direcionados ao leitor.";
                        hint = "Pense na linguagem publicitária ou de campanhas que estimulam o leitor a tomar uma ação direta.";
                    }
                ];
                templates[Math.floor(Math.random() * templates.length)]();
            } else if (sub === 'ingles') {
                const templates = [
                    () => {
                        q = "Generative AI systems are developing at an unprecedented speed, reshaping the future of labor. Many routine tasks are being automated, raising worries about job displacement. However, technology also creates opportunities, demanding new cognitive skills and technological adaptation.\n\nO parágrafo em inglês analisa o impacto das IAs generativas no mercado de trabalho. De acordo com o texto, a ascensão tecnológica acarreta simultaneamente:";
                        a = "Preocupações com a perda de empregos rotineiros e o surgimento de novas oportunidades que exigem letramento digital";
                        d = [
                            "O fim absoluto das carreiras industriais periféricas e a estagnação salarial do Norte Global",
                            "A proibição legal das redes preditivas e o retorno exclusivo ao comércio têxtil artesanal",
                            "O aumento na imigração ilegal europeia devido à atrofia de computadores corporativos",
                            "Uma estagnação completa na produção de softwares proprietários sem código aberto"
                        ];
                        concept = "Interpretative Synthesis";
                        explanation = "O autor explica que enquanto tarefas rotineiras são automatizadas gerando temores de perda de empregos ('job displacement'), oportunidades são geradas exigindo adaptação e habilidades ('opportunities demanding new skills').";
                        hint = "Conecte os conceitos de ameaça ('worries about job displacement') e oportunidade ('creates opportunities') expressos no fragmento.";
                    },
                    () => {
                        q = "E-waste represents one of the fastest-growing environmental challenges of our time. Every year, millions of electronic devices are discarded, releasing toxic heavy metals into the soil. Promoting a circular economy is key to reclaiming valuable resources and protecting local communities.\n\nO excerto em inglês aborda o descarte contínuo de lixo eletrônico. A solução apontada pelo autor para mitigar a liberação de metais tóxicos reside em:";
                        a = "Promover a economia circular para recuperar recursos valiosos e proteger as comunidades locais";
                        d = [
                            "Aumentar as tarifas alfandegárias de aparelhos celulares importados pela ONU",
                            "Enterrar o lixo tecnológico exclusivamente nas regiões frias do hemisfério Sul",
                            "Suspender a fabricação de componentes de cobre e silício industriais",
                            "Eliminar os impostos incidentes sobre combustíveis fósseis"
                        ];
                        concept = "Vocabulary & Text Solutions";
                        explanation = "O texto afirma diretamente que promover uma economia circular ('circular economy') é a chave ('is key') para recuperar recursos valiosos e proteger as populações locais.";
                        hint = "Busque o trecho final que apresenta a solução recomendada pelo autor ('Promoting a circular economy is key...').";
                    },
                    () => {
                        q = "Youth climate activists are no longer waiting for governmental action. By organizing massive global strikes and leveraging digital media, they have forced environmental policies to the forefront of international debate. Action, they argue, is a moral imperative.\n\nConsiderando a atuação política dos ativistas climáticos juvenis expressa no fragmento em inglês, o principal recurso prático utilizado por eles para pautar o debate internacional foi:";
                        a = "Organizar greves globais em massa e utilizar estrategicamente as mídias digitais de comunicação";
                        d = [
                            "Financiar a abertura de empresas privadas de exploração mineral na Amazônia",
                            "Votar em tratados de livre comércio restritos à exportação de algodão",
                            "Recusar o uso de aparelhos de telefonia móvel e conexões virtuais",
                            "Boicotar a entrada de novos estudantes em cursos de graduação clássicos"
                        ];
                        concept = "Political & Social Reading";
                        explanation = "O autor lista explicitamente que eles atuaram através de 'global strikes' (greves globais) e 'leveraging digital media' (alavancando/usando as mídias digitais).";
                        hint = "Associe as expressões 'global strikes' e 'leveraging digital media' com greves coletivas e redes de comunicação social.";
                    },
                    () => {
                        q = "An API, or Application Programming Interface, acts as a bridge between two software systems. It defines rules for how applications communicate, allowing developers to use external services without knowing their internal code. REST APIs use standard HTTP methods like GET, POST, PUT, and DELETE.\n\nCom base no texto técnico em inglês, qual é a função essencial de uma API REST?";
                        a = "Definir as regras de comunicação entre sistemas usando métodos HTTP, sem exigir conhecimento do código interno.";
                        d = [
                            "Armazenar fisicamente os dados do usuário em servidores locais protegidos por firewall.",
                            "Renderizar a interface gráfica de botões e formulários visíveis ao usuário final.",
                            "Criptografar arquivos de banco de dados para impedir ataques de ransomware.",
                            "Substituir o sistema operacional por um ambiente virtual de desenvolvimento."
                        ];
                        concept = "Tech Vocabulary — API & REST";
                        explanation = "O texto descreve a API como uma 'ponte' ('bridge') com regras de comunicação ('rules for how applications communicate') usando métodos HTTP como GET e POST, sem necessidade de conhecer o código interno.";
                        hint = "REST usa verbos HTTP: GET (buscar), POST (criar), PUT (atualizar), DELETE (apagar).";
                    },
                    () => {
                        q = "Version control systems like Git allow developers to track changes in their codebase, collaborate with teammates, and revert to previous states when bugs are introduced. A 'commit' saves a snapshot of the current code, while a 'branch' allows isolated development of new features.\n\nNo contexto do texto em inglês sobre controle de versão, o que um 'branch' no Git permite ao desenvolvedor?";
                        a = "Desenvolver novas funcionalidades de forma isolada sem afetar o código principal do projeto.";
                        d = [
                            "Apagar definitivamente versões antigas do código para economizar espaço em disco.",
                            "Publicar o software diretamente na loja de aplicativos sem revisão de código.",
                            "Bloquear outros desenvolvedores de acessar o repositório durante a programação.",
                            "Converter automaticamente o código-fonte em linguagem de máquina compilada."
                        ];
                        concept = "Tech Vocabulary — Git & Version Control";
                        explanation = "O texto explica que um 'branch' permite 'isolated development of new features' (desenvolvimento isolado de novas funcionalidades), enquanto um 'commit' salva um instantâneo ('snapshot') do estado atual do código.";
                        hint = "'Branch' = galho/ramo. É como criar um ramo separado da árvore principal para testar algo novo.";
                    },
                    () => {
                        q = "Cloud computing enables organizations to access computing resources — servers, storage, databases, and networking — over the internet, on demand, without owning physical infrastructure. The three main service models are IaaS (Infrastructure), PaaS (Platform), and SaaS (Software), each offering different levels of control.\n\nDe acordo com o texto técnico em inglês, qual é a principal vantagem da computação em nuvem para as organizações?";
                        a = "Acessar recursos computacionais sob demanda pela internet, sem necessidade de possuir infraestrutura física própria.";
                        d = [
                            "Eliminar a necessidade de conexão à internet ao processar todos os dados localmente.",
                            "Garantir que apenas um usuário por vez possa acessar os servidores do sistema.",
                            "Obrigar as empresas a comprar e manter seus próprios data centers físicos.",
                            "Substituir programadores humanos por sistemas autônomos de inteligência artificial."
                        ];
                        concept = "Tech Vocabulary — Cloud Computing";
                        explanation = "O texto define cloud computing como acesso a recursos ('access computing resources') pela internet ('over the internet') sob demanda ('on demand'), sem possuir infraestrutura física ('without owning physical infrastructure').";
                        hint = "'Cloud' = nuvem. Os dados e programas ficam em servidores remotos, não no seu computador.";
                    },
                    () => {
                        q = "Cybersecurity is the practice of protecting systems, networks, and programs from digital attacks. These attacks often aim to access, change, or destroy sensitive information. Common threats include phishing, ransomware, and SQL injection. A strong security posture requires both technical defenses and user awareness training.\n\nSegundo o texto em inglês sobre cibersegurança, quais são os principais objetivos dos ataques digitais?";
                        a = "Acessar, alterar ou destruir informações sensíveis de sistemas e redes vulneráveis.";
                        d = [
                            "Aumentar a velocidade de processamento de servidores por meio de scripts automatizados.",
                            "Instalar atualizações de software para corrigir falhas de desempenho em produção.",
                            "Distribuir gratuitamente sistemas operacionais de código aberto para usuários finais.",
                            "Criar backups automáticos de dados em ambientes de nuvem privada corporativa."
                        ];
                        concept = "Tech Vocabulary — Cybersecurity";
                        explanation = "O texto afirma que os ataques 'often aim to access, change, or destroy sensitive information' (acessar, alterar ou destruir informações sensíveis), listando ameaças como phishing, ransomware e SQL injection.";
                        hint = "Foque no trecho 'access, change, or destroy sensitive information' para identificar os objetivos dos ataques.";
                    }
                ];
                templates[Math.floor(Math.random() * templates.length)]();
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
                rawAns: a,
                rawDistractors: d
            };
        },

        async generateQuestions(userId, subject, difficulty, count = 10) {
            let pool = [];

            // ── TIER 1: OnyxDBManager (IndexedDB indexado — mais rápido) ────────
            if (window.OnyxDBManager) {
                try {
                    const banked = await window.OnyxDBManager.getPool(subject, difficulty);
                    if (banked.length > 0) {
                        pool = banked;
                        console.log(`[QuestionEngine] DBManager: ${pool.length} questões para ${subject}/${difficulty}`);
                    }
                } catch(e) { console.warn('[QuestionEngine] DBManager falhou, usando fallback.', e); }
            }

            // ── TIER 2: TrendSensingDatabase (questões contextuais curadas) ─────
            if (pool.length < count) {
                const trendDB = window.OnyxEngines.TrendSensingDatabase || {};
                const hasTrend = trendDB[subject] && trendDB[subject].length > 0;
                if (hasTrend || window.currentSimulateEdition === 'trends') {
                    pool = [...pool, ...(trendDB[subject] || [])];
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

            // ── Deduplicar ───────────────────────────────────────────────────────
            const seenText = new Set();
            pool = pool.filter(item => {
                if (item && item.q && !seenText.has(item.q)) {
                    seenText.add(item.q);
                    return true;
                }
                return false;
            });

            if (pool.length === 0) return [];

            // ── Anti-Repetição Adaptativa ────────────────────────────────────────
            let stats = { seenQuestions: [] };
            if (userId && window.OnyxCore) {
                const fetched = await window.OnyxCore.DB.getUser(userId);
                if (fetched) stats = fetched;
                if (!stats.seenQuestions) stats.seenQuestions = [];
            }

            let unseenPool = pool.filter(q => !stats.seenQuestions.includes(q.q));

            // ── Geração Procedural sob demanda (deficit) ─────────────────────────
            if (unseenPool.length < count) {
                const deficit = count - unseenPool.length;
                const newRaw = [];
                for (let i = 0; i < deficit; i++) {
                    const gen = window.OnyxEngines.QuestionEngine.generateNewProceduralQuestion(subject, difficulty);
                    const fmt = {
                        q: gen.rawQText, a: gen.rawAns, d: gen.rawDistractors,
                        explanation: gen.explanation, hint: gen.hint, concept: gen.concept
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
                questions.push({
                    id: pick.q,
                    text: `[ONYX PROTOCOL] ${subject.toUpperCase()} (${difficulty.toUpperCase()}):\n${pick.q}`,
                    options: options,
                    correct: options.indexOf(pick.a),
                    explanation: pick.explanation || `Explicando a competência: ${pick.q}`,
                    hint: pick.hint || 'Revise a analogia sugerida pelo OnyxTutor para responder com clareza.',
                    concept: pick.concept || 'BNCC-CORE'
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
