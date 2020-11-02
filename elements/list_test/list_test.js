import UIView from "/base/ui-view.js";



const priv = Symbol("private");



class ListTestView extends UIView {
    static get observedAttributes() {
        return [];
    }

    get listData() {
        return this[priv].listData
    }

    set listData(val) {
        this[priv].listData = val ?? [];
        this._updateList();
    }


    constructor(...args) {
        const self = super(args);

        this[priv] = this[priv] ?? {};
        this[priv].listData = [];
        this[priv].listElements = [];
        this[priv].shadowRoot = this.attachShadow({ mode: "closed" });
        this[priv].template = this.querySelector("TEMPLATE");
        Object.seal(this);
        Object.seal(this[priv]);

        this._init(this[priv].shadowRoot);
        this.tabIndex = 0;
        this.onfocus = (focusEvent) => this._onFocus(focusEvent);
        this.onblur = (focusEvent) => this._onBlur(focusEvent);
        this.onkeydown = (keyboardEvent) => this._onKeyboardDown(keyboardEvent);
        return self;
    }


    onInit() {
        this._updateList();
        this.listData = [1, 2, 3, 4, 5];
    }


    adoptedCallback() {}
    attributeChangedCallback(name, oldValue, newValue) {}
    connectedCallback() {}
    disconnectedCallback() {}


    _updateList() {
        const root = this[priv].shadowRoot;
        const elements = this[priv].listElements;
        
        for (const element of elements) {
            root.removeChild(element);
        }

        elements.length = 0;

        for (const item of this[priv].listData) {
            const element = this[priv].template.content.firstElementChild.cloneNode(true);
            elements.push(element);
            root.appendChild(element);
            element.tabIndex = -1;
        }
    }


    _onFocus(focusEvent) {
        // console.log(focusEvent);
        // console.log(this[priv].shadowRoot.firstElementChild);
        this[priv].shadowRoot.firstElementChild.nextElementSibling?.focus();
    }


    _onBlur(focusEvent) {
        // console.log(focusEvent);
    }


    _onKeyboardDown(keyboardEvent) {
        const currentNode = this[priv].shadowRoot.querySelector(":focus");

        switch (keyboardEvent.code) {
            case "ArrowUp":
                currentNode?.previousSibling?.focus();
                break;
            
            case "ArrowDown":
                currentNode?.nextSibling?.focus();
                break;

            case "Enter":
            case "NumpadEnter":
            case "Space":
                currentNode?.classList.toggle("selected");
                break;

            default:
        }
    }
}



ListTestView.templatePromise = null;
ListTestView.metaURL = import.meta.url;
Object.seal(ListTestView);



customElements.define("ui-list-test", ListTestView);
