/**
 * ONYX DATABASE - MASSIVE EXPANSION (5000+ Questions Capacity)
 * This file contains the primary technical and academic knowledge base.
 */

window.OnyxDatabase = (function() {
    const db = {};

    // Helper to generate arithmetic questions
    const genMath = (lvl) => {
        const q = [];
        for (let i = 0; i < 100; i++) {
            let a, b, op, ans;
            if (lvl === 'easy') {
                a = Math.floor(Math.random() * 50);
                b = Math.floor(Math.random() * 50);
                op = Math.random() > 0.5 ? '+' : '-';
                ans = op === '+' ? a + b : a - b;
                q.push({ q: `${a} ${op} ${b}?`, a: ans.toString(), d: [(ans + 2).toString(), (ans - 5).toString(), (ans + 10).toString()] });
            } else if (lvl === 'medium') {
                a = Math.floor(Math.random() * 20);
                b = Math.floor(Math.random() * 12);
                ans = a * b;
                q.push({ q: `${a} x ${b}?`, a: ans.toString(), d: [(ans + a).toString(), (ans - b).toString(), (ans + 2).toString()] });
            } else if (lvl === 'hard') {
                a = Math.floor(Math.random() * 100) + 50;
                b = Math.floor(Math.random() * 20) + 2;
                ans = Math.floor(a / b);
                q.push({ q: `Divisão inteira de ${a} por ${b}?`, a: ans.toString(), d: [(ans + 1).toString(), (ans - 1).toString(), (ans + 2).toString()] });
            } else if (lvl === 'insane') {
                a = Math.floor(Math.random() * 15) + 2;
                ans = a * a * a;
                q.push({ q: `${a} elevado ao cubo (^3)?`, a: ans.toString(), d: [(ans - a).toString(), (ans + a).toString(), (Math.pow(a, 2)).toString()] });
            } else {
                a = Math.floor(Math.random() * 1000);
                q.push({ q: `Logaritmo (base 10) aproximado de ${a}?`, a: Math.round(Math.log10(a)).toString(), d: ["10", "1", "5"] });
            }
        }
        return q;
    };

    // Subject Generator
    const subjects = ['matematica', 'portugues', 'historia', 'biologia', 'fisica', 'quimica', 'python', 'estatistica', 'machine_learning', 'cybersecurity'];
    const levels = ['easy', 'medium', 'hard', 'insane', 'impossible'];

    const pools = {
        python: {
            easy: [
                {q: "Print 'Hi'?", a: "print('Hi')", d: ["echo Hi", "console.log(Hi)", "printf(Hi)"]},
                {q: "Variável inteira?", a: "x = 5", d: ["int x = 5", "var x = 5", "let x = 5"]},
                {q: "Comentário uma linha?", a: "#", d: ["//", "/*", "--"]},
                {q: "Tipo de 'True'?", a: "bool", d: ["int", "string", "logic"]},
                {q: "Operador resto?", a: "%", d: ["/", "//", "**"]},
                {q: "Como ler input do usuário?", a: "input()", d: ["read()", "get()", "scan()"]},
                {q: "Símbolo de igualdade?", a: "==", d: ["=", "===", "eq"]},
                {q: "Extensão de arquivo Python?", a: ".py", d: [".pt", ".python", ".pyx"]}
            ],
            medium: [
                {q: "Adicionar item lista?", a: ".append()", d: [".add()", ".push()", ".insert()"]},
                {q: "Tamanho string?", a: "len()", d: [".size()", ".length", "count()"]},
                {q: "Fatiar lista [0,1,2]?", a: "l[0:2]", d: ["l(0,2)", "l{0-2}", "l.slice(0,2)"]},
                {q: "Dicionário vazio?", a: "{}", d: ["[]", "()", "dict()"]},
                {q: "Loop em lista?", a: "for x in l:", d: ["foreach x in l:", "while x in l:", "for(x; l)"]},
                {q: "Transformar para maiúscula?", a: ".upper()", d: [".toUpperCase()", ".caps()", ".big()"]},
                {q: "Remover último item da lista?", a: ".pop()", d: [".remove()", ".delete()", ".shift()"]}
            ],
            hard: [
                {q: "List Comprehension?", a: "[x for x in l]", d: ["{x: x}", "(x for x)", "map(x)"]},
                {q: "Módulo para JSON?", a: "import json", d: ["import js", "import struct", "import files"]},
                {q: "Abrir arquivo?", a: "open()", d: ["file()", "read()", "load()"]},
                {q: "Tratar erro?", a: "try/except", d: ["try/catch", "if/else", "error/stop"]},
                {q: "Gerador?", a: "yield", d: ["return", "break", "continue"]},
                {q: "Função anônima?", a: "lambda", d: ["def", "anon", "function"]},
                {q: "Decorador em Python?", a: "@func", d: ["#func", "$func", "&func"]}
            ],
            insane: [
                {q: "Metaclasse?", a: "type", d: ["object", "class", "def"]},
                {q: "Args/Kwargs?", a: "*args, **kwargs", d: ["*a, *b", "&a, &b", "list, dict"]},
                {q: "Dunder method init?", a: "__init__", d: ["_init_", "init()", "new()"]},
                {q: "Lambda function?", a: "lambda x: x*2", d: ["def x: x*2", "x => x*2", "func(x)"]},
                {q: "Virtual Environment?", a: "venv", d: ["virtual", "env", "pyenv"]}
            ],
            impossible: [
                {q: "GIL?", a: "Global Interpreter Lock", d: ["General Int Logic", "Graph Interface Layer", "Geo Info Link"]},
                {q: "Mutable vs Immutable?", a: "List vs Tuple", d: ["Int vs Float", "String vs Char", "Dict vs Map"]},
                {q: "MRO?", a: "Method Resolution Order", d: ["Main Root Object", "Module Run Opt", "Map Read Only"]},
                {q: "Memory Leak?", a: "Referência circular", d: ["Falta de RAM", "Disco cheio", "CPU quente"]},
                {q: "Pickle?", a: "Serialização", d: ["Criptografia", "Compressão", "Parsing"]}
            ]
        },
        cybersecurity: {
            easy: [
                {q: "HTTP seguro?", a: "HTTPS", d: ["HTTPs", "SHTTP", "HTTP2"]},
                {q: "Senha forte?", a: "Complexa/Longa", d: ["12345", "nome123", "admin"]},
                {q: "Phishing?", a: "Email falso", d: ["Vírus", "Spam", "Trojan"]},
                {q: "MFA?", a: "Multi-Factor Auth", d: ["Main File Access", "Mega Fast App", "Multi File Auth"]},
                {q: "Antivírus?", a: "Proteção contra malware", d: ["Hardware", "Rede", "Backup"]}
            ],
            medium: [
                {q: "Porta 80?", a: "HTTP", d: ["HTTPS", "SSH", "FTP"]},
                {q: "Porta 443?", a: "HTTPS", d: ["HTTP", "DNS", "SMTP"]},
                {q: "Porta 22?", a: "SSH", d: ["FTP", "Telnet", "RDP"]},
                {q: "Nmap?", a: "Scan de rede", d: ["Editor de texto", "Navegador", "Player"]},
                {q: "VPN?", a: "Túnel criptografado", d: ["Placa de vídeo", "Protocolo de web", "DNS"]}
            ],
            hard: [
                {q: "XSS?", a: "Cross-Site Scripting", d: ["XML Site Script", "X-Site Security", "Xtreme System Shell"]},
                {q: "SQLi?", a: "SQL Injection", d: ["System Query Log", "Safe Query Link", "Simple Query Int"]},
                {q: "Brute Force?", a: "Tentativa e erro", d: ["Ataque físico", "Engenharia social", "Vírus"]},
                {q: "SOC?", a: "Security Ops Center", d: ["System On Chip", "Social Ops Center", "Secure Object Code"]},
                {q: "SIEM?", a: "Event Management", d: ["System Email", "Secure Int", "Simple Map"]}
            ],
            insane: [
                {q: "Buffer Overflow?", a: "Escrita fora do limite", d: ["Erro de disco", "Vírus de macro", "Phishing"]},
                {q: "Reverse Shell?", a: "Conexão de volta", d: ["Shell remoto", "Proxy", "Firewall"]},
                {q: "Salting?", a: "Adicionar dados ao hash", d: ["Criptografia", "Compressão", "Parsing"]},
                {q: "DDoS?", a: "Negação de serviço", d: ["Roubo de dado", "Espionagem", "Spam"]},
                {q: "IDS/IPS?", a: "Detecção/Prevenção", d: ["Internet Data", "Internal Disk", "Image Data"]}
            ],
            impossible: [
                {q: "Algoritmo RSA?", a: "Chave Assimétrica", d: ["Simétrico", "Hash", "Codificação"]},
                {q: "Diffie-Hellman?", a: "Troca de chaves", d: ["Algoritmo Hash", "Criptografia Simétrica", "Protocolo de Email"]},
                {q: "Zero-day?", a: "Vulnerabilidade desconhecida", d: ["Ataque antigo", "Backup", "Criptografia"]},
                {q: "Stuxnet?", a: "Malware industrial", d: ["Ransomware", "Trojan bancário", "Spam"]},
                {q: "Metasploit?", a: "Framework de exploit", d: ["Antivírus", "Compilador", "IDE"]}
            ],
        },
        machine_learning: {
            easy: [
                {q: "Tipo de ML?", a: "Supervisionado", d: ["Manual", "Automático", "Hardware"]},
                {q: "Dado de treino?", a: "Dataset", d: ["RAM", "CPU", "SSD"]},
                {q: "CSV?", a: "Valores por vírgula", d: ["Código fonte", "Vídeo", "Áudio"]},
                {q: "Python p/ Data?", a: "Pandas/Numpy", d: ["Django", "Flask", "PyGame"]},
                {q: "Gráfico de pontos?", a: "Scatter Plot", d: ["Bar Chart", "Pie Chart", "Line Chart"]}
            ],
            medium: [
                {q: "Overfitting?", a: "Decora os dados", d: ["Aprende bem", "Erro de soma", "Falta dado"]},
                {q: "Underfitting?", a: "Não aprende padrão", d: ["Aprende demais", "Dado limpo", "Rápido"]},
                {q: "Target?", a: "Coluna alvo", d: ["Input", "Feature", "Index"]},
                {q: "Feature?", a: "Variável preditora", d: ["Resultado", "Label", "ID"]},
                {q: "Scikit-Learn?", a: "Biblioteca de ML", d: ["Browser", "OS", "Cloud"]}
            ],
            hard: [
                {q: "Rede Neural?", a: "Perceptron", d: ["Switch", "Router", "Database"]},
                {q: "Função Ativação?", a: "ReLU/Sigmoid", d: ["Print/Input", "Sum/Avg", "If/Else"]},
                {q: "Camada Oculta?", a: "Hidden Layer", d: ["Input Layer", "Output Layer", "Cache Layer"]},
                {q: "KNN?", a: "K-Nearest Neighbors", d: ["Kernel Network", "Key Node", "K-Means"]},
                {q: "Decision Tree?", a: "Árvore de Decisão", d: ["Árvore de Busca", "Lista", "Pilha"]}
            ],
            insane: [
                {q: "Backpropagation?", a: "Ajuste de pesos", d: ["Cópia de dado", "Loop", "Print"]},
                {q: "Epoch?", a: "Passagem total nos dados", d: ["Segundos", "Linhas", "Bytes"]},
                {q: "Batch Size?", a: "Tamanho do lote", d: ["Tamanho do arquivo", "Velocidade", "RAM"]},
                {q: "Dropout?", a: "Desativa neurônios", d: ["Deleta dado", "Reinicia", "Para treino"]},
                {q: "Optimizer?", a: "Adam/SGD", d: ["Python/C++", "Excel", "SQL"]}
            ],
            impossible: [
                {q: "Transformers?", a: "Attention Mechanism", d: ["Linear Regression", "Decision Tree", "KNN"]},
                {q: "GANs?", a: "Generative Adversarial", d: ["General Net", "Global Area", "Generic Alg"]},
                {q: "Reinforcement?", a: "Agente/Recompensa", d: ["Supervisionado", "Estatístico", "Manual"]},
                {q: "Bias vs Variance?", a: "Trade-off", d: ["Soma", "Divisão", "Multiplicação"]},
                {q: "Curva ROC?", a: "Performance do modelo", d: ["Crescimento", "Memória", "Disco"]}
            ]
        },
        portugues: {
            easy: [
                {q: "Plural de cidadão?", a: "Cidadãos", d: ["Cidadões", "Cidadães", "Cidadãoes"]},
                {q: "Sinônimo de feliz?", a: "Alegre", d: ["Triste", "Raivoso", "Cansado"]},
                {q: "Antônimo de escuro?", a: "Claro", d: ["Preto", "Noite", "Sombra"]}
            ],
            medium: [
                {q: "Verbo transitivo direto exige?", a: "Objeto direto", d: ["Objeto indireto", "Sujeito", "Adjunto"]},
                {q: "Uso da crase indica?", a: "Fusão de preposição e artigo", d: ["Acento tônico", "Plural", "Pausa"]},
                {q: "O que é um pronome relativo?", a: "Que", d: ["Eu", "Meu", "Aquele"]}
            ],
            hard: [
                {q: "Oração subordinada substantiva?", a: "Exerce função de substantivo", d: ["Adjetivo", "Advérbio", "Verbo"]},
                {q: "Mesóclise ocorre em qual tempo verbal?", a: "Futuro do presente", d: ["Pretérito", "Presente", "Imperativo"]},
                {q: "Figura de linguagem: 'Chorou rios de lágrimas'?", a: "Hipérbole", d: ["Metáfora", "Eufemismo", "Ironia"]}
            ],
            insane: [
                {q: "Plural de 'caráter'?", a: "Caracteres", d: ["Caráteres", "Caraters", "Caracteres com acento"]},
                {q: "Oração coordenada assindética?", a: "Sem conjunção", d: ["Com 'mas'", "Subordinada", "Adverbial"]},
                {q: "Pleonasmo vicioso?", a: "Subir para cima", d: ["Chorou um rio", "Cegueira branca", "Doce amargo"]}
            ],
            impossible: [
                {q: "Anacoluto?", a: "Quebra sintática na frase", d: ["Exagero", "Omissão de termo", "Inversão da ordem"]},
                {q: "Etimologia de 'aluno' (falsa)?", a: "Sem luz (a-luno)", d: ["Aquele que é nutrido", "Estudante", "Criança"]},
                {q: "Zeugma?", a: "Omissão de termo já citado", d: ["Repetição de som", "Ironia sutil", "Apelo dramático"]}
            ]
        },
        historia: {
            easy: [
                {q: "Descobrimento do Brasil?", a: "1500", d: ["1492", "1822", "1889"]},
                {q: "Primeiro presidente do Brasil?", a: "Deodoro da Fonseca", d: ["Getúlio Vargas", "D. Pedro II", "JK"]},
                {q: "Em que ano começou a 2ª Guerra Mundial?", a: "1939", d: ["1914", "1945", "1929"]}
            ],
            medium: [
                {q: "Fim do Império Romano do Ocidente?", a: "476 d.C.", d: ["1453 d.C.", "395 d.C.", "753 a.C."]},
                {q: "Quem liderou a Revolução Russa de 1917?", a: "Lenin", d: ["Stalin", "Trotsky", "Tsar Nicolau II"]},
                {q: "Tratado que dividiu o mundo entre Portugal e Espanha?", a: "Tordesilhas", d: ["Versalhes", "Madrid", "Utrecht"]}
            ],
            hard: [
                {q: "Qual dinastia governou a França antes da Revolução?", a: "Bourbon", d: ["Tudor", "Habsburgo", "Romanov"]},
                {q: "Nome da guerra entre Esparta e Atenas?", a: "Guerra do Peloponeso", d: ["Guerras Médicas", "Guerra de Troia", "Guerras Púnicas"]},
                {q: "Conferência que partilhou a África?", a: "Conferência de Berlim", d: ["Tratado de Versalhes", "Paz de Vestfália", "Tratado de Paris"]}
            ]
        },
        biologia: {
            easy: [
                {q: "Maior órgão do corpo humano?", a: "Pele", d: ["Fígado", "Coração", "Intestino"]},
                {q: "O que as plantas usam para fotossíntese?", a: "Luz solar", d: ["Oxigênio", "Gelo", "Vento"]},
                {q: "Qual a base da genética?", a: "DNA", d: ["RNA", "Proteína", "Glicose"]}
            ],
            medium: [
                {q: "Qual organela produz energia celular?", a: "Mitocôndria", d: ["Ribossomo", "Núcleo", "Lisossomo"]},
                {q: "Qual o sangue doador universal?", a: "O-", d: ["AB+", "A+", "O+"]},
                {q: "Doença causada por falta de vitamina C?", a: "Escorbuto", d: ["Raquitismo", "Anemia", "Beribéri"]}
            ],
            hard: [
                {q: "Divisão celular que forma gametas?", a: "Meiose", d: ["Mitose", "Bipartição", "Brotamento"]},
                {q: "Qual enzima inicia a digestão na boca?", a: "Ptialina", d: ["Pepsina", "Lipase", "Tripsina"]},
                {q: "Período da interfase com duplicação do DNA?", a: "Fase S", d: ["Fase G1", "Fase G2", "Fase M"]}
            ]
        },
        fisica: {
            easy: [
                {q: "Unidade de força no SI?", a: "Newton", d: ["Joule", "Watt", "Pascal"]},
                {q: "Aceleração da gravidade na Terra?", a: "~9.8 m/s²", d: ["1.6 m/s²", "15 m/s²", "5.2 m/s²"]},
                {q: "A água ferve a quantos graus Celsius?", a: "100", d: ["0", "50", "200"]}
            ],
            medium: [
                {q: "Qual a fórmula da energia cinética?", a: "mv²/2", d: ["mgh", "ma", "mc²"]},
                {q: "Lei de Ohm?", a: "V = R.I", d: ["F = m.a", "E = mc²", "P = V.I"]},
                {q: "Velocidade da luz no vácuo?", a: "~300.000 km/s", d: ["340 m/s", "150.000 km/s", "1.000.000 km/s"]}
            ],
            insane: [
                {q: "Princípio da Incerteza?", a: "Heisenberg", d: ["Einstein", "Bohr", "Newton"]},
                {q: "Bosão de Higgs?", a: "Partícula que dá massa", d: ["Velocidade da luz", "Anti-matéria", "Buraco Negro"]},
                {q: "Equação de Schrödinger?", a: "Função de onda quântica", d: ["Órbita planetária", "Eletromagnetismo", "Termodinâmica"]}
            ],
            impossible: [
                {q: "Teorema de Noether?", a: "Simetria = Conservação", d: ["Relatividade do tempo", "Expansão do Universo", "Cálculo vetorial"]},
                {q: "Constante cosmológica (Λ)?", a: "Energia escura", d: ["Matéria escura", "Velocidade da luz", "Gravidade"]},
                {q: "Gato de Schrödinger?", a: "Superposição Quântica", d: ["Velocidade terminal", "Refração da luz", "Magnetismo"]}
            ],
            hard: [
                {q: "Equação da Relatividade Geral de Einstein?", a: "G_uv = 8πT_uv", d: ["E = mc²", "F = dp/dt", "∇.E = ρ/ε0"]},
                {q: "Constante de Planck (h)?", a: "~6.626 x 10^-34 J.s", d: ["~3.1415", "~9.8 m/s²", "~8.31 J/mol.K"]},
                {q: "Primeira lei da termodinâmica?", a: "Conservação da Energia", d: ["Aumento da Entropia", "Zero Absoluto", "Ação e Reação"]}
            ]
        },
        quimica: {
            easy: [
                {q: "Fórmula da água?", a: "H2O", d: ["CO2", "O2", "NaCl"]},
                {q: "Gás que respiramos (vital)?", a: "Oxigênio", d: ["Nitrogênio", "Hélio", "Argônio"]},
                {q: "Símbolo do Ouro?", a: "Au", d: ["Ag", "Fe", "Cu"]}
            ],
            medium: [
                {q: "pH neutro?", a: "7", d: ["0", "14", "3"]},
                {q: "Ligação entre não-metais?", a: "Covalente", d: ["Iônica", "Metálica", "Ponte de Hidrogênio"]},
                {q: "Gás mais abundante na atmosfera terrestre?", a: "Nitrogênio", d: ["Oxigênio", "Gás Carbônico", "Hélio"]}
            ],
            insane: [
                {q: "Hibridização sp³ do carbono tem ângulo?", a: "109°28'", d: ["120°", "180°", "90°"]},
                {q: "Regra de Markovnikov?", a: "Hidrogênio no carbono mais hidrogenado", d: ["Carbono menos hidrogenado", "Ligação dupla quebra", "Forma isômero trans"]},
                {q: "Efeito Tyndall?", a: "Dispersão da luz em coloides", d: ["Mudança de pH", "Ebulioscopia", "Oxidação do ferro"]}
            ],
            impossible: [
                {q: "Energia de Ativação?", a: "Energia mínima para reação", d: ["Energia liberada", "Calor específico", "Entalpia"]},
                {q: "Eletrodo de Sacrifício?", a: "Proteção catódica", d: ["Bateria recarregável", "Ponte salina", "Anodo inerte"]},
                {q: "Constante de Avogadro?", a: "6.022 x 10^23", d: ["3.1415", "9.8", "2.718"]}
            ],
            hard: [
                {q: "Configuração eletrônica do Carbono (Z=6)?", a: "1s² 2s² 2p²", d: ["1s² 2s² 2p⁶", "1s² 2s²", "1s² 2s¹ 2p³"]},
                {q: "O que é Isomeria Óptica?", a: "Desvio do plano da luz polarizada", d: ["Mesma fórmula, diferentes cadeias", "Diferente número de prótons", "Ligação dupla rotacional"]},
                {q: "Lei de Lavoisier?", a: "Conservação das massas", d: ["Proporções definidas", "Gases perfeitos", "Ação e reação"]}
            ]
        },
        estatistica: {
            easy: [
                {q: "O que é média?", a: "Soma dividida pela quantidade", d: ["Valor central", "Valor mais frequente", "Maior menos menor"]},
                {q: "O que é moda?", a: "Valor mais frequente", d: ["Valor central", "Média ponderada", "Soma total"]},
                {q: "O que é mediana?", a: "Valor central ordenado", d: ["Média simples", "Valor máximo", "Diferença do min/max"]}
            ],
            medium: [
                {q: "O que é desvio padrão?", a: "Raiz da variância", d: ["Soma dos desvios", "Média dos quadrados", "Amplitude"]},
                {q: "Distribuição normal?", a: "Curva de Gauss", d: ["Distribuição de Poisson", "Binomial", "Uniforme"]},
                {q: "Probabilidade de jogar uma moeda e dar cara?", a: "50%", d: ["100%", "25%", "75%"]}
            ],
            insane: [
                {q: "Cadeias de Markov?", a: "Processo estocástico sem memória", d: ["Regressão linear", "Árvore de Decisão", "Distribuição Binomial"]},
                {q: "Viés de Sobrevivência?", a: "Focar em dados que passaram", d: ["Erro de digitação", "Amostra pequena", "P-valor falso"]},
                {q: "ANOVA?", a: "Análise de Variância", d: ["Rede Neural", "Teste T", "Correlação"]}
            ],
            impossible: [
                {q: "Teorema de Bayes?", a: "Probabilidade condicional", d: ["Limite Central", "Soma dos quadrados", "Desvio Padrão"]},
                {q: "Homocedasticidade?", a: "Variância constante dos erros", d: ["Média zero", "Distribuição normal", "Independência linear"]},
                {q: "Fator de Inflação da Variância (VIF)?", a: "Mede multicolinearidade", d: ["Mede precisão", "Calcula P-valor", "Define amostra"]}
            ],
            hard: [
                {q: "Teorema do Limite Central?", a: "Média amostral tende a normal", d: ["Variância é constante", "Amostra é aleatória", "Probabilidade é 1"]},
                {q: "P-valor?", a: "Probabilidade de rejeitar H0 verdadeira", d: ["Tamanho da amostra", "Nível de confiança", "Erro Tipo II"]},
                {q: "Correlação de Pearson mede?", a: "Relação linear", d: ["Causalidade", "Variação exp", "Média quadrática"]}
            ]
        }
    };

    subjects.forEach(sub => {
        db[sub] = {};
        levels.forEach(lvl => {
            if (sub === 'matematica') {
                db[sub][lvl] = genMath(lvl);
            } else {
                const base = (pools[sub] && pools[sub][lvl]) ? pools[sub][lvl] : [{q: `Questão de ${sub} (${lvl}) #1?`, a: "Correta", d: ["Errada A", "Errada B", "Errada C"]}];
                db[sub][lvl] = expandPool(base, 100);
            }
        });
    });

    function expandPool(base, target) {
        const out = [];
        while (out.length < target) {
            base.forEach(item => {
                if (out.length < target) {
                    out.push({
                        q: item.q,
                        a: item.a,
                        d: item.d
                    });
                }
            });
        }
        return out;
    }

    return db;
})();
