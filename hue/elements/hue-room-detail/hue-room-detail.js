import "../hue-light-list-item/hue-light-list-item.js";
import "../hue-light-list/hue-light-list.js";
import "../hue-scene-list-item/hue-scene-list-item.js";
import "../hue-scene-list/hue-scene-list.js";
import { UIView } from "/base/ui-view.js";
import Hue from "/hue/hue.js";


export class HueRoomDetail extends UIView {
    static get observedAttributes() {
        return [];
    }


    #shadowRoot = this.attachShadow({ mode: "closed" });
    #groupsSubscription = undefined;
    #hueGroup = undefined;
    #hueGroups = [];

    get hueGroup() {
        return this.#hueGroup;
    }


    set hueGroup(val) {
        this.#hueGroup = val;
        this.#hueGroups = [val];
        this._updateRoom();
        this._updateList();
    }


    constructor(...args) {
        const self = super(args);
        Object.seal(this);

        this._init(this.#shadowRoot);
        this.onInit();
        return self;
    }


    adoptedCallback() {}
    attributeChangedCallback(name, oldValue, newValue) {}
    connectedCallback() {}
    disconnectedCallback() {}


    onInit() {
        const backButton = this.#shadowRoot.querySelector("button");
        backButton.onclick = () => this.parentNode.popToRootView();

        this.#groupsSubscription  = (value) => {
            this.#hueGroups = Object.values(value ?? {});
            this._updateRoom();
        };
        Hue.groups.subscribe(this.#groupsSubscription);

        this._updateRoom();
        this._updateList();
    }


    _updateRoom() {
        const hueGroup = this.#hueGroups?.find((g) => g.groupID === this.#hueGroup?.groupID);
        const roomListItem = this.#shadowRoot.querySelector("hue-room-list-item");
        roomListItem.item = hueGroup;
    }


    _updateList() {
        const tabView = this.#shadowRoot.querySelector("ui-tab-view");
        const sceneList = tabView.views.find((x) => x.tagName.toLowerCase() === "hue-scene-list")
        sceneList.hueGroup = this.#hueGroup;
        const lightList = tabView.views.find((x) => x.tagName.toLowerCase() === "hue-light-list");
        lightList.hueGroup = this.#hueGroup;
    }
}



UIView.define("hue-room-detail", HueRoomDetail, import.meta.url);
