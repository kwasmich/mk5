import HueGroup from "/hue/hue-group.js";
import HueScene from "/hue/hue-scene.js";
import HueService from "/hue/hue.service.js";
import HueLight from "/hue/hue_light.js";
import { Observable } from "/util/observable.js";



class Hue {
    constructor() {
        this.interval = undefined;
        this.lights = new Observable();
        this.groups = new Observable();
        this.scenes = new Observable();
        Object.seal(this);
        // this.init();
    }


    async init() {
        this.update();
        document.onvisibilitychange = () => this.update();
        const scenes = await HueService.query("GET", ["scenes"], null);
        const x = Object.keys(scenes).map((k) => ({ key: k, value: scenes[k]}));
        console.log(x.filter((x) => x.value.group === "6"));

        for (const scene in scenes) {
            Object.setPrototypeOf(scenes[scene], HueScene.prototype);
            scenes[scene].init(scene);
        }

        this.scenes.value = scenes;
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
            lights[light].init(light);
        }

        for (const group in groups) {
            Object.setPrototypeOf(groups[group], HueGroup.prototype);
            groups[group].init(group);
        }
        
        this.lights.value = lights;
        this.groups.value = groups;
    }
}


export default new Hue();
