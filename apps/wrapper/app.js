import { UIView } from "/base/ui-view.js";



export function DefineApp(importPath) {
    const tagName = importPath.replaceAll(/[^\w]/g, "-");

    const app = class extends UIView {
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
            const module = (await import(importPath));
            const moduleProperties = Object.getOwnPropertyNames(module);
            console.log("loaded", moduleProperties);
            console.assert(moduleProperties.length === 1);
            const appClass = module[moduleProperties[0]];
            const name = UIView.registry.get(appClass);
            console.log(name);
            await(customElements.whenDefined(name));
            console.log("registred");
            const app = new appClass();
            return app;
        }
    }

    UIView.define(`app${tagName}`, app, import.meta.url);
    return app;
}
