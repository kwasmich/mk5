"use strict";

import HTMLCustomElement from "/html_custom_element.js";
import Hue from "/hue.js";
import Observable from "/util/observable.js";



const template = new Observable();
const priv = Symbol("private");



class LightControlElement extends HTMLCustomElement {
    constructor() {
        super(template, "elements/light_control");
        this[priv] = this[priv] ?? {};
        this[priv].light = undefined;
        this[priv].lightObj = {};
        this[priv].shadowRoot = this.attachShadow({mode: 'closed'});
        Object.seal(this);
        template.subscribe((value) => value && this._init(value));
        Hue.lights.subscribe((value) => {
            this[priv].lightObj = value;
            this._updateRendering();
        });
    }
    
    
    static get observedAttributes() {
        return ["light"];
    }

    
    adoptedCallback() {}
    
    
    attributeChangedCallback(name, oldValue, newValue) {
        // name will always be "name" due to observedAttributes
        this[priv].light = newValue;
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
    
    
    get light() {
        return this[priv].light;
    }
    
    
    set light(v) {
        this.setAttribute("light", v);
    }
    
    
    _init() {
        const content = template.value.content.cloneNode(true);
        this[priv].shadowRoot.appendChild(content);
        const inputs = this[priv].shadowRoot.querySelectorAll("input");
        
        for (const input of inputs) {
            input.onchange = (e) => this._onInputChange(e);
        }

        const xy = this[priv].shadowRoot.querySelector("mk-cie-picker");
        xy.onchange = (e) => this._onXYChange(e);

        const effectColorloop = this[priv].shadowRoot.querySelector("#effectColorloop");
        const effectNone = this[priv].shadowRoot.querySelector("#effectNone");
        effectColorloop.onclick = () => {
            this[priv].lightObj[this[priv].light].effect = "colorloop";
        };
        effectNone.onclick = () => {
            this[priv].lightObj[this[priv].light].effect = "none";
        };
    }
    
    
    _updateRendering() {
        const p = this[priv].shadowRoot.querySelector("p");
        if (!p) return;
        const l = this[priv].lightObj[this[priv].light];
        if (!l) return;
        
        p.textContent = this[priv].light;
        
        const on = this[priv].shadowRoot.querySelector("input[name=on]");
        on.checked = l.state.on;
        const bri = this[priv].shadowRoot.querySelector("input[name=bri]");
        bri.value = l.state.bri;
        const hue = this[priv].shadowRoot.querySelector("input[name=hue]");
        hue.value = l.state.hue;
        const sat = this[priv].shadowRoot.querySelector("input[name=sat]");
        sat.value = l.state.sat;
        const xy = this[priv].shadowRoot.querySelector("mk-cie-picker");
        console.log(l, l.capabilities, l.capabilities.control, l.capabilities.control.colorgamut);
        xy.gamut = l.capabilities.control.colorgamut;
        xy.value = l.state.xy;
        const lct = l.capabilities.control.ct;
        const ct = this[priv].shadowRoot.querySelector("input[name=ct]");
        ct.min = lct ? lct.min : 153;
        ct.max = lct ? lct.max : 500;
        ct.value = l.state.ct;
    }
    
    
    _onInputChange(event) {
        const attribute = event.target.name;
        const light = this[priv].lightObj[this[priv].light];
        
        switch (event.target.type) {
            case "checkbox":
                light[attribute] = event.target.checked;
            break;
            
            default:
                light[attribute] = +event.target.value;
        }
    }


    _onXYChange(event) {
        const light = this[priv].lightObj[this[priv].light];
        const { x, y } = event.target.value;
        light.xy = [x, y];
        console.log([x, y]);
    }
}


window.customElements.define("mk-light-control", LightControlElement);
