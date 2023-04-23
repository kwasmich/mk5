import "../hue-no-detail/hue-no-detail.js";
import "../hue-primary/hue-primary.js";
import { UIView } from "/base/ui-view.js";



class HueMainElement extends UIView {
    static get observedAttributes() {
        return [];
    }


    #shadowRoot = this.attachShadow({ mode: "closed" });
    

    constructor(...args) {
        const self = super(args);
        Object.seal(this);

        this._init(this.#shadowRoot);
        return self;
    }


    adoptedCallback() {}
    attributeChangedCallback(name, oldValue, newValue) {}
    connectedCallback() {}
    disconnectedCallback() {}
}



UIView.define("mk-hue-main", HueMainElement, import.meta.url);