const totalCells = 16;

const players = [
    { id: 0, name: "Pemain", isBot: false, money: 1500, position: 0, element: document.getElementById('player0-token'), moneyEl: document.getElementById('p0-money'), cardEl: document.getElementById('player0-info') },
    { id: 1, name: "Bot 1", isBot: true, money: 1500, position: 0, element: document.getElementById('player1-token'), moneyEl: document.getElementById('p1-money'), cardEl: document.getElementById('player1-info') },
    { id: 2, name: "Bot 2", isBot: true, money: 1500, position: 0, element: document.getElementById('player2-token'), moneyEl: document.getElementById('p2-money'), cardEl: document.getElementById('player2-info') },
    { id: 3, name: "Bot 3", isBot: true, money: 1500, position: 0, element: document.getElementById('player3-token'), moneyEl: document.getElementById('p3-money'), cardEl: document.getElementById('player3-info') }
];

let currentTurn = 0;
let rolledThisTurn = false;
let countdownTimer = null;
let timeLeft = 10;

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
const countdownEl = document.getElementById('countdown');

const modalOverlay = document.getElementById('modal-overlay');
const modalTitle = document.getElementById('modal-title');
const modalMessage = document.getElementById('modal-message');
const modalCloseBtn = document.getElementById('modal-close-btn');

function showModal(title, message, callback = null) {
    modalTitle.textContent = title;
    modalMessage.textContent = message;
    modalOverlay.classList.add('show');

    modalCloseBtn.onclick = () => {
        modalOverlay.classList.remove('show');
        if (callback) callback();
    };
}

function updateUI() {
    players.forEach(p => {
        p.moneyEl.textContent = p.money;
        const cellEl = document.getElementById(`cell-${p.position}`);
        cellEl.appendChild(p.element);
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

function startTurn() {
    rolledThisTurn = false;
    updateUI();

    let player = players[currentTurn];

    if (player.isBot) {
        rollBtn.disabled = true;
        buyBtn.disabled = true;
        endTurnBtn.disabled = true;
        clearInterval(countdownTimer);
        countdownEl.textContent = "-";

        setTimeout(() => {
            executeRoll();
            setTimeout(botDecision, 1500);
        }, 1000);
    } else {
        rollBtn.disabled = false;
        startCountdown();
    }
}

function startCountdown() {
    timeLeft = 10;
    countdownEl.textContent = timeLeft;
    clearInterval(countdownTimer);

    countdownTimer = setInterval(() => {
        timeLeft--;
        countdownEl.textContent = timeLeft;
        if (timeLeft <= 0) {
            clearInterval(countdownTimer);
            if (!rolledThisTurn) {
                showModal("Waktu Habis", "Waktu Anda habis, sistem otomatis melempar dadu!");
                executeRoll();
                // Otomatis akhiri giliran jika human diam
                setTimeout(endTurn, 2000);
            }
        }
    }, 1000);
}

function executeRoll() {
    if (rolledThisTurn) return;
    clearInterval(countdownTimer);
    rolledThisTurn = true;

    const dice = Math.floor(Math.random() * 6) + 1;
    diceResult.textContent = `🎲 ${dice}`;

    let player = players[currentTurn];
    let oldPos = player.position;
    player.position = (player.position + totalCells) % totalCells; // perbaikan posisi
    player.position = (oldPos + dice) % totalCells;

    if (player.position < oldPos) {
        player.money += 200;
        showModal("Bonus START", `${player.name} melewati START dan mendapat $200!`);
    }

    updateUI();
    handleCellAction(player);
}

function handleCellAction(player) {
    if (properties[player.position]) {
        let prop = properties[player.position];
        if (prop.owner === null) {
            if (!player.isBot) {
                if (player.money >= prop.price) {
                    buyBtn.disabled = false;
                    endTurnBtn.disabled = false;
                    showModal("Beli Properti", `${prop.name} seharga $${prop.price} kosong. Anda bisa membelinya.`);
                } else {
                    endTurnBtn.disabled = false;
                    showModal("Info", `Uang tidak cukup untuk membeli ${prop.name}.`);
                }
            }
        } else if (prop.owner === player.id) {
            if (!player.isBot) {
                endTurnBtn.disabled = false;
                showModal("Info", `Ini properti milik Anda sendiri.`);
            }
        } else {
            let ownerPlayer = players.find(p => p.id === prop.owner);
            player.money -= prop.rent;
            ownerPlayer.money += prop.rent;
            updateUI();
            if (!player.isBot) {
                endTurnBtn.disabled = false;
                showModal("Bayar Sewa", `${player.name} mendarat di ${prop.name} milik ${ownerPlayer.name}, bayar sewa $${prop.rent}.`);
            }
        }
    } else if (player.position === 6) {
        player.money -= 100;
        updateUI();
        if (!player.isBot) {
            endTurnBtn.disabled = false;
            showModal("Pajak", `${player.name} terkena Pajak dan membayar $100!`);
        }
    } else if (player.position === 12) {
        player.position = 4;
        updateUI();
        if (!player.isBot) {
            endTurnBtn.disabled = false;
            showModal("Masuk Penjara", `${player.name} dijebloskan ke Penjara!`);
        }
    } else {
        if (!player.isBot) {
            endTurnBtn.disabled = false;
        }
    }

    if (player.isBot) {
        // Bot handling akan diproses di botDecision
    }
}

function botDecision() {
    let player = players[currentTurn];
    if (properties[player.position]) {
        let prop = properties[player.position];
        if (prop.owner === null && player.money >= prop.price + 100) {
            player.money -= prop.price;
            prop.owner = player.id;
            const cellEl = document.getElementById(`cell-${player.position}`);
            cellEl.style.backgroundColor = getBotColorBg(player.id);
            showModal("Aksi Bot", `${player.name} membeli ${prop.name} seharga $${prop.price}.`, endTurn);
            return;
        }
    }
    setTimeout(endTurn, 1000);
}

function getBotColorBg(id) {
    if (id === 1) return '#e7f1ff';
    if (id === 2) return '#e8f5e9';
    if (id === 3) return '#fffde7';
    return '#fff';
}

rollBtn.addEventListener('click', () => {
    executeRoll();
});

buyBtn.addEventListener('click', () => {
    let player = players[currentTurn];
    let prop = properties[player.position];

    if (prop && prop.owner === null && player.money >= prop.price) {
        player.money -= prop.price;
        prop.owner = player.id;
        buyBtn.disabled = true;

        const cellEl = document.getElementById(`cell-${player.position}`);
        cellEl.style.backgroundColor = '#ffdddd';

        updateUI();
        showModal("Sukses", `Anda berhasil membeli ${prop.name} seharga $${prop.price}!`);
    }
});

endTurnBtn.addEventListener('click', () => {
    endTurn();
});

function endTurn() {
    modalOverlay.classList.remove('show');
    currentTurn = (currentTurn + 1) % players.length;
    buyBtn.disabled = true;
    endTurnBtn.disabled = true;
    diceResult.textContent = `🎲 -`;
    startTurn();
}

// Mulai game
startTurn();
