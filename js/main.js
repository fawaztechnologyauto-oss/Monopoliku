import { SPREADSHEET_ID, webAppUrl, setWebAppUrl } from './config.js';
import { PLAYERS } from './players.js';
import { nextTurn, currentPlayerIndex, hasRolled } from './gameLogic.js';

// Event Listener Tombol Lempar Dadu
document.getElementById('btn-roll')?.addEventListener('click', () => {
    const dice1 = Math.floor(Math.random() * 6) + 1;
    const dice2 = Math.floor(Math.random() * 6) + 1;
    
    document.getElementById('dice-1').innerText = dice1;
    document.getElementById('dice-2').innerText = dice2;
    
    document.getElementById('btn-end').disabled = false;
    document.getElementById('btn-roll').disabled = true;
});

// Event Listener Tombol Selesai Giliran
document.getElementById('btn-end')?.addEventListener('click', () => {
    nextTurn();
});

// Event Listener Modal Pengaturan
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
    alert('Pengaturan berhasil disimpan!');
});

// Fullscreen Toggle
document.getElementById('btn-fullscreen')?.addEventListener('click', () => {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
        document.getElementById('fullscreen-icon').className = "fa-solid fa-compress";
    } else {
        document.exitFullscreen();
        document.getElementById('fullscreen-icon').className = "fa-solid fa-expand";
    }
});
