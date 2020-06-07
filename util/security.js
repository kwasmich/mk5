// https://www.owasp.org/index.php/AJAX_Security_Cheat_Sheet#Use_.innerText_instead_of_.innerHtml

const __extensions_innerHTMLDescriptor = Object.getOwnPropertyDescriptor(Element.prototype, "innerHTML");

function __extensions_setInnerHTMLFunction(value) {
    console.error("Calling innerHTML is unsafe! Consider using textContent instead.");
    this.unsafeInnerHTML = value;
}

if (__extensions_innerHTMLDescriptor !== undefined) {
    Object.defineProperty(Element.prototype, "unsafeInnerHTML", __extensions_innerHTMLDescriptor);
    Object.defineProperty(Element.prototype, "innerHTML", {get: __extensions_innerHTMLDescriptor.get, set: __extensions_setInnerHTMLFunction, configurable: true, enumerable: true});
}

const __extensions_eval = "eval";

window.unsafeEval = window[__extensions_eval];
window[__extensions_eval] = undefined;
