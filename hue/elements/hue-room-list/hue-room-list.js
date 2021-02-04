import { UIView } from "/base/ui-view.js";
import Hue from "/hue/hue.js";



const priv = Symbol("private");



export class HueRoomList extends UIView {
    static get observedAttributes() {
        return [];
    }


    constructor(...args) {
        const self = super(args);

        this[priv] = this[priv] ?? {};
        this[priv].groupsSubscription = undefined;
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
        this[priv].groupsSubscription  = (value) => this._updateGroups(value);
        Hue.groups.subscribe(this[priv].groupsSubscription);
    }


    _updateGroups(groupsObj) {
        const rooms = [];
        
        for (const grp in groupsObj) {
            const group = groupsObj[grp];

            if (group.type === "Room") {
                rooms.push(group);
            }
        }

        const listView = this[priv].shadowRoot.querySelector("ui-list-view");
        listView.listData = rooms;
    }
}



HueRoomList.templatePromise = null;
HueRoomList.metaURL = import.meta.url;
Object.seal(HueRoomList);



customElements.define("hue-room-list", HueRoomList);
