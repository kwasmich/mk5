import Hue from "./hue.js";
import HueService from "./hue.service.js";
import { ct2rgb, xy2rgb } from "./hue_utils.js";



const priv = Symbol("private");



export class HueLight extends Object {
    constructor(...args) {
        const self = super(args);
        this.init(-1);
        return self;
    }


    set on(newValue) {
        this._setValue("on", newValue);
    }


    set bri(newValue) {
        this._setValue("bri", newValue);
    }


    set hue(newValue) {
        this._setValue("hue", newValue);
    }


    set sat(newValue) {
        this._setValue("sat", newValue);
    }


    set xy(newValue) {
        this._setValue("xy", newValue);
    }
    

    set ct(newValue) {
        this._setValue("ct", newValue);
    }


    set alert(newValue) {
        console.log("alert");
        this._setValue("alert", newValue);
    }


    set effect(newValue) {
        console.log("effect");
        this._setValue("effect", newValue);
    }


    get id() {
        return this[priv].lightID;
    }

    
    get color() {
        const { on, bri, ct, hue, sat, xy, colormode, reachable } = this.state;
    
        if (on && reachable) {
            switch (colormode) {
                case "hs":
                case "xy":
                    {
                        const [x, y] = xy;
                        const color = xy2rgb(x, y, 64 + bri / 255 * 191);
                        return `rgb(${color.r}, ${color.g}, ${color.b})`;
                    }
    
                case "ct":
                    {
                        const factor = (127 * 254 + bri * 127) / 254 / 254;
                        const color = ct2rgb(ct);
                        color.r *= factor;
                        color.g *= factor;
                        color.b *= factor;
                        return `rgb(${color.r}, ${color.g}, ${color.b})`;
                    }
    
                // case "hs":
                //     {
                //         return "lime";
                //     }
    
                default:
                    {
                        const color = 127 + bri * 127 / 254;
                        return `rgb(${color}, ${color}, ${color})`;
                    }
            }
        } else {
            return "";
        }
    }


    init(lightID) {
        this[priv] = this[priv] ?? {};
        this[priv].lightID = lightID;
        Object.seal(this);
    }


    _setValue(property, newValue) {
        if (this.state.on || property === "on") {
            this.state[property] = newValue;
            const state = {};
            state[property] = newValue
            this._setState(state);
        }
    }


    async _setState(state) {
        await HueService.query("PUT", ["lights", this[priv].lightID, "state"], JSON.stringify(state));
        Hue.update();
    }
}
