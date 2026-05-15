/**
 * ONYX UI MODULE
 * Handles animations, particles, code rain, and system status updates.
 */

export const OnyxUI = {
    // Particle Burst Effect
    createParticles(x, y, color) {
        const count = 12;
        for (let i = 0; i < count; i++) {
            const p = document.createElement('div');
            p.className = 'particle';
            p.style.cssText = `
                position: fixed;
                width: 6px;
                height: 6px;
                background-color: ${color};
                border-radius: 50%;
                pointer-events: none;
                z-index: 20000;
                left: ${x}px;
                top: ${y}px;
                box-shadow: 0 0 10px ${color};
            `;
            const angle = Math.random() * Math.PI * 2;
            const velocity = Math.random() * 100 + 40;
            const tx = Math.cos(angle) * velocity;
            const ty = Math.sin(angle) * velocity;
            
            document.body.appendChild(p);
            
            p.animate([
                { transform: 'translate(0, 0) scale(1)', opacity: 1 },
                { transform: `translate(${tx}px, ${ty}px) scale(0)`, opacity: 0 }
            ], {
                duration: 800,
                easing: 'cubic-bezier(0.1, 0.8, 0.2, 1)',
                fill: 'forwards'
            });
            
            setTimeout(() => p.remove(), 800);
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

        // Keep only last 10 logs
        if (container.children.length > 10) {
            container.removeChild(container.firstChild);
        }
    },

    clearReasoningLogs() {
        const container = document.getElementById('insight-logs');
        const insightArea = document.getElementById('reasoning-insight');
        if (container) container.innerHTML = '';
        if (insightArea) insightArea.classList.remove('active');
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
    }
};
