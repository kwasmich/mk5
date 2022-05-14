import "../hue-light-list-item/hue-light-list-item.js";
import { UIView } from "/base/ui-view.js";
import Hue from "/hue/hue.js";



export class HueLightDetail extends UIView {
    static get observedAttributes() {
        return [];
    }


    #shadowRoot = this.attachShadow({ mode: "closed" });
    #light = undefined;


    get light() {
        return this.#light;
    }


    set light(val) {
        // if (this.#light !== val) {
        //     this._clearLight();
        // }

        this.#light = val;
        this._updateLight();
        this._updateRendering();
    }


    constructor(...args) {
        const self = super(args);
        Object.seal(this);

        this._init(this.#shadowRoot);
        // this.onInit();
        return self;
    }


    adoptedCallback() {}
    attributeChangedCallback(name, oldValue, newValue) {}


    connectedCallback() {
        const navigationView = this.closest("ui-navigation-view");
        const backButton = this.#shadowRoot.querySelector("button");
        backButton.onclick = () => navigationView.popToRootView();


        const inputs = this.#shadowRoot.querySelectorAll("input");
        
        for (const input of inputs) {
            input.onchange = (e) => this._onInputChange(e);
        }

        const xy = this.#shadowRoot.querySelector("mk-cie-picker");
        xy.onchange = (e) => this._onXYChange(e);

        const effectColorloop = this.#shadowRoot.querySelector("#effectColorloop");
        const effectNone = this.#shadowRoot.querySelector("#effectNone");
        effectColorloop.onclick = () => {
            this.#light.effect = "colorloop";
        };
        effectNone.onclick = () => {
            this.#light.effect = "none";
        };
    }
    
    
    disconnectedCallback() {
        const backButton = this.#shadowRoot.querySelector("button");
        backButton.onclick = undefined;
    }


    _updateLight() {
        const lightListItem = this.#shadowRoot.querySelector("hue-light-list-item");
        lightListItem.item = this.#light;
    }

    _updateRendering() {
        const p = this.#shadowRoot.querySelector("p");
        if (!p) return;
        const l = this.#light;
        if (!l) return;
        
        p.textContent = this.#light.id;
        
        const on = this.#shadowRoot.querySelector("input[name=on]");
        on.checked = l.state.on;
        const bri = this.#shadowRoot.querySelector("input[name=bri]");
        bri.value = l.state.bri;
        const hue = this.#shadowRoot.querySelector("input[name=hue]");
        hue.value = l.state.hue;
        const sat = this.#shadowRoot.querySelector("input[name=sat]");
        sat.value = l.state.sat;
        const xy = this.#shadowRoot.querySelector("mk-cie-picker");
        // console.log(l, l.capabilities, l.capabilities.control, l.capabilities.control.colorgamut);
        xy.gamut = l.capabilities.control.colorgamut;
        xy.value = l.state.xy;
        const lct = l.capabilities.control.ct;
        const ct = this.#shadowRoot.querySelector("input[name=ct]");
        ct.min = lct ? lct.min : 153;
        ct.max = lct ? lct.max : 500;
        ct.value = l.state.ct;
    }
    
    
    _onInputChange(event) {
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


    _onXYChange(event) {
        const light = this.#light;
        const { x, y } = event.target.value;
        light.xy = [x, y];
        console.log([x, y]);
    }
}



UIView.define("hue-light-detail", HueLightDetail, import.meta.url);
