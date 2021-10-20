import { UIView } from "/base/ui-view2.js";



export class UITabView extends UIView {
    static get observedAttributes() {
        return [];
    }


    #shadowRoot = this.attachShadow({ mode: "closed" });
    #views = [];
    #viewIndex = 0;


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

        tabSlot.onclick = (mouseEvent) => {
            const index = tabs.indexOf(mouseEvent.target);
            this.#viewIndex = index;
            this.updateViews();
        };

        tabs.forEach((tab, index) => tab.tabIndex = 0);

        this.updateViews();
    }


    updateViews() {
        const newView = this.#views[this.#viewIndex];

        for (const oldView of this.#views) {
            oldView.remove();
        }

        this.appendChild(newView);
    }
}



UIView.define("ui-tab-view", UITabView, import.meta.url);
