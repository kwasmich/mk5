import { UIView } from "/base/ui-view.js";



const SELECT_ATTR = "selectable";
const SELECT_NONE = "none";
const SELECT_SINGLE = "single";
const SELECT_MULTI = "multi";
const SELECT_CLASS = "selected";



export class UIListView extends UIView {
    static get observedAttributes() {
        return [SELECT_ATTR];
    }


    #listData = [] ?? new Map();
    #listElements = [];
    #shadowRoot = this.attachShadow({ mode: "open" });
    #template = this.querySelector("TEMPLATE");
    #cache = [];


    get selectMode() {
        console.assert([SELECT_NONE, SELECT_SINGLE, SELECT_MULTI].includes(this.getAttribute(SELECT_ATTR)));
        return this.getAttribute(SELECT_ATTR) ?? SELECT_NONE;
    }

    set selectMode(val) {
        console.assert([SELECT_NONE, SELECT_SINGLE, SELECT_MULTI].includes(val));
        this.setAttribute(SELECT_ATTR, val);
    }

    get listData() {
        return this.#listData
    }

    set listData(val) {
        const forceUpdate = Array.isArray(val) !== Array.isArray(this.#listData);
        this.#listData = val ?? [];
        this._updateList(forceUpdate);
    }


    constructor(...args) {
        const self = super(args);
        this._onKeyboardDown = this._onKeyboardDown.bind(self);
        this._onMouseDown = this._onMouseDown.bind(self);
        Object.seal(this);

        this._init(this.#shadowRoot);
        this.onInit();
        return self;
    }
    
    
    async onInit() {
        // console.log(this.#template.content.firstElementChild.constructor);
        await customElements.whenDefined(this.#template.content.firstElementChild.tagName.toLowerCase());
        customElements.upgrade(this.#template.content.firstElementChild);
        // console.log(this.#template.content.firstElementChild.constructor);
        this._updateList(true);
    }
    
    
    adoptedCallback() {}
    attributeChangedCallback(name, oldValue, newValue) {}
    
    
    connectedCallback() {
        this.#shadowRoot.addEventListener("keydown", this._onKeyboardDown);
        this.#shadowRoot.addEventListener("mousedown", this._onMouseDown);
    }
    
    
    disconnectedCallback() {
        this.#shadowRoot.removeEventListener("keydown", this._onKeyboardDown);
        this.#shadowRoot.removeEventListener("mousedown", this._onMouseDown);
    }


    _updateListGroup(list, elements, parent) {
        // remove superfluous elements
        while (elements.length > list.length) {
            const element = elements.pop();
            element.remove();
            element.classList.remove(SELECT_CLASS);
            this.#cache.push(element);
        }

        // add new elements
        while (elements.length < list.length) {
            const fromCache = this.#cache.pop();
            const element = fromCache ?? this.#template.content.firstElementChild.cloneNode(true);
            elements.push(element);
            parent.appendChild(element);
            
            if (!fromCache) {
                customElements.upgrade(element);
            }
        }

        // update element data
        list.forEach((item, idx) => elements[idx].item = item);
    }


    _updateList(forceClear = false) {
        const focusElement = !!this.#shadowRoot.activeElement;
        const oldFocus = this.#listElements.find((e) => e.tabIndex === 0);
        const oldFocusIndex = this.#listElements.indexOf(oldFocus);

        if (forceClear) {
            this._updateListGroup([], this.#listElements, undefined);

            const sections = [...this.#shadowRoot.querySelectorAll("SECTION")];
            sections.forEach((s) => s.remove());
        }

        if (this.#listData instanceof Map) {
            const sections = [...this.#shadowRoot.querySelectorAll("SECTION")];

            // remove superfluous sections
            while (sections.length > this.#listData.size) {
                const sectionElement = sections.pop();
                const listElements = [...sectionElement.querySelectorAll(":not([inert])")];
                this._updateListGroup([], listElements, undefined);
                sectionElement.remove();
            }

            this.#listElements.length = 0; // clear - we are relying on querySelector for sections

            this.#listData.forEach((list, grp, map) => {
                const reuseSectionElement = sections.pop();
                const sectionElement = reuseSectionElement ?? this.#shadowRoot.ownerDocument.createElement("SECTION");

                if (!reuseSectionElement) {
                    const headerElement = this.#shadowRoot.ownerDocument.createElement("HEADER");
                    headerElement.inert = true;
                    sectionElement.appendChild(headerElement);
                }

                sectionElement.querySelector("HEADER").textContent = grp;
                this.#shadowRoot.appendChild(sectionElement);
                const listElements = [...sectionElement.querySelectorAll(":not([inert])")];
                this._updateListGroup(list, listElements, sectionElement);
                this.#listElements.push(...listElements);
            });
        } else {
            this._updateListGroup(this.#listData, this.#listElements, this.#shadowRoot);
        }

        let newFocus = undefined; //this.#listElements.find((e) => e.tabIndex === 0);
        this.#listElements.forEach((e) => e.tabIndex = -1);
        
        // if (!newFocus) {
        if (oldFocusIndex <= 0) {
            newFocus = this.#listElements[0];
        } else if (oldFocusIndex >= this.#listElements.length) {
            newFocus = this.#listElements.at(-1);
        } else {
            newFocus = this.#listElements[oldFocusIndex];
        }
        // }

        if (newFocus) newFocus.tabIndex = 0;
        if (focusElement) newFocus.focus();
    }


    _onKeyboardDown(keyboardEvent) {
        const currentFocus = this.#shadowRoot.activeElement;
        const index = this.#listElements.indexOf(currentFocus);
        let newIndex;

        switch (keyboardEvent.code) {
            case "ArrowUp":
                newIndex = Math.max(0, index - 1);
                break;

            case "ArrowDown":
                newIndex = Math.min(index + 1, this.#listElements.length - 1);
                break;

            case "Home":
                newIndex = 0;
                break;

            case "End":
                newIndex = this.#listElements.length - 1;
                break;

            case "Enter":
            case "NumpadEnter":
            case "Space":
                keyboardEvent.preventDefault();
                // currentFocus.scrollIntoViewIfNeeded();
                this._select(currentFocus, currentFocus, [SELECT_MULTI].includes(this.selectMode), false);
                return;

            default:
                return;
        }

        if (newIndex === index) return;

        keyboardEvent.preventDefault();

        this.#listElements.forEach((e) => e.tabIndex = -1);

        const newCell = this.#listElements[newIndex];
        newCell.tabIndex = 0;
        newCell.focus();
    }


    _onMouseDown(mouseEvent) {
        const currentFocus = this.#shadowRoot.activeElement;
        const toggle = mouseEvent.metaKey;
        const range = mouseEvent.shiftKey;
        this._select(currentFocus, mouseEvent.target, toggle, range);
        this.#listElements.forEach((e) => e.tabIndex = -1);
        mouseEvent.target.tabIndex = 0;
    }


    _select(fromElement, toElement, toggle, range) {
        if (this.selectMode === SELECT_NONE) {
            const elements = this.#listElements;
            elements.forEach((e) => e.classList.remove(SELECT_CLASS));
        }

        if (this.selectMode === SELECT_SINGLE) {
            const elements = this.#listElements.filter((e) => e !== toElement);
            elements.forEach((e) => e.classList.remove(SELECT_CLASS));
            
            if (toggle) {
                toElement.classList.toggle(SELECT_CLASS);
            } else {
                toElement.classList.add(SELECT_CLASS);
            }
        }

        if (this.selectMode === SELECT_MULTI) {
            const fromIndex = this.#listElements.findIndex((l) => l === fromElement);

            if ((toggle && range) || !toggle && (!range || fromIndex === -1)) {
                const elements = this.#listElements.filter((e) => e !== toElement);
                elements.forEach((e) => e.classList.remove(SELECT_CLASS));
                
                toElement.classList.add(SELECT_CLASS);
            } else if (toggle && !range) {
                toElement.classList.toggle(SELECT_CLASS);
            } else if (!toggle && range) {
                const toIndex = this.#listElements.findIndex((l) => l === toElement);
                const start = Math.min(fromIndex, toIndex);
                const end = Math.max(fromIndex, toIndex);
                const elements  = this.#listElements.slice(start, end + 1);
                elements.forEach((e) => e.classList.add(SELECT_CLASS));
            }
        }

        const detail = this.#listElements.filter((e) => e.classList.contains(SELECT_CLASS)).map((e) => e.item);
        const evt = new CustomEvent("selectionChanged", { detail });
        this.dispatchEvent(evt);
    }
}



UIView.define("ui-list-view", UIListView, import.meta.url);
