import HueService from "/hue/hue.service.js";



const priv = Symbol("private");



export default class HueGroup extends Object {
    constructor() {
        super();
        this.init(-1);
    }


    set on(newValue) {
        console.log("on");
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


    init(lightID) {
        console.log(lightID, this);
        this[priv] = this[priv] ?? {};
        this[priv].lightID = lightID;
        Object.seal(this);
    }


    _setValue(property, newValue) {
        if (this.action.on || property === "on") {
            this.action[property] = newValue;
            const action = {};
            action[property] = newValue
            this._setState(action);
        }
    }

    _setState(state) {
        HueService.query("PUT", ["groups", this[priv].lightID, "action"], JSON.stringify(state));
    }
}
