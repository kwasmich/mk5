import { UIView } from "/base/ui-view.js";
import { LightIconMap, LightTypeIconMap } from "../../hue_utils.js";



const NOOP = (e) => {
    e.stopPropagation();
};



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
        this._onKeyboardDown = this._onKeyboardDown.bind(self);
        Object.seal(this);

        this._init(this.#shadowRoot);
        this.onInit();
        return self;
    }


    adoptedCallback() {}
    attributeChangedCallback(name, oldValue, newValue) {}


    connectedCallback() {
        this.addEventListener("keydown", this._onKeyboardDown);
    }


    disconnectedCallback() {
        this.removeEventListener("keydown", this._onKeyboardDown);
    }


    onInit() {
        // this.onclick = (mouseEvent) => this._onClick(mouseEvent);            // FIX ME: this is conflicting with UIListView
        // this.addEventListener("click", (mouseEvent) => this._onClick(mouseEvent));

        const sr = this.#shadowRoot;
        this.#icon = sr.querySelector("img");
        this.#name = sr.querySelector("span");
        this.#on = sr.querySelector("input[type=checkbox]");
        this.#on.onchange = (e) => this._onInputChange(e);
        this.#on.onclick = NOOP;
        this.#bri = sr.querySelector("input[type=range]");
        this.#bri.onchange = (e) => this._onInputChange(e);
        this.#bri.onclick = NOOP;
        this.#initialized = true;
        this._updateView();
    }


    _updateView() {
        if (this.#initialized && this.#light) {
            const { on, bri, ct, hue, sat, xy, colormode, reachable } = this.#light.state

            // console.log(this.#light.modelid);
            // console.log(this.#light.config.archetype);

            // const icon = LightIconMap[this.#light.modelid];
            const icon = LightTypeIconMap[this.#light.config.archetype];

            if (this.#icon.src !== window.origin + icon) {
                this.#icon.src = icon;
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
                light[attribute] = event.target.valueAsNumber;
        }
    }


    _onKeyboardDown(keyboardEvent) {
        // console.log(keyboardEvent);
        if (keyboardEvent.repeat) return;   // or better debounce?

        const light = this.#light;
        const attribute = "bri";

        switch (keyboardEvent.code) {
            case "ArrowLeft":
                // this.#bri.value = Math.max(0, this.#bri.valueAsNumber - 16);
                this.#bri.stepDown(24);
                // this.#bri.click();
                light[attribute] = this.#bri.valueAsNumber; // FIXME: this is a bit hacky
                break;

            case "ArrowRight":
                // this.#bri.value = Math.min(this.#bri.valueAsNumber + 16, 254);
                this.#bri.stepUp(24);
                // this.#bri.click();
                light[attribute] = this.#bri.valueAsNumber; // FIXME: this is a bit hacky
                break;

            case "Space":
                this.#on.click();
                break;

            default:
                return;
        }

        keyboardEvent.preventDefault();
        keyboardEvent.stopPropagation();
    }
}



UIView.define("hue-light-list-item", HueLightListItem, import.meta.url);
