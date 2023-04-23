import { Router } from "/base/router.js";
import { UIView } from "/base/ui-view.js";
import "/base/ui-list-view/ui-list-view.js";
import "/base/ui-navigation-view/ui-navigation-view.js";
import "/base/ui-tab-view/ui-tab-view.js";
import "/base/ui.js";
import "/util/custom_element_helper.js";
import "/util/security.js";

import { MyCanvas } from "/elements/canvas/canvas.js";
import { MyForm } from "/elements/form_test/form_test.js";
import { MyHue } from "/elements/my_hue/my_hue.js";
import { PhotoBooth } from "/elements/photo_booth/photo_booth.js";
import { Launchpad } from "/elements/launchpad/launchpad.js";
import { ListTestView } from "/elements/list_test/list_test.js";
import { Gestures } from "/elements/gestures/gestures.js";
import { NavigationTestView } from "/elements/navigation_test/navigation_test.js";
import { TabTestView } from "/elements/tab_test/tab_test.js";



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
    Hue: {
        path: "/hue",
        title: "Hue",
        component: UIView.registry.get(MyHue),
    },
    PhotoBooth: {
        path: "/photo-booth",
        title: "Photo Booth",
        component: UIView.registry.get(PhotoBooth),
    },
    List: {
        path: "/list",
        component: UIView.registry.get(ListTestView),
        title: "List Test",
    },
    Navigation: {
        path: "/navigation",
        component: UIView.registry.get(NavigationTestView),
        title: "Navigation Test",
    },
    Tab: {
        path: "/tab",
        component: UIView.registry.get(TabTestView),
        title: "Tab Test",
    },
    Gestures: {
        path: "/gestures",
        component: UIView.registry.get(Gestures),
        title: "Gestures",
    },
});



Router.setRoutes(Pages);
