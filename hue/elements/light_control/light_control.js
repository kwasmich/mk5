import { UIView } from "/base/ui-view.js";
import Hue from "/hue/hue.js";





class LightControlElement extends UIView {
    static get observedAttributes() {
        return ["light"];
    }


    #light = undefined;
    #lightObj = {};
    #shadowRoot = this.attachShadow({ mode: "closed" });


    get light() {
        return this.#light;
    }
    
    
    set light(v) {
        this.setAttribute("light", v);
    }


    constructor(...args) {
        const self = super(args);
        Object.seal(this);

        this._init(this.#shadowRoot);
        this.onInit();
        return self;
    }
    
    


    
    adoptedCallback() {}
    

    attributeChangedCallback(name, oldValue, newValue) {
        // name will always be "name" due to observedAttributes
        this.#light = newValue;
        this._updateRendering();
    }
    
    
    connectedCallback() {
        this._updateRendering();
    }


    disconnectedCallback() {}
    // formAssociatedCallback() {}
    // formDisabledCallback() {}
    // formResetCallback() {}
    // formStateRestoreCallback() {}
        
    
    onInit() {
        Hue.lights.subscribe((value) => {
            this.#lightObj = value ?? {};
            this._updateRendering();
        });

        const inputs = this.#shadowRoot.querySelectorAll("input");
        
        for (const input of inputs) {
            input.onchange = (e) => this._onInputChange(e);
        }

        const xy = this.#shadowRoot.querySelector("mk-cie-picker");
        xy.onchange = (e) => this._onXYChange(e);

        const effectColorloop = this.#shadowRoot.querySelector("#effectColorloop");
        const effectNone = this.#shadowRoot.querySelector("#effectNone");
        effectColorloop.onclick = () => {
            this.#lightObj[this.#light].effect = "colorloop";
        };
        effectNone.onclick = () => {
            this.#lightObj[this.#light].effect = "none";
        };
    }
    
    
    _updateRendering() {
        const p = this.#shadowRoot.querySelector("p");
        if (!p) return;
        const l = this.#lightObj[this.#light];
        if (!l) return;
        
        p.textContent = this.#light;
        
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
        const light = this.#lightObj[this.#light];
        
        switch (event.target.type) {
            case "checkbox":
                light[attribute] = event.target.checked;
            break;
            
            default:
                light[attribute] = +event.target.value;
        }
    }


    _onXYChange(event) {
        const light = this.#lightObj[this.#light];
        const { x, y } = event.target.value;
        light.xy = [x, y];
        console.log([x, y]);
    }
}



UIView.define("mk-light-control", LightControlElement, import.meta.url);
