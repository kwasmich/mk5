import HueGroup from "/hue/hue-group.js";
import HueService from "/hue/hue.service.js";
import HueLight from "/hue/hue_light.js";
import { Observable } from "/util/observable.js";



class Hue {
    constructor() {
        this.interval = undefined;
        this.lights = new Observable();
        this.groups = new Observable();
        Object.seal(this);
        // this.init();
    }


    init() {
        this.update();
        document.onvisibilitychange = () => this.update();
    }
    

    update() {
        clearInterval(this.interval);

        this._init();

        if (document.visibilityState === "visible") {
            this.interval = setInterval(() => this._init(), 30000);
        }
    }


    async _init() {
        const [lights, groups] = await Promise.all([
            HueService.query("GET", ["lights"], null),
            HueService.query("GET", ["groups"], null)
        ]);
        
        for (const light in lights) {
            Object.setPrototypeOf(lights[light], HueLight.prototype);
            lights[light].init(+light);
        }

        for (const group in groups) {
            Object.setPrototypeOf(groups[group], HueGroup.prototype);
            groups[group].init(+group);
        }
        
        this.lights.value = lights;
        this.groups.value = groups;
    }
}


export default new Hue();
