import "/base/ui-list-view/ui-list-view.js";
import "/base/ui-navigation-view/ui-navigation-view.js";
import "/base/ui-tab-view/ui-tab-view.js";
import "/base/ui.js";
import "/elements/canvas/canvas.js";
import "/elements/form_test/form_test.js";
import "/elements/list_test/list_test.js";
import "/elements/navigation_test/navigation_test.js";
import "/elements/tab_test/tab_test.js";
import "/util/custom_element_helper.js";
import "/util/security.js";



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


    toString() {
        return "affe"
    }
}

const main = new Main();

export default main;

// window.onfocus = (e) => console.log(e);
// window.onblur = (e) => console.log(e);

// customElements.whenDefined("mk-view-switcher").then(() => console.log("mk-view-switcher defined"));
// setTimeout(() => import("/elements/view_switcher/view_switcher.js"), 2000);


let person = 'Mike';
let age = 128;

function myTag(...args) {
    console.log(args);
    return "hello";
  let str0 = strings[0]; // "That "
  let str1 = strings[1]; // " is a "
  let str2 = strings[2]; // "."

  let ageStr;
  if (ageExp > 99){
    ageStr = 'centenarian';
  } else {
    ageStr = 'youngster';
  }

  // We can even return a string built using a template literal
  return `${str0}${personExp}${str1}${ageStr}${str2}`;
}

let output = myTag`That ${ person } is a ${ age }.`;

console.log(output);

console.log("" + main);
