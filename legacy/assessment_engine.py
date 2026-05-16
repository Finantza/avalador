#!/usr/bin/env python3
"""
DataScience & Dev Assessment Engine v2.0
Motor de Avaliação Inteligente para Ensino de Ciência de Dados e Desenvolvimento
"""

import json
import random
import re
import math
import statistics
from typing import Dict, List, Optional, Tuple, Any, Union
from dataclasses import dataclass, field
from enum import Enum
from datetime import datetime
from collections import defaultdict

# ============================================================
# BANCO DE QUESTÕES - CIÊNCIA DE DADOS
# ============================================================

class BancoQuestoesDataScience:
    """Banco de questões de Ciência de Dados - múltiplos níveis"""
    
    @staticmethod
    def questoes_python_basico() -> List[Dict]:
        return [
            {
                "id": "DS-PY-001",
                "nivel": "basico",
                "tema": "Python Básico",
                "pergunta": "Qual é a saída do seguinte código?\n\n```python\nx = [1, 2, 3]\ny = x\ny.append(4)\nprint(x)\n```",
                "alternativas": [
                    "[1, 2, 3]",
                    "[1, 2, 3, 4]",
                    "[1, 2, 3, [4]]",
                    "Erro: list object has no attribute 'append'"
                ],
                "resposta_correta": 1,
                "explicacao": "Em Python, y = x não cria uma cópia, mas sim uma referência ao mesmo objeto. Alterar y também altera x.",
                "dificuldade": 2,
                "tags": ["python", "listas", "referencias", "mutabilidade"],
                "tempo_estimado": 60
            },
            {
                "id": "DS-PY-002",
                "nivel": "basico",
                "tema": "Python Básico",
                "pergunta": "Qual expressão avalia corretamente se uma string contém apenas dígitos?",
                "alternativas": [
                    "string.isdigit()",
                    "string.isnumeric()",
                    "string.isdecimal()",
                    "Todas as anteriores"
                ],
                "resposta_correta": 3,
                "explicacao": "isdigit(), isnumeric() e isdecimal() são métodos que verificam se a string contém apenas caracteres numéricos, com diferenças sutis na cobertura de Unicode.",
                "dificuldade": 1,
                "tags": ["python", "strings", "metodos"],
                "tempo_estimado": 45
            },
            {
                "id": "DS-PY-003",
                "nivel": "basico",
                "tema": "Python Básico",
                "pergunta": "O que é um 'generator' em Python?",
                "alternativas": [
                    "Uma função que retorna múltiplos valores de uma vez",
                    "Uma função que usa 'yield' e produz valores sob demanda, economizando memória",
                    "Um iterador que só funciona com listas",
                    "Um decorador que gera código automaticamente"
                ],
                "resposta_correta": 1,
                "explicacao": "Generators usam 'yield' para produzir uma sequência de valores lazy, um de cada vez, sem armazenar todos na memória.",
                "dificuldade": 3,
                "tags": ["python", "generators", "iteradores", "memoria"],
                "tempo_estimado": 60
            },
            {
                "id": "DS-PY-004",
                "nivel": "intermediario",
                "tema": "Python Intermediário",
                "pergunta": "Qual a diferença entre `deepcopy` e `shallow copy`?",
                "alternativas": [
                    "Não há diferença, ambos criam cópias independentes",
                    "Shallow copy copia apenas o primeiro nível; deepcopy copia recursivamente todos os níveis aninhados",
                    "Deepcopy é mais rápido que shallow copy",
                    "Shallow copy só funciona com dicionários"
                ],
                "resposta_correta": 1,
                "explicacao": "Shallow copy (copy.copy) cria um novo objeto mas insere referências aos objetos originais. Deepcopy (copy.deepcopy) cria cópias completas e independentes de todos os objetos aninhados.",
                "dificuldade": 4,
                "tags": ["python", "copias", "referencias", "objetos"],
                "tempo_estimado": 60
            }
        ]
    
    @staticmethod
    def questoes_numpy() -> List[Dict]:
        return [
            {
                "id": "DS-NP-001",
                "nivel": "basico",
                "tema": "NumPy",
                "pergunta": "Qual comando cria um array NumPy 3x3 preenchido com zeros?",
                "alternativas": [
                    "np.zeros(3, 3)",
                    "np.zeros((3, 3))",
                    "np.zero_array(3, 3)",
                    "np.array([0]*9).reshape(3, 3)"
                ],
                "resposta_correta": 1,
                "explicacao": "np.zeros((3, 3)) cria um array 3x3 de zeros. O parâmetro deve ser uma tupla com as dimensões.",
                "dificuldade": 1,
                "tags": ["numpy", "arrays", "inicializacao"],
                "tempo_estimado": 30
            },
            {
                "id": "DS-NP-002",
                "nivel": "intermediario",
                "tema": "NumPy",
                "pergunta": "O que é 'broadcasting' em NumPy?",
                "alternativas": [
                    "Enviar arrays para outros processos",
                    "Mecanismo que permite operações entre arrays de diferentes shapes, estendendo dimensões automaticamente",
                    "Uma função para exibir arrays no console",
                    "Um método para converter listas em arrays"
                ],
                "resposta_correta": 1,
                "explicacao": "Broadcasting permite operações vetorizadas entre arrays de diferentes formatos, estendendo dimensões menores para compatibilidade sem copiar dados desnecessariamente.",
                "dificuldade": 4,
                "tags": ["numpy", "broadcasting", "vetorizacao"],
                "tempo_estimado": 90
            },
            {
                "id": "DS-NP-003",
                "nivel": "avancado",
                "tema": "NumPy Avançado",
                "pergunta": "Considerando eficiência computacional, qual a melhor forma de normalizar um array 2D (10000x100) para média 0 e desvio 1 (por coluna)?",
                "alternativas": [
                    "Usar um loop for iterando sobre as colunas",
                    "Usar sklearn.preprocessing.StandardScaler",
                    "Calcular mean/std com np.mean/np.std e broadcasting",
                    "Usar pandas.DataFrame.apply com lambda"
                ],
                "resposta_correta": 2,
                "explicacao": "A abordagem mais eficiente é usar np.mean e np.std com axis=0 e broadcasting: (arr - arr.mean(axis=0)) / arr.std(axis=0). Isso aproveita a vetorização do NumPy sem overhead de loops ou bibliotecas externas.",
                "dificuldade": 5,
                "tags": ["numpy", "normalizacao", "eficiencia", "broadcasting"],
                "tempo_estimado": 120
            }
        ]
    
    @staticmethod
    def questoes_pandas() -> List[Dict]:
        return [
            {
                "id": "DS-PD-001",
                "nivel": "basico",
                "tema": "Pandas",
                "pergunta": "Como selecionar a coluna 'idade' de um DataFrame df?",
                "alternativas": [
                    "df['idade']",
                    "df.idade",
                    "df.get('idade')",
                    "df[['idade']]"
                ],
                "resposta_correta": 0,
                "explicacao": "df['idade'] retorna uma Series. df.idade também funciona, mas df['idade'] é a forma mais explícita e segura (funciona com nomes de coluna com espaços).",
                "dificuldade": 1,
                "tags": ["pandas", "dataframe", "selecao"],
                "tempo_estimado": 30
            },
            {
                "id": "DS-PD-002",
                "nivel": "intermediario",
                "tema": "Pandas",
                "pergunta": "Como lidar com valores ausentes (NaN) em um DataFrame?",
                "alternativas": [
                    "Apenas removendo todas as linhas com NaN",
                    "Usando fillna() para preencher ou dropna() para remover, dependendo do contexto",
                    "Convertendo NaN para zero sempre",
                    "Ignorando os valores ausentes"
                ],
                "resposta_correta": 1,
                "explicacao": "A melhor prática depende do contexto: fillna() com média/mediana/moda para dados numéricos, dropna() quando poucas linhas são afetadas, ou métodos avançados como interpolação ou KNN imputation.",
                "dificuldade": 3,
                "tags": ["pandas", "dados_ausentes", "limpeza", "NaN"],
                "tempo_estimado": 60
            },
            {
                "id": "DS-PD-003",
                "nivel": "avancado",
                "tema": "Pandas Avançado",
                "pergunta": "Qual operação o código abaixo realiza?\n\n```python\ndf.groupby('categoria')['valor'].agg(['mean', 'std', 'count'])\n```",
                "alternativas": [
                    "Agrupa por 'categoria', calcula média, desvio padrão e contagem da coluna 'valor'",
                    "Cria uma tabela dinâmica (pivot table)",
                    "Filtra o DataFrame por categorias específicas",
                    "Ordena o DataFrame por categoria e valor"
                ],
                "resposta_correta": 0,
                "explicacao": "O método groupby() seguido de agg() aplica múltiplas funções de agregação (mean, std, count) à coluna 'valor' para cada grupo de 'categoria'.",
                "dificuldade": 3,
                "tags": ["pandas", "groupby", "agregacao", "analise"],
                "tempo_estimado": 60
            },
            {
                "id": "DS-PD-004",
                "nivel": "avancado",
                "tema": "Pandas Avançado",
                "pergunta": "Qual a diferença entre `merge` e `join` no Pandas?",
                "alternativas": [
                    "São idênticos, apenas nomes diferentes",
                    "merge() é baseado em colunas; join() é baseado em índices",
                    "merge() só funciona com DataFrames; join() com Series",
                    "join() é mais rápido que merge()"
                ],
                "resposta_correta": 1,
                "explicacao": "merge() combina DataFrames baseado em valores de colunas (como SQL JOIN). join() combina baseado em índices. merge() é mais flexível para joins complexos.",
                "dificuldade": 4,
                "tags": ["pandas", "merge", "join", "combinacao"],
                "tempo_estimado": 60
            }
        ]
    
    @staticmethod
    def questoes_estatistica() -> List[Dict]:
        return [
            {
                "id": "DS-ST-001",
                "nivel": "basico",
                "tema": "Estatística",
                "pergunta": "O que é o Teorema Central do Limite?",
                "alternativas": [
                    "A média da população sempre se aproxima de zero",
                    "A distribuição das médias amostrais tende a uma distribuição normal à medida que o tamanho da amostra aumenta",
                    "O desvio padrão da amostra é sempre igual ao da população",
                    "A mediana é sempre igual à média em distribuições simétricas"
                ],
                "resposta_correta": 1,
                "explicacao": "O TCL afirma que, para amostras suficientemente grandes (n > 30), a distribuição das médias amostrais se aproxima de uma distribuição normal, independentemente da distribuição original.",
                "dificuldade": 3,
                "tags": ["estatistica", "tcl", "distribuicao", "amostragem"],
                "tempo_estimado": 60
            },
            {
                "id": "DS-ST-002",
                "nivel": "intermediario",
                "tema": "Estatística",
                "pergunta": "Qual a interpretação correta de um p-valor = 0.03 em um teste de hipótese?",
                "alternativas": [
                    "Há 3% de chance da hipótese nula ser verdadeira",
                    "Há 3% de probabilidade de observar os dados (ou mais extremos) se a hipótese nula for verdadeira",
                    "A hipótese alternativa tem 97% de chance de ser verdadeira",
                    "O erro tipo I é garantido em 3% dos casos"
                ],
                "resposta_correta": 1,
                "explicacao": "O p-valor é a probabilidade de observar os dados obtidos (ou valores mais extremos) assumindo que a hipótese nula é verdadeira. p < 0.05 sugere evidência contra H0, mas não é a probabilidade de H0 ser falsa.",
                "dificuldade": 4,
                "tags": ["estatistica", "p-valor", "hipotese", "inferencia"],
                "tempo_estimado": 90
            },
            {
                "id": "DS-ST-003",
                "nivel": "avancado",
                "tema": "Estatística Avançada",
                "pergunta": "Qual a diferença entre correlação de Pearson e Spearman?",
                "alternativas": [
                    "Não há diferença significativa",
                    "Pearson mede relações lineares; Spearman mede relações monotônicas (baseado em ranks)",
                    "Spearman é sempre mais preciso que Pearson",
                    "Pearson só funciona com dados categóricos"
                ],
                "resposta_correta": 1,
                "explicacao": "Pearson assume relação linear e dados normalmente distribuídos. Spearman é baseado em ranks (ordenação) e detecta qualquer relação monotônica (linear ou não), sendo mais robusto a outliers.",
                "dificuldade": 4,
                "tags": ["estatistica", "correlacao", "pearson", "spearman"],
                "tempo_estimado": 60
            }
        ]
    
    @staticmethod
    def questoes_machine_learning() -> List[Dict]:
        return [
            {
                "id": "DS-ML-001",
                "nivel": "basico",
                "tema": "Machine Learning",
                "pergunta": "Qual a diferença entre aprendizado supervisionado e não supervisionado?",
                "alternativas": [
                    "Supervisionado usa dados rotulados; não supervisionado usa dados sem rótulos",
                    "Supervisionado é mais rápido; não supervisionado é mais preciso",
                    "Não supervisionado requer rede neural; supervisionado usa regressão",
                    "Ambos são idênticos, apenas nomes diferentes"
                ],
                "resposta_correta": 0,
                "explicacao": "Aprendizado supervisionado treina com dados rotulados (ex: classificação, regressão). Não supervisionado encontra padrões em dados não rotulados (ex: clustering, redução de dimensionalidade).",
                "dificuldade": 1,
                "tags": ["ml", "supervisionado", "nao_supervisionado", "conceitos"],
                "tempo_estimado": 45
            },
            {
                "id": "DS-ML-002",
                "nivel": "intermediario",
                "tema": "Machine Learning",
                "pergunta": "O que é overfitting e como evitá-lo?",
                "alternativas": [
                    "Overfitting é quando o modelo não aprende nada; evita-se com mais dados",
                    "Overfitting é quando o modelo decora os dados de treino mas não generaliza; evita-se com regularização, validação cruzada e mais dados",
                    "Overfitting é desejável em ML; não precisa ser evitado",
                    "Overfitting ocorre apenas em redes neurais profundas"
                ],
                "resposta_correta": 1,
                "explicacao": "Overfitting ocorre quando o modelo se ajusta excessivamente aos dados de treino, capturando ruído. Prevenção inclui: regularização (L1/L2), validação cruzada, early stopping, dropout, mais dados de treino e redução de complexidade.",
                "dificuldade": 3,
                "tags": ["ml", "overfitting", "regularizacao", "generalizacao"],
                "tempo_estimado": 60
            },
            {
                "id": "DS-ML-003",
                "nivel": "intermediario",
                "tema": "Machine Learning",
                "pergunta": "Para um problema de classificação binária com classes desbalanceadas (5% positivos, 95% negativos), qual métrica é MAIS adequada?",
                "alternativas": [
                    "Acurácia (accuracy)",
                    "Precisão (precision)",
                    "Recall",
                    "F1-Score ou AUC-ROC"
                ],
                "resposta_correta": 3,
                "explicacao": "Com classes desbalanceadas, acurácia é enganosa (classificar tudo como negativo dá 95%). F1-Score balanceia precisão e recall. AUC-ROC avalia a capacidade de discriminação independente de threshold.",
                "dificuldade": 4,
                "tags": ["ml", "metricas", "desbalanceamento", "avaliacao"],
                "tempo_estimado": 90
            },
            {
                "id": "DS-ML-004",
                "nivel": "avancado",
                "tema": "Machine Learning Avançado",
                "pergunta": "O que é o 'bias-variance tradeoff'?",
                "alternativas": [
                    "Um método para escolher entre viés alto e variância alta",
                    "O dilema entre underfitting (bias alto) e overfitting (variância alta); modelos complexos reduzem bias mas aumentam variância",
                    "Uma técnica de regularização automática",
                    "Um tipo de validação cruzada"
                ],
                "resposta_correta": 1,
                "explicacao": "Bias-variance tradeoff descreve que modelos muito simples têm alto bias (underfitting) e modelos muito complexos têm alta variância (overfitting). O objetivo é encontrar o ponto ótimo que minimize o erro total (bias² + variância + ruído).",
                "dificuldade": 5,
                "tags": ["ml", "bias", "variance", "tradeoff", "underfitting"],
                "tempo_estimado": 90
            }
        ]
    
    @staticmethod
    def questoes_visualizacao() -> List[Dict]:
        return [
            {
                "id": "DS-VZ-001",
                "nivel": "basico",
                "tema": "Visualização",
                "pergunta": "Qual gráfico é mais adequado para mostrar a distribuição de uma variável numérica?",
                "alternativas": [
                    "Gráfico de pizza",
                    "Histograma",
                    "Gráfico de barras",
                    "Gráfico de dispersão"
                ],
                "resposta_correta": 1,
                "explicacao": "Histograma é ideal para visualizar distribuição de dados numéricos, mostrando frequências em bins. Gráfico de barras é para categóricos. Dispersão mostra relação entre duas variáveis.",
                "dificuldade": 1,
                "tags": ["vizualizacao", "histograma", "distribuicao"],
                "tempo_estimado": 30
            },
            {
                "id": "DS-VZ-002",
                "nivel": "intermediario",
                "tema": "Visualização",
                "pergunta": "No Matplotlib, qual a diferença entre as interfaces pyplot e orientada a objetos?",
                "alternativas": [
                    "Não há diferença, são equivalentes",
                    "Pyplot (plt.xxx) é mais simples para uso rápido; OO (fig, ax) oferece mais controle e é recomendada para gráficos complexos",
                    "A interface OO é mais antiga e está obsoleta",
                    "Pyplot só funciona em Jupyter Notebooks"
                ],
                "resposta_correta": 1,
                "explicacao": "Pyplot mantém estado global e é conveniente para exploração rápida. A interface OO permite controle granular sobre múltiplos subplots, eixos e personalização, sendo preferível para produção e gráficos complexos.",
                "dificuldade": 3,
                "tags": ["vizualizacao", "matplotlib", "pyplot", "OO"],
                "tempo_estimado": 60
            }
        ]
    
    @staticmethod
    def questoes_sql() -> List[Dict]:
        return [
            {
                "id": "DS-SQL-001",
                "nivel": "basico",
                "tema": "SQL",
                "pergunta": "Qual comando SQL seleciona todos os registros da tabela 'clientes' onde a cidade é 'São Paulo'?",
                "alternativas": [
                    "SELECT * FROM clientes WHERE cidade = 'São Paulo'",
                    "SELECT ALL FROM clientes HAVING cidade = 'São Paulo'",
                    "SELECT * FROM clientes FILTER cidade = 'São Paulo'",
                    "GET * FROM clientes WHERE cidade LIKE 'São Paulo'"
                ],
                "resposta_correta": 0,
                "explicacao": "SELECT * seleciona todas as colunas, FROM especifica a tabela, WHERE filtra registros. É a sintaxe SQL padrão.",
                "dificuldade": 1,
                "tags": ["sql", "select", "where", "filtro"],
                "tempo_estimado": 30
            },
            {
                "id": "DS-SQL-002",
                "nivel": "intermediario",
                "tema": "SQL",
                "pergunta": "Qual a diferença entre INNER JOIN e LEFT JOIN?",
                "alternativas": [
                    "INNER JOIN retorna apenas registros correspondentes em ambas as tabelas; LEFT JOIN retorna todos da esquerda e correspondentes da direita",
                    "LEFT JOIN é mais rápido que INNER JOIN",
                    "INNER JOIN funciona apenas com duas tabelas; LEFT JOIN com várias",
                    "São equivalentes, apenas sinônimos"
                ],
                "resposta_correta": 0,
                "explicacao": "INNER JOIN retorna apenas linhas com correspondência em ambas as tabelas. LEFT JOIN retorna todas as linhas da tabela esquerda, com NULL onde não há correspondência na direita.",
                "dificuldade": 3,
                "tags": ["sql", "joins", "inner_join", "left_join"],
                "tempo_estimado": 45
            },
            {
                "id": "DS-SQL-003",
                "nivel": "avancado",
                "tema": "SQL Avançado",
                "pergunta": "Como calcular a média de vendas por categoria, mostrando apenas categorias com média > 1000?",
                "alternativas": [
                    "SELECT categoria, AVG(vendas) FROM vendas WHERE AVG(vendas) > 1000 GROUP BY categoria",
                    "SELECT categoria, AVG(vendas) FROM vendas GROUP BY categoria HAVING AVG(vendas) > 1000",
                    "SELECT categoria, MEAN(vendas) FROM vendas GROUP BY categoria FILTER AVG(vendas) > 1000",
                    "SELECT categoria, AVG(vendas) > 1000 FROM vendas GROUP BY categoria"
                ],
                "resposta_correta": 1,
                "explicacao": "HAVING é usado para filtrar grupos após GROUP BY (diferente de WHERE que filtra linhas antes da agregação). A ordem correta é: WHERE -> GROUP BY -> HAVING -> ORDER BY.",
                "dificuldade": 4,
                "tags": ["sql", "group_by", "having", "agregacao"],
                "tempo_estimado": 60
            }
        ]


# ============================================================
# BANCO DE QUESTÕES - DESENVOLVIMENTO
# ============================================================

class BancoQuestoesDesenvolvimento:
    """Banco de questões de Desenvolvimento de Software"""
    
    @staticmethod
    def questoes_github_git() -> List[Dict]:
        return [
            {
                "id": "DEV-GT-001",
                "nivel": "basico",
                "tema": "Git & GitHub",
                "pergunta": "Qual comando cria um novo repositório Git local?",
                "alternativas": [
                    "git create",
                    "git init",
                    "git new",
                    "git start"
                ],
                "resposta_correta": 1,
                "explicacao": "git init inicializa um novo repositório Git no diretório atual, criando a pasta .git com toda a estrutura necessária.",
                "dificuldade": 1,
                "tags": ["git", "init", "repositorio"],
                "tempo_estimado": 20
            },
            {
                "id": "DEV-GT-002",
                "nivel": "intermediario",
                "tema": "Git & GitHub",
                "pergunta": "Qual a diferença entre `git merge` e `git rebase`?",
                "alternativas": [
                    "São funcionalmente idênticos",
                    "merge cria um commit de junção preservando o histórico; rebase reescreve o histórico aplicando commits linearmente",
                    "rebase é mais seguro que merge",
                    "merge só funciona em branches locais"
                ],
                "resposta_correta": 1,
                "explicacao": "Merge preserva a bifurcação do histórico com um commit de merge. Rebase reescreve o histórico aplicando commits de uma branch sobre outra, resultando em histórico linear, mas alterando hashes dos commits.",
                "dificuldade": 4,
                "tags": ["git", "merge", "rebase", "branch"],
                "tempo_estimado": 90
            },
            {
                "id": "DEV-GT-003",
                "nivel": "avancado",
                "tema": "Git & GitHub",
                "pergunta": "Como reverter o último commit mantendo as alterações nos arquivos (working directory)?",
                "alternativas": [
                    "git revert HEAD",
                    "git reset --soft HEAD~1",
                    "git reset --hard HEAD~1",
                    "git checkout HEAD~1"
                ],
                "resposta_correta": 1,
                "explicacao": "git reset --soft HEAD~1 remove o último commit mas mantém as alterações staged. git revert cria um novo commit desfazendo as alterações. git reset --hard remove tudo.",
                "dificuldade": 4,
                "tags": ["git", "reset", "revert", "commits"],
                "tempo_estimado": 60
            }
        ]
    
    @staticmethod
    def questoes_poo() -> List[Dict]:
        return [
            {
                "id": "DEV-OO-001",
                "nivel": "basico",
                "tema": "Programação Orientada a Objetos",
                "pergunta": "O que é encapsulamento em POO?",
                "alternativas": [
                    "Esconder a implementação interna de um objeto e expor apenas uma interface controlada",
                    "Agrupar funções em módulos",
                    "Criar múltiplas instâncias de uma classe",
                    "Herdar propriedades de outra classe"
                ],
                "resposta_correta": 0,
                "explicacao": "Encapsulamento é o princípio de ocultar detalhes internos de implementação e expor apenas uma interface pública, protegendo a integridade dos dados e reduzindo acoplamento.",
                "dificuldade": 2,
                "tags": ["poo", "encapsulamento", "conceitos"],
                "tempo_estimado": 45
            },
            {
                "id": "DEV-OO-002",
                "nivel": "intermediario",
                "tema": "Programação Orientada a Objetos",
                "pergunta": "Qual a diferença entre herança e composição?",
                "alternativas": [
                    "Herança é 'é um'; composição é 'tem um'",
                    "Herança é mais moderna que composição",
                    "Composição é 'é um'; herança é 'tem um'",
                    "São sinônimos em POO"
                ],
                "resposta_correta": 0,
                "explicacao": "Herança (extends) representa relação 'é um' (Carro é um Veículo). Composição representa relação 'tem um' (Carro tem um Motor). 'Prefira composição sobre herança' é um princípio de design.",
                "dificuldade": 3,
                "tags": ["poo", "heranca", "composicao", "design"],
                "tempo_estimado": 60
            },
            {
                "id": "DEV-OO-003",
                "nivel": "avancado",
                "tema": "POO Avançada",
                "pergunta": "O que são SOLID principles? Cite os cinco.",
                "alternativas": [
                    "Single Responsibility, Open-Closed, Liskov Substitution, Interface Segregation, Dependency Inversion",
                    "Simple, Organized, Logical, Integrated, Dynamic",
                    "Structure, Object, Logic, Interface, Data",
                    "São 3 princípios: Single, Open, Liskov"
                ],
                "resposta_correta": 0,
                "explicacao": "SOLID: S - Single Responsibility (uma classe, uma responsabilidade), O - Open-Closed (aberto para extensão, fechado para modificação), L - Liskov Substitution (subclasses substituem classes base), I - Interface Segregation (interfaces específicas), D - Dependency Inversion (depender de abstrações, não implementações).",
                "dificuldade": 5,
                "tags": ["poo", "solid", "design_patterns", "arquitetura"],
                "tempo_estimado": 120
            }
        ]
    
    @staticmethod
    def questoes_apis() -> List[Dict]:
        return [
            {
                "id": "DEV-API-001",
                "nivel": "basico",
                "tema": "APIs REST",
                "pergunta": "O que significa REST?",
                "alternativas": [
                    "Representational State Transfer",
                    "Remote Execution Service Tool",
                    "Rapid Entity State Transfer",
                    "Representational Entity Service Technology"
                ],
                "resposta_correta": 0,
                "explicacao": "REST (Representational State Transfer) é um estilo arquitetural para APIs que usa HTTP como protocolo, com recursos identificados por URLs e operações definidas por métodos HTTP (GET, POST, PUT, DELETE).",
                "dificuldade": 1,
                "tags": ["api", "rest", "http", "arquitetura"],
                "tempo_estimado": 30
            },
            {
                "id": "DEV-API-002",
                "nivel": "intermediario",
                "tema": "APIs REST",
                "pergunta": "Qual a diferença entre PUT e PATCH em APIs REST?",
                "alternativas": [
                    "São equivalentes",
                    "PUT substitui o recurso completo; PATCH aplica uma atualização parcial",
                    "PATCH substitui o recurso completo; PUT atualiza parcialmente",
                    "PUT é para criar; PATCH é para deletar"
                ],
                "resposta_correta": 1,
                "explicacao": "PUT substitui todo o recurso (requer todos os campos). PATCH aplica modificações parciais (apenas campos que mudam). PATCH é mais eficiente para atualizações parciais.",
                "dificuldade": 3,
                "tags": ["api", "rest", "put", "patch", "http"],
                "tempo_estimado": 45
            }
        ]
    
    @staticmethod
    def questoes_testes() -> List[Dict]:
        return [
            {
                "id": "DEV-TS-001",
                "nivel": "basico",
                "tema": "Testes",
                "pergunta": "Qual a diferença entre teste unitário e teste de integração?",
                "alternativas": [
                    "Unitário testa funções isoladamente; integração testa a interação entre componentes",
                    "Integração é mais simples que unitário",
                    "Unitário é feito por QA; integração por desenvolvedores",
                    "Ambos testam a mesma coisa em níveis diferentes"
                ],
                "resposta_correta": 0,
                "explicacao": "Testes unitários verificam a menor unidade de código (função/método) isoladamente, usando mocks. Testes de integração verificam como múltiplos componentes interagem (banco, API, serviços externos).",
                "dificuldade": 2,
                "tags": ["testes", "unitario", "integracao", "qa"],
                "tempo_estimado": 45
            },
            {
                "id": "DEV-TS-002",
                "nivel": "avancado",
                "tema": "Testes Avançados",
                "pergunta": "O que é TDD (Test-Driven Development)?",
                "alternativas": [
                    "Desenvolver testes depois do código",
                    "Ciclo: escrever teste que falha -> escrever código mínimo para passar -> refatorar",
                    "Testar apenas funcionalidades críticas",
                    "Usar apenas testes manuais antes do deploy"
                ],
                "resposta_correta": 1,
                "explicacao": "TDD segue o ciclo Red-Green-Refactor: escreve um teste que falha (Red), escreve código mínimo para passar (Green), refatora mantendo os testes verdes (Refactor). Isso garante código testável e design mais limpo.",
                "dificuldade": 4,
                "tags": ["testes", "tdd", "metodologia", "qualidade"],
                "tempo_estimado": 90
            }
        ]
    
    @staticmethod
    def questoes_banco_dados() -> List[Dict]:
        return [
            {
                "id": "DEV-DB-001",
                "nivel": "basico",
                "tema": "Banco de Dados",
                "pergunta": "Qual a diferença entre bancos SQL e NoSQL?",
                "alternativas": [
                    "SQL é relacional (tabelas, schemas fixos); NoSQL é não-relacional (documentos, chave-valor, grafos, flexível)",
                    "SQL é mais rápido que NoSQL",
                    "NoSQL não suporta consultas complexas",
                    "SQL é mais moderno que NoSQL"
                ],
                "resposta_correta": 0,
                "explicacao": "SQL (PostgreSQL, MySQL) usa esquema fixo, tabelas relacionadas e ACID. NoSQL (MongoDB, Redis, Neo4j) oferece flexibilidade de schema, escalabilidade horizontal e modelos variados (documentos, chave-valor, grafos, colunas).",
                "dificuldade": 2,
                "tags": ["banco_dados", "sql", "nosql", "relacional"],
                "tempo_estimado": 45
            },
            {
                "id": "DEV-DB-002",
                "nivel": "intermediario",
                "tema": "Banco de Dados",
                "pergunta": "O que é um índice de banco de dados e quando usar?",
                "alternativas": [
                    "Uma estrutura que acelera consultas SELECT mas pode reduzir performance de INSERT/UPDATE",
                    "Uma cópia de segurança do banco",
                    "Um tipo especial de tabela",
                    "Uma constraint que garante unicidade"
                ],
                "resposta_correta": 0,
                "explicacao": "Índices são estruturas (B-tree, hash) que aceleram buscas (SELECT/WHERE) mas precisam ser mantidos em operações de escrita (INSERT/UPDATE/DELETE). Use em colunas frequentemente consultadas mas com muitas escritas.",
                "dificuldade": 4,
                "tags": ["banco_dados", "indices", "performance", "otimizacao"],
                "tempo_estimado": 60
            },
            {
                "id": "DEV-DB-003",
                "nivel": "avancado",
                "tema": "Banco de Dados Avançado",
                "pergunta": "O que são transações ACID?",
                "alternativas": [
                    "Atomicity, Consistency, Isolation, Durability",
                    "Automated, Coordinated, Integrated, Distributed",
                    "Access, Control, Integrity, Data",
                    "Association, Composition, Inheritance, Dependency"
                ],
                "resposta_correta": 0,
                "explicacao": "ACID: Atomicity (tudo ou nada), Consistency (estado válido), Isolation (transações concorrentes não interferem), Durability (dados persistem mesmo após falha). Essencial para integridade em sistemas transacionais.",
                "dificuldade": 4,
                "tags": ["banco_dados", "acid", "transacoes", "integridade"],
                "tempo_estimado": 60
            }
        ]

    @staticmethod
    def questoes_devops() -> List[Dict]:
        return [
            {
                "id": "DEV-DO-001",
                "nivel": "basico",
                "tema": "DevOps",
                "pergunta": "O que é um contêiner Docker?",
                "alternativas": [
                    "Uma máquina virtual leve que executa um sistema operacional completo",
                    "Uma unidade padronizada de software que empacota código e todas as dependências para executar de forma isolada",
                    "Um gerenciador de pacotes para Linux",
                    "Um serviço de cloud computing"
                ],
                "resposta_correta": 1,
                "explicacao": "Contêiner Docker é uma unidade leve e executável que empacota código, runtime, bibliotecas e configurações. Diferente de VMs, compartilha o kernel do host, tornando-os mais rápidos e eficientes.",
                "dificuldade": 2,
                "tags": ["devops", "docker", "container", "virtualizacao"],
                "tempo_estimado": 45
            },
            {
                "id": "DEV-DO-002",
                "nivel": "intermediario",
                "tema": "DevOps",
                "pergunta": "Qual a diferença entre Dockerfile e docker-compose.yml?",
                "alternativas": [
                    "Dockerfile define uma imagem; docker-compose define e orquestra múltiplos contêineres",
                    "São equivalentes, apenas formatos diferentes",
                    "Dockerfile é para produção; docker-compose é para desenvolvimento",
                    "docker-compose substituiu Dockerfile"
                ],
                "resposta_correta": 0,
                "explicacao": "Dockerfile é um script para construir uma imagem (FROM, RUN, COPY, CMD). Docker Compose define serviços multi-contêiner (versão 3: services, networks, volumes), simplificando a orquestração local.",
                "dificuldade": 3,
                "tags": ["devops", "docker", "dockerfile", "docker-compose"],
                "tempo_estimado": 60
            },
            {
                "id": "DEV-DO-003",
                "nivel": "avancado",
                "tema": "DevOps Avançado",
                "pergunta": "O que é CI/CD e quais seus benefícios?",
                "alternativas": [
                    "Continuous Integration (integração contínua) + Continuous Delivery/Deployment (entrega/deploy contínuo); automatiza build, teste e deploy",
                    "Um tipo de banco de dados distribuído",
                    "Um framework de desenvolvimento web",
                    "Uma ferramenta de monitoramento"
                ],
                "resposta_correta": 0,
                "explicacao": "CI integra código frequentemente com builds e testes automatizados. CD entrega/implanta automaticamente em produção. Benefícios: detecção precoce de erros, deploy rápido e confiável, feedback imediato, redução de retrabalho.",
                "dificuldade": 4,
                "tags": ["devops", "ci", "cd", "automacao", "deploy"],
                "tempo_estimado": 60
            }
        ]
    
    @staticmethod
    def questoes_algoritmos() -> List[Dict]:
        return [
            {
                "id": "DEV-AL-001",
                "nivel": "basico",
                "tema": "Algoritmos",
                "pergunta": "Qual a complexidade do algoritmo de busca binária?",
                "alternativas": [
                    "O(n)",
                    "O(log n)",
                    "O(n²)",
                    "O(n log n)"
                ],
                "resposta_correta": 1,
                "explicacao": "Busca binária tem complexidade O(log n). A cada iteração, o espaço de busca é reduzido pela metade. Requer que os dados estejam ordenados.",
                "dificuldade": 2,
                "tags": ["algoritmos", "complexidade", "busca", "big_o"],
                "tempo_estimado": 45
            },
            {
                "id": "DEV-AL-002",
                "nivel": "intermediario",
                "tema": "Algoritmos",
                "pergunta": "Qual a diferença entre uma lista (array) e uma lista encadeada (linked list)?",
                "alternativas": [
                    "Array tem acesso O(1) por índice; linked list tem inserção/remoção O(1) no início",
                    "Linked list usa menos memória que array",
                    "Array é sempre mais rápido que linked list",
                    "São estruturas equivalentes"
                ],
                "resposta_correta": 0,
                "explicacao": "Array: acesso aleatório O(1), inserção/remoção O(n). Linked List: acesso sequencial O(n), inserção/remoção no início O(1). A escolha depende do caso de uso (acesso vs modificação frequente).",
                "dificuldade": 4,
                "tags": ["algoritmos", "estruturas_dados", "array", "linked_list"],
                "tempo_estimado": 60
            }
        ]


# ============================================================
# MOTOR DE AVALIAÇÃO INTELIGENTE
# ============================================================

@dataclass
class RespostaAluno:
    """Registro de resposta de um aluno"""
    questao_id: str
    alternativa_escolhida: int
    correta: bool
    tempo_gasto: float
    timestamp: datetime = field(default_factory=datetime.now)

@dataclass
class PerfilAluno:
    """Perfil adaptativo do aluno"""
    nivel_atual: str = "basico"  # basico, intermediario, avancado
    pontuacao_total: float = 0.0
    questoes_respondidas: int = 0
    acertos: int = 0
    erros: int = 0
    forcas: List[str] = field(default_factory=list)
    fraquezas: List[str] = field(default_factory=list)
    historico_temas: Dict[str, Dict] = field(default_factory=lambda: defaultdict(lambda: {"acertos": 0, "total": 0, "tempo_medio": 0}))
    tempo_medio_resposta: float = 0.0
    streak_acertos: int = 0
    streak_erros: int = 0
    
    def taxa_acerto(self) -> float:
        if self.questoes_respondidas == 0:
            return 0.0
        return (self.acertos / self.questoes_respondidas) * 100
    
    def atualizar_forcas_fraquezas(self):
        """Identifica pontos fortes e fracos baseado no desempenho por tema"""
        self.forcas = []
        self.fraquezas = []
        
        for tema, dados in self.historico_temas.items():
            if dados["total"] >= 3:  # Mínimo de questões para análise
                taxa = dados["acertos"] / dados["total"] * 100
                if taxa >= 80:
                    self.forcas.append(tema)
                elif taxa < 50:
                    self.fraquezas.append(tema)


class AssessmentEngine:
    """Motor principal de avaliação inteligente"""
    
    def __init__(self):
        # Inicializa bancos de questões
        self.banco_ds = {
            "python": BancoQuestoesDataScience.questoes_python_basico(),
            "numpy": BancoQuestoesDataScience.questoes_numpy(),
            "pandas": BancoQuestoesDataScience.questoes_pandas(),
            "estatistica": BancoQuestoesDataScience.questoes_estatistica(),
            "machine_learning": BancoQuestoesDataScience.questoes_machine_learning(),
            "visualizacao": BancoQuestoesDataScience.questoes_visualizacao(),
            "sql": BancoQuestoesDataScience.questoes_sql()
        }
        
        self.banco_dev = {
            "git": BancoQuestoesDesenvolvimento.questoes_github_git(),
            "poo": BancoQuestoesDesenvolvimento.questoes_poo(),
            "apis": BancoQuestoesDesenvolvimento.questoes_apis(),
            "testes": BancoQuestoesDesenvolvimento.questoes_testes(),
            "banco_dados": BancoQuestoesDesenvolvimento.questoes_banco_dados(),
            "devops": BancoQuestoesDesenvolvimento.questoes_devops(),
            "algoritmos": BancoQuestoesDesenvolvimento.questoes_algoritmos()
        }
        
        # Mapeia níveis para pesos de dificuldade
        self.pesos_nivel = {
            "basico": 1.0,
            "intermediario": 2.0,
            "avancado": 3.0
        }
        
        # Alunos ativos
        self.alunos: Dict[str, PerfilAluno] = {}
        
        # Questões já usadas por aluno
        self.questoes_usadas: Dict[str, set] = defaultdict(set)
    
    def get_all_questions(self) -> Dict[str, List[Dict]]:
        """Retorna todas as questões disponíveis"""
        todas = {}
        for tema, questoes in self.banco_ds.items():
            for q in questoes:
                todas[q["id"]] = q
        for tema, questoes in self.banco_dev.items():
            for q in questoes:
                todas[q["id"]] = q
        return todas
    
    def registrar_aluno(self, nome: str) -> PerfilAluno:
        """Registra um novo aluno no sistema"""
        if nome not in self.alunos:
            self.alunos[nome] = PerfilAluno()
        return self.alunos[nome]
    
    def selecionar_questao(self, aluno_nome: str, tema: Optional[str] = None, 
                           modo: str = "adaptativo") -> Optional[Dict]:
        """
        Seleciona a próxima questão baseada no perfil do aluno
        
        Args:
            aluno_nome: Nome do aluno
            tema: Tema específico (opcional)
            modo: 'adaptativo', 'dificuldade', 'tema_especifico'
        """
        if aluno_nome not in self.alunos:
            return None
        
        perfil = self.alunos[aluno_nome]
        todas_questoes = self.get_all_questions()
        usadas = self.questoes_usadas[aluno_nome]
        
        # Filtra questões não usadas
        disponiveis = {k: v for k, v in todas_questoes.items() if k not in usadas}
        
        if not disponiveis:
            # Reset se todas foram usadas
            self.questoes_usadas[aluno_nome] = set()
            disponiveis = todas_questoes
        
        if tema:
            # Filtra por tema específico
            disponiveis = {k: v for k, v in disponiveis.items() if v.get("tema", "").lower() == tema.lower()}
        
        if not disponiveis:
            return None
        
        if modo == "adaptativo":
            return self._selecao_adaptativa(disponiveis, perfil)
        elif modo == "dificuldade":
            nivel = input("Nível desejado (basico/intermediario/avancado): ").strip().lower()
            filtradas = {k: v for k, v in disponiveis.items() if v.get("nivel") == nivel}
            if filtradas:
                return random.choice(list(filtradas.values()))
            return random.choice(list(disponiveis.values()))
        else:
            return random.choice(list(disponiveis.values()))
    
    def _selecao_adaptativa(self, questoes: Dict[str, Dict], perfil: PerfilAluno) -> Dict:
        """
        Seleção adaptativa baseada no desempenho do aluno
        
        - Básico: alunos com < 60% de acerto ou em início
        - Intermediário: alunos entre 60-80%
        - Avançado: alunos com > 80%
        """
        taxa = perfil.taxa_acerto()
        
        if perfil.questoes_respondidas < 5:
            # Início: mistura de níveis
            nivel_alvo = "basico"
        elif taxa < 60:
            nivel_alvo = "basico"
        elif taxa < 80:
            nivel_alvo = "intermediario"
        else:
            nivel_alvo = "avancado"
        
        # Prioriza fraquezas
        if perfil.fraquezas and random.random() < 0.6:
            tema_fraco = random.choice(perfil.fraquezas)
            filtradas = {k: v for k, v in questoes.items() 
                        if v.get("tema", "").lower() == tema_fraco.lower() 
                        and v.get("nivel", "basico") == nivel_alvo}
            if filtradas:
                return random.choice(list(filtradas.values()))
        
        # Seleciona por nível
        filtradas = {k: v for k, v in questoes.items() if v.get("nivel") == nivel_alvo}
        if not filtradas:
            filtradas = questoes
        
        return random.choice(list(filtradas.values()))
    
    def avaliar_resposta(self, aluno_nome: str, questao: Dict, 
                          alternativa: int, tempo: float) -> Dict:
        """
        Avalia a resposta do aluno e atualiza o perfil
        
        Returns:
            Dict com feedback completo
        """
        if aluno_nome not in self.alunos:
            self.registrar_aluno(aluno_nome)
        
        perfil = self.alunos[aluno_nome]
        questao_id = questao["id"]
        
        # Verifica resposta
        correta = (alternativa == questao["resposta_correta"])
        
        # Registra resposta
        resposta = RespostaAluno(
            questao_id=questao_id,
            alternativa_escolhida=alternativa,
            correta=correta,
            tempo_gasto=tempo
        )
        
        # Atualiza perfil
        perfil.questoes_respondidas += 1
        if correta:
            perfil.acertos += 1
            perfil.streak_acertos += 1
            perfil.streak_erros = 0
        else:
            perfil.erros += 1
            perfil.streak_erros += 1
            perfil.streak_acertos = 0
        
        # Pontuação ponderada por dificuldade
        peso = self.pesos_nivel.get(questao.get("nivel", "basico"), 1.0)
        pontos = peso * (1 if correta else 0)
        perfil.pontuacao_total += pontos
        
        # Atualiza estatísticas por tema
        tema = questao.get("tema", "geral")
        hist = perfil.historico_temas[tema]
        hist["acertos"] += 1 if correta else 0
        hist["total"] += 1
        hist["tempo_medio"] = (hist["tempo_medio"] * (hist["total"] - 1) + tempo) / hist["total"]
        
        # Atualiza tempo médio geral
        total_respostas = perfil.questoes_respondidas
        perfil.tempo_medio_resposta = (perfil.tempo_medio_resposta * (total_respostas - 1) + tempo) / total_respostas
        
        # Marca questão como usada
        self.questoes_usadas[aluno_nome].add(questao_id)
        
        # Atualiza forças e fraquezas
        perfil.atualizar_forcas_fraquezas()
        
        # Atualiza nível
        taxa = perfil.taxa_acerto()
        if taxa >= 80 and perfil.questoes_respondidas >= 10:
            perfil.nivel_atual = "avancado"
        elif taxa >= 60 and perfil.questoes_respondidas >= 5:
            perfil.nivel_atual = "intermediario"
        else:
            perfil.nivel_atual = "basico"
        
        # Gera feedback
        feedback = self._gerar_feedback(perfil, questao, correta, alternativa)
        
        return {
            "correta": correta,
            "resposta_correta": questao["alternativas"][questao["resposta_correta"]],
            "alternativa_escolhida": questao["alternativas"][alternativa],
            "explicacao": questao.get("explicacao", ""),
            "tags": questao.get("tags", []),
            "feedback": feedback,
           "perfil_atualizado": {
                "nivel": perfil.nivel_atual,
                "taxa_acerto": round(perfil.taxa_acerto(), 1),
                "pontuacao": round(perfil.pontuacao_total, 1),
                "streak_acertos": perfil.streak_acertos,
                "streak_erros": perfil.streak_erros,
                "forcas": perfil.forcas,
                "fraquezas": perfil.fraquezas
            }
        }
    
    def _gerar_feedback(self, perfil: PerfilAluno, questao: Dict, 
                         correta: bool, alternativa: int) -> Dict:
        """Gera feedback personalizado baseado no desempenho"""
        tema = questao.get("tema", "geral")
        nivel = questao.get("nivel", "basico")
        
        if correta:
            if perfil.streak_acertos >= 5:
                motivacao = random.choice([
                    "🔥 Impressionante! Você está dominando este conteúdo!",
                    "⭐ Desempenho excepcional! Continue assim!",
                    "🚀 Você está voando neste tema!",
                    "💪 Nível professional detectado!"
                ])
            elif perfil.streak_acertos >= 3:
                motivacao = random.choice([
                    "👏 Muito bom! Sequência de acertos impressionante!",
                    "✨ Você está entendendo muito bem o assunto!",
                    "🎯 No caminho certo! Continue praticando!"
                ])
            else:
                motivacao = random.choice([
                    "✅ Correto! Bom trabalho!",
                    "👍 Resposta certa!",
                    "🎉 Acertou! Vamos para a próxima!"
                ])
            
            return {
                "tipo": "positivo",
                "mensagem": motivacao,
                "recomendacao": self._recomendar_proximo_tema(perfil, questao)
            }
        else:
            # Feedback para erro
            if perfil.streak_erros >= 3:
                motivacao = f"⚠️ Está com dificuldade em '{tema}'. Que tal revisar os conceitos básicos?"
                sugestao = f"📚 Sugiro estudar: {', '.join(questao.get('tags', [])[:3])}"
            else:
                motivacao = "❌ Não foi dessa vez! Mas errar faz parte do aprendizado."
                sugestao = f"💡 Dica: {questao.get('explicacao', '')[:100]}..."
            
            return {
                "tipo": "negativo",
                "mensagem": motivacao,
                "sugestao_estudo": sugestao,
                "recomendacao": self._recomendar_revisao(perfil, tema)
            }
    
    def _recomendar_proximo_tema(self, perfil: PerfilAluno, questao_atual: Dict) -> str:
        """Recomenda próximo tema baseado no progresso"""
        tema = questao_atual.get("tema", "")
        
        # Mapeamento de progressão de temas
        progressao = {
            "Python Básico": "NumPy",
            "NumPy": "Pandas",
            "Pandas": "Visualização",
            "SQL": "Banco de Dados",
            "Git & GitHub": "DevOps",
            "POO": "Design Patterns",
            "Testes": "CI/CD"
        }
        
        if tema in progressao:
            return f"📖 Próximo passo recomendado: estudar '{progressao[tema]}'"
        
        # Se está indo bem, sugere aumentar dificuldade
        if perfil.taxa_acerto() > 85 and perfil.nivel_atual == "basico":
            return "🚀 Você está pronto para questões de nível intermediário!"
        elif perfil.taxa_acerto() > 85 and perfil.nivel_atual == "intermediario":
            return "🚀 Você está pronto para desafios avançados!"
        
        return "📖 Continue praticando para solidificar o conhecimento!"
    
    def _recomendar_revisao(self, perfil: PerfilAluno, tema: str) -> str:
        """Recomenda revisão para temas com dificuldade"""
        if tema in perfil.fraquezas:
            return f"📚 Revisão recomendada: foque em exercícios práticos de '{tema}'"
        
        # Sugere revisão geral se taxa de acerto está baixa
        if perfil.taxa_acerto() < 50:
            return "📚 Sugiro revisar os fundamentos antes de continuar"
        
        return "💪 Tente novamente! A prática leva à perfeição."
    
    def gerar_relatorio(self, aluno_nome: str) -> Dict:
        """Gera relatório completo de desempenho do aluno"""
        if aluno_nome not in self.alunos:
            return {"erro": "Aluno não encontrado"}
        
        perfil = self.alunos[aluno_nome]
        
        # Calcula desempenho por tema
        desempenho_temas = {}
        for tema, dados in perfil.historico_temas.items():
            if dados["total"] > 0:
                taxa = (dados["acertos"] / dados["total"]) * 100
                desempenho_temas[tema] = {
                    "acertos": dados["acertos"],
                    "total": dados["total"],
                    "taxa": round(taxa, 1),
                    "tempo_medio": round(dados["tempo_medio"], 1)
                }
        
        # Calcula nível geral
        if perfil.taxa_acerto() >= 80:
            nivel_geral = "Avançado 🌟"
            descricao = "Excelente domínio dos conceitos! Pronto para desafios complexos."
        elif perfil.taxa_acerto() >= 60:
            nivel_geral = "Intermediário 📊"
            descricao = "Boa base! Continue praticando para solidificar o conhecimento."
        else:
            nivel_geral = "Iniciante 📚"
            descricao = "Começando bem! Mantenha o foco nos fundamentos."
        
        return {
            "aluno": aluno_nome,
            "data_relatorio": datetime.now().strftime("%d/%m/%Y %H:%M"),
            "estatisticas_gerais": {
                "nivel": nivel_geral,
                "descricao": descricao,
                "questoes_respondidas": perfil.questoes_respondidas,
                "acertos": perfil.acertos,
                "erros": perfil.erros,
                "taxa_acerto": round(perfil.taxa_acerto(), 1),
                "pontuacao_total": round(perfil.pontuacao_total, 1),
                "tempo_medio_resposta": round(perfil.tempo_medio_resposta, 1),
                "maior_streak_acertos": perfil.streak_acertos
            },
            "desempenho_por_tema": desempenho_temas,
            "pontos_fortes": perfil.forcas,
            "pontos_a_melhorar": perfil.fraquezas,
            "recomendacoes": self._gerar_recomendacoes(perfil)
        }
    
    def _gerar_recomendacoes(self, perfil: PerfilAluno) -> List[str]:
        """Gera recomendações personalizadas de estudo"""
        recomendacoes = []
        
        # Recomendações baseadas em fraquezas
        if perfil.fraquezas:
            temas = ", ".join(perfil.fraquezas[:3])
            recomendacoes.append(f"📚 Priorize o estudo de: {temas}")
        
        # Recomendações baseadas no nível
        if perfil.nivel_atual == "basico" and perfil.questoes_respondidas > 10:
            recomendacoes.append("🚀 Aumente a dificuldade! Tente questões intermediárias.")
        elif perfil.nivel_atual == "intermediario" and perfil.taxa_acerto() > 75:
            recomendacoes.append("🚀 Desafie-se com questões avançadas!")
        
        # Recomendações baseadas no tempo
        if perfil.tempo_medio_resposta > 120:
            recomendacoes.append("⏱️ Tente responder mais rápido. Pratique com questões mais simples primeiro.")
        elif perfil.tempo_medio_resposta < 20 and perfil.taxa_acerto() < 60:
            recomendacoes.append("⏱️ Você está respondendo muito rápido! Tente ler com mais atenção.")
        
        # Recomendações de prática
        if perfil.questoes_respondidas < 20:
            recomendacoes.append("💪 Continue praticando! A consistência é a chave do aprendizado.")
        
        if not recomendacoes:
            recomendacoes.append("🌟 Excelente trabalho! Você está no caminho certo.")
        
        return recomendacoes
    
    def comparar_alunos(self, alunos: List[str]) -> Dict:
        """Compara desempenho entre múltiplos alunos"""
        comparacao = {}
        
        for aluno in alunos:
            if aluno in self.alunos:
                perfil = self.alunos[aluno]
                comparacao[aluno] = {
                    "nivel": perfil.nivel_atual,
                    "taxa_acerto": round(perfil.taxa_acerto(), 1),
                    "questoes": perfil.questoes_respondidas,
                    "pontuacao": round(perfil.pontuacao_total, 1),
                    "forcas": perfil.forcas,
                    "fraquezas": perfil.fraquezas
                }
        
        return {
            "alunos_comparados": alunos,
            "dados": comparacao,
            "ranking": sorted(comparacao.items(), key=lambda x: x[1]["pontuacao"], reverse=True)
        }
    
    def exportar_metricas_turma(self) -> Dict:
        """Exporta métricas agregadas da turma"""
        if not self.alunos:
            return {"erro": "Nenhum aluno cadastrado"}
        
        metricas = {
            "total_alunos": len(self.alunos),
            "media_taxa_acerto": 0.0,
            "media_pontuacao": 0.0,
            "distribuicao_niveis": {"basico": 0, "intermediario": 0, "avancado": 0},
            "temas_mais_dificeis": [],
            "temas_mais_faceis": [],
            "top_alunos": []
        }
        
        taxas = []
        pontuacoes = []
        desempenho_temas = defaultdict(lambda: {"acertos": 0, "total": 0})
        
        for nome, perfil in self.alunos.items():
            taxas.append(perfil.taxa_acerto())
            pontuacoes.append(perfil.pontuacao_total)
            metricas["distribuicao_niveis"][perfil.nivel_atual] += 1
            
            for tema, dados in perfil.historico_temas.items():
                desempenho_temas[tema]["acertos"] += dados["acertos"]
                desempenho_temas[tema]["total"] += dados["total"]
            
            metricas["top_alunos"].append((nome, round(perfil.pontuacao_total, 1)))
        
        metricas["media_taxa_acerto"] = round(statistics.mean(taxas), 1) if taxas else 0
        metricas["media_pontuacao"] = round(statistics.mean(pontuacoes), 1) if pontuacoes else 0
        metricas["top_alunos"] = sorted(metricas["top_alunos"], key=lambda x: x[1], reverse=True)[:5]
        
        # Análise de temas
        for tema, dados in desempenho_temas.items():
            if dados["total"] >= 5:  # Amostra mínima
                taxa = (dados["acertos"] / dados["total"]) * 100
                metricas["temas_mais_dificeis"].append((tema, round(taxa, 1)))
                metricas["temas_mais_faceis"].append((tema, round(taxa, 1)))
        
        metricas["temas_mais_dificeis"] = sorted(metricas["temas_mais_dificeis"], key=lambda x: x[1])[:3]
        metricas["temas_mais_faceis"] = sorted(metricas["temas_mais_faceis"], key=lambda x: x[1], reverse=True)[:3]
        
        return metricas


# ============================================================
# GERADOR DE PROVAS E EXERCÍCIOS
# ============================================================

class GeradorProvas:
    """Gera provas e listas de exercícios personalizadas"""
    
    def __init__(self, engine: AssessmentEngine):
        self.engine = engine
        self.todas_questoes = engine.get_all_questions()
    
    def gerar_prova(self, tema: str, nivel: str, num_questoes: int = 10) -> Dict:
        """Gera uma prova com questões filtradas"""
        questoes_filtradas = [
            q for q in self.todas_questoes.values()
            if q.get("tema", "").lower() == tema.lower()
            and q.get("nivel", "") == nivel
        ]
        
        if len(questoes_filtradas) < num_questoes:
            # Complementa com questões do nível
            questoes_filtradas = [
                q for q in self.todas_questoes.values()
                if q.get("nivel", "") == nivel
            ]
        
        if not questoes_filtradas:
            questoes_filtradas = list(self.todas_questoes.values())
        
        selecionadas = random.sample(questoes_filtradas, min(num_questoes, len(questoes_filtradas)))
        
        return {
            "titulo": f"Prova de {tema} - Nível {nivel}",
            "data": datetime.now().strftime("%d/%m/%Y"),
            "num_questoes": len(selecionadas),
            "tempo_estimado": sum(q.get("tempo_estimado", 60) for q in selecionadas),
            "questoes": [
                {
                    "id": q["id"],
                    "pergunta": q["pergunta"],
                    "alternativas": q["alternativas"],
                    "dificuldade": q.get("dificuldade", 1),
                    "tags": q.get("tags", [])
                }
                for q in selecionadas
            ],
            "gabarito": {
                q["id"]: {
                    "resposta": q["resposta_correta"],
                    "alternativa": q["alternativas"][q["resposta_correta"]],
                    "explicacao": q.get("explicacao", "")
                }
                for q in selecionadas
            }
        }
    
    def gerar_lista_exercicios(self, aluno_nome: str, num_questoes: int = 5) -> Dict:
        """Gera lista de exercícios focada nas fraquezas do aluno"""
        if aluno_nome not in self.engine.alunos:
            return {"erro": "Aluno não encontrado"}
        
        perfil = self.engine.alunos[aluno_nome]
        questoes_selecionadas = []
        
        # 60% das questões focadas em fraquezas
        if perfil.fraquezas:
            num_fraquezas = min(int(num_questoes * 0.6), len(perfil.fraquezas))
            temas_fracos = random.sample(perfil.fraquezas, num_fraquezas)
            
            for tema in temas_fracos:
                candidatas = [
                    q for q in self.todas_questoes.values()
                    if q.get("tema", "").lower() == tema.lower()
                    and q["id"] not in self.engine.questoes_usadas[aluno_nome]
                ]
                if candidatas:
                    questoes_selecionadas.append(random.choice(candidatas))
        
        # 40% questões para reforçar pontos fortes
        if perfil.forcas and len(questoes_selecionadas) < num_questoes:
            num_forcas = min(num_questoes - len(questoes_selecionadas), len(perfil.forcas))
            temas_fortes = random.sample(perfil.forcas, num_forcas)
            
            for tema in temas_fortes:
                candidatas = [
                    q for q in self.todas_questoes.values()
                    if q.get("tema", "").lower() == tema.lower()
                    and q.get("nivel", "") in ["intermediario", "avancado"]
                    and q["id"] not in self.engine.questoes_usadas[aluno_nome]
                ]
                if candidatas:
                    questoes_selecionadas.append(random.choice(candidatas))
        
        # Completa com questões gerais
        while len(questoes_selecionadas) < num_questoes:
            candidatas = [
                q for q in self.todas_questoes.values()
                if q["id"] not in self.engine.questoes_usadas[aluno_nome]
                and q not in questoes_selecionadas
            ]
            if not candidatas:
                break
            questoes_selecionadas.append(random.choice(candidatas))
        
        return {
            "titulo": f"Lista Personalizada para {aluno_nome}",
            "foco": "Fraquezas identificadas" if perfil.fraquezas else "Reforço geral",
            "fraquezas_abordadas": perfil.fraquezas,
            "forcas_abordadas": perfil.forcas,
            "questoes": [
                {
                    "id": q["id"],
                    "pergunta": q["pergunta"],
                    "alternativas": q["alternativas"],
                    "tema": q.get("tema", ""),
                    "nivel": q.get("nivel", ""),
                    "tags": q.get("tags", [])
                }
                for q in questoes_selecionadas
            ],
            "gabarito": {
                q["id"]: {
                    "resposta_correta": q["resposta_correta"],
                    "explicacao": q.get("explicacao", "")
                }
                for q in questoes_selecionadas
            }
        }


# ============================================================
# INTERFACE DE ADMINISTRAÇÃO
# ============================================================

class AdminInterface:
    """Interface administrativa para gestão do sistema"""
    
    def __init__(self, engine: AssessmentEngine):
        self.engine = engine
        self.gerador = GeradorProvas(engine)
    
    def menu_admin(self):
        """Menu principal de administração"""
        while True:
            print("\n" + "=" * 60)
            print("📊 ADMIN - SISTEMA DE AVALIAÇÃO")
            print("=" * 60)
            print("1. 👥 Gerenciar Alunos")
            print("2. 📝 Aplicar Prova")
            print("3. 📋 Gerar Lista de Exercícios")
            print("4. 📈 Relatórios")  
            print("5. 🏆 Comparar Alunos")
            print("6. 📊 Métricas da Turma")
            print("7. ❓ Modo Quiz Interativo")
            print("0. 🔙 Voltar")
            print("=" * 60)
            
            opcao = input("\nEscolha: ").strip()
            
            if opcao == "1":
                self._gerenciar_alunos()
            elif opcao == "2":
                self._aplicar_prova()
            elif opcao == "3":
                self._gerar_lista()
            elif opcao == "4":
                self._relatorios()
            elif opcao == "5":
                self._comparar_alunos()
            elif opcao == "6":
                self._metricas_turma()
            elif opcao == "7":
                self._modo_quiz()
            elif opcao == "0":
                break
    
    def _gerenciar_alunos(self):
        """Gerencia o cadastro de alunos"""
        print("\n--- GERENCIAR ALUNOS ---")
        print("1. Cadastrar novo aluno")
        print("2. Listar alunos")
        print("3. Ver perfil de aluno")
        
        op = input("\nOpção: ").strip()
        
        if op == "1":
            nome = input("Nome do aluno: ").strip()
            if nome:
                self.engine.registrar_aluno(nome)
                print(f"✅ Aluno '{nome}' cadastrado com sucesso!")
        
        elif op == "2":
            if not self.engine.alunos:
                print("📭 Nenhum aluno cadastrado.")
            else:
                print("\n📋 ALUNOS CADASTRADOS:")
                for nome, perfil in self.engine.alunos.items():
                    print(f"  • {nome} - Nível: {perfil.nivel_atual} - {perfil.questoes_respondidas} questões")
        
        elif op == "3":
            nome = input("Nome do aluno: ").strip()
            if nome in self.engine.alunos:
                relatorio = self.engine.gerar_relatorio(nome)
                print(json.dumps(relatorio, indent=2, ensure_ascii=False))
            else:
                print("❌ Aluno não encontrado!")
    
    def _aplicar_prova(self):
        """Aplica uma prova para um aluno"""
        print("\n--- APLICAR PROVA ---")
        print("Temas disponíveis: python, numpy, pandas, estatistica, machine_learning, sql, git, poo, apis, testes, banco_dados, devops, algoritmos")
        print("Níveis: basico, intermediario, avancado")
        
        tema = input("Tema (Enter para todos): ").strip() or None
        nivel = input("Nível (Enter para todos): ").strip() or None
        num_q = int(input("Número de questões (padrão 10): ").strip() or "10")
        
        if tema and nivel:
            prova = self.gerador.gerar_prova(tema, nivel, num_q)
        else:
            prova = self.gerador.gerar_prova("geral", "basico", num_q)
        
        print(f"\n📝 {prova['titulo']}")
        print(f"Tempo estimado: {prova['tempo_estimado'] // 60} min\n")
        
        for i, q in enumerate(prova['questoes'], 1):
            print(f"\nQ{i}. {q['pergunta']}")
            for j, alt in enumerate(q['alternativas']):
                print(f"   {chr(65+j)}) {alt}")
            print(f"   [Dificuldade: {q['dificuldade']}/5 | Tags: {', '.join(q['tags'][:3])}]")
    
    def _gerar_lista(self):
        """Gera lista personalizada para aluno"""
        nome = input("Nome do aluno: ").strip()
        num_q = int(input("Número de questões (padrão 5): ").strip() or "5")
        
        lista = self.gerador.gerar_lista_exercicios(nome, num_q)
        
        if "erro" in lista:
            print(f"❌ {lista['erro']}")
            return
        
        print(f"\n📋 {lista['titulo']}")
        print(f"Foco: {lista['foco']}")
        if lista.get('fraquezas_abordadas'):
            print(f"🎯 Fraquezas a trabalhar: {', '.join(lista['fraquezas_abordadas'])}")
        print()
        
        for i, q in enumerate(lista['questoes'], 1):
            print(f"Q{i}. [{q['tema']} - {q['nivel']}] {q['pergunta'][:100]}...")
    
    def _relatorios(self):
        """Gera relatórios de desempenho"""
        print("\n--- RELATÓRIOS ---")
        nome = input("Nome do aluno: ").strip()
        
        if nome in self.engine.alunos:
            relatorio = self.engine.gerar_relatorio(nome)
            print("\n" + "=" * 60)
            print(f"📊 RELATÓRIO DE DESEMPENHO")
            print(f"Aluno: {relatorio['aluno']}")
            print(f"Data: {relatorio['data_relatorio']}")
            print("=" * 60)
            
            stats = relatorio['estatisticas_gerais']
            print(f"\n🎯 Nível: {stats['nivel']}")
            print(f"{stats['descricao']}")
            print(f"\n📊 Estatísticas:")
            print(f"  Questões respondidas: {stats['questoes_respondidas']}")
            print(f"  Acertos: {stats['acertos']} | Erros: {stats['erros']}")
            print(f"  Taxa de acerto: {stats['taxa_acerto']}%")
            print(f"  Pontuação total: {stats['pontuacao_total']}")
            print(f"  Tempo médio: {stats['tempo_medio_resposta']}s")
            
            if relatorio['desempenho_por_tema']:
                print(f"\n📈 Desempenho por Tema:")
                for tema, dados in sorted(relatorio['desempenho_por_tema'].items(), 
                                          key=lambda x: x[1]['taxa']):
                    print(f"  {tema}: {dados['taxa']}% ({dados['acertos']}/{dados['total']})")
            
            if relatorio['pontos_fortes']:
                print(f"\n💪 Pontos Fortes: {', '.join(relatorio['pontos_fortes'])}")
            if relatorio['pontos_a_melhorar']:
                print(f"📚 Pontos a Melhorar: {', '.join(relatorio['pontos_a_melhorar'])}")
            
            print(f"\n🎯 Recomendações:")
            for rec in relatorio['recomendacoes']:
                print(f"  {rec}")
        else:
            print("❌ Aluno não encontrado!")
    
    def _comparar_alunos(self):
        """Compara desempenho entre alunos"""
        print("\n--- COMPARAR ALUNOS ---")
        if not self.engine.alunos:
            print("📭 Nenhum aluno cadastrado.")
            return
        
        print("Alunos disponíveis:")
        for nome in self.engine.alunos:
            print(f"  • {nome}")
        
        alunos_str = input("\nNomes dos alunos (separados por vírgula): ").strip()
        alunos = [a.strip() for a in alunos_str.split(",") if a.strip()]
        
        if alunos:
            resultado = self.engine.comparar_alunos(alunos)
            print("\n🏆 RANKING:")
            for i, (nome, dados) in enumerate(resultado['ranking'], 1):
                print(f"  {i}º {nome}: {dados['pontuacao']} pts | {dados['taxa_acerto']}% | {dados['nivel']}")
    
    def _metricas_turma(self):
        """Exibe métricas agregadas da turma"""
        metricas = self.engine.exportar_metricas_turma()
        
        if "erro" in metricas:
            print(f"❌ {metricas['erro']}")
            return
        
        print("\n" + "=" * 60)
        print("📊 MÉTRICAS DA TURMA")
        print("=" * 60)
        print(f"\n👥 Total de alunos: {metricas['total_alunos']}")
        print(f"📈 Média de acerto: {metricas['media_taxa_acerto']}%")
        print(f"🏆 Média de pontuação: {metricas['media_pontuacao']}")
        
        print(f"\n📊 Distribuição de Níveis:")
        for nivel, qtd in metricas['distribuicao_niveis'].items():
            barra = "█" * qtd
            print(f"  {nivel}: {barra} ({qtd})")
        
        if metricas['temas_mais_dificeis']:
            print(f"\n⚠️ Temas mais difíceis:")
            for tema, taxa in metricas['temas_mais_dificeis']:
                print(f"  • {tema}: {taxa}% de acerto")
        
        if metricas['temas_mais_faceis']:
            print(f"\n✅ Temas mais fáceis:")
            for tema, taxa in metricas['temas_mais_faceis']:
                print(f"  • {tema}: {taxa}% de acerto")
        
        if metricas['top_alunos']:
            print(f"\n🥇 Top 5 Alunos:")
            for i, (nome, pts) in enumerate(metricas['top_alunos'], 1):
                print(f"  {i}º {nome}: {pts} pontos")
    
    def _modo_quiz(self):
        """Modo quiz interativo para praticar"""
        print("\n" + "=" * 60)
        print("🎮 MODO QUIZ INTERATIVO")
        print("=" * 60)
        
        nome = input("Seu nome: ").strip()
        if not nome:
            nome = f"Aluno_{random.randint(100, 999)}"
        
        self.engine.registrar_aluno(nome)
        print(f"✅ Bem-vindo, {nome}!\n")
        
        while True:
            questao = self.engine.selecionar_questao(nome)
            if not questao:
                print("🎉 Todas as questões foram respondidas!")
                break
            
            print(f"\n📝 [{questao.get('tema', 'Geral')} - {questao.get('nivel', '')}]")
            print(f"\n{questao['pergunta']}")
            
            for i, alt in enumerate(questao['alternativas']):
                print(f"  {chr(65+i)}) {alt}")
            
            print(f"\n[Dica: tags: {', '.join(questao.get('tags', [])[:3])}]")
            
            try:
                start = datetime.now()
                resp = input("\nSua resposta (A/B/C/D ou 0 para sair): ").strip().upper()
                
                if resp == "0":
                    break
                
                tempo = (datetime.now() - start).total_seconds()
                idx = ord(resp) - 65 if resp.isalpha() else int(resp) - 1
                
                if 0 <= idx < len(questao['alternativas']):
                    resultado = self.engine.avaliar_resposta(nome, questao, idx, tempo)
                    
                    if resultado['correta']:
                        print(f"\n✅ {resultado['feedback']['mensagem']}")
                    else:
                        print(f"\n❌ {resultado['feedback']['mensagem']}")
                        print(f"Resposta correta: {resultado['resposta_correta']}")
                        print(f"\n📖 {resultado['explicacao']}")
                    
                    # Mostra perfil atualizado resumido
                    perfil = resultado['perfil_atualizado']
                    print(f"\n📊 Taxa: {perfil['taxa_acerto']}% | Streak: {perfil['streak_acertos']}✅/{perfil['streak_erros']}❌ | Nível: {perfil['nivel']}")
                else:
                    print("❌ Alternativa inválida!")
            
            except (ValueError, IndexError):
                print("❌ Entrada inválida! Use A, B, C, D ou 1, 2, 3, 4")
        
        # Mostra relatório final
        print("\n" + "=" * 60)
        print("🏁 QUIZ FINALIZADO!")
        print("=" * 60)
        relatorio = self.engine.gerar_relatorio(nome)
        stats = relatorio['estatisticas_gerais']
        print(f"\nResultados finais de {nome}:")
        print(f"  Nível: {stats['nivel']}")
        print(f"  Taxa de acerto: {stats['taxa_acerto']}%")
        print(f"  Questões: {stats['questoes_respondidas']}")
        print(f"  Pontuação: {stats['pontuacao_total']}")


# ============================================================
# SISTEMA PRINCIPAL
# ============================================================

class SistemaAvaliacao:
    """Sistema principal de avaliação"""
    
    def __init__(self):
        self.engine = AssessmentEngine()
        self.admin = AdminInterface(self.engine)
    
    def iniciar(self):
        """Inicia o sistema"""
        print("""
    ╔══════════════════════════════════════════════════════════╗
    ║        DATA SCIENCE & DEV ASSESSMENT ENGINE v2.0         ║
    ║    Motor Inteligente de Avaliação para Ensino de         ║
    ║    Ciência de Dados e Desenvolvimento de Software        ║
    ╚══════════════════════════════════════════════════════════╝
        """)
        
        while True:
            print("\n" + "=" * 60)
            print("MENU PRINCIPAL")
            print("=" * 60)
            print("1. 🎮 Modo Quiz (Praticar)")
            print("2. 👤 Perfil do Aluno")
            print("3. 📊 Relatório de Desempenho")
            print("4. 🔧 Administração")
            print("0. Sair")
            print("=" * 60)
            
            opcao = input("\nEscolha: ").strip()
            
            if opcao == "1":
                self.admin._modo_quiz()
            elif opcao == "2":
                self.admin._gerenciar_alunos()
            elif opcao == "3":
                self.admin._relatorios()
            elif opcao == "4":
                self.admin.menu_admin()
            elif opcao == "0":
                print("\n👋 Até logo! Continue estudando!")
                break


# ============================================================
# EXEMPLO DE USO - SCRIPT DE DEMONSTRAÇÃO
# ============================================================

def demonstracao():
    """Demonstra as capacidades do sistema"""
    sistema = SistemaAvaliacao()
    
    print("\n🚀 INICIANDO DEMONSTRAÇÃO...\n")
    
    # Registra alunos de exemplo
    alunos_teste = ["Ana", "Bruno", "Carol", "Diego", "Elena"]
    
    for nome in alunos_teste:
        sistema.engine.registrar_aluno(nome)
    
    # Simula respostas para criar perfis
    todas_q = sistema.engine.get_all_questions()
    
    simula_respostas = {
        "Ana": {"acertos": 15, "erros": 3, "temas": ["python", "pandas", "sql"]},
        "Bruno": {"acertos": 8, "erros": 10, "temas": ["git", "poo", "testes"]},
        "Carol": {"acertos": 20, "erros": 2, "temas": ["numpy", "machine_learning"]},
        "Diego": {"acertos": 5, "erros": 12, "temas": ["devops", "apis"]},
        "Elena": {"acertos": 12, "erros": 6, "temas": ["estatistica", "visualizacao"]}
    }
    
    for nome, dados in simula_respostas.items():
        perfil = sistema.engine.alunos[nome]
        temas_interesse = dados["temas"]
        
        questoes_tema = [
            q for q in todas_q.values()
            if q.get("tema", "").lower() in [t.lower() for t in temas_interesse]
        ]
        
        for i in range(dados["acertos"] + dados["erros"]):
            if questoes_tema:
                q = random.choice(questoes_tema)
                correta = i < dados["acertos"]
                alt = q["resposta_correta"] if correta else (q["resposta_correta"] + 1) % len(q["alternativas"])
                sistema.engine.avaliar_resposta(nome, q, alt, random.uniform(20, 120))
    
    print("✅ Dados de demonstração carregados!\n")
    
    # Mostra relatórios
    for nome in alunos_teste:
        relatorio = sistema.engine.gerar_relatorio(nome)
        stats = relatorio['estatisticas_gerais']
        print(f"📊 {nome}: {stats['taxa_acerto']}% | {stats['nivel']} | {stats['questoes_respondidas']} questões")
    
    print("\n📈 Métricas da turma:")
    metricas = sistema.engine.exportar_metricas_turma()
    print(f"  Média geral: {metricas['media_taxa_acerto']}%")
    print(f"  Níveis: {metricas['distribuicao_niveis']}")
    
    # Inicia modo interativo
    print("\n🎯 Iniciando modo interativo...\n")
    sistema.iniciar()


if __name__ == "__main__":
    import sys
    
    if "--demo" in sys.argv:
        demonstracao()
    else:
        sistema = SistemaAvaliacao()
        sistema.iniciar()