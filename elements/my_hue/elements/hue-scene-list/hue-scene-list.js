import { UIView } from "/base/ui-view.js";
import Hue from "../../hue.js";



export class HueSceneList extends UIView {
    static get observedAttributes() {
        return [];
    }


    #shadowRoot = this.attachShadow({ mode: "closed" });
    #hueGroup = undefined;
    #scenes = [];
    #scenesSubscription = undefined;


    get hueGroup() {
        return this.#hueGroup;
    }


    set hueGroup(val) {
        this.#hueGroup = val;
        this._updateList();
    }


    constructor(hueGroup, ...args) {
        const self = super(args);
        Object.seal(this);

        this.#hueGroup = hueGroup;

        this._init(this.#shadowRoot);
        this.onInit();
        return self;
    }


    adoptedCallback() {}
    attributeChangedCallback(name, oldValue, newValue) {}
    connectedCallback() {}
    disconnectedCallback() {}
    

    onInit() {
        this.#scenesSubscription = (value) => this._updateScenes(value);
        Hue.scenes.subscribe(this.#scenesSubscription);
    }


    _updateScenes(scenesObj) {
        let scenes = [];
        const map = {};
        
        for (const scn in scenesObj) {
            const scene = scenesObj[scn];
            map[scene.image] = scene.name;
            scenes.push(scene);
        }

        this.#scenes = scenes;
        this._updateList();
    }


    _updateList() {
        const scenes = this.#scenes.filter((scn) => scn.group === this.#hueGroup?.groupID);
        const listView = this.#shadowRoot.querySelector("ui-list-view");
        listView.listData = scenes;
    }
}



UIView.define("hue-scene-list", HueSceneList, import.meta.url);
