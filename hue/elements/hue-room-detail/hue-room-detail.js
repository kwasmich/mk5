import { UIView } from "/base/ui-view.js";



export class HueRoomDetail extends UIView {
    static get observedAttributes() {
        return [];
    }


    #shadowRoot = this.attachShadow({ mode: "closed" });
    #hueGroup = undefined;


    get hueGroup() {
        return this.#hueGroup;
    }


    set hueGroup(val) {
        this.#hueGroup = val;
        this._updateList();
    }


    constructor(...args) {
        const self = super(args);
        Object.seal(this);

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
        this._updateList();
    }

    _updateList() {
        const sceneList = this.#shadowRoot.querySelector("hue-scene-list");
        sceneList.hueGroup = this.#hueGroup;
    }
}



UIView.define("hue-room-detail", HueRoomDetail, import.meta.url);
