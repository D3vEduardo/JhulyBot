export function FormatSaldo(num) {
    const numFormat = num.toFixed(2).replace(".", ",");
    return `JɃ${numFormat}`;
}
