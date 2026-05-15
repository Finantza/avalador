/**
 * ONYX ENGINES MODULE
 * Specialized heuristic question generators for various technical subjects.
 */

export const OnyxEngines = {
    // Helper to shuffle options
    shuffle(array) {
        const arr = [...array];
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    },

    // Hybrid Engine: Cross-subject reasoning
    engineHybrid(subject, diff) {
        const scenarios = [
            { q: "Qual a relação entre Latência e Experiência do Usuário (UX) em aplicações Real-time?", a: "Latência alta degrada a interatividade e percepção de fluidez", d: ["Não há relação direta", "Latência melhora a segurança", "UX depende apenas do design visual"] },
            { q: "Como o Sharding impacta a complexidade de junções (joins) em bancos de dados?", a: "Junções entre shards tornam-se custosas e complexas", d: ["Simplifica as consultas SQL", "Elimina a necessidade de índices", "Reduz o consumo de CPU global"] }
        ];
        const pick = scenarios[Math.floor(Math.random() * scenarios.length)];
        const options = this.shuffle([pick.a, ...pick.d]);
        return { 
            question: `[ONYX HYBRID] ${pick.q}`, 
            options: options, 
            answer: options.indexOf(pick.a) 
        };
    },

    // Frontend Engine
    engineFrontend(diff) {
        const level = diff === 'easy' ? 0 : (diff === 'medium' ? 1 : (diff === 'hard' ? 2 : 3));
        const scenarios = [
            { q: "Qual a função do 'Virtual DOM' no React?", a: "Otimizar atualizações na UI comparando árvores", d: ["Substituir o HTML5 completamente", "Gerenciar o banco de dados no cliente", "Acelerar o download de scripts"] },
            { q: "O que é 'Hoisting' em JavaScript?", a: "Elevação de declarações de variáveis e funções", d: ["Um método de compressão de arquivos JS", "A renderização de imagens em alta resolução", "O carregamento de fontes externas"] },
            { q: "Explique o conceito de 'Critical Rendering Path'?", a: "Sequência de passos para converter HTML/CSS em pixels", d: ["Caminho de segurança para scripts de login", "Protocolo de envio de arquivos via FTP", "Sistema de rotas de um framework SPA"] },
            { q: "O que é 'Z-index' e como ele funciona com 'Stacking Context'?", a: "Define a ordem de empilhamento baseada no contexto", d: ["Calcula a distância entre objetos 3D", "Mede a profundidade da página em pixels", "Define a velocidade de scroll horizontal"] }
        ];
        const pick = scenarios[Math.min(level, scenarios.length - 1)];
        const options = this.shuffle([pick.a, ...pick.d]);
        return { question: `[IA ONYX] Frontend Architecture:\n${pick.q}`, options, answer: options.indexOf(pick.a) };
    },

    // Backend Engine
    engineBackend(diff) {
        const level = diff === 'easy' ? 0 : (diff === 'medium' ? 1 : (diff === 'hard' ? 2 : 3));
        const scenarios = [
            { q: "O que é uma API RESTful?", a: "Interface que segue os princípios REST e HTTP", d: ["Um sistema de arquivos de rede local", "Um software de edição de texto binário", "Um protocolo de segurança de hardware"] },
            { q: "Diferença entre SQL e NoSQL?", a: "SQL é relacional/esquema fixo; NoSQL é flexível", d: ["SQL é mais rápido que NoSQL sempre", "NoSQL não permite salvar textos longos", "SQL funciona apenas em servidores locais"] },
            { q: "O que é 'Connection Pooling'?", a: "Cache de conexões com o banco para reuso", d: ["Um sistema de resfriamento de servidores", "Compartilhamento de internet entre usuários", "Uma técnica de compressão de pacotes IP"] },
            { q: "Explique o conceito de 'Microservices Orchestration'?", a: "Coordenação centralizada de fluxos entre serviços", d: ["Criação de partituras para músicas digitais", "Backup redundante de arquivos de sistema", "Interface de linha de comando para usuários"] }
        ];
        const pick = scenarios[Math.min(level, scenarios.length - 1)];
        const options = this.shuffle([pick.a, ...pick.d]);
        return { question: `[IA ONYX] Backend Engineering:\n${pick.q}`, options, answer: options.indexOf(pick.a) };
    },

    // Cybersecurity Engine
    engineCybersecurity(diff) {
        const level = diff === 'easy' ? 0 : (diff === 'medium' ? 1 : (diff === 'hard' ? 2 : 3));
        const scenarios = [
            { q: "O que é 'Salting' em criptografia de senhas?", a: "Adicionar dados aleatórios antes do hash", d: ["Limpar o cache de senhas do navegador", "Criptografar a conexão via cabo físico", "Aumentar a velocidade de login do usuário"] },
            { q: "O que caracteriza um ataque 'SQL Injection'?", a: "Inserção de comandos maliciosos em inputs", d: ["Download excessivo de tabelas do banco", "Envio de e-mails falsos com anexos", "Bloqueio de acesso ao servidor de arquivos"] },
            { q: "O que é 'Zero Trust Architecture'?", a: "Modelo de segurança que nunca confia por padrão", d: ["Sistema que não possui firewall configurado", "Software que aceita qualquer usuário logado", "Rede local sem nenhuma criptografia ativa"] },
            { q: "Qual a finalidade de um 'Penetration Test'?", a: "Identificar vulnerabilidades exploráveis", d: ["Testar a velocidade de digitação do usuário", "Verificar a capacidade de carga da bateria", "Medir a latência do ping em rede local"] }
        ];
        const pick = scenarios[Math.min(level, scenarios.length - 1)];
        const options = this.shuffle([pick.a, ...pick.d]);
        return { question: `[IA ONYX] Cybersecurity:\n${pick.q}`, options, answer: options.indexOf(pick.a) };
    },

    // DevOps Engine
    engineCloudDevops(diff) {
        const level = diff === 'easy' ? 0 : (diff === 'medium' ? 1 : (diff === 'hard' ? 2 : 3));
        const scenarios = [
            { q: "O que é 'Infrastructure as Code' (IaC)?", a: "Gerenciar infraestrutura via arquivos de config", d: ["Escrever manuais de usuário em código", "Programar o hardware usando apenas assembly", "Criar sites usando ferramentas de design"] },
            { q: "Qual a vantagem do 'Docker Container'?", a: "Isolamento e portabilidade da aplicação", d: ["Aumento do consumo de memória RAM", "Exclusão automática de backups antigos", "Aceleração da velocidade da internet local"] },
            { q: "O que é 'CI/CD'?", a: "Integração e Entrega Contínuas", d: ["Criptografia de Dados e Comunicação", "Interface de Comando e Controle Digital", "Controle Interno de Dados e Cache"] },
            { q: "Explique 'Serverless Computing'?", a: "Execução de código sem gerenciar servidores", d: ["Uso de computadores sem nenhum processador", "Rede que funciona sem cabos ou roteadores", "Sistema que não salva dados permanentemente"] }
        ];
        const pick = scenarios[Math.min(level, scenarios.length - 1)];
        const options = this.shuffle([pick.a, ...pick.d]);
        return { question: `[IA ONYX] Cloud & DevOps:\n${pick.q}`, options, answer: options.indexOf(pick.a) };
    }
};
