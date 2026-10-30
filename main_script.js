const SPREADSHEET_ID = "1XKAcbRIgjeKUOyioq0TdtnAs8SJDAXgPKhuA58AwJc4";
let webAppUrl = localStorage.getItem('monopoly_webapp_url') || '';

let turnRound = 1;
let currentPlayerIndex = 0;
let turnTimerInterval = null;
let timeLeft = 10;
let isProcessingTurn = false;
let hasRolled = false;
let pendingBuyTile = null;
let selectedPropertyTileId = null;

window.onload = () => {
    renderBoard();
    renderPlayerCards();
    updateTokens();
    updatePropertyListUI();
    startTurnTimer();
    if(webAppUrl) {
        const inputUrl = document.getElementById('setting-url');
        if (inputUrl) inputUrl.value = webAppUrl;
    }
    addLog("System", "Game Monopoli Siap Dimainkan!");
};

function addLog(sender, message) {
    const logsContainer = document.getElementById('game-logs');
    if (!logsContainer) return;
    const logItem = document.createElement('div');
    logItem.className = 'text-[11px] text-slate-300';
    logItem.innerHTML = `<span class="text-indigo-400 font-bold">[${sender}]</span> ${message}`;
    logsContainer.appendChild(logItem);
    logsContainer.scrollTop = logsContainer.scrollHeight;
}

function clearLogs() {
    const logsContainer = document.getElementById('game-logs');
    if (logsContainer) logsContainer.innerHTML = '';
}

function startTurnTimer() {
    clearInterval(turnTimerInterval);
    timeLeft = 10;
    updateTimerUI();
    
    turnTimerInterval = setInterval(() => {
        timeLeft--;
        updateTimerUI();
        if (timeLeft <= 0) {
            clearInterval(turnTimerInterval);
            addLog("System", `Waktu ${PLAYERS[currentPlayerIndex].name} habis! Auto Turn.`);
            endTurn();
        }
    }, 1000);
}

function updateTimerUI() {
    const timerBadge = document.getElementById('timer-badge');
    const timerBar = document.getElementById('timer-bar');
    if (timerBadge) timerBadge.innerText = `${timeLeft}s`;
    if (timerBar) {
        const percentage = (timeLeft / 10) * 100;
        timerBar.style.width = `${percentage}%`;
    }
}

// Fungsi Animasi Pengacakan Dadu
function animateDiceRoll() {
    return new Promise((resolve) => {
        let counter = 0;
        const dice1El = document.getElementById('dice-1');
        const dice2El = document.getElementById('dice-2');
        
        dice1El.classList.add('animate-bounce');
        dice2El.classList.add('animate-bounce');

        const rollInterval = setInterval(() => {
            dice1El.innerText = Math.floor(Math.random() * 6) + 1;
            dice2El.innerText = Math.floor(Math.random() * 6) + 1;
            counter++;

            if (counter > 10) {
                clearInterval(rollInterval);
                dice1El.classList.remove('animate-bounce');
                dice2El.classList.remove('animate-bounce');
                resolve();
            }
        }, 60);
    });
}

// Fungsi Lempar Dadu & Animasi Berjalan Petak demi Petak
async function handleRollDice() {
    if (hasRolled) return;
    hasRolled = true;
    
    // Jalankan animasi pengacakan dadu terlebih dahulu
    await animateDiceRoll();

    const d1 = Math.floor(Math.random() * 6) + 1;
    const d2 = Math.floor(Math.random() * 6) + 1;
    
    document.getElementById('dice-1').innerText = d1;
    document.getElementById('dice-2').innerText = d2;
    
    const total = d1 + d2;
    const player = PLAYERS[currentPlayerIndex];
    
    addLog(player.name, `Melempar dadu ${d1} + ${d2} = ${total}. Berjalan...`);

    // Animasi pergerakan pion satu per satu petak
    for (let step = 0; step < total; step++) {
        player.pos = (player.pos + 1) % TILES.length;
        
        if (player.pos === 0) {
            player.money += 200;
            addLog(player.name, `Melewati START! Mendapatkan bonus $200.`);
            renderPlayerCards();
        }
        
        updateTokens();
        // Jeda waktu (200ms) untuk efek animasi melangkah
        await new Promise(resolve => setTimeout(resolve, 200)); 
    }
    
    // Setelah selesai berjalan, cek aksi pada petak terakhir
    checkTileAction(player);
    
    document.getElementById('btn-roll').disabled = true;
    document.getElementById('btn-end').disabled = false;
}

function checkTileAction(player) {
    const tile = TILES[player.pos];
    
    if (tile.type === 'property' || tile.type === 'station' || tile.type === 'utility') {
        const owner = PLAYERS.find(p => p.properties.includes(tile.id));
        if (!owner) {
            if (!player.isBot) {
                pendingBuyTile = tile;
                showBuyModal(tile);
            } else if (player.money >= tile.price) {
                player.money -= tile.price;
                player.properties.push(tile.id);
                addLog(player.name, `Membeli ${tile.name} seharga $${tile.price}`);
                updatePropertyListUI();
                updateHouseMarkers();
                renderPlayerCards();
            }
        } else if (owner.id !== player.id) {
            const rent = getPropertyRent(tile);
            player.money -= rent;
            owner.money += rent;
            addLog(player.name, `Membayar sewa $${rent} kepada ${owner.name} di ${tile.name}`);
            renderPlayerCards();
        }
    } else if (tile.type === 'chance') {
        const card = CHANCE_CARDS[Math.floor(Math.random() * CHANCE_CARDS.length)];
        card.action(player);
        showCardModal("KESEMPATAN", card.title, card.desc);
        addLog(player.name, `Mendapat Kesempatan: ${card.title}`);
        renderPlayerCards();
    } else if (tile.type === 'chest') {
        const card = CHEST_CARDS[Math.floor(Math.random() * CHEST_CARDS.length)];
        card.action(player);
        showCardModal("DANA UMUM", card.title, card.desc);
        addLog(player.name, `Mendapat Dana Umum: ${card.title}`);
        renderPlayerCards();
    }
}

function showBuyModal(tile) {
    document.getElementById('buy-title').innerText = `Beli ${tile.name}?`;
    document.getElementById('buy-desc').innerText = `Harga: $${tile.price}. Modal Anda: $${PLAYERS[currentPlayerIndex].money}`;
    document.getElementById('modal-buy').classList.remove('hidden');
}

function confirmBuy(willBuy) {
    document.getElementById('modal-buy').classList.add('hidden');
    if (willBuy && pendingBuyTile) {
        const player = PLAYERS[currentPlayerIndex];
        if (player.money >= pendingBuyTile.price) {
            player.money -= pendingBuyTile.price;
            player.properties.push(pendingBuyTile.id);
            addLog(player.name, `Membeli ${pendingBuyTile.name} seharga $${pendingBuyTile.price}`);
            updatePropertyListUI();
            updateHouseMarkers();
            renderPlayerCards();
        } else {
            addLog("System", "Uang tidak cukup untuk membeli properti ini!");
        }
    }
    pendingBuyTile = null;
}

function showCardModal(category, title, desc) {
    document.getElementById('card-category').innerText = category;
    document.getElementById('card-title').innerText = title;
    document.getElementById('card-desc').innerText = desc;
    document.getElementById('modal-card').classList.remove('hidden');
}

function closeCardModal() {
    document.getElementById('modal-card').classList.add('hidden');
}

function endTurn() {
    clearInterval(turnTimerInterval);
    hasRolled = false;
    
    currentPlayerIndex = (currentPlayerIndex + 1) % PLAYERS.length;
    if (currentPlayerIndex === 0) {
        turnRound++;
        document.getElementById('turn-count').innerText = turnRound;
    }
    
    const currentPlayer = PLAYERS[currentPlayerIndex];
    document.getElementById('current-player-name').innerHTML = `
        <span class="w-3 h-3 rounded-full ${currentPlayer.bgClass} inline-block"></span> ${currentPlayer.name}
    `;
    
    document.getElementById('btn-roll').disabled = currentPlayer.isBot;
    document.getElementById('btn-end').disabled = true;
    
    renderPlayerCards();
    startTurnTimer();
    
    if (currentPlayer.isBot) {
        setTimeout(async () => {
            await handleRollDice();
            setTimeout(() => {
                endTurn();
            }, 1500);
        }, 1000);
    }
}

function actionUpgradeProperty() {
    if (selectedPropertyTileId === null) return;
    const player = PLAYERS[currentPlayerIndex];
    if (player.properties.includes(selectedPropertyTileId)) {
        const currentLvl = propertyLevels[selectedPropertyTileId] || 1;
        const upgradeCost = 100;
        if (player.money >= upgradeCost) {
            player.money -= upgradeCost;
            propertyLevels[selectedPropertyTileId] = currentLvl + 1;
            addLog(player.name, `Meng-upgrade ${TILES[selectedPropertyTileId].name} ke Level ${currentLvl + 1}`);
            updatePropertyListUI();
            updateHouseMarkers();
            renderPlayerCards();
        } else {
            addLog("System", "Uang tidak cukup untuk upgrade!");
        }
    }
}

function actionAuctionProperty() {
    addLog("System", "Fitur lelang belum diaktifkan.");
}

function actionAcquireProperty() {
    addLog("System", "Fitur akuisisi belum diaktifkan.");
}

function openSettingsModal() {
    document.getElementById('modal-settings').classList.remove('hidden');
}

function closeSettingsModal() {
    document.getElementById('modal-settings').classList.add('hidden');
}

function saveSettings() {
    const url = document.getElementById('setting-url').value;
    webAppUrl = url;
    localStorage.setItem('monopoly_webapp_url', url);
    closeSettingsModal();
    addLog("System", "Pengaturan WebApp URL disimpan.");
}

function resetGame() {
    location.reload();
}

function toggleFullscreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    }
}
