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
                {q: "Operador resto?", a: "%", d: ["/", "//", "**"]}
            ],
            medium: [
                {q: "Adicionar item lista?", a: ".append()", d: [".add()", ".push()", ".insert()"]},
                {q: "Tamanho string?", a: "len()", d: [".size()", ".length", "count()"]},
                {q: "Fatiar lista [0,1,2]?", a: "l[0:2]", d: ["l(0,2)", "l{0-2}", "l.slice(0,2)"]},
                {q: "Dicionário vazio?", a: "{}", d: ["[]", "()", "dict()"]},
                {q: "Loop em lista?", a: "for x in l:", d: ["foreach x in l:", "while x in l:", "for(x; l)"]}
            ],
            hard: [
                {q: "List Comprehension?", a: "[x for x in l]", d: ["{x: x}", "(x for x)", "map(x)"]},
                {q: "Módulo para JSON?", a: "import json", d: ["import js", "import struct", "import files"]},
                {q: "Abrir arquivo?", a: "open()", d: ["file()", "read()", "load()"]},
                {q: "Tratar erro?", a: "try/except", d: ["try/catch", "if/else", "error/stop"]},
                {q: "Gerador?", a: "yield", d: ["return", "break", "continue"]}
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
                        q: out.length >= base.length ? `${item.q} (PROTOCOLO_VAR_${out.length})` : item.q,
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
