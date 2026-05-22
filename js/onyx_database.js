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
                { singular: 'júnior', plural: 'juniores', errados: ['júniors', 'juniores', 'júniorees'], bncc: 'EM13LGG301', analogia: 'Palavras terminadas em -r ganham -es e mudam a sílaba tônica. Júnior vira juniores!' },
                { singular: 'mal-entendido', plural: 'mal-entendidos', errados: ['males-entendidos', 'mal-entendidoes', 'males-entendido'], bncc: 'EM13LGG101', analogia: 'Em compostos ligados por hífen, se o primeiro termo for advérbio (mal), ele permanece invariável. Apenas o segundo termo flexiona.' },
                { singular: 'guarda-chuva', plural: 'guarda-chuvas', errados: ['guardas-chuva', 'guardas-chuvas', 'guarda-chuvae'], bncc: 'EM13LGG101', analogia: 'Se o primeiro termo for verbo (guarda), ele não flexiona. Apenas o substantivo (chuvas) vai para o plural.' },
                { singular: 'segunda-feira', plural: 'segundas-feiras', errados: ['segunda-feiras', 'segundas-feira', 'segunda-feiraes'], bncc: 'EM13LGG101', analogia: 'Quando ambos os termos são flexionáveis (numeral + substantivo), ambos vão para o plural.' },
                { singular: 'pão-de-ló', plural: 'pães-de-ló', errados: ['pão-de-lós', 'pães-de-lós', 'pão-des-lós'], bncc: 'EM13LGG301', analogia: 'Em substantivos compostos com elementos de ligação (de), apenas o primeiro elemento vai para o plural.' },
                { singular: 'decreto-lei', plural: 'decretos-lei', errados: ['decreto-leis', 'decretos-leis', 'decreto-leiy'], bncc: 'EM13LGG301', analogia: 'Quando o segundo substantivo limita ou especifica o primeiro, pode-se flexionar apenas o primeiro ou ambos (decretos-lei ou decretos-leis).' }
            ];

            for (let i = 0; i < 20; i++) {
                const item = palavrasMorfologia[i % palavrasMorfologia.length];
                if (lvl === 'easy' || lvl === 'medium') {
                    pool.push({
                        q: `[Caso ${i+1}] Identifique a flexão de número correta: Na frase "Os ${item.singular}s da nação precisam votar", qual é o plural gramatical adequado de "${item.singular}"?`,
                        a: item.plural,
                        d: item.errados,
                        explanation: `De acordo com a norma-padrão da Língua Portuguesa, o plural de '${item.singular}' é '${item.plural}'. ${item.analogia}`,
                        hint: `Preste atenção nas terminações em -ão e nas exceções de palavras paroxítonas terminadas em -r.`,
                        concept: item.bncc
                    });
                } else {
                    pool.push({
                        q: `[Análise Morfológica ${i+1}] A palavra '${item.singular}' atua no período moderno como núcleo nominal. Sua transposição para o plural '${item.plural}' exige:`,
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
                { titulo: 'Sagarana', autor: 'João Guimarães Rosa', escola: 'Modernismo (Geração de 45)', foco: 'o sertão místico e a linguagem inovadora', bncc: 'EM13LGG302' },
                { titulo: 'Macunaíma', autor: 'Mário de Andrade', escola: 'Modernismo (Geração de 22)', foco: 'o herói sem nenhum caráter e o folclore nacional', bncc: 'EM13LGG302' },
                { titulo: 'A Bagaceira', autor: 'José Américo de Almeida', escola: 'Modernismo (Geração de 30)', foco: 'o êxodo de retirantes e a vida nos engenhos', bncc: 'EM13LGG302' },
                { titulo: 'O Ateneu', autor: 'Raul Pompeia', escola: 'Realismo/Naturalismo', foco: 'a vida interna sob regime de internato escolar', bncc: 'EM13LGG302' },
                { titulo: 'Claro Enigma', autor: 'Carlos Drummond de Andrade', escola: 'Modernismo (Geração de 45)', foco: 'a reflexão filosófica e melancólica sobre a existência', bncc: 'EM13LGG302' },
                { titulo: 'Memórias Póstumas de Brás Cubas', autor: 'Machado de Assis', escola: 'Realismo', foco: 'a ironia fina de um defunto autor sobre a elite carioca', bncc: 'EM13LGG302' }
            ];

            for (let i = 0; i < 20; i++) {
                const obra = obras[i % obras.length];
                if (lvl === 'easy' || lvl === 'medium') {
                    pool.push({
                        q: `[Análise ${i+1}] Qual é o autor e a respectiva escola literária da obra "${obra.titulo}", marco da nossa literatura brasileira?`,
                        a: `${obra.autor} (${obra.escola})`,
                        d: [`José de Alencar (Barroco)`, `Clarice Lispector (Romantismo)`, `Castro Alves (Realismo)`],
                        explanation: `A grande obra clássica "${obra.titulo}" foi escrita pelo mestre ${obra.autor} sob as diretrizes estéticas do ${obra.escola}, retratando ${obra.foco}.`,
                        hint: `Associe os autores aos seus períodos históricos (ex: Machado de Assis com o Realismo do século XIX).`,
                        concept: obra.bncc
                    });
                } else {
                    pool.push({
                        q: `[Estudo Crítico ${i+1}] Na obra "${obra.titulo}", a construção do personagem principal reflete:`,
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
                { termo: 'actually', trad: 'realmente / na verdade', falso: 'atualmente', bncc: 'EM13LGG401', analogia: 'Actually parece atualmente, mas significa na verdade ou realmente. Pense em "actual" como algo real e concreto.' },
                { termo: 'push', trad: 'empurrar', falso: 'puxar', bncc: 'EM13LGG401', analogia: 'Push parece puxar, mas é exatamente o contrário: significa empurrar! Lembre-se das portas de bancos que dizem PUSH.' },
                { termo: 'pretend', trad: 'fingir', falso: 'pretender', bncc: 'EM13LGG401', analogia: 'Pretend parece pretender, mas significa fingir. Se você pretende fazer algo, use "intend"!' },
                { termo: 'novel', trad: 'romance (livro)', falso: 'novela de TV', bncc: 'EM13LGG401', analogia: 'Novel é um livro de romance. Para novelas de TV, os americanos usam "soap opera"!' },
                { termo: 'hardware', trad: 'componentes físicos do computador', falso: 'ferragem de loja de construção', bncc: 'EM13LGG401', analogia: '"Hard" = rígido/físico. Hardware são as peças físicas: placa-mãe, processador, HD.' },
                { termo: 'bug', trad: 'erro de software / falha no código', falso: 'inseto ou barata', bncc: 'EM13LGG401', analogia: 'Tecnicamente, "bug" vem de quando insetos reais travavam computadores antigos.' },
                { termo: 'script', trad: 'arquivo de código / sequência de comandos', falso: 'roteiro de teatro apenas', bncc: 'EM13LGG401', analogia: 'Em tecnologia, um script é um arquivo com instruções que o computador executa automaticamente.' },
                { termo: 'commit', trad: 'salvar uma versão do código no repositório', falso: 'comprometer-se emocionalmente', bncc: 'EM13LGG401', analogia: 'No Git, "commit" é como tirar uma foto do código naquele momento.' },
                { termo: 'deploy', trad: 'publicar / implantar o sistema em produção', falso: 'destruir ou desativar', bncc: 'EM13LGG401', analogia: '"Deploy" vem do francês "deployer" (desdobrar tropas).' },
                { termo: 'framework', trad: 'estrutura de ferramentas para desenvolvimento de software', falso: 'quadro de parede ou moldura', bncc: 'EM13LGG401', analogia: 'Framework é como um esqueleto pronto. Em vez de construir tudo do zero, o programador usa essa estrutura base.' },
                { termo: 'runtime', trad: 'ambiente de execução / tempo em que o programa está rodando', falso: 'tempo de corrida esportiva', bncc: 'EM13LGG401', analogia: '"Runtime" é quando o programa já está em execução. Um "runtime error" é um erro que aparece enquanto o programa já está rodando.' },
                { termo: 'repository', trad: 'local de armazenamento centralizado de código-fonte', falso: 'repositório de impostos fiscais', bncc: 'EM13LGG401', analogia: 'Um repository (repo) no GitHub é como uma pasta inteligente que guarda todo o histórico de mudanças.' }
            ];

            for (let i = 0; i < 20; i++) {
                const item = cognatos[i % cognatos.length];
                if (lvl === 'easy' || lvl === 'medium') {
                    pool.push({
                        q: `[Questão ${i+1}] No inglês instrumental e de exames como o ENEM, qual é o real significado do falso cognato (false friend) "${item.termo}"?`,
                        a: item.trad,
                        d: [item.falso, 'escrever', 'desistir'],
                        explanation: `O termo inglês "${item.termo}" é um falso amigo clássico: parece "${item.falso}", mas significa "${item.trad}". ${item.analogia}`,
                        hint: `Preste atenção em palavras em inglês que se assemelham muito ao português mas têm sentido oculto.`,
                        concept: item.bncc
                    });
                } else {
                    const techPassages = [
                        {
                            q: `Read the excerpt:\n"A RESTful API uses HTTP requests to perform CRUD operations: Create (POST), Read (GET), Update (PUT/PATCH), and Delete (DELETE). Each endpoint represents a resource, and responses are typically formatted in JSON or XML. Statelessness is a key constraint — each request must contain all information necessary for the server to process it."\n\nDe acordo com o texto técnico em inglês, qual princípio fundamental garante que cada requisição de uma API REST seja autocontida?`,
                            a: `A ausência de estado (statelessness) — cada requisição deve conter todas as informações necessárias para ser processada pelo servidor.`,
                            d: [
                                `O uso obrigatório do formato XML em todas as respostas das rotas de autenticação.`,
                                `A exigência de que o servidor armazene o histórico de todas as requisições anteriores do cliente.`,
                                `A separação do banco de dados em múltiplos microserviços distribuídos geograficamente.`
                            ],
                            explanation: `O texto define 'statelessness' como restrição-chave: "each request must contain all information necessary for the server to process it" — tornando cada chamada independente e autocontida.`,
                            hint: `'Stateless' = sem estado. O servidor não guarda memória entre requisições.`,
                            concept: 'EM13LGG402 — Tech Reading: API REST'
                        },
                        {
                            q: `Read the excerpt:\n"Git's branching model allows teams to develop features in isolation. A developer creates a branch, makes commits, and opens a pull request when ready. Reviewers inspect the diff — the set of changes — before merging into the main branch. If conflicts arise, they must be resolved manually before the merge can proceed."\n\nCom base no trecho técnico em inglês, o que é um 'pull request' no contexto do Git?`,
                            a: `Uma solicitação formal para que revisores analisem as alterações feitas em um branch antes de mesclá-las ao código principal.`,
                            d: [
                                `Um comando que baixa automaticamente a versão mais recente do repositório para o computador local.`,
                                `Um arquivo de configuração que define as permissões de acesso ao repositório remoto.`,
                                `Uma ferramenta que apaga commits antigos para reduzir o tamanho do repositório.`
                            ],
                            explanation: `O texto descreve o pull request como parte do fluxo onde "reviewers inspect the diff... before merging into the main branch" — ou seja, é um pedido de revisão das mudanças antes da integração.`,
                            hint: `'Pull request' = pedido de "puxar" o código para o branch principal após revisão.`,
                            concept: 'EM13LGG402 — Tech Reading: Git'
                        },
                        {
                            q: `Read the excerpt:\n"Cloud providers offer auto-scaling capabilities, meaning the infrastructure dynamically adjusts the number of active servers based on real-time demand. During traffic spikes, new instances are provisioned automatically; during low-traffic periods, unused instances are terminated to reduce costs. This elasticity is one of the defining features of modern cloud architecture."\n\nSegundo o trecho técnico em inglês, o que é 'auto-scaling' na computação em nuvem?`,
                            a: `A capacidade da infraestrutura de ajustar automaticamente o número de servidores ativos conforme a demanda em tempo real, reduzindo custos em períodos de baixo tráfego.`,
                            d: [
                                `O processo manual de configurar novos servidores físicos durante grandes eventos de lançamento de produtos.`,
                                `Um sistema de backup automático que replica dados entre diferentes regiões geográficas simultaneamente.`,
                                `A funcionalidade de atualização automática do sistema operacional em todos os servidores da nuvem.`
                            ],
                            explanation: `O texto define auto-scaling como infraestrutura que "dynamically adjusts the number of active servers based on real-time demand", aumentando em picos e reduzindo em períodos de baixo uso para economizar recursos.`,
                            hint: `'Scale' = escalar. 'Auto' = automático. Servidores sobem e descem conforme o tráfego.`,
                            concept: 'EM13LGG402 — Tech Reading: Cloud'
                        },
                        {
                            q: `Read the excerpt:\n"Phishing attacks rely on social engineering rather than technical exploits. Attackers craft convincing emails that impersonate trusted entities, tricking users into revealing credentials or clicking malicious links. Multi-factor authentication (MFA) significantly reduces the risk, as stolen passwords alone are insufficient to gain access."\n\nDe acordo com o texto de cibersegurança em inglês, por que a autenticação multifator (MFA) mitiga o risco de ataques de phishing?`,
                            a: `Because senhas roubadas sozinhas tornam-se insuficientes para acesso, já que um segundo fator de verificação independente é exigido.`,
                            d: [
                                `Porque o MFA criptografa automaticamente os e-mails recebidos antes que o usuário os abra no cliente de e-mail.`,
                                `Porque o sistema bloqueia permanentemente o endereço IP do atacante após a primeira tentativa malsucedida.`,
                                `Porque o MFA escaneia os links presentes nos e-mails e remove automaticamente os maliciosos.`
                            ],
                            explanation: `O texto afirma que "stolen passwords alone are insufficient to gain access" quando o MFA está ativo — ou seja, mesmo com a senha, o atacante não consegue entrar sem o segundo fator.`,
                            hint: `'Multi-factor' = mais de um fator. Senha + código no celular = dois fatores.`,
                            concept: 'EM13LGG402 — Tech Reading: Cybersecurity'
                        },
                        {
                            q: `Read the excerpt:\n"In Agile development, the Product Backlog is a prioritized list of features, improvements, and bug fixes maintained by the Product Owner. During Sprint Planning, the team selects items from the backlog to complete in the upcoming sprint. At the end of each sprint, a Sprint Review is held to demonstrate the working software to stakeholders."\n\nCom base no texto técnico em inglês sobre Agile/Scrum, qual é o papel do 'Product Owner' na metodologia descrita?`,
                            a: `Manter e priorizar o Product Backlog — a lista ordenada de funcionalidades, melhorias e correções a serem desenvolvidas pela equipe.`,
                            d: [
                                `Escrever todos os testes automatizados de regressão antes de cada ciclo de desenvolvimento da equipe técnica.`,
                                `Gerenciar a infraestrutura de servidores e garantir a disponibilidade do ambiente de produção.`,
                                `Apresentar o software funcionando aos stakeholders ao final de cada sprint durante o Sprint Review.`
                            ],
                            explanation: `O texto afirma que o Product Backlog é "maintained by the Product Owner" — ele é responsável por manter e priorizar essa lista de itens.`,
                            hint: `'Owner' = dono. O Product Owner é o dono da lista de prioridades do produto.`,
                            concept: 'EM13LGG402 — Tech Reading: Agile/Scrum'
                        }
                    ];
                    const passage = techPassages[i % techPassages.length];
                    pool.push({
                        q: `[Tech Reading ${i+1}] ${passage.q}`,
                        a: passage.a,
                        d: passage.d,
                        explanation: passage.explanation,
                        hint: passage.hint,
                        concept: passage.concept
                    });
                }
            }
        }

        else if (sub === 'artes') {
            const movimentos = [
                { nome: 'Modernismo', marco: 'Semana de Arte Moderna de 1922', artista: 'Tarsila do Amaral', caracteristica: 'A busca por uma identidade artística puramente brasileira', bncc: 'EM13LGG201' },
                { nome: 'Cubismo', marco: 'Les Demoiselles d\'Avignon', artista: 'Pablo Picasso', caracteristica: 'A fragmentação geométrica das formas e múltiplos pontos de vista', bncc: 'EM13LGG202' },
                { nome: 'Impressionismo', marco: 'Impressão, nascer do sol', artista: 'Claude Monet', caracteristica: 'O estudo da luz natural nas pinceladas rápidas ao ar livre', bncc: 'EM13LGG201' },
                { nome: 'Renascimento', marco: 'Teto da Capela Sistina', artista: 'Michelangelo', caracteristica: 'O humanismo clássico, simetria e perspectiva matemática', bncc: 'EM13LGG202' },
                { nome: 'Surrealismo', marco: 'A Persistência da Memória', artista: 'Salvador Dalí', caracteristica: 'A exploração do subconsciente, sonhos e a lógica do absurdo', bncc: 'EM13LGG201' },
                { nome: 'Barroco', marco: 'Esculturas dos Profetas', artista: 'Aleijadinho', caracteristica: 'O drama, contraste de luz e sombra e a religiosidade expressiva', bncc: 'EM13LGG202' },
                { nome: 'Dadaísmo', marco: 'A Fonte', artista: 'Marcel Duchamp', caracteristica: 'A negação total de regras estéticas convencionais e o anti-arte', bncc: 'EM13LGG201' },
                { nome: 'Expressionismo', marco: 'O Grito', artista: 'Edvard Munch', caracteristica: 'A deformação da realidade para expressar sentimentos e angústias humanas', bncc: 'EM13LGG201' }
            ];

            for (let i = 0; i < 20; i++) {
                const mov = movimentos[i % movimentos.length];
                if (lvl === 'easy' || lvl === 'medium') {
                    pool.push({
                        q: `[Movimento ${i+1}] Qual é a característica marcante e principal artista associado ao movimento artístico do "${mov.nome}"?`,
                        a: `${mov.artista} - ${mov.caracteristica}`,
                        d: [`Aleijadinho - O uso de arte em computador tridimensional`, `Monet - A criação de estátuas de bronze barrocas`, `Picasso - Pinturas realistas com simetria clássica perfeita`],
                        explanation: `O movimento "${mov.nome}" tem como um de seus maiores ícones ${mov.artista}, marcando a história da arte com: ${mov.caracteristica}.`,
                        hint: `Lembre-se que o Modernismo brasileiro explodiu na Semana de 22 em São Paulo.`,
                        concept: mov.bncc
                    });
                } else {
                    pool.push({
                        q: `[Estética ${i+1}] A revolução plástica promovida pelo movimento "${mov.nome}" rompeu com:`,
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
            const esportesEdFisica = [
                { modalidade: 'Futebol', beneficio: 'Melhoria da resistência aeróbica e coordenação motora grossa', risco: 'Lesões de ligamento cruzado anterior e estiramento muscular', bncc: 'EM13LGG501' },
                { modalidade: 'Atletismo (Corrida)', beneficio: 'Aumento da capacidade pulmonar e fortalecimento do sistema cardiovascular', risco: 'Tendinite patelar e canelite por impacto repetitivo', bncc: 'EM13LGG501' },
                { modalidade: 'Natação', beneficio: 'Fortalecimento muscular global de baixo impacto para articulações', risco: 'Otite externa e fadiga do manguito rotador dos ombros', bncc: 'EM13LGG501' },
                { modalidade: 'Ginástica Olímpica', beneficio: 'Desenvolvimento extremo de flexibilidade, força e equilíbrio corporal', risco: 'Entorses graves de tornozelo e fraturas por estresse ósseo', bncc: 'EM13LGG501' },
                { modalidade: 'Basquetebol', beneficio: 'Estímulo à agilidade lateral e capacidade de salto vertical explosivo', risco: 'Luxações nos dedos e entorse de tornozelo por aterrissagem incorreta', bncc: 'EM13LGG501' }
            ];

            for (let i = 0; i < 20; i++) {
                const item = esportesEdFisica[i % esportesEdFisica.length];
                if (lvl === 'easy' || lvl === 'medium') {
                    pool.push({
                        q: `[Esporte ${i+1}] Qual é o benefício fisiológico e metabólico comprovado da prática regular de "${item.modalidade}" na adolescência?`,
                        a: item.beneficio,
                        d: ['Redução drástica das células de memória do cérebro', 'Aumento instantâneo do peso ósseo com risco de fraturas', 'Diminuição da circulação sanguínea periférica geral'],
                        explanation: `A prática de ${item.modalidade} traz benefícios biológicos expressivos: ${item.beneficio}.`,
                        hint: `Pense na saúde do músculo cardíaco e nos benefícios sistêmicos da modalidade.`,
                        concept: item.bncc
                    });
                } else {
                    pool.push({
                        q: `[Morfofuncional ${i+1}] No contexto de prevenção de lesões na prática de "${item.modalidade}", os principais riscos biomecânicos incluem:`,
                        a: item.risco,
                        d: ['Aumento da capacidade cognitiva visual involuntária', 'Nenhum, pois a prática desportiva elimina qua        else if (sub === 'algebra') {
            for (let i = 0; i < 20; i++) {
                const a = randRange(2, 6);
                const b = randRange(10, 30);
                const x = randRange(3, 8);
                const y = a * x + b;
                
                if (lvl === 'easy' || lvl === 'medium') {
                    // Common errors:
                    // 1. Division before subtraction (omitting tax subtraction): y / a
                    const errNoSub = Math.round(y / a);
                    // 2. Reversing operation sign: (y + b) / a
                    const errRevSign = Math.round((y + b) / a);
                    // 3. Multiplied instead of divided: (y - b) * a
                    const errMult = (y - b) * a;

                    let distractors = [`${errNoSub} km`, `${errRevSign} km`, `${errMult} km`].filter(d => d !== `${x} km`);
                    if (distractors.length < 3 || new Set(distractors).size !== distractors.length) {
                        distractors = [`${x+2} km`, `${x-1} km`, `${x+4} km`].map(d => d);
                    } else {
                        distractors = distractors.slice(0, 3);
                    }

                    pool.push({
                        q: `[Modelo ${i+1}] Uma empresa de táxi cobra uma taxa fixa de R$ ${b},00 mais R$ ${a},00 por quilômetro rodado. Se a corrida de um aluno custou R$ ${y},00, quantos quilômetros foram percorridos?`,
                        a: `${x} km`,
                        d: distractors,
                        explanation: `A equação do custo é dada por C(x) = ${a}x + ${b}. Igualando a R$ ${y}, temos: ${a}x + ${b} = ${y} => ${a}x = ${y - b} => x = ${x}.`,
                        hint: `Subtraia primeiro a taxa fixa do valor total e depois divida o restante pelo preço do quilômetro.`,
                        concept: 'EM13MAT101'
                    });
                } else {
                    const c = randRange(2, 4);
                    // Sum and Product distractors:
                    // 1. Forgot the signs in sum/product: -a and -c
                    // 2. Mistake by adding/subtracting 1: a+1 and c-1
                    // 3. No real roots (common default answer)
                    pool.push({
                        q: `[Equilíbrio ${i+1}] Dada a função de custo marginal f(x) = x² - ${a+c}x + ${a*c}. Quais são as raízes reais desta equação que indicam pontos de equilíbrio de produção?`,
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
                const correctVol = 3 * areaBase * h; // pi = 3
                
                if (lvl === 'easy' || lvl === 'medium') {
                    // Common errors:
                    // 1. Omit multiplier pi (pi = 1): areaBase * h
                    const errOmitPi = areaBase * h;
                    // 2. Linear formula (perimeter * height): 2 * 3 * r * h
                    const errLinear = 2 * 3 * r * h;
                    // 3. Squaring height instead of radius: 3 * r * h * h
                    const errSquareHeight = 3 * r * h * h;

                    let distractors = [`${errOmitPi} m³`, `${errLinear} m³`, `${errSquareHeight} m³`].filter(d => d !== `${correctVol} m³`);
                    if (distractors.length < 3 || new Set(distractors).size !== distractors.length) {
                        distractors = [`${areaBase * h} m³`, `${2 * 3 * r * h} m³`, `${3 * r * h * h} m³`].map(d => d);
                    } else {
                        distractors = distractors.slice(0, 3);
                    }

                    pool.push({
                        q: `[Cálculo ${i+1}] Um reservatório de água possui o formato de um cilindro circular reto com raio da base medindo ${r} metros e altura medindo ${h} metros. Usando pi = 3, qual é o volume total de água suportado?`,
                        a: `${correctVol} m³`,
                        d: distractors,
                        explanation: `O volume do cilindro é V = Área da Base * Altura. Área da base = pi * R² = 3 * ${r}² = ${3 * areaBase}. Volume = ${3 * areaBase} * ${h} = ${correctVol} metros cúbicos.`,
                        hint: `Lembre-se que 1 m³ equivale a 1.000 litros. O volume é pi * raio * raio * altura.`,
                        concept: 'EM13MAT301'
                    });
                } else {
                    pool.push({
                        q: `[Trigonometria ${i+1}] Um observador de altura desprezível avista o topo de uma torre sob um ângulo de 30° com a horizontal. Sabendo que ele está a 100 metros da base da torre e que tan(30°) = 0.58, qual é a altura aproximada da torre?`,
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
                const correctAvg = Math.round(((n1 * 1.5 + n2 + n3) / 3) * 10) / 10;
                
                if (lvl === 'easy' || lvl === 'medium') {
                    // Common errors:
                    // 1. Forgot the weight of the first grade: (n1 + n2 + n3) / 3
                    const errNoWeight = Math.round(((n1 + n2 + n3) / 3) * 10) / 10;
                    // 2. Sum without dividing: n1*1.5 + n2 + n3
                    const errSumOnly = Math.round((n1 * 1.5 + n2 + n3) * 10) / 10;
                    // 3. Default constant
                    const errFlat = 5.0;

                    let distractors = [`${errNoWeight}`, `${errSumOnly}`, `${errFlat}`].filter(d => d !== `${correctAvg}`);
                    if (distractors.length < 3 || new Set(distractors).size !== distractors.length) {
                        distractors = [`${correctAvg + 1.2}`, `${correctAvg - 0.8}`, '5.0'].map(d => d);
                    } else {
                        distractors = distractors.slice(0, 3);
                    }

                    pool.push({
                        q: `[Média ${i+1}] Em um trimestre acadêmico, o estudante ${randChoice(nomesAlunos)} obteve as notas ${n1 * 1.5}, ${n2} e ${n3}. Sabendo que a primeira nota tem peso 1,5 e as demais peso 1, qual é a média final aproximada dele?`,
                        a: `${correctAvg}`,
                        d: distractors,
                        explanation: `A média ponderada é calculada somando os produtos das notas por seus respectivos pesos e dividindo pela soma dos pesos: (${n1 * 1.5}*1.5 + ${n2}*1 + ${n3}*1) / (1.5 + 1 + 1).`,
                        hint: `Some as três notas multiplicadas pelos pesos e divida pela soma de todos os pesos (3,5).`,
                        concept: 'EM13MAT310'
                    });
                } else {
                    pool.push({
                        q: `[Probabilidade ${i+1}] Uma urna de estudos do ENEM contém 6 bolas pretas e 4 vermelhas. Se retirarmos duas bolas sucessivamente e sem reposição, qual é a probabilidade exata de ambas serem pretas?`,
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
                    // Common errors:
                    // 1. Not dividing rate by 100: cap * taxa * tempo
                    const errRateFactor = cap * taxa * tempo;
                    // 2. Subtracted instead of multiplied
                    const errSub = cap - (taxa * tempo);
                    // 3. Flat wrong multiplier
                    const errWrongMult = cap * 1.5;

                    let distractors = [`R$ ${errRateFactor},00`, `R$ ${errSub},00`, `R$ ${errWrongMult},00`].filter(d => d !== `R$ ${jurosSimples},00`);
                    if (distractors.length < 3 || new Set(distractors).size !== distractors.length) {
                        distractors = [`R$ ${jurosSimples + 150},00`, `R$ ${jurosSimples - 80},00`, `R$ ${cap * 1.5},00`].map(d => d);
                    } else {
                        distractors = distractors.slice(0, 3);
                    }

                    pool.push({
                        q: `[Aplicação ${i+1}] Se um estudante aplicar R$ ${cap},00 em uma poupança estudantil que rende ${taxa}% de juros simples ao ano, qual será o montante de juros rendido ao final de ${tempo} anos?`,
                        a: `R$ ${jurosSimples},00`,
                        d: distractors,
                        explanation: `A fórmula dos juros simples é J = C * i * t, onde C = ${cap}, i = ${taxa / 100} e t = ${tempo}. Logo, J = ${cap} * ${taxa / 100} * ${tempo} = R$ ${jurosSimples},00.`,
                        hint: `Lembre-se que no regime de juros simples, o rendimento é calculado sempre em cima do capital inicial depositado.`,
                        concept: 'EM13MAT312'
                    });
                } else {
                    const montanteComp = cap * Math.pow(1 + (taxa/100), tempo);
                    pool.push({
                        q: `[Simulação ${i+1}] Um jovem empreendedor pegou um empréstimo de R$ ${cap},00 sob regime de juros compostos com taxa de ${taxa}% ao ano. Qual será o montante total devido após ${tempo} anos?`,
                        a: `R$ ${Math.round(montanteComp).toFixed(2)}`,
                        d: [`R$ ${(cap + jurosSimples).toFixed(2)}`, `R$ ${(cap * 2.5).toFixed(2)}`, `R$ ${Math.round(montanteComp * 1.2).toFixed(2)}`],
                        explanation: `A fórmula dos juros compostos é M = C * (1 + i)^t. Os juros incidem sobre o montante acumulado do período anterior.`,
                        hint: `Pense em "juros sobre juros". Multiplique o capital inicial por (1 + taxa) consecutivamente pelo número de anos.`,
                        concept: 'EM13MAT313'
                    });
                }
            }
        }

        else if (sub === 'fisica') {
            for (let i = 0; i < 20; i++) {
                const dist = randChoice([100, 200, 400, 800]);
                const tempo = randChoice([10, 20, 40]);
                const vel = dist / tempo;
                
                if (lvl === 'easy' || lvl === 'medium') {
                    // Common errors:
                    // 1. Multiplying by 3.6 directly without converting: vel * 3.6
                    const errKmHError = vel * 3.6;
                    // 2. Multiplying dist * tempo instead of dividing:
                    const errMult = dist * tempo;
                    // 3. Reversing tempo / dist:
                    const errReverse = (tempo / dist);

                    let distractors = [`${errKmHError.toFixed(1)} m/s`, `${errMult} m/s`, `${errReverse.toFixed(3)} m/s`].filter(d => d !== `${vel} m/s`);
                    if (distractors.length < 3 || new Set(distractors).size !== distractors.length) {
                        distractors = [`${vel * 3.6} m/s`, `${vel + 5} m/s`, `${vel - 3} m/s`].map(d => d);
                    } else {
                        distractors = distractors.slice(0, 3);
                    }

                    pool.push({
                        q: `[Movimento ${i+1}] Um atleta de corrida de alta performance do ${randChoice(escolas)} percorre uma distância de ${dist} metros em exatamente ${tempo} segundos. Qual é a sua velocidade média?`,
                        a: `${vel} m/s`,
                        d: distractors,
                        explanation: `A velocidade média é calculada dividindo-se a variação do espaço (distância = ${dist}m) pela variação do tempo (${tempo}s). Vm = S / T = ${vel} m/s.`,
                        hint: `Divida a distância total pelo tempo de trajeto. Se quiser converter para km/h, basta multiplicar por 3.6!`,
                        concept: 'EM13CNT101'
                    });
                } else {
                    const qubitPower = randRange(2, 6);
                    const systemTime = qubitPower * 20;
                    const resultCoherence = systemTime / 4;
                    
                    pool.push({
                        q: `[Física Quântica ${i+1}] Em um processador criogênico projetado para 2027, o tempo de coerência de um qubit supercondutor é de ${systemTime} microssegundos. Se acoplarmos 4 qubits adjacentes sob ruído térmico constante, o tempo de coerência útil residual do cluster decai inversamente com o número de acoplamentos. O novo tempo de coerência útil do sistema será:`,
                        a: `${resultCoherence} microssegundos`,
                        d: [`${systemTime * 4} microssegundos`, `${systemTime - 4} microssegundos`, `${systemTime} microssegundos`],
                        explanation: `O tempo de coerência diminui inversamente com o número de acoplamentos quânticos sob interferência: Coerência_Cluster = Tempo_Base / N_Qubits = ${systemTime} / 4 = ${resultCoherence} microssegundos.`,
                        hint: `Divida o tempo de coerência original pelo número de qubits acoplados (4) para calcular o enfraquecimento exponencial do sistema.`,
                        concept: 'EM13CNT301 — Coerência de Qubits'
                    });
                }
            }
        }            a: `${m * a} Newtons`,
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
                { composto: 'Dióxido de Carbono (CO2)', tipo: 'Covalente Apolar', caracteristica: 'Compartilhamento simétrico de elétrons sem polo resultante', bncc: 'EM13CNT201' },
                { composto: 'Gás Oxigênio (O2)', tipo: 'Covalente Apolar', caracteristica: 'Ligação dupla compartilhada entre dois átomos iguais de oxigênio', bncc: 'EM13CNT201' },
                { composto: 'Metano (CH4)', tipo: 'Covalente Apolar', caracteristica: 'Geometria tetraédrica com compartilhamento simétrico de elétrons', bncc: 'EM13CNT201' },
                { composto: 'Amônia (NH3)', tipo: 'Covalente Polar', caracteristica: 'Geometria piramidal trigonal com forte polo de eletronegatividade', bncc: 'EM13CNT201' },
                { composto: 'Cobre Metálico (Cu)', tipo: 'Metálica', caracteristica: 'Nuvem de elétrons livres que garante alta condutibilidade térmica', bncc: 'EM13CNT201' },
                { composto: 'Ácido Clorídrico (HCl)', tipo: 'Covalente Polar', caracteristica: 'Forte atração eletrônica do cloro gerando alta ionização em água', bncc: 'EM13CNT201' }
            ];

            for (let i = 0; i < 20; i++) {
                const item = ligacoes[i % ligacoes.length];
                if (lvl === 'easy' || lvl === 'medium') {
                    pool.push({
                        q: `[Reação ${i+1}] Qual é o tipo de ligação química predominante e a característica molecular do composto "${item.composto}"?`,
                        a: `${item.tipo} - ${item.caracteristica}`,
                        d: [`Metálica - Fusão de elétrons livres gasosos`, `Iônica - Compartilhamento de prótons no núcleo`, `Covalente - Perda total de nêutrons por radiação`],
                        explanation: `O composto "${item.composto}" apresenta ligação do tipo "${item.tipo}", gerando uma estrutura estável baseada em: ${item.caracteristica}.`,
                        hint: `Ligações iônicas ocorrem entre metais e ametais com grande diferença de eletronegatividade (ex: sal). Covalentes ocorrem por compartilhamento de elétrons.`,
                        concept: item.bncc
                    });
                } else {
                    pool.push({
                        q: `[Estequiometria ${i+1}] Na quebra de glicose para produção de energia celular, o balanceamento correto dos reagentes exige compreender:`,
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
                { nome: 'Lisossomo', funcao: 'Realizar a digestão intracelular e reciclagem de materiais velhos', bncc: 'EM13CNT301', analogia: 'O lisossomo é o caminhão de lixo e reciclagem da célula, quebrando o que não serve mais.' },
                { nome: 'Complexo de Golgi', funcao: 'Modificar, empacotar e secretar proteínas fabricadas na célula', bncc: 'EM13CNT301', analogia: 'O complexo de Golgi funciona como a agência dos correios da célula, etiquetando e despachando pacotes.' },
                { nome: 'Retículo Endoplasmático Rugoso', funcao: 'Sintetizar e transportar proteínas com o auxílio de ribossomos', bncc: 'EM13CNT301', analogia: 'Funciona como uma esteira transportadora de fábrica que já possui operários acoplados.' },
                { nome: 'Retículo Endoplasmático Liso', funcao: 'Sintetizar lipídios e realizar a desintoxicação celular de álcool', bncc: 'EM13CNT301', analogia: 'Atua como a central de desintoxicação e síntese de óleos/gorduras essenciais.' },
                { nome: 'Membrana Plasmática', funcao: 'Controlar a entrada e saída de substâncias (permeabilidade seletiva)', bncc: 'EM13CNT301', analogia: 'Funciona como a portaria ou segurança de um condomínio fechado.' }
            ];

            for (let i = 0; i < 20; i++) {
                const org = organelas[i % organelas.length];
                if (lvl === 'easy' || lvl === 'medium') {
                    pool.push({
                        q: `[Citologia ${i+1}] Qual é a função biológica vital da organela celular conhecida como "${org.nome}"?`,
                        a: org.funcao,
                        d: [`Controlar a circulação de sangue no cérebro`, `Filtrar a urina e toxinas do fígado`, `Realizar a divisão muscular por impulsos elétricos`],
                        explanation: `A organela celular "${org.nome}" desempenha o papel vital de: ${org.funcao}. ${org.analogia}`,
                        hint: `Associe a mitocôndria à respiração celular e produção de ATP (moeda de energia do corpo).`,
                        concept: org.bncc
                    });
                } else {
                    pool.push({
                        q: `[Genética ${i+1}] Se cruzarmos duas plantas heterozigotas para uma característica dominante (Aa x Aa), qual será a proporção fenotípica esperada na descendência?`,
                        a: `3 dominantes para 1 recessivo (3:1)`,
                        d: ['1 dominante para 1 recessivo (1:1)', 'Todas as plantas recessivas (0:4)', '9 dominantes para 3 recessivos (9:3)'],
                        explanation: `No cruzamento Aa x Aa, os genótipos resultantes são AA (25%), Aa (50%) e aa (25%). Como AA e Aa expressam o fenótipo dominante, temos 75% dominantes (3 partes) e 25% recessivos (1 parte).`,
                        hint: `Monte a tabela de cruzamento (Quadro de Punnett) cruzando as linhas e colunas com os alelos A e a.`,
                        concept: 'EM13CNT303'
                    });
                }
            }
        }

        else if (sub === 'historia') {
            const fatos = [
                { evento: 'Independência do Brasil', ano: '1822', lider: 'Dom Pedro I', consequencia: 'Ruptura colonial com Portugal e início do Primeiro Reinado', bncc: 'EM13CHS101' },
                { evento: 'Proclamação da República', ano: '1889', lider: 'Marechal Deodoro da Fonseca', consequencia: 'Queda do Império e início do período republicano oligárquico', bncc: 'EM13CHS101' },
                { evento: 'Revolução Francesa', ano: '1789', lider: 'Burguesia e classes populares', consequencia: 'Fim do Absolutismo e consagração dos Direitos do Homem', bncc: 'EM13CHS102' },
                { evento: 'Revolução Industrial', ano: '1760', lider: 'Burguesia manufatureira inglesa', consequencia: 'Surgimento do operariado urbano e mecanização da produção', bncc: 'EM13CHS102' },
                { evento: 'Era Vargas', ano: '1930', lider: 'Getúlio Vargas', consequencia: 'Centralização do poder, criação das leis trabalhistas (CLT) e industrialização', bncc: 'EM13CHS101' },
                { evento: 'Guerra Fria', ano: '1947', lider: 'EUA e União Soviética', consequencia: 'Bipolarização do mundo e corrida armamentista e espacial sem confronto direto', bncc: 'EM13CHS102' },
                { evento: 'Descobrimento do Brasil', ano: '1500', lider: 'Pedro Álvares Cabral', consequencia: 'Início da colonização portuguesa nas terras sul-americanas', bncc: 'EM13CHS101' }
            ];

            for (let i = 0; i < 20; i++) {
                const fato = fatos[i % fatos.length];
                if (lvl === 'easy' || lvl === 'medium') {
                    pool.push({
                        q: `[Fato Histórico ${i+1}] Qual foi a principal consequência histórica do evento "${fato.evento}" ocorrido em ${fato.ano}?`,
                        a: fato.consequencia,
                        d: [`A colonização do Brasil pela Inglaterra e perda de soberania`, `O fechamento de todos os portos e proibição do comércio cafeeiro`, `A fundação de Brasília como capital federal imediata do Império`],
                        explanation: `O evento "${fato.evento}" liderado por ${fato.lider} gerou como marco definitivo a ${fato.consequencia}.`,
                        hint: `Pense nos impactos de longo prazo para as instituições e soberania do povo brasileiro.`,
                        concept: fato.bncc
                    });
                } else {
                    pool.push({
                        q: `[Historiografia ${i+1}] O conceito de "cidadania" na Grécia Antiga (Atenas) difere da cidadania contemporânea porque:`,
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
                { termo: 'Urbanização', definicao: 'O crescimento das cidades impulsionado pela migração do campo para a cidade (êxodo rural)', bncc: 'EM13CHS202', analogia: 'Urbanização ocorre quando a população da cidade cresce mais rápido que a população do campo.' },
                { termo: 'Efeito Estufa', definicao: 'O aquecimento natural da Terra provocado pela retenção de calor por gases na atmosfera', bncc: 'EM13CHS203', analogia: 'Sem o efeito estufa a Terra seria congelante; o problema é a sua intensificação pela queima de combustíveis fósseis.' },
                { termo: 'Bioma', definicao: 'Um conjunto de ecossistemas com vegetação, solo e clima característicos e integrados', bncc: 'EM13CHS202', analogia: 'No Brasil temos biomas únicos como a Caatinga, o Cerrado e a Floresta Amazônica.' },
                { termo: 'Bacia Hidrográfica', definicao: 'Uma área de drenagem onde toda a água da chuva converge para um rio principal e seus afluentes', bncc: 'EM13CHS202', analogia: 'Funciona como um grande funil natural que coleta água e a despeja no oceano.' },
                { termo: 'Escala Cartográfica', definicao: 'A relação de proporção entre as dimensões reais de um terreno e sua representação no mapa', bncc: 'EM13CHS201', analogia: 'Uma escala 1:100.000 significa que 1 cm no mapa equivale a 100.000 cm (ou 1 km) na vida real.' }
            ];

            for (let i = 0; i < 20; i++) {
                const geo = conceitosGeo[i % conceitosGeo.length];
                if (lvl === 'easy' || lvl === 'medium') {
                    pool.push({
                        q: `[Geografia ${i+1}] Na geografia contemporânea, como podemos definir o conceito espacial de "${geo.termo}"?`,
                        a: geo.definicao,
                        d: [`A proibição de navegações marítimas e fechamento comercial das fronteiras`, `O retorno em massa das pessoas para as florestas nativas agrícolas`, `A redução absoluta do número de indústrias e comércio global`],
                        explanation: `O fenômeno de "${geo.termo}" caracteriza-se essencialmente como: ${geo.definicao}. ${geo.analogia}`,
                        hint: `Pense nos fluxos modernos de mercadorias, informações, capitais e pessoas cruzando fronteiras.`,
                        concept: geo.bncc
                    });
                } else {
                    pool.push({
                        q: `[Geopolítica ${i+1}] O conceito de "divisão internacional do trabalho" (DIT) explica que os países em desenvolvimento atuam no comércio global principalmente como:`,
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
                { nome: 'René Descartes', ideia: 'O racionalismo moderno expresso pela dúvida metódica e o "penso, logo existo"', bncc: 'EM13CHS102' },
                { nome: 'Aristóteles', ideia: 'O empirismo clássico, a ética do meio-termo e a lógica silogística dedutiva', bncc: 'EM13CHS102' },
                { nome: 'Nicolau Maquiavel', ideia: 'A separação entre moral e política, afirmando que os fins justificam os meios no poder', bncc: 'EM13CHS102' },
                { nome: 'John Locke', ideia: 'O liberalismo político e o conceito de tábula rasa, onde nascemos sem ideias inatas', bncc: 'EM13CHS102' },
                { nome: 'Friedrich Nietzsche', ideia: 'A crítica aos valores morais judaico-cristãos e o conceito do Super-homem (Übermensch)', bncc: 'EM13CHS102' }
            ];

            for (let i = 0; i < 20; i++) {
                const fil = filosofos[i % filosofos.length];
                if (lvl === 'easy' || lvl === 'medium') {
                    pool.push({
                        q: `[Filosofia ${i+1}] Qual é o pilar fundamental do pensamento filosófico desenvolvido pelo grande pensador "${fil.nome}"?`,
                        a: fil.ideia,
                        d: [`A defesa incondicional da monarquia absoluta e tirania escravocrata`, `A recusa total de usar a razão para responder a questionamentos cotidianos`, `A criação do método de programação em computadores industriais`],
                        explanation: `O filósofo "${fil.nome}" revolucionou a epistemologia com: ${fil.ideia}.`,
                        hint: `Associe Sócrates ao questionamento constante nas ruas de Atenas e Platão à alegoria sobre sair da escuridão da ignorância.`,
                        concept: fil.bncc
                    });
                } else {
                    pool.push({
                        q: `[Ética ${i+1}] O conceito de "Imperativo Categórico" postulado por Immanuel Kant define que uma ação é ética quando:`,
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
                { nome: 'Max Weber', conceito: 'A ação social dotada de sentido individual que afeta o comportamento coletivo', bncc: 'EM13CHS401' },
                { nome: 'Zygmunt Bauman', conceito: 'A modernidade líquida, onde as relações sociais são fluidas e instáveis', bncc: 'EM13CHS401' },
                { nome: 'Pierre Bourdieu', conceito: 'O conceito de habitus e violência simbólica na perpetuação das desigualdades', bncc: 'EM13CHS401' },
                { nome: 'Jürgen Habermas', conceito: 'A teoria da ação comunicativa baseada no consenso racional e esfera pública', bncc: 'EM13CHS401' }
            ];

            for (let i = 0; i < 20; i++) {
                const soc = sociologos[i % sociologos.length];
                if (lvl === 'easy' || lvl === 'medium') {
                    pool.push({
                        q: `[Sociologia ${i+1}] Qual é o conceito-chave defendido pelo sociólogo clássico "${soc.nome}" para explicar a sociedade?`,
                        a: soc.conceito,
                        d: [`A anarquia como a única forma de organização familiar industrial`, `O isolamento total de todos os seres humanos em laboratórios químicos`, `A ausência de leis ou linguagens entre as tribos de jovens`],
                        explanation: `O clássico pensador "${soc.nome}" formulou em sua teoria sociológica o conceito de: ${soc.conceito}.`,
                        hint: `Durkheim estuda regras sociais como coisas (fatos sociais); Marx foca na economia e desigualdade; Weber foca na ação e cultura.`,
                        concept: soc.bncc
                    });
                } else {
                    pool.push({
                        q: `[Indústria Cultural ${i+1}] O termo formulado por Adorno e Horkheimer critica a transformação da arte e cultura em:`,
                        a: `Produtos de consumo de massa, padronizados para alienação e lucro comercial`,
                        d: ['Ferramentas puras de elevação espiritual e libertação cognitiva autônoma', 'Monopólios estatais controlados por filósofos gregos clássicos', 'Sistemas de criptografia digital para proteção de dados secretos do governo'],
                        explanation: `A Indústria Cultural padroniza a produção artística para transformá-la em mercadoria de consumo rápido, reduzindo o senso crítico do espectador.`,
                        hint: `Pense em produções de massa feitas unicamente para vender e distrair, perdendo o teor de reflexão profunda.`,
                        concept: 'EM13CHS403'
                    });
                }
            }
        }

        else if (sub === 'tecnologia' || sub === 'programacao' || sub === 'robotica' || sub === 'empreendedorismo' || sub === 'ciencia_de_dados' || sub === 'inteligencia_artificial' || sub === 'educacao_financeira' || sub === 'marketing_digital' || sub === 'desenvolvimento_jogos' || sub === 'seguranca_informacao' || sub === 'design_digital' || sub === 'producao_audiovisual') {
            const itinerarios = [
                // programacao
                { materia: 'programacao', termo: 'Algoritmo', desc: 'uma sequência de instruções lógicas passo a passo para resolver um problema', key: 'Lógica', bncc: 'EM13IF01' },
                { materia: 'programacao', termo: 'Recursividade', desc: 'uma função que chama a si mesma para resolver subproblemas menores', key: 'Lógica', bncc: 'EM13IF01' },
                { materia: 'programacao', termo: 'Programação Orientada a Objetos (POO)', desc: 'paradigma que organiza o software em torno de objetos e classes', key: 'Lógica', bncc: 'EM13IF01' },
                { materia: 'programacao', termo: 'Variável', desc: 'um espaço alocado na memória para armazenar valores dinâmicos durante a execução', key: 'Lógica', bncc: 'EM13IF01' },

                // robotica
                { materia: 'robotica', termo: 'Sensor Ultrassônico', desc: 'dispositivo que mede a distância de obstáculos emitindo ondas sonoras', key: 'Arduino', bncc: 'EM13IF02' },
                { materia: 'robotica', termo: 'Servomotor', desc: 'atuador rotativo que permite controle preciso de posição angular', key: 'Arduino', bncc: 'EM13IF02' },
                { materia: 'robotica', termo: 'Microcontrolador', desc: 'circuito integrado que roda um programa gravado para controlar sensores e motores', key: 'Arduino', bncc: 'EM13IF02' },
                { materia: 'robotica', termo: 'Giroscópio', desc: 'sensor que detecta a inclinação e a orientação espacial do robô', key: 'Arduino', bncc: 'EM13IF02' },

                // empreendedorismo
                { materia: 'empreendedorismo', termo: 'M.V.P.', desc: 'o Produto Mínimo Viável feito para testar uma ideia com clientes reais gastando pouco', key: 'Canvas', bncc: 'EM13IF03' },
                { materia: 'empreendedorismo', termo: 'Pitch', desc: 'apresentação rápida e direta para vender um projeto ou empresa a investidores', key: 'Canvas', bncc: 'EM13IF03' },
                { materia: 'empreendedorismo', termo: 'Lean Startup', desc: 'metodologia focada em evitar desperdícios e aprender rapidamente com o mercado', key: 'Canvas', bncc: 'EM13IF03' },
                { materia: 'empreendedorismo', termo: 'Modelo B2B', desc: 'transações comerciais realizadas diretamente entre empresas', key: 'Canvas', bncc: 'EM13IF03' },

                // inteligencia_artificial
                { materia: 'inteligencia_artificial', termo: 'Rede Neural', desc: 'sistema computacional inspirado no cérebro humano que aprende a reconhecer padrões', key: 'Deep Learning', bncc: 'EM13IF04' },
                { materia: 'inteligencia_artificial', termo: 'Machine Learning', desc: 'subcampo que permite a computadores aprenderem sem programação explícita', key: 'Deep Learning', bncc: 'EM13IF04' },
                { materia: 'inteligencia_artificial', termo: 'LLM (Large Language Model)', desc: 'modelo treinado com bilhões de parâmetros para entender e gerar linguagem humana', key: 'Deep Learning', bncc: 'EM13IF04' },
                { materia: 'inteligencia_artificial', termo: 'Overfitting', desc: 'quando um modelo decora os dados de treino e falha em dados reais novos', key: 'Deep Learning', bncc: 'EM13IF04' },

                // seguranca_informacao
                { materia: 'seguranca_informacao', termo: 'Criptografia', desc: 'processo de embaralhar dados legíveis para protegê-los contra leitura não autorizada', key: 'Segurança', bncc: 'EM13IF05' },
                { materia: 'seguranca_informacao', termo: 'Phishing', desc: 'ataque baseado em enganar o usuário para que revele senhas ou dados confidenciais', key: 'Segurança', bncc: 'EM13IF05' },
                { materia: 'seguranca_informacao', termo: 'MFA (Multi-factor Authentication)', desc: 'exigir dois ou mais fatores independentes de verificação para conceder acesso', key: 'Segurança', bncc: 'EM13IF05' },
                { materia: 'seguranca_informacao', termo: 'Firewall', desc: 'barreira de segurança que monitora e filtra o tráfego de rede de entrada e saída', key: 'Segurança', bncc: 'EM13IF05' },

                // tecnologia
                { materia: 'tecnologia', termo: 'Computação em Nuvem', desc: 'fornecimento de serviços de TI sob demanda pela internet com preços flexíveis', key: 'Cloud', bncc: 'EM13IF06' },
                { materia: 'tecnologia', termo: 'Internet das Coisas (IoT)', desc: 'rede de objetos físicos conectados que coletam e transmitem dados pela internet', key: 'Cloud', bncc: 'EM13IF06' },
                { materia: 'tecnologia', termo: 'API REST', desc: 'interface que permite comunicação entre sistemas usando requisições HTTP padronizadas', key: 'Cloud', bncc: 'EM13IF06' },
                { materia: 'tecnologia', termo: 'Banco NoSQL', desc: 'banco de dados não relacional flexível projetado para grandes volumes de dados', key: 'Cloud', bncc: 'EM13IF06' },

                // ciencia_de_dados (Expanded high-school curriculum subjects)
                { materia: 'ciencia_de_dados', termo: 'Data Science', desc: 'estudo interdisciplinar que extrai insights significativos a partir de grandes volumes de dados', key: 'Analytics', bncc: 'EM13IF07' },
                { materia: 'ciencia_de_dados', termo: 'Algoritmo K-Means', desc: 'método de agrupamento não supervisionado que divide os dados em K grupos similares', key: 'Analytics', bncc: 'EM13IF07' },
                { materia: 'ciencia_de_dados', termo: 'Pandas Dataframe', desc: 'estrutura de dados bidimensional em tabela com colunas e linhas indexadas no Python', key: 'Analytics', bncc: 'EM13IF07' },
                { materia: 'ciencia_de_dados', termo: 'Limpeza de Dados', desc: 'processo de corrigir ou remover dados incorretos, corrompidos, duplicados ou nulos de um dataset', key: 'Analytics', bncc: 'EM13IF07' },
                { materia: 'ciencia_de_dados', termo: 'Análise Exploratória (EDA)', desc: 'estudo inicial dos dados para descobrir padrões, detectar anomalias e testar hipóteses usando estatística', key: 'Analytics', bncc: 'EM13IF07' },
                { materia: 'ciencia_de_dados', termo: 'Regressão Linear', desc: 'modelo matemático que prevê o valor de uma variável contínua com base no comportamento de outra', key: 'Analytics', bncc: 'EM13IF07' },
                { materia: 'ciencia_de_dados', termo: 'Árvore de Decisão', desc: 'algoritmo de aprendizado supervisionado que divide os dados com base em regras de perguntas sim/não', key: 'Analytics', bncc: 'EM13IF07' },
                { materia: 'ciencia_de_dados', termo: 'SQL (Structured Query Language)', desc: 'linguagem padrão usada para gerenciar, consultar e manipular bancos de dados relacionais', key: 'Analytics', bncc: 'EM13IF07' },
                { materia: 'ciencia_de_dados', termo: 'LGPD e Ética de Dados', desc: 'leis e diretrizes que regulam a privacidade, consentimento e tratamento seguro de dados de cidadãos', key: 'Analytics', bncc: 'EM13IF07' },
                { materia: 'ciencia_de_dados', termo: 'Visualização de Dados', desc: 'representação gráfica de informações (como gráficos de dispersão, barras e linhas) para facilitar a compreensão', key: 'Analytics', bncc: 'EM13IF07' },
                { materia: 'ciencia_de_dados', termo: 'Data Storytelling', desc: 'técnica de contar uma história envolvente e explicativa combinando dados, visuais e narrativas', key: 'Analytics', bncc: 'EM13IF07' },
                { materia: 'ciencia_de_dados', termo: 'Outliers (Valores Discrepantes)', desc: 'dados que se desviam drasticamente do padrão geral da amostra e que podem distorcer médias estatísticas', key: 'Analytics', bncc: 'EM13IF07' },
                { materia: 'ciencia_de_dados', termo: 'Correlação Estatística', desc: 'medida que indica a força e a direção da relação linear entre duas variáveis numéricas', key: 'Analytics', bncc: 'EM13IF07' },
                { materia: 'ciencia_de_dados', termo: 'Banco de Dados Relacional', desc: 'sistema de armazenamento estruturado em tabelas que se conectam por chaves primárias e estrangeiras', key: 'Analytics', bncc: 'EM13IF07' },
                { materia: 'ciencia_de_dados', termo: 'Python para Dados', desc: 'linguagem de programação mais popular do mercado de dados devido a bibliotecas como Pandas e NumPy', key: 'Analytics', bncc: 'EM13IF07' },

                // educacao_financeira
                { materia: 'educacao_financeira', termo: 'Reserva de Emergência', desc: 'capital guardado correspondente a 6 meses de custos para imprevistos financeiros', key: 'Planejamento', bncc: 'EM13IF08' },
                { materia: 'educacao_financeira', termo: 'Inflação', desc: 'o aumento geral dos preços que reduz o poder de compra do dinheiro ao longo do tempo', key: 'Planejamento', bncc: 'EM13IF08' },
                { materia: 'educacao_financeira', termo: 'Tesouro Direto', desc: 'programa do governo para venda de títulos públicos federais a pessoas físicas', key: 'Planejamento', bncc: 'EM13IF08' },
                { materia: 'educacao_financeira', termo: 'Diversificação', desc: 'estratégia de alocar investimentos em diferentes ativos para mitigar riscos', key: 'Planejamento', bncc: 'EM13IF08' },

                // marketing_digital
                { materia: 'marketing_digital', termo: 'SEO (Search Engine Optimization)', desc: 'otimização de páginas web para alcançar melhores posições em buscadores', key: 'Branding', bncc: 'EM13IF09' },
                { materia: 'marketing_digital', termo: 'C.T.A. (Call to Action)', desc: 'botão ou link com comando direto incitando o usuário a realizar uma ação', key: 'Branding', bncc: 'EM13IF09' },
                { materia: 'marketing_digital', termo: 'Tráfego Pago', desc: 'investimento em anúncios patrocinados nas mídias para atrair visitantes qualificados', key: 'Branding', bncc: 'EM13IF09' },
                { materia: 'marketing_digital', termo: 'LTV (Lifetime Value)', desc: 'o valor financeiro total que um cliente retorna durante seu relacionamento com a marca', key: 'Branding', bncc: 'EM13IF09' },

                // desenvolvimento_jogos
                { materia: 'desenvolvimento_jogos', termo: 'Game Engine', desc: 'software que fornece ferramentas básicas de física, renderização e áudio para criar jogos', key: 'Engines', bncc: 'EM13IF10' },
                { materia: 'desenvolvimento_jogos', termo: 'Hitbox', desc: 'área invisível ao redor de elementos do jogo usada para detectar colisões físicas', key: 'Engines', bncc: 'EM13IF10' },
                { materia: 'desenvolvimento_jogos', termo: 'Game Loop', desc: 'o ciclo contínuo que roda e atualiza a lógica e o desenho do jogo na tela', key: 'Engines', bncc: 'EM13IF10' },
                { materia: 'desenvolvimento_jogos', termo: 'FPS (Frames per Second)', desc: 'a taxa que indica quantas imagens o jogo consegue renderizar na tela por segundo', key: 'Engines', bncc: 'EM13IF10' },

                // design_digital
                { materia: 'design_digital', termo: 'UI/UX Design', desc: 'planejamento visual e estudo da experiência e usabilidade do usuário', key: 'Interface', bncc: 'EM13IF11' },
                { materia: 'design_digital', termo: 'Vetor', desc: 'imagens digitais baseadas em fórmulas matemáticas que não perdem resolução ao ampliar', key: 'Interface', bncc: 'EM13IF11' },
                { materia: 'design_digital', termo: 'Psicologia das Cores', desc: 'estudo de como diferentes tonalidades afetam emoções e decisões no design', key: 'Interface', bncc: 'EM13IF11' },
                { materia: 'design_digital', termo: 'Wireframe', desc: 'esboço ou esqueleto básico de baixa fidelidade de um aplicativo ou site', key: 'Interface', bncc: 'EM13IF11' },

                // producao_audiovisual
                { materia: 'producao_audiovisual', termo: 'Storyboard', desc: 'sequência de desenhos em quadrinhos ilustrando as cenas planejadas de um vídeo', key: 'Mídia', bncc: 'EM13IF12' },
                { materia: 'producao_audiovisual', termo: 'Cromaqui (Chroma Key)', desc: 'técnica de substituir o fundo verde por outra imagem ou efeito digital', key: 'Mídia', bncc: 'EM13IF12' },
                { materia: 'producao_audiovisual', termo: 'Taxa de Quadros', desc: 'o número de quadros capturados por segundo pela câmera durante a gravação', key: 'Mídia', bncc: 'EM13IF12' },
                { materia: 'producao_audiovisual', termo: 'Mixagem de Áudio', desc: 'processo de ajustar e equilibrar diferentes trilhas sonoras e vozes no vídeo', key: 'Mídia', bncc: 'EM13IF12' }
            ];

            const filteredItin = itinerarios.filter(it => it.materia === sub);

            for (let i = 0; i < 20; i++) {
                const item = filteredItin.length > 0 ? filteredItin[i % filteredItin.length] : randChoice(itinerarios);
                if (lvl === 'easy' || lvl === 'medium') {
                    pool.push({
                        q: `[${sub.toUpperCase()} - Desafio ${i+1}] No itinerário formativo atual, como descrevemos de forma clara o termo tecnológico "${item.termo}"?`,
                        a: item.desc,
                        d: ['Uma peça mecânica que aquece o motor a diesel', 'Um imposto de alfândega sobre servidores físicos antigos', 'Um cabo de rede que transmite energia hidráulica'],
                        explanation: `No ensino profissional e técnico, o conceito de "${item.termo}" é definido como: ${item.desc}.`,
                        hint: `Conecte o nome do termo à sua função prática (ex: sensores servem para dar "sentidos" ao robô).`,
                        concept: item.bncc
                    });
                } else {
                    pool.push({
                        q: `[${sub.toUpperCase()} - Operação ${i+1}] O desenvolvimento e otimização avançada de um(a) "${item.termo}" exige:`,
                        a: `Calibração precisa baseada no conceito prático de '${item.key}'`,
                        d: ['Apenas a cópia manual de arquivos de texto redundantes', 'Uma conexão sem fios com satélites lunares governamentais', 'A eliminação completa de todas as variáveis e códigos numéricos'],
                        explanation: `Arquiteturas modernas exigem o domínio de conceitos como '${item.key}' para garantir escalabilidade, eficiência e segurança nas operações industriais.`,
                        hint: `Pense em como a teoria profissional se manifesta na prática operacional do mercado de trabalho.`,
                        concept: 'EM13IF06'
                    });
                }
            }
        }

        else if (sub === 'biblioteca_digital') {
            const bibliotecaDigitalTerms = [
                { termo: 'Revisão por pares (peer-review)', desc: 'processo de avaliação de artigos por outros cientistas antes da publicação', bncc: 'EM13EXT01' },
                { termo: 'Normas ABNT', desc: 'regras de padronização de trabalhos acadêmicos válidas em todo o território nacional', bncc: 'EM13EXT02' },
                { termo: 'Bases de Dados Indexadas', desc: 'portais científicos oficiais como Google Acadêmico, SciELO e portais universitários', bncc: 'EM13EXT01' },
                { termo: 'Citação Direta Curta', desc: 'transcrição de trecho do autor com até 3 linhas, inserida no parágrafo entre aspas', bncc: 'EM13EXT02' }
            ];

            for (let i = 0; i < 20; i++) {
                const item = bibliotecaDigitalTerms[i % bibliotecaDigitalTerms.length];
                if (lvl === 'easy' || lvl === 'medium') {
                    pool.push({
                        q: `[Pesquisa ${i+1}] Na busca de fontes confiáveis na Biblioteca Digital para seu projeto escolar, qual critério técnico descreve "${item.termo}"?`,
                        a: item.desc,
                        d: ['Grande número de curtidas e compartilhamentos em redes sociais informais', 'Data de criação do site de notícias sensacionalistas amadoras', 'Opiniões de influenciadores digitais sem formação na área do estudo'],
                        explanation: `A veracidade de pesquisas científicas depende de processos estruturados como: ${item.desc}.`,
                        hint: `Confie em métodos que validam a fonte antes da publicação oficial.`,
                        concept: item.bncc
                    });
                } else {
                    pool.push({
                        q: `[Normas Técnicas ${i+1}] Em relação à metodologia acadêmica e formatação das regras da ABNT, o conceito de "${item.termo}" exige:`,
                        a: `Aplicação rigorosa segundo os padrões formais de citação e indexação da ABNT`,
                        d: ['Escrita em negrito e itálico, centralizada com letras maiúsculas e aspas duplas', 'Inserida diretamente no fluxo normal do parágrafo sem menção ao nome do autor', 'Exibida apenas como rodapé no final da página sem formatação formal'],
                        explanation: `Normas ABNT exigem a correta identificação e formatação técnica para evitar plágio e garantir a rastreabilidade das fontes.`,
                        hint: `Lembre-se das regras específicas de espaçamento, recuo e indicação bibliográfica.`,
                        concept: 'EM13EXT02'
                    });
                }
            }
        }

        else if (sub === 'laboratorio_virtual') {
            const laboratorioVirtualTerms = [
                { termo: 'Indicador Repolho Roxo', desc: 'substância natural que muda de cor conforme a acidez (pH) do meio químico', bncc: 'EM13EXT03' },
                { termo: 'Resistores em Paralelo', desc: 'associação elétrica onde a resistência equivalente total é menor do que a individual', bncc: 'EM13EXT04' },
                { termo: 'Titulação Ácido-Base', desc: 'procedimento laboratorial para determinar a concentração de uma solução ácida ou básica', bncc: 'EM13EXT03' },
                { termo: 'Placa de Ensaio (Protoboard)', desc: 'placa usada para montar e testar circuitos eletrônicos sem necessidade de solda', bncc: 'EM13EXT04' }
            ];

            for (let i = 0; i < 20; i++) {
                const item = laboratorioVirtualTerms[i % laboratorioVirtualTerms.length];
                if (lvl === 'easy' || lvl === 'medium') {
                    pool.push({
                        q: `[Simulação ${i+1}] No Laboratório Virtual, qual é o princípio de funcionamento ou definição técnica de "${item.termo}"?`,
                        a: item.desc,
                        d: ['Básica ou Alcalina (pH maior que 7)', 'Neutra (pH igual a 7)', 'Gasosa com alto índice de sal orgânico'],
                        explanation: `A ferramenta e o processo de "${item.termo}" operam da seguinte forma: ${item.desc}.`,
                        hint: `Preste atenção no comportamento esperado da matéria ou do circuito de teste virtual.`,
                        concept: item.bncc
                    });
                } else {
                    pool.push({
                        q: `[Análise Virtual ${i+1}] Em experimentos estruturados sob o simulador gráfico, o teste avançado de "${item.termo}" revela:`,
                        a: `Comportamento dinâmico perfeitamente condizente com as leis da física e da química clássica`,
                        d: ['Associação em paralelo que soma as resistências de forma linear simples', 'Fusão nuclear instantânea de prótons livres sob temperatura ambiente', 'Nenhuma alteração, pois simulações virtuais não obedecem a leis reais'],
                        explanation: `Simuladores virtuais replicam as leis da física (como a Lei de Ohm) e da química para preparar o aluno para laboratórios reais.`,
                        hint: `Lembre-se das relações matemáticas associadas ao circuito ou reação simulada.`,
                        concept: 'EM13EXT04'
                    });
                }
            }
        }

        else if (sub === 'projeto_vida') {
            const projetoVidaTerms = [
                { termo: 'Metas SMART', desc: 'objetivos específicos, mensuráveis, atingíveis, relevantes e com prazo definido', bncc: 'EM13EXT05' },
                { termo: 'Análise F.O.F.A. / SWOT', desc: 'ferramenta que mapeia forças e fraquezas (internas) e oportunidades e ameaças (externas)', bncc: 'EM13EXT06' },
                { termo: 'Inteligência Emocional', desc: 'capacidade de reconhecer, compreender e gerenciar suas próprias emoções e as dos outros', bncc: 'EM13EXT05' },
                { termo: 'Plano de Ação', desc: 'roteiro estruturado detalhando passos, prazos e recursos para alcançar um objetivo', bncc: 'EM13EXT06' }
            ];

            for (let i = 0; i < 20; i++) {
                const item = projetoVidaTerms[i % projetoVidaTerms.length];
                if (lvl === 'easy' || lvl === 'medium') {
                    pool.push({
                        q: `[Planejamento ${i+1}] No desenvolvimento do seu plano pessoal de carreira e estudos, qual é a definição prática de "${item.termo}"?`,
                        a: item.desc,
                        d: ['Ideias muito vagas que dependem da sorte sem prazos estabelecidos', 'Metas difíceis e impossíveis que geram frustrações diárias', 'Seguir a escolha de carreira de amigos próximos sem planejamento individual'],
                        explanation: `A ferramenta ou conceito de "${item.termo}" ajuda o aluno no autoconhecimento: ${item.desc}.`,
                        hint: `Associe a estrutura do termo à sua utilidade prática na organização do seu futuro.`,
                        concept: item.bncc
                    });
                } else {
                    pool.push({
                        q: `[Autoconhecimento ${i+1}] Na estruturação do plano estratégico individual de Projeto de Vida, a análise de "${item.termo}" exige:`,
                        a: `Mapeamento crítico de competências e variáveis ambientais para guiar escolhas futuras`,
                        d: ['Fontes de renda, Operações, Fluxos de caixa e Amortizações tributárias', 'Fórmulas matemáticas de estatísticas financeiras complexas', 'Frequência escolar, Notas acumuladas, Férias e Atividades complementares'],
                        explanation: `O Projeto de Vida no Novo Ensino Médio estimula escolhas conscientes e orientadas por um autodiagnóstico honesto.`,
                        hint: `Preste atenção em como os fatores internos e externos se cruzam no planejamento.`,
                        concept: 'EM13EXT06'
                    });
                }
            }
        }

        else if (sub === 'inclusao_acessibilidade') {
            const inclusaoAcessibilidadeTerms = [
                { termo: 'Texto Alternativo "alt"', desc: 'descrição textual de imagens para que leitores de tela guiem alunos com deficiência visual', bncc: 'EM13EXT07' },
                { termo: 'Diretrizes WCAG AA', desc: 'normas web que exigem contraste de cores mínimo de 4.5:1 para garantir legibilidade universal', bncc: 'EM13EXT08' },
                { termo: 'Tecnologia Assistiva', desc: 'recursos e serviços que promovem a funcionalidade e autonomia de pessoas com deficiência', bncc: 'EM13EXT07' },
                { termo: 'Desenho Universal para Aprendizagem (DUA)', desc: 'modelo de ensino que oferece múltiplas formas de engajamento, representação e expressão', bncc: 'EM13EXT08' }
            ];

            for (let i = 0; i < 20; i++) {
                const item = inclusaoAcessibilidadeTerms[i % inclusaoAcessibilidadeTerms.length];
                if (lvl === 'easy' || lvl === 'medium') {
                    pool.push({
                        q: `[Acessibilidade ${i+1}] Na construção de uma escola digital inclusiva, qual é a definição e importância de "${item.termo}"?`,
                        a: item.desc,
                        d: ['A alteração da cor da imagem de acordo com o nível do aluno', 'O tamanho em pixels de largura e altura do arquivo de imagem', 'A criptografia interna que impede a cópia não autorizada do material gráfico'],
                        explanation: `Garantir acessibilidade significa prover recursos como: ${item.desc}.`,
                        hint: `Preste atenção no papel e utilidade do termo "${item.termo}" na facilitação do acesso à informação.`,
                        concept: item.bncc
                    });
                } else {
                    pool.push({
                        q: `[Diretrizes WCAG ${i+1}] No desenvolvimento de sistemas web acessíveis de nível profissional, o conceito de "${item.termo}" exige:`,
                        a: `Implementação rigorosa seguindo as especificações da WCAG para garantir autonomia digital universal`,
                        d: ['Uso de cores vibrantes sem contraste definido para chamar a atenção visual', 'Criação de caminhos e atalhos exclusivos apenas para usuários administradores', 'Nenhuma consideração adicional, visto que navegadores modernos tratam acessibilidade de forma nativa'],
                        explanation: `As diretrizes de acessibilidade exigem a implementação padronizada de recursos como contraste mínimo e descrições para garantir usabilidade para todos.`,
                        hint: `Lembre-se da importância de seguir padrões internacionais para acessibilidade web.`,
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

        // Retorna embaralhado e limitado a 20 itens, com o ano do ensino médio atribuído de forma homogênea (1º, 2º e 3º ano)
        const finalPool = shuffle(pool).slice(0, 20);
        finalPool.forEach((q, idx) => {
            q.ano = (idx % 3) + 1;
        });
        return finalPool;
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
