import "/base/ui-list-view/ui-list-view.js";
import "/base/ui-navigation-view/ui-navigation-view.js";
import "/base/ui-tab-view/ui-tab-view.js";
import "/base/ui.js";
import "/elements/canvas/canvas.js";
import "/elements/form_test/form_test.js";
import "/elements/list_test/list_test.js";
import "/elements/list_test/list-item-test/list-item-test.js";
import "/elements/tab_test/tab_test.js";
import "/elements/navigation/index.js";
import "/elements/view_switcher/view_switcher.js";
import "/util/security.js";



class Main {
    constructor() {
        Object.seal(this);

        //this._initService();
        this._init();
    }


    _init() {
        // const button = document.getElementsByTagName("BUTTON")[0];
        // const viewSwitcher = document.getElementsByTagName("UI-VIEW-SWITCHER")[0];

        // button.onclick = () => {
        //     const index = +viewSwitcher.viewIndex;
        //     viewSwitcher.viewIndex = (index + 1) % 4;
        // }
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
