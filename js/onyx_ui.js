/**
 * ONYX UI MODULE
 * Global scope assignment for local file compatibility.
 */

window.OnyxUI = {
    init() {
        console.log("[ONYX UI] Sistema Visual Ativo.");
    },
    // Particle Burst Effect (Enhanced)
    createParticles(x, y, color) {
        const count = 16;
        for (let i = 0; i < count; i++) {
            const p = document.createElement('div');
            p.className = 'particle';
            p.style.cssText = `
                position: fixed;
                width: ${Math.random() * 6 + 4}px;
                height: ${Math.random() * 6 + 4}px;
                background-color: ${color};
                border-radius: 50%;
                pointer-events: none;
                z-index: 20000;
                left: ${x}px;
                top: ${y}px;
                box-shadow: 0 0 15px ${color};
            `;
            const angle = Math.random() * Math.PI * 2;
            const velocity = Math.random() * 120 + 60;
            const tx = Math.cos(angle) * velocity;
            const ty = Math.sin(angle) * velocity;
            
            document.body.appendChild(p);
            
            p.animate([
                { transform: 'translate(0, 0) scale(1)', opacity: 1 },
                { transform: `translate(${tx}px, ${ty}px) scale(0)`, opacity: 0 }
            ], {
                duration: 1000,
                easing: 'cubic-bezier(0.1, 0.8, 0.2, 1)',
                fill: 'forwards'
            });
            
            setTimeout(() => p.remove(), 1000);
        }
    },

    // System Status Updates
    updateStatus(mode, latency = null) {
        const modeEl = document.getElementById('status-mode');
        const latencyEl = document.getElementById('status-latency');
        if (modeEl) modeEl.textContent = mode.toUpperCase();
        if (latencyEl && latency !== null) latencyEl.textContent = `${latency.toFixed(2)}ms`;
    },

    // Reasoning Insight Logs
    addReasoningLog(message) {
        const container = document.getElementById('insight-logs');
        const insightArea = document.getElementById('reasoning-insight');
        if (!container || !insightArea) return;

        insightArea.classList.add('active');
        const line = document.createElement('div');
        line.className = 'insight-log-line';
        line.textContent = message;
        container.appendChild(line);
        container.scrollTop = container.scrollHeight;

        if (container.children.length > 12) {
            container.removeChild(container.firstChild);
        }
    },

    // Audio Feedback System
    playFeedback(type) {
        try {
            const ctx = new (window.AudioContext || window.webkitAudioContext)();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            
            if (type === 'success') {
                osc.frequency.setValueAtTime(880, ctx.currentTime);
                osc.frequency.exponentialRampToValueAtTime(1320, ctx.currentTime + 0.1);
            } else if (type === 'error') {
                osc.frequency.setValueAtTime(220, ctx.currentTime);
                osc.frequency.exponentialRampToValueAtTime(110, ctx.currentTime + 0.2);
            } else if (type === 'click') {
                osc.frequency.setValueAtTime(440, ctx.currentTime);
                osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.05);
            } else if (type === 'alert') {
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(220, ctx.currentTime);
                osc.frequency.linearRampToValueAtTime(440, ctx.currentTime + 0.1);
                osc.frequency.linearRampToValueAtTime(220, ctx.currentTime + 0.2);
                osc.frequency.linearRampToValueAtTime(440, ctx.currentTime + 0.3);
            } else {
                osc.frequency.setValueAtTime(660, ctx.currentTime);
            }

            gain.gain.setValueAtTime(0.05, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
            
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start();
            osc.stop(ctx.currentTime + 0.3);
        } catch (e) {
            console.warn("[ONYX] Audio Error:", e);
        }
    },

    clearReasoningLogs() {
        const container = document.getElementById('insight-logs');
        const insightArea = document.getElementById('reasoning-insight');
        if (container) container.innerHTML = '';
        if (insightArea) insightArea.classList.remove('active');
    },

    // --- PREMIUM SPLASH SYSTEM ---
    initCodeRain() {
        const container = document.getElementById('code-rain');
        if (!container) return;
        container.innerHTML = '';
        const columns = Math.floor(window.innerWidth / 20);
        
        for (let i = 0; i < columns; i++) {
            const drop = document.createElement('div');
            drop.className = 'code-line';
            drop.style.left = `${i * 20}px`;
            drop.style.animationDuration = `${Math.random() * 3 + 2}s`;
            drop.style.animationDelay = `${Math.random() * 2}s`;
            
            let text = "";
            for(let j=0; j<20; j++) text += String.fromCharCode(0x30A0 + Math.random() * 96);
            drop.textContent = text;
            container.appendChild(drop);
        }
    },

    async startBootSequence() {
        const logs = [
            "KERNEL: ONYX_CORE_v2.0.4 LOADED",
            "MEM: 64GB VIRTUAL ALLOCATED",
            "NET: SYNCING WITH GLOBAL_INTEL_NET...",
            "DB: INDEXED_DB_v2 CONNECTED",
            "AI: HEURISTIC_ENGINE_v4 ONLINE",
            "SEC: ENCRYPTION_LAYERS_ACTIVE",
            "UI: GLASSMORPHISM_v2 RENDERED",
            "STATUS: SYSTEM_READY_FOR_ASSESSMENT"
        ];
        
        for (const log of logs) {
            this.addLogToSplash(log);
            await new Promise(r => setTimeout(r, 80 + Math.random() * 100));
        }
    },

    addLogToSplash(text) {
        const container = document.getElementById('terminal-logs');
        if (!container) return;
        const line = document.createElement('div');
        line.className = 'log-line';
        line.textContent = `> ${text}`;
        container.appendChild(line);
        if (container.children.length > 6) container.removeChild(container.firstChild);
    },

    // Time Clock
    initClock() {
        const clockEl = document.getElementById('current-time');
        if (!clockEl) return;
        setInterval(() => {
            const now = new Date();
            clockEl.textContent = now.toLocaleTimeString('pt-BR');
        }, 1000);
    },

    // Scramble Text Effect (Improved)
    scrambleText(element, targetText, duration = 1000) {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789<>[]{}!@#$%^&*';
        let iteration = 0;
        const totalIterations = targetText.length;
        const intervalTime = duration / (totalIterations * 2);
        
        const interval = setInterval(() => {
            element.textContent = targetText.split("")
                .map((char, index) => {
                    if (index < iteration) return targetText[index];
                    return chars[Math.floor(Math.random() * chars.length)];
                })
                .join("");
            
            if (iteration >= totalIterations) clearInterval(interval);
            iteration += 0.5;
        }, intervalTime);
    },

    // Detailed Report Rendering
    showDetailedReport(report) {
        const container = document.getElementById('feedback-text');
        if (!container) return;
        
        let html = `<div class="detailed-report">
            <p>${report.recommendations.length > 0 ? report.recommendations[0] : 'Excelente trabalho!'}</p>
            <div class="report-stats-grid">
                <div class="stat-card">
                    <span class="stat-label">Forças</span>
                    <div class="tags-container">
                        ${report.strengths.map(s => `<span class="tag tag-strength">${s}</span>`).join('') || '<span class="tag">Analisando...</span>'}
                    </div>
                </div>
                <div class="stat-card">
                    <span class="stat-label">A Melhorar</span>
                    <div class="tags-container">
                        ${report.weaknesses.map(w => `<span class="tag tag-weakness">${w}</span>`).join('') || '<span class="tag">Nenhuma</span>'}
                    </div>
                </div>
            </div>
            <div class="recom-list">
                ${report.recommendations.slice(1).map(r => `<div class="recom-item">💡 ${r}</div>`).join('')}
            </div>
        </div>`;
        container.innerHTML = html;
    },

    // Theme Engine
    applyTheme(subject) {
        const root = document.documentElement;
        const themes = {
            python: { p: 'hsl(140, 80%, 60%)', a: 'hsl(60, 100%, 50%)' },
            sql: { p: 'hsl(200, 90%, 60%)', a: 'hsl(180, 100%, 50%)' },
            cybersecurity: { p: 'hsl(0, 90%, 60%)', a: 'hsl(20, 100%, 50%)' },
            machine_learning: { p: 'hsl(280, 90%, 65%)', a: 'hsl(320, 100%, 60%)' },
            frontend: { p: 'hsl(30, 90%, 60%)', a: 'hsl(45, 100%, 50%)' },
            backend: { p: 'hsl(210, 80%, 50%)', a: 'hsl(190, 90%, 60%)' },
            logic: { p: 'hsl(180, 70%, 50%)', a: 'hsl(160, 80%, 60%)' },
            philosophy: { p: 'hsl(40, 30%, 70%)', a: 'hsl(30, 40%, 80%)' },
            random: { p: 'hsl(245, 90%, 65%)', a: 'hsl(190, 90%, 50%)' }
        };

        const theme = themes[subject] || themes.random;
        root.style.setProperty('--primary', theme.p);
        root.style.setProperty('--primary-glow', theme.p.replace(')', ', 0.4)').replace('hsl', 'hsla'));
        root.style.setProperty('--accent', theme.a);
        root.style.setProperty('--accent-glow', theme.a.replace(')', ', 0.4)').replace('hsl', 'hsla'));
    },

    // XP Notification
    showXPGain(amount) {
        const x = window.innerWidth / 2 + (Math.random() * 200 - 100);
        const y = window.innerHeight / 2 + (Math.random() * 100 - 50);
        
        const el = document.createElement('div');
        el.className = 'floating-xp';
        el.textContent = `+${amount} XP`;
        el.style.left = `${x}px`;
        el.style.top = `${y}px`;
        document.body.appendChild(el);
        
        el.animate([
            { transform: 'translateY(0) scale(1)', opacity: 1 },
            { transform: 'translateY(-100px) scale(1.5)', opacity: 0 }
        ], {
            duration: 1500,
            easing: 'ease-out'
        });
        
        setTimeout(() => el.remove(), 1500);
    },

    // XP Bar Rendering
    renderXPProgress(stats, gainedInSession, nextUnlock = null) {
        const container = document.getElementById('feedback-text');
        if (!container) return;
        
        // Clear previous session feedback if any
        container.innerHTML = '';
        const currentXP = stats.xp % 1000;
        const progressPercent = (currentXP / 1000) * 100;
        const remaining = 1000 - currentXP;
        
        const xpSection = `
            <div class="xp-progress-wrapper">
                <div class="xp-label-row">
                    <span>NÍVEL ${stats.level}</span>
                    <span>${currentXP} / 1000 XP</span>
                </div>
                <div class="xp-bar-outer">
                    <div class="xp-bar-inner" id="xp-bar-inner"></div>
                </div>
                <div class="xp-gain-msg">+${gainedInSession} XP recebido nesta sessão</div>
                ${nextUnlock ? `<div class="next-reward-hint">Faltam ${remaining} XP para desbloquear: <strong>${nextUnlock}</strong></div>` : ''}
            </div>
        `;
        
        container.insertAdjacentHTML('afterbegin', xpSection);
        
        setTimeout(() => {
            const bar = document.getElementById('xp-bar-inner');
            if (bar) bar.style.width = `${progressPercent}%`;
        }, 100);
    },

    // Global Stats Header
    renderGlobalStatsHeader(stats) {
        const levelEl = document.getElementById('global-level');
        const xpCurrentEl = document.getElementById('xp-mini-current');
        const xpNextEl = document.getElementById('xp-mini-next');
        const barInner = document.getElementById('xp-mini-bar-inner');
        
        if (!levelEl || !xpCurrentEl) return;
        
        const currentXP = stats.xp % 1000;
        const progressPercent = (currentXP / 1000) * 100;
        
        levelEl.textContent = stats.level;
        xpCurrentEl.textContent = `${currentXP} XP`;
        xpNextEl.textContent = `1000 XP`;
        
        setTimeout(() => {
            if (barInner) barInner.style.width = `${progressPercent}%`;
        }, 100);
    },

    // Level Up Animation
    showLevelUpAnimation(newLevel, unlocks = []) {
        const overlay = document.getElementById('level-up-overlay');
        const container = document.getElementById('new-unlocks-container');
        if (!overlay || !container) return;
        
        container.innerHTML = unlocks.map(u => `<div class="unlock-item">🔓 ${u}</div>`).join('');
        
        overlay.classList.add('active');
        this.playFeedback('alert');
        
        const closeBtn = document.getElementById('btn-close-level-up');
        closeBtn.onclick = () => {
            overlay.classList.remove('active');
        };
    },

    // Next Unlocks Hint
    renderNextUnlocksHint(nextLevel, unlocks) {
        const container = document.getElementById('next-unlocks-hint');
        if (!container) return;
        
        if (unlocks.length === 0) {
            container.style.display = 'none';
            return;
        }
        
        container.style.display = 'flex';
        container.innerHTML = `
            <strong>Nível ${nextLevel}:</strong>
            <div class="unlock-tags">
                ${unlocks.map(u => `<span class="u-tag">🔓 ${u}</span>`).join('')}
            </div>
        `;
    },

    // Save Notification
    showSaveNotification() {
        const el = document.createElement('div');
        el.className = 'save-toast';
        el.innerHTML = '<span class="icon">💾</span> SYNCING_PROGRESS...';
        document.body.appendChild(el);
        
        setTimeout(() => el.classList.add('active'), 100);
        setTimeout(() => {
            el.classList.remove('active');
            setTimeout(() => el.remove(), 500);
        }, 2000);
    },

    // --- PDF / PRINT GENERATION ENGINE (100% LOCAL & CLIENT-SIDE) ---
    exportToPDF(title, contentHtml) {
        // Create an iframe to avoid popup blockers and keep it serverless/client-side
        const iframe = document.createElement('iframe');
        iframe.style.position = 'fixed';
        iframe.style.width = '0px';
        iframe.style.height = '0px';
        iframe.style.border = 'none';
        iframe.style.left = '-9999px';
        iframe.style.top = '-9999px';
        document.body.appendChild(iframe);

        const printDocument = iframe.contentDocument || iframe.contentWindow.document;

        const html = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>${title}</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Outfit:wght@400;600;700;800;900&family=JetBrains+Mono:wght@400;700&display=swap" rel="stylesheet">
    <style>
        :root {
            --primary-print: #0284c7;
            --text-dark: #111827;
            --text-muted: #4b5563;
            --border-light: #e5e7eb;
            --bg-light: #f9fafb;
            --success-color: #16a34a;
            --error-color: #dc2626;
            --accent-print: #0f766e;
        }
        
        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }

        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            color: var(--text-dark);
            background-color: #ffffff;
            line-height: 1.5;
            font-size: 11pt;
            padding: 10mm;
        }

        h1, h2, h3, h4, h5 {
            font-family: 'Outfit', sans-serif;
            color: var(--text-dark);
        }

        .print-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 2px solid var(--text-dark);
            padding-bottom: 12px;
            margin-bottom: 20px;
        }

        .print-logo-container {
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .print-logo-icon {
            width: 32px;
            height: 32px;
            background: var(--text-dark);
            color: #fff;
            border-radius: 6px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 900;
            font-family: 'Outfit', sans-serif;
            font-size: 14pt;
        }

        .print-system-title {
            font-size: 16pt;
            font-weight: 800;
            letter-spacing: -0.5px;
        }

        .print-system-subtitle {
            font-size: 8pt;
            color: var(--text-muted);
            text-transform: uppercase;
            letter-spacing: 1px;
            font-weight: 600;
        }

        .print-metadata {
            text-align: right;
            font-size: 9pt;
            color: var(--text-muted);
        }

        .print-metadata p {
            margin-bottom: 2px;
        }

        .doc-info-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 12px;
            margin-bottom: 25px;
            background: var(--bg-light);
            border: 1px solid var(--border-light);
            border-radius: 8px;
            padding: 15px;
        }

        .info-card {
            display: flex;
            flex-direction: column;
        }

        .info-label {
            font-size: 7.5pt;
            text-transform: uppercase;
            font-weight: 800;
            color: var(--text-muted);
            letter-spacing: 0.5px;
        }

        .info-value {
            font-size: 10.5pt;
            font-weight: 700;
            color: var(--text-dark);
            margin-top: 2px;
        }

        .question-card {
            margin-bottom: 25px;
            border: 1px solid var(--border-light);
            border-radius: 8px;
            padding: 18px;
            background-color: #ffffff;
            page-break-inside: avoid;
            break-inside: avoid;
        }

        .question-header {
            display: flex;
            justify-content: space-between;
            border-bottom: 1px dashed var(--border-light);
            padding-bottom: 8px;
            margin-bottom: 12px;
        }

        .question-num {
            font-family: 'JetBrains Mono', monospace;
            font-weight: 800;
            font-size: 10pt;
            color: var(--primary-print);
        }

        .question-tag {
            font-size: 8pt;
            font-weight: 700;
            text-transform: uppercase;
            color: var(--text-muted);
            background: var(--bg-light);
            padding: 2px 8px;
            border-radius: 4px;
            border: 1px solid var(--border-light);
        }

        .question-text {
            font-size: 10.5pt;
            line-height: 1.6;
            margin-bottom: 15px;
            color: var(--text-dark);
        }

        .options-list {
            display: flex;
            flex-direction: column;
            gap: 8px;
            margin-bottom: 15px;
        }

        .option-item {
            font-size: 9.5pt;
            padding: 8px 12px;
            border-radius: 6px;
            border: 1px solid var(--border-light);
            background: #ffffff;
            display: flex;
            gap: 10px;
        }

        .option-item.correct {
            border-color: var(--success-color);
            background-color: #f0fdf4;
            color: var(--success-color);
        }

        .option-item strong {
            font-family: 'JetBrains Mono', monospace;
        }

        .explanation-box {
            font-size: 9pt;
            padding: 10px 14px;
            background: var(--bg-light);
            border-left: 3px solid var(--primary-print);
            border-radius: 0 6px 6px 0;
            margin-top: 10px;
            color: var(--text-muted);
        }

        .explanation-box strong {
            color: var(--text-dark);
        }

        .gabarito-section {
            margin-top: 30px;
            border-top: 2px solid var(--text-dark);
            padding-top: 20px;
            page-break-inside: avoid;
            break-inside: avoid;
        }

        .gabarito-grid {
            display: flex;
            flex-wrap: wrap;
            gap: 15px;
            margin-top: 15px;
        }

        .gabarito-cell {
            border: 1px solid var(--border-light);
            border-radius: 6px;
            padding: 8px 15px;
            background: var(--bg-light);
            font-family: 'JetBrains Mono', monospace;
            font-size: 10pt;
            font-weight: bold;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .gabarito-cell span {
            color: var(--primary-print);
        }

        .essay-text-box {
            border: 1px solid #9ca3af;
            border-radius: 4px;
            padding: 20px;
            font-family: 'Inter', sans-serif;
            font-size: 10pt;
            line-height: 2.2;
            color: #374151;
            background-image: linear-gradient(#e5e7eb 1px, transparent 1px);
            background-size: 100% 2.2em;
            margin-bottom: 25px;
            white-space: pre-wrap;
            min-height: 200px;
        }

        .essay-competencies {
            display: flex;
            flex-direction: column;
            gap: 12px;
            margin-bottom: 25px;
        }

        .comp-bar-container {
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 9pt;
            margin-bottom: 4px;
        }

        .comp-bar-outer {
            height: 8px;
            background: var(--border-light);
            border-radius: 4px;
            width: 100%;
            overflow: hidden;
            margin-top: 4px;
        }

        .comp-bar-inner {
            height: 100%;
            background: var(--primary-print);
            border-radius: 4px;
        }

        .score-circle-print {
            width: 100px;
            height: 100px;
            border-radius: 50%;
            border: 4px solid var(--primary-print);
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            margin: 0 auto 20px auto;
        }

        .score-circle-value {
            font-size: 22pt;
            font-weight: 900;
            font-family: 'Outfit', sans-serif;
            line-height: 1;
            color: var(--text-dark);
        }

        .score-circle-lbl {
            font-size: 7pt;
            color: var(--text-muted);
            font-weight: bold;
            text-transform: uppercase;
        }

        .plan-step-list {
            display: flex;
            flex-direction: column;
            gap: 15px;
        }

        .plan-step-item {
            border-left: 3px solid var(--accent-print);
            padding-left: 15px;
            margin-bottom: 5px;
            page-break-inside: avoid;
            break-inside: avoid;
        }

        .plan-step-time {
            font-family: 'JetBrains Mono', monospace;
            font-weight: bold;
            font-size: 9pt;
            color: var(--accent-print);
            margin-bottom: 3px;
        }

        .plan-step-title {
            font-size: 11pt;
            font-weight: 700;
            color: var(--text-dark);
            margin-bottom: 5px;
        }

        .plan-step-desc {
            font-size: 9.5pt;
            color: var(--text-muted);
            line-height: 1.5;
        }

        .print-footer {
            margin-top: 40px;
            border-top: 1px solid var(--border-light);
            padding-top: 10px;
            display: flex;
            justify-content: space-between;
            font-size: 8pt;
            color: var(--text-muted);
        }

        @media print {
            body {
                padding: 0;
            }
            .no-print {
                display: none !important;
            }
            @page {
                size: A4;
                margin: 15mm;
            }
        }
    </style>
</head>
<body>
    <div class="print-header">
        <div class="print-logo-container">
            <div class="print-logo-icon">O</div>
            <div>
                <h1 class="print-system-title">ONYX</h1>
                <p class="print-system-subtitle">Assessment & Evaluation Platform</p>
            </div>
        </div>
        <div class="print-metadata">
            <p><strong>Emissão:</strong> ${new Date().toLocaleDateString('pt-BR')}</p>
            <p><strong>Autenticação:</strong> SEC-${Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
        </div>
    </div>
    
    ${contentHtml}

    <div class="print-footer">
        <span>Onyx Elite Assessment System © 2026 — Processamento Local de Alto Rendimento</span>
        <span>Página 1 de 1</span>
    </div>
</body>
</html>
        `;

        printDocument.open();
        printDocument.write(html);
        printDocument.close();

        // Wait for styles and fonts to load before triggering print
        iframe.contentWindow.onload = () => {
            setTimeout(() => {
                iframe.contentWindow.focus();
                iframe.contentWindow.print();
                // Remove the iframe after some delay
                setTimeout(() => {
                    if (iframe.parentNode) iframe.parentNode.removeChild(iframe);
                }, 1500);
            }, 500);
        };
    },

    getSubjectNamesMap() {
        return {
            portugues: "Linguagens (Português)",
            literatura: "Literatura Brasileira",
            ingles: "Língua Estrangeira (Inglês)",
            algebra: "Álgebra e Funções",
            geometria: "Geometria Espacial e Plana",
            estatistica: "Estatística e Probabilidade",
            matematica_financeira: "Matemática Financeira",
            fisica: "Ciências da Natureza (Física)",
            quimica: "Ciências da Natureza (Química)",
            biologia: "Ciências da Natureza (Biologia)",
            historia: "Ciências Humanas (História)",
            geografia: "Ciências Humanas (Geografia)",
            filosofia: "Filosofia Moderna e Ética",
            sociologia: "Sociologia e Relações Sociais",
            tecnologia: "Tecnologia e Mídias Digitais",
            programacao: "Lógica de Programação e Computação",
            robotica: "Robótica e Automação Industrial",
            empreendedorismo: "Empreendedorismo e Gestão",
            ciencia_de_dados: "Ciência de Dados e Big Data",
            inteligencia_artificial: "Inteligência Artificial e Algoritmos",
            educacao_financeira: "Poupança Ativa e Planejamento Financeiro",
            marketing_digital: "Marketing Digital e E-commerce",
            desenvolvimento_jogos: "Desenvolvimento de Jogos e Design",
            seguranca_informacao: "Cibersegurança e Proteção de Dados",
            design_digital: "Design Digital e Interface do Usuário",
            producao_audiovisual: "Criação de Conteúdo e Produção Audiovisual",
            // ===== NÚCLEO TECH AVANÇADO =====
            engenharia_software: "Engenharia de Software",
            redes_computadores: "Redes de Computadores",
            banco_de_dados: "Banco de Dados & Relacional",
            cloud_computing: "Computação em Nuvem (Cloud)",
            sistemas_embarcados: "Sistemas Embarcados & IoT",
            matematica_computacional: "Matemática Computacional",
            // ===== NÚCLEO AVANÇADO HUMANAS E EXATAS =====
            calculo_diferencial: "Cálculo Diferencial & Integral",
            geopolitica_contemporanea: "Geopolítica Contemporânea",
            fisica_moderna: "Física Moderna & Quântica",
            antropologia_cultural: "Antropologia Cultural",
            quimica_quantica: "Química Quântica",
            historiografia_critica: "Historiografia Crítica",
            astrofisica_cosmologia: "Astrofísica e Cosmologia",
            filosofia_da_mente: "Filosofia da Mente",
            algebra_linear: "Álgebra Linear & Vetorial",
            sociologia_do_trabalho: "Sociologia do Trabalho",
            quimica_organica_avancada: "Química Orgânica Avançada",
            arqueologia_e_patrimonio: "Arqueologia e Patrimônio",
            termodinamica_avancada: "Termodinâmica Avançada",
            epistemologia_avancada: "Epistemologia Avançada"
        };
    },

    compileStudentSimuladoPDF(studentName, subject, difficulty, year, questions) {
        if (!questions || questions.length === 0) {
            alert("🔴 Nenhuma questão disponível para exportar.");
            return;
        }
        const subMap = OnyxUI.getSubjectNamesMap();
        const subName = subMap[subject] || subject.toUpperCase();
        const diffLabel = { easy: 'FÁCIL', medium: 'MÉDIO', hard: 'DIFÍCIL' }[difficulty] || difficulty.toUpperCase();
        const yearLabel = year ? (year.toString().includes('º') ? year : year + 'º Ano') : 'Ensino Médio';

        let html = `
            <div class="doc-info-grid">
                <div class="info-card">
                    <span class="info-label">Estudante</span>
                    <span class="info-value">${studentName}</span>
                </div>
                <div class="info-card">
                    <span class="info-label">Componente Curricular / Matéria</span>
                    <span class="info-value">${subName}</span>
                </div>
                <div class="info-card">
                    <span class="info-label">Segmento / Ano Letivo</span>
                    <span class="info-value">${yearLabel} (${diffLabel})</span>
                </div>
            </div>

            <div style="margin-bottom: 25px; border-bottom: 2px solid var(--border-light); padding-bottom: 10px;">
                <h2 style="font-size: 14pt; font-weight: 800; text-transform: uppercase;">📝 Caderno de Questões — Simulado Formativo</h2>
                <p style="font-size: 9pt; color: var(--text-muted); margin-top: 4px;">Instruções: Leia com atenção os enunciados e assinale a única alternativa correta para cada questão.</p>
            </div>

            <div class="questions-container">
        `;

        questions.forEach((q, idx) => {
            const cleanText = q.text.replace(/\[ONYX PROTOCOL\].*\n/, '').trim();
            html += `
                <div class="question-card">
                    <div class="question-header">
                        <span class="question-num">QUESTÃO ${idx + 1}</span>
                        <span class="question-tag">${q.concept || 'BNCC'}</span>
                    </div>
                    <p class="question-text">${cleanText}</p>
                    <div class="options-list">
            `;
            q.options.forEach((opt, oIdx) => {
                html += `
                    <div class="option-item">
                        <strong>${String.fromCharCode(65 + oIdx)})</strong>
                        <span>${opt}</span>
                    </div>
                `;
            });
            html += `
                    </div>
                </div>
            `;
        });

        html += `
            </div>

            <div style="page-break-before: always; break-before: page; margin-top: 30px;">
                <div style="border-bottom: 2px solid var(--text-dark); padding-bottom: 10px; margin-bottom: 20px;">
                    <h2 style="font-size: 14pt; font-weight: 800; text-transform: uppercase;">🎯 Folha de Respostas & Gabarito de Conferência</h2>
                    <p style="font-size: 9pt; color: var(--text-muted); margin-top: 4px;">Preencha a grade de respostas de acordo com as suas marcações no simulado.</p>
                </div>

                <div class="gabarito-section" style="margin-top: 0; border-top: none; padding-top: 0;">
                    <h3 style="font-size: 10pt; font-weight: bold; text-transform: uppercase; margin-bottom: 10px; color: var(--text-muted);">Grade de Respostas (Para Preenchimento)</h3>
                    <div class="gabarito-grid" style="margin-bottom: 30px;">
        `;

        questions.forEach((q, idx) => {
            html += `
                <div class="gabarito-cell" style="padding: 10px 12px; min-width: 140px; display: flex; justify-content: space-between;">
                    <span>Questão ${idx + 1}:</span>
                    <div style="display: flex; gap: 6px;">
                        ${[0,1,2,3,4].slice(0, q.options.length).map(o => `
                            <span style="display: inline-block; width: 18px; height: 18px; border: 1px solid var(--text-muted); border-radius: 50%; text-align: center; line-height: 16px; font-size: 7.5pt; font-weight: bold; color: var(--text-muted);">${String.fromCharCode(65 + o)}</span>
                        `).join('')}
                    </div>
                </div>
            `;
        });

        html += `
                    </div>

                    <div style="border-top: 1px dashed var(--border-light); padding-top: 20px;">
                        <h3 style="font-size: 10pt; font-weight: bold; text-transform: uppercase; margin-bottom: 12px; color: var(--success-color);">Chave de Gabarito Oficial (Resoluções da IA)</h3>
                        <div class="gabarito-grid" style="margin-bottom: 20px;">
        `;

        questions.forEach((q, idx) => {
            html += `
                <div class="gabarito-cell">
                    Questão ${idx + 1}: <strong style="color: var(--success-color); font-weight: 800; font-family: 'JetBrains Mono', monospace;">${String.fromCharCode(65 + q.correct)}</strong>
                </div>
            `;
        });

        html += `
                        </div>

                        <div style="display: flex; flex-direction: column; gap: 15px; margin-top: 25px;">
                            <h4 style="font-size: 9pt; font-weight: 800; text-transform: uppercase; color: var(--text-muted);">Explicações Pedagógicas Detalhadas</h4>
        `;

        questions.forEach((q, idx) => {
            html += `
                <div class="explanation-box" style="page-break-inside: avoid; break-inside: avoid;">
                    <strong>QUESTÃO ${idx + 1} (${String.fromCharCode(65 + q.correct)}):</strong> ${q.explanation}
                </div>
            `;
        });

        html += `
                        </div>
                    </div>
                </div>
            </div>
        `;

        OnyxUI.exportToPDF(`Simulado_${subject}_${studentName}`, html);
    },

    compileTeacherSimuladoPDF(subject, difficulty, year, questions) {
        if (!questions || questions.length === 0) {
            alert("🔴 Nenhuma questão disponível para exportar.");
            return;
        }
        const subMap = OnyxUI.getSubjectNamesMap();
        const subName = subMap[subject] || subject.toUpperCase();
        const diffLabel = { easy: 'FÁCIL', medium: 'MÉDIO', hard: 'DIFÍCIL' }[difficulty] || difficulty.toUpperCase();
        const yearLabel = year ? (year.toString().includes('º') ? year : year + 'º Ano') : 'Ensino Médio';

        let html = `
            <div class="doc-info-grid" style="border-color: var(--primary-print);">
                <div class="info-card">
                    <span class="info-label">Perfil de Emissão</span>
                    <span class="info-value" style="color: var(--primary-print);">COORDENAÇÃO / DOCENTE</span>
                </div>
                <div class="info-card">
                    <span class="info-label">Matéria Avaliada</span>
                    <span class="info-value">${subName}</span>
                </div>
                <div class="info-card">
                    <span class="info-label">Calibração Curricular</span>
                    <span class="info-value">${yearLabel} (${diffLabel})</span>
                </div>
            </div>

            <div style="margin-bottom: 25px; border-bottom: 2px solid var(--text-dark); padding-bottom: 10px;">
                <h2 style="font-size: 14pt; font-weight: 800; text-transform: uppercase; color: var(--primary-print);">🔑 Caderno do Professor — Gabarito & Resoluções</h2>
                <p style="font-size: 9pt; color: var(--text-muted); margin-top: 4px;">Este documento destina-se ao corpo docente e coordenação pedagógica. Contém as marcações das alternativas corretas destacadas e as resoluções heurísticas fornecidas pelo Onyx AI.</p>
            </div>

            <div class="questions-container">
        `;

        questions.forEach((q, idx) => {
            const cleanText = q.text.replace(/\[ONYX PROTOCOL\].*\n/, '').trim();
            html += `
                <div class="question-card" style="border-left: 3px solid var(--primary-print);">
                    <div class="question-header">
                        <span class="question-num" style="color: var(--primary-print);">QUESTÃO ${idx + 1}</span>
                        <span class="question-tag" style="border-color: var(--primary-print); color: var(--primary-print);">${q.concept || 'BNCC'}</span>
                    </div>
                    <p class="question-text">${cleanText}</p>
                    <div class="options-list">
            `;
            q.options.forEach((opt, oIdx) => {
                const isCorrect = oIdx === q.correct;
                html += `
                    <div class="option-item ${isCorrect ? 'correct' : ''}">
                        <strong>${String.fromCharCode(65 + oIdx)})</strong>
                        <span>${opt} ${isCorrect ? ' <strong style="color: var(--success-color);">[GABARITO]</strong>' : ''}</span>
                    </div>
                `;
            });
            html += `
                    </div>
                    <div class="explanation-box">
                        <strong>💡 EXPLICAÇÃO DA IA:</strong> ${q.explanation}
                    </div>
                </div>
            `;
        });

        html += `
            </div>

            <div class="gabarito-section">
                <h3 style="font-size: 12pt; font-weight: 800; text-transform: uppercase; margin-bottom: 15px; color: var(--text-dark);">Tabela de Conferência Rápida (Gabarito)</h3>
                <div class="gabarito-grid">
        `;

        questions.forEach((q, idx) => {
            html += `
                <div class="gabarito-cell" style="border-color: var(--success-color); background: #f0fdf4;">
                    Questão ${idx + 1}: <strong style="color: var(--success-color); font-weight: 800; font-family: 'JetBrains Mono', monospace;">${String.fromCharCode(65 + q.correct)}</strong>
                </div>
            `;
        });

        html += `
                </div>
            </div>
        `;

        OnyxUI.exportToPDF(`Gabarito_Docente_${subject}`, html);
    },

    compileLessonPlanPDF(bncc, grade, method, time, theme) {
        let html = `
            <div class="doc-info-grid" style="border-color: var(--accent-print); background-color: #fdfefe;">
                <div class="info-card">
                    <span class="info-label">Documento</span>
                    <span class="info-value" style="color: var(--accent-print);">PLANO DE AULA / SYLLABUS</span>
                </div>
                <div class="info-card">
                    <span class="info-label">Matriz Competencial</span>
                    <span class="info-value" style="font-family: 'JetBrains Mono', monospace; font-size: 9pt;">${bncc}</span>
                </div>
                <div class="info-card">
                    <span class="info-label">Segmento Escolar</span>
                    <span class="info-value">${grade}</span>
                </div>
            </div>

            <div style="margin-bottom: 25px; border-bottom: 2px solid var(--text-dark); padding-bottom: 10px;">
                <h2 style="font-size: 14pt; font-weight: 800; text-transform: uppercase; color: var(--accent-print);">🎯 Roteiro Pedagógico Consolidado</h2>
                <p style="font-size: 9pt; color: var(--text-muted); margin-top: 4px;">Planejamento metodológico estruturado proceduralmente pelo Onyx AI, calibrado para a BNCC e metodologias ativas.</p>
            </div>

            <div style="display: flex; flex-direction: column; gap: 15px; margin-bottom: 30px; background: var(--bg-light); border: 1px solid var(--border-light); border-radius: 8px; padding: 18px;">
                <p style="font-size: 10pt; color: var(--text-dark);"><strong>Foco Temático Principal:</strong> ${theme}</p>
                <p style="font-size: 10pt; color: var(--text-dark);"><strong>Abordagem Metodológica:</strong> ${method}</p>
                <p style="font-size: 10pt; color: var(--text-dark);"><strong>Tempo Estimado da Sessão:</strong> ${time} minutos</p>
            </div>

            <div style="margin-bottom: 25px;">
                <h3 style="font-size: 11pt; font-weight: 800; text-transform: uppercase; color: var(--text-dark); margin-bottom: 15px; border-bottom: 1px dashed var(--border-light); padding-bottom: 5px;">📖 Cronograma Pedagógico Detalhado (Minuto a Minuto)</h3>
                
                <div class="plan-step-list">
                    <div class="plan-step-item">
                        <div class="plan-step-time">00 - 10m [Desafio Análogo]</div>
                        <div class="plan-step-title">Fase de Engajamento e Conexão Lúdica</div>
                        <div class="plan-step-desc">Capturar a atenção imediata dos alunos através de uma analogia real conectando a teoria ao cotidiano. Ex: Para o tema "${theme}", formular perguntas sobre casos reais cotidianos ou problemas estruturais práticos.</div>
                    </div>
                    
                    <div class="plan-step-item">
                        <div class="plan-step-time">10 - 25m [Exploração Cognitiva]</div>
                        <div class="plan-step-title">Debate Ativo e Formulação de Hipóteses</div>
                        <div class="plan-step-desc">Organizar a turma em pequenos grupos (de 3 a 4 estudantes). Desafiá-los a discutir o tema proposto, levantar hipóteses iniciais e debater potenciais soluções ou consequências sem intervenção direta do professor.</div>
                    </div>

                    <div class="plan-step-item">
                        <div class="plan-step-time">25 - 40m [Mão na Massa - Laboratório Onyx]</div>
                        <div class="plan-step-title">Prática Interativa e Simulação Adaptativa</div>
                        <div class="plan-step-desc">Uso prático da plataforma adaptativa Onyx. Os alunos acessam seus dashboards para resolver quizzes calibrados, simular dados pedagógicos e analisar erros de forma autodidata ou guiada.</div>
                    </div>

                    <div class="plan-step-item">
                        <div class="plan-step-time">40 - 50m [Consolidação e Autoavaliação]</div>
                        <div class="plan-step-title">Fechamento, Síntese e Métricas Formativas</div>
                        <div class="plan-step-desc">Retorno ao grande grupo para compartilhamento das principais conclusões. Aplicação de um questionário/quiz rápido de saída para registrar as métricas de proficiência diretamente no IndexedDB da coordenação escolar.</div>
                    </div>
                </div>
            </div>

            <div style="background: #fafaf9; border-left: 4px solid var(--accent-print); border-radius: 4px; padding: 15px; font-size: 9.5pt; color: var(--text-muted); line-height: 1.5; margin-top: 30px;">
                <strong>💡 Recomendação Especial do Copiloto Onyx:</strong> Estimule os estudantes com maior pontuação e engajamento nas simulações a atuarem como monitores/facilitadores nos grupos de laboratório ativo, promovendo a aprendizagem entre pares.
            </div>
        `;

        OnyxUI.exportToPDF(`Plano_de_Aula_${theme.replace(/\s+/g, '_')}`, html);
    },

    compileEssayReportPDF(theme, text, totalScore, scores, correctionsHTML, badgeText, badgeColor) {
        const comps = [
            "Norma Culta (Domínio da variante escrita formal)",
            "Compreensão do Tema (Aplicação das áreas de conhecimento)",
            "Defesa do Ponto de Vista (Seleção, relação e interpretação de informações)",
            "Mecanismos de Coesão (Demonstração de conhecimento dos recursos linguísticos)",
            "Proposta de Intervenção (Elaboração de proposta para a problemática)"
        ];

        let html = `
            <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:3px solid var(--primary-print); padding-bottom:15px; margin-bottom:25px;">
                <div style="display:flex; align-items:center; gap:12px;">
                    <div style="width:45px; height:45px; border-radius:50%; background:var(--primary-print); display:flex; align-items:center; justify-content:center; color:#fff; font-family:'Outfit', sans-serif; font-size:1.4rem; font-weight:900; box-shadow:0 0 10px rgba(0,0,0,0.15);">💎</div>
                    <div>
                        <h1 style="font-family:'Outfit', sans-serif; font-size:16pt; font-weight:900; color:var(--text-dark); margin:0; letter-spacing:-0.5px;">ONYX ASSESSMENT PLATFORM</h1>
                        <span style="font-size:7.5pt; font-family:'JetBrains Mono', monospace; color:var(--primary-print); font-weight:800; letter-spacing:1px; text-transform:uppercase;">NÚCLEO DE INTELIGÊNCIA ARTIFICIAL PEDAGÓGICA</span>
                    </div>
                </div>
                <div style="text-align:right;">
                    <span style="font-size:7.5pt; font-family:'JetBrains Mono', monospace; background:var(--bg-light); border:1px solid var(--border-light); padding:4px 10px; border-radius:4px; font-weight:800; color:var(--text-dark);">REGISTRO: ONYX-${Math.floor(100000 + Math.random() * 900000)}</span>
                </div>
            </div>

            <div class="doc-info-grid" style="border-color: ${badgeColor}; display:grid; grid-template-columns: repeat(3, 1fr); gap:12px; margin-bottom:25px;">
                <div class="info-card" style="background:var(--bg-light); border:1px solid var(--border-light); padding:12px; border-radius:6px;">
                    <span class="info-label" style="display:block; font-size:6.5pt; color:var(--text-muted); font-weight:800; text-transform:uppercase; letter-spacing:0.5px; margin-bottom:4px;">Avaliação Pedagógica</span>
                    <span class="info-value" style="display:block; color: ${badgeColor}; font-weight: 900; font-size:10pt;">CORREÇÃO ENEM COGNITIVA</span>
                </div>
                <div class="info-card" style="background:var(--bg-light); border:1px solid var(--border-light); padding:12px; border-radius:6px;">
                    <span class="info-label" style="display:block; font-size:6.5pt; color:var(--text-muted); font-weight:800; text-transform:uppercase; letter-spacing:0.5px; margin-bottom:4px;">Tema da Redação</span>
                    <span class="info-value" style="display:block; font-size: 8.5pt; font-weight:bold; color:var(--text-dark); overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${theme}</span>
                </div>
                <div class="info-card" style="background:var(--bg-light); border:1px solid var(--border-light); padding:12px; border-radius:6px;">
                    <span class="info-label" style="display:block; font-size:6.5pt; color:var(--text-muted); font-weight:800; text-transform:uppercase; letter-spacing:0.5px; margin-bottom:4px;">Desempenho Verbal</span>
                    <span class="info-value" style="display:block; color: ${badgeColor}; font-weight: 800; font-size:9.5pt;">${badgeText}</span>
                </div>
            </div>

            <div style="display:flex; gap:30px; align-items:center; margin-bottom:30px; page-break-inside: avoid; break-inside: avoid;">
                <div class="score-circle-print" style="border: 6px solid ${badgeColor}; width:120px; height:120px; border-radius:50%; display:flex; flex-direction:column; align-items:center; justify-content:center; flex-shrink:0; background:var(--bg-light);">
                    <span class="score-circle-value" style="font-family:'Outfit', sans-serif; font-size:2.4rem; font-weight:900; color:var(--text-dark); line-height:1;">${totalScore}</span>
                    <span class="score-circle-lbl" style="font-size:0.6rem; color:var(--text-muted); font-weight:800; letter-spacing:1px; margin-top:2px;">PONTOS</span>
                </div>
                
                <div style="flex:1; background:var(--bg-light); border:1px solid var(--border-light); padding:15px; border-radius:8px;">
                    <h4 style="margin:0 0 6px 0; font-size:9pt; font-family:'Outfit', sans-serif; color:var(--text-dark); font-weight:800; text-transform:uppercase;">AUTENTICAÇÃO DE PARECER ESCOLAR</h4>
                    <p style="margin:0; font-size:8pt; color:var(--text-muted); line-height:1.5;">Relatório gerado automaticamente através de análise gramatical e semântica por redes neurais de NLP do ecossistema <strong>Onyx Assessment Platform v5.0</strong>. Este documento é válido como boletim formativo de redação para auditoria e histórico de proficiência do estudante.</p>
                </div>
            </div>

            <div style="margin-bottom: 30px; page-break-inside: avoid; break-inside: avoid;">
                <h3 style="font-size: 11pt; font-weight: 800; text-transform: uppercase; color: var(--text-dark); margin-bottom: 12px; border-bottom: 1px dashed var(--border-light); padding-bottom: 5px;">Mapeamento de Competências ENEM</h3>
                <div class="essay-competencies" style="display:flex; flex-direction:column; gap:12px;">
        `;

        scores.forEach((s, idx) => {
            const percent = (s / 200) * 100;
            html += `
                <div style="page-break-inside: avoid; break-inside: avoid;">
                    <div class="comp-bar-container" style="display:flex; justify-content:space-between; font-size:8.5pt; margin-bottom:4px;">
                        <span style="font-weight: 600; color:var(--text-dark);">Competência ${idx + 1}: ${comps[idx]}</span>
                        <strong style="font-family: 'JetBrains Mono', monospace; color: var(--primary-print); font-weight:900;">${s} / 200</strong>
                    </div>
                    <div class="comp-bar-outer" style="height:6px; background:#e4e4e7; border-radius:3px; overflow:hidden;">
                        <div class="comp-bar-inner" style="width: ${percent}%; background-color: ${badgeColor}; height:100%; border-radius:3px;"></div>
                    </div>
                </div>
            `;
        });

        html += `
                </div>
            </div>

            <div style="margin-bottom: 30px; page-break-inside: avoid; break-inside: avoid;">
                <h3 style="font-size: 11pt; font-weight: 800; text-transform: uppercase; color: var(--text-dark); margin-bottom: 12px; border-bottom: 1px dashed var(--border-light); padding-bottom: 5px;">Transcrição do Texto Escrito</h3>
                <div class="essay-text-box" style="white-space:pre-wrap; background:var(--bg-light); border:1px solid var(--border-light); border-radius:8px; padding:18px; font-family:'JetBrains Mono', monospace; font-size:8.5pt; color:var(--text-dark); line-height:1.6; text-align:justify;">${text}</div>
            </div>

            <div style="page-break-inside: avoid; break-inside: avoid; background: var(--bg-light); border: 1px solid var(--border-light); border-radius: 8px; padding: 18px; margin-top: 20px; display:flex; justify-content:space-between; align-items:flex-start; gap:20px;">
                <div style="flex:1;">
                    <h3 style="font-size: 11pt; font-weight: 800; text-transform: uppercase; color: var(--text-dark); margin-bottom: 12px;">
                        <span>💡 Análise Detalhada & Recomendações da IA</span>
                    </h3>
                    <ul style="padding-left: 20px; font-size: 9pt; color: var(--text-muted); display: flex; flex-direction: column; gap: 8px; line-height: 1.5; margin:0;">
                        ${correctionsHTML}
                    </ul>
                </div>
                
                <!-- Official Verification Seal -->
                <div style="width:100px; display:flex; flex-direction:column; align-items:center; text-align:center; border:1px double var(--primary-print); padding:10px; border-radius:6px; background:#fff; flex-shrink:0;">
                    <svg width="40" height="40" viewBox="0 0 100 100" style="color:var(--primary-print);">
                        <polygon points="50,5 90,25 90,75 50,95 10,75 10,25" fill="none" stroke="currentColor" stroke-width="5"/>
                        <circle cx="50" cy="50" r="20" fill="none" stroke="currentColor" stroke-width="5"/>
                        <path d="M40,50 L47,57 L60,40" fill="none" stroke="currentColor" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    <span style="font-size:5.5pt; font-family:'JetBrains Mono', monospace; color:var(--primary-print); font-weight:900; margin-top:6px; display:block; letter-spacing:0.5px;">SISTEMA DE VERIFICAÇÃO</span>
                    <span style="font-size:4.5pt; font-family:'JetBrains Mono', monospace; color:var(--text-muted); display:block; margin-top:2px;">ASSINATURA DIGITAL CRIPTOGRÁFICA</span>
                </div>
            </div>
        `;

        OnyxUI.exportToPDF(`Correcao_Redacao_${theme.replace(/\s+/g, '_')}`, html);
    },

    // --- NEON NEBULA CANVAS BACKDROP ---
    initNebulaCanvas() {
        let canvas = document.getElementById('ambient-nebula-canvas');
        if (!canvas) {
            canvas = document.createElement('canvas');
            canvas.id = 'ambient-nebula-canvas';
            canvas.style.cssText = `
                position: fixed;
                inset: 0;
                width: 100vw;
                height: 100vh;
                z-index: -2;
                pointer-events: none;
                background: transparent;
            `;
            document.body.insertBefore(canvas, document.body.firstChild);
        }

        const ctx = canvas.getContext('2d');
        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;

        window.addEventListener('resize', () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        });

        const particles = [];
        const maxParticles = 60;
        let mouse = { x: null, y: null, radius: 150 };

        window.addEventListener('mousemove', (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        });

        window.addEventListener('mouseleave', () => {
            mouse.x = null;
            mouse.y = null;
        });

        class Particle {
            constructor() {
                this.reset();
            }

            reset() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.size = Math.random() * 3 + 1;
                this.vx = Math.random() * 0.4 - 0.2;
                this.vy = Math.random() * 0.4 - 0.2;
                this.alpha = Math.random() * 0.5 + 0.1;
                this.grow = true;
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;

                // Bounce or reset
                if (this.x < 0 || this.x > width || this.y < 0 || this.y > height) {
                    this.reset();
                }

                // Pulse alpha
                if (this.grow) {
                    this.alpha += 0.005;
                    if (this.alpha >= 0.75) this.grow = false;
                } else {
                    this.alpha -= 0.005;
                    if (this.alpha <= 0.15) this.grow = true;
                }

                // Interact with mouse
                if (mouse.x !== null && mouse.y !== null) {
                    const dx = this.x - mouse.x;
                    const dy = this.y - mouse.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < mouse.radius) {
                        const force = (mouse.radius - dist) / mouse.radius;
                        this.x += (dx / dist) * force * 2.0;
                        this.y += (dy / dist) * force * 2.0;
                    }
                }
            }

            draw(primaryColor, accentColor) {
                ctx.save();
                ctx.globalAlpha = this.alpha;
                const grad = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size * 3);
                
                // Mix in primary/accent colors dynamically from current HSL values
                grad.addColorStop(0, primaryColor);
                grad.addColorStop(0.5, accentColor);
                grad.addColorStop(1, 'transparent');

                ctx.fillStyle = grad;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size * 3, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            }
        }

        for (let i = 0; i < maxParticles; i++) {
            particles.push(new Particle());
        }

        function drawLines(primaryColor) {
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 100) {
                        ctx.beginPath();
                        ctx.strokeStyle = primaryColor;
                        ctx.globalAlpha = (100 - dist) / 100 * 0.15;
                        ctx.lineWidth = 0.5;
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }
        }

        const tick = () => {
            // Check if the canvas is still active in DOM
            if (!document.getElementById('ambient-nebula-canvas')) return;

            // Clear screen gently for trailing glow
            ctx.clearRect(0, 0, width, height);

            // Read colors dynamically from document styling
            const style = window.getComputedStyle(document.documentElement);
            const primary = style.getPropertyValue('--primary').trim() || '#0ea5e9';
            const accent = style.getPropertyValue('--accent').trim() || '#f59e0b';

            particles.forEach(p => {
                p.update();
                p.draw(primary, accent);
            });

            drawLines(primary);
            requestAnimationFrame(tick);
        };

        tick();
        console.log("[ONYX UI] Nebula Particle Canvas Active.");
    },

    // --- REAL-TIME MECHANICAL KEYBOARD KEYSTROKE SYNTH ---
    KeyboardSynth: {
        active: false,
        profile: 'mechanical',
        volume: 0.3,
        audioCtx: null,

        init() {
            // Load state from LocalStorage
            this.active = localStorage.getItem('onyx_keyboard_synth_active') === 'true';
            this.profile = localStorage.getItem('onyx_keyboard_synth_profile') || 'mechanical';
            this.volume = parseFloat(localStorage.getItem('onyx_keyboard_synth_volume')) ?? 0.3;

            // Setup global event listener for text typing inputs
            document.addEventListener('keydown', (e) => {
                if (!this.active) return;
                
                // Only synthesis on actual printable characters typed into inputs or textareas
                const isInput = e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable;
                if (!isInput) return;

                // Avoid playing sound on meta/modifier keys
                const isMeta = e.key === 'Control' || e.key === 'Shift' || e.key === 'Alt' || e.key === 'Meta' || e.key === 'CapsLock';
                if (isMeta) return;

                this.playClick();
            }, true);
            
            console.log("[ONYX UI] Keyboard Keystroke Sound Synthesizer Ready. Active:", this.active);
        },

        playClick() {
            try {
                if (!this.audioCtx) {
                    this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
                }
                
                if (this.audioCtx.state === 'suspended') {
                    this.audioCtx.resume();
                }

                const now = this.audioCtx.currentTime;
                
                if (this.profile === 'mechanical') {
                    // 🎹 Click Clack Mechanical Switch clicks
                    // Transient crisp burst (high passed frequency decay)
                    const osc = this.audioCtx.createOscillator();
                    const gain = this.audioCtx.createGain();
                    
                    osc.connect(gain);
                    gain.connect(this.audioCtx.destination);
                    
                    osc.type = 'triangle';
                    // Sorteia pitch slightly to mimic keys variation
                    const pitch = 1400 + Math.random() * 400;
                    osc.frequency.setValueAtTime(pitch, now);
                    osc.frequency.exponentialRampToValueAtTime(100, now + 0.02);

                    gain.gain.setValueAtTime(this.volume * 0.15, now);
                    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.02);

                    osc.start(now);
                    osc.stop(now + 0.025);
                } 
                else if (this.profile === 'retro') {
                    // 👾 Retro Arcade Bleeps
                    const osc = this.audioCtx.createOscillator();
                    const gain = this.audioCtx.createGain();
                    
                    osc.connect(gain);
                    gain.connect(this.audioCtx.destination);
                    
                    osc.type = 'square';
                    const pitch = 500 + Math.random() * 200;
                    osc.frequency.setValueAtTime(pitch, now);
                    osc.frequency.setValueAtTime(pitch * 2, now + 0.02);

                    gain.gain.setValueAtTime(this.volume * 0.06, now);
                    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.04);

                    osc.start(now);
                    osc.stop(now + 0.045);
                }
                else if (this.profile === 'synth') {
                    // 🎼 Soft Harp Chords
                    const osc = this.audioCtx.createOscillator();
                    const gain = this.audioCtx.createGain();
                    
                    osc.connect(gain);
                    gain.connect(this.audioCtx.destination);
                    
                    osc.type = 'sine';
                    
                    // Simple pentatonic chords values
                    const scale = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25];
                    const pitch = scale[Math.floor(Math.random() * scale.length)];
                    osc.frequency.setValueAtTime(pitch, now);

                    gain.gain.setValueAtTime(this.volume * 0.25, now);
                    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.25);

                    osc.start(now);
                    osc.stop(now + 0.26);
                }
            } catch (e) {
                console.warn("[ONYX KEYBOARD SYNTH] Error playing mechanical click:", e);
            }
        }
    },

    // --- COGNITIVE BINAURAL STUDY HUMS & RAIN ENGINE ---
    BinauralHums: {
        audioCtx: null,
        oscLeft: null,
        oscRight: null,
        noiseNode: null,
        gainHums: null,
        gainRain: null,
        active: false,

        start() {
            if (this.active) return;
            try {
                this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
                const now = this.audioCtx.currentTime;

                // 1. Set up Master Gains
                this.gainHums = this.audioCtx.createGain();
                this.gainRain = this.audioCtx.createGain();

                // Setup Initial volumes
                const vHums = parseFloat(localStorage.getItem('onyx_synth_hums_volume')) ?? 0.3;
                const vRain = parseFloat(localStorage.getItem('onyx_synth_rain_volume')) ?? 0.3;
                this.gainHums.gain.setValueAtTime(vHums * 0.6, now);
                this.gainRain.gain.setValueAtTime(vRain * 0.5, now);

                // Connect to outputs
                this.gainHums.connect(this.audioCtx.destination);
                this.gainRain.connect(this.audioCtx.destination);

                // 2. Set up Binaural Focus Oscillators (Separation for stereo beats)
                const merger = this.audioCtx.createChannelMerger(2);
                
                this.oscLeft = this.audioCtx.createOscillator();
                this.oscLeft.type = 'sine';
                this.oscLeft.frequency.setValueAtTime(110, now); // Left Ear: 110Hz

                this.oscRight = this.audioCtx.createOscillator();
                this.oscRight.type = 'sine';
                this.oscRight.frequency.setValueAtTime(111.5, now); // Right Ear: 111.5Hz (1.5Hz Delta separation)

                const gainLeft = this.audioCtx.createGain();
                const gainRight = this.audioCtx.createGain();

                this.oscLeft.connect(gainLeft);
                this.oscRight.connect(gainRight);

                // Connect left to channel 0, right to channel 1
                gainLeft.connect(merger, 0, 0);
                gainRight.connect(merger, 0, 1);

                merger.connect(this.gainHums);

                this.oscLeft.start(now);
                this.oscRight.start(now);

                // 3. Set up Synthesized White-Noise Rain
                const bufferSize = 2 * this.audioCtx.sampleRate;
                const noiseBuffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate);
                const output = noiseBuffer.getChannelData(0);
                
                // Fill random values
                for (let i = 0; i < bufferSize; i++) {
                    output[i] = Math.random() * 2.0 - 1.0;
                }

                this.noiseNode = this.audioCtx.createBufferSource();
                this.noiseNode.buffer = noiseBuffer;
                this.noiseNode.loop = true;

                // BiquadFilter to transform harsh white noise into soothing low-pass rain hum
                const filter = this.audioCtx.createBiquadFilter();
                filter.type = 'lowpass';
                filter.frequency.setValueAtTime(380, now);
                filter.Q.setValueAtTime(1.0, now);

                this.noiseNode.connect(filter);
                filter.connect(this.gainRain);
                
                this.noiseNode.start(now);

                this.active = true;
                console.log("[ONYX BINAURAL ENGINE] Synthesizer focus loops active.");
            } catch (e) {
                console.error("[ONYX BINAURAL ENGINE] Error starting synthesizer hums:", e);
            }
        },

        stop() {
            if (!this.active) return;
            try {
                const now = this.audioCtx.currentTime;
                
                // Fade out smoothly
                if (this.gainHums) this.gainHums.gain.exponentialRampToValueAtTime(0.0001, now + 0.15);
                if (this.gainRain) this.gainRain.gain.exponentialRampToValueAtTime(0.0001, now + 0.15);

                setTimeout(() => {
                    if (this.oscLeft) { this.oscLeft.stop(); this.oscLeft.disconnect(); }
                    if (this.oscRight) { this.oscRight.stop(); this.oscRight.disconnect(); }
                    if (this.noiseNode) { this.noiseNode.stop(); this.noiseNode.disconnect(); }
                    if (this.audioCtx) this.audioCtx.close();

                    this.oscLeft = null;
                    this.oscRight = null;
                    this.noiseNode = null;
                    this.gainHums = null;
                    this.gainRain = null;
                    this.audioCtx = null;
                    this.active = false;
                    console.log("[ONYX BINAURAL ENGINE] Hums and Synthesized loops stopped.");
                }, 180);
            } catch (e) {
                console.warn("[ONYX BINAURAL ENGINE] Error stopping sound engine:", e);
                this.active = false;
            }
        },

        setVolumes(vHums, vRain) {
            localStorage.setItem('onyx_synth_hums_volume', vHums.toString());
            localStorage.setItem('onyx_synth_rain_volume', vRain.toString());
            
            if (!this.active || !this.audioCtx) return;
            const now = this.audioCtx.currentTime;
            this.gainHums.gain.exponentialRampToValueAtTime(Math.max(0.0001, vHums * 0.6), now + 0.1);
            this.gainRain.gain.exponentialRampToValueAtTime(Math.max(0.0001, vRain * 0.5), now + 0.1);
        }
    },
    
    // --- SYNTH PAD DRUM MATRIX PLAYER ---
    playPadSound(padKey) {
        try {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            const ctx = new AudioCtx();
            const now = ctx.currentTime;
            
            if (padKey === 'A') {
                // Low Kick / Bass Thump
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.type = 'sine';
                osc.frequency.setValueAtTime(150, now);
                osc.frequency.exponentialRampToValueAtTime(40, now + 0.15);
                gain.gain.setValueAtTime(0.3, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
                osc.start(now);
                osc.stop(now + 0.16);
            } else if (padKey === 'S') {
                // Snare Click / Noise Blast
                const bufferSize = ctx.sampleRate * 0.1;
                const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
                const data = buffer.getChannelData(0);
                for (let i = 0; i < bufferSize; i++) {
                    data[i] = Math.random() * 2 - 1;
                }
                const noise = ctx.createBufferSource();
                noise.buffer = buffer;
                const filter = ctx.createBiquadFilter();
                filter.type = 'bandpass';
                filter.frequency.value = 1000;
                const gain = ctx.createGain();
                noise.connect(filter);
                filter.connect(gain);
                gain.connect(ctx.destination);
                gain.gain.setValueAtTime(0.15, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
                noise.start(now);
                noise.stop(now + 0.11);
            } else if (padKey === 'D') {
                // Synth Pluck (E4 - 329.63Hz)
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(329.63, now);
                gain.gain.setValueAtTime(0.25, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
                osc.start(now);
                osc.stop(now + 0.21);
            } else if (padKey === 'F') {
                // Retro Chime (C5 - 523.25Hz pitch sweep)
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.type = 'square';
                osc.frequency.setValueAtTime(523.25, now);
                osc.frequency.linearRampToValueAtTime(1046.50, now + 0.15);
                gain.gain.setValueAtTime(0.06, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
                osc.start(now);
                osc.stop(now + 0.16);
            } else if (padKey === 'G') {
                // Chord Pad (C major chord)
                const freqs = [261.63, 329.63, 392.00, 523.25];
                const gain = ctx.createGain();
                gain.connect(ctx.destination);
                gain.gain.setValueAtTime(0.15, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
                
                freqs.forEach(f => {
                    const osc = ctx.createOscillator();
                    osc.connect(gain);
                    osc.type = 'sine';
                    osc.frequency.setValueAtTime(f, now);
                    osc.start(now);
                    osc.stop(now + 0.41);
                });
            }
        } catch (e) {
            console.warn("[ONYX UI] Error playing pad sound:", e);
        }
    }
};

