import "../hue-light-list/hue-light-list.js";
import "../hue-room-list-item/hue-room-list-item.js";
import "../hue-room-list/hue-room-list.js";
import { UIView } from "/base/ui-view.js";
import Hue from "../../hue.js";


export class HuePrimary extends UIView {
    static get observedAttributes() {
        return [];
    }


    #shadowRoot = this.attachShadow({ mode: "closed" });
    #lightsSubscription = undefined;
    #groupsSubscription = undefined;


    constructor(...args) {
        const self = super(args);
        Object.seal(this);

        this._init(this.#shadowRoot);
        this.onInit();
        return self;
    }


    adoptedCallback() {}
    attributeChangedCallback(name, oldValue, newValue) {}


    connectedCallback() {
        Hue.lights.subscribe(this.#lightsSubscription);
        Hue.groups.subscribe(this.#groupsSubscription);
    }


    disconnectedCallback() {
        Hue.lights.unsubscribe(this.#lightsSubscription);
        Hue.groups.unsubscribe(this.#groupsSubscription);
    }


    onInit() {
        this.#lightsSubscription = (value) => this._updateLights(value);
        this.#groupsSubscription  = (value) => this._updateGroups(value);


        // TODO: make a complete settings page
        const tabView = this.#shadowRoot.querySelector("ui-tab-view");
        const root = tabView.views.find((x) => x.tagName.toLowerCase() === "div");
        const touchLinkButton = root.querySelector("button");
        touchLinkButton.onclick = () => this._onTouchLinkClicked();
    }


    _updateLights(lightsObj = {}) {
        const lights = Object.keys(lightsObj);
        const tabView = this.#shadowRoot.querySelector("ui-tab-view");
        const lightList = tabView.views.find((x) => x.tagName.toLowerCase() === "hue-light-list");
        // lightList.lightIDs = lights;
    }


    _updateGroups(groupsObj) {
        if (!groupsObj) return;

        const lights = Object.keys(Hue.lights.value);
        const rooms = Object.values(groupsObj).filter((group) => group.type === "Room");
        const groups = rooms.reduce((acc, room) => acc.set(room.name, room.lights), new Map());
        const grupedLights = rooms.flatMap((room) => room.lights);
        const ungrouped = lights.filter((l) => !grupedLights.includes(l));

        if (ungrouped.length > 0) {
            groups.set(" Ungrouped ", ungrouped);
        }

        console.log(groups);

        const tabView = this.#shadowRoot.querySelector("ui-tab-view");
        const lightList = tabView.views.find((x) => x.tagName.toLowerCase() === "hue-light-list");
        lightList.lightIDs = groups;
    }


    async _onTouchLinkClicked() {
        await Hue.touchLink();
    }
}



UIView.define("hue-primary", HuePrimary, import.meta.url);
