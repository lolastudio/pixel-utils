let compare = (a, b) => {
    return Math.abs(a.r - b.r) + Math.abs(a.g - b.g) + Math.abs(a.b - b.b);
}

compare({ r: 250, g: 250, b: 250 }, { r: 13, g: 11, b: 8 });