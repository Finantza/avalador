# 💎 Onyx Assessment Platform v3.1.0
### Plataforma de avaliação educacional com motor de perguntas procedurais e persistência local

Onyx é um sistema de avaliação e treinamento construído inteiramente no navegador usando **HTML5**, **CSS3** e **JavaScript**. Ele combina persistência local em **IndexedDB**, geração de questões procedurais, painel de tutor assistido e um motor heurístico para pontuação adaptativa.

---

## 📂 Estrutura do Projeto
O repositório está organizado em módulos claros para interface, dados, motor de avaliação e conteúdo de apoio:

```text
avalador/
├── css/
│   ├── academic_portal.css
│   ├── ai_portal.css
│   ├── glossary.css
│   └── style.css
├── data/
│   ├── build_seed.js
│   ├── build_seed_addon.py
│   ├── build_seed.ps1
│   ├── inspect_data.py
│   ├── knowledge_db.json
│   ├── onyx_knowledge_expanded.json
│   └── onyx_database.db
├── js/
│   ├── extremo.js
│   ├── onyx_cognitive.js
│   ├── onyx_core.js
│   ├── onyx_database.js
│   ├── onyx_db_manager.js
│   ├── onyx_engines.js
│   ├── onyx_network.js
│   ├── onyx_ui.js
│   └── syntax_check.js
├── legacy/
│   ├── assessment_engine.py
│   ├── motor.js
│   ├── script.js
│   └── tutor.js
├── scratch/
│   ├── check_counts.py
│   ├── check_html_js_syntax.py
│   ├── check_syntax.py
│   ├── extract_questions.py
│   ├── test_data.js
│   └── validate_onyx.js
├── academic_portal.html
├── ai_portal.html
├── bug_report.md
├── dashboard.html
├── glossary.html
├── index.html
├── ONYX_SYSTEM_ARCHITECTURE.md
├── parents_portal.html
├── quiz.html
├── register.html
├── README.md
└── results.html
```

---

## 🚀 Principais Características

- **Interface moderna e responsiva** construída com CSS Glassmorphism e animações.
- **Autenticação local** e usuários padrão registrados automaticamente em IndexedDB.
- **Banco de dados local `OnyxEliteDB`** com stores para `global_stats`, `history`, `cached_questions`, `dynamic_questions` e `question_bank`.
- **Seed inicial de questões** carregada a partir de `data/onyx_database.db` via `js/onyx_db_manager.js`.
- **Geração procedural** de perguntas em `js/onyx_database.js` para múltiplas disciplinas e níveis de dificuldade.
- **Motor heurístico de pontuação** em `js/onyx_engines.js` que usa acerto, tempo, consistência e uso do tutor.
- **Painel de ajuda Tutor** no `quiz.html`, com explicações e dicas por termo técnico.
- **Persistência offline** usando IndexedDB + localStorage para progresso e configurações.
- **Modos de níveis e bloqueio de acesso** dependendo do progresso do usuário.

---

## 🔧 Módulos Principais

- `js/onyx_core.js` — sessão, autenticação, hash SHA-256, gerência de IndexedDB e usuários padrão.
- `js/onyx_db_manager.js` — seed e persistência de questões no `question_bank` com índices por assunto e dificuldade.
- `js/onyx_database.js` — geração de questões procedurais alinhada a tópicos acadêmicos e BNCC.
- `js/onyx_engines.js` — cálculo de score adaptativo, análise de perfil e suporte a histórico.
- `js/onyx_ui.js` — renderização de pontuação, animações e áudio de feedback.
- `js/onyx_network.js` — infraestrutura de rede e possível pareamento PvP.
- `legacy/tutor.js` — assistente de estudo e modo tutor legado.
- `data/onyx_knowledge_expanded.json` — base de conhecimento estático complementando as questões.

---

## 📘 Documentação de Referência

Para detalhes de arquitetura, persistência, segurança e fluxo de dados, consulte:

* `ONYX_SYSTEM_ARCHITECTURE.md`
* `bug_report.md`

---

## 🧩 Comportamento Atual do Sistema

- Usuários padrão criados automaticamente no banco local:
  - `aluno` / senha `1234`
  - `gestor` / senha `1234`
  - `responsavel` / senha `1234`
  - `OPERADOR MÓVEL` / senha `1234`
  - `OPERADOR TESTE` / senha `1234`
- O sistema persiste progresso e inventário em IndexedDB.
- O `quiz.html` valida acesso à matéria / dificuldade com base no nível do usuário.
- O `dashboard.html` exibe barra de XP, lives, streak e loja de itens.
- O `quiz.html` oferece itens de suporte como Tutor, Vida, 50/50, Tempo e Pular.

---

## 🚦 Como Executar

1. Abra `index.html` no navegador.
2. Se houver problema de carregamento de `data/onyx_database.db`, execute a aplicação via servidor local (por exemplo, Live Server ou `python -m http.server`).
3. Cadastre um novo operador em `register.html` ou use um dos usuários padrão.
4. Navegue para `dashboard.html` e inicie uma missão em `quiz.html`.

---

## 💡 Observações

- O projeto funciona melhor em navegadores modernos com suporte a IndexedDB e Web Crypto.
- A pasta `legacy/` contém implementações antigas e protótipos que não fazem parte do fluxo principal atual.
- A pasta `scratch/` contém scripts de validação e ferramentas de extração úteis para desenvolvimento.

---

*V.3.1.0-STABLE | © 2026 Onyx Ecosystem*
