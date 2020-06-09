"use strict";

import HTMLCustomElement from "../html_custom_element.js";
import HueService from "../hue.service.js";
import Observable from "../util/observable.js";
import { loadJSON } from "../util/helper.js";




const template = new Observable();
const priv = Symbol("private");

const IDLE = "idle";
const HUE_BRIDGE_NAME = "hue_bridge_name";
const HUE_BRIDGE_IP_ADDRESS = "hue_bridge_ip_address";
const HUE_BRIDGE_USER_NAME = "hue_bridge_user_name";
const HUE_BRIDGE_DISCOVERY = "hue_bridge_discovery";
const HUE_BRIDGE_DISCOVERY_FAILED = "hue_bridge_discovery_failed";
const HUE_BRIDGE_DISCOVERY_SUCCESS = "hue_bridge_discovery_success";



class HueSetupElement extends HTMLCustomElement {
    constructor() {
        super(template, "elements/hue_setup");
        this[priv] = this[priv] || {};
        this[priv].shadowRoot = this.attachShadow({mode: 'closed'});
        this[priv].state = {
            bridgeName: null,
            ipAddress: null,
            username: null
        };
        Object.seal(this);
        template.subscribe((value) => value && this._init(value));
    }
    
    
    static get observedAttributes() {
        return [];
    }
    attributeChangedCallback(name, oldValue, newValue) {}
    connectedCallback() {}
    _updateRendering() {}
    
    
    /** @type {HTMLDivElement} */
    get ipGroup() {
        return this[priv].shadowRoot.getElementById("hue_ip_grp");
    }

    /** @type {HTMLInputElement} */
    get ipInput() {
        return this[priv].shadowRoot.getElementById("hue_ip");
    }

    /** @type {HTMLButtonElement} */
    get ipVerifyButton() {
        return this[priv].shadowRoot.getElementById("hue_ip_verify");
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
        this.registerButton.disabled = true;

        // this.ipInput.classList.add("hidden");
        // this.userInput.classList.add("hidden");

        this._init2();
    }
    
    
    async _onDiscoverClick() {
        const btn = this.discoverButton;
        btn.disabled = true;
        btn.textContent = "discovering…";
        
        try {
            const result = await loadJSON("https://discovery.meethue.com");

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
        HueService.ip = this.ipInput.value;
        HueService.user = this.userInput.value;

        try {
            const result = await HueService.query("GET", undefined, undefined);
            
            if (Array.isArray(result) && result.length === 1 && result[0].hasOwnProperty("error")) {
                console.error(result[0].error);
                this.registerButton.disabled = false;
            } else {
                console.info("success");
            }
        } finally {
            btn.disabled = false;
            btn.textContent = "test";
        }
    }


    async _onRegisterClick() {
        const btn = this.registerButton;
        btn.disabled = true;
        btn.textContent = "registering…";
        HueService.ip = this.ipInput.value;
        HueService.user = undefined;

        const payload = {
            devicetype: this.userInput.value
        };

        try {
            const result = await HueService.query("POST", undefined, JSON.stringify(payload));
            
            if (Array.isArray(result) && result.length === 1 && result[0].hasOwnProperty("error")) {
                console.error(result[0].error);
            } else {
                console.info("success");
            }
        } finally {
            btn.disabled = false;
            btn.textContent = "register";
        }
    }


    async _init2() {
        let reachable;

        try {
            await this._testHueBridgeReachability();
            reachable = true;
        } catch {
            reachable = false;
        }

        if (!reachable) {
            try {
                await this._discoverHueBridge().then(this._testHueBridgeReachability);
                reachable = true;
            } catch {
                reachable = false;
            }
        }

        while (!reachable) {
            try {
                await this._promptUserForHueBridgeIPAddress();
                reachable = true;
            } catch {
                console.log("failed");
                reachable = false;
            }
        }


        
        // } catch (e) {
        //     console.error(e);
        // }
        // this._testHueBridgeReachability()
        // .then(
        //     console.log,
        //     () => this._discoverHueBridge()
        //     .then(
        //         () => this._testHueBridgeReachability()
        //         .then(
        //             console.log,
        //             console.error
        //         ),
        //         console.error
        //     )
        // )
    }


    _testHueBridgeReachability() {
        console.log("_testHueBridgeReachability");
        const ipAddress = localStorage.getItem(HUE_BRIDGE_IP_ADDRESS);

        if (ipAddress) {
            HueService.ip = ipAddress;
            HueService.user = undefined;

            const success = (result) => {
                console.log("_testHueBridgeReachability.success");
                localStorage.setItem(HUE_BRIDGE_NAME, result.name);
                return Promise.resolve();
            };
        
            const failed = () => Promise.reject(1);

            return HueService.query("GET", "config", undefined).then(success, failed);
        } else {
            return Promise.reject(2)
        }
    }


    _discoverHueBridge() {
        console.log("_discoverHueBridge");

        const success = (result) => {
            console.log("_discoverHueBridge.success");

            if (!Array.isArray(result)) {
                return Promise.reject(HUE_BRIDGE_DISCOVERY_FAILED);
            }

            if (result > 1) {
                console.log("found multiple hue bridges! - picking the first…");
            }

            // this[priv].state.ipAddress = result[0].internalipaddress;
            localStorage.setItem(HUE_BRIDGE_IP_ADDRESS, result[0].internalipaddress);
            return Promise.resolve(HUE_BRIDGE_DISCOVERY_SUCCESS);
        };
    
        const failed = () => Promise.reject(HUE_BRIDGE_DISCOVERY_FAILED);
        return loadJSON("https://discovery.meethue.com").then(success, failed);
    }


    _promptUserForHueBridgeIPAddress() {
        console.log("_promptUserForHueBridgeIPAddress");
        const promise = (resolve, reject) => {
            this.ipGroup.classList.remove("hidden");

            const success = () => {
                this.ipGroup.classList.add("hidden");
                resolve();
            };

            const failed = () => {
                this.ipInput.disabled = false;
                this.ipVerifyButton.disabled = false;
                reject();
            };
            
            this.ipVerifyButton.onclick = () => {
                this.ipInput.disabled = true;
                this.ipVerifyButton.disabled = true;
                localStorage.setItem(HUE_BRIDGE_IP_ADDRESS, this.ipInput.value);
                this._testHueBridgeReachability().then(success, failed);
            }
        };

        return new Promise(promise);
    }
}


window.customElements.define("mk-hue-setup", HueSetupElement);
