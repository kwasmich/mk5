import { UIView } from "/base/ui-view.js";
import { LightIconMap } from "/hue/hue-utils.js";




export class HueLightListItem extends UIView {
    static get observedAttributes() {
        return [];
    }


    #shadowRoot = this.attachShadow({ mode: "closed" });
    #initialized = false;
    #light = undefined;
    #icon = undefined;
    #name = undefined;
    #on = undefined;
    #bri = undefined;


    get item() {
        return this.#light
    }
    

    set item(val) {
        this.#light = val ?? {};
        this._updateView();
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
        // this.onclick = (mouseEvent) => this._onClick(mouseEvent);            // FIX ME: this is conflicting with UIListView
        // this.addEventListener("click", (mouseEvent) => this._onClick(mouseEvent));

        const sr = this.#shadowRoot;
        this.#icon = sr.querySelector("img");
        this.#name = sr.querySelector("span");
        this.#on = sr.querySelector("input[type=checkbox]");
        this.#on.onchange = (e) => this._onInputChange(e);
        this.#bri = sr.querySelector("input[type=range]");
        this.#bri.onchange = (e) => this._onInputChange(e);
        this.#initialized = true;
        this._updateView();
    }


    _updateView() {
        if (this.#initialized && this.#light) {
            const { on, bri, ct, hue, sat, xy, colormode, reachable } = this.#light.state
            
            if (this.#icon.src !== window.origin + LightIconMap[this.#light.modelid]) {
                this.#icon.src = LightIconMap[this.#light.modelid];
            }

            this.#name.textContent = this.#light.name;
            this.#on.checked = on;
            this.#bri.value = bri;
            this.style.backgroundColor = this.#light.color || "#444";
            this.classList.toggle("unreachable", !reachable);
        }
    }


    _onInputChange(event) {
        event.preventDefault();
        event.stopImmediatePropagation();
        const attribute = event.target.name;
        const light = this.#light;
        
        switch (event.target.type) {
            case "checkbox":
                light[attribute] = event.target.checked;
            break;
            
            default:
                light[attribute] = +event.target.value;
        }
    }
}



UIView.define("hue-light-list-item", HueLightListItem, import.meta.url);