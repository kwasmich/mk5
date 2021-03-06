import { UIView } from "/base/ui-view.js";



const priv = Symbol("private");



export class HueRoomDetail extends UIView {
    static get observedAttributes() {
        return [];
    }


    constructor(hueGroup, ...args) {
        const self = super(args);

        this[priv] = this[priv] ?? {};
        this[priv].hueGroup = hueGroup;
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


    onInit() {
        const sceneList = this[priv].shadowRoot.querySelector("hue-scene-list");
        sceneList.hueGroup = this[priv].hueGroup;
    }
}



HueRoomDetail.templatePromise = null;
HueRoomDetail.metaURL = import.meta.url;
Object.seal(HueRoomDetail);



customElements.define("hue-room-detail", HueRoomDetail);
