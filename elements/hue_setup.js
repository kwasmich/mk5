"use strict";

import HTMLCustomElement from "../html_custom_element.js";
import HueService from "../hue.service.js";
import Observable from "../util/observable.js";
import { loadJSON } from "../util/helper.js";




const template = new Observable();
const priv = Symbol("private");

const IDLE = "idle";
const HUE_BRIDGE_NAME = "hue_bridge_name";
const HUE_BRIDGE_ADDRESS = "hue_bridge_address";
const HUE_BRIDGE_USER_NAME = "hue_bridge_user_name";
const HUE_BRIDGE_DISCOVERY = "hue_bridge_discovery";
const HUE_BRIDGE_DISCOVERY_FAILED = "hue_bridge_discovery_failed";
const HUE_BRIDGE_DISCOVERY_SUCCESS = "hue_bridge_discovery_success";
const HUE_DEVICE_TYPE = "de.kwasi-ich.hue";



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
    
    
    _init() {
        const content = template.value.content.cloneNode(true);
        this[priv].shadowRoot.appendChild(content);
        
        this.discoverButton.onclick = () => this._onDiscoverClick();
        // this.testButton.onclick = () => this._onTestClick();
        // this.registerButton.onclick = () => this._onRegisterClick();
        // this.registerButton.disabled = true;

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
        HueService.address = this.ipInput.value;
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
        HueService.address = this.ipInput.value;
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

        if (!userValid) {
            console.log("user invalid");
            try {
                 await this._promptUserForUserName();
                reachable = true;
            } catch {
                console.log("user failed");
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
        const address = localStorage.getItem(HUE_BRIDGE_ADDRESS);

        if (address) {
            HueService.address = address;
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

            localStorage.setItem(HUE_BRIDGE_ADDRESS, result[0].internalipaddress);
            return Promise.resolve(HUE_BRIDGE_DISCOVERY_SUCCESS);
        };
    
        const failed = () => Promise.reject(HUE_BRIDGE_DISCOVERY_FAILED);
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
                    return Promise.reject(4);
                }
            };
        
            const failed = () => Promise.reject(1);
            return HueService.query("GET", "config", undefined).then(success, failed);
        } else {
            return Promise.reject(3)
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
                        const result = await HueService.query("POST", undefined, JSON.stringify(payload));

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
}


window.customElements.define("mk-hue-setup", HueSetupElement);
