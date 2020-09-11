import "/elements/view_switcher/view_switcher.js";
import "/util/security.js";



class Main {
    constructor() {
        Object.seal(this);

        //this._initService();
        this._init();
    }


    _init() {
        const button = document.getElementsByTagName("BUTTON")[0];
        const viewSwitcher = document.getElementsByTagName("MK-VIEW-SWITCHER")[1];

        button.onclick = () => {
            const index = +viewSwitcher.viewIndex;
            viewSwitcher.viewIndex = (index + 1) % 2;
        }
    }


    _initService() {
        if ("serviceWorker" in navigator) {
            const successHandler = (/* @type ServiceWorkerRegistration */ sw) => {
                // registration worked!
                console.log(sw);
            };

            const errorHandler = (err) => {
                // registration failed :(
                console.error(err);
            }

            navigator.serviceWorker.register("/worker.service.js", { scope: "/" })
                .then(successHandler, errorHandler);
        }
    }
}



export default new Main();

// window.onfocus = (e) => console.log(e);
// window.onblur = (e) => console.log(e);

// customElements.whenDefined("mk-view-switcher").then(() => console.log("mk-view-switcher defined"));
// setTimeout(() => import("/elements/view_switcher/view_switcher.js"), 2000);
