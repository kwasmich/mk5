"use strict";

import HTMLCustomElement from "../html_custom_element.js";
import Hue from "../hue.js";
import Observable from "../util/observable.js";



const template = new Observable();
const priv = Symbol("private");



class LightControlElement extends HTMLCustomElement {
    constructor() {
        super(template, "elements/light_control");
        this[priv] = this[priv] || {};
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
    
    
    attributeChangedCallback(name, oldValue, newValue) {
        // name will always be "name" due to observedAttributes
        this[priv].light = newValue;
        this._updateRendering();
    }
    
    
    connectedCallback() {
        this._updateRendering();
    }
    
    
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
            input.onchange = (event) => this._updateLight(event);
        }
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
    }
    
    
    _updateLight(event) {
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
}


window.customElements.define("mk-light-control", LightControlElement);
