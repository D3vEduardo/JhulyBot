export function CalcSaúdeFinanceira(saldo) {
    if (saldo === 0) {
        return "Péssima";
    }
    else if (saldo <= 1000) {
        return "Ruim";
    }
    else if (saldo <= 10000) {
        return "Média";
    }
    else if (saldo <= 100000) {
        return "Boa";
    }
    else if (saldo <= 1000000) {
        return "Ótima";
    }
    else if (saldo <= 1000000000) {
        return "Espetacular";
    }
    else if (saldo <= 100000000000) {
        return "Super-Espetacular";
    }
    else {
        return "Super-Hiper-Mega-Espetacular";
    }
}
