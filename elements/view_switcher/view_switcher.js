import HTMLCustomElement from "/html_custom_element.js";



const priv = Symbol("private");



class ViewSwticher extends HTMLCustomElement {
    // static template;
    // static metaURL = import.meta.url;

    static get observedAttributes() {
        return ["view-index"];
    }

    get viewIndex() {
        return this.getAttribute("view-index");
    }

    set viewIndex(val) {
        this.setAttribute("view-index", val);
    }


    constructor(...args) {
        const self = super(args);

        this[priv] = this[priv] ?? {};
        this[priv].shadowRoot = this.attachShadow({ mode: "closed" });
        this[priv].views = undefined;
        Object.seal(this);
        Object.seal(this[priv]);

        this._init(this[priv].shadowRoot);
        return self;
    }


    onInit() {
        super.onInit();
        const slot = this[priv].shadowRoot.querySelector("slot[name=content]");
        const views = slot.assignedElements();
        this[priv].views = views;
        this.viewIndex = this.viewIndex ?? 0;                                   // set to zero if undefined
    }


    adoptedCallback() {}

    attributeChangedCallback(name, oldValue, newValue) {
        console.log(name, oldValue, newValue);
        const views = this[priv].views;
        const newView = views[newValue];

        if (newView) {
            for (const oldView of views) {
                if (this.contains(oldView)) {
                    this.removeChild(oldView);
                }
            }

            this.appendChild(newView);
        }
    }
    
    connectedCallback() {}
    disconnectedCallback() {}
}


ViewSwticher.template = null;
ViewSwticher.metaURL = import.meta.url;


customElements.define("mk-view-switcher", ViewSwticher);
