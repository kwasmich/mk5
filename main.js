import { Router } from "/base/router.js";
import "/base/ui-list-view/ui-list-view.js";
import "/base/ui-navigation-view/ui-navigation-view.js";
import "/base/ui-tab-view/ui-tab-view.js";
import "/base/ui.js";

import "/elements/gestures/gestures.js";
import "/elements/list_test/list_test.js";
import "/elements/navigation_test/navigation_test.js";
import "/elements/tab_test/tab_test.js";
import "/util/custom_element_helper.js";
import "/util/security.js";
import { UIView } from "/base/ui-view.js";
import { MyCanvas } from "/elements/canvas/canvas.js";
import { MyForm } from "/elements/form_test/form_test.js";
import { PhotoBooth } from "/elements/photo_booth/photo_booth.js";
import { Launchpad } from "/elements/launchpad/launchpad.js";



class Main {
    constructor() {
        Object.seal(this);

        //this._initService();
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

const main = new Main();

export default main;

// window.onfocus = (e) => console.log(e);
// window.onblur = (e) => console.log(e);

// customElements.whenDefined("mk-view-switcher").then(() => console.log("mk-view-switcher defined"));
// setTimeout(() => import("/elements/view_switcher/view_switcher.js"), 2000);


export const Pages = Object.freeze({
    Launchpad: {
        path: "/",
        title: "Launchpad",
        component: UIView.registry.get(Launchpad),
    },
    Canvas: {
        path: "/canvas",
        title: "Canvas",
        component: UIView.registry.get(MyCanvas),
    },
    Form: {
        path: "/form",
        title: "Form",
        component: UIView.registry.get(MyForm),
    },
    PhotoBooth: {
        path: "/photo-booth",
        title: "Photo Booth",
        component: UIView.registry.get(PhotoBooth),
    },
    // About: {
    //     path: "/about",
    //     component: "about-page",
    //     title: "About",
    // },
});

Router.setRoutes(Pages);
