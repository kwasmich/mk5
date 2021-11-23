import { UIView } from "/base/ui-view.js";
import { ct2rgb, IconMap, xy2rgb } from "/hue/hue-utils.js";
import Hue from "/hue/hue.js";


function color(state) {
    const { on, bri, ct, hue, sat, xy, colormode, reachable } = state;

    if (on && reachable) {
        switch (colormode) {
            case "xy":
                {
                    const [x, y] = xy;
                    const color = xy2rgb(x, y, 64 + bri / 255 * 191);
                    return `rgb(${color.r}, ${color.g}, ${color.b})`;
                }

            case "ct":
                {
                    const color = ct2rgb(ct); 
                    return `rgb(${color.r}, ${color.g}, ${color.b})`;
                }

            case "hs":
                {
                    return "lime";
                }

            default:
                {
                    const color = 64 + bri / 255 * 191;
                    return `rgb(${color}, ${color}, ${color})`;
                }
        }
    } else {
        return "";
    }
}



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
        Object.seal(this);

        this._init(this.#shadowRoot);
        this.onInit();
        return self;
    }


    adoptedCallback() {}
    attributeChangedCallback(name, oldValue, newValue) {}
    connectedCallback() {}
    disconnectedCallback() {}


    onInit() {
        // this.onclick = (mouseEvent) => this._onClick(mouseEvent);

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
            this.#on.checked = this.#room.state.any_on; // on
            this.#bri.value = bri;

            // if (on) { //(this.#room.state.any_on) {
            //     switch (colormode) {
            //         case "xy":
            //             {
            //                 const [x, y] = xy;
            //                 const color = xy2rgb(x, y, 64 + bri / 255 * 191);
            //                 // console.log(color);
            //                 this.style.backgroundColor = `rgb(${color.r}, ${color.g}, ${color.b})`;
            //             }
            //             break;

            //         case "ct":
            //             {
            //                 const color = ct2rgb(ct);
            //                 // console.log(color);
            //                 this.style.backgroundColor = `rgb(${color.r}, ${color.g}, ${color.b})`;
            //             }
            //             break;

            //         case "hs":
            //             {
            //                 this.style.backgroundColor = "lime";
            //             }
            //             break;
            //     }
            // } else {
            //     this.style.backgroundColor = "#444";
            // }

            // console.log(this.#room);
            // console.log(this.#lights);

            const lights = this.#room.lights.sort((a,b) => +a - +b).map((l) => this.#lights[l]);
            const colors = lights.map((l) => color(l.state)).filter((s) => !!s);

            while (colors.length < lights.length) {
                colors.push("#444");
            }

            if (colors.length === 1) {
                this.style.background = undefined;
                this.style.backgroundColor = colors.join();
            } else if (colors.length > 1) {
                this.style.background = `linear-gradient(90deg, ${colors.join()})`;
            } else {
                this.style.background = undefined;
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
                light[attribute] = +event.target.value;
        }
    }


    // _onClick(mouseEvent) {
    //     console.log(mouseEvent);
    // }
}



UIView.define("hue-room-list-item", HueRoomListItem, import.meta.url);
