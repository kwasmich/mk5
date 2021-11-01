import Hue from "/hue/hue.js";
import HueLight from "/hue/hue_light.js";
import HueService from "/hue/hue.service.js";



const priv = Symbol("private");



export default class HueGroup extends HueLight {
    // constructor(...args) {
    //     const self = super(args);
    //     this.init(-1);
    //     return self;
    // }


    // set on(newValue) {
    //     this._setValue("on", newValue);
    // }


    // set bri(newValue) {
    //     this._setValue("bri", newValue);
    // }


    // set hue(newValue) {
    //     this._setValue("hue", newValue);
    // }


    // set sat(newValue) {
    //     this._setValue("sat", newValue);
    // }


    // set xy(newValue) {
    //     this._setValue("xy", newValue);
    // }
    

    // set ct(newValue) {
    //     this._setValue("ct", newValue);
    // }


    // set effect(newValue) {
    //     console.log("effect");
    //     this._setValue("effect", newValue);
    // }


    get groupID() {
        return this[priv].groupID
    }


    init(groupID) {
        this[priv] = this[priv] ?? {};
        this[priv].groupID = groupID;
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

    async _setState(state) {
        await HueService.query("PUT", ["groups", this[priv].groupID, "action"], JSON.stringify(state));
        Hue.update();
    }
}
