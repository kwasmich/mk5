import { UIView } from "/base/ui-view2.js";
// import { UIListView } from "/base/ui-list-view/ui-list-view.js";
import { HueRoomDetail } from "/hue/elements/hue-room-detail/hue-room-detail.js";
import Hue from "/hue/hue.js";



export class HueRoomList extends UIView {
    static get observedAttributes() {
        return [];
    }


    #shadowRoot = this.attachShadow({ mode: "closed" });
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
    connectedCallback() {}
    disconnectedCallback() {}
    

    onInit() {
        this.#groupsSubscription  = (value) => this._updateGroups(value);
        Hue.groups.subscribe(this.#groupsSubscription);

        const listView = this.#shadowRoot.querySelector("ui-list-view");
        // console.log(listView instanceof UIListView);
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
        const hueGroups = customEvent.detail;
        this.parentNode.popToRootView();

        if (hueGroups.length === 1) {
            this.parentNode.pushView(new HueRoomDetail(hueGroups[0]));
        }
    }
}



UIView.define("hue-room-list", HueRoomList, import.meta.url);
