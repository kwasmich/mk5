import { UIView } from "/base/ui-view.js";
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

        const createList = () => listView.listData = [...Array(10 + Math.floor(20 * Math.random()))].map((val, idx) => idx);
        const createGroups = () => {
            const probability = 0.7;
            const data = new Map();
            data.set("A", Array(1 + Math.floor(10 * Math.random())).fill().map((val, idx) => `A ${idx}`));
            data.set("B", Array(2 + Math.floor(10 * Math.random())).fill().map((val, idx) => `B ${idx}`));
            data.set("C", Array(3 + Math.floor(10 * Math.random())).fill().map((val, idx) => `C ${idx}`));
            
            if (Math.random() < probability) {
                data.set("D", Array(5 + Math.floor(10 * Math.random())).fill().map((val, idx) => `D ${idx}`));

                if (Math.random() < probability) {
                    data.set("E", Array(7 + Math.floor(10 * Math.random())).fill().map((val, idx) => `E ${idx}`));

                    if (Math.random() < probability) {
                        data.set("F", Array(11 + Math.floor(10 * Math.random())).fill().map((val, idx) => `F ${idx}`));

                        if (Math.random() < probability) {
                            data.set("G", Array(13 + Math.floor(10 * Math.random())).fill().map((val, idx) => `G ${idx}`));
                        }
                    }
                }
            }

            listView.listData = data;
        };

        const buttonA = this.#shadowRoot.querySelector("button#A");
        buttonA.onclick = createList;

        const buttonB = this.#shadowRoot.querySelector("button#B");
        buttonB.onclick = createGroups;
        
        // setInterval(createList, 10000);
    }


    _onSelectionChanged(customEvent) {
        // console.log(customEvent);
    }
}



UIView.define("list-test", ListTestView, import.meta.url);
