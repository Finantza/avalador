/**
 * ONYX NETWORK DETECTION & REAL-TIME PVP ENGINE
 * Handles real-time Peer-to-Peer discovery via public WebSockets,
 * local network (LAN) vs remote (WAN) detection, and interactive PvP battles.
 */

window.OnyxNetwork = {
    ws: null,
    connected: false,
    publicIp: '127.0.0.1',
    activeOperators: new Map(), // Map of active operators: name -> data
    currentBattle: null,
    presenceInterval: null,
    onOperatorsUpdated: null,
    onChallengeReceived: null,
    onBattleStateUpdated: null,
    onBattleEnded: null,

    // Public WebSocket Broker (PieSocket public demo server)
    wsUrl: 'wss://demo.piesocket.com/v3/onyx_pvp_channel_v1?api_key=oCdCMcMPQpbvNjUIzqtvF1d2X2okWpDQj4AwARJuAgtjhzKxVEjQU6IdCjwm&notify_self=0',
    
    // BroadcastChannel for cross-tab local discovery (offline fallback / local testing)
    localChannel: null,

    /**
     * Initialize Network Engine, fetch IP, setup WebSockets and local channel
     */
    async init(username, level, avatar) {
        this.username = username;
        this.level = level;
        
        // Helper to turn country code into flag emoji
        function getFlagEmoji(countryCode) {
            if (!countryCode || countryCode.length !== 2) return '🇧🇷';
            const codePoints = countryCode
                .toUpperCase()
                .split('')
                .map(char => 127397 + char.charCodeAt(0));
            return String.fromCodePoint(...codePoints);
        }

        // 1. Try to fetch public IP and Country Geolocation for LAN/WAN detection and Flags
        try {
            const res = await fetch('https://ipapi.co/json/');
            const data = await res.json();
            this.publicIp = data.ip || '127.0.0.1';
            this.countryCode = data.country_code || 'BR';
            this.countryName = data.country_name || 'Brasil';
            this.avatar = getFlagEmoji(this.countryCode) + ' ' + (avatar || '👤');
            console.log(`[ONYX NET] IP: ${this.publicIp}, País: ${this.countryName}, Avatar: ${this.avatar}`);
        } catch (e) {
            console.warn('[ONYX NET] Falha ao obter geolocalização. Usando dados padrão.', e);
            this.publicIp = '127.0.0.1';
            this.countryCode = 'BR';
            this.avatar = '🇧🇷 ' + (avatar || '👤');
        }

        // 2. Initialize local BroadcastChannel (cross-tab sync)
        try {
            this.localChannel = new BroadcastChannel('onyx_local_pvp');
            this.localChannel.onmessage = (e) => this.handleIncomingMessage(e.data, 'local');
        } catch (e) {
            console.warn('[ONYX NET] BroadcastChannel não suportado neste navegador.', e);
        }

        // 3. Connect to public WebSocket broker
        this.connectWebSocket();

        // 4. Start broadcasting presence
        this.startPresenceBroadcasting();

        // 5. Setup automatic pruning of dead operators (timeout after 8s)
        setInterval(() => this.pruneInactiveOperators(), 3000);
    },

    /**
     * Connect to the public WebSocket broker
     */
    connectWebSocket() {
        if (this.ws) {
            try { this.ws.close(); } catch(e) {}
        }

        console.log('[ONYX NET] Conectando ao broker de rede global...');
        this.ws = new WebSocket(this.wsUrl);

        this.ws.onopen = () => {
            this.connected = true;
            console.log('[ONYX NET] Conexão com a rede global estabelecida com sucesso.');
            this.broadcastPresence();
            if (window.OnyxUI) {
                window.OnyxUI.addReasoningLog("NET: Conectado com sucesso ao canal de operações global.");
            }
        };

        this.ws.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                this.handleIncomingMessage(data, 'ws');
            } catch (err) {
                console.error('[ONYX NET] Erro ao decodificar pacote de rede:', err);
            }
        };

        this.ws.onerror = (err) => {
            console.error('[ONYX NET] Falha no canal de comunicação WebSocket.', err);
        };

        this.ws.onclose = () => {
            this.connected = false;
            console.warn('[ONYX NET] Conexão com broker encerrada. Tentando reconectar em 10s...');
            setTimeout(() => {
                if (!this.connected) this.connectWebSocket();
            }, 10000);
        };
    },

    /**
     * Start sending presence periodic heartbeats
     */
    startPresenceBroadcasting() {
        if (this.presenceInterval) clearInterval(this.presenceInterval);
        this.presenceInterval = setInterval(() => {
            this.broadcastPresence();
        }, 3000);
    },

    /**
     * Broadcast presence ping to both WebSocket and local channel
     */
    broadcastPresence() {
        const payload = {
            type: 'presence',
            sender: this.username,
            level: this.level,
            avatar: this.avatar,
            publicIp: this.publicIp,
            status: this.currentBattle ? 'in-battle' : 'searching',
            timestamp: Date.now()
        };
        this.sendMessage(payload);
    },

    /**
     * Send network message to all available peers
     */
    sendMessage(payload) {
        const jsonStr = JSON.stringify(payload);
        
        // Send via WebSocket if connected
        if (this.connected && this.ws && this.ws.readyState === WebSocket.OPEN) {
            try {
                this.ws.send(jsonStr);
            } catch (e) {
                console.error('[ONYX NET] Erro ao transmitir via WS:', e);
            }
        }

        // Always broadcast locally (for cross-tab testing)
        if (this.localChannel) {
            try {
                this.localChannel.postMessage(payload);
            } catch (e) {
                console.error('[ONYX NET] Erro ao transmitir via canal local:', e);
            }
        }
    },

    /**
     * Handle incoming signals
     */
    handleIncomingMessage(msg, origin) {
        // Discard messages sent by self
        if (msg.sender === this.username) return;

        switch (msg.type) {
            case 'presence':
                this.handlePresence(msg);
                break;
                
            case 'challenge_request':
                this.handleChallengeRequest(msg);
                break;
                
            case 'challenge_response':
                this.handleChallengeResponse(msg);
                break;
                
            case 'score_update':
                this.handleScoreUpdate(msg);
                break;
                
            case 'battle_finished':
                this.handleOpponentFinished(msg);
                break;

            case 'cancel_battle':
                this.handleBattleCancelled(msg);
                break;

            case 'chat':
                if (this.onChatMessageReceived) {
                    this.onChatMessageReceived(msg);
                }
                break;
        }
    },

    /**
     * Process presence pings from other users
     */
    handlePresence(data) {
        const isSameLAN = (data.publicIp === this.publicIp);
        
        this.activeOperators.set(data.sender, {
            name: data.sender,
            level: data.level || 1,
            avatar: data.avatar || '👤',
            publicIp: data.publicIp,
            isLAN: isSameLAN,
            status: data.status || 'searching',
            lastSeen: Date.now(),
            region: isSameLAN ? 'REDE LOCAL (LAN)' : 'REDE REMOTA (WAN)'
        });

        if (this.onOperatorsUpdated) {
            this.onOperatorsUpdated(Array.from(this.activeOperators.values()));
        }
    },

    /**
     * Clean up players who haven't pinged in over 8 seconds
     */
    pruneInactiveOperators() {
        const now = Date.now();
        let updated = false;

        for (const [name, op] of this.activeOperators.entries()) {
            if (now - op.lastSeen > 8000) {
                this.activeOperators.delete(name);
                updated = true;
                console.log(`[ONYX NET] Operador desconectado por inatividade: ${name}`);
            }
        }

        if (updated && this.onOperatorsUpdated) {
            this.onOperatorsUpdated(Array.from(this.activeOperators.values()));
        }
    },

    /**
     * Send challenge invitation to a target operator
     */
    sendChallenge(targetName, subject, difficulty, questions) {
        console.log(`[ONYX NET] Desafiando operador ${targetName} em ${subject} (${difficulty})...`);
        const payload = {
            type: 'challenge_request',
            sender: this.username,
            target: targetName,
            subject: subject,
            difficulty: difficulty,
            questions: questions, // Generate questions once and share them to ensure absolute parity
            timestamp: Date.now()
        };
        this.sendMessage(payload);
    },

    /**
     * Handle receipt of challenge request
     */
    handleChallengeRequest(data) {
        if (data.target !== this.username) return; // Not for us
        
        if (this.currentBattle) {
            // Auto decline if already in battle
            this.sendChallengeResponse(data.sender, false);
            return;
        }

        console.log(`[ONYX NET] Desafio recebido de: ${data.sender}`);
        if (this.onChallengeReceived) {
            this.onChallengeReceived(data);
        }
    },

    /**
     * Respond to a challenge invitation
     */
    sendChallengeResponse(targetName, accepted) {
        const payload = {
            type: 'challenge_response',
            sender: this.username,
            target: targetName,
            accepted: accepted,
            timestamp: Date.now()
        };
        this.sendMessage(payload);
    },

    /**
     * Handle receipt of challenge response (Accept/Decline)
     */
    handleChallengeResponse(data) {
        if (data.target !== this.username) return; // Not for us

        if (this.currentBattle && this.currentBattle.opponent === data.sender) {
            if (data.accepted) {
                console.log(`[ONYX NET] Desafio aceito por: ${data.sender}`);
                this.currentBattle.status = 'ready';
                if (this.onBattleStateUpdated) this.onBattleStateUpdated('ready');
            } else {
                console.log(`[ONYX NET] Desafio recusado por: ${data.sender}`);
                this.currentBattle = null;
                if (this.onBattleStateUpdated) this.onBattleStateUpdated('rejected');
            }
        }
    },

    /**
     * Send real-time question progress and scores during PvP
     */
    sendScoreUpdate(currentQuestionIndex, currentScore) {
        if (!this.currentBattle) return;
        const payload = {
            type: 'score_update',
            sender: this.username,
            target: this.currentBattle.opponent,
            currentQuestion: currentQuestionIndex,
            score: currentScore,
            timestamp: Date.now()
        };
        this.sendMessage(payload);
    },

    /**
     * Process real-time progress update from opponent
     */
    handleScoreUpdate(data) {
        if (data.target !== this.username) return;
        if (!this.currentBattle || this.currentBattle.opponent !== data.sender) return;

        this.currentBattle.opponentQuestion = data.currentQuestion;
        this.currentBattle.opponentScore = data.score;

        console.log(`[ONYX NET] Progresso do oponente (${data.sender}): Questão ${data.currentQuestion + 1}, Placar ${data.score}`);
        
        if (this.onBattleStateUpdated) {
            this.onBattleStateUpdated('score_update');
        }
    },

    /**
     * Broadcast completion of quiz by self
     */
    sendBattleFinished(finalScore) {
        if (!this.currentBattle) return;
        this.currentBattle.selfFinished = true;
        this.currentBattle.selfScore = finalScore;

        const payload = {
            type: 'battle_finished',
            sender: this.username,
            target: this.currentBattle.opponent,
            score: finalScore,
            timestamp: Date.now()
        };
        this.sendMessage(payload);

        this.checkBattleEndCondition();
    },

    /**
     * Process completion signal from opponent
     */
    handleOpponentFinished(data) {
        if (data.target !== this.username) return;
        if (!this.currentBattle || this.currentBattle.opponent !== data.sender) return;

        this.currentBattle.opponentFinished = true;
        this.currentBattle.opponentScore = data.score;

        console.log(`[ONYX NET] Oponente ${data.sender} concluiu com placar final: ${data.score}`);

        if (this.onBattleStateUpdated) {
            this.onBattleStateUpdated('opponent_finished');
        }

        this.checkBattleEndCondition();
    },

    /**
     * Check if both players have completed the challenge
     */
    checkBattleEndCondition() {
        if (!this.currentBattle) return;

        if (this.currentBattle.selfFinished && this.currentBattle.opponentFinished) {
            console.log('[ONYX NET] Batalha concluída. Computando vencedor...');
            const selfScore = this.currentBattle.selfScore;
            const opponentScore = this.currentBattle.opponentScore;
            
            let result = 'draw';
            if (selfScore > opponentScore) {
                result = 'victory';
            } else if (selfScore < opponentScore) {
                result = 'defeat';
            }

            const endedBattle = {
                opponent: this.currentBattle.opponent,
                subject: this.currentBattle.subject,
                selfScore: selfScore,
                opponentScore: opponentScore,
                result: result
            };

            this.currentBattle = null;

            if (this.onBattleEnded) {
                this.onBattleEnded(endedBattle);
            }
        }
    },

    /**
     * Cancel the active combat (disconnect or yield)
     */
    cancelActiveBattle() {
        if (!this.currentBattle) return;

        const payload = {
            type: 'cancel_battle',
            sender: this.username,
            target: this.currentBattle.opponent,
            timestamp: Date.now()
        };
        this.sendMessage(payload);

        this.currentBattle = null;
    },

    /**
     * Process cancellation/surrender by opponent
     */
    handleBattleCancelled(data) {
        if (data.target !== this.username) return;
        if (!this.currentBattle || this.currentBattle.opponent !== data.sender) return;

        console.warn(`[ONYX NET] Oponente ${data.sender} desconectou-se ou desistiu da arena.`);
        
        const endedBattle = {
            opponent: data.sender,
            subject: this.currentBattle.subject,
            selfScore: this.currentBattle.selfScore || 0,
            opponentScore: -1, // Represents forfeit
            result: 'victory' // Forfeiture awards victory to the remaining operator
        };

        this.currentBattle = null;

        if (this.onBattleEnded) {
            this.onBattleEnded(endedBattle);
        }
    },

    /**
     * Broadcast a global chat transmission to the lobby
     */
    sendChatMessage(text) {
        if (!text || text.trim() === '') return;
        const payload = {
            type: 'chat',
            sender: this.username,
            avatar: this.avatar,
            text: text.trim(),
            timestamp: Date.now()
        };
        this.sendMessage(payload);
    }
};
