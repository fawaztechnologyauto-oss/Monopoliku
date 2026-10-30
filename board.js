const TILES = [
    { id: 0, name: "START", type: "start", price: 0 },
    { id: 1, name: "Monas", type: "property", price: 60, rent: 10, color: "bg-amber-800" },
    { id: 2, name: "Dana Umum", type: "chest" },
    { id: 3, name: "Kota Tua", type: "property", price: 60, rent: 10, color: "bg-amber-800" },
    { id: 4, name: "Pajak Jalan", type: "tax", amount: 100 },
    { id: 5, name: "Stasiun Gambir", type: "station", price: 200, rent: 25 },
    { id: 6, name: "Ancol", type: "property", price: 100, rent: 15, color: "bg-sky-400" },
    { id: 7, name: "Kesempatan", type: "chance" },
    { id: 8, name: "Taman Mini", type: "property", price: 100, rent: 15, color: "bg-sky-400" },
    { id: 9, name: "Ragunan", type: "property", price: 120, rent: 20, color: "bg-sky-400" },
    { id: 10, name: "Penjara", type: "jail" },
    { id: 11, name: "Malioboro", type: "property", price: 140, rent: 22, color: "bg-pink-500" },
    { id: 12, name: "PLN", type: "utility", price: 150 },
    { id: 13, name: "Prambanan", type: "property", price: 140, rent: 22, color: "bg-pink-500" },
    { id: 14, name: "Borobudur", type: "property", price: 160, rent: 25, color: "bg-pink-500" },
    { id: 15, name: "Stasiun Tugu", type: "station", price: 200, rent: 25 },
    { id: 16, name: "Kuta Beach", type: "property", price: 180, rent: 28, color: "bg-orange-500" },
    { id: 17, name: "Dana Umum", type: "chest" },
    { id: 18, name: "Ubud", type: "property", price: 180, rent: 28, color: "bg-orange-500" },
    { id: 19, name: "Tanah Lot", type: "property", price: 200, rent: 30, color: "bg-orange-500" },
    { id: 20, name: "Parkir Gratis", type: "parking" },
    { id: 21, name: "Bromo", type: "property", price: 220, rent: 32, color: "bg-red-500" },
    { id: 22, name: "Kesempatan", type: "chance" },
    { id: 23, name: "Ijen", type: "property", price: 220, rent: 32, color: "bg-red-500" },
    { id: 24, name: "Batu Malang", type: "property", price: 240, rent: 35, color: "bg-red-500" },
    { id: 25, name: "Stasiun Gubeng", type: "station", price: 200, rent: 25 },
    { id: 26, name: "Danau Toba", type: "property", price: 260, rent: 38, color: "bg-yellow-500" },
    { id: 27, name: "PDAM", type: "utility", price: 150 },
    { id: 28, name: "Brastagi", type: "property", price: 260, rent: 38, color: "bg-yellow-500" },
    { id: 29, name: "Banda Aceh", type: "property", price: 280, rent: 40, color: "bg-yellow-500" },
    { id: 30, name: "Ke Penjara", type: "gotojail" },
    { id: 31, name: "Raja Ampat", type: "property", price: 300, rent: 45, color: "bg-emerald-600" },
    { id: 32, name: "Labuan Bajo", type: "property", price: 300, rent: 45, color: "bg-emerald-600" },
    { id: 33, name: "Dana Umum", type: "chest" },
    { id: 34, name: "Toraja", type: "property", price: 320, rent: 50, color: "bg-emerald-600" },
    { id: 35, name: "Stasiun Medan", type: "station", price: 200, rent: 25 },
    { id: 36, name: "Kesempatan", type: "chance" },
    { id: 37, name: "Bunaken", type: "property", price: 350, rent: 60, color: "bg-blue-700" },
    { id: 38, name: "Pajak Mewah", type: "tax", amount: 150 },
    { id: 39, name: "IKN Nusantara", type: "property", price: 400, rent: 70, color: "bg-blue-700" }
];

const propertyLevels = {};

function renderBoard() {
    const board = document.getElementById('board');
    if (!board) return;
    
    // Sisakan panel tengah, hapus petak lama jika dirender ulang
    const existingPanel = board.querySelector('.col-start-2');
    board.innerHTML = '';
    if (existingPanel) board.appendChild(existingPanel);
    
    TILES.forEach((tile, index) => {
        const el = document.createElement('div');
        el.className = 'tile text-slate-800';
        el.id = `tile-${index}`;

        // Pemetaan Grid 9 Kolom x 13 Baris (Total 40 Petak)
        if (index >= 0 && index <= 8) { 
            el.style.gridRow = "13"; 
            el.style.gridColumn = `${9 - index}`; 
        }
        else if (index >= 9 && index <= 20) { 
            el.style.gridColumn = "1"; 
            el.style.gridRow = `${13 - (index - 8)}`; 
        }
        else if (index >= 21 && index <= 28) { 
            el.style.gridRow = "1"; 
            el.style.gridColumn = `${index - 19}`; 
        }
        else if (index >= 29 && index <= 39) { 
            el.style.gridColumn = "9"; 
            el.style.gridRow = `${index - 27}`; 
        }

        let headerColor = tile.color || 'bg-transparent';
        let icon = '';
        if(tile.type === 'start') icon = '<i class="fa-solid fa-flag-checkered text-emerald-600"></i>';
        if(tile.type === 'jail') icon = '<i class="fa-solid fa-lock text-slate-600"></i>';
        if(tile.type === 'parking') icon = '<i class="fa-solid fa-car text-blue-600"></i>';
        if(tile.type === 'gotojail') icon = '<i class="fa-solid fa-handcuffs text-rose-600"></i>';
        if(tile.type === 'station') icon = '<i class="fa-solid fa-train text-slate-700"></i>';
        if(tile.type === 'tax') icon = '<i class="fa-solid fa-receipt text-rose-500"></i>';
        if(tile.type === 'chance') icon = '<i class="fa-solid fa-question text-amber-500 font-bold"></i>';
        if(tile.type === 'chest') icon = '<i class="fa-solid fa-box-archive text-sky-500"></i>';

        el.innerHTML = `
            ${tile.color ? `<div class="w-full h-1.5 ${headerColor} border-b border-slate-300"></div>` : ''}
            <div class="house-marker" id="house-marker-${index}"></div>
            <div class="my-auto px-0.5 leading-tight">
                ${icon ? `<div class="text-[9px] mb-0.5">${icon}</div>` : ''}
                <div class="font-bold tracking-tighter leading-none">${tile.name}</div>
                ${tile.price ? `<div class="text-[7px] text-slate-500 mt-0.5 font-semibold">$${tile.price}</div>` : ''}
            </div>
            <div class="token-container flex justify-center items-center gap-0.5 min-h-[12px] w-full pb-0.5"></div>
        `;
        board.appendChild(el);
    });
}

function updateHouseMarkers() {
    TILES.forEach(tile => {
        const markerBox = document.getElementById(`house-marker-${tile.id}`);
        if (markerBox) {
            markerBox.innerHTML = '';
            const owner = PLAYERS.find(p => p.properties.includes(tile.id));
            if (owner) {
                const lvl = propertyLevels[tile.id] || 1;
                for(let i = 0; i < lvl; i++) {
                    const house = document.createElement('div');
                    house.className = `house-unit ${owner.bgClass}`;
                    markerBox.appendChild(house);
                }
            }
        }
    });
}

function getPropertyRent(tile) {
    const baseRent = tile.rent || 20;
    const lvl = propertyLevels[tile.id] || 1;
    return Math.round(baseRent * (1 + (lvl - 1) * 0.5));
}

function updatePropertyListUI() {
    const listEl = document.getElementById('property-list');
    if (!listEl) return;
    listEl.innerHTML = '';

    let ownedCount = 0;
    const purchasableTiles = TILES.filter(t => t.type === 'property' || t.type === 'station' || t.type === 'utility');

    purchasableTiles.forEach(tile => {
        const owner = PLAYERS.find(p => p.properties.includes(tile.id));
        if (owner) ownedCount++;

        const rent = getPropertyRent(tile);
        const lvl = propertyLevels[tile.id] || 1;
        const isSelected = selectedPropertyTileId === tile.id;

        const item = document.createElement('div');
        item.onclick = () => {
            selectedPropertyTileId = tile.id;
            updatePropertyListUI();
        };

        item.className = `p-1.5 rounded-lg border flex justify-between items-center cursor-pointer transition ${isSelected ? 'bg-indigo-900/60 border-indigo-400' : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'}`;
        
        item.innerHTML = `
            <div class="flex items-center gap-2">
                <span class="w-2 h-2 rounded-full ${owner ? owner.bgClass : 'bg-slate-600'}"></span>
                <div>
                    <div class="font-bold text-slate-200">${tile.name} ${lvl > 1 ? `<span class="text-amber-400">⭐${lvl}</span>` : ''}</div>
                    <div class="text-[9px] text-slate-400">${owner ? `Pemilik: <span class="text-white">${owner.name}</span>` : 'Bebas'}</div>
                </div>
            </div>
            <div class="text-right">
                <div class="font-bold text-emerald-400">$${rent}/sewa</div>
                <div class="text-[9px] text-slate-500">Harga: $${tile.price}</div>
            </div>
        `;
        listEl.appendChild(item);
    });

    const availCountEl = document.getElementById('prop-available-count');
    const ownedCountEl = document.getElementById('prop-owned-count');
    if (availCountEl) availCountEl.innerText = purchasableTiles.length - ownedCount;
    if (ownedCountEl) ownedCountEl.innerText = ownedCount;
}
