import { UIView } from "/base/ui-view2.js";
import "./list-item-test/list-item-test.js";



export class ListTestView extends UIView {
    static get observedAttributes() {
        return [];
    }


    #shadowRoot = this.attachShadow({ mode: "closed" });


    constructor(...args) {
        const self = super(args);
        Object.seal(this);

        this._init(this.#shadowRoot);
        this._onInit();
        return self;
    }


    adoptedCallback() {}
    attributeChangedCallback(name, oldValue, newValue) {}
    connectedCallback() {}
    disconnectedCallback() {}


    _onInit() {
        const listView = this.#shadowRoot.querySelector("ui-list-view");    
        listView.addEventListener("selectionChanged", (customEvent) => this._onSelectionChanged(customEvent));
        listView.listData = [...Array(50)].map((val, idx) => idx);
    }


    _onSelectionChanged(customEvent) {
        console.log(customEvent);
    }
}



UIView.define("list-test", ListTestView, import.meta.url);
