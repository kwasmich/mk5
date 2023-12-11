import { UIView } from "/base/ui-view.js";

import "./elements/cie_picker/cie_picker.js";
import "./elements/hue-room-detail/hue-room-detail.js";
import "./elements/hue-room-list-item/hue-room-list-item.js";
import "./elements/hue-room-list/hue-room-list.js";
import "./elements/hue_main/hue_main.js";
import "./elements/hue_setup/hue_setup.js";
import "/base/ui-list-view/ui-list-view.js";
import "/base/ui-navigation-view/ui-navigation-view.js";
import "/base/ui-tab-view/ui-tab-view.js";
import Hue from "./hue.js";



export class MyHue extends UIView {
    static get observedAttributes() {
        return [];
    }


    #shadowRoot = this.attachShadow({ mode: "closed" });
    #setup = undefined;


    constructor(...args) {
        const self = super(args);
        Object.seal(this);

        this._init(this.#shadowRoot);
        return self;
    }


    adoptedCallback() {}
    attributeChangedCallback(name, oldValue, newValue) {}
    connectedCallback() {
        this.#setup = this.#shadowRoot.querySelector("mk-hue-setup");
        this.#setup?.addEventListener("success", () => this.onInit());
    }
    disconnectedCallback() {}


    onInit() {
        // console.log(this.#setup);
        this.#setup.remove();
        Hue.init();
        // this.main._init();
    }
}



UIView.define("my-hue", MyHue, import.meta.url);
