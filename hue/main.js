import "./elements/cie_picker/cie_picker.js";
import "./elements/hue-room-detail/hue-room-detail.js";
import "./elements/hue-room-no-detail/hue-room-no-detail.js";
import "./elements/hue-room-list-item/hue-room-list-item.js";
import "./elements/hue-room-list/hue-room-list.js";
import "./elements/hue-scene-list-item/hue-scene-list-item.js";
import "./elements/hue-scene-list/hue-scene-list.js";
import "./elements/hue_main/hue_main.js";
import "./elements/hue_setup/hue_setup.js";
import "./elements/light_control/light_control.js";
import "/base/ui-list-view/ui-list-view.js";
import "/base/ui-navigation-view/ui-navigation-view.js";
import Hue from "/hue/hue.js";
import "/util/security.js";



class Main {
    constructor() {
        this.setup = document.querySelector("mk-hue-setup");
        this.main = document.querySelector("mk-hue-main");
        Object.seal(this);

        // this._initService();
        this.setup.addEventListener("success", () => this._init());
    }


    _init() {
        this.setup.parentElement.removeChild(this.setup);
        Hue.init();
        // this.main._init();
    }


    _initService() {
        if ('serviceWorker' in navigator) {
            const successHandler = (/* @type ServiceWorkerRegistration */ sw) => {
                // registration worked!
                console.log(sw);
            };

            const errorHandler = (err) => {
                // registration failed :(
                console.error(err);
            }

            navigator.serviceWorker.register('/worker.service.js', { scope: '/' })
                .then(successHandler, errorHandler);
        }
    }
}



export default new Main();

// window.onfocus = (e) => console.log(e);
// window.onblur = (e) => console.log(e);
