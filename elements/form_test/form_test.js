import { UIView } from "/base/ui-view.js";
import "./fancy_button.js";



export class MyForm extends UIView {
    static get observedAttributes() {
        return [];
    }


    #shadowRoot = this.attachShadow({ mode: "closed" });


    constructor(...args) {
        const self = super(args);
        Object.seal(this);

        this._init(this.#shadowRoot);
        return self;
    }


    adoptedCallback() {}
    attributeChangedCallback(name, oldValue, newValue) {}
    connectedCallback() {
        this.#shadowRoot.querySelector("BUTTON").onclick = () => {
            const ce = new CustomEvent("ChangePage", { detail: {
                path: "/canvas",
                component: "my-canvas",
                title: "Canvas",
            } });
            this.dispatchEvent(ce);
        }

        // const style = document.styleSheets[0];
        // const target = this.#shadowRoot.styleSheets[0]
        // console.log("connected");
        // console.log(target);
        // console.log(style);
        // let count = 0;

        // for (let rule of style.cssRules) {
        //     target.insertRule(rule.cssText, count++);
        // }

        // target.insertRule("button { border: 1px solid white; }", count++);

        // const r = document.styleSheets[0].cssRules.item(6);
        // const rule = r.cssText;
        // console.log(r);
        // const styleElement = this.#shadowRoot.querySelector("style");
        // styleElement.textContent += rule;

        // console.log(target);

    }
    disconnectedCallback() {}
}



UIView.define("my-form", MyForm, import.meta.url);
