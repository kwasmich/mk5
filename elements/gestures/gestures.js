import { UIView } from "/base/ui-view.js";



export class Gestures extends UIView {
    static get observedAttributes() {
        return [];
    }


    #shadowRoot = this.attachShadow({ mode: "closed" });
    #onPointerDown = this._onPointerDown.bind(this);
    #onPointerMove = this._onPointerMove.bind(this);
    #onPointerUp = this._onPointerUp.bind(this);

    #test = /*html*/`
<nav>
    <slot name="tab"></slot>
</nav>
<div>
    <slot name="content"></slot>
</div>
    `


    constructor(...args) {
        const self = super(args);
        Object.seal(this);

        this._init(this.#shadowRoot);
        return self;
    }


    adoptedCallback() { }
    attributeChangedCallback(name, oldValue, newValue) { }


    connectedCallback() {
        this.#shadowRoot.ownerDocument.addEventListener("pointerdown", this.#onPointerDown);
    }


    disconnectedCallback() {
        this.#shadowRoot.ownerDocument.removeEventListener("pointerdown", this.#onPointerDown);
    }


    _onPointerDown(pointerEvent) {
        this.#shadowRoot.ownerDocument.addEventListener("pointermove", this.#onPointerMove);
        this.#shadowRoot.ownerDocument.addEventListener("pointerup", this.#onPointerUp);
        this.#shadowRoot.ownerDocument.addEventListener("pointercancel", this.#onPointerUp);

        const dot = this.#shadowRoot.ownerDocument.createElement("DIV");
        dot.classList.add("dot");
        dot.style.left = `${pointerEvent.pageX}px`;
        dot.style.top = `${pointerEvent.pageY}px`;
        dot.id = pointerEvent.pointerId;
        this.#shadowRoot.append(dot);
        return false;
    }


    _onPointerMove(pointerEvent) {
        const dot = this.#shadowRoot.getElementById(pointerEvent.pointerId);
        dot.style.left = `${pointerEvent.pageX}px`;
        dot.style.top = `${pointerEvent.pageY}px`;
        return false;
    }


    _onPointerUp(pointerEvent) {
        this.#shadowRoot.ownerDocument.removeEventListener("pointercancel", this.#onPointerUp);
        this.#shadowRoot.ownerDocument.removeEventListener("pointerup", this.#onPointerUp);
        this.#shadowRoot.ownerDocument.removeEventListener("pointermove", this.#onPointerMove);
        
        const dot = this.#shadowRoot.getElementById(pointerEvent.pointerId);
        dot.remove();
    }
}



UIView.define("my-gestures", Gestures, import.meta.url);
