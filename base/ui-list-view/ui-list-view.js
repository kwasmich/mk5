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

    get selectMode() {
        return this.getAttribute(SELECT_ATTR) ?? SELECT_NONE;
    }

    set selectMode(val) {
        this.setAttribute(SELECT_ATTR, val);
    }

    get listData() {
        return this[priv].listData
    }

    set listData(val) {
        this[priv].listData = val ?? [];
        this._updateList();
    }

    // set clickHandler(val) {
    //     this[priv]
    // }


    constructor(...args) {
        const self = super(args);

        this[priv] = this[priv] ?? {};
        // this[priv].clickHandler = undefined;
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
        console.log(mouseEvent);
        const toggle = mouseEvent.metaKey;
        this._select(mouseEvent.currentTarget, toggle);
        mouseEvent.currentTarget?.focus();
    }


    _select(element, toggle) {
        if ([SELECT_NONE, SELECT_SINGLE].includes(this.selectMode)) {
            const elements = this[priv].listElements.filter((e) => e !== element);
        
            for (const element of elements) {
                element.classList.remove(SELECT_CLASS);
            }
        }

        if ([SELECT_SINGLE, SELECT_MULTI].includes(this.selectMode)) {
            if (toggle) {
                element?.classList.toggle(SELECT_CLASS);
            } else {
                element?.classList.add(SELECT_CLASS);
            }
        }

        const detail = this[priv].listElements.filter((e) => e.classList.contains(SELECT_CLASS)).map((e) => e.item);
        const evt = new CustomEvent("selectionChanged", { detail });
        this.dispatchEvent(evt);
    }
}



UIListView.templatePromise = null;
UIListView.metaURL = import.meta.url;
Object.seal(UIListView);



customElements.define("ui-list-view", UIListView);
