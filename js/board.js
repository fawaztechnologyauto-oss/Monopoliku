export function initBoard() {
    const board = document.getElementById('board');
    if (!board) return;

    // Membuat 40 petak grid monopoli secara otomatis agar papan tidak kosong
    for (let i = 0; i < 40; i++) {
        const tile = document.createElement('div');
        tile.className = 'tile';
        tile.id = `tile-${i}`;
        tile.innerHTML = `<span class="text-[9px] text-slate-500 font-bold">${i}</span>`;
        board.appendChild(tile);
    }
}
