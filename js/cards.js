export const CHANCE_CARDS = [
    { title: "Kupon Hadiah", desc: "Anda memenangkan kontes lokal. Dapatkan $100 dari bank!", action: (p) => { p.money += 100; } },
    { title: "Denda Tilang", desc: "Melanggar lampu lalu lintas. Bayar denda $50 ke bank.", action: (p) => { p.money -= 50; } },
    { title: "Diskon Pajak", desc: "Pemerintah memberikan pengembalian pajak sebesar $150.", action: (p) => { p.money += 150; } },
    { title: "Perbaikan Rumah", desc: "Lakukan renovasi bangunan. Bayar $75 ke bank.", action: (p) => { p.money -= 75; } }
];

export const CHEST_CARDS = [
    { title: "Dana Hibah", desc: "Menerima dana bantuan usaha sebesar $200.", action: (p) => { p.money += 200; } },
    { title: "Biaya Rumah Sakit", desc: "Bayar biaya perawatan kesehatan $100.", action: (p) => { p.money -= 100; } }
];
