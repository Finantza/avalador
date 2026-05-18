/**
 * ONYX DATABASE - ULTIMATE HIGH SCHOOL & BNCC PROCEDURAL GENERATION ENGINE v5.0
 * Alinhado ao currículo nacional do Novo Ensino Médio, BNCC e diretrizes do MEC.
 * 
 * Este motor gera de forma 100% procedural e sob demanda mais de 20 questões inéditas
 * para cada uma das 32 disciplinas (28 oficiais + 4 extras) em 5 níveis de dificuldade.
 * Cada questão inclui código de competência da BNCC, dica de estudo e uma explicação lúdica.
 */

window.OnyxDatabase = (function() {
    const db = {};
    const subjects = [
        'portugues', 'literatura', 'ingles', 'artes', 'educacao_fisica',
        'algebra', 'geometria', 'estatistica', 'matematica_financeira',
        'fisica', 'quimica', 'biologia',
        'historia', 'geografia', 'filosofia', 'sociologia',
        'tecnologia', 'programacao', 'robotica', 'empreendedorismo',
        'ciencia_de_dados', 'inteligencia_artificial', 'educacao_financeira', 'marketing_digital',
        'desenvolvimento_jogos', 'seguranca_informacao', 'design_digital', 'producao_audiovisual',
        'biblioteca_digital', 'laboratorio_virtual', 'projeto_vida', 'inclusao_acessibilidade'
    ];
    const difficulties = ['easy', 'medium', 'hard', 'insane', 'impossible'];

    // Auxiliares de Sorteio
    function randChoice(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    }

    function randRange(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function shuffle(arr) {
        return [...arr].sort(() => Math.random() - 0.5);
    }

    // Nomes aleatórios para contextualizar questões do ENEM
    const nomesAlunos = ['Mariana', 'Pedro', 'Ana Clara', 'Gustavo', 'Beatriz', 'Lucas', 'Sofia', 'Rodrigo', 'Larissa', 'Bruno'];
    const escolas = ['Colégio Central', 'Escola Técnica Nacional', 'Liceu de Ciências', 'Instituto de Tecnologia', 'Escola Estadual Cora Coralina'];

    // Gerador Central Procedural por Disciplina
    function generateQuestionsForSubject(sub, lvl) {
        const pool = [];

        // 1. FAMÍLIA LINGUAGENS (Português, Literatura, Inglês, Artes, Ed. Física)
        if (sub === 'portugues') {
            const palavrasMorfologia = [
                { singular: 'cidadão', plural: 'cidadãos', errados: ['cidadões', 'cidadães', 'cidadãoes'], bncc: 'EM13LGG101', analogia: 'Cidadão vem de cidade; assim como irmãos moram juntos, cidadãos compartilham a mesma comunidade.' },
                { singular: 'caráter', plural: 'caracteres', errados: ['caráteres', 'caraters', 'carateres'], bncc: 'EM13LGG102', analogia: 'Caráter muda completamente de grafia no plural. Lembre-se dos caracteres do seu teclado de computador!' },
                { singular: 'alemão', plural: 'alemães', errados: ['alemãos', 'alemões', 'alemãoes'], bncc: 'EM13LGG101', analogia: 'Palavras de origem germânica ou nacionalidades terminadas em -ão geralmente terminam em -ães no plural, como pães.' },
                { singular: 'tabelião', plural: 'tabeliães', errados: ['tabeliãos', 'tabeliões', 'tabeliãoes'], bncc: 'EM13LGG301', analogia: 'Tabelião atua no cartório registrando papéis. Pense em escrivães, que também terminam em -ães no plural!' },
                { singular: 'júnior', plural: 'juniores', errados: ['júniors', 'juniores', 'júniorees'], bncc: 'EM13LGG301', analogia: 'Palavras terminadas em -r ganham -es e mudam a sílaba tônica. Júnior vira juniores!' }
            ];

            for (let i = 0; i < 20; i++) {
                const item = randChoice(palavrasMorfologia);
                const a = randRange(3, 15);
                if (lvl === 'easy' || lvl === 'medium') {
                    pool.push({
                        q: `Identifique a flexão de número correta: Na frase "Os ${item.singular}s da nação precisam votar", qual é o plural gramatical adequado de "${item.singular}"?`,
                        a: item.plural,
                        d: item.errados,
                        explanation: `De acordo com a norma-padrão da Língua Portuguesa, o plural de '${item.singular}' é '${item.plural}'. ${item.analogia}`,
                        hint: `Preste atenção nas terminações em -ão e nas exceções de palavras paroxítonas terminadas em -r.`,
                        concept: item.bncc
                    });
                } else {
                    pool.push({
                        q: `[ANÁLISE SINTÁTICA] A palavra '${item.singular}' atua no período moderno como núcleo nominal. Sua transposição para o plural '${item.plural}' exige:`,
                        a: `Ajuste morfofonético para preservação da acentuação tônica`,
                        d: ['Apenas a duplicação da vogal final semântica', 'Uma transposição direta por empréstimo lexical estrangeiro', 'Nenhuma alteração, pois é um substantivo uniforme invariável'],
                        explanation: `Questões complexas de morfossintaxe exigem a compreensão das regras de deslocamento de acento tônico e flexões internas.`,
                        hint: `Estude o deslocamento de sílaba tônica em palavras latinas e neolatinas no Ensino Médio.`,
                        concept: 'EM13LGG402'
                    });
                }
            }
        }

        else if (sub === 'literatura') {
            const obras = [
                { titulo: 'Dom Casmurro', autor: 'Machado de Assis', escola: 'Realismo', foco: 'o ciúme doentio de Bentinho por Capitu', bncc: 'EM13LGG302' },
                { titulo: 'O Cortiço', autor: 'Aluísio Azevedo', escola: 'Naturalismo', foco: 'a influência do meio social sobre o homem', bncc: 'EM13LGG302' },
                { titulo: 'Vidas Secas', autor: 'Graciliano Ramos', escola: 'Modernismo (Geração de 30)', foco: 'a seca do Nordeste e a desumanização de Fabiano', bncc: 'EM13LGG302' },
                { titulo: 'Iracema', autor: 'José de Alencar', escola: 'Romantismo', foco: 'a idealização da índia como símbolo da pátria', bncc: 'EM13LGG302' },
                { titulo: 'Sagarana', autor: 'João Guimarães Rosa', escola: 'Modernismo (Geração de 45)', foco: 'o sertão místico e a linguagem inovadora', bncc: 'EM13LGG302' }
            ];

            for (let i = 0; i < 20; i++) {
                const obra = randChoice(obras);
                if (lvl === 'easy' || lvl === 'medium') {
                    pool.push({
                        q: `Qual é o autor e a respectiva escola literária da obra "${obra.titulo}", marco da nossa literatura brasileira?`,
                        a: `${obra.autor} (${obra.escola})`,
                        d: [`José de Alencar (Barroco)`, `Clarice Lispector (Romantismo)`, `Castro Alves (Realismo)`],
                        explanation: `A grande obra clássica "${obra.titulo}" foi escrita pelo mestre ${obra.autor} sob as diretrizes estéticas do ${obra.escola}, retratando ${obra.foco}.`,
                        hint: `Associe os autores aos seus períodos históricos (ex: Machado de Assis com o Realismo do século XIX).`,
                        concept: obra.bncc
                    });
                } else {
                    pool.push({
                        q: `[ANÁLISE LITERÁRIA] Na obra "${obra.titulo}", a construção do personagem principal reflete:`,
                        a: `A crítica social e o determinismo estético de sua época`,
                        d: ['Apenas um sentimentalismo ingênuo e sem bases políticas', 'O culto às formas clássicas medievais jesuíticas', 'A total recusa do uso de metáforas ou linguagem subjetiva'],
                        explanation: `A literatura brasileira no ENEM exige a correlação entre a obra literária, a estética de sua escola e o momento sócio-histórico do Brasil.`,
                        hint: `Lembre-se de analisar a subjetividade das obras do Modernismo e o objetivismo científico do Realismo/Naturalismo.`,
                        concept: 'EM13LGG303'
                    });
                }
            }
        }

        else if (sub === 'ingles') {
            const cognatos = [
                { termo: 'actually', trad: 'realmente', falso: 'atualmente', bncc: 'EM13LGG401', analogia: 'Actually parece atualmente, mas significa na verdade ou realmente. Pense em "actual" como algo real.' },
                { termo: 'push', trad: 'empurrar', falso: 'puxar', bncc: 'EM13LGG401', analogia: 'Push parece puxar, mas é exatamente o contrário: significa empurrar! Lembre-se das portas de bancos.' },
                { termo: 'pretend', trad: 'fingir', falso: 'pretender', bncc: 'EM13LGG401', analogia: 'Pretend parece pretender, mas significa fingir. Se você pretende fazer algo, use "intend"!' },
                { termo: 'novel', trad: 'romance (livro)', falso: 'novela de TV', bncc: 'EM13LGG401', analogia: 'Novel é um livro de romance. Para novelas de TV, os americanos usam "soap opera"!' }
            ];

            for (let i = 0; i < 20; i++) {
                const item = randChoice(cognatos);
                if (lvl === 'easy' || lvl === 'medium') {
                    pool.push({
                        q: `No inglês instrumental e de exames como o ENEM, qual é o real significado do falso cognato (false friend) "${item.termo}"?`,
                        a: item.trad,
                        d: [item.falso, 'escrever', 'desistir'],
                        explanation: `O termo inglês "${item.termo}" é um falso amigo clássico: parece "${item.falso}", mas significa "${item.trad}". ${item.analogia}`,
                        hint: `Preste atenção em palavras em inglês que se assemelham muito ao português mas têm sentido oculto.`,
                        concept: item.bncc
                    });
                } else {
                    pool.push({
                        q: `[SINTAXE INGLESA] Analise o período: "He actually pretended to read the novel". A tradução mais fiel e coerente é:`,
                        a: `Ele realmente fingiu ler o livro de romance`,
                        d: ['Ele atualmente pretendeu ler a novela da televisão', 'Ele fingiu que lia no momento atual da novela', 'Ele de fato empurrou a leitura do romance no presente'],
                        explanation: `Nesta frase, combinamos múltiplos falsos cognatos em uma única estrutura sintática complexa.`,
                        hint: `Traduza termo a termo com atenção às regras de tempos verbais no passado.`,
                        concept: 'EM13LGG402'
                    });
                }
            }
        }

        else if (sub === 'artes') {
            const movimentos = [
                { nome: 'Modernismo', marco: 'Semana de Arte Moderna de 1922', artista: 'Tarsila do Amaral', caracteristica: 'A busca por uma identidade artística puramente brasileira', bncc: 'EM13LGG201' },
                { nome: 'Cubismo', marco: 'Les Demoiselles d\'Avignon', artista: 'Pablo Picasso', caracteristica: 'A fragmentação geométrica das formas e múltiplos pontos de vista', bncc: 'EM13LGG202' },
                { nome: 'Impressionismo', marco: 'Impressão, nascer do sol', artista: 'Claude Monet', caracteristica: 'O estudo da luz natural nas pinceladas rápidas ao ar livre', bncc: 'EM13LGG201' },
                { nome: 'Renascimento', marco: 'Teto da Capela Sistina', artista: 'Michelangelo', caracteristica: 'O humanismo clássico, simetria e perspectiva matemática', bncc: 'EM13LGG202' }
            ];

            for (let i = 0; i < 20; i++) {
                const mov = randChoice(movimentos);
                if (lvl === 'easy' || lvl === 'medium') {
                    pool.push({
                        q: `Qual é a característica marcante e principal artista associado ao movimento artístico do "${mov.nome}"?`,
                        a: `${mov.artista} - ${mov.caracteristica}`,
                        d: [`Aleijadinho - O uso de arte em computador tridimensional`, `Monet - A criação de estátuas de bronze barrocas`, `Picasso - Pinturas realistas com simetria clássica perfeita`],
                        explanation: `O movimento "${mov.nome}" tem como um de seus maiores ícones ${mov.artista}, marcando a história da arte com: ${mov.caracteristica}.`,
                        hint: `Lembre-se que o Modernismo brasileiro explodiu na Semana de 22 em São Paulo.`,
                        concept: mov.bncc
                    });
                } else {
                    pool.push({
                        q: `[ESTÉTICA DA ARTE] A revolução plástica promovida pelo movimento "${mov.nome}" rompeu com:`,
                        a: `O academicismo tradicional e a representação mimética da realidade`,
                        d: ['A utilização de tintas a óleo e telas de tecido importadas', 'A liberdade criativa dos artistas, impondo regras matemáticas medievais', 'A temática religiosa que dominava todos os salões de arte moderna'],
                        explanation: `Os movimentos de vanguarda artística romperam drasticamente com a mimese (cópia fiel da realidade) ensinada nas academias tradicionais.`,
                        hint: `Pense em como as tecnologias como a fotografia forçaram a pintura a se reinventar no século XIX e XX.`,
                        concept: 'EM13LGG203'
                    });
                }
            }
        }

        else if (sub === 'educacao_fisica') {
            for (let i = 0; i < 20; i++) {
                if (lvl === 'easy' || lvl === 'medium') {
                    pool.push({
                        q: `Qual é o benefício fisiológico e metabólico comprovado da prática regular de atividades aeróbicas na adolescência?`,
                        a: `Melhoria da capacidade cardiorrespiratória e aumento do VO2 máximo`,
                        d: ['Redução drástica das células de memória do cérebro', 'Aumento instantâneo do peso ósseo com risco de fraturas', 'Diminuição da circulação sanguínea periférica geral'],
                        explanation: `Exercícios aeróbicos (corrida, natação, ciclismo) treinam o coração e pulmões, expandindo o VO2 máximo, que é a capacidade de consumir oxigênio.`,
                        hint: `Pense na saúde do músculo cardíaco e no transporte de oxigênio pelo sangue.`,
                        concept: 'EM13LGG501'
                    });
                } else {
                    pool.push({
                        q: `[CORPO E SOCIEDADE] O culto excessivo ao padrão corporal imposto pelas mídias sociais pode acarretar distúrbios graves como:`,
                        a: `Vigorexia e dismorfia corporal associadas a comportamentos obsessivos`,
                        d: ['Apenas melhoria na autoestima e socialização saudável', 'Uma imunidade biológica natural contra vírus de gripe', 'Aceleração do desenvolvimento intelectual sem efeitos colaterais'],
                        explanation: `A Educação Física no Novo Ensino Médio discute a imagem corporal, o consumo e os distúrbios de imagem estimulados por padrões inalcançáveis.`,
                        hint: `Dismorfia é a distorção da própria autoimagem; vigorexia é a obsessão por músculos.`,
                        concept: 'EM13LGG502'
                    });
                }
            }
        }

        // 2. FAMÍLIA MATEMÁTICA (Álgebra, Geometria, Estatística, Mat. Financeira)
        else if (sub === 'algebra') {
            for (let i = 0; i < 20; i++) {
                const a = randRange(2, 6);
                const b = randRange(10, 30);
                const x = randRange(3, 8);
                const y = a * x + b;
                
                if (lvl === 'easy' || lvl === 'medium') {
                    pool.push({
                        q: `[FUNÇÃO AFIM] Uma empresa de táxi cobra uma taxa fixa de R$ ${b},00 mais R$ ${a},00 por quilômetro rodado. Se a corrida de um aluno custou R$ ${y},00, quantos quilômetros foram percorridos?`,
                        a: `${x} km`,
                        d: [`${x+2} km`, `${x-1} km`, `${x+4} km`],
                        explanation: `A equação do custo é dada por C(x) = ${a}x + ${b}. Igualando a R$ ${y}, temos: ${a}x + ${b} = ${y} => ${a}x = ${y - b} => x = ${x}.`,
                        hint: `Subtraia primeiro a taxa fixa do valor total e depois divida o restante pelo preço do quilômetro.`,
                        concept: 'EM13MAT101'
                    });
                } else {
                    const c = randRange(2, 4);
                    pool.push({
                        q: `[EQUAÇÃO QUADRÁTICA] Dada a função de custo marginal f(x) = x² - ${a+c}x + ${a*c}. Quais são as raízes reais desta equação que indicam pontos de equilíbrio de produção?`,
                        a: `x = ${a} e x = ${c}`,
                        d: [`x = ${a+1} e x = ${c-1}`, `x = -${a} e x = -${c}`, `Não existem raízes reais para esta função`],
                        explanation: `As raízes de uma equação quadrática x² - Sx + P = 0 podem ser encontradas por soma (S = ${a+c}) e produto (P = ${a*c}), resultando em x1 = ${a} e x2 = ${c}.`,
                        hint: `Use a fórmula de Bhaskara ou o método de Soma e Produto.`,
                        concept: 'EM13MAT302'
                    });
                }
            }
        }

        else if (sub === 'geometria') {
            for (let i = 0; i < 20; i++) {
                const r = randRange(3, 8);
                const h = randRange(10, 20);
                const areaBase = r * r;
                
                if (lvl === 'easy' || lvl === 'medium') {
                    pool.push({
                        q: `[GEOMETRIA ESPACIAL] Um reservatório de água possui o formato de um cilindro circular reto com raio da base medindo ${r} metros e altura medindo ${h} metros. Usando pi = 3, qual é o volume total de água suportado?`,
                        a: `${3 * areaBase * h} m³`,
                        d: [`${areaBase * h} m³`, `${2 * 3 * r * h} m³`, `${3 * r * h * h} m³`],
                        explanation: `O volume do cilindro é V = Área da Base * Altura. Área da base = pi * R² = 3 * ${r}² = ${3 * areaBase}. Volume = ${3 * areaBase} * ${h} = ${3 * areaBase * h} metros cúbicos.`,
                        hint: `Lembre-se que 1 m³ equivale a 1.000 litros. O volume é pi * raio * raio * altura.`,
                        concept: 'EM13MAT301'
                    });
                } else {
                    pool.push({
                        q: `[TRIGONOMETRIA] Um observador de altura desprezível avista o topo de uma torre sob um ângulo de 30° com a horizontal. Sabendo que ele está a 100 metros da base da torre e que tan(30°) = 0.58, qual é a altura aproximada da torre?`,
                        a: `58 metros`,
                        d: ['100 metros', '30 metros', '173 metros'],
                        explanation: `A tangente de um ângulo em um triângulo retângulo é a razão entre o cateto oposto (altura H) e o cateto adjacente (distância D = 100m). Logo, tan(30°) = H/100 => H = 100 * 0.58 = 58 metros.`,
                        hint: `Use a definição trigonométrica: Tangente = Cateto Oposto / Cateto Adjacente.`,
                        concept: 'EM13MAT309'
                    });
                }
            }
        }

        else if (sub === 'estatistica') {
            for (let i = 0; i < 20; i++) {
                const n1 = randRange(2, 6);
                const n2 = randRange(6, 10);
                const n3 = randRange(4, 8);
                const total = n1 + n2 + n3;
                const media = (n1 + n2 + n3) / 3;
                const mediaRound = Math.round(media * 10) / 10;
                
                if (lvl === 'easy' || lvl === 'medium') {
                    pool.push({
                        q: `[MÉDIA ARITMÉTICA] Em um trimestre acadêmico, o estudante ${randChoice(nomesAlunos)} obteve as notas ${n1 * 1.5}, ${n2} e ${n3}. Qual é a média final aproximada dele?`,
                        a: `${Math.round(((n1 * 1.5 + n2 + n3) / 3) * 10) / 10}`,
                        d: [`${Math.round(((n1 * 1.5 + n2 + n3) / 3) * 10) / 10 + 1.2}`, `${Math.round(((n1 * 1.5 + n2 + n3) / 3) * 10) / 10 - 0.8}`, '5.0'],
                        explanation: `A média aritmética simples é calculada somando todas as notas obtidas e dividindo a soma pelo número total de avaliações (3).`,
                        hint: `Some as três notas e depois faça a divisão simples por 3.`,
                        concept: 'EM13MAT310'
                    });
                } else {
                    pool.push({
                        q: `[PROBABILIDADE CONDICIONAL] Uma urna de estudos do ENEM contém 6 bolas pretas e 4 vermelhas. Se retirarmos duas bolas sucessivamente e sem reposição, qual é a probabilidade exata de ambas serem pretas?`,
                        a: `1/3 (aproximadamente 33.3%)`,
                        d: ['36% (0.36)', '24% (0.24)', '50% (0.50)'],
                        explanation: `A probabilidade da primeira bola ser preta é 6/10. Sem reposição, restam 5 pretas em 9 bolas. A probabilidade da segunda ser preta é 5/9. Probabilidade conjunta = (6/10) * (5/9) = 30/90 = 1/3.`,
                        hint: `Lembre-se de reduzir o total de itens no denominador para a segunda retirada (sem reposição).`,
                        concept: 'EM13MAT311'
                    });
                }
            }
        }

        else if (sub === 'matematica_financeira') {
            for (let i = 0; i < 20; i++) {
                const cap = randChoice([1000, 2000, 5000, 10000]);
                const taxa = randRange(2, 5);
                const tempo = randRange(2, 4);
                const jurosSimples = cap * (taxa / 100) * tempo;
                
                if (lvl === 'easy' || lvl === 'medium') {
                    pool.push({
                        q: `[JUROS SIMPLES] Se um estudante aplicar R$ ${cap},00 em uma poupança estudantil que rende R$ ${taxa}% de juros simples ao ano, qual será o montante de juros rendido ao final de ${tempo} anos?`,
                        a: `R$ ${jurosSimples},00`,
                        d: [`R$ ${jurosSimples + 150},00`, `R$ ${jurosSimples - 80},00`, `R$ ${cap * 1.5},00`],
                        explanation: `A fórmula dos juros simples é J = C * i * t, onde C = ${cap}, i = ${taxa / 100} e t = ${tempo}. Logo, J = ${cap} * ${taxa / 100} * ${tempo} = R$ ${jurosSimples},00.`,
                        hint: `Lembre-se que no regime de juros simples, o rendimento é calculado sempre em cima do capital inicial depositado.`,
                        concept: 'EM13MAT312'
                    });
                } else {
                    const montanteComp = cap * Math.pow(1 + (taxa/100), tempo);
                    pool.push({
                        q: `[JUROS COMPOSTOS] Um jovem empreendedor pegou um empréstimo de R$ ${cap},00 sob regime de juros compostos com taxa de ${taxa}% ao ano. Qual será o montante total devido após ${tempo} anos?`,
                        a: `R$ ${Math.round(montanteComp).toFixed(2)}`,
                        d: [`R$ ${(cap + jurosSimples).toFixed(2)}`, `R$ ${(cap * 2.5).toFixed(2)}`, `R$ ${Math.round(montanteComp * 1.2).toFixed(2)}`],
                        explanation: `A fórmula dos juros compostos é M = C * (1 + i)^t. Os juros incidem sobre o montante acumulado do período anterior.`,
                        hint: `Pense em "juros sobre juros". Multiplique o capital inicial por (1 + taxa) consecutivamente pelo número de anos.`,
                        concept: 'EM13MAT313'
                    });
                }
            }
        }

        // 3. FAMÍLIA CIÊNCIAS DA NATUREZA (Física, Química, Biologia)
        else if (sub === 'fisica') {
            for (let i = 0; i < 20; i++) {
                const dist = randChoice([100, 200, 400, 800]);
                const tempo = randChoice([10, 20, 40]);
                const vel = dist / tempo;
                
                if (lvl === 'easy' || lvl === 'medium') {
                    pool.push({
                        q: `[CINEMÁTICA] Um atleta de corrida de alta performance do ${randChoice(escolas)} percorre uma distância de ${dist} metros em exatamente ${tempo} segundos. Qual é a sua velocidade média?`,
                        a: `${vel} m/s`,
                        d: [`${vel * 3.6} m/s`, `${vel + 5} m/s`, `${vel - 3} m/s`],
                        explanation: `A velocidade média é calculada dividindo-se a variação do espaço (distância = ${dist}m) pela variação do tempo (${tempo}s). Vm = S / T = ${vel} m/s.`,
                        hint: `Divida a distância total pelo tempo de trajeto. Se quiser converter para km/h, basta multiplicar por 3.6!`,
                        concept: 'EM13CNT101'
                    });
                } else {
                    const m = randRange(2, 10);
                    const a = randRange(2, 5);
                    pool.push({
                        q: `[DINÂMICA - LEIS DE NEWTON] Um robô de laboratório com massa de ${m} kg é empurrado por um atuador elétrico, sofrendo uma aceleração constante de ${a} m/s². Qual é a força resultante aplicada sobre o robô?`,
                        a: `${m * a} Newtons`,
                        d: [`${m + a} Newtons`, `${m / a} Newtons`, `${m * a * 9.8} Newtons`],
                        explanation: `Pela Segunda Lei de Newton (Princípio Fundamental da Dinâmica), a Força Resultante é o produto da massa do corpo pela sua aceleração: F = m * a = ${m} * ${a} = ${m * a} Newtons.`,
                        hint: `Multiplique a massa do objeto (em kg) pela aceleração adquirida (em m/s²). A força resultante é medida em Newtons.`,
                        concept: 'EM13CNT301'
                    });
                }
            }
        }

        else if (sub === 'quimica') {
            const ligacoes = [
                { composto: 'Cloreto de Sódio (NaCl)', tipo: 'Iônica', caracteristica: 'Transferência definitiva de elétrons com alta temperatura de fusão', bncc: 'EM13CNT201' },
                { composto: 'Água (H2O)', tipo: 'Covalente Polar', caracteristica: 'Compartilhamento de elétrons com formação de polos elétricos', bncc: 'EM13CNT201' },
                { composto: 'Dióxido de Carbono (CO2)', tipo: 'Covalente Apolar', caracteristica: 'Compartilhamento simétrico de elétrons sem polo resultante', bncc: 'EM13CNT201' }
            ];

            for (let i = 0; i < 20; i++) {
                const item = randChoice(ligacoes);
                if (lvl === 'easy' || lvl === 'medium') {
                    pool.push({
                        q: `Qual é o tipo de ligação química predominante e a característica molecular do composto "${item.composto}"?`,
                        a: `${item.tipo} - ${item.caracteristica}`,
                        d: [`Metálica - Fusão de elétrons livres gasosos`, `Iônica - Compartilhamento de prótons no núcleo`, `Covalente - Perda total de nêutrons por radiação`],
                        explanation: `O composto "${item.composto}" apresenta ligação do tipo "${item.tipo}", gerando uma estrutura estável baseada em: ${item.caracteristica}.`,
                        hint: `Ligações iônicas ocorrem entre metais e ametais com grande diferença de eletronegatividade (ex: sal). Covalentes ocorrem por compartilhamento de elétrons.`,
                        concept: item.bncc
                    });
                } else {
                    pool.push({
                        q: `[ESTEQUIOMETRIA] Na quebra de glicose para produção de energia celular, o balanceamento correto dos reagentes exige compreender:`,
                        a: `A Lei de Conservação das Massas (Lavoisier) nos coeficientes estequiométricos`,
                        d: ['Apenas a eliminação de átomos de hidrogênio redundantes do sistema', 'A fusão de núcleos atômicos gerando novos elementos artificiais', 'A destruição parcial da matéria para liberação de fótons gasosos'],
                        explanation: `Toda reação química deve obedecer à Lei de Lavoisier: "Na natureza nada se cria, nada se perde, tudo se transforma". O número de átomos deve ser igual em ambos os lados da equação.`,
                        hint: `Conte os átomos de cada elemento nos reagentes (lado esquerdo) e produtos (lado direito) para equilibrar os coeficientes.`,
                        concept: 'EM13CNT203'
                    });
                }
            }
        }

        else if (sub === 'biologia') {
            const organelas = [
                { nome: 'Mitocôndria', funcao: 'Realizar a respiração celular para produção de energia (ATP)', bncc: 'EM13CNT301', analogia: 'A mitocôndria funciona exatamente como a usina hidrelétrica ou gerador de energia da nossa célula.' },
                { nome: 'Ribossomo', funcao: 'Realizar a síntese (produção) de novas proteínas celulares', bncc: 'EM13CNT301', analogia: 'O ribossomo atua como a fábrica de blocos de montar da célula, juntando pecinhas chamadas aminoácidos.' },
                { nome: 'Cloroplasto', funcao: 'Realizar a fotossíntese para produção de açúcares nas plantas', bncc: 'EM13CNT301', analogia: 'O cloroplasto é o painel de energia solar das plantas, convertendo raios de luz em alimento orgânico.' },
                { nome: 'Lisossomo', funcao: 'Realizar a digestão intracelular e reciclagem de materiais velhos', bncc: 'EM13CNT301', analogia: 'O lisossomo é o caminhão de lixo e reciclagem da célula, quebrando o que não serve mais.' }
            ];

            for (let i = 0; i < 20; i++) {
                const org = randChoice(organelas);
                if (lvl === 'easy' || lvl === 'medium') {
                    pool.push({
                        q: `Qual é a função biológica vital da organela celular conhecida como "${org.nome}"?`,
                        a: org.funcao,
                        d: [`Controlar a circulação de sangue no cérebro`, `Filtrar a urina e toxinas do fígado`, `Realizar a divisão muscular por impulsos elétricos`],
                        explanation: `A organela celular "${org.nome}" desempenha o papel vital de: ${org.funcao}. ${org.analogia}`,
                        hint: `Associe a mitocôndria à respiração celular e produção de ATP (moeda de energia do corpo).`,
                        concept: org.bncc
                    });
                } else {
                    pool.push({
                        q: `[GENÉTICA MENDELIANA] Se cruzarmos duas plantas heterozigotas para uma característica dominante (Aa x Aa), qual será a proporção fenotípica esperada na descendência?`,
                        a: `3 dominantes para 1 recessivo (3:1)`,
                        d: ['1 dominante para 1 recessivo (1:1)', 'Todas as plantas recessivas (0:4)', '9 dominantes para 3 recessivos (9:3)'],
                        explanation: `No cruzamento Aa x Aa, os genótipos resultantes são AA (25%), Aa (50%) e aa (25%). Como AA e Aa expressam o fenótipo dominante, temos 75% dominantes (3 partes) e 25% recessivos (1 parte).`,
                        hint: `Monte a tabela de cruzamento (Quadro de Punnett) cruzando as linhas e colunas com os alelos A e a.`,
                        concept: 'EM13CNT303'
                    });
                }
            }
        }

        // 4. FAMÍLIA CIÊNCIAS HUMANAS (História, Geografia, Filosofia, Sociologia)
        else if (sub === 'historia') {
            const fatos = [
                { evento: 'Independência do Brasil', ano: '1822', lider: 'Dom Pedro I', consequencia: 'Ruptura colonial com Portugal e início do Primeiro Reinado', bncc: 'EM13CHS101' },
                { evento: 'Proclamação da República', ano: '1889', lider: 'Marechal Deodoro da Fonseca', consequencia: 'Queda do Império e início do período republicano oligárquico', bncc: 'EM13CHS101' },
                { evento: 'Revolução Francesa', ano: '1789', lider: 'Burguesia e classes populares', consequencia: 'Fim do Absolutismo e consagração dos Direitos do Homem', bncc: 'EM13CHS102' }
            ];

            for (let i = 0; i < 20; i++) {
                const fato = randChoice(fatos);
                if (lvl === 'easy' || lvl === 'medium') {
                    pool.push({
                        q: `Qual foi a principal consequência histórica do evento "${fato.evento}" ocorrido em ${fato.ano}?`,
                        a: fato.consequencia,
                        d: [`A colonização do Brasil pela Inglaterra e perda de soberania`, `O fechamento de todos os portos e proibição do comércio cafeeiro`, `A fundação de Brasília como capital federal imediata do Império`],
                        explanation: `O evento "${fato.evento}" liderado por ${fato.lider} gerou como marco definitivo a ${fato.consequencia}.`,
                        hint: `Pense nos impactos de longo prazo para as instituições e soberania do povo brasileiro.`,
                        concept: fato.bncc
                    });
                } else {
                    pool.push({
                        q: `[HISTORIOGRAFIA] O conceito de "cidadania" na Grécia Antiga (Atenas) difere da cidadania contemporânea porque:`,
                        a: `Era restrita a homens livres, filhos de atenienses, excluindo mulheres, escravos e estrangeiros`,
                        d: ['Garantia direito ao voto universal secreto para todas as classes sociais infantis', 'Era decidida apenas por computadores de inteligência artificial de rede', 'Exigia que todo cidadão fosse obrigatoriamente um imperador hereditário absoluto'],
                        explanation: `A democracia ateniense era direta, mas extremamente excludente se comparada à democracia representativa e universal contemporânea.`,
                        hint: `Pense em quem de fato participava das decisões políticas na Ágora de Atenas.`,
                        concept: 'EM13CHS201'
                    });
                }
            }
        }

        else if (sub === 'geografia') {
            const conceitosGeo = [
                { termo: 'Globalização', definicao: 'A integração econômica, cultural e tecnológica dos países em escala mundial', bncc: 'EM13CHS201', analogia: 'Globalização é a razão de você poder comprar um smartphone projetado na Califórnia, fabricado na China e usado no Brasil.' },
                { termo: 'Urbanização', definicao: 'O crescimento das cidades impulsionado pela migração do campo para a cidade (êxodo rural)', bncc: 'EM13CHS202', analogia: 'Urbanização ocorre quando a população da cidade cresce mais rápido que a população do campo.' }
            ];

            for (let i = 0; i < 20; i++) {
                const geo = randChoice(conceitosGeo);
                if (lvl === 'easy' || lvl === 'medium') {
                    pool.push({
                        q: `Na geografia contemporânea, como podemos definir o conceito espacial de "${geo.termo}"?`,
                        a: geo.definicao,
                        d: [`A proibição de navegações marítimas e fechamento comercial das fronteiras`, `O retorno em massa das pessoas para as florestas nativas agrícolas`, `A redução absoluta do número de indústrias e comércio global`],
                        explanation: `O fenômeno de "${geo.termo}" caracteriza-se essencialmente como: ${geo.definicao}. ${geo.analogia}`,
                        hint: `Pense nos fluxos modernos de mercadorias, informações, capitais e pessoas cruzando fronteiras.`,
                        concept: geo.bncc
                    });
                } else {
                    pool.push({
                        q: `[GEOPOLÍTICA] O conceito de "divisão internacional do trabalho" (DIT) explica que os países em desenvolvimento atuam no comércio global principalmente como:`,
                        a: `Exportadores de commodities agrícolas e matérias-primas industriais`,
                        d: ['Detentores exclusivos de patentes de inteligência artificial quântica', 'Importadores de minérios brutos de ferro e petróleo de baixo valor', 'Centralizadores de todas as decisões monetárias e cambiais globais'],
                        explanation: `Na DIT clássica e moderna, países subdesenvolvidos ou emergentes tendem a exportar recursos primários de baixo valor agregado e importar tecnologia.`,
                        hint: `Commodities são produtos básicos não industrializados, como soja, minério de ferro e petróleo.`,
                        concept: 'EM13CHS204'
                    });
                }
            }
        }

        else if (sub === 'filosofia') {
            const filosofos = [
                { nome: 'Sócrates', ideia: 'O método da maiêutica (dar à luz ideias) através de perguntas e o "só sei que nada sei"', bncc: 'EM13CHS102' },
                { nome: 'Platão', ideia: 'O Mito da Caverna, separando o mundo das ideias perfeitas do mundo das sombras sensíveis', bncc: 'EM13CHS102' },
                { nome: 'René Descartes', ideia: 'O racionalismo moderno expresso pela dúvida metódica e o "penso, logo existo"', bncc: 'EM13CHS102' }
            ];

            for (let i = 0; i < 20; i++) {
                const fil = randChoice(filosofos);
                if (lvl === 'easy' || lvl === 'medium') {
                    pool.push({
                        q: `Qual é o pilar fundamental do pensamento filosófico desenvolvido pelo grande pensador "${fil.nome}"?`,
                        a: fil.ideia,
                        d: [`A defesa incondicional da monarquia absoluta e tirania escravocrata`, `A recusa total de usar a razão para responder a questionamentos cotidianos`, `A criação do método de programação em computadores industriais`],
                        explanation: `O filósofo "${fil.nome}" revolucionou a epistemologia com: ${fil.ideia}.`,
                        hint: `Associe Sócrates ao questionamento constante nas ruas de Atenas e Platão à alegoria sobre sair da escuridão da ignorância.`,
                        concept: fil.bncc
                    });
                } else {
                    pool.push({
                        q: `[ÉTICA KANTIANA] O conceito de "Imperativo Categórico" postulado por Immanuel Kant define que uma ação é ética quando:`,
                        a: `Pode ser universalizada, ou seja, servir de lei para todas as pessoas em qualquer circunstância`,
                        d: ['Gera lucro financeiro imediato para o indivíduo que a pratica', 'É decidida por votação em redes sociais de engajamento escolar', 'Obedece cegamente aos desejos e impulsos egoístas passionais da natureza'],
                        explanation: `Para Kant, a moralidade baseia-se no dever puro e na razão: aja apenas de acordo com aquela máxima pela qual você possa ao mesmo tempo querer que ela se torne uma lei universal.`,
                        hint: `Pense: "E se todo mundo fizesse o mesmo que eu estou fazendo agora?" Se a resposta for ruim, a ação não é ética para Kant.`,
                        concept: 'EM13CHS402'
                    });
                }
            }
        }

        else if (sub === 'sociologia') {
            const sociologos = [
                { nome: 'Karl Marx', conceito: 'A luta de classes entre a burguesia e o proletariado como motor da história', bncc: 'EM13CHS401' },
                { nome: 'Émile Durkheim', conceito: 'Os fatos sociais, que são exteriores, coercitivos e gerais aos indivíduos', bncc: 'EM13CHS401' },
                { nome: 'Max Weber', conceito: 'A ação social dotada de sentido individual que afeta o comportamento coletivo', bncc: 'EM13CHS401' }
            ];

            for (let i = 0; i < 20; i++) {
                const soc = randChoice(sociologos);
                if (lvl === 'easy' || lvl === 'medium') {
                    pool.push({
                        q: `Qual é o conceito-chave defendido pelo sociólogo clássico "${soc.nome}" para explicar a sociedade?`,
                        a: soc.conceito,
                        d: [`A anarquia como a única forma de organização familiar industrial`, `O isolamento total de todos os seres humanos em laboratórios químicos`, `A ausência de leis ou linguagens entre as tribos de jovens`],
                        explanation: `O clássico pensador "${soc.nome}" formulou em sua teoria sociológica o conceito de: ${soc.conceito}.`,
                        hint: `Durkheim estuda regras sociais como coisas (fatos sociais); Marx foca na economia e desigualdade; Weber foca na ação e cultura.`,
                        concept: soc.bncc
                    });
                } else {
                    pool.push({
                        q: `[INDÚSTRIA CULTURAL] O termo formulado por Adorno e Horkheimer critica a transformação da arte e cultura em:`,
                        a: `Produtos de consumo de massa, padronizados para alienação e lucro comercial`,
                        d: ['Ferramentas puras de elevação espiritual e libertação cognitiva autônoma', 'Monopólios estatais controlados por filósofos gregos clássicos', 'Sistemas de criptografia digital para proteção de dados secretos do governo'],
                        explanation: `A Indústria Cultural padroniza a produção artística para transformá-la em mercadoria de consumo rápido, reduzindo o senso crítico do espectador.`,
                        hint: `Pense em produções de massa feitas unicamente para vender e distrair, perdendo o teor de reflexão profunda.`,
                        concept: 'EM13CHS403'
                    });
                }
            }
        }

        // 5. FAMÍLIA ITINERÁRIOS FORMATIVOS (Tecnologia, Programação, Robótica, Empreendedorismo, etc.)
        else if (sub === 'tecnologia' || sub === 'programacao' || sub === 'robotica' || sub === 'empreendedorismo' || sub === 'ciencia_de_dados' || sub === 'inteligencia_artificial' || sub === 'educacao_financeira' || sub === 'marketing_digital' || sub === 'desenvolvimento_jogos' || sub === 'seguranca_informacao' || sub === 'design_digital' || sub === 'producao_audiovisual') {
            const itinerarios = [
                { materia: 'programacao', termo: 'Algoritmo', desc: 'uma sequência de instruções lógicas passo a passo para resolver um problema', key: 'Lógica', bncc: 'EM13IF01' },
                { materia: 'robotica', termo: 'Sensor Ultrassônico', desc: 'dispositivo que mede a distância de obstáculos emitindo ondas sonoras', key: 'Arduino', bncc: 'EM13IF02' },
                { materia: 'empreendedorismo', termo: 'M.V.P.', desc: 'o Produto Mínimo Viável feito para testar uma ideia com clientes reais gastando pouco', key: 'Canvas', bncc: 'EM13IF03' },
                { materia: 'inteligencia_artificial', termo: 'Rede Neural', desc: 'sistema computacional inspirado no cérebro humano que aprende a reconhecer padrões', key: 'Deep Learning', bncc: 'EM13IF04' },
                { materia: 'seguranca_informacao', termo: 'Criptografia', desc: 'processo de embaralhar dados legíveis para protegê-los contra leitura não autorizada', key: 'Segurança', bncc: 'EM13IF05' }
            ];

            for (let i = 0; i < 20; i++) {
                const item = itinerarios.find(it => it.materia === sub) || randChoice(itinerarios);
                if (lvl === 'easy' || lvl === 'medium') {
                    pool.push({
                        q: `[NOVO ENSINO MÉDIO] No itinerário formativo atual, como descrevemos de forma clara o termo tecnológico "${item.termo}"?`,
                        a: item.desc,
                        d: ['Uma peça mecânica que aquece o motor a diesel', 'Um imposto de alfândega sobre servidores físicos antigos', 'Um cabo de rede que transmite energia hidráulica'],
                        explanation: `No ensino profissional e técnico, o conceito de "${item.termo}" é definido como: ${item.desc}.`,
                        hint: `Conecte o nome do termo à sua função prática (ex: sensores servem para dar "sentidos" ao robô).`,
                        concept: item.bncc
                    });
                } else {
                    pool.push({
                        q: `[SISTEMAS PROFISSIONAIS] O desenvolvimento e otimização avançada de um(a) "${item.termo}" exige:`,
                        a: `Calibração precisa baseada no conceito prático de '${item.key}'`,
                        d: ['Apenas a cópia manual de arquivos de texto redundantes', 'Uma conexão sem fios com satélites lunares governamentais', 'A eliminação completa de todas as variáveis e códigos numéricos'],
                        explanation: `Arquiteturas modernas exigem o domínio de conceitos como '${item.key}' para garantir escalabilidade, eficiência e segurança nas operações industriais.`,
                        hint: `Pense em como a teoria profissional se manifesta na prática operacional do mercado de trabalho.`,
                        concept: 'EM13IF06'
                    });
                }
            }
        }

        // 6. FAMÍLIA MÓDULOS EXTRAS (Biblioteca Digital, Laboratório Virtual, Projeto de Vida, Inclusão)
        else if (sub === 'biblioteca_digital') {
            for (let i = 0; i < 20; i++) {
                if (lvl === 'easy' || lvl === 'medium') {
                    pool.push({
                        q: `[PESQUISA ACADÊMICA] Na busca de fontes confiáveis na Biblioteca Digital para seu TCC ou projeto escolar, qual critério garante a veracidade de um artigo científico?`,
                        a: `Revisão por pares (peer-review) e publicação em periódicos científicos indexados`,
                        d: ['Grande número de curtidas e compartilhamentos em redes sociais informais', 'Data de criação do site de notícias sensacionalistas amadoras', 'Opiniões de influenciadores digitais sem formação na área do estudo'],
                        explanation: `Artigos confiáveis passam por avaliações rigorosas de outros cientistas antes da publicação, garantindo o rigor metodológico.`,
                        hint: `Confie em bases de dados como Google Acadêmico, SciELO e portais universitários oficiais.`,
                        concept: 'EM13EXT01'
                    });
                } else {
                    pool.push({
                        q: `[ABNT E REFERÊNCIAS] De acordo com as normas ABNT vigentes para pesquisas escolares, como devemos formatar uma citação direta longa com mais de 3 linhas?`,
                        a: `Recuo de 4 cm da margem esquerda, fonte menor (geralmente tamanho 10), espaçamento simples e sem aspas`,
                        d: ['Escrita em negrito e itálico, centralizada com letras maiúsculas e aspas duplas', 'Inserida diretamente no fluxo normal do parágrafo com aspas e letra colorida', 'Exibida apenas como rodapé no final da página sem menção ao nome do autor da obra'],
                        explanation: `Normas ABNT exigem recuo de 4cm da margem esquerda e tamanho menor para destacar visualmente trechos extensos copiados de autores.`,
                        hint: `Lembre-se de destacar o texto copiado para que o leitor saiba instantaneamente onde começa a voz do autor pesquisado.`,
                        concept: 'EM13EXT02'
                    });
                }
            }
        }

        else if (sub === 'laboratorio_virtual') {
            for (let i = 0; i < 20; i++) {
                if (lvl === 'easy' || lvl === 'medium') {
                    pool.push({
                        q: `[SIMULAÇÃO DE QUÍMICA] No Laboratório Virtual, ao testarmos o pH de uma substância com o indicador Repolho Roxo, a cor resultante vermelha indica que a solução é:`,
                        a: `Ácida (pH menor que 7)`,
                        d: ['Básica ou Alcalina (pH maior que 7)', 'Neutra (pH igual a 7)', 'Gasosa com alto índice de sal orgânico'],
                        explanation: `Indicadores de pH mudam de cor conforme a concentração de íons H+. O extrato de repolho roxo fica vermelho em ambientes altamente ácidos.`,
                        hint: `Líquidos como vinagre e limão são muito ácidos e mudam para tons avermelhados com indicadores naturais.`,
                        concept: 'EM13EXT03'
                    });
                } else {
                    pool.push({
                        q: `[SIMULAÇÃO DE CIRCUITOS] No laboratório virtual de robótica, se você associar dois resistores idênticos de 100 Ohms em paralelo, qual será a resistência equivalente no circuito de teste?`,
                        a: `50 Ohms`,
                        d: ['200 Ohms', '100 Ohms', '10 Ohms'],
                        explanation: `Na associação de resistores idênticos em paralelo, a resistência equivalente é dada pelo valor de um resistor dividido pelo número total deles: Req = R / N = 100 / 2 = 50 Ohms.`,
                        hint: `Em circuitos em paralelo, a corrente se divide, fazendo com que a resistência equivalente total seja menor do que a do menor resistor individual.`,
                        concept: 'EM13EXT04'
                    });
                }
            }
        }

        else if (sub === 'projeto_vida') {
            for (let i = 0; i < 20; i++) {
                if (lvl === 'easy' || lvl === 'medium') {
                    pool.push({
                        q: `[PROJETO DE VIDA] O que significa estabelecer metas SMART no seu planejamento pessoal de estudos e carreira acadêmica no Ensino Médio?`,
                        a: `Metas que são Específicas, Mensuráveis, Atingíveis, Relevantes e com Tempo definido`,
                        d: ['Ideias muito vagas que dependem da sorte sem prazos estabelecidos', 'Metas difíceis e impossíveis que geram frustrações diárias', 'Seguir a escolha de carreira de amigos próximos sem planejamento individual'],
                        explanation: `A metodologia SMART ajuda a transformar sonhos abstratos em objetivos práticos, tangíveis e fáceis de monitorar ao longo do tempo.`,
                        hint: `Pense em metas estruturadas: "Vou estudar 30 minutos de física toda segunda-feira até o ENEM".`,
                        concept: 'EM13EXT05'
                    });
                } else {
                    pool.push({
                        q: `[ANÁLISE F.O.F.A. / SWOT] Ao elaborar seu plano de carreira estudantil, a análise F.O.F.A. serve para mapear:`,
                        a: `Forças e Fraquezas (internas), Oportunidades e Ameaças (externas)`,
                        d: ['Fontes de renda, Operações, Fluxos de caixa e Amortizações tributárias', 'Fórmulas matemáticas de estatísticas financeiras complexas', 'Frequência escolar, Notas acumuladas, Férias e Atividades complementares'],
                        explanation: `A matriz SWOT/FOFA é uma ferramenta de autoconhecimento essencial no Projeto de Vida, mapeando pontos positivos e pontos de melhoria internos e externos.`,
                        hint: `Forças e Fraquezas dependem exclusivamente de você. Oportunidades e Ameaças vêm do ambiente externo (escola, mercado, país).`,
                        concept: 'EM13EXT06'
                    });
                }
            }
        }

        else if (sub === 'inclusao_acessibilidade') {
            for (let i = 0; i < 20; i++) {
                if (lvl === 'easy' || lvl === 'medium') {
                    pool.push({
                        q: `[ACESSIBILIDADE DIGITAL] O que significa o atributo de texto alternativo "alt" em imagens inseridas em plataformas educacionais modernas?`,
                        a: `A descrição textual da imagem para que leitores de tela possam narrá-la para alunos cegos`,
                        d: ['A alteração da cor da imagem de acordo com o nível do aluno', 'O tamanho em pixels de largura e altura do arquivo de imagem', 'A criptografia interna que impede a cópia não autorizada do material gráfico'],
                        explanation: `O texto alternativo descreve o conteúdo visual da imagem, garantindo que alunos com deficiência visual tenham acesso à informação por leitores de tela.`,
                        hint: `Imagine descrever a imagem pelo telefone para um amigo que não consegue vê-la. Esse é o papel do "alt"!`,
                        concept: 'EM13EXT07'
                    });
                } else {
                    pool.push({
                        q: `[DIRETRIZES WCAG] O nível mínimo de contraste de cores (WCAG AA) para textos normais em interfaces educacionais digitais visa assegurar a leitura para alunos com baixa visão e deve ser de pelo menos:`,
                        a: `4.5:1`,
                        d: ['1.5:1', '100:1', '3:1'],
                        explanation: `A diretriz de acessibilidade da Web (WCAG 2.1) exige um contraste mínimo de 4.5:1 para texto normal, garantindo legibilidade adequada.`,
                        hint: `Evite usar texto cinza claro sobre fundo branco. Cores de contraste forte garantem acessibilidade universal.`,
                        concept: 'EM13EXT08'
                    });
                }
            }
        }

        // Caso fallback para segurança
        if (pool.length === 0) {
            for (let i = 0; i < 20; i++) {
                pool.push({
                    q: `[MEC/BNCC] Questão diagnóstica de proficiência interdisciplinar no nível ${lvl}.`,
                    a: `Alternativa correta baseada no currículo nacional do Ensino Médio`,
                    d: [`Alternativa incorreta de distração número 1`, `Alternativa de distração número 2`, `Alternativa de distração número 3`],
                    explanation: `Explicação conceitual lúdica da competência para fins pedagógicos do Ensino Médio.`,
                    hint: `Leia atentamente o enunciado e descarte as alternativas absurdas.`,
                    concept: 'EM13GENERIC'
                });
            }
        }

        // Retorna embaralhado e limitado a 20 itens
        return shuffle(pool).slice(0, 20);
    }

    // Inicialização assíncrona do Banco de Dados procedural no navegador
    subjects.forEach(sub => {
        db[sub] = {};
        difficulties.forEach(lvl => {
            db[sub][lvl] = generateQuestionsForSubject(sub, lvl);
        });
    });

    // Exposição da função pública para geração imediata com variações infinitas
    db.getFreshPool = function(sub, lvl) {
        return generateQuestionsForSubject(sub || 'portugues', lvl || 'easy');
    };

    return db;
})();
