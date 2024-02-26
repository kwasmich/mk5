// extend Math


function __extensions_clamp(value, min, max) {
    return Math.max(min, Math.min(value, max));
}


if (__extensions_clamp !== undefined) {
    Object.defineProperty(Math, "clamp",  { configurable: true, enumerable: false, value: __extensions_clamp, writable: true });
}

