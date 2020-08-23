import HTMLCustomElement from "/html_custom_element.js";
import Hue from "/hue.js";
import Observable from "/util/observable.js";



const template = new Observable();
const priv = Symbol("private");



class HueMainElement extends HTMLCustomElement {
    static get observedAttributes() {
        return [];
    }


    constructor() {
        super(template, import.meta);

        /** @type {HTMLSelectElement} */
        this.selectGroup = undefined;
        /** @type {HTMLSelectElement} */
        this.selectLight = undefined;
        this.groupsObj = undefined;
        this.lightsObj = undefined;
        this.selectedGroup = undefined;
        this.selectedLight = undefined;
        this.groupsSubscription = undefined;
        this.lightsSubscription = undefined;
        this[priv] = this[priv] ?? {};
        this[priv].shadowRoot = this.attachShadow({mode: "closed"});
        Object.seal(this);

        //template.subscribe((value) => value && this._init(value));
    }


    adoptedCallback() {}
    attributeChangedCallback(name, oldValue, newValue) {}
    connectedCallback() {}
    disconnectedCallback() {}


    _init() {
        const content = template.value.content.cloneNode(true);
        this[priv].shadowRoot.appendChild(content);

        const lightControl = this[priv].shadowRoot.querySelector("mk-light-control");
        
        this.selectGroup = this[priv].shadowRoot.querySelector("select#group");
        this.selectGroup.onchange = (e) => {
            const groupID = e.target.value;
            this._updateLights(groupID);
        };
        this.selectLight = this[priv].shadowRoot.querySelector("select#light");
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

        const option = document.createElement("OPTION");
        option.text = "Alle";
        this.selectGroup.add(option);

        for (const grp in groupsObj) {
            const group = groupsObj[grp];

            if (group.type === "Room") {
                const option = document.createElement("OPTION");
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
                const option = document.createElement("OPTION");
                option.value = lght;
                option.text = light.name;
                this.selectLight.add(option);
            }
        }

        this.selectLight.selectedIndex = this.selectLight.length - 1;

        const evt = document.createEvent("Event");
        evt.initEvent("change", false, true);
        this.selectLight.dispatchEvent(evt);
    }
}


customElements.define("mk-hue-main", HueMainElement);
