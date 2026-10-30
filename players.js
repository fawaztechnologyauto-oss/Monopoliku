const PLAYERS = [
    { id: 0, name: "Pemain 1", color: "#ef4444", bgClass: "bg-red-500", isBot: false, money: 1500, pos: 0, properties: [] },
    { id: 1, name: "Bot Alfa", color: "#3b82f6", bgClass: "bg-blue-500", isBot: true, money: 1500, pos: 0, properties: [] },
    { id: 2, name: "Bot Beta", color: "#10b981", bgClass: "bg-emerald-500", isBot: true, money: 1500, pos: 0, properties: [] },
    { id: 3, name: "Bot Gamma", color: "#f59e0b", bgClass: "bg-amber-500", isBot: true, money: 1500, pos: 0, properties: [] }
];

function renderPlayerCards() {
    const container = document.getElementById('players-container');
    if (!container) return;
    container.innerHTML = '';
    PLAYERS.forEach((p, idx) => {
        const isActive = idx === currentPlayerIndex;
        const card = document.createElement('div');
        card.className = `p-2.5 rounded-xl border transition ${isActive ? 'bg-indigo-950/70 border-indigo-500 shadow-lg' : 'bg-slate-950/40 border-slate-800'}`;
        card.innerHTML = `
            <div class="flex justify-between items-center mb-1">
                <div class="flex items-center gap-1.5">
                    <span class="w-2.5 h-2.5 rounded-full ${p.bgClass}"></span>
                    <span class="font-bold text-xs text-white">${p.name}</span>
                </div>
                <span class="text-[9px] px-1.5 py-0.2 rounded ${p.isBot ? 'bg-slate-800 text-slate-400' : 'bg-indigo-500/20 text-indigo-300 font-bold'}">${p.isBot ? 'BOT' : 'P1'}</span>
            </div>
            <div class="text-sm font-black text-slate-100">$${p.money}</div>
            <div class="text-[10px] text-slate-400 mt-0.5">Aset: ${p.properties.length}</div>
        `;
        container.appendChild(card);
    });
}

function updateTokens() {
    document.querySelectorAll('.token-container').forEach(c => c.innerHTML = '');
    PLAYERS.forEach((p, idx) => {
        const tileEl = document.querySelector(`#tile-${p.pos} .token-container`);
        if (tileEl) {
            const token = document.createElement('div');
            token.className = `token token-p${idx + 1}`;
            token.innerHTML = `<i class="fa-solid fa-user"></i>`;
            tileEl.appendChild(token);
        }
    });
}
