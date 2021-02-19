import Hue from "/hue/hue.js";
import HueLight from "/hue/hue_light.js";
import HueService from "/hue/hue.service.js";



const priv = Symbol("private");



export default class HueScene extends Object {
    get imagePath() {
        return `/hue/assets/HueImagePack/${this.image}_100.jpeg`
    }


    constructor() {
        super();
        this.init("");
    }


    init(sceneID) {
        this[priv] = this[priv] ?? {};
        this[priv].sceneID = sceneID;
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
