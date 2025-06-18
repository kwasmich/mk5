import { UIView } from "/base/ui-view.js";
import { createEffect, createSignal } from "/util/signal.js";




export class SignalsView extends UIView {
    static get observedAttributes() {
        return [];
    }


    #shadowRoot = this.attachShadow({ mode: "closed" });
    #button = undefined;
    #signal = createSignal(0);


    constructor(...args) {
        const self = super(args);
        Object.seal(this);

        this._init(this.#shadowRoot);
        this._onInit();
        return self;
    }


    adoptedCallback() {}
    attributeChangedCallback(name, oldValue, newValue) {}
    connectedCallback() {}
    disconnectedCallback() {}


    _onInit() {
        this.#button = this.#shadowRoot.querySelector(`button`);

        this.#button.addEventListener('click', () => this._click());

        createEffect(() => {
            const [val, setVal] = this.#signal;
            this.#button.textContent = val();
        });
    }


    _click() {
        const [val, setVal] = this.#signal;
        setVal(val() + 1);
    }
}



UIView.define("signals-test", SignalsView, import.meta.url);
