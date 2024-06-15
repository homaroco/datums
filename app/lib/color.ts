export function getRandomHslValues() {
    let h = Math.ceil(Math.random() * 360)
    let s
    do {
        s = Math.ceil(Math.random() * 100)
    } while (s < 33)
    let l
    do {
        l = Math.ceil(Math.random() * 100)
    } while (l < 20 || l > 80)
    return { h, s, l }
}

export function getContrastColor(color: string) {
    color = (color.charAt(0) === '#') ? color.substring(1, 7) : color
    const r = parseInt(color.substring(0, 2), 16) // hexToR
    const g = parseInt(color.substring(2, 4), 16) // hexToG
    const b = parseInt(color.substring(4, 6), 16) // hexToB
    const uicolors = [r / 255, g / 255, b / 255]
    const c = uicolors.map(col => {
        if (col <= 0.03928) {
            return col / 12.92
        }
        return Math.pow((col + 0.055) / 1.055, 2.4)
    })
    const L = (0.2126 * c[0]) + (0.7152 * c[1]) + (0.0722 * c[2])
    return (L > 0.179) ? '#0d0d0d' : 'white'
}

export function getHslString(hsl: { h: number, s: number, l: number }) {
    return `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`
}

export function convertHslValuesToHexString({ h, s, l }: { h: number, s: number, l: number }) {
    l /= 100;
    const a = s * Math.min(l, 1 - l) / 100;
    const f = n => {
        const k = (n + h / 30) % 12;
        const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
        return Math.round(255 * color).toString(16).padStart(2, '0');   // convert to Hex and prefix "0" if needed
    };
    return `#${f(0)}${f(8)}${f(4)}`;
}