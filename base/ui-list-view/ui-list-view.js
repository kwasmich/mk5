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


    // #clickHandler = undefined;
    #listData = [] ?? new Map();
    #listElements = [];
    #shadowRoot = this.attachShadow({ mode: "open" });
    #template = this.querySelector("TEMPLATE");
    #cache = [];


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
        const forceUpdate = Array.isArray(val) !== Array.isArray(this.#listData);
        this.#listData = val ?? [];
        this._updateList(forceUpdate);
    }

    // set clickHandler(val) {
    //     this[priv]
    // }


    constructor(...args) {
        const self = super(args);
        this._onClick = this._onClick.bind(self);
        this._onKeyboardDown = this._onKeyboardDown.bind(self);
        Object.seal(this);

        this._init(this.#shadowRoot);
        this.onInit();
        
        return self;
    }
    
    
    onInit() {
        this._updateList(true);
    }
    
    
    adoptedCallback() {}
    attributeChangedCallback(name, oldValue, newValue) {}
    
    
    connectedCallback() {
        this.#shadowRoot.addEventListener("click", this._onClick);
        this.#shadowRoot.addEventListener("keydown", this._onKeyboardDown);
    }
    
    
    disconnectedCallback() {
        this.#shadowRoot.removeEventListener("click", this._onClick);
        this.#shadowRoot.removeEventListener("keydown", this._onKeyboardDown);
    }


    _updateListGroup(list, elements, parent) {
        // remove superfluous elements
        while (elements.length > list.length) {
            const element = elements.pop();
            element.remove();
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
        if (forceClear) {
            this._updateListGroup([], this.#listElements, undefined);

            const sections = [...this.#shadowRoot.querySelectorAll("SECTION")];
            sections.forEach((s) => s.remove());
        }

        let listLenght = 0;

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
                listLenght += list.length;
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
            listLenght += this.#listData.length;
            this._updateListGroup(this.#listData, this.#listElements, this.#shadowRoot);
        }

        for (const element of this.#listElements) {
            element.tabIndex = -1;
        }

        const newCell = this.#listElements[0];

        if (newCell) {
            newCell.tabIndex = 0;
        }

        // console.log(`input length: ${listLenght}, output length: ${this.#listElements.length}, cache length: ${this.#cache.length}`);
    }


    _onKeyboardDown(keyboardEvent) {
        const currentFocus = this.#shadowRoot.activeElement;
        const index = this.#listElements.indexOf(currentFocus);
        let newIndex;

        console.log(keyboardEvent.code);
        
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
                currentFocus.scrollIntoViewIfNeeded();
                this._select(currentFocus);
                return;

            default:
                return;
        }

        if (newIndex === index) return;

        keyboardEvent.preventDefault();

        for (const element of this.#listElements) {
            element.tabIndex = -1;
        }

        const newCell = this.#listElements[newIndex];
        newCell.tabIndex = 0;
        newCell.focus();

        // newCell.scrollIntoViewIfNeeded();
        // newCell.scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest" });
        // setTimeout(() => newCell.focus(), 500);
    }


    _onClick(mouseEvent) {
        // console.log(mouseEvent);
        const toggle = mouseEvent.metaKey;
        this._select(mouseEvent.target, toggle);
        mouseEvent.target.focus();
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
