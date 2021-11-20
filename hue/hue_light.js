import Hue from "/hue/hue.js";
import HueService from "/hue/hue.service.js";



const priv = Symbol("private");



export default class HueLight extends Object {
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


    set effect(newValue) {
        console.log("effect");
        this._setValue("effect", newValue);
    }


    get id() {
        return this[priv].lightID;
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
