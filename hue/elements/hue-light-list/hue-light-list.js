import "../hue-light-list-item/hue-light-list-item.js";
import { UIView } from "/base/ui-view.js";
import { HueLightDetail } from "/hue/elements/hue-light-detail/hue-light-detail.js";
import Hue from "/hue/hue.js";



export class HueLightList extends UIView {
    static get observedAttributes() {
        return [];
    }


    #shadowRoot = this.attachShadow({ mode: "closed" });
    #hueGroup = undefined;
    #lights = [];
    #lightsSubscription = undefined;
    #detailView = undefined;


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
    

    async onInit() {
        await customElements.whenDefined("hue-light-detail");                    // Custom Elements that are only instantiated in JS need to be defined first
        this.#detailView = new HueLightDetail();

        this.#lightsSubscription = (value) => this._updateLights(value);
        Hue.lights.subscribe(this.#lightsSubscription);

        const listView = this.#shadowRoot.querySelector("ui-list-view");
        listView.addEventListener("selectionChanged", (customEvent) => this._onSelectLight(customEvent));
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


    _onSelectLight(customEvent) {
        const selectedLights = customEvent.detail;
        const navigationView = this.closest("ui-navigation-view");
        const currentView = navigationView._currentView;

        if (!(currentView instanceof HueLightDetail)) {
            navigationView.pushView(this.#detailView);
        }

        this.#detailView.light = selectedLights[0];
    }
}



UIView.define("hue-light-list", HueLightList, import.meta.url);
