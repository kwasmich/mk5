import { UIView } from "/base/ui-view.js";


export class AppHue extends UIView {
    static get observedAttributes() {
        return [];
    }


    #shadowRoot = this.attachShadow({ mode: "closed" });
    #app = undefined;
    

    constructor(...args) {
        const self = super(args);
        Object.seal(this);

        this._init(this.#shadowRoot);
        return self;
    }


    adoptedCallback() {}
    attributeChangedCallback(name, oldValue, newValue) {}

    connectedCallback() {
        console.log("connected");

        if (this.parentElement === document.body) {
            if (!this.#app) {
                this.#app = this._loadApp();
            } 
            
            this.#app.then((app) => {
                this.parentElement.replaceChild(app, this);
                app.id = this.id;
            });
        }
    }

    disconnectedCallback() {}


    async _loadApp() {
        const { MyHue } = await import("/elements/my_hue/my_hue.js");
        console.log("loaded");
        const name = UIView.registry.get(MyHue);
        await(customElements.whenDefined(name));
        console.log("registred");
        const app = new MyHue();
        return app;
    }
}



UIView.define("app-hue", AppHue, import.meta.url);
