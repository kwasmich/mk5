"use strict";

import "./elements/hue_setup.js";
import "./elements/light_control.js";
import Hue from "./hue.js";
import "./util/security.js";



class Basic {
    constructor() {
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
        Object.seal(this);
        
        const lightControl = document.querySelector("mk-light-control");
        
        this.selectGroup = document.querySelector("select#group");
        this.selectGroup.onchange = (e) => {
            const groupID = e.target.value;
            this._updateLights(groupID);
        };
        this.selectLight = document.querySelector("select#light");
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
        const groupObj = this.groupsObj && this.groupsObj[groupID];

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

        var evt = document.createEvent("Event");
        evt.initEvent("change", false, true);
        this.selectLight.dispatchEvent(evt);
    }
}



export default new Basic();