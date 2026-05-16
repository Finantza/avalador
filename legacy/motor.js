class DataScienceChallengeEngine {
  constructor() {
    this.domains = {
      statistics: {
        name: 'Estatística Descritiva',
        topics: ['Média, Mediana e Moda', 'Desvio Padrão', 'Histogramas', 'Correlação'],
        levelWeights: { easy: 0.4, medium: 0.4, hard: 0.2 }
      },
      python: {
        name: 'Python para Dados',
        topics: ['Pandas', 'NumPy', 'Manipulação de DataFrames', 'Limpeza de Dados'],
        levelWeights: { easy: 0.3, medium: 0.4, hard: 0.3 }
      },
      sql: {
        name: 'SQL para Análise',
        topics: ['SELECT e WHERE', 'GROUP BY e Agregações', 'JOINs', 'Subqueries'],
        levelWeights: { easy: 0.3, medium: 0.4, hard: 0.3 }
      },
      visualization: {
        name: 'Visualização de Dados',
        topics: ['Gráfico de Barras', 'Gráfico de Dispersão', 'Heatmaps', 'Dashboards'],
        levelWeights: { easy: 0.4, medium: 0.4, hard: 0.2 }
      },
      analytics: {
        name: 'Pensamento Analítico',
        topics: ['Identificação de Padrões', 'Análise de Tendências', 'Tomada de Decisão', 'Storytelling com Dados'],
        levelWeights: { easy: 0.3, medium: 0.4, hard: 0.3 }
      }
    };

    this.difficulties = {
      easy: {
        label: 'Iniciante',
        points: 10,
        timeMinutes: 5
      },
      medium: {
        label: 'Intermediário',
        points: 20,
        timeMinutes: 10
      },
      hard: {
        label: 'Avançado',
        points: 35,
        timeMinutes: 20
      }
    };

    this.challengeTemplates = this.buildTemplates();
    this.studentProgress = new Map();
  }

  buildTemplates() {
    return {
      statistics: {
        easy: [
          {
            id: 'stat_e1',
            question: (ctx) => `Calcule a média dos seguintes números: ${ctx.numbers.join(', ')}`,
            validate: (answer, ctx) => {
              const expected = ctx.numbers.reduce((a, b) => a + b, 0) / ctx.numbers.length;
              return Math.abs(parseFloat(answer) - expected) < 0.01;
            },
            hint: 'Some todos os valores e divida pela quantidade de elementos.',
            generateContext: () => ({
              numbers: Array.from({ length: 5 }, () => Math.floor(Math.random() * 100) + 1)
            })
          },
          {
            id: 'stat_e2',
            question: (ctx) => `Dados os números ${ctx.numbers.join(', ')}, qual é a mediana?`,
            validate: (answer, ctx) => {
              const sorted = [...ctx.numbers].sort((a, b) => a - b);
              const mid = Math.floor(sorted.length / 2);
              const expected = sorted.length % 2 !== 0
                ? sorted[mid]
                : (sorted[mid - 1] + sorted[mid]) / 2;
              return Math.abs(parseFloat(answer) - expected) < 0.01;
            },
            hint: 'Organize os números em ordem crescente e encontre o valor central.',
            generateContext: () => ({
              numbers: Array.from({ length: 6 }, () => Math.floor(Math.random() * 50) + 1)
            })
          }
        ],
        medium: [
          {
            id: 'stat_m1',
            question: (ctx) => `Uma loja registrou as seguintes vendas diárias em uma semana: R$ ${ctx.sales.join(', R$ ')}.\nCalcule o desvio padrão aproximado das vendas. (Arredonde para 2 casas decimais)`,
            validate: (answer, ctx) => {
              const mean = ctx.sales.reduce((a, b) => a + b, 0) / ctx.sales.length;
              const variance = ctx.sales.reduce((sum, v) => sum + (v - mean) ** 2, 0) / ctx.sales.length;
              const expected = Math.sqrt(variance);
              return Math.abs(parseFloat(answer) - expected) < 0.1;
            },
            hint: '1) Calcule a média. 2) Subtraia a média de cada valor e eleve ao quadrado. 3) Tire a média desses quadrados. 4) Extraia a raiz quadrada.',
            generateContext: () => ({
              sales: Array.from({ length: 7 }, () => Math.floor(Math.random() * 500) + 100)
            })
          },
          {
            id: 'stat_m2',
            question: (ctx) => `Em uma turma de ${ctx.students} alunos, as notas em Ciência de Dados foram:\n${ctx.grades.join(', ')}\nQual é o coeficiente de variação (CV) das notas? (Responda em percentual, com 1 casa decimal)`,
            validate: (answer, ctx) => {
              const mean = ctx.grades.reduce((a, b) => a + b, 0) / ctx.grades.length;
              const std = Math.sqrt(ctx.grades.reduce((sum, v) => sum + (v - mean) ** 2, 0) / ctx.grades.length);
              const expected = (std / mean) * 100;
              return Math.abs(parseFloat(answer) - expected) < 0.5;
            },
            hint: 'CV = (Desvio Padrão / Média) × 100. Quanto menor o CV, mais homogêneos são os dados.',
            generateContext: () => {
              const count = Math.floor(Math.random() * 10) + 20;
              return {
                students: count,
                grades: Array.from({ length: count }, () => Math.floor(Math.random() * 50) + 50)
              };
            }
          }
        ],
        hard: [
          {
            id: 'stat_h1',
            question: (ctx) => `Um cientista de dados coletou as seguintes idades e salários (em R$ 1000):\nIdades: ${ctx.ages.join(', ')}\nSalários: ${ctx.salaries.join(', ')}\nCalcule o coeficiente de correlação de Pearson (r) entre idade e salário. Arredonde para 3 casas decimais.`,
            validate: (answer, ctx) => {
              const n = ctx.ages.length;
              const sumX = ctx.ages.reduce((a, b) => a + b, 0);
              const sumY = ctx.salaries.reduce((a, b) => a + b, 0);
              const sumXY = ctx.ages.reduce((s, x, i) => s + x * ctx.salaries[i], 0);
              const sumX2 = ctx.ages.reduce((s, x) => s + x * x, 0);
              const sumY2 = ctx.salaries.reduce((s, y) => s + y * y, 0);
              const num = n * sumXY - sumX * sumY;
              const den = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));
              const expected = num / den;
              return Math.abs(parseFloat(answer) - expected) < 0.01;
            },
            hint: 'Use a fórmula: r = (n·∑xy - ∑x·∑y) / √[(n·∑x² - (∑x)²)(n·∑y² - (∑y)²)]. Se r ≈ 0, não há correlação linear.',
            generateContext: () => {
              const ages = [18, 20, 22, 25, 28, 30, 35, 40, 45, 50];
              const baseSalaries = [1.5, 1.8, 2.2, 3.0, 3.8, 4.2, 5.5, 6.0, 6.5, 7.0];
              const salaries = baseSalaries.map(s => Math.round((s + (Math.random() - 0.5) * 1.5) * 10) / 10);
              return { ages, salaries };
            }
          }
        ]
      },
      python: {
        easy: [
          {
            id: 'py_e1',
            question: (ctx) => `Complete o código para criar um DataFrame com os dados:\n\`\`\`python\nimport pandas as pd\n\ndados = {\n    'nome': ${JSON.stringify(ctx.names)},\n    'idade': ${JSON.stringify(ctx.ages)}\n}\n\ndf = pd.DataFrame(____)\nprint(df.head())\n\`\`\`\nO que deve ser colocado no lugar de ____?`,
            validate: (answer) => answer.trim() === 'dados',
            hint: 'A função DataFrame recebe um dicionário como parâmetro.',
            generateContext: () => ({
              names: ['Ana', 'Bruno', 'Carlos', 'Diana', 'Eduardo'],
              ages: [17, 16, 18, 17, 16]
            })
          },
          {
            id: 'py_e2',
            question: (ctx) => `Qual comando pandas exibe as primeiras ${ctx.n} linhas de um DataFrame chamado 'vendas'?`,
            validate: (answer) => {
              const valid = [`vendas.head(${ctx.n})`, `vendas.head(${ctx.n})`, `print(vendas.head(${ctx.n}))`];
              return valid.includes(answer.trim().toLowerCase());
            },
            hint: 'Use o método head() do DataFrame, passando o número de linhas como parâmetro.',
            generateContext: () => ({ n: Math.floor(Math.random() * 5) + 3 })
          }
        ],
        medium: [
          {
            id: 'py_m1',
            question: (ctx) => `Dado o DataFrame:\n\`\`\`python\nimport pandas as pd\n\ndf = pd.DataFrame({\n    'produto': ${JSON.stringify(ctx.products)},\n    'preco': ${JSON.stringify(ctx.prices)},\n    'quantidade': ${JSON.stringify(ctx.quantities)}\n})\n\`\`\`\n\nEscreva o código para criar uma nova coluna 'total' que seja preco × quantidade, e depois filtrar apenas os produtos com total > ${ctx.threshold}.`,
            validate: (answer) => {
              const cleaned = answer.trim().toLowerCase().replace(/\s+/g, ' ');
              return cleaned.includes("df['total']") && 
                     cleaned.includes('preco') && 
                     cleaned.includes('quantidade') &&
                     cleaned.includes(`df[df['total'] > ${ctx.threshold}]`);
            },
            hint: 'Crie a coluna com df["total"] = ... e depois use filtro booleano: df[df["total"] > valor].',
            generateContext: () => ({
              products: ['Notebook', 'Mouse', 'Teclado', 'Monitor', 'Webcam'],
              prices: [3500, 80, 150, 1200, 200],
              quantities: [5, 30, 15, 8, 12],
              threshold: 1000
            })
          },
          {
            id: 'py_m2',
            question: (ctx) => `Usando NumPy, crie um array de ${ctx.n} números aleatórios seguindo uma distribuição normal padrão (média=0, desvio=1) e calcule a média desses valores. Escreva o código completo.`,
            validate: (answer) => {
              const cleaned = answer.trim().toLowerCase();
              return cleaned.includes('np.random.randn') || cleaned.includes('numpy.random.randn') ||
                     cleaned.includes('np.random.normal') || cleaned.includes('numpy.random.normal');
            },
            hint: 'Use np.random.randn(n) para distribuição normal padrão, ou np.random.normal(0, 1, n). Depois use .mean().',
            generateContext: () => ({ n: Math.floor(Math.random() * 1000) + 1000 })
          }
        ],
        hard: [
          {
            id: 'py_h1',
            question: (ctx) => `Você tem um DataFrame com dados de vendas mensais:\n\`\`\`python\nimport pandas as pd\n\nvendas = pd.DataFrame({\n    'mes': ${JSON.stringify(ctx.months)},\n    'valor': ${JSON.stringify(ctx.values)},\n    'categoria': ${JSON.stringify(ctx.categories)}\n})\n\`\`\`\n\nEscreva o código para:\n1. Agrupar por categoria\n2. Calcular a média e o total de vendas por categoria\n3. Ordenar do maior total para o menor\n4. Mostrar apenas as 2 categorias com maior total`,
            validate: (answer) => {
              const cleaned = answer.trim().toLowerCase().replace(/\s+/g, ' ');
              return cleaned.includes('groupby') && 
                     cleaned.includes('agg') && 
                     cleaned.includes('sort_values') &&
                     cleaned.includes('head');
            },
            hint: 'Use vendas.groupby("categoria").agg({...}). Depois sort_values(ascending=False) e head(2).',
            generateContext: () => ({
              months: ['Jan', 'Jan', 'Jan', 'Fev', 'Fev', 'Fev', 'Mar', 'Mar', 'Mar'],
              values: [1500, 2300, 800, 1200, 3100, 950, 1800, 2400, 1100],
              categories: ['Eletrônicos', 'Roupas', 'Alimentos', 'Eletrônicos', 'Roupas', 'Alimentos', 'Eletrônicos', 'Roupas', 'Alimentos']
            })
          }
        ]
      },
      sql: {
        easy: [
          {
            id: 'sql_e1',
            question: (ctx) => `Considere a tabela "alunos":\n\nalunos(id, nome, idade, nota_media)\n\nEscreva uma consulta SQL para selecionar todos os alunos com nota_media maior que ${ctx.nota}.`,
            validate: (answer) => {
              const cleaned = answer.trim().toLowerCase().replace(/\s+/g, ' ');
              return cleaned.includes('select') && 
                     cleaned.includes('from alunos') && 
                     cleaned.includes(`where nota_media > ${ctx.nota}`);
            },
            hint: 'SELECT * FROM alunos WHERE nota_media > valor;',
            generateContext: () => ({ nota: Math.floor(Math.random() * 4) + 7 })
          }
        ],
        medium: [
          {
            id: 'sql_m1',
            question: (ctx) => `Considere as tabelas:\n\nvendas(id, produto_id, quantidade, data)\nprodutos(id, nome, categoria, preco)\n\nEscreva uma consulta SQL que retorne o nome do produto e a quantidade total vendida de cada produto, ordenado do mais vendido para o menos vendido.`,
            validate: (answer) => {
              const cleaned = answer.trim().toLowerCase().replace(/\s+/g, ' ');
              return cleaned.includes('join') && 
                     cleaned.includes('group by') && 
                     cleaned.includes('sum') && 
                     cleaned.includes('order by');
            },
            hint: 'Faça um JOIN entre as tabelas, use GROUP BY com SUM(quantidade) e ORDER BY ... DESC.',
            generateContext: () => ({})
          }
        ],
        hard: [
          {
            id: 'sql_h1',
            question: (ctx) => `Considere as tabelas:\n\nclientes(id, nome, cidade, data_cadastro)\npedidos(id, cliente_id, valor_total, data)\n\nEscreva uma consulta SQL que retorne os clientes que gastaram mais que a média geral de gastos por cliente. Inclua nome do cliente, total gasto e quantos pedidos fez.`,
            validate: (answer) => {
              const cleaned = answer.trim().toLowerCase().replace(/\s+/g, ' ');
              return cleaned.includes('having') && 
                     cleaned.includes('avg') && 
                     cleaned.includes('group by') &&
                     cleaned.includes('count');
            },
            hint: 'Use uma subquery ou HAVING com AVG. GROUP BY cliente_id, calcule SUM(valor_total) e COUNT(*).',
            generateContext: () => ({})
          }
        ]
      },
      analytics: {
        easy: [
          {
            id: 'an_e1',
            question: (ctx) => `Uma empresa de e-commerce percebeu que as vendas aumentam ${ctx.percentual}% toda semana. Se na primeira semana vendeu ${ctx.valor} unidades, quantas unidades venderá na ${ctx.semana}ª semana? (Considere crescimento exponencial)`,
            validate: (answer, ctx) => {
              const expected = ctx.valor * Math.pow(1 + ctx.percentual / 100, ctx.semana - 1);
              return Math.abs(parseFloat(answer) - expected) < 0.5;
            },
            hint: `Use a fórmula: V = V₀ × (1 + taxa)^(tempo). Onde taxa = ${ctx.percentual}/100 = ${ctx.percentual/100}.`,
            generateContext: () => ({
              percentual: Math.floor(Math.random() * 20) + 5,
              valor: Math.floor(Math.random() * 50) + 20,
              semana: Math.floor(Math.random() * 4) + 3
            })
          }
        ],
        medium: [
          {
            id: 'an_m1',
            question: (ctx) => `Um cientista de dados está analisando uma base de clientes. Ele descobriu que:\n- ${ctx.total} clientes compraram no último mês\n- ${ctx.pct}% deles são recorrentes (já haviam comprado antes)\n- O ticket médio dos clientes recorrentes é R$ ${ctx.ticketRecorrente}\n- O ticket médio dos novos clientes é R$ ${ctx.ticketNovo}\n\nQual foi a receita total gerada no mês?`,
            validate: (answer, ctx) => {
              const recorrentes = Math.round(ctx.total * ctx.pct / 100);
              const novos = ctx.total - recorrentes;
              const expected = recorrentes * ctx.ticketRecorrente + novos * ctx.ticketNovo;
              return Math.abs(parseFloat(answer) - expected) < 1;
            },
            hint: 'Calcule quantos são recorrentes (total × pct/100) e quantos são novos. Depois multiplique cada grupo pelo ticket médio.',
            generateContext: () => ({
              total: Math.floor(Math.random() * 500) + 500,
              pct: Math.floor(Math.random() * 30) + 30,
              ticketRecorrente: Math.floor(Math.random() * 100) + 150,
              ticketNovo: Math.floor(Math.random() * 50) + 80
            })
          }
        ],
        hard: [
          {
            id: 'an_h1',
            question: (ctx) => `Uma escola registrou as notas de ${ctx.n} alunos em três avaliações:\n\n| Aluno | Av1 | Av2 | Av3 |\n${ctx.data.map(d => `| ${d.nome} | ${d.av1} | ${d.av2} | ${d.av3} |`).join('\n')}\n\nVocê precisa criar um relatório de desempenho. Analise os dados e responda:\n1) Qual aluno teve a melhor média?\n2) Qual avaliação teve a menor média geral?\n3) Quantos alunos melhoraram da Av2 para Av3?`,
            validate: (answer, ctx) => {
              const lines = answer.trim().toLowerCase().split('\n');
              return lines.length >= 3;
            },
            hint: 'Calcule a média de cada aluno e a média de cada avaliação. Compare as notas Av2 vs Av3 aluno por aluno.',
            generateContext: () => {
              const names = ['Ana', 'Bruno', 'Carlos', 'Diana', 'Eduardo', 'Fernanda'];
              return {
                n: names.length,
                data: names.map(nome => ({
                  nome,
                  av1: Math.floor(Math.random() * 40) + 60,
                  av2: Math.floor(Math.random() * 40) + 60,
                  av3: Math.floor(Math.random() * 40) + 60
                }))
              };
            }
          }
        ]
      }
    };
  }

  generateChallenge(domain, difficulty = null, studentId = null) {
    if (!this.domains[domain]) {
      throw new Error(`Domínio inválido. Use: ${Object.keys(this.domains).join(', ')}`);
    }

    if (!difficulty) {
      difficulty = this.selectDifficulty(domain);
    }

    const templates = this.challengeTemplates[domain][difficulty];
    if (!templates || templates.length === 0) {
      throw new Error(`Nenhum template para ${domain}/${difficulty}`);
    }

    const template = templates[Math.floor(Math.random() * templates.length)];
    const context = template.generateContext();

    const challenge = {
      id: `${template.id}_${Date.now()}`,
      domain,
      domainName: this.domains[domain].name,
      difficulty,
      difficultyInfo: this.difficulties[difficulty],
      question: template.question(context),
      hint: template.hint,
      context,
      validator: template.validate,
      createdAt: new Date(),
      timeLimit: this.difficulties[difficulty].timeMinutes * 60, // em segundos
      points: this.difficulties[difficulty].points,
      topic: this.selectTopic(domain)
    };

    if (studentId) {
      this.recordChallenge(studentId, challenge);
    }

    return challenge;
  }

  selectDifficulty(domain) {
    const weights = this.domains[domain].levelWeights;
    const rand = Math.random();
    let cumulative = 0;

    for (const [level, weight] of Object.entries(weights)) {
      cumulative += weight;
      if (rand <= cumulative) return level;
    }

    return 'easy';
  }

  selectTopic(domain) {
    const topics = this.domains[domain].topics;
    return topics[Math.floor(Math.random() * topics.length)];
  }

  generateChallengeSet(domains = null, count = 5, studentId = null) {
    const selectedDomains = domains || Object.keys(this.domains);
    const challenges = [];

    for (let i = 0; i < count; i++) {
      const domain = selectedDomains[Math.floor(Math.random() * selectedDomains.length)];
      const challenge = this.generateChallenge(domain, null, studentId);
      challenges.push(challenge);
    }

    return challenges;
  }

  validateAnswer(challenge, answer) {
    return {
      correct: challenge.validator(answer, challenge.context),
      challengeId: challenge.id,
      points: challenge.points,
      difficulty: challenge.difficulty
    };
  }

  recordChallenge(studentId, challenge) {
    if (!this.studentProgress.has(studentId)) {
      this.studentProgress.set(studentId, {
        studentId,
        challenges: [],
        scores: { easy: 0, medium: 0, hard: 0 },
        totalPoints: 0,
        streak: 0,
        completedDomains: new Set(),
        lastActivity: null,
        achievements: []
      });
    }

    const progress = this.studentProgress.get(studentId);
    progress.challenges.push({
      challengeId: challenge.id,
      domain: challenge.domain,
      difficulty: challenge.difficulty,
      issuedAt: new Date(),
      answered: false
    });
    progress.lastActivity = new Date();
  }

  submitAnswer(studentId, challenge, answer) {
    if (!this.studentProgress.has(studentId)) {
      throw new Error('Estudante não encontrado');
    }

    const progress = this.studentProgress.get(studentId);
    const result = this.validateAnswer(challenge, answer);

    if (result.correct) {
      progress.scores[challenge.difficulty]++;
      progress.totalPoints += challenge.points;
      progress.streak++;
      progress.completedDomains.add(challenge.domain);

      this.checkAchievements(studentId, progress);
    } else {
      progress.streak = 0;
    }

    return result;
  }

  checkAchievements(studentId, progress) {
    const achievements = [];

    if (progress.scores.easy >= 5) {
      achievements.push({ name: 'Primeiros Passos', description: 'Completou 5 desafios Iniciante', icon: '🌱' });
    }
    if (progress.scores.medium >= 5) {
      achievements.push({ name: 'Analista em Ascensão', description: 'Completou 5 desafios Intermediário', icon: '📊' });
    }
    if (progress.scores.hard >= 3) {
      achievements.push({ name: 'Cientista de Dados Jr.', description: 'Completou 3 desafios Avançado', icon: '🧠' });
    }
    if (progress.totalPoints >= 100) {
      achievements.push({ name: 'Centenário', description: 'Acumulou 100 pontos', icon: '💯' });
    }
    if (progress.streak >= 5) {
      achievements.push({ name: 'Sequência', description: 'Acertou 5 desafios consecutivos', icon: '🔥' });
    }
    if (progress.completedDomains.size >= 5) {
      achievements.push({ name: 'Completo', description: 'Completou desafios em todos os 5 domínios', icon: '🏆' });
    }

    achievements.forEach(ach => {
      if (!progress.achievements.some(a => a.name === ach.name)) {
        progress.achievements.push(ach);
      }
    });
  }

  getStudentReport(studentId) {
    if (!this.studentProgress.has(studentId)) {
      return null;
    }

    const progress = this.studentProgress.get(studentId);
    const totalChallenges = progress.challenges.length;
    
    return {
      studentId: progress.studentId,
      totalPoints: progress.totalPoints,
      challengesCompleted: totalChallenges,
      scores: { ...progress.scores },
      streak: progress.streak,
      breakdown: {
        easy: { completed: progress.scores.easy, pointsPerChallenge: 10 },
        medium: { completed: progress.scores.medium, pointsPerChallenge: 20 },
        hard: { completed: progress.scores.hard, pointsPerChallenge: 35 }
      },
      achievements: progress.achievements,
      domainsCompleted: [...progress.completedDomains],
      lastActivity: progress.lastActivity,
      estimatedLevel: this.calculateLevel(progress.totalPoints)
    };
  }

  calculateLevel(points) {
    if (points >= 500) return 'Cientista de Dados Sênior';
    if (points >= 250) return 'Cientista de Dados Pleno';
    if (points >= 100) return 'Cientista de Dados Júnior';
    if (points >= 50) return 'Analista de Dados';
    if (points >= 20) return 'Aprendiz de Dados';
    return 'Iniciante';
  }

  getStatistics() {
    const totalStudents = this.studentProgress.size;
    let totalPoints = 0;
    let totalChallenges = 0;

    for (const progress of this.studentProgress.values()) {
      totalPoints += progress.totalPoints;
      totalChallenges += progress.challenges.length;
    }

    return {
      totalStudents,
      totalChallengesGenerated: totalChallenges,
      totalPointsEarned: totalPoints,
      averagePoints: totalStudents > 0 ? Math.round(totalPoints / totalStudents) : 0,
      topDomain: this.getTopDomain()
    };
  }

  getTopDomain() {
    const domainCount = {};
    for (const progress of this.studentProgress.values()) {
      for (const domain of progress.completedDomains) {
        domainCount[domain] = (domainCount[domain] || 0) + 1;
      }
    }

    let topDomain = null;
    let maxCount = 0;

    for (const [domain, count] of Object.entries(domainCount)) {
      if (count > maxCount) {
        maxCount = count;
        topDomain = domain;
      }
    }

    return topDomain ? { domain: topDomain, count: maxCount } : null;
  }

  getLeaderboard(limit = 10) {
    const students = [];

    for (const progress of this.studentProgress.values()) {
      students.push({
        studentId: progress.studentId,
        points: progress.totalPoints,
        level: this.calculateLevel(progress.totalPoints),
        achievements: progress.achievements.length,
        lastActivity: progress.lastActivity
      });
    }

    return students
      .sort((a, b) => b.points - a.points)
      .slice(0, limit)
      .map((s, i) => ({ rank: i + 1, ...s }));
  }

  async generateDailyChallenge() {
    const challenges = [];
    const domains = Object.keys(this.domains);

    for (const domain of domains) {
      const challenge = this.generateChallenge(domain, 'medium');
      challenges.push(challenge);
    }

    return {
      date: new Date().toISOString().split('T')[0],
      title: 'Desafio Diário de Ciência de Dados',
      description: 'Complete um desafio de cada domínio para ganhar bônus!',
      challenges,
      bonusPoints: 50,
      timeLimit: 60 // minutos para completar todos
    };
  }
}

// ============================================
// EXEMPLO DE USO
// ============================================

const engine = new DataScienceChallengeEngine();

// 1) Gerar um desafio específico
const challenge1 = engine.generateChallenge('statistics', 'easy');
console.log('--- DESAFIO GERADO ---');
console.log('Domínio:', challenge1.domainName);
console.log('Dificuldade:', challenge1.difficultyInfo.label);
console.log('Pontos:', challenge1.points);
console.log('Questão:', challenge1.question);
console.log('Dica:', challenge1.hint);

// 2) Validar uma resposta
const result = engine.validateAnswer(challenge1, '42');
console.log('\n--- VALIDAÇÃO ---');
console.log('Resposta:', result.correct ? '✓ Correta' : '✗ Incorreta');

// 3) Gerar um conjunto de desafios
const set = engine.generateChallengeSet(['statistics', 'python'], 3);
console.log('\n--- CONJUNTO DE DESAFIOS ---');
set.forEach((c, i) => {
  console.log(`\n#${i + 1} [${c.domain.toUpperCase()}] (${c.difficultyInfo.label}): ${c.question.substring(0, 60)}...`);
});

// 4) Simular progresso de estudante
engine.submitAnswer('aluno1', engine.generateChallenge('statistics', 'easy'), 'resposta');
engine.submitAnswer('aluno1', engine.generateChallenge('statistics', 'easy'), 'resposta');
engine.submitAnswer('aluno1', engine.generateChallenge('statistics', 'easy'), 'resposta');

// 5) Relatório do estudante
console.log('\n--- RELATÓRIO DO ALUNO ---');
console.log(JSON.stringify(engine.getStudentReport('aluno1'), null, 2));

// 6) Gerar desafio diário
const daily = await engine.generateDailyChallenge();
console.log('\n--- DESAFIO DIÁRIO ---');
console.log('Data:', daily.date);
console.log('Bônus:', daily.bonusPoints, 'pontos');
daily.challenges.forEach(c => {
  console.log(`  [${c.domain}] ${c.question.substring(0, 50)}...`);
});

// 7) Leaderboard
console.log('\n--- LEADERBOARD ---');
console.log(engine.getLeaderboard());

// 8) Estatísticas gerais
console.log('\n--- ESTATÍSTICAS GLOBAIS ---');
console.log(JSON.stringify(engine.getStatistics(), null, 2));
