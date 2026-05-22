# 💎 Onyx Assessment Platform v4.0 - Premium Edition
### *The Ultimate Enterprise Educational & Assessment Ecosystem*

Onyx is a high-performance, immersive assessment platform designed for professional technical evaluation and academic training. Built with **Cyber-Terminal Aesthetics** and **Glassmorphism 3.0**, it provides a premium user experience coupled with a robust, laying-friendly heuristic engine.

---

## 📂 Arquitetura de Pastas (Organização do Sistema)
O ecossistema foi refatorado em uma estrutura de pastas corporativa altamente limpa e modularizada:

```text
ONYX/
├── css/
│   └── style.css                 # Folha de estilos unificada (Glassmorphism 3.0, Animações e Temas)
├── js/
│   ├── onyx_core.js              # Utilitários globais, Gerenciador de Sessão e Escudo Anti-Cheat
│   ├── onyx_database.js          # Motor de Geração Procedural Infinita (22 disciplinas)
│   ├── onyx_engines.js           # Algoritmos Heurísticos, Perfil de Insights e Controle de Repetição
│   ├── onyx_ui.js                # Controladores de áudio de feedback e animações da interface
│   └── extremo.js                # Ultimate Challenge Engine v3.0 (Desafios do Bootcamp de Dados)
├── data/
│   ├── onyx_knowledge_expanded.json  # Backups de conhecimento estático legados
│   └── knowledge_db.json
├── legacy/
│   ├── script.js                 # Código monolítico antigo (Desativado)
│   ├── motor.js                  # Versão inicial do motor lógico (Desativado)
│   └── assessment_engine.py      # Protótipo backend em Python (Referência)
├── index.html                    # Terminal de Autenticação (Login)
├── register.html                 # Registro de Credenciais de Operador
├── dashboard.html                # Central de Comando (Menu principal e Arena)
├── quiz.html                     # Simulador de Missão Ativa (Perguntas e Tutor)
├── results.html                  # Relatório de Performance Heurística (Feedback e Insights)
└── README.md                     # Documentação Oficial das Especificações
```

---

## 🚀 Novas Funcionalidades e Especificações (v4.0)

### 1. Sistema Acessível de Aprendizado (Onyx Tutor)
Criado especialmente para alunos leigos poderem entender termos altamente complexos com analogias cotidianas claras:
- **Dicionário de Analogias:** Converte termos técnicos (como *Array, SQL, Loop, Variable, etc.*) em links interativos na pergunta.
- **Janela Flutuante Cyberpunk:** Clicar em um termo abre um painel lateral deslizante animado (`cubic-bezier`), com um robô avatar levitando e fonte **12px**, explicando o conceito de forma lúdica.
- **Bônus de Tempo:** Ativar o Tutor adiciona automaticamente **+15 segundos** ao cronômetro da questão atual.
- **Explicações Condicionais de Erro:** Se o aluno errar uma questão, a explicação detalhada de erro só é exibida ao final se ele tiver solicitado a ajuda do **✨ TUTOR** durante a pergunta, otimizando o fluxo de jogo dos usuários profissionais.

### 2. Geração Procedural Infinita & Anti-Repetição
- **22 Disciplinas Completas:** De Matemática básica e Português até Inteligência Artificial, NLP e Cybersecurity.
- **Mínimo de 20 Questões por Nível:** Cada disciplina contém exatamente 20 variações de questões por dificuldade (dobro do mínimo de 10 exigido).
- **Geração On-The-Fly (`getFreshPool`):** Toda vez que um teste inicia, o motor gera variações inéditas a partir de fórmulas matemáticas, nomes e cenários lógicos aleatórios.
- **Filtro de Histórico de Uso (`seenQuestions`):** Integrado via IndexedDB, o sistema rastreia as perguntas já respondidas pelo perfil do operador. Elas **nunca** se repetem na mesma sessão de jogo e são recicladas de forma inteligente apenas se forem esgotadas.

### 3. Modo Hardcore: Rebaixamento de Nível e Travas Reais
A progressão agora impõe penalidades severas que trazem emoção real de RPG acadêmico:
- **Perda de Vidas:** Ao esgotar as 3 vidas (corações ❤️) em uma missão, o usuário sofre uma **Falha Crítica**.
- **Rebaixamento de Nível:** O nível do operador é reduzido em **-1 Nível** (mínimo Nível 1) e o XP do nível atual é zerado (`xp = 0`). O XP da missão fracassada é cancelado (Ganho = 0).
- **Rebloqueio Automático:** Matérias e dificuldades conquistadas que exigiam o nível perdido voltam a ficar trancadas com cadeado (`🔒`) no Dashboard na mesma hora.
- **Anti-Bypass Gate:** O inicializador de quiz (`quiz.html`) valida o nível do usuário na entrada. Se for detectado que o aluno está em um nível bloqueado (por rebaixamento), ele é ejetado sumariamente de volta para o Dashboard.

### 4. Escudo Global Anti-Cheat (Segurança Cibernética)
Um escudo anticheat monitora o operador globalmente em qualquer parte do sistema (Dashboard, Quiz, Resultados) desde que ele esteja autenticado:
- **Ações Detectadas:** Bloqueia cliques direitos (`contextmenu`) e atalhos de desenvolvedor no teclado (`F12`, `Ctrl+Shift+I`, `Ctrl+Shift+J`, `Ctrl+Shift+C`, `Ctrl+U`).
- **Penalização Imediata:** A tentativa de burlar as regras aplicando atalhos reduz o nível em **-1**, zera o XP, exibe um alerta de segurança nacional do Protocolo Onyx e ejeta o trapaceiro direto de volta para o Dashboard!

---

## 🛠️ Tecnologias Utilizadas
- **Core:** HTML5 Semântico, Javascript ES6+.
- **CSS:** CSS3 Vanilla moderno (Glassmorphism 3.0, Keyframe Animations, Variáveis nativas).
- **Database:** IndexedDB (Criptografia local sandbox de alta velocidade).

---

## 📘 Documentação de Arquitetura Técnica Avançada
Para uma compreensão profunda da engenharia e funcionamento matemático do ecossistema Onyx, consulte o manual técnico oficial:
* **[Manual de Arquitetura e Engenharia de Software](file:///e:/documentos/GitHub/GitHub/avaliiador/avalador/ONYX_SYSTEM_ARCHITECTURE.md)**

### Tópicos cobertos no manual:
1. **Visão Geral e Diagramas de Fluxo (Mermaid)**
2. **Engenharia de Dados (IndexedDB v14 e Assinatura SHA-256)**
3. **Motor Pedagógico Procedural e Sistema do Onyx Tutor**
4. **Algoritmos Heurísticos de Score, ELO e Desvio Padrão ($\sigma$)**
5. **Escudo Cibernético de Segurança (DevTools Docked & Debugger Trap)**
6. **Rede Distribuída PvP Híbrida (WebSockets e BroadcastChannel)**
7. **Motor de Processamento Cognitivo de NLP & Inteligência de Personas**
8. **Renderização Visual e Síntese de Áudio via Web Audio API**

---

## 🚦 Como Rodar o Sistema
1. **Abra `index.html`** em qualquer navegador atual.
2. **Crie suas credenciais** na tela de registro.
3. **Inicie suas missões** e defenda sua classificação sem trapacear!

---
*V.4.0.0-STABLE | © 2026 Onyx Ecosystem | Desenvolvido por Technovie*

