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



// extend registry to keep a list of registered elements

const __extensions_defineCustomElementDescriptor = Object.getOwnPropertyDescriptor(CustomElementRegistry.prototype, "define");
const registry = new Map();

function __extensions_defineCustomElementFunction(tagName, elementClass) {
    __extensions_defineCustomElementDescriptor.value.call(this, tagName, elementClass);
    registry.set(elementClass, tagName);
}

if (__extensions_defineCustomElementDescriptor !== undefined) {
    Object.defineProperty(CustomElementRegistry.prototype, "define", { value: __extensions_defineCustomElementFunction, configurable: true, enumerable: true, writable: true});
    Object.defineProperty(CustomElementRegistry.prototype, "registry", { get: () => registry, configurable: true, enumerable: true});
}
