import { UIView } from "/base/ui-view.js";
import { ct2rgb, IconMap, xy2rgb } from "/hue/hue-utils.js";



const priv = Symbol("private");



export class HueRoomListItem extends UIView {
    static get observedAttributes() {
        return [];
    }

    get item() {
        return this[priv].room
    }

    set item(val) {
        this[priv].room = val ?? {};
        this._updateView();
    }


    constructor(...args) {
        const self = super(args);

        this[priv] = this[priv] ?? {};
        this[priv].initialized = false;
        this[priv].room = {};
        this[priv].icon = undefined;
        this[priv].name = undefined;
        this[priv].on = undefined;
        this[priv].bri = undefined;
        this[priv].shadowRoot = this.attachShadow({ mode: "closed" });
        Object.seal(this);
        Object.seal(this[priv]);

        this._init(this[priv].shadowRoot);
        return self;
    }


    adoptedCallback() {}
    attributeChangedCallback(name, oldValue, newValue) {}
    connectedCallback() {}
    disconnectedCallback() {}


    onInit() {
        // this.onclick = (mouseEvent) => this._onClick(mouseEvent);

        const sr = this[priv].shadowRoot;
        this[priv].icon = sr.querySelector("img");
        this[priv].name = sr.querySelector("span");
        this[priv].on = sr.querySelector("input[type=checkbox]");
        this[priv].on.onchange = (e) => this._onInputChange(e);
        this[priv].bri = sr.querySelector("input[type=range]");
        this[priv].bri .onchange = (e) => this._onInputChange(e);
        this[priv].initialized = true;
        this._updateView();
    }


    _updateView() {
        if (this[priv].initialized && this[priv].room?.action) {
            const { on, bri, ct, hue, sat, xy, colormode } = this[priv].room.action
            this[priv].icon.src = IconMap[this[priv].room.class];
            this[priv].name.textContent = this[priv].room.name;
            this[priv].on.checked = this[priv].room.state.any_on; // on
            this[priv].bri.value = bri;

            if (this[priv].room.state.any_on) {
                switch (colormode) {
                    case "xy":
                        {
                            const [x, y] = xy;
                            const color = xy2rgb(x, y, 254);
                            // console.log(color);
                            this.style.backgroundColor = `rgb(${color.r}, ${color.g}, ${color.b})`;
                        }
                        break;

                    case "ct":
                        {
                            const color = ct2rgb(ct);
                            // console.log(color);
                            this.style.backgroundColor = `rgb(${color.r}, ${color.g}, ${color.b})`;
                        }
                        break;

                    case "hs":
                        {
                            this.style.backgroundColor = "lime";
                        }
                        break;
                }
            } else {
                this.style.backgroundColor = "#444";
            }
        }
    }


    _onInputChange(event) {
        event.preventDefault();
        event.stopImmediatePropagation();
        const attribute = event.target.name;
        const light = this[priv].room;
        
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



HueRoomListItem.templatePromise = null;
HueRoomListItem.metaURL = import.meta.url;
Object.seal(HueRoomListItem);



customElements.define("hue-room-list-item", HueRoomListItem);
