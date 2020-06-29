"use strict";

import HueService from "/hue.service.js"
import Observable from "/util/observable.js"
import HueLight from "/hue_light.js"



class Hue {
    constructor() {
        this.lights = new Observable();
        this.groups = new Observable();
        Object.seal(this);
        // this.init();
    }

    // init() {
    //     setInterval(() => this._init(), 5000);
    // }
    
    async init() {
        const lights = await HueService.query("GET", ["lights"], null);
        const groups = await HueService.query("GET", ["groups"], null);
        
        // const [lights, groups] = await Promise.all([
        //     HueService.query("GET", ["lights"], null),
        //     HueService.query("GET", ["groups"], null)
        // ]);
        
        for (const light in lights) {
            Object.setPrototypeOf(lights[light], HueLight.prototype);
            lights[light].init(+light);
        }
        
        this.lights.value = lights;
        this.groups.value = groups;
    }
}


export default new Hue();
