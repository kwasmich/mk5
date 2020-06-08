"use strict";

import HTMLCustomElement from "../html_custom_element.js";
import HueService from "../hue.service.js";
import Observable from "../util/observable.js";
import { loadJSON } from "../util/helper.js";




const template = new Observable();
const priv = Symbol("private");



class HueSetupElement extends HTMLCustomElement {
    constructor() {
        super(template, "elements/hue_setup");
        this[priv] = this[priv] || {};
        this[priv].shadowRoot = this.attachShadow({mode: 'closed'});
        Object.seal(this);
        template.subscribe((value) => value && this._init(value));
    }
    
    
    static get observedAttributes() {
        return [];
    }
    attributeChangedCallback(name, oldValue, newValue) {}
    connectedCallback() {}
    _updateRendering() {}
    
    
    /** @type {HTMLInputElement} */
    get ipInput() {
        return this[priv].shadowRoot.getElementById("hue_ip");
    }
    
    
    /** @type {HTMLButtonElement} */
    get discoverButton() {
        return this[priv].shadowRoot.getElementById("discover");
    }
    
    
    /** @type {HTMLInputElement} */
    get userInput() {
        return this[priv].shadowRoot.getElementById("hue_user");
    }
    
    
    /** @type {HTMLButtonElement} */
    get testButton() {
        return this[priv].shadowRoot.getElementById("test");
    }
    
    
    /** @type {HTMLButtonElement} */
    get registerButton() {
        return this[priv].shadowRoot.getElementById("register");
    }
    
    
    _init() {
        const content = template.value.content.cloneNode(true);
        this[priv].shadowRoot.appendChild(content);
        
        this.discoverButton.onclick = () => this._onDiscoverClick();
        this.testButton.onclick = () => this._onTestClick();
        this.registerButton.onclick = () => this._onRegisterClick();
    }
    
    
    async _onDiscoverClick() {
        const btn = this.discoverButton;
        btn.disabled = true;
        btn.textContent = "discovering…";
        
        try {
            const result = await loadJSON("https://discovery.meethue.com");
            console.log(Array.isArray(result));
            console.log(result);
            
            if (Array.isArray(result) && result.length === 1) {
                this.ipInput.value = result[0].internalipaddress;
            }
        } finally {
            btn.disabled = false;
            btn.textContent = "discover";
        }
    }


    async _onTestClick() {
        const btn = this.testButton;
        btn.disabled = true;
        btn.textContent = "testing…";

        const url = `http://${this.ipInput.value}/api/${this.userInput.value}/`;

        console.log(HueService);
        HueService.ip = this.ipInput.value;
        HueService.user = this.userInput.value;

        try {
            const result = await loadJSON(url);
            
            if (Array.isArray(result) && result.length === 1 && result[0].hasOwnProperty("error")) {
                console.error(result[0].error);
            } else {
                console.info("success");
            }
        } finally {
            btn.disabled = false;
            btn.textContent = "test";
        }

    }


    _onRegisterClick() {
        console.log("register");
    }
}


window.customElements.define("mk-hue-setup", HueSetupElement);
