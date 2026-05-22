// ============================================================
// DATA SCIENCE CHALLENGE ENGINE — ULTIMATE EDITION v3.0
// ============================================================

// ============================================================
// MÓDULO 1: CONFIGURAÇÕES E CONSTANTES
// ============================================================

const CONFIG = {
  version: '3.0.0',
  name: 'DataScience Challenge Engine',
  maxStreakBonus: 1.5,
  baseXPPerLevel: 100,
  maxLevel: 50,
  timeBonusMultiplier: 0.5,
  dailyChallengeBonus: 100,
  masteryThreshold: 0.8,
  reviewIntervalDays: [1, 3, 7, 14, 30],
  maxConcurrentDailyChallenges: 7,
  leaderboardCacheTTL: 300000, // 5 minutes
  defaultChallengeSetSize: 5,
  supportedExportFormats: ['json', 'csv', 'pdf', 'html'],
  skillTreeVersion: '1.0'
};

const DIFFICULTIES = Object.freeze({
  beginner:     { label: 'Iniciante',       points: 10,  timeMin: 5,  weight: 1.0, color: '#4CAF50',  multiplier: 1.0  },
  elementary:   { label: 'Elementar',       points: 15,  timeMin: 7,  weight: 1.2, color: '#8BC34A',  multiplier: 1.2  },
  intermediate: { label: 'Intermediário',   points: 25,  timeMin: 12, weight: 1.5, color: '#FFC107',  multiplier: 1.5  },
  advanced:     { label: 'Avançado',        points: 40,  timeMin: 18, weight: 2.0, color: '#FF9800',  multiplier: 2.0  },
  expert:       { label: 'Expert',          points: 60,  timeMin: 25, weight: 2.5, color: '#F44336',  multiplier: 2.5  },
  master:       { label: 'Mestre',          points: 100, timeMin: 40, weight: 3.0, color: '#9C27B0',  multiplier: 3.5  }
});

const DOMAINS = Object.freeze({
  statistics: {
    id: 'statistics',
    name: 'Estatística Descritiva',
    icon: '📊',
    color: '#2196F3',
    topics: [
      'medidas_centrais', 'dispersao', 'distribuicoes', 'correlacao',
      'probabilidade', 'inferencia', 'testes_hipotese', 'regressao'
    ],
    skills: ['calculo_media', 'calculo_mediana', 'desvio_padrao', 'coeficiente_variacao',
             'correlacao_pearson', 'probabilidade_condicional', 'teorema_central_limite',
             'intervalo_confianca', 'teste_t', 'anova'],
    prerequisites: {},
    examTopics: ['ENEM', 'vestibular']
  },
  python: {
    id: 'python',
    name: 'Python para Dados',
    icon: '🐍',
    color: '#4CAF50',
    topics: [
      'pandas_basico', 'pandas_avancado', 'numpy', 'limpeza_dados',
      'feature_engineering', 'automacao', 'apis_dados', 'performance'
    ],
    skills: ['dataframe_ops', 'groupby_agg', 'merge_join', 'pivot_table',
             'apply_vectorize', 'datetime_ops', 'string_ops', 'missing_data',
             'outlier_detection', 'data_pipelines'],
    prerequisites: { 'estruturas_dados': 0.7, 'logica': 0.6 },
    examTopics: ['PCEP', 'PCAP']
  },
  sql: {
    id: 'sql',
    name: 'SQL para Análise',
    icon: '🗄️',
    color: '#FF9800',
    topics: [
      'select_basico', 'joins', 'agregacoes', 'subqueries',
      'window_functions', 'cte', 'otimizacao', 'nosql'
    ],
    skills: ['select_where', 'inner_join', 'left_join', 'group_by_having',
             'subquery_correlacionada', 'rank_dense_rank', 'row_number',
             'with_cte', 'index_strategy', 'query_plan'],
    prerequisites: { 'logica_conjuntos': 0.5 },
    examTopics: ['SQL fundamentals']
  },
  visualization: {
    id: 'visualization',
    name: 'Visualização de Dados',
    icon: '📈',
    color: '#E91E63',
    topics: [
      'matplotlib', 'seaborn', 'plotly', 'dashboards',
      'design_visual', 'acessibilidade', 'storytelling', 'interatividade'
    ],
    skills: ['bar_chart', 'scatter_plot', 'histogram', 'heatmap',
             'box_plot', 'time_series_plot', 'interactive_dash',
             'color_theory', 'gestalt_principles', 'data_ink_ratio'],
    prerequisites: { 'python': 0.6 },
    examTopics: ['Tableau', 'PowerBI']
  },
  analytics: {
    id: 'analytics',
    name: 'Pensamento Analítico',
    icon: '🧠',
    color: '#9C27B0',
    topics: [
      'raciocinio_logico', 'pattern_recognition', 'decisao_dados',
      'metricas_negocio', 'ab_testing', 'causalidade', 'otimizacao',
      'comunicacao'
    ],
    skills: ['hipotese_nula', 'significancia_estatistica', 'confusion_matrix',
             'curva_roc', 'feature_importance', 'bias_variance',
             'tradeoff_analise', 'kpi_definicao', 'norta_steering',
             'data_storytelling'],
    prerequisites: { 'statistics': 0.5, 'python': 0.4 },
    examTopics: ['Case interviews']
  },
  machine_learning: {
    id: 'machine_learning',
    name: 'Machine Learning',
    icon: '🤖',
    color: '#00BCD4',
    topics: [
      'supervisionado', 'nao_supervisionado', 'pre_processamento',
      'avaliacao_modelos', 'feature_selection', 'ensemble', 'deploy'
    ],
    skills: ['regressao_linear', 'logistic_regression', 'decision_tree',
             'random_forest', 'kmeans', 'pca', 'cross_validation',
             'grid_search', 'metrics_avaliacao', 'feature_importance'],
    prerequisites: { 'statistics': 0.7, 'python': 0.8, 'analytics': 0.5 },
    examTopics: ['ML concepts']
  }
});

// ============================================================
// MÓDULO 2: SISTEMA DE TEMPLATES AVANÇADO
// ============================================================

class TemplateEngine {
  constructor() {
    this.templates = new Map();
    this.registry = {};
    this._loadAllTemplates();
  }

  _loadAllTemplates() {
    // Templates são carregados de forma hierárquica
    for (const [domainId, domain] of Object.entries(DOMAINS)) {
      this.registry[domainId] = {};
      for (const [diffKey, diffData] of Object.entries(DIFFICULTIES)) {
        this.registry[domainId][diffKey] = this._generateTemplates(domainId, diffKey);
      }
    }
  }

  _generateTemplates(domainId, difficulty) {
    const templates = [];
    const topics = DOMAINS[domainId]?.topics || [];
    const skills = DOMAINS[domainId]?.skills || [];

    // Gera templates baseados em combinações de tópicos e habilidades
    for (let i = 0; i < Math.min(topics.length, skills.length); i++) {
      const template = this._createTemplate(domainId, difficulty, topics[i], skills[i], i);
      if (template) templates.push(template);
    }

    // Templates compostos (multi-tópicos)
    if (difficulty === 'advanced' || difficulty === 'expert' || difficulty === 'master') {
      templates.push(...this._generateCompoundTemplates(domainId, difficulty, topics, skills));
    }

    return templates;
  }

  _createTemplate(domainId, difficulty, topic, skill, index) {
    const templateFns = this._getTemplateFunctions(domainId, difficulty);
    if (!templateFns) return null;

    return {
      id: `${domainId}_${difficulty}_${index}_${Date.now()}`,
      domain: domainId,
      difficulty,
      topic,
      skill,
      ...templateFns.generate(),
      generateContext: templateFns.generateContext,
      validate: templateFns.validate
    };
  }

  _getTemplateFunctions(domainId, difficulty) {
    const generators = {
      statistics: {
        easy: {
          generate: () => ({
            instructions: 'Você é dono de uma loja. Qual foi o valor MÉDIO de vendas nestes dias?',
            format: 'numerico',
            hint: 'Dica fácil: Some todos os valores de vendas e divida pela quantidade de dias totais.'
          }),
          generateContext: () => ({
            values: Array.from({ length: 5 + Math.floor(Math.random() * 5) }, 
                             () => Math.floor(Math.random() * 100))
          }),
          validate: (answer, ctx) => {
            const expected = ctx.values.reduce((a, b) => a + b, 0) / ctx.values.length;
            return Math.abs(parseFloat(answer) - expected) < 0.01;
          }
        },
        intermediate: {
          generate: () => ({
            instructions: 'Os salários da sua empresa variam muito? Calcule o "Desvio Padrão" para descobrir a variação média.',
            format: 'numerico',
            hint: 'O desvio padrão mede se os valores estão próximos da média ou muito espalhados.'
          }),
          generateContext: () => ({
            values: Array.from({ length: 8 + Math.floor(Math.random() * 7) },
                             () => Math.floor(Math.random() * 200) + 50)
          }),
          validate: (answer, ctx) => {
            const mean = ctx.values.reduce((a, b) => a + b, 0) / ctx.values.length;
            const variance = ctx.values.reduce((s, v) => s + (v - mean) ** 2, 0) / (ctx.values.length - 1);
            return Math.abs(parseFloat(answer) - Math.sqrt(variance)) < 0.1;
          }
        },
        advanced: {
          generate: () => ({
            instructions: 'Vendas e Temperatura estão ligadas? Calcule a "Correlação" entre os dias quentes e a venda de sorvetes.',
            format: 'numerico',
            hint: 'Correlação de Pearson: Se der perto de 1, significa que quando um sobe, o outro sobe igual!'
          }),
          generateContext: () => {
            const n = 10;
            const x = Array.from({ length: n }, (_, i) => i + 1);
            const y = x.map(v => v * 2 + Math.random() * 5);
            return { x, y };
          },
          validate: (answer, ctx) => {
            const n = ctx.x.length;
            const mx = ctx.x.reduce((a, b) => a + b, 0) / n;
            const my = ctx.y.reduce((a, b) => a + b, 0) / n;
            const num = ctx.x.reduce((s, xi, i) => s + (xi - mx) * (ctx.y[i] - my), 0);
            const den = Math.sqrt(
              ctx.x.reduce((s, xi) => s + (xi - mx) ** 2, 0) *
              ctx.y.reduce((s, yi) => s + (yi - my) ** 2, 0)
            );
            return Math.abs(parseFloat(answer) - num / den) < 0.05;
          }
        }
      },
      python: {
        easy: {
          generate: () => ({
            instructions: 'Você precisa criar uma tabela de dados (como um Excel) usando Python (Pandas). Que comando você usa?',
            format: 'codigo',
            language: 'python',
            testCases: ['df.shape', 'df.columns.tolist()', 'len(df)']
          }),
          generateContext: () => ({
            data: {
              nome: ['Ana', 'Bruno', 'Carlos'],
              idade: [17, 18, 16],
              nota: [8.5, 7.0, 9.2]
            }
          }),
          validate: (answer, ctx) => {
            const cleaned = answer.trim().toLowerCase();
            return cleaned.includes('pd.dataframe') || 
                   (cleaned.includes('dataframe') && cleaned.includes('dados'));
          }
        },
        intermediate: {
          generate: () => ({
            instructions: 'Tem buracos vazios na sua tabela! Qual código Python joga fora (apaga) as linhas vazias ou preenche com zero?',
            format: 'codigo',
            language: 'python',
            testCases: ['df.isnull().sum().sum()', 'df["categoria"].nunique()']
          }),
          generateContext: () => ({
            columns: ['vendas', 'data', 'regiao', 'produto'],
            nullPercent: Math.floor(Math.random() * 20) + 5
          }),
          validate: (answer, ctx) => {
            const cleaned = answer.trim().toLowerCase();
            return cleaned.includes('dropna') || cleaned.includes('fillna') || cleaned.includes('isnull');
          }
        }
      },
      sql: {
        easy: {
          generate: () => ({
            instructions: 'No seu Banco de Dados, você quer BUSCAR (Select) os clientes que moram no Rio. Que comando filtra isso?',
            format: 'codigo',
            language: 'sql',
            testCases: ['COUNT(*)', 'WHERE']
          }),
          generateContext: () => ({
            table: 'vendas',
            columns: ['id', 'produto', 'quantidade', 'preco', 'data'],
            condition: { field: 'quantidade', operator: '>', value: Math.floor(Math.random() * 50) + 10 }
          }),
          validate: (answer, ctx) => {
            const cleaned = answer.trim().toLowerCase();
            return cleaned.includes('select') && 
                   cleaned.includes('from') && 
                   cleaned.includes(ctx.condition.field);
          }
        },
        intermediate: {
          generate: () => ({
            instructions: 'A tabela Clientes e a tabela Pedidos estão separadas. Que palavra do SQL usamos para JUNTAR as duas tabelas?',
            format: 'codigo',
            language: 'sql',
            testCases: ['INNER JOIN', 'GROUP BY', 'SUM', 'COUNT']
          }),
          generateContext: () => ({
            tables: ['pedidos', 'clientes', 'produtos'],
            joinFields: ['cliente_id', 'produto_id']
          }),
          validate: (answer, ctx) => {
            const cleaned = answer.trim().toLowerCase();
            return cleaned.includes('join') && cleaned.includes('group by') && 
                   (cleaned.includes('sum') || cleaned.includes('count') || cleaned.includes('avg'));
          }
        },
        expert: {
          generate: () => ({
            instructions: 'Você precisa classificar os salários dos funcionários dentro de cada departamento sem pular números no ranking em caso de empate. Qual função de janela SQL resolve isso?',
            format: 'multipla_escolha',
            options: ['DENSE_RANK()', 'RANK()', 'ROW_NUMBER()', 'LEAD()', 'LAG()'],
            hint: 'Dica: RANK() pula posições no ranking em caso de empates (ex: 1, 2, 2, 4), enquanto a função desejada não pula (ex: 1, 2, 2, 3).'
          }),
          generateContext: () => ({
            table: 'funcionarios',
            partition: 'departamento_id',
            order: 'salario'
          }),
          validate: (answer, ctx) => {
            return answer.trim().toUpperCase().includes('DENSE_RANK');
          }
        },
        master: {
          generate: () => ({
            instructions: 'Para comparar o faturamento do dia atual com o faturamento do dia seguinte em uma análise temporal, qual função de janela SQL você usaria para acessar o registro da próxima linha?',
            format: 'multipla_escolha',
            options: ['LEAD()', 'LAG()', 'FIRST_VALUE()', 'NTH_VALUE()', 'ROW_NUMBER()'],
            hint: 'Dica: LAG() olha para a linha anterior (atrás). A função que você procura olha para a linha da frente (adiante).'
          }),
          generateContext: () => ({
            table: 'vendas_diarias',
            order: 'data_venda'
          }),
          validate: (answer, ctx) => {
            return answer.trim().toUpperCase().includes('LEAD');
          }
        }
      },
      visualization: {
        easy: {
          generate: () => ({
            instructions: 'Para mostrar a eleição de 4 candidatos, qual é o tipo de Gráfico mais famoso (formato de comida) usado no mundo todo?',
            format: 'multipla_escolha',
            options: ['Barras', 'Linhas', 'Pizza', 'Dispersão', 'Histograma'],
            hint: 'Dica: Cuidado, fatiar demais esse gráfico deixa ele confuso!'
          }),
          generateContext: () => ({
            dataType: Math.random() > 0.5 ? 'categorico' : 'numerico',
            goal: ['comparacao', 'distribuicao', 'tendencia', 'relacao'][Math.floor(Math.random() * 4)]
          }),
          validate: (answer, ctx) => {
            const validMap = {
              comparacao: 'barras',
              distribuicao: 'histograma',
              tendencia: 'linhas',
              relacao: 'dispersão'
            };
            return answer.trim().toLowerCase().includes('pizza') || answer.trim().toLowerCase().includes(validMap[ctx.goal]);
          }
        }
      },
      analytics: {
        easy: {
          generate: () => ({
            instructions: 'O site antigo converte 5%. O site novo converte 10%. Na sua opinião lógica, qual o Teste A/B provou ser o vencedor?',
            format: 'texto',
            hint: 'Qual das duas versões (Antiga ou Nova) gerou mais dinheiro?'
          }),
          generateContext: () => {
            const visitorsA = 1000 + Math.floor(Math.random() * 500);
            const visitorsB = 1000 + Math.floor(Math.random() * 500);
            const convA = Math.floor(visitorsA * (0.05 + Math.random() * 0.1));
            const convB = Math.floor(visitorsB * (0.05 + Math.random() * 0.15));
            return {
              versionA: { visitors: visitorsA, conversions: convA, rate: (convA / visitorsA * 100).toFixed(2) },
              versionB: { visitors: visitorsB, conversions: convB, rate: (convB / visitorsB * 100).toFixed(2) }
            };
          },
          validate: (answer, ctx) => {
            const cleaned = answer.trim().toLowerCase();
            const checks = ['novo', 'nova', 'b', '10%', 'vencedor'];
            return checks.some(c => cleaned.includes(c)) && cleaned.length > 5;
          }
        },
        master: {
          generate: () => ({
            instructions: 'Como você prova para o seu chefe se foi a Propaganda da TV que aumentou as vendas, e não apenas porque era mês de Natal?',
            format: 'texto',
            hint: 'Pense: E se você tivesse separado algumas cidades para NÃO ver a propaganda? Como chamamos esse grupo de controle?'
          }),
          generateContext: () => ({
            scenario: 'E-commerce quer testar novo layout de página de produto',
            metrics: ['taxa_conversao', 'tempo_pagina', 'receita_por_visita', 'carrinho_abandonado'],
            constraints: ['orçamento limitado', 'prazo de 2 semanas', 'tráfego moderado']
          }),
          validate: (answer, ctx) => {
            const cleaned = answer.trim().toLowerCase();
            const checks = ['controle', 'separar', 'teste', 'grupo', 'compara', 'natal'];
            return checks.filter(c => cleaned.includes(c)).length >= 2 && cleaned.length > 30;
          }
        }
      },
      machine_learning: {
        easy: {
          generate: () => ({
            instructions: 'Se a Inteligência Artificial precisa advinhar se uma foto é de um Gato ou Cachorro, isso é um problema de Classificação ou Regressão?',
            format: 'multipla_escolha',
            options: ['Classificação (Categorias)', 'Regressão (Números)', 'Clusterização', 'Não supervisionado'],
            hint: 'Pense assim: Animais são categorias ou são valores em dinheiro?'
          }),
          generateContext: () => ({
            target: Math.random() > 0.5 ? 'preço do imóvel' : 'cliente vai comprar (sim/não)',
            features: ['metragem', 'quartos', 'localização', 'idade']
          }),
          validate: (answer, ctx) => {
            return answer.trim().toLowerCase().includes('classificação') || answer.trim().toLowerCase().includes('classificacao');
          }
        },
        intermediate: {
          generate: () => ({
            instructions: 'O robô acertou 90 de 100 vezes. Qual é a porcentagem de ACURÁCIA dele?',
            format: 'multiplos_campos',
            fields: ['acuracia', 'precisao', 'recall', 'f1'],
            hint: 'Basta calcular 90 dividido por 100!'
          }),
          generateContext: () => {
            const vp = Math.floor(Math.random() * 80) + 20;
            const vn = Math.floor(Math.random() * 80) + 20;
            const fp = Math.floor(Math.random() * 20);
            const fn = Math.floor(Math.random() * 20);
            const total = vp + vn + fp + fn;
            return {
              confusionMatrix: { vp, vn, fp, fn, total },
              expected: {
                acuracia: ((vp + vn) / total * 100).toFixed(1),
                precisao: (vp / (vp + fp) * 100).toFixed(1),
                recall: (vp / (vp + fn) * 100).toFixed(1),
                f1: (2 * vp / (2 * vp + fp + fn) * 100).toFixed(1)
              }
            };
          },
          validate: (answer, ctx) => {
             return answer.trim().toLowerCase().includes('90') || answer.trim().toLowerCase().includes('0.9') || answer.trim().toLowerCase().includes('90%');
          }
        },
        advanced: {
          generate: () => ({
            instructions: 'O que significa quando dizemos que o robô de I.A. "decorou" as respostas ao invés de aprender de verdade?',
            format: 'texto',
            hint: 'O nome técnico para quando a máquina decora e vai mal na prova final é "Overfitting" (Super-ajuste).'
          }),
          generateContext: () => {
            const scenarios = [
              { model: 'Decision Tree sem depth limit', trainError: '0%', testError: '15%', issue: 'overfitting' },
              { model: 'Regressão Linear simples', trainError: '20%', testError: '22%', issue: 'underfitting' },
              { model: 'Random Forest com 500 árvores', trainError: '2%', testError: '5%', issue: 'bom ajuste' }
            ];
            return scenarios[Math.floor(Math.random() * scenarios.length)];
          },
          validate: (answer, ctx) => {
            const cleaned = answer.trim().toLowerCase();
            return (cleaned.includes('decorou') || cleaned.includes('overfitting') || cleaned.includes('super')) && cleaned.length > 20;
          }
        },
        expert: {
          generate: () => ({
            instructions: 'Para detectar transações financeiras fraudulentas de forma não supervisionada (sem dados históricos rotulados de fraude), qual destes algoritmos baseados em árvores é mais adequado para isolar anomalias?',
            format: 'multipla_escolha',
            options: ['Isolation Forest', 'Random Forest', 'Decision Tree', 'K-Means', 'Gradient Boosting'],
            hint: 'Dica: Este algoritmo isola pontos anômalos criando partições aleatórias nos atributos. Pontos anômalos requerem menos divisões para serem isolados.'
          }),
          generateContext: () => ({
            algorithm: 'Isolation Forest',
            problem: 'Detecção de fraude não supervisionada'
          }),
          validate: (answer, ctx) => {
            const cleaned = answer.trim().toLowerCase();
            return cleaned.includes('isolation') || cleaned.includes('forest');
          }
        },
        master: {
          generate: () => ({
            instructions: 'Durante o treinamento de um modelo preditivo, se aplicarmos a normalização (StandardScaler) em todo o dataset de treino e validação juntos antes de realizar o split (train_test_split), qual problema de integridade de dados teremos criado?',
            format: 'texto',
            hint: 'Dica: Esse problema ocorre quando informações do conjunto de teste ou validação "vazam" para o conjunto de treinamento, resultando em métricas otimistas irreais.'
          }),
          generateContext: () => ({
            issue: 'data leakage',
            mitigation: 'Aplicar fit apenas no conjunto de treino'
          }),
          validate: (answer, ctx) => {
            const cleaned = answer.trim().toLowerCase();
            return cleaned.includes('vazamento') || cleaned.includes('leakage') || cleaned.includes('leak');
          }
        }
      }
    };

    // Fallback genérico
    if (!generators[domainId] || !generators[domainId][difficulty]) {
      return {
        generate: () => ({
          instructions: `Desafio de ${DOMAINS[domainId]?.name || domainId} - nível ${difficulty}`,
          format: 'texto',
          hint: 'Use seu conhecimento da área para resolver.'
        }),
        generateContext: () => ({ data: 'placeholder' }),
        validate: (answer) => answer.trim().length > 10
      };
    }

    return generators[domainId][difficulty];
  }

  _generateCompoundTemplates(domainId, difficulty, topics, skills) {
    const compounds = [];
    // Combina 2-3 tópicos em um único desafio
    for (let i = 0; i < topics.length - 1; i += 2) {
      compounds.push({
        id: `${domainId}_compound_${difficulty}_${i}_${Date.now()}`,
        domain: domainId,
        difficulty,
        compoundTopics: [topics[i], topics[i + 1]],
        compoundSkills: [skills[i], skills[i + 1]],
        instructions: `Desafio composto integrando ${topics[i]} e ${topics[i + 1]}`,
        format: 'texto',
        hint: 'Integre os conhecimentos dos dois tópicos.',
        generateContext: () => ({
          topics: [topics[i], topics[i + 1]],
          compound: true
        }),
        validate: (answer) => answer.trim().length > 30
      });
    }
    return compounds;
  }

  getTemplatesFor(domainId, difficulty) {
    return this.registry[domainId]?.[difficulty] || [];
  }

  getRandomTemplate(domainId, difficulty) {
    const templates = this.getTemplatesFor(domainId, difficulty);
    if (templates.length === 0) return null;
    return templates[Math.floor(Math.random() * templates.length)];
  }
}

// ============================================================
// MÓDULO 3: SISTEMA DE ADAPTAÇÃO INTELIGENTE
// ============================================================

class AdaptiveEngine {
  constructor() {
    this.studentModels = new Map();
    this.knowledgeGraph = this._buildKnowledgeGraph();
  }

  _buildKnowledgeGraph() {
    const graph = {};

    for (const [domainId, domain] of Object.entries(DOMAINS)) {
      graph[domainId] = { mastery: {}, prerequisites: domain.prerequisites || {} };
      domain.skills.forEach(skill => {
        graph[domainId].mastery[skill] = 0.5; // Conhecimento inicial neutro
      });
    }

    // Relações entre domínios
    graph.prerequisites = {
      statistics: [],
      python: [],
      sql: [],
      visualization: ['python'],
      analytics: ['statistics', 'python'],
      machine_learning: ['statistics', 'python', 'analytics']
    };

    return graph;
  }

  getAdaptiveDifficulty(studentId, domainId) {
    const model = this._getOrCreateModel(studentId);
    
    // Se o estudante tem Elo calculado, usamos o Elo para definir a dificuldade base
    if (!model.domainElo) model.domainElo = {};
    if (!model.domainElo[domainId]) model.domainElo[domainId] = 1000;
    const elo = model.domainElo[domainId];
    
    let eloDifficultyIndex = 1; // elementary por padrão
    if (elo < 900) eloDifficultyIndex = 0; // beginner
    else if (elo < 1100) eloDifficultyIndex = 1; // elementary
    else if (elo < 1350) eloDifficultyIndex = 2; // intermediate
    else if (elo < 1650) eloDifficultyIndex = 3; // advanced
    else if (elo < 2000) eloDifficultyIndex = 4; // expert
    else eloDifficultyIndex = 5; // master
    
    // Combina com a lógica original baseada em performance recente para refinamento fino
    const recentPerformance = model.recentPerformance[domainId] || [];
    const recentAvg = recentPerformance.length > 0
      ? recentPerformance.slice(-10).reduce((s, r) => s + r, 0) / Math.min(recentPerformance.length, 10)
      : 0.5;
      
    // Se a performance recente for excelente, dá um pequeno boost (+1 na dificuldade)
    // Se a performance recente for fraca (<0.3), reduz a dificuldade (-1)
    let finalIndex = eloDifficultyIndex;
    if (recentAvg >= 0.8 && finalIndex < 5) finalIndex++;
    if (recentAvg <= 0.3 && finalIndex > 0) finalIndex--;
    
    const difficultyLevels = Object.keys(DIFFICULTIES);
    return difficultyLevels[finalIndex];
  }

  updateModel(studentId, domainId, result, challenge, student = null) {
    const model = this._getOrCreateModel(studentId);

    // Atualiza performance recente
    if (!model.recentPerformance[domainId]) {
      model.recentPerformance[domainId] = [];
    }
    model.recentPerformance[domainId].push(result.correct ? 1 : 0);

    // Mantém apenas os últimos 20 resultados
    if (model.recentPerformance[domainId].length > 20) {
      model.recentPerformance[domainId].shift();
    }

    // Atualiza mastery usando forgetting curve
    const now = Date.now();
    if (!model.lastSeen[challenge.skill]) {
      model.lastSeen[challenge.skill] = now;
      model.domainMastery[domainId] = 0.5;
    }

    const timeSinceLastSeen = (now - model.lastSeen[challenge.skill]) / (1000 * 60 * 60 * 24); // dias
    const forgettingFactor = Math.exp(-timeSinceLastSeen * 0.2); // Decaimento exponencial

    const learningRate = result.correct ? 0.15 : -0.1;
    const currentMastery = model.domainMastery[domainId] || 0.5;
    const newMastery = Math.max(0, Math.min(1, 
      currentMastery * forgettingFactor + learningRate * (1 - currentMastery * forgettingFactor)
    ));

    model.domainMastery[domainId] = newMastery;
    model.lastSeen[challenge.skill] = now;

    // Cálculo Estatístico de Rating Elo adaptado
    const DIFFICULTY_ELO = {
      beginner: 800,
      elementary: 1000,
      intermediate: 1200,
      advanced: 1500,
      expert: 1800,
      master: 2200
    };
    const targetElo = DIFFICULTY_ELO[challenge.difficulty] || 1200;
    const K = 32;
    const actual = result.correct ? 1 : 0;

    if (student) {
      if (!student.domainElo) student.domainElo = {};
      if (!student.domainElo[domainId]) student.domainElo[domainId] = 1000;
      if (!student.globalElo) student.globalElo = 1000;

      // Domain Elo
      const expectedDomain = 1 / (1 + Math.pow(10, (targetElo - student.domainElo[domainId]) / 400));
      student.domainElo[domainId] = Math.round(student.domainElo[domainId] + K * (actual - expectedDomain));

      // Global Elo
      const expectedGlobal = 1 / (1 + Math.pow(10, (targetElo - student.globalElo) / 400));
      student.globalElo = Math.round(student.globalElo + K * (actual - expectedGlobal));

      model.domainElo = { ...student.domainElo };
      model.globalElo = student.globalElo;
    } else {
      if (!model.domainElo) model.domainElo = {};
      if (!model.domainElo[domainId]) model.domainElo[domainId] = 1000;
      if (!model.globalElo) model.globalElo = 1000;

      // Domain Elo
      const expectedDomain = 1 / (1 + Math.pow(10, (targetElo - model.domainElo[domainId]) / 400));
      model.domainElo[domainId] = Math.round(model.domainElo[domainId] + K * (actual - expectedDomain));

      // Global Elo
      const expectedGlobal = 1 / (1 + Math.pow(10, (targetElo - model.globalElo) / 400));
      model.globalElo = Math.round(model.globalElo + K * (actual - expectedGlobal));
    }

    // Spaced Repetition
    this._scheduleReview(studentId, domainId, challenge, result);
  }

  _scheduleReview(studentId, domainId, challenge, result) {
    const model = this._getOrCreateModel(studentId);
    if (!model.reviewSchedule) model.reviewSchedule = {};

    const intervals = CONFIG.reviewIntervalDays;
    const currentInterval = model.reviewSchedule[challenge.skill] || 0;

    if (result.correct) {
      // Avança para próximo intervalo
      const nextIndex = Math.min(
        intervals.indexOf(currentInterval) + 1,
        intervals.length - 1
      );
      model.reviewSchedule[challenge.skill] = intervals[nextIndex] || intervals[intervals.length - 1];
    } else {
      // Reseta para o menor intervalo
      model.reviewSchedule[challenge.skill] = intervals[0];
    }

    model.nextReview = {
      skill: challenge.skill,
      date: new Date(Date.now() + model.reviewSchedule[challenge.skill] * 24 * 60 * 60 * 1000)
    };
  }

  getRecommendedTopics(studentId, limit = 3) {
    const model = this._getOrCreateModel(studentId);
    const recommendations = [];

    for (const [domainId, domain] of Object.entries(DOMAINS)) {
      const mastery = model.domainMastery[domainId] || 0.5;

      // Tópicos com baixa maestria são recomendados
      if (mastery < CONFIG.masteryThreshold) {
        // Verifica se os pré-requisitos foram atendidos
        const prereqs = this.knowledgeGraph.prerequisites[domainId] || [];
        const prereqsMet = prereqs.every(p => (model.domainMastery[p] || 0) >= 0.6);

        if (prereqsMet) {
          recommendations.push({
            domainId,
            domainName: domain.name,
            icon: domain.icon,
            mastery: Math.round(mastery * 100),
            priority: Math.round((1 - mastery) * 100),
            nextReview: model.nextReview
          });
        }
      }
    }

    return recommendations
      .sort((a, b) => b.priority - a.priority)
      .slice(0, limit);
  }

  getKnowledgeMap(studentId) {
    const model = this._getOrCreateModel(studentId);
    const map = {};

    for (const [domainId, domain] of Object.entries(DOMAINS)) {
      map[domainId] = {
        name: domain.name,
        icon: domain.icon,
        mastery: Math.round((model.domainMastery[domainId] || 0.5) * 100),
        skills: domain.skills.map(skill => ({
          name: skill,
          lastSeen: model.lastSeen[skill],
          nextReview: model.reviewSchedule?.[skill]
        }))
      };
    }

    return map;
  }

  _getOrCreateModel(studentId) {
    if (!this.studentModels.has(studentId)) {
      this.studentModels.set(studentId, {
        studentId,
        domainMastery: {},
        domainElo: {},
        globalElo: 1000,
        recentPerformance: {},
        lastSeen: {},
        reviewSchedule: {},
        nextReview: null,
        createdAt: Date.now()
      });
    }
    return this.studentModels.get(studentId);
  }

  getModel(studentId) {
    return this.studentModels.get(studentId) || null;
  }
}

// ============================================================
// MÓDULO 4: SISTEMA DE GAMIFICAÇÃO
// ============================================================

class GamificationSystem {
  constructor() {
    this.achievements = this._defineAchievements();
    this.badges = this._defineBadges();
    this.levels = this._defineLevels();
    this.equipment = this._defineEquipment();
  }

  _defineAchievements() {
    return [
      { id: 'first_steps',        name: 'Primeiros Passos',       desc: 'Complete 1 desafio',                 icon: '🌱',  xp: 10,  condition: s => s.totalCompleted >= 1 },
      { id: 'apprentice',         name: 'Aprendiz de Dados',      desc: 'Complete 10 desafios',               icon: '📚',  xp: 50,  condition: s => s.totalCompleted >= 10 },
      { id: 'analyst',            name: 'Analista em Ascensão',   desc: 'Complete 50 desafios',               icon: '📊',  xp: 150, condition: s => s.totalCompleted >= 50 },
      { id: 'data_scientist',     name: 'Cientista de Dados Jr.', desc: 'Complete 100 desafios',              icon: '🧪',  xp: 300, condition: s => s.totalCompleted >= 100 },
      { id: 'master',             name: 'Mestre dos Dados',       desc: 'Complete 500 desafios',              icon: '🏆',  xp: 1000, condition: s => s.totalCompleted >= 500 },
      { id: 'streak_3',           name: 'Sequência Inicial',      desc: 'Acertou 3 seguidos',                 icon: '🔥',  xp: 30,  condition: s => s.maxStreak >= 3 },
      { id: 'streak_10',          name: 'Sequência de Fogo',      desc: 'Acertou 10 seguidos',                icon: '🔥',  xp: 100, condition: s => s.maxStreak >= 10 },
      { id: 'streak_30',          name: 'Imparável',              desc: 'Acertou 30 seguidos',                icon: '🔥',  xp: 500, condition: s => s.maxStreak >= 30 },
      { id: 'century',            name: 'Centenário',             desc: 'Acumule 100 pontos',                 icon: '💯',  xp: 50,  condition: s => s.totalPoints >= 100 },
      { id: 'millennium',         name: 'Milênio',                desc: 'Acumule 1000 pontos',                icon: '💎',  xp: 300, condition: s => s.totalPoints >= 1000 },
      { id: 'polyglot',           name: 'Poliglota de Dados',     desc: 'Complete desafios em 3 domínios',    icon: '🌍',  xp: 100, condition: s => Object.keys(s.domainsCompleted).length >= 3 },
      { id: 'explorer',           name: 'Explorador',             desc: 'Complete desafios em 5 domínios',    icon: '🗺️',  xp: 250, condition: s => Object.keys(s.domainsCompleted).length >= 5 },
      { id: 'perfectionist',      name: 'Perfeccionista',         desc: '100% de acerto em 10 desafios seguidos', icon: '✨', xp: 200, condition: s => s.perfectStreak >= 10 },
      { id: 'speed_demon',        name: 'Demônio da Velocidade',  desc: 'Complete desafio em menos de 1 min', icon: '⚡',  xp: 50,  condition: s => s.fastSolutions >= 1 },
      { id: 'mentor',             name: 'Mentor',                 desc: 'Ajude 3 colegas a completar desafios', icon: '👨‍🏫', xp: 150, condition: s => s.mentoredCount >= 3 },
      { id: 'night_owl',          name: 'Coruja Noturna',         desc: 'Complete desafios após meia-noite',  icon: '🦉',  xp: 20,  condition: s => s.nightChallenges >= 5 },
      { id: 'early_bird',         name: 'Madrugador',             desc: 'Complete desafios antes das 8h',     icon: '🌅',  xp: 20,  condition: s => s.earlyChallenges >= 5 },
      { id: 'completionist',      name: 'Completista',            desc: '100% dos achievements',              icon: '👑',  xp: 1000, condition: s => false }, // Especial
      { id: 'machine_learning',   name: 'ML Engineer',            desc: 'Complete 20 desafios de ML',         icon: '🤖',  xp: 400, condition: s => (s.domainsCompleted['machine_learning'] || 0) >= 20 },
      { id: 'sql_wizard',         name: 'Mago do SQL',            desc: 'Complete 30 desafios de SQL',        icon: '🧙',  xp: 350, condition: s => (s.domainsCompleted['sql'] || 0) >= 30 },
      { id: 'python_pro',         name: 'Python Pro',             desc: 'Complete 40 desafios de Python',     icon: '🐍',  xp: 400, condition: s => (s.domainsCompleted['python'] || 0) >= 40 },
      { id: 'statistician',       name: 'Estatístico',            desc: 'Complete 25 desafios de Estatística', icon: '📈', xp: 300, condition: s => (s.domainsCompleted['statistics'] || 0) >= 25 },
      { id: 'visualizer',         name: 'Visualizador',           desc: 'Complete 15 desafios de Visualização', icon: '🎨', xp: 200, condition: s => (s.domainsCompleted['visualization'] || 0) >= 15 },
      { id: 'solver',             name: 'Solucionador Nato',      desc: 'Resolva 5 desafios nível Master',    icon: '🧩',  xp: 500, condition: s => (s.difficultyCompleted['master'] || 0) >= 5 },
    ];
  }

  _defineBadges() {
    return {
      domains: {
        statistics:    { name: 'Analista Estatístico',   icon: '📊' },
        python:        { name: 'Pythonista',             icon: '🐍' },
        sql:           { name: 'Query Master',           icon: '🗄️' },
        visualization: { name: 'Visual Storyteller',    icon: '📈' },
        analytics:     { name: 'Critical Thinker',      icon: '🧠' },
        machine_learning: { name: 'ML Practitioner',    icon: '🤖' }
      },
      special: {
        all_domains:       { name: 'Polímata de Dados',       icon: '🌟' },
        level_10:          { name: 'Ascendente',               icon: '⬆️' },
        level_25:          { name: 'Elite dos Dados',          icon: '💎' },
        level_50:          { name: 'Lenda dos Dados',          icon: '👑' },
        top_1_percent:     { name: 'Top 1%',                   icon: '⭐' },
        perfect_month:     { name: 'Mês Perfeito',             icon: '📅' },
        challenge_creator: { name: 'Criador de Desafios',      icon: '✏️' },
        reviewer:          { name: 'Revisor Oficial',          icon: '🔍' }
      }
    };
  }

  _defineLevels() {
    const levels = [];
    for (let i = 1; i <= CONFIG.maxLevel; i++) {
      const xpRequired = Math.floor(CONFIG.baseXPPerLevel * Math.pow(1.15, i - 1));
      const title = this._getLevelTitle(i);
      levels.push({ level: i, xpRequired, title });
    }
    return levels;
  }

  _getLevelTitle(level) {
    if (level <= 5) return 'Novato';
    if (level <= 10) return 'Aprendiz';
    if (level <= 15) return 'Analista';
    if (level <= 20) return 'Especialista';
    if (level <= 25) return 'Expert';
    if (level <= 30) return 'Mestre';
    if (level <= 35) return 'Grão-Mestre';
    if (level <= 40) return 'Lendário';
    if (level <= 45) return 'Mítico';
    return 'Divino';
  }

  _defineEquipment() {
    return [
      { id: 'basic_notebook',    name: 'Caderno Básico',       type: 'tool',   bonus: { xp: 1.05 },  cost: 0,     unlock: 'auto' },
      { id: 'python_ide',        name: 'Python IDE',           type: 'tool',   bonus: { xp: 1.10 },  cost: 500,   unlock: 'points' },
      { id: 'stats_library',     name: 'Biblioteca Estatística', type: 'book', bonus: { xp: 1.15 },  cost: 1000,  unlock: 'points' },
      { id: 'sql_optimizer',     name: 'Otimizador SQL',       type: 'tool',   bonus: { xp: 1.10 },  cost: 800,   unlock: 'points' },
      { id: 'ml_pipeline',       name: 'Pipeline de ML',       type: 'tool',   bonus: { xp: 1.25 },  cost: 2000,  unlock: 'points' },
      { id: 'data_viz_pro',      name: 'Visualização Pro',     type: 'tool',   bonus: { xp: 1.15 },  cost: 1500,  unlock: 'points' },
      { id: 'super_computer',    name: 'Super Computador',     type: 'tool',   bonus: { xp: 1.50 },  cost: 5000,  unlock: 'achievement' },
      { id: 'mentor_cape',       name: 'Capa do Mentor',       type: 'skin',   bonus: { xp: 1.20 },  cost: 3000,  unlock: 'achievement' },
      { id: 'golden_keyboard',   name: 'Teclado Dourado',      type: 'skin',   bonus: { xp: 1.10 },  cost: 2000,  unlock: 'points' },
      { id: 'crystal_ball',      name: 'Bola de Cristal',      type: 'tool',   bonus: { insight: true }, cost: 4000, unlock: 'achievement' }
    ];
  }

  calculateLevel(totalXP) {
    let accumulatedXP = 0;
    for (const level of this.levels) {
      accumulatedXP += level.xpRequired;
      if (totalXP < accumulatedXP) {
        return level.level - 1;
      }
    }
    return CONFIG.maxLevel;
  }

  getLevelProgress(totalXP) {
    const currentLevel = this.calculateLevel(totalXP);
    const currentLevelData = this.levels[currentLevel - 1] || this.levels[0];
    const nextLevelData = this.levels[currentLevel] || this.levels[this.levels.length - 1];

    const xpForCurrent = this.levels.slice(0, currentLevel - 1)
      .reduce((s, l) => s + l.xpRequired, 0);
    const xpForNext = xpForCurrent + currentLevelData.xpRequired;

    return {
      level: currentLevel,
      title: currentLevelData.title,
      currentXP: totalXP - xpForCurrent,
      requiredXP: currentLevelData.xpRequired,
      progress: ((totalXP - xpForCurrent) / currentLevelData.xpRequired) * 100,
      nextLevel: nextLevelData.level,
      nextTitle: nextLevelData.title
    };
  }

  checkNewAchievements(state) {
    const newAchievements = [];
    
    for (const achievement of this.achievements) {
      if (!state.unlockedAchievements.includes(achievement.id) && achievement.condition(state)) {
        newAchievements.push(achievement);
      }
    }

    return newAchievements;
  }

  calculateTimeBonus(timeSpentSeconds, timeLimitSeconds) {
    const ratio = 1 - (timeSpentSeconds / timeLimitSeconds);
    return ratio > 0 ? Math.round(ratio * CONFIG.timeBonusMultiplier * 100) : 0;
  }

  calculateXP(challenge, result, state) {
    let baseXP = challenge.points * DIFFICULTIES[challenge.difficulty].multiplier;
    
    // Bônus de streak
    if (state.currentStreak >= 3) {
      baseXP *= 1 + (state.currentStreak * 0.05);
    }

    // Bônus de tempo
    if (result.timeSpent) {
      baseXP += this.calculateTimeBonus(result.timeSpent, challenge.timeLimit);
    }

    // Bônus de equipment
    if (state.equipment) {
      state.equipment.forEach(eq => {
        if (eq.bonus?.xp) baseXP *= eq.bonus.xp;
      });
    }

    // Bônus de first daily
    if (result.isFirstDaily) {
      baseXP *= 1.5;
    }

    return Math.round(baseXP);
  }
}

// ============================================================
// MÓDULO 5: ANÁLISE E RELATÓRIOS
// ============================================================

class AnalyticsEngine {
  constructor() {
    this.events = [];
    this.metrics = new Map();
  }

  trackEvent(eventType, data) {
    this.events.push({
      type: eventType,
      data,
      timestamp: Date.now()
    });

    // Mantém apenas últimos 10k eventos
    if (this.events.length > 10000) {
      this.events = this.events.slice(-5000);
    }
  }

  generateStudentReport(studentProgress) {
    const report = {
      studentId: studentProgress.studentId,
      generatedAt: new Date().toISOString(),
      summary: {
        totalChallenges: studentProgress.challenges.length,
        totalPoints: studentProgress.totalPoints,
        accuracy: studentProgress.challenges.length > 0
          ? Math.round((studentProgress.correctAnswers / studentProgress.challenges.length) * 100)
          : 0,
        level: studentProgress.level,
        currentStreak: studentProgress.currentStreak,
        maxStreak: studentProgress.maxStreak,
        globalElo: studentProgress.globalElo || 1000
      },
      domainPerformance: {},
      difficultyPerformance: {},
      timeAnalysis: {},
      weakPoints: [],
      strongPoints: [],
      recommendations: []
    };

    // Análise por domínio
    for (const [domainId, domain] of Object.entries(DOMAINS)) {
      const domainChallenges = studentProgress.challenges.filter(c => c.domain === domainId);
      if (domainChallenges.length > 0) {
        const correct = domainChallenges.filter(c => c.correct).length;
        report.domainPerformance[domainId] = {
          name: domain.name,
          icon: domain.icon,
          total: domainChallenges.length,
          correct,
          accuracy: Math.round((correct / domainChallenges.length) * 100),
          points: domainChallenges.reduce((s, c) => s + (c.points || 0), 0),
          elo: studentProgress.domainElo?.[domainId] || 1000
        };

        if (report.domainPerformance[domainId].accuracy >= 80) {
          report.strongPoints.push(domain.name);
        } else if (report.domainPerformance[domainId].accuracy < 50) {
          report.weakPoints.push(domain.name);
          report.recommendations.push(`Praticar mais em ${domain.name}`);
        }
      }
    }

    // Análise por dificuldade
    for (const [diffKey, diffData] of Object.entries(DIFFICULTIES)) {
      const diffChallenges = studentProgress.challenges.filter(c => c.difficulty === diffKey);
      if (diffChallenges.length > 0) {
        const correct = diffChallenges.filter(c => c.correct).length;
        report.difficultyPerformance[diffKey] = {
          label: diffData.label,
          total: diffChallenges.length,
          correct,
          accuracy: Math.round((correct / diffChallenges.length) * 100)
        };
      }
    }

    // Análise temporal
    if (studentProgress.challenges.length > 0) {
      const times = studentProgress.challenges
        .filter(c => c.timeSpent)
        .map(c => c.timeSpent);
      
      if (times.length > 0) {
        report.timeAnalysis = {
          averageTime: Math.round(times.reduce((s, t) => s + t, 0) / times.length),
          fastestTime: Math.min(...times),
          slowestTime: Math.max(...times),
          totalTimeSpent: times.reduce((s, t) => s + t, 0)
        };
      }
    }

    // Skill gaps
    for (const [domainId, domain] of Object.entries(DOMAINS)) {
      const skillAccuracy = {};
      for (const skill of domain.skills) {
        const skillChallenges = studentProgress.challenges.filter(
          c => c.domain === domainId && c.skill === skill
        );
        if (skillChallenges.length > 0) {
          const correct = skillChallenges.filter(c => c.correct).length;
          skillAccuracy[skill] = Math.round((correct / skillChallenges.length) * 100);
        }
      }

      const gaps = Object.entries(skillAccuracy)
        .filter(([_, acc]) => acc < 50)
        .map(([skill, acc]) => ({ domain: domain.name, skill, accuracy: acc }));

      if (gaps.length > 0) {
        report.recommendations.push(...gaps.map(g =>
          `Melhorar "${g.skill}" em ${g.domain} (acerto: ${g.accuracy}%)`
        ));
      }
    }

    return report;
  }

  generateClassReport(studentsProgress) {
    const report = {
      generatedAt: new Date().toISOString(),
      totalStudents: studentsProgress.length,
      activeStudents: studentsProgress.filter(s => s.challenges.length > 0).length,
      globalStats: {
        totalChallenges: studentsProgress.reduce((s, p) => s + p.challenges.length, 0),
        totalPoints: studentsProgress.reduce((s, p) => s + p.totalPoints, 0),
        averagePoints: 0,
        averageAccuracy: 0,
        topDomain: null,
        mostDifficultDomain: null
      },
      domainStats: {},
      difficultyDistribution: {},
      topStudents: [],
      strugglingStudents: [],
      trends: {}
    };

    const studentCount = studentsProgress.length || 1;

    report.globalStats.averagePoints = Math.round(report.globalStats.totalPoints / studentCount);
    report.globalStats.averageAccuracy = Math.round(
      studentsProgress.reduce((s, p) => {
        return s + (p.challenges.length > 0 
          ? (p.correctAnswers / p.challenges.length) * 100 
          : 0);
      }, 0) / studentCount
    );

    // Domain stats
    for (const domainId of Object.keys(DOMAINS)) {
      const domainChallenges = studentsProgress.flatMap(p => 
        p.challenges.filter(c => c.domain === domainId)
      );

      if (domainChallenges.length > 0) {
        const correct = domainChallenges.filter(c => c.correct).length;
        report.domainStats[domainId] = {
          total: domainChallenges.length,
          correct,
          accuracy: Math.round((correct / domainChallenges.length) * 100),
          students: new Set(domainChallenges.map(c => c.studentId)).size
        };
      }
    }

    // Top and struggling students
    const sortedStudents = [...studentsProgress].sort((a, b) => b.totalPoints - a.totalPoints);
    report.topStudents = sortedStudents.slice(0, 10).map((s, i) => ({
      rank: i + 1,
      studentId: s.studentId,
      points: s.totalPoints,
      challenges: s.challenges.length,
      accuracy: s.challenges.length > 0 
        ? Math.round((s.correctAnswers / s.challenges.length) * 100) 
        : 0
    }));

    report.strugglingStudents = studentsProgress
      .filter(s => s.challenges.length > 0 && (s.correctAnswers / s.challenges.length) < 0.4)
      .map(s => ({
        studentId: s.studentId,
        accuracy: Math.round((s.correctAnswers / s.challenges.length) * 100),
        challengesCompleted: s.challenges.length,
        recommendedFocus: this._identifyWeakDomains(s)
      }));

    return report;
  }

  _identifyWeakDomains(studentProgress) {
    const weak = [];
    for (const [domainId, domain] of Object.entries(DOMAINS)) {
      const domainChallenges = studentProgress.challenges.filter(c => c.domain === domainId);
      if (domainChallenges.length > 0) {
        const correct = domainChallenges.filter(c => c.correct).length;
        if ((correct / domainChallenges.length) < 0.4) {
          weak.push(domain.name);
        }
      }
    }
    return weak;
  }

  generateLearningPath(studentProgress, adaptiveModel) {
    const path = {
      studentId: studentProgress.studentId,
      generatedAt: new Date().toISOString(),
      currentLevel: studentProgress.level,
      estimatedCompletionDays: 0,
      stages: [],
      milestones: [],
      estimatedXPPerDay: 0
    };

    const weeksToComplete = 12; // 3 months
    const totalStages = 6;

    for (let stage = 1; stage <= totalStages; stage++) {
      const weekStart = ((stage - 1) * weeksToComplete) / totalStages;
      const weekEnd = (stage * weeksToComplete) / totalStages;

      const stageDomains = this._getStageDomains(stage);
      const stageSkills = [];
      const estimatedXP = stage * 500;

      stageDomains.forEach(domainId => {
        const domain = DOMAINS[domainId];
        const mastery = adaptiveModel?.getModel(studentProgress.studentId)?.domainMastery[domainId] || 0;
        stageSkills.push({
          domain: domain.name,
          icon: domain.icon,
          skills: domain.skills.slice(0, Math.ceil(domain.skills.length / totalStages) * stage),
          currentMastery: Math.round(mastery * 100)
        });
      });

      path.stages.push({
        stage,
        title: `Estágio ${stage}: ${this._getStageTitle(stage)}`,
        weekStart: Math.round(weekStart),
        weekEnd: Math.round(weekEnd),
        skills: stageSkills,
        estimatedXP,
        challengesToComplete: stage * 15
      });

      path.milestones.push({
        stage,
        description: `Completar ${stage * 15} desafios e acumular ${estimatedXP} XP`,
        reward: CONFIG.dailyChallengeBonus * stage
      });
    }

    path.estimatedCompletionDays = weeksToComplete * 7;
    path.estimatedXPPerDay = Math.round(
      path.stages.reduce((s, st) => s + st.estimatedXP, 0) / path.estimatedCompletionDays
    );

    return path;
  }

  _getStageDomains(stage) {
    const domainKeys = Object.keys(DOMAINS);
    const stageSize = Math.ceil(domainKeys.length / 6);
    return domainKeys.slice(0, Math.min(stage * stageSize, domainKeys.length));
  }

  _getStageTitle(stage) {
    const titles = [
      'Fundamentos de Dados',
      'Manipulação e Análise',
      'Visualização e Comunicação',
      'SQL e Bancos de Dados',
      'Machine Learning',
      'Projeto Integrador'
    ];
    return titles[stage - 1] || `Avançado ${stage}`;
  }
}

// ============================================================
// MÓDULO 6: EXPORTAÇÃO E PERSISTÊNCIA
// ============================================================

class ExportManager {
  constructor(engine) {
    this.engine = engine;
  }

  exportChallenge(challenge, format = 'json') {
    switch (format) {
      case 'json':
        return JSON.stringify(challenge, null, 2);
      
      case 'html':
        return this._toHTML(challenge);
      
      case 'csv':
        return this._toCSV([challenge]);
      
      case 'pdf':
        return this._toPrintable(challenge);
      
      default:
        throw new Error(`Formato não suportado: ${format}`);
    }
  }

  exportStudentReport(studentId, format = 'json') {
    const report = this.engine.getStudentReport(studentId);
    if (!report) throw new Error('Estudante não encontrado');

    switch (format) {
      case 'json':
        return JSON.stringify(report, null, 2);
      
      case 'html':
        return this._reportToHTML(report);
      
      case 'csv':
        return this._reportToCSV(report);
      
      default:
        return JSON.stringify(report, null, 2);
    }
  }

  _toHTML(challenge) {
    return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>Desafio: ${challenge.domainName}</title>
  <style>
    body { font-family: 'Segoe UI', sans-serif; max-width: 800px; margin: 2rem auto; padding: 0 1rem; }
    .header { background: ${DOMAINS[challenge.domain]?.color || '#333'}; color: white; padding: 1.5rem; border-radius: 8px; }
    .badge { display: inline-block; background: ${DIFFICULTIES[challenge.difficulty]?.color}; color: white; padding: 0.25rem 0.75rem; border-radius: 12px; font-size: 0.85rem; }
    .question { margin: 1.5rem 0; padding: 1rem; background: #f5f5f5; border-left: 4px solid ${DOMAINS[challenge.domain]?.color}; border-radius: 4px; }
    .hint { background: #fff8e1; padding: 1rem; border-radius: 4px; border: 1px solid #ffe082; }
    .meta { display: flex; gap: 1rem; flex-wrap: wrap; margin: 1rem 0; }
    .meta-item { background: #e3f2fd; padding: 0.5rem 1rem; border-radius: 4px; font-size: 0.9rem; }
    @media print { body { margin: 0; } .header { border-radius: 0; } }
  </style>
</head>
<body>
  <div class="header">
    <h1>${challenge.domainName}</h1>
    <span class="badge">${challenge.difficultyInfo.label}</span>
    <span style="margin-left: 1rem;">🏆 ${challenge.points} pts</span>
  </div>
  <div class="meta">
    <div class="meta-item">📚 ${challenge.topic || 'Geral'}</div>
    <div class="meta-item">⏱️ ${challenge.difficultyInfo.timeMinutes} min</div>
  </div>
  <div class="question">
    <h3>Questão</h3>
    <p>${challenge.question.replace(/\n/g, '<br>')}</p>
  </div>
  <div class="hint">
    <strong>💡 Dica:</strong> ${challenge.hint}
  </div>
</body>
</html>`;
  }

  _toCSV(challenges) {
    const headers = ['id', 'domain', 'difficulty', 'points', 'question', 'hint', 'topic', 'createdAt'];
    const rows = challenges.map(c => [
      c.id,
      c.domain,
      c.difficulty,
      c.points,
      `"${c.question.replace(/"/g, '""')}"`,
      `"${c.hint.replace(/"/g, '""')}"`,
      c.topic || '',
      c.createdAt?.toISOString() || ''
    ]);

    return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  }

  _toPrintable(challenge) {
    return `=== DESAFIO: ${challenge.domainName} ===
Dificuldade: ${challenge.difficultyInfo.label}
Pontos: ${challenge.points}
Tópico: ${challenge.topic || 'Geral'}
Tempo Estimado: ${challenge.difficultyInfo.timeMinutes} min

QUESTÃO:
${challenge.question}

DICA:
${challenge.hint}

--- Gerado em: ${new Date().toLocaleString('pt-BR')} ---`;
  }

  _reportToHTML(report) {
    const domainRows = Object.entries(report.domainPerformance || {})
      .map(([id, data]) => `
        <tr>
          <td>${data.icon} ${data.name}</td>
          <td>${data.total}</td>
          <td>${data.accuracy}%</td>
          <td><strong>${data.elo || 1000}</strong></td>
          <td><div class="progress-bar"><div class="progress-fill" style="width:${data.accuracy}%"></div></div></td>
        </tr>`).join('');

    return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>Relatório de ${report.studentId}</title>
  <style>
    body { font-family: 'Segoe UI', sans-serif; max-width: 1000px; margin: 2rem auto; padding: 0 1rem; }
    h1 { color: #1565C0; }
    .card { background: white; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); padding: 1.5rem; margin: 1rem 0; }
    .stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 1rem; margin: 1rem 0; }
    .stat-item { text-align: center; padding: 1rem; background: #f5f5f5; border-radius: 8px; }
    .stat-value { font-size: 2rem; font-weight: bold; color: #1565C0; }
    .stat-label { font-size: 0.85rem; color: #666; }
    table { width: 100%; border-collapse: collapse; }
    th, td { padding: 0.75rem; text-align: left; border-bottom: 1px solid #e0e0e0; }
    th { background: #1565C0; color: white; }
    .progress-bar { height: 20px; background: #e0e0e0; border-radius: 10px; overflow: hidden; }
    .progress-fill { height: 100%; background: #4CAF50; transition: width 0.3s; }
    .recommendations { background: #fff3e0; padding: 1rem; border-radius: 8px; border-left: 4px solid #FF9800; }
    @media print { .card { box-shadow: none; border: 1px solid #ddd; } }
  </style>
</head>
<body>
  <h1>📊 Relatório de Desempenho</h1>
  <p>Estudante: <strong>${report.studentId}</strong> | Gerado em: ${report.generatedAt}</p>
  
  <div class="card">
    <h2>Resumo</h2>
    <div class="stats">
      <div class="stat-item"><div class="stat-value">${report.summary?.totalChallenges || 0}</div><div class="stat-label">Desafios</div></div>
      <div class="stat-item"><div class="stat-value">${report.summary?.totalPoints || 0}</div><div class="stat-label">Pontos</div></div>
      <div class="stat-item"><div class="stat-value">${report.summary?.accuracy || 0}%</div><div class="stat-label">Precisão</div></div>
      <div class="stat-item"><div class="stat-value">${report.summary?.currentStreak || 0}</div><div class="stat-label">Sequência</div></div>
      <div class="stat-item"><div class="stat-value">${report.summary?.globalElo || 1000}</div><div class="stat-label">Global Elo</div></div>
    </div>
  </div>
  
  <div class="card">
    <h2>Desempenho por Domínio</h2>
    <table>
      <tr><th>Domínio</th><th>Total</th><th>Precisão</th><th>Rating Elo</th><th>Progresso</th></tr>
      ${domainRows}
    </table>
  </div>
  
  ${report.weakPoints?.length > 0 ? `
  <div class="card">
    <h2>⚠️ Pontos Fracos</h2>
    <ul>${report.weakPoints.map(p => `<li>${p}</li>`).join('')}</ul>
  </div>` : ''}
  
  ${report.recommendations?.length > 0 ? `
  <div class="card recommendations">
    <h2>💡 Recomendações</h2>
    <ol>${report.recommendations.map(r => `<li>${r}</li>`).join('')}</ol>
  </div>` : ''}
</body>
</html>`;
  }

  _reportToCSV(report) {
    const lines = [];
    lines.push('Métrica,Valor');
    lines.push(`Estudante,${report.studentId}`);
    lines.push(`Total Desafios,${report.summary.totalChallenges}`);
    lines.push(`Total Pontos,${report.summary.totalPoints}`);
    lines.push(`Precisão,${report.summary.accuracy}%`);
    lines.push(`Nível,${report.summary.level}`);
    lines.push('');
    lines.push('Domínio,Total,Corretas,Precisão');
    
    for (const [id, data] of Object.entries(report.domainPerformance || {})) {
      lines.push(`${data.name},${data.total},${data.correct},${data.accuracy}%`);
    }

    return lines.join('\n');
  }
}

// ============================================================
// MÓDULO 7: MOTOR PRINCIPAL — ULTIMATE ENGINE
// ============================================================

class UltimateChallengeEngine {
  constructor(options = {}) {
    this.config = { ...CONFIG, ...options };
    this.templateEngine = new TemplateEngine();
    this.adaptiveEngine = new AdaptiveEngine();
    this.gamification = new GamificationSystem();
    this.analytics = new AnalyticsEngine();
    this.exportManager = new ExportManager(this);
    
    this.students = new Map();
    this.groups = new Map();
    this.challengeHistory = [];
    this.dailyChallenges = new Map();
    this.eventBus = new EventEmitter();
    
    this._init();
  }

  _init() {
    // Carrega dados mockados para demonstração
    this._loadDemoData();
  }

  _loadDemoData() {
    const demoStudents = ['aluno_demo', 'professor_demo', 'admin_demo'];
    demoStudents.forEach(id => {
      this.registerStudent(id, `Demo ${id}`);
    });
  }

  // ==================== GESTÃO DE ESTUDANTES ====================

  registerStudent(studentId, name, metadata = {}) {
    if (this.students.has(studentId)) {
      throw new Error(`Estudante ${studentId} já cadastrado`);
    }

    const student = {
      studentId,
      name,
      metadata,
      registeredAt: new Date(),
      challenges: [],
      totalPoints: 0,
      totalXP: 0,
      correctAnswers: 0,
      currentStreak: 0,
      maxStreak: 0,
      perfectStreak: 0,
      level: 1,
      domainsCompleted: {},
      difficultyCompleted: {},
      skillsMastered: {},
      equipment: [],
      unlockedAchievements: [],
      unlockedBadges: [],
      nightChallenges: 0,
      earlyChallenges: 0,
      fastSolutions: 0,
      mentoredCount: 0,
      lastActivity: null,
      globalElo: 1000,
      domainElo: {},
      settings: {
        notifications: true,
        weeklyReport: true,
        language: 'pt-BR'
      }
    };

    this.students.set(studentId, student);
    this.analytics.trackEvent('student_registered', { studentId });
    
    return student;
  }

  buyEquipment(studentId, equipmentId) {
    const student = this.students.get(studentId);
    if (!student) throw new Error(`Estudante ${studentId} não encontrado`);

    const equip = this.gamification.equipment.find(e => e.id === equipmentId);
    if (!equip) throw new Error(`Equipamento ${equipmentId} não existe`);

    if (student.equipment.some(e => e.id === equipmentId)) {
      throw new Error(`Estudante já possui o equipamento ${equip.name}`);
    }

    if (equip.unlock === 'points') {
      if (student.totalPoints < equip.cost) {
        throw new Error(`Pontos insuficientes para comprar ${equip.name}. Custo: ${equip.cost}, Possui: ${student.totalPoints}`);
      }
      student.totalPoints -= equip.cost;
      student.equipment.push(equip);
    } else if (equip.unlock === 'achievement') {
      const achievementMap = {
        'super_computer': 'solver',
        'mentor_cape': 'mentor',
        'crystal_ball': 'perfectionist'
      };
      const requiredAchievement = achievementMap[equipmentId];
      if (requiredAchievement && !student.unlockedAchievements.includes(requiredAchievement)) {
        throw new Error(`Equipamento bloqueado! Requer a conquista: ${requiredAchievement}`);
      }
      student.equipment.push(equip);
    } else {
      throw new Error(`Este equipamento não pode ser comprado diretamente.`);
    }

    this.analytics.trackEvent('equipment_purchased', { studentId, equipmentId });
    return student;
  }

  // ==================== GERAÇÃO DE DESAFIOS ====================

  generateChallenge(domainId = null, difficulty = null, studentId = null) {
    // Seleciona domínio
    const domains = Object.keys(DOMAINS);
    const selectedDomain = domainId || domains[Math.floor(Math.random() * domains.length)];

    if (!DOMAINS[selectedDomain]) {
      throw new Error(`Domínio inválido: ${selectedDomain}`);
    }

    // Seleciona dificuldade (adaptativa ou fixa)
    let selectedDifficulty = difficulty;
    if (!selectedDifficulty && studentId) {
      selectedDifficulty = this.adaptiveEngine.getAdaptiveDifficulty(studentId, selectedDomain);
    }
    if (!selectedDifficulty) {
      selectedDifficulty = this._selectDifficulty();
    }

    // Busca template
    const template = this.templateEngine.getRandomTemplate(selectedDomain, selectedDifficulty);
    if (!template) {
      throw new Error(`Nenhum template para ${selectedDomain}/${selectedDifficulty}`);
    }

    // Gera contexto e questão
    const context = template.generateContext();
    const difficultyData = DIFFICULTIES[selectedDifficulty];

    const challenge = {
      id: `ch_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      domain: selectedDomain,
      domainName: DOMAINS[selectedDomain].name,
      domainIcon: DOMAINS[selectedDomain].icon,
      difficulty: selectedDifficulty,
      difficultyInfo: { ...difficultyData },
      topic: template.topic || 'Geral',
      skill: template.skill || 'geral',
      question: template.instructions || `Desafio de ${DOMAINS[selectedDomain].name}`,
      context: { ...context },
      hint: template.hint || 'Pense cuidadosamente sobre os conceitos envolvidos.',
      format: template.format || 'texto',
      timeLimit: difficultyData.timeMin * 60,
      points: difficultyData.points,
      xpMultiplier: difficultyData.multiplier,
      compoundTopics: template.compoundTopics || null,
      testCases: template.testCases || null,
      codeLanguage: template.language || null,
      options: template.options || null,
      fields: template.fields || null,
      createdAt: new Date(),
      issuedTo: studentId || null,
      status: 'pending'
    };

    // Salva referência para validação
    challenge._validateFn = template.validate;
    challenge._context = context;

    // Registra evento
    this.analytics.trackEvent('challenge_generated', {
      domain: selectedDomain,
      difficulty: selectedDifficulty,
      studentId: studentId || 'anonymous'
    });

    return challenge;
  }

  generateChallengeSet(config = {}) {
    const {
      count = CONFIG.defaultChallengeSetSize,
      domains = null,
      studentId = null,
      difficulty = null,
      mixedDifficulty = true,
      includeHint = true
    } = config;

    const availableDomains = domains || Object.keys(DOMAINS);
    const challenges = [];

    // Distribui desafios entre domínios
    for (let i = 0; i < count; i++) {
      const domain = availableDomains[i % availableDomains.length];
      const diff = mixedDifficulty ? null : difficulty;
      const challenge = this.generateChallenge(domain, diff, studentId);
      
      if (!includeHint) {
        delete challenge.hint;
      }

      challenges.push(challenge);
    }

    return {
      id: `set_${Date.now()}`,
      count,
      challenges,
      generatedAt: new Date(),
      studentId,
      estimatedTime: challenges.reduce((s, c) => s + c.difficultyInfo.timeMin, 0),
      totalPoints: challenges.reduce((s, c) => s + c.points, 0)
    };
  }

  generateDailyChallenge(studentId) {
    const today = new Date().toISOString().split('T')[0];

    // Verifica se já existe desafio diário para hoje
    if (this.dailyChallenges.has(`${studentId}_${today}`)) {
      return this.dailyChallenges.get(`${studentId}_${today}`);
    }

    const domains = Object.keys(DOMAINS);
    const challenges = [];

    // 1 desafio de cada domínio
    for (const domain of domains) {
      // Dificuldade progressiva
      const diff = this.adaptiveEngine.getAdaptiveDifficulty(studentId, domain);
      const challenge = this.generateChallenge(domain, diff, studentId);
      challenge.dailyBonus = true;
      challenges.push(challenge);
    }

    const daily = {
      id: `daily_${studentId}_${today}`,
      date: today,
      studentId,
      title: '🎯 Desafio Diário Completo',
      description: 'Complete todos os desafios para ganhar bônus!',
      challenges,
      bonusXP: CONFIG.dailyChallengeBonus,
      completedCount: 0,
      totalCount: domains.length,
      status: 'active',
      expiresAt: new Date(new Date().setHours(23, 59, 59, 999)),
      rewards: {
        xp: CONFIG.dailyChallengeBonus,
        coins: Math.floor(CONFIG.dailyChallengeBonus / 2),
        bonusItem: null
      }
    };

    // Bônus extra se completar todos
    if (daily.completedCount === daily.totalCount) {
      daily.rewards.bonusItem = 'daily_chest';
      daily.rewards.xp *= 2;
    }

    this.dailyChallenges.set(`${studentId}_${today}`, daily);
    this.analytics.trackEvent('daily_challenge_generated', { studentId, date: today });

    return daily;
  }

  // ==================== VALIDAÇÃO E SUBMISSÃO ====================

  submitChallenge(studentId, challenge, answer, metadata = {}) {
    const student = this.students.get(studentId);
    if (!student) {
      throw new Error(`Estudante ${studentId} não encontrado`);
    }

    const timeSpent = metadata.timeSpent || 0;
    const startTime = metadata.startTime ? new Date(metadata.startTime) : new Date();

    // Valida resposta
    const result = {
      correct: false,
      expected: null,
      details: null,
      timeSpent,
      pointsEarned: 0,
      xpEarned: 0,
      isFirstDaily: metadata.isFirstDaily || false
    };

    try {
      if (challenge._validateFn) {
        result.correct = challenge._validateFn(answer, challenge._context);
      } else {
        // Validação fallback
        result.correct = answer && answer.trim().length > 0;
      }
    } catch (e) {
      console.error('Erro na validação:', e);
      result.correct = false;
      result.details = 'Erro interno na validação';
    }

    // Atualiza estado do estudante
    student.challenges.push({
      challengeId: challenge.id,
      domain: challenge.domain,
      difficulty: challenge.difficulty,
      skill: challenge.skill,
      correct: result.correct,
      points: challenge.points,
      timeSpent,
      answeredAt: new Date(),
      answer
    });

    if (result.correct) {
      student.correctAnswers++;
      student.currentStreak++;
      student.maxStreak = Math.max(student.maxStreak, student.currentStreak);
      
      if (student.currentStreak >= 10) {
        student.perfectStreak = Math.max(student.perfectStreak, student.currentStreak);
      }

      // Atualiza contadores de domínio
      student.domainsCompleted[challenge.domain] = (student.domainsCompleted[challenge.domain] || 0) + 1;
      student.difficultyCompleted[challenge.difficulty] = (student.difficultyCompleted[challenge.difficulty] || 0) + 1;

      // Calcula XP
      const xpResult = this.gamification.calculateXP(challenge, result, student);
      result.xpEarned = xpResult;
      result.pointsEarned = challenge.points;

      student.totalPoints += challenge.points;
      student.totalXP += xpResult;

      // Stats especiais
      const hour = new Date().getHours();
      if (hour >= 0 && hour < 5) student.nightChallenges++;
      if (hour >= 5 && hour < 8) student.earlyChallenges++;
      if (timeSpent < 60) student.fastSolutions++;

    } else {
      student.currentStreak = 0;
    }

    // Atualiza nível
    const levelInfo = this.gamification.calculateLevel(student.totalXP);
    student.level = levelInfo.level;

    // Sistema adaptativo
    this.adaptiveEngine.updateModel(studentId, challenge.domain, result, challenge, student);

    // Verifica novas conquistas
    const newAchievements = this.gamification.checkNewAchievements(student);
    newAchievements.forEach(ach => {
      student.unlockedAchievements.push(ach.id);
      student.totalXP += ach.xp;
      result.xpEarned += ach.xp;
      result.newAchievements = result.newAchievements || [];
      result.newAchievements.push(ach);
    });

    student.lastActivity = new Date();
    
    // Atualiza daily challenge
    this._updateDailyProgress(studentId, challenge);

    // Registra analytics
    this.analytics.trackEvent('challenge_submitted', {
      studentId,
      challengeId: challenge.id,
      correct: result.correct,
      timeSpent,
      difficulty: challenge.difficulty,
      domain: challenge.domain
    });

    // Emite eventos
    this.eventBus.emit('challenge:completed', { studentId, challenge, result });
    if (newAchievements.length > 0) {
      this.eventBus.emit('achievement:unlocked', { studentId, achievements: newAchievements });
    }

    return {
      ...result,
      studentLevel: student.level,
      currentStreak: student.currentStreak,
      totalPoints: student.totalPoints,
      totalXP: student.totalXP
    };
  }

  _updateDailyProgress(studentId, challenge) {
    const today = new Date().toISOString().split('T')[0];
    const dailyKey = `${studentId}_${today}`;
    const daily = this.dailyChallenges.get(dailyKey);
    
    if (daily) {
      const idx = daily.challenges.findIndex(c => c.id === challenge.id);
      if (idx !== -1) {
        daily.challenges[idx].completed = true;
        daily.completedCount = daily.challenges.filter(c => c.completed).length;
        
        if (daily.completedCount === daily.totalCount) {
          daily.status = 'completed';
          daily.rewards.bonusItem = 'daily_chest';
        }
      }
    }
  }

  // ==================== RELATÓRIOS E CONSULTAS ====================

  getStudentReport(studentId) {
    const student = this.students.get(studentId);
    if (!student) return null;

    const levelProgress = this.gamification.getLevelProgress(student.totalXP);
    
    const report = this.analytics.generateStudentReport(student);
    return {
      ...report,
      level: levelProgress,
      achievements: student.unlockedAchievements.map(id => 
        this.gamification.achievements.find(a => a.id === id)
      ).filter(Boolean),
      equipment: student.equipment,
      recommendations: this.adaptiveEngine.getRecommendedTopics(studentId)
    };
  }

  getStudentKnowledgeMap(studentId) {
    return this.adaptiveEngine.getKnowledgeMap(studentId);
  }

  getLearningPath(studentId) {
    const student = this.students.get(studentId);
    if (!student) return null;

    return this.analytics.generateLearningPath(student, this.adaptiveEngine);
  }

  // ==================== GESTÃO DE GRUPOS/TURMAS ====================

  createGroup(groupId, name, config = {}) {
    if (this.groups.has(groupId)) {
      throw new Error(`Grupo ${groupId} já existe`);
    }

    const group = {
      groupId,
      name,
      config,
      members: [],
      createdAt: new Date(),
      challenges: [],
      leaderboard: []
    };

    this.groups.set(groupId, group);
    return group;
  }

  addStudentToGroup(studentId, groupId) {
    const group = this.groups.get(groupId);
    if (!group) throw new Error(`Grupo ${groupId} não encontrado`);
    if (!this.students.has(studentId)) throw new Error(`Estudante ${studentId} não encontrado`);

    if (!group.members.includes(studentId)) {
      group.members.push(studentId);
      this.analytics.trackEvent('student_added_to_group', { studentId, groupId });
    }

    return group;
  }

  getGroupReport(groupId) {
    const group = this.groups.get(groupId);
    if (!group) return null;

    const membersProgress = group.members
      .map(id => this.students.get(id))
      .filter(Boolean);

    return this.analytics.generateClassReport(membersProgress);
  }

  getGroupLeaderboard(groupId, limit = 10) {
    const group = this.groups.get(groupId);
    if (!group) return [];

    const members = group.members
      .map(id => this.students.get(id))
      .filter(Boolean)
      .map(s => ({
        studentId: s.studentId,
        name: s.name,
        points: s.totalPoints,
        xp: s.totalXP,
        level: s.level,
        achievements: s.unlockedAchievements.length,
        accuracy: s.challenges.length > 0 
          ? Math.round((s.correctAnswers / s.challenges.length) * 100) 
          : 0,
        challengesCompleted: s.challenges.length
      }))
      .sort((a, b) => b.points - a.points)
      .slice(0, limit)
      .map((s, i) => ({ rank: i + 1, ...s }));

    group.leaderboard = members;
    return members;
  }

  // ==================== ESTATÍSTICAS GLOBAIS ====================

  getGlobalStatistics() {
    const stats = {
      totalStudents: this.students.size,
      totalChallenges: this.challengeHistory.length,
      totalPoints: 0,
      totalXP: 0,
      averageAccuracy: 0,
      activeToday: 0,
      domainStats: {},
      difficultyStats: {},
      topStudents: [],
      studentGrowth: []
    };

    let totalCorrect = 0;
    let totalAnswered = 0;

    for (const student of this.students.values()) {
      stats.totalPoints += student.totalPoints;
      stats.totalXP += student.totalXP;
      
      if (student.lastActivity && (Date.now() - student.lastActivity.getTime()) < 86400000) {
        stats.activeToday++;
      }

      totalCorrect += student.correctAnswers;
      totalAnswered += student.challenges.length;
    }

    stats.averageAccuracy = totalAnswered > 0 
      ? Math.round((totalCorrect / totalAnswered) * 100) 
      : 0;

    // Stats por domínio
    for (const [domainId, domain] of Object.entries(DOMAINS)) {
      const domainChallenges = Array.from(this.students.values())
        .flatMap(s => s.challenges.filter(c => c.domain === domainId));

      stats.domainStats[domainId] = {
        name: domain.name,
        total: domainChallenges.length,
        correct: domainChallenges.filter(c => c.correct).length,
        students: new Set(domainChallenges.map(c => s.studentId)).size
      };
    }

    // Top students
    stats.topStudents = Array.from(this.students.values())
      .sort((a, b) => b.totalPoints - a.totalPoints)
      .slice(0, 10)
      .map((s, i) => ({
        rank: i + 1,
        studentId: s.studentId,
        name: s.name,
        points: s.totalPoints,
        level: s.level
      }));

    return stats;
  }

  // ==================== EXPORTAÇÃO ====================

  exportStudentData(studentId, format = 'json') {
    return this.exportManager.exportStudentReport(studentId, format);
  }

  exportChallenge(challenge, format = 'json') {
    return this.exportManager.exportChallenge(challenge, format);
  }

  // ==================== UTILITÁRIOS ====================

  _selectDifficulty() {
    const levels = Object.keys(DIFFICULTIES);
    const weights = [0.3, 0.25, 0.2, 0.15, 0.07, 0.03]; // Distribuição inclinada para iniciante
    const rand = Math.random();
    let cumulative = 0;
    
    for (let i = 0; i < levels.length; i++) {
      cumulative += weights[i] || 0.05;
      if (rand <= cumulative) return levels[i];
    }
    
    return 'beginner';
  }

  getEventBus() {
    return this.eventBus;
  }

  resetStudent(studentId) {
    this.students.delete(studentId);
    this.adaptiveEngine.studentModels.delete(studentId);
  }

  createDemoEnvironment() {
    // Cria dados de demonstração para apresentação
    const demoData = {
      students: [],
      challenges: [],
      achievements: this.gamification.achievements.map(a => ({ ...a })),
      levels: this.gamification.levels,
      domains: Object.values(DOMAINS).map(d => ({ id: d.id, name: d.name, icon: d.icon })),
      difficulties: Object.entries(DIFFICULTIES).map(([key, val]) => ({ key, ...val }))
    };

    // Cria alunos demo
    for (let i = 1; i <= 5; i++) {
      const studentId = `demo_student_${i}`;
      const student = this.registerStudent(studentId, `Aluno Demo ${i}`);
      
      // Simula algumas atividades
      for (let j = 0; j < 10; j++) {
        const domain = Object.keys(DOMAINS)[j % 6];
        const challenge = this.generateChallenge(domain, 'beginner', studentId);
        this.submitChallenge(studentId, challenge, Math.random() > 0.3 ? 'resposta correta' : 'resposta errada');
      }
      
      demoData.students.push({
        studentId,
        name: student.name,
        points: student.totalPoints,
        level: student.level
      });
    }

    // Gera alguns desafios de exemplo
    for (const [domainId, domain] of Object.entries(DOMAINS)) {
      const challenge = this.generateChallenge(domainId, 'intermediate');
      demoData.challenges.push({
        domain: domain.name,
        difficulty: challenge.difficultyInfo.label,
        question: challenge.question.substring(0, 100) + '...',
        points: challenge.points
      });
    }

    return demoData;
  }
}

// ============================================================
// MÓDULO 8: EVENT EMITTER
// ============================================================

class EventEmitter {
  constructor() {
    this.events = {};
  }

  on(event, listener) {
    if (!this.events[event]) this.events[event] = [];
    this.events[event].push(listener);
    return () => this.off(event, listener);
  }

  off(event, listener) {
    if (!this.events[event]) return;
    this.events[event] = this.events[event].filter(l => l !== listener);
  }

  emit(event, data) {
    if (!this.events[event]) return;
    this.events[event].forEach(listener => {
      try {
        listener(data);
      } catch (e) {
        console.error(`Erro no listener do evento ${event}:`, e);
      }
    });
  }

  once(event, listener) {
    const wrapper = (data) => {
      listener(data);
      this.off(event, wrapper);
    };
    this.on(event, wrapper);
  }
}

// ============================================================
// MÓDULO 9: API DE INTEGRAÇÃO
// ============================================================

class ChallengeAPI {
  constructor(engine) {
    this.engine = engine;
  }

  // Endpoints REST-like
  get endpoints() {
    return {
      'GET /challenge': (params) => this.engine.generateChallenge(params.domain, params.difficulty),
      'GET /challenge/set': (params) => this.engine.generateChallengeSet(params),
      'POST /challenge/submit': (body) => this.engine.submitChallenge(body.studentId, body.challenge, body.answer),
      'GET /student/:id': (params) => this.engine.getStudentReport(params.id),
      'GET /student/:id/knowledge': (params) => this.engine.getStudentKnowledgeMap(params.id),
      'GET /student/:id/path': (params) => this.engine.getLearningPath(params.id),
      'GET /daily/:studentId': (params) => this.engine.generateDailyChallenge(params.studentId),
      'POST /group/create': (body) => this.engine.createGroup(body.groupId, body.name),
      'POST /group/add': (body) => this.engine.addStudentToGroup(body.studentId, body.groupId),
      'GET /group/:id/report': (params) => this.engine.getGroupReport(params.id),
      'GET /group/:id/leaderboard': (params) => this.engine.getGroupLeaderboard(params.id),
      'GET /stats': () => this.engine.getGlobalStatistics(),
      'GET /export/student/:id': (params) => this.engine.exportStudentData(params.id, params.format),
      'GET /export/challenge': (params) => this.engine.exportChallenge(params.challenge, params.format),
      'GET /demo': () => this.engine.createDemoEnvironment(),
      'POST /shop/buy': (body) => this.engine.buyEquipment(body.studentId, body.equipmentId)
    };
  }

  handleRequest(method, path, params = {}) {
    const key = `${method} ${path}`;
    const handler = this.endpoints[key];
    
    if (!handler) {
      // Tenta matching com parâmetros na URL
      for (const [route, routeHandler] of Object.entries(this.endpoints)) {
        const regex = this._routeToRegex(route);
        const match = path.match(regex);
        if (match && route.startsWith(method)) {
          const extractedParams = { ...params, ...match.groups };
          return routeHandler(extractedParams);
        }
      }
      
      throw new Error(`Endpoint não encontrado: ${method} ${path}`);
    }

    return handler(params);
  }

  _routeToRegex(route) {
    const parts = route.split('/');
    const regexParts = parts.map(part => {
      if (part.startsWith(':')) {
        return `(?<${part.slice(1)}>[^/]+)`;
      }
      return part;
    });
    return new RegExp(`^${regexParts.join('/')}$`);
  }
}

// ============================================================
// MÓDULO 10: DEMONSTRAÇÃO COMPLETA
// ============================================================

async function runFullDemo() {
  console.log('🚀 DATA SCIENCE CHALLENGE ENGINE — ULTIMATE EDITION\n');
  console.log('='.repeat(60));

  // Inicialização
  const engine = new UltimateChallengeEngine();
  const api = new ChallengeAPI(engine);

  console.log('📚 Domínios disponíveis:');
  Object.values(DOMAINS).forEach(d => {
    console.log(`   ${d.icon} ${d.name} (${d.topics.length} tópicos, ${d.skills.length} skills)`);
  });

  console.log(`\n🎯 Dificuldades: ${Object.keys(DIFFICULTIES).length} níveis`);
  console.log(`🏆 Conquistas: ${engine.gamification.achievements.length} disponíveis`);
  console.log(`📈 Níveis máximos: ${CONFIG.maxLevel}`);

  // 1. Registrar estudante
  console.log('\n' + '='.repeat(60));
  console.log('📝 REGISTRANDO ESTUDANTE...');
  engine.registerStudent('maria_123', 'Maria Silva', { turma: '3A', escola: 'EE Prof. DataScience' });
  console.log('✅ Estudante registrado: maria_123\n');

  // 2. Gerar desafio específico
  console.log('🎯 GERANDO DESAFIO DE ESTATÍSTICA...');
  const challenge = engine.generateChallenge('statistics', 'intermediate', 'maria_123');
  console.log(`   Domínio: ${challenge.domainIcon} ${challenge.domainName}`);
  console.log(`   Dificuldade: ${challenge.difficultyInfo.label} (${challenge.points} pts)`);
  console.log(`   Tópico: ${challenge.topic}`);
  console.log(`   Questão: ${challenge.question.substring(0, 80)}...`);
  console.log(`   Dica: ${challenge.hint.substring(0, 60)}...\n`);

  // 3. Submeter resposta
  console.log('📤 SUBMETENDO RESPOSTA...');
  const result = engine.submitChallenge('maria_123', challenge, '42.5', {
    timeSpent: 180, // 3 minutos
    startTime: Date.now() - 180000
  });
  console.log(`   Correta: ${result.correct ? '✅' : '❌'}`);
  console.log(`   Pontos ganhos: ${result.pointsEarned}`);
  console.log(`   XP ganhos: ${result.xpEarned}`);
  console.log(`   Streak atual: ${result.currentStreak}`);
  console.log(`   Nível: ${result.studentLevel}`);
  if (result.newAchievements) {
    result.newAchievements.forEach(ach => {
      console.log(`   🏆 Nova conquista: ${ach.icon} ${ach.name}!`);
    });
  }

  // 4. Gerar conjunto de desafios
  console.log('\n📦 GERANDO CONJUNTO DE 3 DESAFIOS...');
  const set = engine.generateChallengeSet({ 
    count: 3, 
    studentId: 'maria_123',
    mixedDifficulty: true 
  });
  set.challenges.forEach((c, i) => {
    console.log(`   #${i + 1} ${c.domainIcon} ${c.domainName} | ${c.difficultyInfo.label} | ${c.points} pts`);
  });

  // 5. Desafio diário
  console.log('\n🌅 GERANDO DESAFIO DIÁRIO...');
  const daily = engine.generateDailyChallenge('maria_123');
  console.log(`   Data: ${daily.date}`);
  console.log(`   Desafios: ${daily.completedCount}/${daily.totalCount}`);
  console.log(`   Bônus: ${daily.bonusXP} XP`);
  console.log(`   Status: ${daily.status}`);

  // 6. Relatório do estudante
  console.log('\n📊 RELATÓRIO DO ESTUDANTE...');
  const report = engine.getStudentReport('maria_123');
  console.log(`   Nível: ${report.level.title} (Level ${report.level.level})`);
  console.log(`   Progresso: ${report.level.progress.toFixed(1)}%`);
  console.log(`   Desafios: ${report.summary.totalChallenges}`);
  console.log(`   Pontos: ${report.summary.totalPoints}`);
  console.log(`   Precisão: ${report.summary.accuracy}%`);
  console.log(`   Sequência: ${report.summary.currentStreak}`);
  
  if (report.strongPoints.length > 0) {
    console.log(`\n   💪 Pontos fortes: ${report.strongPoints.join(', ')}`);
  }
  if (report.weakPoints.length > 0) {
    console.log(`   ⚠️ Pontos fracos: ${report.weakPoints.join(', ')}`);
  }
  if (report.recommendations.length > 0) {
    console.log(`   💡 Recomendações:`);
    report.recommendations.slice(0, 3).forEach(r => console.log(`      → ${r}`));
  }

  // 7. Mapa de conhecimento
  console.log('\n🗺️ MAPA DE CONHECIMENTO...');
  const knowledge = engine.getStudentKnowledgeMap('maria_123');
  Object.entries(knowledge).forEach(([id, data]) => {
    if (id !== 'prerequisites') {
      console.log(`   ${data.icon} ${data.name}: ${data.mastery}% maestria`);
    }
  });

  // 8. Learning Path
  console.log('\n🧭 LEARNING PATH PERSONALIZADO...');
  const path = engine.getLearningPath('maria_123');
  console.log(`   Estimativa: ${path.estimatedCompletionDays} dias`);
  console.log(`   XP/dia estimado: ${path.estimatedXPPerDay}`);
  path.stages.slice(0, 3).forEach(s => {
    console.log(`   Estágio ${s.stage}: ${s.title} (Semana ${s.weekStart}-${s.weekEnd})`);
  });

  // 9. Estatísticas globais
  console.log('\n🌐 ESTATÍSTICAS GLOBAIS...');
  const stats = engine.getGlobalStatistics();
  console.log(`   Total de estudantes: ${stats.totalStudents}`);
  console.log(`   Total de desafios: ${stats.totalChallenges}`);
  console.log(`   Pontos totais: ${stats.totalPoints}`);
  console.log(`   Precisão média: ${stats.averageAccuracy}%`);
  console.log(`   Ativos hoje: ${stats.activeToday}`);

  // 10. Exportação
  console.log('\n💾 EXPORTAÇÃO DE DADOS...');
  const htmlReport = engine.exportStudentData('maria_123', 'html');
  console.log(`   Relatório HTML gerado: ${htmlReport.substring(0, 50)}... (${htmlReport.length} chars)`);
  
  const csvChallenges = engine.exportChallenge(challenge, 'csv');
  console.log(`   Desafio em CSV: ${csvChallenges.substring(0, 50)}...`);

  const htmlChallenge = engine.exportChallenge(challenge, 'html');
  console.log(`   Desafio em HTML: ${htmlChallenge.substring(0, 50)}... (${htmlChallenge.length} chars)`);

  // 11. Ambiente de demonstração
  console.log('\n🎪 AMBIENTE DE DEMONSTRAÇÃO...');
  const demo = engine.createDemoEnvironment();
  console.log(`   Alunos demo: ${demo.students.length}`);
  console.log(`   Desafios demo: ${demo.challenges.length}`);
  console.log(`   Conquistas: ${demo.achievements.length}`);
  console.log(`   Níveis: ${demo.levels.length}`);

  // 12. Eventos
  console.log('\n🔔 SISTEMA DE EVENTOS...');
  const unsubscribe = engine.getEventBus().on('challenge:completed', (data) => {
    console.log(`   Evento recebido: Desafio ${data.challenge.id} completado por ${data.studentId}`);
  });
  
  // Teste de evento
  engine.getEventBus().emit('challenge:completed', { 
    studentId: 'maria_123', 
    challenge: { id: 'test_event' } 
  });
  
  unsubscribe();

  // 13. API endpoints
  console.log('\n🔌 API ENDPOINTS DISPONÍVEIS:');
  Object.keys(api.endpoints).forEach(endpoint => {
    console.log(`   ${endpoint}`);
  });

  // 14. Resumo final
  console.log('\n' + '='.repeat(60));
  console.log('✅ DEMONSTRAÇÃO COMPLETA');
  console.log('='.repeat(60));
  
  return { engine, api };
}

// Executa se for o módulo principal
if (typeof require !== 'undefined' && require.main === module) {
  runFullDemo().catch(console.error);
}

// ============================================================
// EXPORTAÇÕES
// ============================================================

module.exports = {
  UltimateChallengeEngine,
  ChallengeAPI,
  TemplateEngine,
  AdaptiveEngine,
  GamificationSystem,
  AnalyticsEngine,
  ExportManager,
  EventEmitter,
  DOMAINS,
  DIFFICULTIES,
  CONFIG,
  runFullDemo
};
