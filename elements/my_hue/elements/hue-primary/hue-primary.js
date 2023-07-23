import "../hue-light-list/hue-light-list.js";
import "../hue-room-list-item/hue-room-list-item.js";
import "../hue-room-list/hue-room-list.js";
import { UIView } from "/base/ui-view.js";
import Hue from "../../hue.js";


export class HuePrimary extends UIView {
    static get observedAttributes() {
        return [];
    }


    #shadowRoot = this.attachShadow({ mode: "closed" });
    #lightsSubscription = undefined;


    constructor(...args) {
        const self = super(args);
        Object.seal(this);

        this._init(this.#shadowRoot);
        this.onInit();
        return self;
    }


    adoptedCallback() {}
    attributeChangedCallback(name, oldValue, newValue) {}


    connectedCallback() {
        Hue.lights.subscribe(this.#lightsSubscription);
    }


    disconnectedCallback() {
        Hue.lights.unsubscribe(this.#lightsSubscription);
    }


    onInit() {
        this.#lightsSubscription = (value) => this._updateLights(value);

        // console.log(Hue.lights.value);

        const touchLinkButton = this.#shadowRoot.querySelector("nav > button");
        touchLinkButton.onclick = () => this._onTouchLinkClicked();
    }


    _updateLights(lightsObj = {}) {
        const lights = Object.keys(lightsObj);
        const tabView = this.#shadowRoot.querySelector("ui-tab-view");
        const lightList = tabView.views.find((x) => x.tagName.toLowerCase() === "hue-light-list");
        lightList.hueGroup = { lights };
    }


    async _onTouchLinkClicked() {
        await Hue.touchLink();
    }
}



UIView.define("hue-primary", HuePrimary, import.meta.url);
