"use strict";

import "/elements/cie_picker.js";
import "/elements/hue_main.js";
import "/elements/hue_setup.js";
import "/elements/light_control.js";
import Hue from "/hue.js";
import "/util/security.js";



class Main {
    constructor() {
        this.setup = document.querySelector("mk-hue-setup");
        this.main = document.querySelector("mk-hue-main");
        Object.seal(this);

        this.setup.addEventListener("success", () => this._init());
    }


    _init() {
        Hue.init();
        this.main._init();
    }
}



export default new Main();

window.onfocus = (e) => console.log(e);
window.onblur = (e) => console.log(e);
