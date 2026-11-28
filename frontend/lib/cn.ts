// Pieni apufunktio ehdollisten Tailwind-luokkien yhdistämiseen.
// Funktio ei ratkaise ristiriitaisia luokkia, mutta meidän käytössämme
// luokat rakennetaan niin, ettei ristiriitoja synny.
export function cn(
    ...classes: Array<string | false | null | undefined>
): string {
    return classes.filter(Boolean).join(" ");
}
