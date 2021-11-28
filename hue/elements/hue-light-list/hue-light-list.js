import "../hue-light-list-item/hue-light-list-item.js";
import { UIView } from "/base/ui-view.js";
import Hue from "/hue/hue.js";



export class HueLightList extends UIView {
    static get observedAttributes() {
        return [];
    }


    #shadowRoot = this.attachShadow({ mode: "closed" });
    #hueGroup = undefined;
    #lights = [];
    #lightsSubscription = undefined;


    get hueGroup() {
        return this.#hueGroup;
    }


    set hueGroup(val) {
        if (this.#hueGroup !== val) {
            this._clearList();
        }

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
        this.#lightsSubscription = (value) => this._updateLights(value);
        Hue.lights.subscribe(this.#lightsSubscription);
    }


    _updateLights(lightsObj) {
        this.#lights = Object.values(lightsObj ?? {});
        this._updateList();
    }


    _clearList() {
        const listView = this.#shadowRoot.querySelector("ui-list-view");
        listView.listData = [];
    }


    _updateList() {
        const lights = this.#lights.filter((l) => this.#hueGroup?.lights.includes(l.id));
        const listView = this.#shadowRoot.querySelector("ui-list-view");
        listView.listData = lights;
    }
}



UIView.define("hue-light-list", HueLightList, import.meta.url);
