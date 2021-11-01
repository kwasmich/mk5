import { UIView } from "/base/ui-view2.js";



export class HueRoomDetail extends UIView {
    static get observedAttributes() {
        return [];
    }


    #shadowRoot = this.attachShadow({ mode: "closed" });
    #hueGroup = undefined;


    constructor(hueGroup, ...args) {
        const self = super(args);
        Object.seal(this);

        this.#hueGroup = hueGroup;

        this._init(this.#shadowRoot);
        this.onInit();
        return self;
    }


    adoptedCallback() {}
    attributeChangedCallback(name, oldValue, newValue) {}
    connectedCallback() {}
    disconnectedCallback() {}


    onInit() {
        const backButton = this.#shadowRoot.querySelector("button");
        backButton.onclick = () => this.parentNode.popToRootView();
        const sceneList = this.#shadowRoot.querySelector("hue-scene-list");
        sceneList.hueGroup = this.#hueGroup;
    }
}



UIView.define("hue-room-detail", HueRoomDetail, import.meta.url);
