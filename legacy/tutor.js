/**
 * ============================================================
 *  Motor de Reforço Escolar - Tutor Inteligente
 *  Foco: Educação e Inclusão Digital
 *  Versão: 1.0
 * ============================================================
 */

class TutorInteligente {
    constructor(config = {}) {
        this.nome = config.nome || 'TutorAI';
        this.idioma = config.idioma || 'pt-BR';
        this.nivelDificuldade = config.nivelDificuldade || 'iniciante'; // iniciante | intermediario | avancado
        this.ritmoAprendizagem = config.ritmoAprendizagem || 'normal'; // lento | normal | rapido
        this.estiloAprendizagem = config.estiloAprendizagem || 'visual'; // visual | auditivo | cinestesico | leitura

        // Estado do estudante
        this.estudante = {
            nome: config.estudanteNome || 'Estudante',
            idade: config.estudanteIdade || null,
            serie: config.estudanteSerie || null,
            historicoDesempenho: [],
            preferencias: {},
            pontuacao: 0,
            nivelAtual: 1,
            sessoesCompletadas: 0,
            errosConsecutivos: 0,
            acertosConsecutivos: 0,
            tempoMedioResposta: 0,
            acessibilidade: {
                altoContraste: config.altoContraste || false,
                tamanhoFonte: config.tamanhoFonte || 'medio', // pequeno | medio | grande
                leituraVozAlta: config.leituraVozAlta || false,
                legendas: config.legendas || true,
                simplificacaoTexto: config.simplificacaoTexto || false
            }
        };

        // Base de conhecimento
        this.conhecimento = {
            materias: {},
            questoes: [],
            conceitos: []
        };

        // Sessão atual
        this.sessaoAtual = null;
        this.logSessao = [];
    }

    /**
     * ============================================================
     *  CONFIGURAÇÃO DE ACESSIBILIDADE E INCLUSÃO
     * ============================================================
     */

    configurarAcessibilidade(prefs) {
        Object.assign(this.estudante.acessibilidade, prefs);
        return this.estudante.acessibilidade;
    }

    /**
     * Aplica simplificação de texto para alunos com dificuldades
     * de leitura (dislexia, deficit de atenção, etc.)
     */
    simplificarTexto(texto, nivel = 'leve') {
        const regras = {
            leve: [
                [/[;,]/g, ', '],
                [/portanto/g, 'então'],
                [/entretanto/g, 'mas'],
                [/consequentemente/g, 'por isso'],
                [/adicionalmente/g, 'também'],
                [/similarmente/g, 'do mesmo jeito'],
            ],
            moderado: [
                [/[;,]/g, '.'],
                [/portanto|entretanto|consequentemente|adicionalmente|similarmente/g, ''],
                [/ no entanto /g, ' mas '],
                [/ desta forma /g, ' assim '],
                [/ em relação a /g, ' sobre '],
                [/ através de /g, ' por '],
                [/ aproximadamente/g, 'quase'],
                [/demonstrar/g, 'mostrar'],
                [/utilizar/g, 'usar'],
                [/realizar/g, 'fazer'],
            ],
            intenso: [
                { de: /\. ([A-Z])/g, para: '. \n$1' }, // quebra parágrafos
                { de: / {2,}/g, para: ' ' },
                { de: /\([^)]*\)/g, para: '' }, // remove parênteses
            ]
        };

        let textoSimplificado = texto;
        const regrasNivel = regras[nivel] || regras.leve;

        if (Array.isArray(regrasNivel)) {
            regrasNivel.forEach(([regex, sub]) => {
                textoSimplificado = textoSimplificado.replace(regex, sub);
            });
        } else {
            Object.entries(regrasNivel).forEach(([_, { de, para }]) => {
                textoSimplificado = textoSimplificado.replace(de, para);
            });
        }

        return textoSimplificado.trim();
    }

    /**
     * Converte texto para fala (para alunos com deficiência visual
     * ou dificuldades de leitura)
     */
    textoParaFala(texto) {
        if (!this.estudante.acessibilidade.leituraVozAlta) return texto;

        // Retorna o texto com marcadores para o componente de TTS do frontend
        return {
            texto,
            tts: true,
            velocidade: this.ritmoAprendizagem === 'lento' ? 0.7 : this.ritmoAprendizagem === 'rapido' ? 1.2 : 1.0,
            instrucoes: texto
        };
    }

    /**
     * ============================================================
     *  GERENCIAMENTO DE CONTEÚDO (MATÉRIAS E QUESTÕES)
     * ============================================================
     */

    /**
     * Registra uma matéria com seus módulos e conceitos
     */
    registrarMateria(materia) {
        if (!materia.id || !materia.nome) {
            throw new Error('Matéria deve ter "id" e "nome"');
        }

        this.conhecimento.materias[materia.id] = {
            ...materia,
            modulos: materia.modulos || [],
            conceitos: materia.conceitos || [],
            dataRegistro: new Date()
        };

        // Expande conceitos para busca rápida
        (materia.conceitos || []).forEach(conceito => {
            if (!this.conhecimento.conceitos.find(c => c.chave === conceito.chave)) {
                this.conhecimento.conceitos.push({
                    ...conceito,
                    materiaId: materia.id
                });
            }
        });

        return this.conhecimento.materias[materia.id];
    }

    /**
     * Adiciona questões ao banco de dados do tutor
     */
    adicionarQuestoes(questoes) {
        this.conhecimento.questoes.push(
            ...questoes.map(q => ({
                ...q,
                id: q.id || `q_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
                dataCriacao: new Date(),
                usos: 0,
                acertos: 0,
                erros: 0
            }))
        );

        return this.conhecimento.questoes.length;
    }

    /**
     * ============================================================
     *  AVALIAÇÃO DIAGNÓSTICA INICIAL
     * ============================================================
     */

    /**
     * Cria uma avaliação diagnóstica personalizada
     * para identificar o nível de conhecimento atual
     */
    criarDiagnosticoInicial(materiaId) {
        const materia = this.conhecimento.materias[materiaId];
        if (!materia) throw new Error(`Matéria "${materiaId}" não encontrada`);

        const questoesDisponiveis = this.conhecimento.questoes
            .filter(q => q.materiaId === materiaId);

        if (questoesDisponiveis.length === 0) {
            return { erro: 'Nenhuma questão disponível para esta matéria', questoes: [] };
        }

        // Seleciona questões de diferentes níveis para o diagnóstico
        const questoesPorNivel = {
            facil: questoesDisponiveis.filter(q => q.dificuldade === 'facil').slice(0, 5),
            medio: questoesDisponiveis.filter(q => q.dificuldade === 'medio').slice(0, 5),
            dificil: questoesDisponiveis.filter(q => q.dificuldade === 'dificil').slice(0, 3)
        };

        const questoesDiagnostico = [
            ...questoesPorNivel.facil,
            ...questoesPorNivel.medio,
            ...questoesPorNivel.dificil
        ];

        return {
            tipo: 'diagnostico_inicial',
            materiaId,
            materiaNome: materia.nome,
            totalQuestoes: questoesDiagnostico.length,
            estimativaTempo: questoesDiagnostico.length * 2, // minutos
            questoes: questoesDiagnostico.map(q => ({
                id: q.id,
                enunciado: this.aplicarAcessibilidadeTexto(q.enunciado),
                alternativas: q.alternativas,
                dificuldade: q.dificuldade,
                tipo: q.tipo || 'multipla_escolha'
                // NOTA: NÃO incluir a resposta correta no diagnóstico
            })),
            estudante: {
                nome: this.estudante.nome,
                acessibilidade: this.estudante.acessibilidade
            }
        };
    }

    /**
     * Processa o resultado do diagnóstico e define o plano de ensino
     */
    processarDiagnostico(respostas) {
        let acertos = { facil: 0, medio: 0, dificil: 0 };
        let totais = { facil: 0, medio: 0, dificil: 0 };

        respostas.forEach(resposta => {
            const questao = this.conhecimento.questoes.find(q => q.id === resposta.questaoId);
            if (!questao) return;

            totais[questao.dificuldade]++;
            const correta = resposta.resposta === questao.respostaCorreta;

            if (correta) {
                acertos[questao.dificuldade]++;
            }

            // Atualiza estatísticas da questão
            questao.usos++;
            if (correta) questao.acertos++;
            else questao.erros++;
        });

        // Calcula nivel geral
        const taxaAcertoFacil = totais.facil > 0 ? acertos.facil / totais.facil : 0;
        const taxaAcertoMedio = totais.medio > 0 ? acertos.medio / totais.medio : 0;
        const taxaAcertoDificil = totais.dificil > 0 ? acertos.dificil / totais.dificil : 0;

        let nivelSugerido;
        if (taxaAcertoDificil >= 0.7) nivelSugerido = 'avancado';
        else if (taxaAcertoMedio >= 0.6) nivelSugerido = 'intermediario';
        else nivelSugerido = 'iniciante';

        this.nivelDificuldade = nivelSugerido技能等级 = nivelSugerido;

        // Atualiza histórico do estudante
        this.estudante.historicoDesempenho.push({
            tipo: 'diagnostico',
            data: new Date(),
            materiaId: respostas[0]?.materiaId,
            acertos,
            totais,
            nivelSugerido,
            taxaGeral: (acertos.facil + acertos.medio + acertos.dificil) /
                (totais.facil + totais.medio + totais.dificil)
        });

        return {
            nivelSugerido,
            desempenho: { acertos, totais },
            recomendacao: this.gerarRecomendacao(nivelSugerido, acertos, totais),
            pontosFracos: this.identificarPontosFracos(respostas),
            pontosFortes: this.identificarPontosFortes(respostas)
        };
    }

    /**
     * ============================================================
     *  SESSÃO DE ESTUDO ADAPTATIVA
     * ============================================================
     */

    /**
     * Inicia uma sessão de estudo personalizada
     */
    iniciarSessao(materiaId, config = {}) {
        const materia = this.conhecimento.materias[materiaId];
        if (!materia) throw new Error(`Matéria "${materiaId}" não encontrada`);

        const questoesDisponiveis = this.conhecimento.questoes
            .filter(q => q.materiaId === materiaId);

        if (questoesDisponiveis.length === 0) {
            return { erro: 'Nenhuma questão disponível para esta matéria' };
        }

        const quantidade = config.quantidade || 10;
        const questoesSelecionadas = this.selecionarQuestoesAdaptativas(
            questoesDisponiveis,
            quantidade
        );

        this.sessaoAtual = {
            id: `sessao_${Date.now()}`,
            materiaId,
            materiaNome: materia.nome,
            inicio: new Date(),
            questoes: questoesSelecionadas.map(q => ({
                ...q,
                enunciado: this.aplicarAcessibilidadeTexto(q.enunciado),
                respondida: false,
                respostaUsuario: null,
                correta: null
            })),
            progresso: 0,
            acertos: 0,
            erros: 0,
            config: {
                modo: config.modo || 'estudo', // estudo | prova | revisao
                tempoLimite: config.tempoLimite || null, // minutos
                permitirPular: config.permitirPular !== false,
                mostrarFeedback: config.mostrarFeedback !== false
            }
        };

        return {
            sessao: {
                id: this.sessaoAtual.id,
                materiaNome: this.sessaoAtual.materiaNome,
                totalQuestoes: this.sessaoAtual.questoes.length,
                progresso: 0,
                config: this.sessaoAtual.config
            },
            primeiraQuestao: this.sessaoAtual.questoes[0]
        };
    }

    /**
     * Seleciona questões de forma adaptativa baseada no desempenho
     */
    selecionarQuestoesAdaptativas(questoes, quantidade) {
        // Separa por dificuldade
        const facil = questoes.filter(q => q.dificuldade === 'facil');
        const medio = questoes.filter(q => q.dificuldade === 'medio');
        const dificil = questoes.filter(q => q.dificuldade === 'dificil');

        // Menos vistas primeiro (para evitar repetição)
        const porVistas = (a, b) => (a.usos || 0) - (b.usos || 0);
        facil.sort(porVistas);
        medio.sort(porVistas);
        dificil.sort(porVistas);

        // Distribuição adaptativa baseada no nível
        let distribuicao;
        switch (this.nivelDificuldade) {
            case 'iniciante':
                distribuicao = { facil: 0.6, medio: 0.3, dificil: 0.1 };
                break;
            case 'intermediario':
                distribuicao = { facil: 0.2, medio: 0.5, dificil: 0.3 };
                break;
            case 'avancado':
                distribuicao = { facil: 0.1, medio: 0.3, dificil: 0.6 };
                break;
            default:
                distribuicao = { facil: 0.4, medio: 0.4, dificil: 0.2 };
        }

        const selecionadas = [];
        const adicionar = (pool, n) => {
            const qtd = Math.min(n, pool.length);
            selecionadas.push(...pool.slice(0, qtd));
        };

        adicionar(facil, Math.round(quantidade * distribuicao.facil));
        adicionar(medio, Math.round(quantidade * distribuicao.medio));
        adicionar(dificil, Math.round(quantidade * distribuicao.dificil));

        // Completa se não atingiu a quantidade
        const restantes = questoes
            .filter(q => !selecionadas.find(s => s.id === q.id))
            .sort(porVistas);

        while (selecionadas.length < quantidade && restantes.length > 0) {
            selecionadas.push(restantes.shift());
        }

        // Embaralha as questões selecionadas
        return this.embaralhar(selecionadas).slice(0, quantidade);
    }

    /**
     * Processa a resposta do estudante para uma questão
     */
    responderQuestao(questaoId, resposta) {
        if (!this.sessaoAtual) {
            return { erro: 'Nenhuma sessão ativa' };
        }

        const questao = this.sessaoAtual.questoes.find(q => q.id === questaoId);
        if (!questao) {
            return { erro: 'Questão não encontrada na sessão atual' };
        }

        if (questao.respondida) {
            return { erro: 'Questão já respondida' };
        }

        // Registra a resposta
        const tempoResposta = Date.now() - (this.sessaoAtual.inicio?.getTime() || Date.now());
        questao.respondida = true;
        questao.respostaUsuario = resposta;
        questao.correta = resposta === questao.respostaCorreta;
        questao.tempoResposta = tempoResposta;

        // Atualiza estatísticas
        if (questao.correta) {
            this.sessaoAtual.acertos++;
            this.estudante.acertosConsecutivos++;
            this.estudante.errosConsecutivos = 0;
            this.estudante.pontuacao += this.calcularPontos(questao.dificuldade, tempoResposta);
        } else {
            this.sessaoAtual.erros++;
            this.estudante.errosConsecutivos++;
            this.estudante.acertosConsecutivos = 0;
        }

        // Atualiza progresso
        this.sessaoAtual.progresso =
            (this.sessaoAtual.questoes.filter(q => q.respondida).length /
                this.sessaoAtual.questoes.length) * 100;

        // Feedback imediato
        const feedback = this.gerarFeedback(questao);

        // Adapta dificuldade em tempo real
        this.ajustarDificuldadeTempoReal();

        const proximaQuestao = this.sessaoAtual.questoes.find(q => !q.respondida);

        const resultado = {
            correta: questao.correta,
            respostaCorreta: questao.respostaCorreta,
            explicacao: this.aplicarAcessibilidadeTexto(questao.explicacao || ''),
            feedback,
            progresso: this.sessaoAtual.progresso,
            pontuacaoGanha: questao.correta
                ? this.calcularPontos(questao.dificuldade, tempoResposta)
                : 0,
            pontuacaoTotal: this.estudante.pontuacao,
            proximaQuestao: proximaQuestao ? {
                id: proximaQuestao.id,
                enunciado: proximaQuestao.enunciado,
                alternativas: proximaQuestao.alternativas,
                tipo: proximaQuestao.tipo || 'multipla_escolha'
            } : null,
            sessaoCompleta: !proximaQuestao,
            dica: questao.correta ? null : this.gerarDica(questao)
        };

        // Se sessão completa, processa automaticamente
        if (!proximaQuestao) {
            resultado.resumo = this.finalizarSessao();
        }

        return resultado;
    }

    /**
     * Finaliza a sessão atual e gera relatório
     */
    finalizarSessao() {
        if (!this.sessaoAtual) return null;

        const tempoTotal = Date.now() - this.sessaoAtual.inicio.getTime();
        const totalQuestoes = this.sessaoAtual.questoes.length;
        const acertos = this.sessaoAtual.acertos;
        const erros = this.sessaoAtual.erros;
        const taxaAcerto = totalQuestoes > 0 ? (acertos / totalQuestoes) * 100 : 0;

        const resumo = {
            sessaoId: this.sessaoAtual.id,
            materia: this.sessaoAtual.materiaNome,
            duracao: Math.round(tempoTotal / 1000), // segundos
            totalQuestoes,
            acertos,
            erros,
            taxaAcerto: Math.round(taxaAcerto * 10) / 10,
            pontuacaoGanha: this.estudante.pontuacao - (this._pontuacaoAnterior || 0),
            pontuacaoTotal: this.estudante.pontuacao,
            desempenho: taxaAcerto >= 80 ? 'Excelente' :
                taxaAcerto >= 60 ? 'Bom' :
                    taxaAcerto >= 40 ? 'Regular' : 'Precisa melhorar',
            questoesErradas: this.sessaoAtual.questoes
                .filter(q => q.respondida && !q.correta)
                .map(q => ({
                    id: q.id,
                    enunciado: q.enunciado,
                    respostaUsuario: q.respostaUsuario,
                    respostaCorreta: q.respostaCorreta,
                    explicacao: q.explicacao,
                    conceitoRelacionado: q.conceito
                })),
            pontosFortes: this.identificarConceitosFortes(),
            pontosFracos: this.identificarConceitosFracos(),
            recomendacao: this.gerarRecomendacaoPorDesempenho(taxaAcerto)
        };

        // Atualiza histórico do estudante
        this.estudante.historicoDesempenho.push(resumo);
        this.estudante.sessoesCompletadas++;
        this._pontuacaoAnterior = this.estudante.pontuacao;

        // Calcula tempo médio de resposta
        const tempos = this.sessaoAtual.questoes
            .filter(q => q.respondida && q.tempoResposta)
            .map(q => q.tempoResposta);

        if (tempos.length > 0) {
            this.estudante.tempoMedioResposta =
                tempos.reduce((a, b) => a + b, 0) / tempos.length;
        }

        this.logSessao.push({ ...this.sessaoAtual });
        this.sessaoAtual = null;

        return resumo;
    }

    /**
     * ============================================================
     *  GERAÇÃO DE FEEDBACK, DICAS E RECOMENDAÇÕES
     * ============================================================
     */

    /**
     * Gera feedback personalizado baseado na resposta
     */
    gerarFeedback(questao) {
        const nome = this.estudante.nome;

        if (questao.correta) {
            const frases = [
                `Excelente, ${nome}! Você acertou!`,
                `Muito bem, ${nome}! Resposta correta!`,
                `Parabéns, ${nome}! Você está mandando bem!`,
                `Show de bola, ${nome}! Continue assim!`,
                `Isso aí, ${nome}! Você acertou!`
            ];
            return {
                tipo: 'positivo',
                texto: frases[Math.floor(Math.random() * frases.length)],
                dicaAdicional: null
            };
        } else {
            const frases = [
                `Quase lá, ${nome}! A resposta correta é outra. Vamos revisar?`,
                `Não foi dessa vez, ${nome}! Mas está tudo bem, errar faz parte do aprendizado.`,
                `Ops! Não é bem isso. Vamos entender juntos o porquê.`,
                `Que pena! Mas cada erro é um passo para o acerto. Vamos lá!`,
                `Não desanime, ${nome}! Vamos revisar esse conceito.`
            ];
            return {
                tipo: 'construtivo',
                texto: frases[Math.floor(Math.random() * frases.length)],
                dicaAdicional: questao.conceito
                    ? `Dica: revise o conceito de "${questao.conceito}"`
                    : null
            };
        }
    }

    /**
     * Gera uma dica para ajudar o estudante sem dar a resposta
     */
    gerarDica(questao) {
        if (!questao.explicacao) return null;

        // Extrai uma dica parcial da explicação
        const dicas = questao.dicas || [];
        if (dicas.length > 0) {
            return dicas[Math.floor(Math.random() * dicas.length)];
        }

        // Gera dica automaticamente da explicação
        const palavras = questao.explicacao.split(' ');
        if (palavras.length > 20) {
            return palavras.slice(0, Math.floor(palavras.length / 3)).join(' ') + '...';
        }

        return questao.explicacao.substring(0, Math.floor(questao.explicacao.length / 2)) + '...';
    }

    /**
     * Gera recomendação personalizada pós-diagnóstico
     */
    gerarRecomendacao(nivel, acertos, totais) {
        const recomendacoes = [];

        if (nivel === 'iniciante') {
            recomendacoes.push(
                'Vamos começar pelos fundamentos!',
                'Recomendo estudar os conceitos básicos primeiro.',
                'Faremos exercícios mais simples para construir sua base.'
            );
        } else if (nivel === 'intermediario') {
            recomendacoes.push(
                'Você já tem uma boa base! Vamos aprofundar.',
                'Hora de praticar com exercícios mais desafiadores.',
                'Bora consolidar seu conhecimento com questões variadas.'
            );
        } else {
            recomendacoes.push(
                'Excelente nível! Vamos para desafios avançados.',
                'Você domina o básico. Hora de ir além!',
                'Preparado para questões complexas e raciocínio crítico.'
            );
        }

        // Recomendações específicas por desempenho
        if (totais.medio > 0 && acertos.medio / totais.medio < 0.5) {
            recomendacoes.push(
                'Sugiro revisar os tópicos de dificuldade média com mais calma.'
            );
        }

        return recomendacoes[Math.floor(Math.random() * recomendacoes.length)];
    }

    gerarRecomendacaoPorDesempenho(taxaAcerto) {
        if (taxaAcerto >= 80) {
            return 'Ótimo desempenho! Tente aumentar o nível de dificuldade na próxima sessão.';
        } else if (taxaAcerto >= 60) {
            return 'Bom trabalho! Pratique mais os conceitos que você errou.';
        } else if (taxaAcerto >= 40) {
            return 'Continue praticando! Reveja os conceitos básicos e tente novamente.';
        } else {
            return 'Que tal revisar o conteúdo desde o início? Posso ajudar com explicações mais detalhadas.';
        }
    }

    /**
     * ============================================================
     *  ANÁLISE DE DESEMPENHO E ADAPTAÇÃO
     * ============================================================
     */

    /**
     * Ajusta dificuldade em tempo real baseado no desempenho recente
     */
    ajustarDificuldadeTempoReal() {
        const erros = this.estudante.errosConsecutivos;
        const acertos = this.estudante.acertosConsecutivos;

        if (erros >= 3 && this.nivelDificuldade !== 'iniciante') {
            if (this.nivelDificuldade === 'avancado') {
                this.nivelDificuldade = 'intermediario';
            } else if (this.nivelDificuldade === 'intermediario') {
                this.nivelDificuldade = 'iniciante';
            }
            this.estudante.errosConsecutivos = 0;
        }

        if (acertos >= 5) {
            if (this.nivelDificuldade === 'iniciante') {
                this.nivelDificuldade = 'intermediario';
            } else if (this.nivelDificuldade === 'intermediario') {
                this.nivelDificuldade = 'avancado';
            }
            this.estudante.acertosConsecutivos = 0;
        }
    }

    /**
     * Identifica pontos fracos baseado nos erros
     */
    identificarPontosFracos(respostas) {
        const erros = respostas.filter(r => {
            const q = this.conhecimento.questoes.find(quest => quest.id === r.questaoId);
            return q && r.resposta !== q.respostaCorreta;
        });

        const conceitos = {};
        erros.forEach(r => {
            const q = this.conhecimento.questoes.find(quest => quest.id === r.questaoId);
            if (q && q.conceito) {
                conceitos[q.conceito] = (conceitos[q.conceito] || 0) + 1;
            }
        });

        return Object.entries(conceitos)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 3)
            .map(([conceito, quantidade]) => ({ conceito, quantidade }));
    }

    /**
     * Identifica pontos fortes baseado nos acertos
     */
    identificarPontosFortes(respostas) {
        const acertos = respostas.filter(r => {
            const q = this.conhecimento.questoes.find(quest => quest.id === r.questaoId);
            return q && r.resposta === q.respostaCorreta;
        });

        const conceitos = {};
        acertos.forEach(r => {
            const q = this.conhecimento.questoes.find(quest => quest.id === r.questaoId);
            if (q && q.conceito) {
                conceitos[q.conceito] = (conceitos[q.conceito] || 0) + 1;
            }
        });

        return Object.entries(conceitos)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 3)
            .map(([conceito, quantidade]) => ({ conceito, quantidade }));
    }

    identificarConceitosFortes() {
        if (!this.sessaoAtual) return [];
        const acertos = this.sessaoAtual.questoes.filter(q => q.respondida && q.correta);
        const conceitos = {};
        acertos.forEach(q => {
            if (q.conceito) conceitos[q.conceito] = (conceitos[q.conceito] || 0) + 1;
        });
        return Object.entries(conceitos)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 3)
            .map(([c]) => c);
    }

    identificarConceitosFracos() {
        if (!this.sessaoAtual) return [];
        const erros = this.sessaoAtual.questoes.filter(q => q.respondida && !q.correta);
        const conceitos = {};
        erros.forEach(q => {
            if (q.conceito) conceitos[q.conceito] = (conceitos[q.conceito] || 0) + 1;
        });
        return Object.entries(conceitos)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 3)
            .map(([c]) => c);
    }

    /**
     * ============================================================
     *  UTILITÁRIOS
     * ============================================================
     */

    aplicarAcessibilidadeTexto(texto) {
        if (!texto) return texto;
        if (this.estudante.acessibilidade.simplificacaoTexto) {
            return this.simplificarTexto(texto, 'moderado');
        }
        return texto;
    }

    calcularPontos(dificuldade, tempoResposta) {
        const base = { facil: 10, medio: 20, dificil: 30 };
        const pontosBase = base[dificuldade] || 10;

        // Bônus por rapidez (se respondeu em menos de 30s)
        const bonusRapidez = tempoResposta < 30000 ? 5 : 0;

        return pontosBase + bonusRapidez;
    }

    embaralhar(array) {
        const arr = [...array];
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    }

    /**
     * Retorna relatório completo do estudante
     */
    relatorioEstudante() {
        return {
            nome: this.estudante.nome,
            nivelAtual: this.nivelDificuldade,
            sessoesCompletadas: this.estudante.sessoesCompletadas,
            pontuacao: this.estudante.pontuacao,
            tempoMedioResposta: Math.round(this.estudante.tempoMedioResposta / 1000),
            acessibilidade: this.estudante.acessibilidade,
            ultimasSessoes: this.estudante.historicoDesempenho.slice(-5),
            pontosFortes: this.estudante.historicoDesempenho.length > 0
                ? this.identificarConceitosFortes()
                : [],
            pontosFracos: this.estudante.historicoDesempenho.length > 0
                ? this.identificarConceitosFracos()
                : []
        };
    }
}

/**
 * ============================================================
 *  EXEMPLO DE USO
 * ============================================================
 */

// Apenas executa o exemplo de uso se estiver em ambiente Node.js (sem janela do navegador)
if (typeof window === 'undefined') {
    // Instancia o tutor
    const tutor = new TutorInteligente({
        nome: 'TutorDigi',
        estudanteNome: 'Ana Clara',
        estudanteIdade: 12,
        estudanteSerie: '6º ano',
        nivelDificuldade: 'iniciante',
        simplificacaoTexto: true,
        leituraVozAlta: false
    });

    // Registra matérias
    tutor.registrarMateria({
        id: 'matematica',
        nome: 'Matemática',
        conceitos: [
            { chave: 'adicao', nome: 'Adição', descricao: 'Operação de somar números' },
            { chave: 'subtracao', nome: 'Subtração', descricao: 'Operação de diminuir números' },
            { chave: 'multiplicacao', nome: 'Multiplicação', descricao: 'Multiplicar números' },
            { chave: 'divisao', nome: 'Divisão', descricao: 'Dividir números' }
        ]
    });

    // Adiciona questões
    tutor.adicionarQuestoes([
        {
            materiaId: 'matematica',
            enunciado: 'Quanto é 5 + 3?',
            alternativas: ['6', '7', '8', '9'],
            respostaCorreta: '8',
            dificuldade: 'facil',
            conceito: 'adicao',
            explicacao: '5 + 3 = 8. Basta contar 3 unidades a partir do 5.',
            dicas: ['Tente contar nos dedos!', 'Comece do 5 e conte mais 3.']
        },
        {
            materiaId: 'matematica',
            enunciado: 'Quanto é 12 - 7?',
            alternativas: ['4', '5', '6', '7'],
            respostaCorreta: '5',
            dificuldade: 'facil',
            conceito: 'subtracao',
            explicacao: '12 - 7 = 5. Se você tem 12 e tira 7, sobram 5.',
            dicas: ['Pense em quanto falta para chegar ao 12.']
        },
        {
            materiaId: 'matematica',
            enunciado: 'Quanto é 4 x 6?',
            alternativas: ['20', '24', '28', '30'],
            respostaCorreta: '24',
            dificuldade: 'medio',
            conceito: 'multiplicacao',
            explicacao: '4 x 6 = 24. É o mesmo que 4 + 4 + 4 + 4 + 4 + 4.',
            dicas: ['Some 4 seis vezes!']
        }
    ]);

    // Inicia sessão
    const sessao = tutor.iniciarSessao('matematica', { quantidade: 5 });
    console.log('Sessão iniciada:', sessao.sessao);

    // Simula respostas
    const questoes = sessao.primeiraQuestao;
    if (questoes) {
        console.log(tutor.responderQuestao(questoes.id, '8'));
    }
}

// Exportação híbrida (Navegador e Node.js)
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = TutorInteligente;
} else if (typeof window !== 'undefined') {
    window.TutorInteligente = TutorInteligente;
}