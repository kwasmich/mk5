import { UIView } from "/base/ui-view.js";
import { IconMap } from "../../hue_utils.js";
import Hue from "../../hue.js";





export class HueRoomListItem extends UIView {
    static get observedAttributes() {
        return [];
    }


    #shadowRoot = this.attachShadow({ mode: "closed" });
    #initialized = false;
    #room = {};
    #icon = undefined;
    #name = undefined;
    #on = undefined;
    #bri = undefined;
    #lightsSubscription = undefined;
    #lights = {};


    get item() {
        return this.#room
    }


    set item(val) {
        this.#room = val ?? {};
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
        this.#lightsSubscription = (value) => this._updateLights(value);
        Hue.lights.subscribe(this.#lightsSubscription);

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


    _updateLights(lightsObj) {
        this.#lights = lightsObj;
        this._updateView();
    }


    _updateView() {
        if (this.#initialized && this.#room?.action) {
            const { on, bri, ct, hue, sat, xy, colormode } = this.#room.action
            
            if (this.#icon.src !== window.origin + IconMap[this.#room.class]) {
                this.#icon.src = IconMap[this.#room.class];
            }

            this.#name.textContent = this.#room.name;
            this.#on.checked = this.#room.state.any_on;
            this.#bri.value = bri;

            const lights = this.#room.lights.sort((a,b) => +a - +b).map((l) => this.#lights[l]);
            const colors = lights.map((l) => l.color).filter((s) => !!s);

            while (colors.length < lights.length) {
                colors.push("#444");
            }

            if (colors.length === 1) {
                this.style.background = "";
                this.style.backgroundColor = colors.join();
            } else if (colors.length > 1) {
                this.style.background = `linear-gradient(to right bottom, ${colors.join()})`;
            } else {
                this.style.background = "";
                this.style.backgroundColor = "#444";
            }
        }
    }


    _onInputChange(event) {
        event.preventDefault();
        event.stopImmediatePropagation();
        const attribute = event.target.name;
        const light = this.#room;
        
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

        const light = this.#room;
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



UIView.define("hue-room-list-item", HueRoomListItem, import.meta.url);
