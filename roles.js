function handleJailRules(player, addLogFunc) {
    if (!player.inJail) return false;

    if (!player.jailTurns) player.jailTurns = 1;

    // Pilihan 1: Bayar denda $50 langsung keluar
    if (player.money >= 50 && !player.isBot) {
        player.money -= 50;
        player.inJail = false;
        player.jailTurns = 0;
        addLogFunc(player.name, "Membayar denda $50 untuk keluar dari Penjara.");
        return false; // Bebas berjalan
    } else if (player.isBot && player.money >= 100) {
        player.money -= 50;
        player.inJail = false;
        player.jailTurns = 0;
        addLogFunc(player.name, "Bot membayar denda $50 untuk keluar dari Penjara.");
        return false;
    }

    // Maksimal 2 putaran di penjara, putaran ke-3 wajib bebas
    if (player.jailTurns >= 2) {
        player.inJail = false;
        player.jailTurns = 0;
        addLogFunc(player.name, "Masa tahanan selesai. Pemain bebas dari Penjara!");
        return false;
    }

    player.jailTurns++;
    addLogFunc(player.name, `Masih berada di Penjara (Sisa tahanan ${3 - player.jailTurns} putaran).`);
    return true; // Masih tertahan
}
