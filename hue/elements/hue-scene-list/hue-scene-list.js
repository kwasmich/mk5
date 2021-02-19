import { UIView } from "/base/ui-view.js";
import Hue from "/hue/hue.js";



const priv = Symbol("private");



export class HueSceneList extends UIView {
    static get observedAttributes() {
        return [];
    }

    get hueGroup() {
        return this[priv].hueGroup;
    }

    set hueGroup(val) {
        this[priv].hueGroup = val;
        this._updateList();
    }


    constructor(hueGroup, ...args) {
        console.log(hueGroup, args);
        const self = super(args);

        this[priv] = this[priv] ?? {};
        this[priv].hueGroup = hueGroup;
        this[priv].scenes = [];
        this[priv].scenesSubscription = undefined;
        this[priv].shadowRoot = this.attachShadow({ mode: "closed" });
        Object.seal(this);
        Object.seal(this[priv]);

        this._init(this[priv].shadowRoot);
        return self;
    }


    adoptedCallback() {}
    attributeChangedCallback(name, oldValue, newValue) {}
    connectedCallback() {}
    disconnectedCallback() {}
    

    onInit() {
        this[priv].scenesSubscription = (value) => this._updateScenes(value);
        Hue.scenes.subscribe(this[priv].scenesSubscription);
    }


    _updateScenes(scenesObj) {
        let scenes = [];
        const map = {};
        
        for (const scn in scenesObj) {
            const scene = scenesObj[scn];
            map[scene.image] = scene.name;
            scenes.push(scene);
        }

        // console.log(JSON.stringify(map));

        scenes = scenes.filter((scn) => scn.type === "GroupScene");
        scenes = scenes.filter((scn) => scn.recycle === false);
        this[priv].scenes = scenes;
        console.log(this[priv].scenes);

        this._updateList();
    }


    _updateList() {
        console.log(this[priv].scenes);
        console.log(this[priv].hueGroup);
        const scenes = this[priv].scenes.filter((scn) => scn.group === this[priv].hueGroup?.groupID);
        console.log(scenes);
        const listView = this[priv].shadowRoot.querySelector("ui-list-view");
        listView && (listView.listData = scenes);
    }
}



HueSceneList.templatePromise = null;
HueSceneList.metaURL = import.meta.url;
Object.seal(HueSceneList);



customElements.define("hue-scene-list", HueSceneList);
