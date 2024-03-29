import { UIView } from "/base/ui-view.js";
import { HueRoomDetail } from "../hue-room-detail/hue-room-detail.js";
import Hue from "../../hue.js";



export class HueRoomList extends UIView {
    static get observedAttributes() {
        return [];
    }


    #shadowRoot = this.attachShadow({ mode: "closed" });
    #groupsSubscription = undefined;
    #detailView = undefined;


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
    

    async onInit() {
        await customElements.whenDefined("hue-room-detail");                    // Custom Elements that are only instantiated in JS need to be defined first
        this.#detailView = new HueRoomDetail();

        this.#groupsSubscription  = (value) => this._updateGroups(value);
        Hue.groups.subscribe(this.#groupsSubscription);

        const listView = this.#shadowRoot.querySelector("ui-list-view");
        listView.addEventListener("selectionChanged", (customEvent) => this._onSelectRoom(customEvent));
    }


    _updateGroups(groupsObj) {
        const rooms = [];
        
        for (const grp in groupsObj) {
            const group = groupsObj[grp];

            if (group.type === "Room") {
                rooms.push(group);
            }
        }

        const listView = this.#shadowRoot.querySelector("ui-list-view");
        listView.listData = rooms;
    }


    _onSelectRoom(customEvent) {
        const selectedHueGroups = customEvent.detail;
        const navigationView = this.closest("ui-navigation-view");
        const currentView = navigationView._currentView;

        if (!(currentView instanceof HueRoomDetail)) {
            navigationView.popToRootView();
            navigationView.pushView(this.#detailView);
        }

        if (selectedHueGroups.length) {
            this.#detailView.hueGroup = selectedHueGroups[0];
        } else {
            navigationView.popToRootView();
        }
    }
}



UIView.define("hue-room-list", HueRoomList, import.meta.url);
