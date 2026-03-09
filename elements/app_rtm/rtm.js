import { UIView } from "/base/ui-view.js";

import DBService from "./db.service.js";



export class RecurringTaskManager extends UIView {
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
        this.#shadowRoot.querySelector('#addSeries').onclick = async () => {
            const result = await DBService.addSeries('AAAA');
            console.log(result);
        };

        this.#shadowRoot.querySelector('#getSeries').onclick = async () => {
            const result = await DBService.getSeries();
            console.log(result)
        };

        this.#shadowRoot.querySelector('#addEvent').onclick = async () => {
            const result = await DBService.addEvent(2);
            console.log(result);
        };

        this.#shadowRoot.querySelector('#getEvent').onclick = async () => {
            const result = await DBService.getEvents(3);
            console.log(result)
        };
    }
    disconnectedCallback() {}
}



UIView.define("app-rtm", RecurringTaskManager, import.meta.url);
