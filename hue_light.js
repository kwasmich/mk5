import HueService from "./hue.service.js"



const priv = Symbol("private");



export default class HueLight extends Object {
    constructor() {
        super();
        this.init(-1);
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
    

    set ct(newValue) {
        this._setValue("ct", newValue);
    }


    init(lightID) {
        this[priv] = this[priv] || {};
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


    _setState(state) {
        HueService.query("PUT", `lights/${this[priv].lightID}/state`, JSON.stringify(state));
    }
}
