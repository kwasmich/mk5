import { UIView } from "/base/ui-view.js";



const priv = Symbol("private");

const IconMap = {
    "Attic":        "/hue/assets/HueIconPack2019/roomsAttic.svg",
    "Balcony":      "/hue/assets/HueIconPack2019/roomsBalcony.svg",
    "Barbecue":     "/hue/assets/HueIconPack2019/.svg",
    "Bathroom":     "/hue/assets/HueIconPack2019/roomsBathroom.svg",
    "Bedroom":      "/hue/assets/HueIconPack2019/roomsBedroom.svg",
    "Carport":      "/hue/assets/HueIconPack2019/roomsCarport.svg",
    "Closet":       "/hue/assets/HueIconPack2019/roomsCloset.svg",
    "Computer":     "/hue/assets/HueIconPack2019/roomsComputer.svg",
    "Dining":       "/hue/assets/HueIconPack2019/roomsDining.svg",
    "Downstairs":   "/hue/assets/HueIconPack2019/.svg",
    "Driveway":     "/hue/assets/HueIconPack2019/roomsDriveway.svg",
    "Front door":   "/hue/assets/HueIconPack2019/roomsFrontdoor.svg",
    "Garage":       "/hue/assets/HueIconPack2019/roomsGarage.svg",
    "Garden":       "/hue/assets/HueIconPack2019/.svg",
    "Guest room":   "/hue/assets/HueIconPack2019/roomsGuestroom.svg",
    "Gym":          "/hue/assets/HueIconPack2019/roomsGym.svg",
    "Hallway":      "/hue/assets/HueIconPack2019/roomsHallway.svg",
    "Home":         "/hue/assets/HueIconPack2019/.svg",
    "Kids bedroom": "/hue/assets/HueIconPack2019/roomsKidsbedroom.svg",
    "Kitchen":      "/hue/assets/HueIconPack2019/roomsKitchen.svg",
    "Laundry room": "/hue/assets/HueIconPack2019/roomsLaundryroom.svg",
    "Living room":  "/hue/assets/HueIconPack2019/roomsLiving.svg",
    "Lounge":       "/hue/assets/HueIconPack2019/roomsLounge.svg",
    "Man cave":     "/hue/assets/HueIconPack2019/roomsMancave.svg",
    "Music":        "/hue/assets/HueIconPack2019/otherMusic.svg",
    "Nursery":      "/hue/assets/HueIconPack2019/roomsNursery.svg",
    "Office":       "/hue/assets/HueIconPack2019/roomsOffice.svg",
    "Other":        "/hue/assets/HueIconPack2019/roomsOther.svg",
    "Pool":         "/hue/assets/HueIconPack2019/roomsPool.svg",
    "Porch":        "/hue/assets/HueIconPack2019/roomsPorch.svg",
    "Reading":      "/hue/assets/HueIconPack2019/.svg",
    "Recreation":   "/hue/assets/HueIconPack2019/roomsRecreation.svg",
    "Staircase":    "/hue/assets/HueIconPack2019/roomsStaircase.svg",
    "Storage":      "/hue/assets/HueIconPack2019/roomsStorage.svg",
    "Studio":       "/hue/assets/HueIconPack2019/roomsStudio.svg",
    "Terrace":      "/hue/assets/HueIconPack2019/roomsTerrace.svg",
    "Toilet":       "/hue/assets/HueIconPack2019/roomsToilet.svg",
    "Top floor":    "/hue/assets/HueIconPack2019/.svg",
    "TV":           "/hue/assets/HueIconPack2019/.svg",
    "Upstairs":     "/hue/assets/HueIconPack2019/.svg",
};
Object.seal(IconMap);



export class HueRoomListItem extends UIView {
    static get observedAttributes() {
        return [];
    }

    get item() {
        return this[priv].room
    }

    set item(val) {
        this[priv].room = val ?? {};
        this._updateView();
    }


    constructor(...args) {
        const self = super(args);

        this[priv] = this[priv] ?? {};
        this[priv].initialized = false;
        this[priv].room = {};
        this[priv].icon = undefined;
        this[priv].name = undefined;
        this[priv].on = undefined;
        this[priv].bri = undefined;
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
        const sr = this[priv].shadowRoot;
        this[priv].icon = sr.querySelector("img");
        this[priv].name = sr.querySelector("span");
        this[priv].on = sr.querySelector("input[type=checkbox]");
        this[priv].on.onchange = (e) => this._onInputChange(e);
        this[priv].bri = sr.querySelector("input[type=range]");
        this[priv].bri .onchange = (e) => this._onInputChange(e);
        this[priv].initialized = true;
        this._updateView();
    }


    _updateView() {
        if (this[priv].initialized) {
            this[priv].icon.src = IconMap[this[priv].room.class];
            this[priv].name.textContent = this[priv].room.name;
            this[priv].on.checked = this[priv].room.action.on;
            this[priv].bri.value = this[priv].room.action.bri;
        }
    }


    _onInputChange(event) {
        const attribute = event.target.name;
        const light = this[priv].room;
        
        switch (event.target.type) {
            case "checkbox":
                light[attribute] = event.target.checked;
            break;
            
            default:
                light[attribute] = +event.target.value;
        }
    }
}



HueRoomListItem.templatePromise = null;
HueRoomListItem.metaURL = import.meta.url;
Object.seal(HueRoomListItem);



customElements.define("hue-room-list-item", HueRoomListItem);
