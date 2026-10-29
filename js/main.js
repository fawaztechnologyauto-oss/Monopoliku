import { webAppUrl, setWebAppUrl } from './config.js';
import { PLAYERS } from './players.js';
import { renderBoardGrid, updatePlayerTokens } from './board.js';

let turnRound = 1;
let currentPlayerIndex = 0;
let timeLeft = 10;
let timerInterval = null;
let hasRolled = false;

function startTimer() {
    clearInterval(timerInterval);
    timeLeft = 10;
    updateTimerDisplay();

    timerInterval = setInterval(() => {
        timeLeft--;
        updateTimerDisplay();

        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            if (!hasRolled) {
                handleRollDice();
                setTimeout(() => endTurn(), 1500);
            } else {
                endTurn();
            }
        }
    }, 1000);
}

function updateTimerDisplay() {
    const badge = document.getElementById('timer-badge');
    const bar = document.getElementById('timer-bar');
    if (!badge || !bar) return;

    badge.innerText = `${timeLeft}s`;
    const percent = (timeLeft / 10) * 100;
    bar.style.width = `${percent}%`;
    
    if (timeLeft <= 3) {
        bar.className = "timer-progress bg-rose-500 h-full";
    } else {
        bar.className = "timer-progress bg-emerald-500 h-full";
    }
}

function handleRollDice() {
    if (hasRolled) return;
    hasRolled = true;
    clearInterval(timerInterval);

    const dice1 = Math.floor(Math.random() * 6) + 1;
    const dice2 = Math.floor(Math.random() * 6) + 1;
    const totalStep = dice1 + dice2;
    
    document.getElementById('dice-1').innerText = dice1;
    document.getElementById('dice-2').innerText = dice2;

    const p = PLAYERS[currentPlayerIndex];
    p.pos = (p.pos + totalStep) % 40;
    updatePlayerTokens();

    const btnRoll = document.getElementById('btn-roll');
    const btnEnd = document.getElementById('btn-end');
    
    btnRoll.disabled = true;
    btnRoll.classList.add('opacity-50', 'cursor-not-allowed');
    
    btnEnd.disabled = false;
    btnEnd.classList.remove('bg-slate-700', 'text-slate-400', 'cursor-not-allowed');
    btnEnd.classList.add('bg-emerald-600', 'hover:bg-emerald-500', 'text-white', 'shadow-lg', 'cursor-pointer');
    
    timeLeft = 5;
    startTimerCustom(5);
}

function startTimerCustom(sec) {
    clearInterval(timerInterval);
    timeLeft = sec;
    timerInterval = setInterval(() => {
        timeLeft--;
        updateTimerDisplay();
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            endTurn();
        }
    }, 1000);
}

function endTurn() {
    clearInterval(timerInterval);
    hasRolled = false;
    currentPlayerIndex = (currentPlayerIndex + 1) % PLAYERS.length;
    if (currentPlayerIndex === 0) turnRound++;

    document.getElementById('turn-count').innerText = turnRound;
    const p = PLAYERS[currentPlayerIndex];
    document.getElementById('current-player-name').innerHTML = `
        <span class="w-3 h-3 rounded-full inline-block" style="background: ${p.color}"></span> ${p.name}
    `;

    const btnRoll = document.getElementById('btn-roll');
    const btnEnd = document.getElementById('btn-end');

    btnRoll.disabled = false;
    btnRoll.classList.remove('opacity-50', 'cursor-not-allowed');
    
    btnEnd.disabled = true;
    btnEnd.classList.remove('bg-emerald-600', 'hover:bg-emerald-500', 'text-white', 'shadow-lg', 'cursor-pointer');
    btnEnd.classList.add('bg-slate-700', 'text-slate-400', 'cursor-not-allowed');

    startTimer();
}

// Event Listeners
document.getElementById('btn-roll')?.addEventListener('click', handleRollDice);
document.getElementById('btn-end')?.addEventListener('click', endTurn);

document.getElementById('btn-settings')?.addEventListener('click', () => {
    document.getElementById('modal-settings').classList.remove('hidden');
    document.getElementById('setting-url').value = webAppUrl;
});

document.getElementById('btn-close-settings')?.addEventListener('click', () => {
    document.getElementById('modal-settings').classList.add('hidden');
});

document.getElementById('btn-save-settings')?.addEventListener('click', () => {
    const newUrl = document.getElementById('setting-url').value;
    setWebAppUrl(newUrl);
    document.getElementById('modal-settings').classList.add('hidden');
    alert('Pengaturan disimpan!');
});

document.getElementById('btn-reset')?.addEventListener('click', () => {
    if(confirm('Mulai ulang permainan?')) location.reload();
});

// Inisialisasi saat DOM siap
document.addEventListener("DOMContentLoaded", () => {
    renderBoardGrid();
    startTimer();
});
