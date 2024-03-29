import { App } from "./app/app.js";
import { Router } from "/base/router.js";
import { UIView } from "/base/ui-view.js";



export class Launchpad extends UIView {
    static get observedAttributes() {
        return [];
    }


    #shadowRoot = this.attachShadow({ mode: "closed" });
    #outlet = undefined;


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


    async onInit() {
        await customElements.whenDefined("ui-launchpad-app");                    // Custom Elements that are only instantiated in JS need to be defined first
        const routes = Object.values(Router.routes);
        this.#outlet = this.#shadowRoot.querySelector("div.outlet");
        const routess = routes.filter((r) => r.path !== "/");

        routess.map((r) => {
            const icon = r.icon ?? "/apps/generic_icon.png";
            const screen = r.screen ?? "/apps/generic_icon.png";
            const app = new App(r.title, icon);
            const anchor = document.createElement("A");
            anchor.href = r.path;
            anchor.appendChild(app);
            anchor.onclick = (evt) => {
                evt.preventDefault();
                const rect = evt.target.getBoundingClientRect();
                console.log(rect);
                const scaleX = rect.width / window.innerWidth;
                const scaleY = rect.height / window.innerHeight;
                console.log({scaleX, scaleY});
                this.#outlet.style.scale = `${scaleX} ${scaleY}`;
                this.#outlet.style.translate = `${rect.x}px ${rect.y}px`;
                this.#outlet.style.backgroundImage = `url("${icon}")`;
                
                while (this.#outlet.firstChild) {
                    this.#outlet.firstChild.remove();
                }
                
                const component = document.createElement(r.component);
                component.style.backgroundImage = `url("${screen}")`;
                
                this.#outlet.ontransitionend = () => {
                    this.#outlet.ontransitionend = undefined;
                    Router.gotoNewPage(r, component);
                };
                
                this.#outlet.appendChild(component);
                this.#outlet.clientWidth; // force recalculating CSS
                this.#outlet.classList.add("zoom");
                // setTimeout(() => {this.#outlet.classList.remove("zoom");}, 6000);
            };
            this.#shadowRoot.appendChild(anchor);
        });
    }
}



UIView.define("ui-launchpad", Launchpad, import.meta.url);
