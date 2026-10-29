import { webAppUrl, setWebAppUrl } from './config.js';
import { PLAYERS } from './players.js';
import { initBoard } from './board.js';

let turnRound = 1;
let currentPlayerIndex = 0;

// Jalankan saat halaman dimuat
document.addEventListener("DOMContentLoaded", () => {
    initBoard();
});

// Tombol Lempar Dadu
document.getElementById('btn-roll')?.addEventListener('click', () => {
    const dice1 = Math.floor(Math.random() * 6) + 1;
    const dice2 = Math.floor(Math.random() * 6) + 1;
    
    document.getElementById('dice-1').innerText = dice1;
    document.getElementById('dice-2').innerText = dice2;

    document.getElementById('btn-roll').disabled = true;
    document.getElementById('btn-end').disabled = false;
});

// Tombol Selesai Giliran
document.getElementById('btn-end')?.addEventListener('click', () => {
    currentPlayerIndex = (currentPlayerIndex + 1) % PLAYERS.length;
    if (currentPlayerIndex === 0) turnRound++;

    document.getElementById('turn-count').innerText = turnRound;
    const p = PLAYERS[currentPlayerIndex];
    document.getElementById('current-player-name').innerHTML = `
        <span class="w-3 h-3 rounded-full inline-block" style="background: ${p.color}"></span> ${p.name}
    `;

    document.getElementById('btn-roll').disabled = false;
    document.getElementById('btn-end').disabled = true;
});

// Fullscreen
document.getElementById('btn-fullscreen')?.addEventListener('click', () => {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
        document.getElementById('fullscreen-icon').className = "fa-solid fa-compress";
    } else {
        document.exitFullscreen();
        document.getElementById('fullscreen-icon').className = "fa-solid fa-expand";
    }
});

// Pengaturan Modal
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
    if(confirm('Mulai ulang permainan?')) {
        location.reload();
    }
});

document.getElementById('btn-clear-logs')?.addEventListener('click', () => {
    document.getElementById('game-logs').innerHTML = '';
});
