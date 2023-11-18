// extend Promise to allow for timeout

const __extensions_allDescriptor = Object.getOwnPropertyDescriptor(Promise, "all");
// const __extensions_allSettledDescriptor = Object.getOwnPropertyDescriptor(Promise.prototype, "allSettled");
// const __extensions_anyDescriptor = Object.getOwnPropertyDescriptor(Promise.prototype, "any");
// const __extensions_raceDescriptor = Object.getOwnPropertyDescriptor(Promise.prototype, "race");


function __extensions_allFunction(iterable, timeout) {
    if (timeout) {
        let timer;

        const timeoutPromise = (resolve, reject) => {
            timer = setTimeout(() => reject(), timeout);
        };

        return Promise.race([
            __extensions_allDescriptor.value.call(this, iterable),
            new Promise(timeoutPromise)
        ])
        .then(
            (result) => {
                clearTimeout(timer);
                return result;
            }
        );
    }

    return __extensions_allDescriptor.value.call(this, iterable);
}


if (__extensions_allDescriptor !== undefined) {
    Object.defineProperty(Promise, "all",  { ...__extensions_allDescriptor, value: __extensions_allFunction });
}

