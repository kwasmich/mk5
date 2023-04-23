import Hue from "./hue.js";
import { HueLight } from "./hue_light.js";
import HueService from "./hue.service.js";



const priv = Symbol("private");



function colormode(light) {
    const modes = ["xy", "ct", "hs"];

    for (const m of modes) {
        if (m in light) {
            return m;
        }
    }

    return;
}



export class HueScene extends Object {
    get imagePath() {
        return this.image && `./assets/HueImagePack/${this.image}_100.jpeg`
    }


    get colors() {
        return this[priv].colors;
    }


    constructor(...args) {
        const self = super(args);
        this.init("");
        return self;
    }


    init(sceneID) {
        this[priv] = this[priv] ?? {};
        this[priv].sceneID = sceneID;
        this[priv].colors = undefined;

        if (this.lightstates) {
            const lights = Object.keys(this.lightstates).map((l) => ({ state: { ...this.lightstates[l], reachable: true, colormode: colormode(this.lightstates[l]) } }));

            for (const light in lights) {
                Object.setPrototypeOf(lights[light], HueLight.prototype);
                lights[light].init(light);
            }

            const colors = lights.map((l) => l.color).filter((s) => !!s);

            while (colors.length < lights.length) {
                colors.push("#444");
            }

            this[priv].colors = colors;
        }

        Object.seal(this);
    }


    async apply() {
        const state = {
            scene: this[priv].sceneID
        };
        await HueService.query("PUT", ["groups", this.group, "action"], JSON.stringify(state));
        Hue.update();
    }
}
