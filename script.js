const totalCells = 16;

const players = [
    { id: 1, name: "Pemain 1", money: 1500, position: 0, element: document.getElementById('player1-token'), moneyEl: document.getElementById('p1-money'), cardEl: document.getElementById('player1-info') },
    { id: 2, name: "Pemain 2", money: 1500, position: 0, element: document.getElementById('player2-token'), moneyEl: document.getElementById('p2-money'), cardEl: document.getElementById('player2-info') }
];

let currentTurn = 0; // 0 untuk Pemain 1, 1 untuk Pemain 2
let rolledThisTurn = false;

// Data Properti (harga dan pemilik)
const properties = {
    1: { name: "Jl. Mawar", price: 60, rent: 20, owner: null },
    3: { name: "Jl. Melati", price: 80, rent: 25, owner: null },
    5: { name: "Jl. Sudirman", price: 140, rent: 45, owner: null },
    7: { name: "Jl. Thamrin", price: 160, rent: 50, owner: null },
    9: { name: "Jl. Gatot Subroto", price: 220, rent: 70, owner: null },
    11: { name: "Jl. HR Rasuna", price: 240, rent: 75, owner: null },
    13: { name: "Jl. Asia Afrika", price: 300, rent: 90, owner: null },
    14: { name: "Jl. Sudirman", price: 320, rent: 100, owner: null },
    15: { name: "Jl. Diponegoro", price: 400, rent: 120, owner: null }
};

const rollBtn = document.getElementById('roll-btn');
const buyBtn = document.getElementById('buy-btn');
const endTurnBtn = document.getElementById('end-turn-btn');
const diceResult = document.getElementById('dice-result');
const turnInfo = document.getElementById('turn-info');
const logBox = document.getElementById('log-box');

function log(message) {
    logBox.innerHTML = `<p>${message}</p>` + logBox.innerHTML;
}

function updateUI() {
    players.forEach(p => {
        p.moneyEl.textContent = p.money;
        moveToken(p);
    });

    players.forEach((p, idx) => {
        if (idx === currentTurn) {
            p.cardEl.classList.add('active');
        } else {
            p.cardEl.classList.remove('active');
        }
    });

    turnInfo.textContent = `Giliran: ${players[currentTurn].name}`;
}

// Koordinat / pemetaan posisi sel sederhana untuk visual token
function moveToken(player) {
    const cellEl = document.getElementById(`cell-${player.position}`);
    const rect = cellEl.getBoundingClientRect();
    const boardRect = document.querySelector('.board').getBoundingClientRect();
    
    // Penyesuaian posisi relatif dalam grid CSS
    // Menggunakan kelas posisi grid CSS langsung agar lebih stabil
    cellEl.appendChild(player.element);
}

rollBtn.addEventListener('click', () => {
    if (rolledThisTurn) return;

    const dice = Math.floor(Math.random() * 6) + 1;
    diceResult.textContent = `🎲 ${dice}`;
    rolledThisTurn = true;

    let player = players[currentTurn];
    let oldPos = player.position;
    player.position = (player.position + dice) % totalCells;

    // Jika melewati START
    if (player.position < oldPos) {
        player.money += 200;
        log(`${player.name} melewati START dan mendapat $200!`);
    }

    log(`${player.name} melempar angka ${dice} dan mendarat di ${player.position}`);
    updateUI();
    handleCellAction(player);
});

function handleCellAction(player) {
    buyBtn.disabled = true;
    endTurnBtn.disabled = false;

    // Cek apakah petak adalah properti
    if (properties[player.position]) {
        let prop = properties[player.position];
        if (prop.owner === null) {
            if (player.money >= prop.price) {
                buyBtn.disabled = false;
                log(`${prop.name} belum ada yang punya seharga $${prop.price}. Anda bisa membelinya.`);
            } else {
                log(`Uang ${player.name} tidak cukup untuk membeli ${prop.name}.`);
            }
        } else if (prop.owner === player.id) {
            log(`Ini adalah properti milik Anda sendiri.`);
        } else {
            let ownerPlayer = players.find(p => p.id === prop.owner);
            player.money -= prop.rent;
            ownerPlayer.money += prop.rent;
            log(`${player.name} mendarat di properti ${ownerPlayer.name} dan membayar sewa $${prop.rent}.`);
            updateUI();
        }
    } 
    // Petak Pajak
    else if (player.position === 6) {
        player.money -= 100;
        log(`${player.name} terkena Pajak dan membayar $100!`);
        updateUI();
    }
    // Petak Masuk Penjara
    else if (player.position === 12) {
        player.position = 4; // Pindah ke petak Penjara (index 4)
        log(`${player.name} melanggar hukum dan dijebloskan ke Penjara!`);
        updateUI();
    }
}

buyBtn.addEventListener('click', () => {
    let player = players[currentTurn];
    let prop = properties[player.position];

    if (prop && prop.owner === null && player.money >= prop.price) {
        player.money -= prop.price;
        prop.owner = player.id;
        buyBtn.disabled = true;
        
        // Tandai visual pada sel bahwa sudah dibeli
        const cellEl = document.getElementById(`cell-${player.position}`);
        cellEl.style.backgroundColor = player.id === 1 ? '#ffdddd' : '#ddf0ff';
        
        log(`${player.name} berhasil membeli ${prop.name} seharga $${prop.price}!`);
        updateUI();
    }
});

endTurnBtn.addEventListener('click', () => {
    currentTurn = 1 - currentTurn; // Ganti giliran (0 jadi 1, 1 jadi 0)
    rolledThisTurn = false;
    diceResult.textContent = `🎲 -`;
    buyBtn.disabled = true;
    endTurnBtn.disabled = true;
    rollBtn.disabled = false;
    updateUI();
});

// Inisialisasi awal
updateUI();
