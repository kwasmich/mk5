"use strict";

import HTMLCustomElement from "../html_custom_element.js";
import HueService from "../hue.service.js";
import Observable from "../util/observable.js";
import { loadJSON } from "../util/helper.js";



const HUE_BRIDGE_NAME = "hue_bridge_name";
const HUE_BRIDGE_ADDRESS = "hue_bridge_address";
const HUE_BRIDGE_USER_NAME = "hue_bridge_user_name";
const HUE_DEVICE_TYPE = "de.kwasi-ich.hue";



const template = new Observable();
const priv = Symbol("private");



class HueSetupElement extends HTMLCustomElement {
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

    /** @type {HTMLDivElement} */
    get userGroup() {
        return this[priv].shadowRoot.getElementById("hue_user_grp");
    }

    /** @type {HTMLButtonElement} */
    get registerButton() {
        return this[priv].shadowRoot.getElementById("hue_register");
    }
    
    /** @type {HTMLProgressElement} */
    get progressBar() {
        return this[priv].shadowRoot.getElementById("progress");
    }

    /** @type {HTMLButtonElement} */
    get unregisterButton() {
        return this[priv].shadowRoot.getElementById("hue_unregister");
    }
    

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
    adoptedCallback() {}
    attributeChangedCallback(name, oldValue, newValue) {}
    connectedCallback() {}
    disconnectedCallback() {}
    // formAssociatedCallback() {}
    // formDisabledCallback() {}
    // formResetCallback() {}
    // formStateRestoreCallback() {}
    
    
    
    _init() {
        const content = template.value.content.cloneNode(true);
        this[priv].shadowRoot.appendChild(content);

        this.unregisterButton.onclick = () => this._unregister();
        this._init2();
    }
    

    async _init2() {
        let reachable = false;
        let userValid = false;

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
                await this._promptUserForHueBridgeAddress();
                reachable = true;
            } catch {
                reachable = false;
            }
        }

        try {
            await this._testUserValid();
            userValid = true;
        } catch {
            userValid = false;
        }

        while (!userValid) {
            try {
                await this._promptUserForUserName();
                userValid = true;
            } catch {
                userValid = false;
            }
        }

        if (reachable && userValid) {
            this._dispatchEvent("success"); 
        }
    }


    _testHueBridgeReachability() {
        console.log("_testHueBridgeReachability");
        const address = localStorage.getItem(HUE_BRIDGE_ADDRESS);

        if (address) {
            HueService.address = address;
            HueService.user = undefined;

            const success = (result) => {
                console.log("_testHueBridgeReachability.success");
                localStorage.setItem(HUE_BRIDGE_NAME, result.name);
                return Promise.resolve();
            };
        
            const failed = () => Promise.reject();

            return HueService.query("GET", ["config"], undefined).then(success, failed);
        } else {
            return Promise.reject()
        }
    }


    _discoverHueBridge() {
        console.log("_discoverHueBridge");

        const success = (result) => {
            console.log("_discoverHueBridge.success");

            if (!Array.isArray(result)) {
                return Promise.reject();
            }

            if (result > 1) {
                console.log("found multiple hue bridges! - picking the first…");
            }

            localStorage.setItem(HUE_BRIDGE_ADDRESS, result[0].internalipaddress);
            return Promise.resolve();
        };
    
        const failed = () => Promise.reject();
        return loadJSON("https://discovery.meethue.com").then(success, failed);
    }


    _promptUserForHueBridgeAddress() {
        console.log("_promptUserForHueBridgeAddress");
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
                localStorage.setItem(HUE_BRIDGE_ADDRESS, this.ipInput.value);
                this._testHueBridgeReachability().then(success, failed);
            };
        };

        return new Promise(promise);
    }


    _testUserValid() {
        console.log("_testUserValid");
        const userName = localStorage.getItem(HUE_BRIDGE_USER_NAME);

        if (userName) {
            HueService.user = userName;

            const success = (result) => {
                console.log("_testUserValid.success");

                if (result.whitelist) {
                    localStorage.setItem(HUE_BRIDGE_USER_NAME, userName);
                    return Promise.resolve();
                } else {
                    return Promise.reject();
                }
            };
        
            const failed = () => Promise.reject();
            return HueService.query("GET", ["config"], undefined).then(success, failed);
        } else {
            return Promise.reject()
        }
    }


    _promptUserForUserName() {
        console.log("_promptUserForUserName");
        const promise = (resolve, reject) => {
            this.userGroup.classList.remove("hidden");

            const success = (result) => {
                console.log("_promptUserForUserName.success");
                const username = result[0].success.username;
                localStorage.setItem(HUE_BRIDGE_USER_NAME, username);
                this.userGroup.classList.add("hidden");
                resolve();
            };

            const failed = () => {
                console.log("_promptUserForUserName.failed");
                reject();
            };

            this.registerButton.onclick = () => {
                this.registerButton.disabled = true;
                const payload = { devicetype: HUE_DEVICE_TYPE };
                this.progressBar.value = 0;

                const start = Date.now();
                let interval;
                let timeout;

                const timeUp = () => {
                    clearInterval(interval);
                    console.log("time up");
                    this.progressBar.value = 0;
                    this.registerButton.disabled = false;
                    failed();
                };
                
                const tick = async () => {
                    const deltaT = Date.now() - start;
                    this.progressBar.value = deltaT / 30000;

                    try {
                        const result = await HueService.query("POST", [], JSON.stringify(payload));

                        if (result[0].success && result[0].success.username) {
                            clearTimeout(timeout);
                            timeUp();
                            success(result);
                        }
                    } catch {
                        console.log(123);
                    }
                };

                interval = setInterval(tick, 1000);
                timeout = setTimeout(timeUp, 30000);
            };
        };

        return new Promise(promise);
    }


    _unregister() {
        console.log("unregister");
        const userName = localStorage.getItem(HUE_BRIDGE_USER_NAME);
        HueService.query("DELETE", ["config", "whitelist", userName], undefined).then(console.log, console.error);
    }


    _dispatchEvent(message) {
        const evt = document.createEvent("Event");
        evt.initEvent(message, false, true);
        this.dispatchEvent(evt);
    }
}


window.customElements.define("mk-hue-setup", HueSetupElement);
