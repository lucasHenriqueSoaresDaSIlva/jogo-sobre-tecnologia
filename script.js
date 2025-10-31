// script.js - lógica do jogo aprimorada com ícones SVG
(() => {
  // --- Dados: lista mestre com categoria alvo ---
  const MASTER = [
    {name:'JavaScript', cat:'language'},
    {name:'Python', cat:'language'},
    {name:'Java', cat:'language'},
    {name:'C#', cat:'language'},
    {name:'C++', cat:'language'},
    {name:'Ruby', cat:'language'},
    {name:'Go', cat:'language'},
    {name:'TypeScript', cat:'language'},
    {name:'PHP', cat:'language'},
    {name:'Kotlin', cat:'language'},

    {name:'React', cat:'framework'},
    {name:'Angular', cat:'framework'},
    {name:'Vue.js', cat:'framework'},
    {name:'Django', cat:'framework'},
    {name:'Flask', cat:'framework'},
    {name:'Spring', cat:'framework'},
    {name:'Laravel', cat:'framework'},
    {name:'Express', cat:'framework'},
    {name:'jQuery', cat:'framework'},
    {name:'Ruby on Rails', cat:'framework'},

    {name:'MySQL', cat:'sql'},
    {name:'PostgreSQL', cat:'sql'},
    {name:'SQLite', cat:'sql'},
    {name:'MariaDB', cat:'sql'},
    {name:'Oracle DB', cat:'sql'},

    {name:'MongoDB', cat:'nosql'},
    {name:'Redis', cat:'nosql'},
    {name:'Cassandra', cat:'nosql'},
    {name:'DynamoDB', cat:'nosql'},
    {name:'CouchDB', cat:'nosql'},
    {name:'Neo4j', cat:'nosql'},
    {name:'Firebase Realtime DB', cat:'nosql'},
    {name:'Elasticsearch', cat:'nosql'}
  ];

  // --- Ícones SVG ---
  const ICONS = {
    soundOn: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M11 5L6 9H2v6h4l5 4V5zM15.54 8.46a5 5 0 0 1 0 7.07M19.07 4.93a10 10 0 0 1 0 14.14"/>
    </svg>`,
    
    soundOff: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M11 5L6 9H2v6h4l5 4V5zM21 9l-6 6M15 9l6 6"/>
    </svg>`,
    
    check: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="3">
      <path d="M20 6L9 17l-5-5"/>
    </svg>`,
    
    x: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="3">
      <path d="M18 6L6 18M6 6l12 12"/>
    </svg>`,
    
    fire: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2">
      <path d="M8 16c0 1.5 1.5 2.5 3 3 1.5-0.5 3-1.5 3-3 0-2-2-3-3-4-1 1-3 2-3 4z"/>
      <path d="M14.5 9.5c-1 2-1.5 3.5-2 5-1.5-1.5-2-3.5-2-5 0-2.5 2-4.5 4-4.5s4 2 4 4.5c0 2-1 3.5-2 5-0.5-1.5-1-3-2-5z"/>
    </svg>`,
    
    clock: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="2">
      <circle cx="12" cy="12" r="10"/>
      <path d="M12 6v6l4 2"/>
    </svg>`,
    
    target: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" stroke-width="2">
      <circle cx="12" cy="12" r="10"/>
      <circle cx="12" cy="12" r="6"/>
      <circle cx="12" cy="12" r="2"/>
    </svg>`,
    
    trophy: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6ee7b7" stroke-width="2">
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6m0 5v5m0-5h4.5M6 14h4.5m0 0V9m0 5v5m0-5h4.5m-4.5 5h4.5m0 0V14m0 5v3a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2v-3m8-11h1.5a2.5 2.5 0 0 1 0 5H16m0-5v5"/>
    </svg>`,
    
    star: `<svg width="20" height="20" viewBox="0 0 24 24" fill="#fbbf24" stroke="#fbbf24" stroke-width="1">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
    </svg>`,
    
    accuracy: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#06b6d4" stroke-width="2">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
      <path d="M22 4L12 14.01l-3-3"/>
    </svg>`
  };

  // --- Elementos DOM ---
  const itemsArea = document.getElementById('itemsArea');
  const startBtn = document.getElementById('startBtn');
  const restartBtn = document.getElementById('restartBtn');
  const levelSelect = document.getElementById('level');
  const scoreEl = document.getElementById('score');
  const remainingEl = document.getElementById('remaining');
  const zones = Array.from(document.querySelectorAll('.zone'));

  // --- Sistema de Som Programático ---
  class SoundManager {
    constructor() {
      this.enabled = true;
      this.setupToggleButton();
    }

    createCorrectSound() {
      const context = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = context.createOscillator();
      const gainNode = context.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(context.destination);
      
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(523.25, context.currentTime);
      oscillator.frequency.setValueAtTime(659.25, context.currentTime + 0.1);
      oscillator.frequency.setValueAtTime(783.99, context.currentTime + 0.2);
      
      gainNode.gain.setValueAtTime(0, context.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.3, context.currentTime + 0.05);
      gainNode.gain.linearRampToValueAtTime(0, context.currentTime + 0.3);
      
      oscillator.start(context.currentTime);
      oscillator.stop(context.currentTime + 0.3);
    }

    createWrongSound() {
      const context = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = context.createOscillator();
      const gainNode = context.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(context.destination);
      
      oscillator.type = 'sawtooth';
      oscillator.frequency.setValueAtTime(220, context.currentTime);
      oscillator.frequency.setValueAtTime(196, context.currentTime + 0.1);
      oscillator.frequency.setValueAtTime(174.61, context.currentTime + 0.2);
      
      gainNode.gain.setValueAtTime(0, context.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.2, context.currentTime + 0.05);
      gainNode.gain.linearRampToValueAtTime(0, context.currentTime + 0.4);
      
      oscillator.start(context.currentTime);
      oscillator.stop(context.currentTime + 0.4);
    }

    createSuccessSound() {
      const context = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = context.createOscillator();
      const gainNode = context.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(context.destination);
      
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(523.25, context.currentTime);
      oscillator.frequency.setValueAtTime(659.25, context.currentTime + 0.1);
      oscillator.frequency.setValueAtTime(783.99, context.currentTime + 0.2);
      oscillator.frequency.setValueAtTime(1046.50, context.currentTime + 0.3);
      
      gainNode.gain.setValueAtTime(0, context.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.3, context.currentTime + 0.05);
      gainNode.gain.setValueAtTime(0.3, context.currentTime + 0.35);
      gainNode.gain.linearRampToValueAtTime(0, context.currentTime + 0.4);
      
      oscillator.start(context.currentTime);
      oscillator.stop(context.currentTime + 0.4);
    }

    play(soundName) {
      if (!this.enabled) return;
      
      try {
        switch(soundName) {
          case 'correct':
            this.createCorrectSound();
            break;
          case 'wrong':
            this.createWrongSound();
            break;
          case 'success':
            this.createSuccessSound();
            break;
        }
      } catch (error) {
        console.warn('Erro ao reproduzir som:', error);
      }
    }

    toggle() {
      this.enabled = !this.enabled;
      this.updateToggleButton();
      return this.enabled;
    }

    setupToggleButton() {
      if (!document.getElementById('soundToggle')) {
        const soundButton = document.createElement('button');
        soundButton.id = 'soundToggle';
        soundButton.innerHTML = ICONS.soundOn;
        soundButton.className = 'sound-toggle';
        soundButton.title = 'Ativar/Desativar Sons';
        soundButton.style.cssText = `
          position: fixed;
          top: 20px;
          right: 20px;
          z-index: 1000;
          background: var(--panel-glass);
          border: 1px solid rgba(255,255,255,0.1);
          color: white;
          padding: 10px;
          border-radius: 50%;
          cursor: pointer;
          backdrop-filter: blur(10px);
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        `;
        
        soundButton.addEventListener('click', () => {
          this.toggle();
        });
        
        document.body.appendChild(soundButton);
        this.updateToggleButton();
      }
    }

    updateToggleButton() {
      const button = document.getElementById('soundToggle');
      if (button) {
        button.innerHTML = this.enabled ? ICONS.soundOn : ICONS.soundOff;
        button.style.background = this.enabled 
          ? 'var(--panel-glass)' 
          : 'rgba(239, 68, 68, 0.2)';
      }
    }
  }

  const soundManager = new SoundManager();

  // --- Estado do Jogo Aprimorado ---
  let state = {
    items: [],
    score: 100,
    placedCount: 0,
    totalToPlace: 0,
    startTime: null,
    correctAnswers: 0,
    wrongAnswers: 0,
    streak: 0,
    maxStreak: 0
  };

  // --- Helpers Aprimorados ---
  function shuffle(arr) { 
    return arr.slice().sort(() => Math.random() - 0.5); 
  }

  function pickForLevel(level) {
    let count;
    if (level === 'easy') count = 8;
    else if (level === 'medium') count = 16;
    else count = 25; // difícil
    
    const shuffled = shuffle(MASTER);
    return shuffled.slice(0, count);
  }

  function calculateTimeBonus(startTime) {
    const timeTaken = (Date.now() - startTime) / 1000; // segundos
    const baseTime = 180; // 3 minutos
    return Math.max(0, Math.floor((baseTime - timeTaken) / 10) * 2);
  }

  function calculateStreakBonus() {
    return state.maxStreak * 3;
  }

  function createConfetti(element) {
    const rect = element.getBoundingClientRect();
    const colors = ['#6ee7b7', '#3b82f6', '#8b5cf6', '#10b981', '#6366f1'];
    
    for (let i = 0; i < 12; i++) {
      const confetti = document.createElement('div');
      confetti.style.cssText = `
        position: fixed;
        width: 8px;
        height: 8px;
        background: ${colors[i % colors.length]};
        border-radius: 1px;
        top: ${rect.top + rect.height / 2}px;
        left: ${rect.left + rect.width / 2}px;
        pointer-events: none;
        z-index: 1000;
        animation: confettiFall ${Math.random() * 1 + 0.5}s ease-in forwards;
      `;
      
      document.body.appendChild(confetti);
      
      setTimeout(() => {
        confetti.remove();
      }, 1000);
    }
  }

  function renderItems() {
    itemsArea.innerHTML = '';
    state.items.forEach((it, idx) => {
      const div = document.createElement('div');
      div.className = 'item';
      div.draggable = true;
      div.id = `item-${idx}`;
      div.dataset.cat = it.cat;
      div.dataset.name = it.name;
      div.textContent = it.name;
      itemsArea.appendChild(div);

      div.addEventListener('dragstart', (e) => {
        e.dataTransfer.setData('text/plain', div.id);
        setTimeout(() => div.classList.add('dragging'), 10);
      });
      
      div.addEventListener('dragend', () => {
        div.classList.remove('dragging');
      });
    });
    
    updateRemainingCount();
  }

  function updateRemainingCount() {
    remainingEl.textContent = state.totalToPlace - state.placedCount;
  }

  function updateScoreDisplay() {
    scoreEl.textContent = state.score;
    scoreEl.style.animation = 'pulse 0.3s ease-in-out';
    setTimeout(() => {
      scoreEl.style.animation = '';
    }, 300);
  }

  // --- Eventos das zonas aprimorados ---
  zones.forEach(z => {
    z.addEventListener('dragover', (e) => { 
      e.preventDefault(); 
      z.classList.add('ready'); 
    });
    
    z.addEventListener('dragleave', () => { 
      z.classList.remove('ready'); 
    });
    
    z.addEventListener('drop', (e) => {
      e.preventDefault();
      z.classList.remove('ready');
      const id = e.dataTransfer.getData('text/plain');
      const dragged = document.getElementById(id);
      if (!dragged) return;
      
      const expected = z.dataset.zone;
      const actual = dragged.dataset.cat;

      if (actual === expected) {
        handleCorrectDrop(z, dragged);
      } else {
        handleWrongDrop(z, dragged);
      }

      updateScoreDisplay();
      updateRemainingCount();
      checkEnd();
    });
  });

  function handleCorrectDrop(zone, dragged) {
    // ✅ Acerto
    soundManager.play('correct');
    state.correctAnswers++;
    state.streak++;
    state.maxStreak = Math.max(state.maxStreak, state.streak);
    
    // Bônus por sequência
    if (state.streak >= 3) {
      state.score += Math.floor(state.streak / 3) * 2;
    }
    
    // Efeitos visuais
    zone.classList.add('correct');
    createConfetti(zone);
    
    // Adiciona item à zona com animação
    const placed = document.createElement('div');
    placed.className = 'placed';
    
    // Adiciona ícone de check ao item colocado
    const itemContent = document.createElement('div');
    itemContent.style.cssText = `
      display: flex;
      align-items: center;
      gap: 8px;
    `;
    itemContent.innerHTML = `${ICONS.check} ${dragged.textContent}`;
    placed.appendChild(itemContent);
    
    placed.style.animation = 'slideIn 0.3s ease-out';
    zone.appendChild(placed);
    
    // Remove do área de itens com animação
    dragged.style.animation = 'fadeOut 0.3s ease-out';
    setTimeout(() => {
      dragged.remove();
    }, 300);
    
    state.placedCount += 1;
    
    // Remove a classe de correto após animação
    setTimeout(() => {
      zone.classList.remove('correct');
    }, 800);
  }

  function handleWrongDrop(zone, dragged) {
    // ❌ Erro
    soundManager.play('wrong');
    state.wrongAnswers++;
    state.streak = 0;
    state.score = Math.max(0, state.score - 5);
    
    // Efeitos visuais
    zone.classList.add('wrong');
    dragged.style.animation = 'shake 0.5s ease-in-out';
    
    // Reset da animação após execução
    setTimeout(() => {
      dragged.style.animation = '';
    }, 500);
    
    // Remove a classe de erro após um tempo
    setTimeout(() => {
      zone.classList.remove('wrong');
    }, 1000);
  }

  function checkEnd() {
    if (state.placedCount >= state.totalToPlace) {
      const timeBonus = calculateTimeBonus(state.startTime);
      const streakBonus = calculateStreakBonus();
      const finalScore = state.score + timeBonus + streakBonus;
      
      // Som de sucesso
      setTimeout(() => {
        soundManager.play('success');
      }, 300);
      
      // Modal de resultados aprimorado
      setTimeout(() => {
        showResultsModal(finalScore, timeBonus, streakBonus);
      }, 800);
    }
  }

  function showResultsModal(finalScore, timeBonus, streakBonus) {
    const accuracy = Math.round((state.correctAnswers / state.totalToPlace) * 100);
    const modal = document.createElement('div');
    modal.className = 'results-modal';
    modal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(11, 16, 32, 0.9);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 2000;
      backdrop-filter: blur(10px);
    `;
    
    modal.innerHTML = `
      <div style="
        background: var(--panel-bg);
        padding: 2rem;
        border-radius: var(--radius-xl);
        border: 1px solid rgba(110, 231, 183, 0.3);
        max-width: 500px;
        width: 90%;
        text-align: center;
        animation: slideIn 0.5s ease-out;
      ">
        <div style="display: flex; justify-content: center; margin-bottom: 1rem;">
          ${ICONS.trophy}
        </div>
        <h2 style="color: var(--accent-primary); margin-bottom: 1rem;">Parabéns!</h2>
        <div style="margin-bottom: 1.5rem;">
          <p style="margin-bottom: 0.5rem; color: var(--text-secondary);">Você completou o desafio!</p>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-top: 1rem;">
            <div style="background: rgba(255,255,255,0.05); padding: 1rem; border-radius: var(--radius-md);">
              <div style="font-size: 2rem; color: var(--accent-primary); font-weight: bold;">${finalScore}</div>
              <div style="font-size: 0.8rem; color: var(--text-secondary); display: flex; align-items: center; justify-content: center; gap: 4px;">
                ${ICONS.star} Pontuação Final
              </div>
            </div>
            <div style="background: rgba(255,255,255,0.05); padding: 1rem; border-radius: var(--radius-md);">
              <div style="font-size: 2rem; color: var(--accent-primary); font-weight: bold;">${accuracy}%</div>
              <div style="font-size: 0.8rem; color: var(--text-secondary); display: flex; align-items: center; justify-content: center; gap: 4px;">
                ${ICONS.accuracy} Precisão
              </div>
            </div>
          </div>
          <div style="margin-top: 1rem; font-size: 0.9rem; color: var(--text-secondary); text-align: left; background: rgba(255,255,255,0.03); padding: 1rem; border-radius: var(--radius-md);">
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
              ${ICONS.check}
              <span>${state.correctAnswers} acertos</span>
            </div>
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
              ${ICONS.x}
              <span>${state.wrongAnswers} erros</span>
            </div>
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
              ${ICONS.fire}
              <span>Sequência máxima: ${state.maxStreak}</span>
            </div>
            ${timeBonus > 0 ? `
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
              ${ICONS.clock}
              <span>Bônus de tempo: +${timeBonus}</span>
            </div>` : ''}
            ${streakBonus > 0 ? `
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
              ${ICONS.target}
              <span>Bônus de sequência: +${streakBonus}</span>
            </div>` : ''}
          </div>
        </div>
        <div style="display: flex; gap: 1rem; justify-content: center;">
          <button id="playAgainBtn" style="
            padding: 0.75rem 1.5rem;
            background: var(--accent-gradient);
            border: none;
            border-radius: var(--radius-md);
            color: white;
            cursor: pointer;
            font-weight: 600;
            display: flex;
            align-items: center;
            gap: 8px;
          ">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
            </svg>
            Jogar Novamente
          </button>
          <button id="closeModalBtn" style="
            padding: 0.75rem 1.5rem;
            background: rgba(255,255,255,0.1);
            border: 1px solid rgba(255,255,255,0.2);
            border-radius: var(--radius-md);
            color: white;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 8px;
          ">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
            Fechar
          </button>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    document.getElementById('playAgainBtn').addEventListener('click', () => {
      modal.remove();
      startGame();
    });
    
    document.getElementById('closeModalBtn').addEventListener('click', () => {
      modal.remove();
    });
  }

  // --- Inicialização Aprimorada ---
  function startGame() {
    const level = levelSelect.value;
    const chosen = pickForLevel(level);
    
    // Reset do estado
    state = {
      items: chosen,
      score: 100,
      placedCount: 0,
      totalToPlace: chosen.length,
      startTime: Date.now(),
      correctAnswers: 0,
      wrongAnswers: 0,
      streak: 0,
      maxStreak: 0
    };
    
    updateScoreDisplay();
    updateRemainingCount();

    // Limpa zonas
    zones.forEach(z => {
      z.querySelectorAll('.placed').forEach(p => p.remove());
      z.classList.remove('correct', 'wrong');
    });
    
    renderItems();
  }

  // --- Event Listeners ---
  startBtn.addEventListener('click', startGame);
  
  restartBtn.addEventListener('click', () => {
    if (confirm('Tem certeza que deseja reiniciar o jogo? Seu progresso atual será perdido.')) {
      startGame();
    }
  });

  // --- CSS Dinâmico para Animações ---
  const style = document.createElement('style');
  style.textContent = `
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      25% { transform: translateX(-5px); }
      75% { transform: translateX(5px); }
    }
    
    @keyframes confettiFall {
      0% {
        transform: translate(0, 0) rotate(0deg);
        opacity: 1;
      }
      100% {
        transform: translate(${Math.random() * 100 - 50}px, 100px) rotate(180deg);
        opacity: 0;
      }
    }
    
    @keyframes pulse {
      0% { transform: scale(1); }
      50% { transform: scale(1.1); }
      100% { transform: scale(1); }
    }
    
    @keyframes slideIn {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    @keyframes fadeOut {
      from {
        opacity: 1;
        transform: scale(1);
      }
      to {
        opacity: 0;
        transform: scale(0.8);
      }
    }
    
    .sound-toggle:hover {
      transform: scale(1.1);
      background: rgba(110, 231, 183, 0.2) !important;
    }
    
    .placed svg {
      flex-shrink: 0;
    }
  `;
  document.head.appendChild(style);

  // Inicia o jogo quando o DOM estiver carregado
  document.addEventListener('DOMContentLoaded', startGame);

  // Fallback para navegadores sem Web Audio API
  if (!window.AudioContext && !window.webkitAudioContext) {
    console.warn('Web Audio API não suportada. Sons desativados.');
    soundManager.enabled = false;
    soundManager.updateToggleButton();
  }
})();