// extend closest such that it can search past shadow root boundaries

const __extensions_closestDescriptor = Object.getOwnPropertyDescriptor(Element.prototype, "closest");

function __extensions_closestFunction(selector) {
    function getNext(el, next = el && __extensions_closestDescriptor.value.call(el, selector)) {
        if (el instanceof Window || el instanceof Document || !el) {
            return null;
        }

        return next ? next : getNext(el.getRootNode().host);
    }

    return getNext(this);
}

if (__extensions_closestDescriptor !== undefined) {
    Object.defineProperty(Element.prototype, "closest", { value: __extensions_closestFunction, configurable: true, enumerable: true, writable: true });
}
