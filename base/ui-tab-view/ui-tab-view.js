import { UIView } from "/base/ui-view.js";



// implemented with best practices found on
// https://www.youtube.com/watch?v=fI9VM5zzpu8



export class UITabView extends UIView {
    static get observedAttributes() {
        return [];
    }


    #shadowRoot = this.attachShadow({ mode: "closed" });
    #tabs = [];
    #views = [];
    #viewIndex = 0;


    get views() {
        return [...this.#views];
    }


    constructor(...args) {
        const self = super(args);
        Object.seal(this);

        this._init(this.#shadowRoot);
        this.onInit();
        return self;
    }


    adoptedCallback() {}
    attributeChangedCallback(name, oldValue, newValue) {}
    connectedCallback() {}
    disconnectedCallback() {}


    onInit() {
        const contentSlot = this.#shadowRoot.querySelector("slot[name=content]");
        const views = contentSlot.assignedElements();
        this.#views = views;
        const tabSlot = this.#shadowRoot.querySelector("slot[name=tab]");
        const tabs = tabSlot.assignedElements();
        this.#tabs = tabs;

        tabSlot.onclick = (mouseEvent) => {
            const index = tabs.indexOf(mouseEvent.target);
            this.#viewIndex = index;
            this.updateViews();
        };

        tabSlot.onkeydown = (keyboardEvent) => {
            switch (keyboardEvent.key) {
                case "ArrowLeft":
                    this.#viewIndex = Math.max(0, this.#viewIndex - 1);
                    // this.#viewIndex = (this.#viewIndex + this.#tabs.length - 1) % this.#tabs.length;
                    break;
                case "ArrowRight":
                    this.#viewIndex = Math.min(this.#viewIndex + 1, this.#tabs.length - 1);
                    // this.#viewIndex = (this.#viewIndex + 1) % this.#tabs.length;
                    break;
                case "Home":
                    this.#viewIndex = 0;
                    break;
                case "End":
                    this.#viewIndex = this.#tabs.length - 1;
                    break;
                default:
                    break;
            }

            this.updateViews();
        };

        tabSlot.parentElement.role = "tablist";

        this.updateViews();
    }


    updateViews() {
        const newView = this.#views[this.#viewIndex];
       
        for (const oldView of this.#views) {
            oldView.remove();
            // oldView.tabIndex = -1; // not required - is removed from DOM
        }

        newView.tabIndex = 0;
        this.appendChild(newView);

        const newTab = this.#tabs[this.#viewIndex];

        for (const oldTab of this.#tabs) {
            oldTab.tabIndex = -1;
            oldTab.ariaSelected = false;
            oldTab.role = "tab";
        }

        newTab.tabIndex = 0;
        newTab.ariaSelected = true;
        newTab.focus();
    }

    stuff() {
        this.#viewIndex = (this.#viewIndex + this.#tabs.length - 1) % this.#tabs.length;
    }
}



UIView.define("ui-tab-view", UITabView, import.meta.url);
