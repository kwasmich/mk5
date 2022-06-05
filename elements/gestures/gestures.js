import { UIView } from "/base/ui-view.js";



export class Gestures extends UIView {
    static get observedAttributes() {
        return [];
    }


    #shadowRoot = this.attachShadow({ mode: "closed" });
    #onTouchStart = this._onTouchStart.bind(this);
    #onTouchMove = this._onTouchMove.bind(this);
    #onTouchEnd = this._onTouchEnd.bind(this);


    constructor(...args) {
        const self = super(args);
        Object.seal(this);

        this._init(this.#shadowRoot);
        return self;
    }


    adoptedCallback() { }
    attributeChangedCallback(name, oldValue, newValue) { }


    connectedCallback() {
        this.#shadowRoot.ownerDocument.addEventListener("touchstart", this.#onTouchStart);
        this.#shadowRoot.ownerDocument.addEventListener("touchmove", this.#onTouchMove);
        this.#shadowRoot.ownerDocument.addEventListener("touchend", this.#onTouchEnd);
        this.#shadowRoot.ownerDocument.addEventListener("touchcancel", this.#onTouchEnd);
        this.#shadowRoot.ownerDocument.addEventListener("scroll", (e) => console.log(e));
    }


    disconnectedCallback() {
        this.#shadowRoot.ownerDocument.removeEventListener("touchcancel", this.#onTouchEnd);
        this.#shadowRoot.ownerDocument.removeEventListener("touchend", this.#onTouchEnd);
        this.#shadowRoot.ownerDocument.removeEventListener("touchmove", this.#onTouchMove);
        this.#shadowRoot.ownerDocument.removeEventListener("touchstart", this.#onTouchStart);
    }


    _onTouchStart(touchEvent) {
        [...touchEvent.changedTouches].forEach((t) => {
            const dot = this.#shadowRoot.ownerDocument.createElement("DIV");
            dot.classList.add("dot");
            dot.style.left = `${t.pageX}px`;
            dot.style.top = `${t.pageY}px`;
            dot.id = t.identifier;
            this.#shadowRoot.append(dot);
        })
        return false;
    }


    _onTouchMove(touchEvent) {
        [...touchEvent.changedTouches].forEach((t) => {
            const dot = this.#shadowRoot.getElementById(t.identifier);
            dot.style.left = `${t.pageX}px`;
            dot.style.top = `${t.pageY}px`;
        })
        return false;
    }


    _onTouchEnd(touchEvent) {
        [...touchEvent.changedTouches].forEach((t) => {
            const dot = this.#shadowRoot.getElementById(t.identifier);
            dot.remove();
        })
    }
}



UIView.define("my-gestures", Gestures, import.meta.url);
