import Router from "/base/router.js";
import "/base/ui-list-view/ui-list-view.js";
import "/base/ui-navigation-view/ui-navigation-view.js";
import "/base/ui-tab-view/ui-tab-view.js";
import "/base/ui.js";
import "/elements/canvas/canvas.js";
import "/elements/form_test/form_test.js";
import "/elements/gestures/gestures.js";
import "/elements/list_test/list_test.js";
import "/elements/navigation_test/navigation_test.js";
import "/elements/tab_test/tab_test.js";
import "/util/custom_element_helper.js";
import "/util/security.js";
import "/elements/photo_booth/photo_booth.js";



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
    // Home: {
    //     path: "/",
    //     component: "home-page",
    //     title: "Home",
    // },
    Canvas: {
        path: "/canvas",
        component: "my-canvas",
        title: "Canvas",
    },
    Form: {
        path: "/form",
        component: "my-form",
        title: "Form",
    },
    PhotoBooth: {
        path: "/photo-booth",
        component: "photo-booth",
        title: "Photo Booth",
    },
    // About: {
    //     path: "/about",
    //     component: "about-page",
    //     title: "About",
    // },
});

Router.setRoutes(Pages);
