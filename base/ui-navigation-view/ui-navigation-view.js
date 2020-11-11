import { UIView } from "/base/ui-view.js";



const priv = Symbol("private");
const mediaQuery = window.matchMedia("screen and (max-width : 640px)");
const DEFAULT_NAVIGATION_STYLE = "default";
const STACK_NAVIGATION_STYLE = "stack";
const DOUBLE_COLUMN_NAVIGATION_STYLE = "double";

const SLOT = {
    "stack": "primary",
    "double": "secondary"
}


export class UINavigationView extends UIView {
    static get observedAttributes() {
        return [];
    }


    get _currentSlotName() {
        return SLOT[this[priv].navigationViewStyle];
    }


    get _currentView() {
        const slot = this[priv].shadowRoot.querySelector(`slot[name=${this._currentSlotName}]`);
        const currentView = slot.assignedElements()[0];
        return currentView;
    }


    constructor(...args) {
        const self = super(args);

        this[priv] = this[priv] ?? {};
        this[priv].navigationViewStyle = DOUBLE_COLUMN_NAVIGATION_STYLE;
        this[priv].shadowRoot = this.attachShadow({ mode: "closed" });

        this._onMediaQuery = this._onMediaQuery.bind(this);

        Object.seal(this);
        Object.seal(this[priv]);

        this._init(this[priv].shadowRoot);
        return self;
    }


    adoptedCallback() {}
    attributeChangedCallback(name, oldValue, newValue) {}
    

    connectedCallback() {
        mediaQuery.addListener(this._onMediaQuery);
        this._onMediaQuery(mediaQuery);
    }
    
    
    disconnectedCallback() {
        mediaQuery.removeListener(this._onMediaQuery);
    }


    onInit() {
        console.log("onInit");
    }


    pushView(view) {
        this.appendChild(view);
        view.previousElementSibling.removeAttribute("slot");
        view.setAttribute("slot", this._currentSlotName);
    }


    popView() {
        const currentView = this._currentView;
        const previousView = currentView.previousElementSibling;

        if (previousView && !previousView.hasAttribute("slot")) {
            previousView.setAttribute("slot", this._currentSlotName);
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
            view.setAttribute("slot", this._currentSlotName);

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

        currentView.setAttribute("slot", this._currentSlotName);

        while (currentView.nextElementSibling) {
            this.removeChild(currentView.nextElementSibling);
        }

        return currentView;
    }


    _onMediaQuery(mediaQueryListEvent) {
        this[priv].navigationViewStyle = mediaQueryListEvent.matches ? STACK_NAVIGATION_STYLE : DOUBLE_COLUMN_NAVIGATION_STYLE;
        console.log(this[priv].navigationViewStyle);
        const primary = this.querySelector("[slot=primary]");
        const secondary = this.querySelector("[slot=secondary]");

        if (this[priv].navigationViewStyle === STACK_NAVIGATION_STYLE) {
            if (secondary.previousElementSibling === primary) {
                this.insertBefore(secondary, this.firstElementChild);
            } else if (primary.nextElementSibling) {
                primary.nextElementSibling.setAttribute("slot", "secondary");
                this.insertBefore(primary.nextElementSibling, this.firstElementChild);
                primary.removeAttribute("slot");
                secondary.setAttribute("slot", "primary");
            }
        }

        if (this[priv].navigationViewStyle === DOUBLE_COLUMN_NAVIGATION_STYLE) {
            if (primary.previousElementSibling === secondary) {
                this.appendChild(secondary);
            } else if (secondary.nextElementSibling) {
                secondary.nextElementSibling.setAttribute("slot", "primary");
                this.insertBefore(secondary.nextElementSibling, secondary);
                secondary.removeAttribute("slot");
                primary.setAttribute("slot", "secondary");
            }
        }
    }
}



UINavigationView.templatePromise = null;
UINavigationView.metaURL = import.meta.url;
Object.seal(UINavigationView);



customElements.define("ui-navigation-view", UINavigationView);
