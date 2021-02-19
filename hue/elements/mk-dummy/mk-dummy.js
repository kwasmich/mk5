import { UIView } from "/base/ui-view.js";



const priv = Symbol("private");



export class HueRoomDetail extends UIView {
    static get observedAttributes() {
        return [];
    }


    constructor(...args) {
        const self = super(args);

        this[priv] = this[priv] ?? {};
        this[priv].shadowRoot = this.attachShadow({ mode: "closed" });
        Object.seal(this);
        Object.seal(this[priv]);

        this._init(this[priv].shadowRoot);
        return self;
    }


    adoptedCallback() {}
    attributeChangedCallback(name, oldValue, newValue) {}
    connectedCallback() {}
    disconnectedCallback() {}
}



HueRoomDetail.templatePromise = null;
HueRoomDetail.metaURL = import.meta.url;
Object.seal(HueRoomDetail);



customElements.define("hue-room-detail", HueRoomDetail);
