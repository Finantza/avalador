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
    }
};
