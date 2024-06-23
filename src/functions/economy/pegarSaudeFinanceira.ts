export function CalcSaúdeFinanceira(saldo: number) {
    if (saldo === 0) {
        return "Ruim";
    } else if (saldo <= 1000) {
        return "Média";
    } else if (saldo <= 10000) {
        return "Boa";
    } else if (saldo <= 100000) {
        return "Ótima";
    } else if (saldo <= 1000000) {
        return "Espetacular";
    } else if (saldo <= 1000000000) {
        return "Super-Espetacular";
    } else if (saldo <= 100000000000) {
        return "Hiper-Espetacular";
    } else {
        return "Super-Hiper-Mega-Espetacular";
    }
}
