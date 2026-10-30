const SPREADSHEET_ID = "1XKAcbRIgjeKUOyioq0TdtnAs8SJDAXgPKhuA58AwJc4";
let webAppUrl = localStorage.getItem('monopoly_webapp_url') || '';

let turnRound = 1;
let currentPlayerIndex = 0;
let turnTimerInterval = null;
let modalTimerInterval = null;
let timeLeft = 10;
let modalTimeLeft = 10;
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
    
    const currentPlayer = PLAYERS[currentPlayerIndex];
    document.getElementById('btn-roll').disabled = currentPlayer.isBot || hasRolled;

    turnTimerInterval = setInterval(async () => {
        const isModalOpen = !document.getElementById('modal-buy').classList.contains('hidden') ||
                            !document.getElementById('modal-card').classList.contains('hidden') ||
                            !document.getElementById('modal-alert').classList.contains('hidden');
        if (isModalOpen) return;

        timeLeft--;
        updateTimerUI();
        if (timeLeft <= 0) {
            clearInterval(turnTimerInterval);
            addLog("System", `Waktu ${currentPlayer.name} habis!`);
            
            if (!hasRolled && !currentPlayer.isBot) {
                await handleRollDice();
            } else {
                endTurn();
            }
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

async function handleRollDice() {
    if (hasRolled) return;
    hasRolled = true;
    
    const player = PLAYERS[currentPlayerIndex];

    if (player.inJail) {
        const isInJail = handleJailRules(player, addLog);
        renderPlayerCards();
        if (isInJail) {
            document.getElementById('btn-roll').disabled = true;
            document.getElementById('btn-end').disabled = false;
            return;
        }
    }

    await animateDiceRoll();

    const d1 = Math.floor(Math.random() * 6) + 1;
    const d2 = Math.floor(Math.random() * 6) + 1;
    
    document.getElementById('dice-1').innerText = d1;
    document.getElementById('dice-2').innerText = d2;
    
    const total = d1 + d2;
    addLog(player.name, `Melempar dadu ${d1} + ${d2} = ${total}. Berjalan...`);

    for (let step = 0; step < total; step++) {
        player.pos = (player.pos + 1) % TILES.length;
        
        if (player.pos === 0) {
            player.money += 200;
            addLog(player.name, `Melewati START! Mendapatkan bonus $200.`);
            renderPlayerCards();
        }
        
        updateTokens();
        await new Promise(resolve => setTimeout(resolve, 200)); 
    }
    
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
            } else {
                if (player.money >= tile.price && Math.random() < 0.7) {
                    player.money -= tile.price;
                    player.properties.push(tile.id);
                    addLog(player.name, `Membeli ${tile.name} seharga $${tile.price}`);
                    updatePropertyListUI();
                    updateHouseMarkers();
                    renderPlayerCards();
                } else {
                    addLog(player.name, `Melewati pembelian ${tile.name}.`);
                }
            }
        } else if (owner.id !== player.id) {
            const rent = getPropertyRent(tile);
            player.money -= rent;
            owner.money += rent;
            addLog(player.name, `Membayar sewa $${rent} kepada ${owner.name} di ${tile.name}`);
            renderPlayerCards();
        }
    } else if (tile.type === 'gotojail') {
        player.pos = 10;
        player.inJail = true;
        player.jailTurns = 0;
        updateTokens();
        addLog(player.name, `Ditangkap dan dijebloskan ke Penjara!`);
        renderPlayerCards();
    } else if (tile.type === 'tax') {
        player.money -= tile.amount;
        addLog(player.name, `Membayar pajak sebesar $${tile.amount}`);
        renderPlayerCards();
    }
}

function showBuyModal(tile) {
    pendingBuyTile = tile;
    document.getElementById('buy-title').innerText = `Beli ${tile.name}?`;
    document.getElementById('buy-desc').innerText = `Harga: $${tile.price}. Modal Anda: $${PLAYERS[currentPlayerIndex].money}`;
    document.getElementById('modal-buy').classList.remove('hidden');

    modalTimeLeft = 10;
    clearInterval(modalTimerInterval);
    modalTimerInterval = setInterval(() => {
        modalTimeLeft--;
        if (modalTimeLeft <= 0) {
            clearInterval(modalTimerInterval);
            confirmBuy(false); // Otomatis Lewati jika waktu modal habis
        }
    }, 1000);
}

function confirmBuy(willBuy) {
    clearInterval(modalTimerInterval);
    document.getElementById('modal-buy').classList.add('hidden');
    const player = PLAYERS[currentPlayerIndex];
    if (willBuy && pendingBuyTile) {
        if (player.money >= pendingBuyTile.price) {
            player.money -= pendingBuyTile.price;
            player.properties.push(pendingBuyTile.id);
            addLog(player.name, `Membeli ${pendingBuyTile.name} seharga $${pendingBuyTile.price}`);
            updatePropertyListUI();
            updateHouseMarkers();
            renderPlayerCards();
        } else {
            addLog("System", "Uang tidak cukup! Properti dilelang otomatis.");
            actionAuctionProperty(pendingBuyTile);
        }
    } else if (!willBuy && pendingBuyTile) {
        addLog("System", `Properti ${pendingBuyTile.name} dilewati, masuk ke lelang publik.`);
        actionAuctionProperty(pendingBuyTile);
    }
    pendingBuyTile = null;

    // PERBAIKAN: Jika sebelumnya waktu giliran utama sudah habis (atau dilempar otomatis karena waktu habis), 
    // setelah modal ditutup langsung akhiri giliran secara otomatis.
    if (timeLeft <= 0) {
        addLog("System", "Waktu habis setelah aksi, mengakhiri giliran otomatis.");
        endTurn();
    } else {
        startTurnTimer();
    }
}

function showAlertModal(message) {
    document.getElementById('alert-desc').innerText = message;
    document.getElementById('modal-alert').classList.remove('hidden');
}

function closeAlertModal() {
    document.getElementById('modal-alert').classList.add('hidden');
}

function validateHumanTurn() {
    const currentPlayer = PLAYERS[currentPlayerIndex];
    if (currentPlayer.isBot) {
        showAlertModal("Bukan giliran Anda! Kontrol properti hanya bisa diakses pada giliran Anda.");
        return false;
    }
    return true;
}

function actionUpgradeProperty() {
    if (!validateHumanTurn()) return;
    if (selectedPropertyTileId === null) {
        showAlertModal("Pilih properti terlebih dahulu dari daftar!");
        return;
    }
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
            addLog("System", "Uang tidak cukup untuk upgrade bangunan!");
        }
    } else {
        showAlertModal("Anda bukan pemilik properti ini!");
    }
}

function actionAuctionProperty(tileOverride = null) {
    const tileId = tileOverride ? tileOverride.id : selectedPropertyTileId;
    if (tileId === null && !tileOverride) {
        if (!validateHumanTurn()) return;
        showAlertModal("Pilih properti yang ingin dilelang!");
        return;
    }
    const tile = TILES[tileId];
    let highestBidder = null;
    let highestBid = Math.round(tile.price * 0.5);

    PLAYERS.forEach(p => {
        if (p.money >= highestBid && Math.random() > 0.3) {
            highestBidder = p;
            highestBid += 20;
        }
    });

    if (highestBidder) {
        const owner = PLAYERS.find(p => p.properties.includes(tile.id));
        if (owner) {
            owner.properties = owner.properties.filter(id => id !== tile.id);
        }
        highestBidder.money -= highestBid;
        highestBidder.properties.push(tile.id);
        addLog("Lelang", `${highestBidder.name} memenangkan lelang ${tile.name} seharga $${highestBid}!`);
        updatePropertyListUI();
        updateHouseMarkers();
        renderPlayerCards();
    } else {
        addLog("Lelang", `Lelang ${tile.name} gagal, tidak ada penawar yang berminat.`);
    }
}

function actionAcquireProperty() {
    if (!validateHumanTurn()) return;
    if (selectedPropertyTileId === null) {
        showAlertModal("Pilih properti yang ingin diakuisisi dari daftar!");
        return;
    }
    const player = PLAYERS[currentPlayerIndex];
    const tile = TILES[selectedPropertyTileId];
    const owner = PLAYERS.find(p => p.properties.includes(tile.id));

    if (!owner) {
        showAlertModal("Properti ini belum dimiliki siapa pun!");
        return;
    }
    if (owner.id === player.id) {
        showAlertModal("Anda sudah memiliki properti ini!");
        return;
    }

    const acquisitionCost = tile.price * 1.5;
    if (player.money >= acquisitionCost) {
        if (owner.isBot && Math.random() < 0.4) {
            addLog("Akuisisi", `${owner.name} menolak melepas properti ${tile.name}!`);
            showAlertModal(`${owner.name} menolak tawaran akuisisi Anda.`);
            return;
        }

        player.money -= acquisitionCost;
        owner.money += acquisitionCost;

        owner.properties = owner.properties.filter(id => id !== tile.id);
        player.properties.push(tile.id);

        addLog(player.name, `Mengakuisisi ${tile.name} dari ${owner.name} seharga $${acquisitionCost}`);
        updatePropertyListUI();
        updateHouseMarkers();
        renderPlayerCards();
    } else {
        addLog("System", "Uang Anda tidak cukup untuk melakukan akuisisi!");
    }
}

function endTurn() {
    clearInterval(turnTimerInterval);
    clearInterval(modalTimerInterval);
    hasRolled = false;
    
    currentPlayerIndex = (currentPlayerIndex + 1) % PLAYERS.length;
    if (currentPlayerIndex === 0) {
        turnRound++;
        document.getElementById('turn-count').innerText = turnRound;
    }
    
    const currentPlayer = PLAYERS[currentPlayerIndex];
    document.getElementById('current-player-name').innerHTML = `
        <span class="w-2 h-2 rounded-full ${currentPlayer.bgClass} inline-block"></span> ${currentPlayer.name}
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
