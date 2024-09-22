export function FormatSaldo(num: number) {
    const numFormat = num.toFixed(2).replace(".", ",");
    return `JɃ${numFormat}`;
}