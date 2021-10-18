import { UIView } from "/base/ui-view2.js";



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

    // #clickHandler = undefined;
    #listData = [];
    #listElements = [];
    #shadowRoot = this.attachShadow({ mode: "closed" });
    #template = this.querySelector("TEMPLATE");

    get selectMode() {
        return this.getAttribute(SELECT_ATTR) ?? SELECT_NONE;
    }

    set selectMode(val) {
        this.setAttribute(SELECT_ATTR, val);
    }

    get listData() {
        return this.#listData
    }

    set listData(val) {
        this.#listData = val ?? [];
        this._updateList();
    }

    // set clickHandler(val) {
    //     this[priv]
    // }


    constructor(...args) {
        const self = super(args);
        Object.seal(this);

        this._init(this.#shadowRoot);
        this.onInit();
        
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


    async _updateList() {
        const root = this.#shadowRoot;
        const elements = this.#listElements;

        while (elements.length > this.#listData.length) {
            root.removeChild(elements.pop());
        }

        while (elements.length < this.#listData.length) {
            const element = this.#template.content.firstElementChild.cloneNode(true);
            elements.push(element);
            root.appendChild(element);
            customElements.upgrade(element);
            element.tabIndex = -1;
            element.onclick = (mouseEvent) => this._onClick(mouseEvent);
        }

        this.#listData.forEach((item, idx) => elements[idx].item = item);
    }


    _onFocus(focusEvent) {
        // console.log(focusEvent);
        // console.log(this.#shadowRoot.firstElementChild);
        // this.#shadowRoot.firstElementChild.nextElementSibling?.focus();
        this.tabIndex = -1;
    }


    _onBlur(focusEvent) {
        // console.log(focusEvent);
        this.tabIndex = 0;
    }


    _onKeyboardDown(keyboardEvent) {
        const currentNode = this.#shadowRoot.querySelector(":focus");
        
        if (!currentNode) {
            this.#shadowRoot.querySelector(":not(link)")?.focus();
            return;
        }

        switch (keyboardEvent.code) {
            case "ArrowUp":
                keyboardEvent.preventDefault();
                currentNode?.previousElementSibling?.focus();
                currentNode?.previousElementSibling?.scrollIntoViewIfNeeded();
                break;
            
            case "ArrowDown":
                keyboardEvent.preventDefault();
                currentNode?.nextElementSibling?.focus();
                currentNode?.nextElementSibling?.scrollIntoViewIfNeeded();
                break;

            case "Enter":
            case "NumpadEnter":
            case "Space":
                keyboardEvent.preventDefault();
                currentNode?.scrollIntoViewIfNeeded();
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
            const elements = this.#listElements.filter((e) => e !== element);
        
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

        const detail = this.#listElements.filter((e) => e.classList.contains(SELECT_CLASS)).map((e) => e.item);
        const evt = new CustomEvent("selectionChanged", { detail });
        this.dispatchEvent(evt);
    }
}



UIView.define("ui-list-view", UIListView, import.meta.url);
