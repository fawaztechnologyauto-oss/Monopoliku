function handleJailRules(player, addLogFunc) {
    if (!player.inJail) return false;

    if (!player.jailTurns) player.jailTurns = 1;

    if (player.money >= 50 && !player.isBot) {
        player.money -= 50;
        player.inJail = false;
        player.jailTurns = 0;
        addLogFunc(player.name, "Membayar denda $50 untuk keluar dari Penjara.");
        return false;
    } else if (player.isBot && player.money >= 100 && Math.random() > 0.5) {
        player.money -= 50;
        player.inJail = false;
        player.jailTurns = 0;
        addLogFunc(player.name, "Bot membayar denda $50 untuk keluar dari Penjara.");
        return false;
    }

    if (player.jailTurns >= 2) {
        player.inJail = false;
        player.jailTurns = 0;
        addLogFunc(player.name, "Masa tahanan selesai. Pemain bebas dari Penjara!");
        return false;
    }

    player.jailTurns++;
    addLogFunc(player.name, `Masih berada di Penjara (Sisa tahanan ${3 - player.jailTurns} putaran).`);
    return true;
}
