import { UIView } from "/base/ui-view.js";



class CIEPickerElement extends UIView {
    static get observedAttributes() {
        return [];
    }


    #shadowRoot = this.attachShadow({mode: "closed"});
    #gamut = [[0, 0], [0, 0], [0, 0]];
    #image = undefined;
    #value = { x:0, y:0 };


    get gamut() {
        return this.#gamut;
    }


    set gamut(newValue) {
        this.#gamut = newValue ?? [[0, 0], [0, 0], [0, 0]];
        this._updateSVG();
    }


    get value() {
        return this.#value;
    }


    set value(newValue) {
        if (Array.isArray(newValue)) {
            const [x, y] = newValue
            newValue = { x, y };
        }

        this.#value = newValue ?? [0, 0];
        this._updateSVG();
    }


    constructor(...args) {
        const self = super(args);
        Object.seal(this);

        this._init(this.#shadowRoot);
        this.onInit();
        return self;
    }


    adoptedCallback() {}
    attributeChangedCallback(name, oldValue, newValue) {}
    connectedCallback() {}
    disconnectedCallback() {}


    onInit() {
        this.#image = this.#shadowRoot.querySelector("svg");
        const image = this.#image;
        image.onclick = (e) => this._onClick(e);
        image.onmousedown = (e) => this._onMouseDown(e);
    }


    _onMouseDown(event) {
        console.log(event);
        this.#shadowRoot.ownerDocument.onmouseup = (e) => this._onMouseUp(e);
        this.#image.onmousemove = (e) => this._onClick(e);
        this._onClick(event);
    }


    _onMouseUp(event) {
        console.log(event);
        this.#shadowRoot.ownerDocument.onmouseup = undefined;
        this.#image.onmousemove = undefined;
        const evt = new Event("change");
        this.dispatchEvent(evt);
        // console.log(this.value);
    }


    _onClick(event) {
        const image = this.#image;
        // console.log(event.currentTarget);
        // console.log(event.offsetX);
        // console.log(image.clientWidth);
        const x = (event.offsetX / image.clientWidth) * 0.75;
        const y = (1 - (event.offsetY / image.clientHeight)) * 0.85;
        this.value = { x, y };
                
        this._updateSVG();
    }


    _updateSVG() {
        const value = this.#shadowRoot.querySelector("#value");
        value.cx.baseVal.value = this.value.x * 1000;
        value.cy.baseVal.value = this.value.y * 1000;

        const g = this.gamut.map(([x, y]) => [x * 1000, y * 1000]);
        const gamut = this.#shadowRoot.querySelector("#gamut");
        // console.log(g); // M675,322 L409,518 L167,400 Z
        gamut.setAttribute("d", `M${g[0].join(",")} L${g[1].join(",")} L${g[2].join(",")} Z`);
    }
}



UIView.define("mk-cie-picker", CIEPickerElement, import.meta.url);
