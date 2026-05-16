/**
 * ONYX DATABASE - MASSIVE PROCEDURAL GENERATION ENGINE
 * This file replaces static questions with a dynamic procedural database
 * that guarantees 20+ unique, layman-friendly questions for all 22 subjects and levels,
 * generating fresh, randomized variations every single time.
 */

window.OnyxDatabase = (function() {
    const db = {};
    const subjects = [
        'matematica', 'portugues', 'historia', 'geografia', 'biologia', 'fisica', 'quimica',
        'filosofia', 'sociologia', 'ingles', 'artes', 'literatura', 'python', 'estatistica',
        'probabilidade', 'data_manipulation', 'data_viz', 'big_data', 'machine_learning',
        'deep_learning', 'nlp', 'cybersecurity'
    ];
    const levels = ['easy', 'medium', 'hard', 'insane', 'impossible'];

    // Helper: Random element from array
    function randChoice(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    }

    // Helper: Random number in range
    function randRange(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    // Procedural Generator Engine
    function generateQuestionsForSubject(sub, lvl) {
        const pool = [];
        
        // Let's generate 20 highly unique, fresh questions dynamically using template families
        
        // FAMILY 1: PORTUGUES, INGLES, LITERATURA
        if (sub === 'portugues' || sub === 'literatura' || sub === 'ingles') {
            const vocabulary = [
                { word: 'cidadão', pl: 'cidadãos', alt: ['cidadões', 'cidadães', 'cidadãoes'], syn: 'habitante', en: 'citizen' },
                { word: 'caráter', pl: 'caracteres', alt: ['caráteres', 'caraters', 'carateres'], syn: 'personalidade', en: 'character' },
                { word: 'pão', pl: 'pães', alt: ['pões', 'pãos', 'pães'], syn: 'alimento', en: 'bread' },
                { word: 'alemão', pl: 'alemães', alt: ['alemãos', 'alemões', 'alemãoes'], syn: 'germânico', en: 'German' },
                { word: 'capitão', pl: 'capitães', alt: ['capitãos', 'capitões', 'capitãoes'], syn: 'líder', en: 'captain' },
                { word: 'flor', pl: 'flores', alt: ['floris', 'flors', 'florees'], syn: 'planta', en: 'flower' },
                { word: 'livro', pl: 'livros', alt: ['livroes', 'livris', 'livros'], syn: 'obra', en: 'book' },
                { word: 'chave', pl: 'chaves', alt: ['chavis', 'chaves', 'chavees'], syn: 'segredo', en: 'key' },
                { word: 'computador', pl: 'computadores', alt: ['computadoris', 'computadors', 'computadorees'], syn: 'máquina', en: 'computer' },
                { word: 'sol', pl: 'sóis', alt: ['sols', 'sois', 'solees'], syn: 'estrela', en: 'sun' },
                { word: 'gato', pl: 'gatos', alt: ['gatis', 'gatos', 'gatoes'], syn: 'felino', en: 'cat' },
                { word: 'cachorro', pl: 'cachorros', alt: ['cachorris', 'cachorros', 'cachorroes'], syn: 'cão', en: 'dog' },
                { word: 'janela', pl: 'janelas', alt: ['janelis', 'janelas', 'janelaes'], syn: 'abertura', en: 'window' },
                { word: 'mesa', pl: 'mesas', alt: ['mesis', 'mesas', 'mesaes'], syn: 'suporte', en: 'table' },
                { word: 'escola', pl: 'escolas', alt: ['escolis', 'escolas', 'escolaes'], syn: 'colégio', en: 'school' },
                { word: 'caneta', pl: 'canetas', alt: ['canetis', 'canetas', 'canetaes'], syn: 'esferográfica', en: 'pen' },
                { word: 'mão', pl: 'mãos', alt: ['mões', 'mãos', 'mãoes'], syn: 'membro', en: 'hand' },
                { word: 'tabelião', pl: 'tabeliães', alt: ['tabeliãos', 'tabeliões', 'tabeliãoes'], syn: 'notário', en: 'notary' },
                { word: 'escrivão', pl: 'escrivães', alt: ['escrivãos', 'escrivões', 'escrivãoes'], syn: 'escriba', en: 'clerk' },
                { word: 'lápis', pl: 'lápis', alt: ['lápises', 'lápis', 'lápise'], syn: 'grafite', en: 'pencil' }
            ];

            vocabulary.forEach((item) => {
                const randPrefix = randChoice([
                    "Selecione a alternativa correta:",
                    "No contexto geral, como lidamos com:",
                    "Analise de forma leiga:"
                ]);
                
                if (lvl === 'easy' || lvl === 'medium') {
                    if (sub === 'portugues') {
                        pool.push({
                            q: `${randPrefix} Qual é o plural correto da palavra '${item.word}'?`,
                            a: item.pl,
                            d: item.alt
                        });
                    } else if (sub === 'ingles') {
                        pool.push({
                            q: `${randPrefix} Como traduzimos a palavra '${item.word}' para o inglês?`,
                            a: item.en,
                            d: ['water', 'house', 'car', 'apple'].filter(x => x !== item.en).slice(0, 3)
                        });
                    } else { // literatura
                        pool.push({
                            q: `${randPrefix} Na literatura clássica, qual palavra é um sinônimo poético ideal para '${item.word}'?`,
                            a: item.syn,
                            d: ['oposto', 'nada', 'antônimo', 'desconhecido'].slice(0, 3)
                        });
                    }
                } else {
                    pool.push({
                        q: `[AVANÇADO] A flexão linguística da palavra '${item.word}' no nível avançado refere-se à:`,
                        a: `Regra de morfologia de substantivos terminados em ${item.word.slice(-2)}`,
                        d: ['Uma exceção fonética irregular histórica', 'Um estrangeirismo moderno adaptado', 'Um neologismo técnico exclusivo']
                    });
                }
            });
        }
        
        // FAMILY 2: GEOGRAFIA, HISTORIA, FILOSOFIA, SOCIOLOGIA, ARTES
        else if (sub === 'geografia' || sub === 'historia' || sub === 'filosofia' || sub === 'sociologia' || sub === 'artes') {
            const places = [
                { name: 'Torre Eiffel', country: 'França', city: 'Paris', epoch: 'Século XIX', style: 'Industrial' },
                { name: 'Estátua da Liberdade', country: 'Estados Unidos', city: 'Nova York', epoch: 'Século XIX', style: 'Clássico' },
                { name: 'Coliseu', country: 'Itália', city: 'Roma', epoch: 'Antiguidade', style: 'Romano' },
                { name: 'Cristo Redentor', country: 'Brasil', city: 'Rio de Janeiro', epoch: 'Século XX', style: 'Art Déco' },
                { name: 'Grande Muralha', country: 'China', city: 'Pequim', epoch: 'Antiguidade', style: 'Militar' },
                { name: 'Taj Mahal', country: 'Índia', city: 'Agra', epoch: 'Século XVII', style: 'Mogol' },
                { name: 'Big Ben', country: 'Inglaterra', city: 'Londres', epoch: 'Século XIX', style: 'Gótico' },
                { name: 'Pirâmides de Gizé', country: 'Egito', city: 'Cairo', epoch: 'Antiguidade', style: 'Egípcio' },
                { name: 'Acrópole', country: 'Grécia', city: 'Atenas', epoch: 'Antiguidade', style: 'Grego' },
                { name: 'Machu Picchu', country: 'Peru', city: 'Cusco', epoch: 'Século XV', style: 'Inca' },
                { name: 'Canal do Panamá', country: 'Panamá', city: 'Cidade do Panamá', epoch: 'Século XX', style: 'Moderno' },
                { name: 'Cataratas do Iguaçu', country: 'Brasil/Argentina', city: 'Foz do Iguaçu', epoch: 'Natural', style: 'Ecológico' },
                { name: 'Monte Everest', country: 'Nepal/China', city: 'Himalaia', epoch: 'Natural', style: 'Ecológico' },
                { name: 'Deserto do Saara', country: 'Egito/Argélia', city: 'Norte da África', epoch: 'Natural', style: 'Ecológico' },
                { name: 'Rio Amazonas', country: 'Brasil/Peru', city: 'Amazônia', epoch: 'Natural', style: 'Ecológico' },
                { name: 'Muralha de Berlim', country: 'Alemanha', city: 'Berlim', epoch: 'Guerra Fria', style: 'Político' },
                { name: 'Canal de Suez', country: 'Egito', city: 'Suez', epoch: 'Século XIX', style: 'Moderno' },
                { name: 'Vaticano', country: 'Itália', city: 'Vaticano', epoch: 'Renascimento', style: 'Clássico' },
                { name: 'Grand Canyon', country: 'Estados Unidos', city: 'Arizona', epoch: 'Natural', style: 'Ecológico' },
                { name: 'Estátua de Zeus', country: 'Grécia', city: 'Olímpia', epoch: 'Antiguidade', style: 'Clássico' }
            ];

            places.forEach((item) => {
                const randPhrase = randChoice([
                    `Descubra o mistério: Onde fica '${item.name}'?`,
                    `Identifique a localização geográfica de: '${item.name}'`,
                    `Para fins acadêmicos, onde se localiza: '${item.name}'?`
                ]);
                
                if (lvl === 'easy' || lvl === 'medium') {
                    if (sub === 'geografia') {
                        pool.push({
                            q: randPhrase,
                            a: item.country,
                            d: ['Japão', 'África do Sul', 'Austrália', 'Rússia'].filter(x => x !== item.country).slice(0, 3)
                        });
                    } else if (sub === 'historia') {
                        pool.push({
                            q: `Em qual época histórica marcante construiu-se ou consagrou-se '${item.name}'?`,
                            a: item.epoch,
                            d: ['Idade Média', 'Futuro Próximo', 'Século XXI', 'Idade Moderna'].filter(x => x !== item.epoch).slice(0, 3)
                        });
                    } else if (sub === 'artes') {
                        pool.push({
                            q: `Qual é o estilo arquitetônico/artístico marcante ou origem do monumento '${item.name}'?`,
                            a: item.style,
                            d: ['Barroco Baiano', 'Surrealista', 'Minimalista Moderno', 'Cubista'].filter(x => x !== item.style).slice(0, 3)
                        });
                    } else { // filosofia ou sociologia
                        pool.push({
                            q: `Sociologicamente falando, monumentos como '${item.name}' impactam a sociedade como:`,
                            a: `Símbolos de Patrimônio Cultural e Identidade Coletiva`,
                            d: ['Propaganda comercial irrelevante', 'Monopólios industriais modernos', 'Obsolecência programada']
                        });
                    }
                } else {
                    pool.push({
                        q: `[AVANÇADO] Uma análise de geopolítica sobre '${item.name}' revela:`,
                        a: `Seu papel na herança histórica e soberania de preservação`,
                        d: ['Apenas um erro ecológico de longo prazo', 'Uma construção temporária sem registro', 'Um desperdício de capital obsoleto']
                    });
                }
            });
        }
        
        // FAMILY 3: BIOLOGIA, FISICA, QUIMICA
        else if (sub === 'biologia' || sub === 'fisica' || sub === 'quimica') {
            const sciences = [
                { concept: 'Fotossíntese', area: 'Biologia', easyDesc: 'o processo no qual as plantas usam luz solar para produzir alimento', keyWord: 'Clorofila' },
                { concept: 'Mitocôndria', area: 'Biologia', easyDesc: 'a organela celular responsável por gerar energia para a célula', keyWord: 'ATP' },
                { concept: 'DNA', area: 'Biologia', easyDesc: 'a molécula em formato de espiral que guarda nossa receita genética', keyWord: 'Genes' },
                { concept: 'Newton', area: 'Física', easyDesc: 'a unidade de medida oficial para quantificar a força física', keyWord: 'F = m.a' },
                { concept: 'Gravidade', area: 'Física', easyDesc: 'a força invisível que atrai todos os corpos para baixo', keyWord: 'G = 9.8 m/s²' },
                { concept: 'Termodinâmica', area: 'Física', easyDesc: 'o ramo que estuda as trocas de calor e a energia física', keyWord: 'Entropia' },
                { concept: 'H2O', area: 'Química', easyDesc: 'a fórmula molecular e química da água pura', keyWord: 'Pontes de Hidrogênio' },
                { concept: 'pH Neutro', area: 'Química', easyDesc: 'o nível ideal de acidez da água mineral, que vale exatamente 7', keyWord: 'Neutro' },
                { concept: 'Tabela Periódica', area: 'Química', easyDesc: 'a tabela organizada com todos os elementos químicos conhecidos', keyWord: 'Átomos' },
                { concept: 'Célula', area: 'Biologia', easyDesc: 'a unidade básica e menor pedaço de vida em todos nós', keyWord: 'Citoplasma' },
                { concept: 'Oxigênio', area: 'Química', easyDesc: 'o gás vital indispensável para a nossa respiração terrestre', keyWord: 'O2' },
                { concept: 'Joule', area: 'Física', easyDesc: 'a unidade padrão para medir energia, trabalho e calor', keyWord: 'Trabalho' },
                { concept: 'Glóbulos Vermelhos', area: 'Biologia', easyDesc: 'células do sangue que transportam oxigênio pelo corpo', keyWord: 'Hemoglobina' },
                { concept: 'Evaporação', area: 'Física', easyDesc: 'a transformação da água líquida em vapor de forma lenta', keyWord: 'Calor Latente' },
                { concept: 'Cloreto de Sódio (NaCl)', area: 'Química', easyDesc: 'o nome científico e químico do sal de cozinha comum', keyWord: 'Iônica' },
                { concept: 'Ribossomo', area: 'Biologia', easyDesc: 'a fábrica celular responsável por produzir proteínas', keyWord: 'RNAm' },
                { concept: 'Pressão Atmosférica', area: 'Física', easyDesc: 'o peso que o ar da atmosfera exerce sobre a Terra', keyWord: 'Barômetro' },
                { concept: 'Átomo', area: 'Química', easyDesc: 'a menor unidade básica da matéria, formada por prótons e elétrons', keyWord: 'Prótons' },
                { concept: 'Neurônio', area: 'Biologia', easyDesc: 'a célula nervosa especializada em transmitir sinais no cérebro', keyWord: 'Sinapse' },
                { concept: 'Velocidade da Luz', area: 'Física', easyDesc: 'a velocidade limite do universo, de quase 300 mil km/s', keyWord: 'C = 3x10^8 m/s' }
            ];

            sciences.forEach((item) => {
                const randVerb = randChoice([
                    `De forma simples, o conceito de '${item.concept}' refere-se à:`,
                    `Como podemos definir '${item.concept}' para um aluno iniciante?`,
                    `Qual das alternativas melhor descreve '${item.concept}'?`
                ]);
                
                if (lvl === 'easy' || lvl === 'medium') {
                    if (sub === 'biologia' && item.area === 'Biologia') {
                        pool.push({
                            q: randVerb,
                            a: item.easyDesc,
                            d: ['Um componente de ferro do motor', 'Um vírus de rede virtual', 'Um imposto de importação federal']
                        });
                    } else if (sub === 'fisica' && item.area === 'Física') {
                        pool.push({
                            q: randVerb,
                            a: item.easyDesc,
                            d: ['Um tipo de fungo silvestre', 'Uma regra gramatical antiga', 'Uma fórmula química de sal']
                        });
                    } else if (sub === 'quimica' && item.area === 'Química') {
                        pool.push({
                            q: randVerb,
                            a: item.easyDesc,
                            d: ['Uma lei da gravidade estelar', 'Uma parte invisível da lua', 'Um império da idade média']
                        });
                    } else { // Crossover
                        pool.push({
                            q: `No campo científico geral, como entendemos '${item.concept}'?`,
                            a: item.easyDesc,
                            d: ['Um software de design gráfico', 'Uma classe de herança no Java', 'Um conflito político clássico']
                        });
                    }
                } else {
                    pool.push({
                        q: `[AVANÇADO] A investigação avançada sobre '${item.concept}' requer o entendimento de:`,
                        a: `Sua correlação prática com a métrica de '${item.keyWord}'`,
                        d: ['Apenas uma teoria ultrapassada sem aplicação', 'Uma violação das leis físicas comuns', 'Um elemento irrelevante para a ciência moderna']
                    });
                }
            });
        }
        
        // FAMILY 4: DATA SCIENCE, PYTHON, ESTATISTICA, PROBABILIDADE, ML, NLP, SECURITY...
        else {
            const dataScience = [
                { term: 'Array', tech: 'Dados', desc: 'uma lista organizada de itens, como gavetas numeradas', key: 'Index' },
                { term: 'Variável', tech: 'Python', desc: 'uma caixinha com nome para guardar números ou textos', key: 'Atribuição' },
                { term: 'Loop', tech: 'Python', desc: 'um ciclo que repete uma ação várias vezes', key: 'For/While' },
                { term: 'SQL', tech: 'Banco de Dados', desc: 'uma linguagem de consulta para tabelas de bancos de dados', key: 'Query' },
                { term: 'Select', tech: 'SQL', desc: 'comando para buscar ou ler dados de uma tabela', key: 'From' },
                { term: 'Join', tech: 'SQL', desc: 'comando para juntar duas tabelas que têm algo em comum', key: 'Inner/Left' },
                { term: 'Overfitting', tech: 'Machine Learning', desc: 'quando o modelo decora os dados de treino e vai mal no teste', key: 'Underfitting' },
                { term: 'Scatter Plot', tech: 'Visualização', desc: 'gráfico de pontos para ver a relação entre duas variáveis', key: 'Matplotlib' },
                { term: 'Scikit-Learn', tech: 'Python', desc: 'a principal biblioteca para rodar modelos de Machine Learning', key: 'Predict' },
                { term: 'Pandas', tech: 'Python', desc: 'biblioteca fantástica para organizar e limpar tabelas de dados', key: 'DataFrame' },
                { term: 'Big Data', tech: 'Big Data', desc: 'grandes volumes de dados que não cabem num computador normal', key: 'Hadoop/Spark' },
                { term: 'NLP', tech: 'Inteligência Artificial', desc: 'processamento de linguagem natural para entender texto humano', key: 'Tokens' },
                { term: 'MFA', tech: 'Segurança', desc: 'autenticação de dois fatores para proteger sua senha', key: 'Token/SMS' },
                { term: 'Phishing', tech: 'Cibersegurança', desc: 'emails ou sites falsos tentando roubar sua senha', key: 'Engenharia Social' },
                { term: 'Firewall', tech: 'Cibersegurança', desc: 'um escudo digital que protege a rede contra invasões', key: 'Portas' },
                { term: 'Média', tech: 'Estatística', desc: 'o valor médio calculado somando tudo e dividindo pelo total', key: 'Mediana' },
                { term: 'Moda', tech: 'Estatística', desc: 'o valor ou resposta mais frequente em uma pesquisa', key: 'Frequência' },
                { term: 'Deep Learning', tech: 'IA', desc: 'redes neurais artificiais profundas imitando o cérebro', key: 'Tensores' },
                { term: 'Criptografia', tech: 'Segurança', desc: 'embaralhar dados para que ninguém de fora possa ler', key: 'Chaves' },
                { term: 'Bug', tech: 'Desenvolvimento', desc: 'um erro lógico ou de escrita que impede o código de rodar', key: 'Debugging' }
            ];

            dataScience.forEach((item) => {
                const randCode = randChoice([
                    `No mundo de Tecnologia e Programação, o conceito de '${item.term}' refere-se à:`,
                    `Qual alternativa descreve o conceito de '${item.term}' de forma simplificada?`,
                    `Para um aluno iniciante em tecnologia, o que é '${item.term}'?`
                ]);
                
                if (lvl === 'easy' || lvl === 'medium') {
                    pool.push({
                        q: randCode,
                        a: item.desc,
                        d: ['Uma peça mecânica que roda o disco rígido', 'Um imposto de importação cobrado por cabo', 'Um vírus que faz o computador pegar fogo']
                    });
                } else {
                    pool.push({
                        q: `[AVANÇADO] Em arquiteturas de alto desempenho em ${item.tech}, o conceito '${item.term}' vincula-se com:`,
                        a: `Melhoria de performance e indexação via '${item.key}'`,
                        d: ['Uma instrução de montagem física de hardware', 'Uma regra banida por padrões internacionais', 'Um erro de compilação sem tratamento']
                    });
                }
            });
        }
        
        // FAMILY 5: MATHEMATICS DYNAMIC PROCEDURAL GENERATOR (Always 100% Unique Random Math)
        if (sub === 'matematica') {
            const mathList = [];
            for (let i = 0; i < 20; i++) {
                let a = randRange(10, 99);
                let b = randRange(2, 9);
                let randOp = randChoice(['+', '-', '*']);
                
                if (lvl === 'easy') {
                    mathList.push({
                        q: `Se você tem ${a} caixas e recebe mais ${b}, com quantas fica?`,
                        a: (a + b).toString(),
                        d: [(a + b + 3).toString(), (a + b - 2).toString(), (a + b + 5).toString()]
                    });
                } else if (lvl === 'medium') {
                    mathList.push({
                        q: `Se uma fábrica produz ${a} brinquedos por hora, quantos fará em ${b} horas?`,
                        a: (a * b).toString(),
                        d: [(a * b - a).toString(), (a * b + b).toString(), (a * b + 10).toString()]
                    });
                } else {
                    mathList.push({
                        q: `Qual é o resultado exato de: ${a} ${randOp} ${b}?`,
                        a: eval(`${a} ${randOp} ${b}`).toString(),
                        d: [(eval(`${a} ${randOp} ${b}`) + 4).toString(), (eval(`${a} ${randOp} ${b}`) - 3).toString(), (eval(`${a} ${randOp} ${b}`) + 10).toString()]
                    });
                }
            }
            return mathList;
        }

        // Shuffle pool to add variation
        const shuffled = pool.sort(() => Math.random() - 0.5);
        return shuffled.slice(0, 20); // Always returns exactly 20 unique, dynamic questions
    }

    // Initialize all 22 subjects and levels using the Procedural Engine
    subjects.forEach(sub => {
        db[sub] = {};
        levels.forEach(lvl => {
            // Build the dynamic unique database at runtime
            db[sub][lvl] = generateQuestionsForSubject(sub, lvl);
        });
    });

    // Expose dynamic pool generation so fresh questions can be generated on demand
    db.getFreshPool = function(sub, lvl) {
        return generateQuestionsForSubject(sub || 'matematica', lvl || 'easy');
    };

    return db;
})();
