import { PLAYERS } from './players.js';

export let turnRound = 1;
export let currentPlayerIndex = 0;
export let turnTimerInterval = null;
export let timeLeft = 10;
export let hasRolled = false;

export function nextTurn() {
    currentPlayerIndex = (currentPlayerIndex + 1) % PLAYERS.length;
    if (currentPlayerIndex === 0) turnRound++;
    hasRolled = false;
    timeLeft = 10;
    
    document.getElementById('turn-count').innerText = turnRound;
    document.getElementById('current-player-name').innerHTML = `
        <span class="w-3 h-3 rounded-full inline-block" style="background: ${PLAYERS[currentPlayerIndex].color}"></span> ${PLAYERS[currentPlayerIndex].name}
    `;
    document.getElementById('btn-roll').disabled = false;
    document.getElementById('btn-end').disabled = true;
}
