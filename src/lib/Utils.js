export function mapClass(o) {
    return Object
        .keys(o)
        .filter(p => o[p])
        .join(" ");
}
