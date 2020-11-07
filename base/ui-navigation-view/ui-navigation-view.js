import UIView from "/base/ui-view.js";



const priv = Symbol("private");



export default class UINavigationView extends UIView {
    static get observedAttributes() {
        return [];
    }


    get _currentView() {
        const slot = this[priv].shadowRoot.querySelector("slot[name=secondary]");
        const currentView = slot.assignedElements()[0];
        return currentView;
    }


    constructor(...args) {
        const self = super(args);

        this[priv] = this[priv] ?? {};
        this[priv].shadowRoot = this.attachShadow({ mode: "closed" });
        Object.seal(this);
        Object.seal(this[priv]);

        this._init(this[priv].shadowRoot);
        return self;
    }


    adoptedCallback() {}
    attributeChangedCallback(name, oldValue, newValue) {}
    connectedCallback() {}
    disconnectedCallback() {}


    pushView(view) {
        this.appendChild(view);
        view.setAttribute("slot", "secondary");
        view.previousElementSibling.removeAttribute("slot");
    }


    popView() {
        const currentView = this._currentView;
        const previousView = currentView.previousElementSibling;

        if (previousView && !previousView.hasAttribute("slot")) {
            previousView.setAttribute("slot", "secondary");
            this.removeChild(currentView);
            return previousView;
        } else {
            console.warn("nothing to pop!");
            return currentView;
        }
    }


    popToView(view) {
        let currentView = this._currentView;

        if ([...this.children].includes(view)) {
            view.setAttribute("slot", "secondary");

            while (view.nextElementSibling) {
                this.removeChild(view.nextElementSibling);
            }

            return view;
        } else {
            console.warn("view not included!");
            return currentView;
        }
    }


    popToRootView() {
        let currentView = this._currentView;

        while (currentView.previousElementSibling && !currentView.previousElementSibling.hasAttribute("slot")) {
            currentView = currentView.previousElementSibling;
        }

        currentView.setAttribute("slot", "secondary");

        while (currentView.nextElementSibling) {
            this.removeChild(currentView.nextElementSibling);
        }

        return currentView;
    }
}



UINavigationView.templatePromise = null;
UINavigationView.metaURL = import.meta.url;
Object.seal(UINavigationView);



customElements.define("ui-navigation-view", UINavigationView);
