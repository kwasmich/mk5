import { UIView } from "/base/ui-view.js";
import Hue from "/hue/hue.js";



class HueMainElement extends UIView {
    static get observedAttributes() {
        return [];
    }


    #shadowRoot = this.attachShadow({mode: "closed"});

    /** @type {HTMLSelectElement} */
    selectGroup = undefined;
    /** @type {HTMLSelectElement} */
    selectLight = undefined;

    groupsObj = undefined;
    lightsObj = undefined;
    selectedGroup = undefined;
    selectedLight = undefined;
    groupsSubscription = undefined;
    lightsSubscription = undefined;


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
        const lightControl = this.#shadowRoot.querySelector("mk-light-control");
        
        this.selectGroup = this.#shadowRoot.querySelector("select#group");
        this.selectGroup.onchange = (e) => {
            const groupID = e.target.value;
            this._updateLights(groupID);
        };
        this.selectLight = this.#shadowRoot.querySelector("select#light");
        this.selectLight.onchange = (e) => {
            // console.log(e);
            const light = e.target.value;
            // console.log(e.target.value);
            lightControl.light = light;
        };

        this.groupsSubscription = (value) => this._updateGroups(value);
        this.lightsSubscription = (value) => {
            this.lightsObj = value;
            this._updateLights();
            // Hue.lights.unsubscribe(this.lightsSubscription);
        };

        Hue.groups.subscribe(this.groupsSubscription);
        Hue.lights.subscribe(this.lightsSubscription);
    }


    _updateGroups(groupsObj) {
        this.groupsObj = groupsObj;

        while (this.selectGroup.length) {
            this.selectGroup.remove(0);
        }

        const option = document.createElement("option");
        option.text = "Alle";
        this.selectGroup.add(option);

        for (const grp in groupsObj) {
            const group = groupsObj[grp];

            if (group.type === "Room") {
                const option = document.createElement("option");
                option.value = grp;
                option.text = group.name;
                this.selectGroup.add(option);
            }
        }

        //Hue.groups.unsubscribe(this.groupsSubscription);
    }


    _updateLights(groupID) {
        const groupObj = this.groupsObj?.[groupID];

        while (this.selectLight.length) {
            this.selectLight.remove(0);
        }

        for (const lght in this.lightsObj) {
            if (!groupObj || groupObj.lights.includes(lght)) {
                const light = this.lightsObj[lght];
                const option = document.createElement("option");
                option.value = lght;
                option.text = light.name;
                this.selectLight.add(option);
            }
        }

        this.selectLight.selectedIndex = this.selectLight.length - 1;

        const evt = new Event("change");
        this.selectLight.dispatchEvent(evt);
    }
}



UIView.define("mk-hue-main", HueMainElement, import.meta.url);