import { UIView } from "/base/ui-view.js";



const priv = Symbol("private");

const SELECT_ATTR = "selectable";
const SELECT_NONE = "none";
const SELECT_SINGLE = "single";
const SELECT_MULTI = "multi";
const SELECT_CLASS = "selected";


export class UIListView extends UIView {
    static get observedAttributes() {
        return [SELECT_ATTR];
    }

    get isSelectable() {
        return this.getAttribute(SELECT_ATTR) ?? SELECT_NONE;
    }

    set isSelectable(val) {
        this.setAttribute(SELECT_ATTR, val);
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
    }


    adoptedCallback() {}
    attributeChangedCallback(name, oldValue, newValue) {}
    connectedCallback() {}
    disconnectedCallback() {}


    _updateList() {
        const root = this[priv].shadowRoot;
        const elements = this[priv].listElements;

        while (elements.length > this[priv].listData.length) {
            root.removeChild(elements.pop());
        }

        while (elements.length < this[priv].listData.length) {
            const element = this[priv].template.content.firstElementChild.cloneNode(true);
            elements.push(element);
            root.appendChild(element);
            element.tabIndex = -1;
            element.onclick = (mouseEvent) => this._onClick(mouseEvent);
        }
        
        this[priv].listData.forEach((item, idx) => elements[idx].item = item);
    }


    _onFocus(focusEvent) {
        // console.log(focusEvent);
        // console.log(this[priv].shadowRoot.firstElementChild);
        // this[priv].shadowRoot.firstElementChild.nextElementSibling?.focus();
        this.tabIndex = -1;
    }


    _onBlur(focusEvent) {
        // console.log(focusEvent);
        this.tabIndex = 0;
    }


    _onKeyboardDown(keyboardEvent) {
        const currentNode = this[priv].shadowRoot.querySelector(":focus");
        
        if (!currentNode) {
            this[priv].shadowRoot.querySelector(":not(link)")?.focus();
            return;
        }

        switch (keyboardEvent.code) {
            case "ArrowUp":
                currentNode?.previousElementSibling?.focus();
                break;
            
            case "ArrowDown":
                currentNode?.nextElementSibling?.focus();
                break;

            case "Enter":
            case "NumpadEnter":
            case "Space":
                this._select(currentNode);
                break;

            default:
        }
    }

    
    _onClick(mouseEvent) {
        this._select(mouseEvent.currentTarget);
        mouseEvent.currentTarget?.focus();
    }


    _select(element) {
        if ([SELECT_NONE, SELECT_SINGLE].includes(this.isSelectable)) {
            const elements = this[priv].listElements;
        
            for (const element of elements) {
                element.classList.remove(SELECT_CLASS);
            }
        }

        if ([SELECT_SINGLE, SELECT_MULTI].includes(this.isSelectable)) {
            element?.classList.toggle(SELECT_CLASS);
        }
    }
}



UIListView.templatePromise = null;
UIListView.metaURL = import.meta.url;
Object.seal(UIListView);



customElements.define("ui-list-view", UIListView);
