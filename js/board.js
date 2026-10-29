import { PLAYERS } from './players.js';

export function renderBoardGrid() {
    const board = document.getElementById('board');
    if (!board) return;
    
    const existingTiles = board.querySelectorAll('.tile');
    existingTiles.forEach(t => t.remove());

    for (let i = 0; i < 40; i++) {
        const tile = document.createElement('div');
        tile.className = 'tile';
        tile.id = `tile-${i}`;
        tile.innerHTML = `
            <span style="font-size:6px; color:#64748b;">${i}</span>
            <div class="token-container" id="tokens-on-tile-${i}"></div>
        `;
        
        let r, c;
        if (i >= 0 && i <= 10) { r = 1; c = 11 - i; }       
        else if (i > 10 && i <= 20) { r = i - 9; c = 1; }    
        else if (i > 20 && i <= 30) { r = 11; c = i - 19; }  
        else { r = 31 - i; c = 11; }                         

        tile.style.gridRow = r;
        tile.style.gridColumn = c;
        board.appendChild(tile);
    }
    updatePlayerTokens();
}

export function updatePlayerTokens() {
    for (let i = 0; i < 40; i++) {
        const container = document.getElementById(`tokens-on-tile-${i}`);
        if (container) container.innerHTML = '';
    }

    PLAYERS.forEach(player => {
        const container = document.getElementById(`tokens-on-tile-${player.pos}`);
        if (container) {
            const token = document.createElement('div');
            token.className = 'token';
            token.style.backgroundColor = player.color;
            token.title = player.name;
            container.appendChild(token);
        }
    });
}
