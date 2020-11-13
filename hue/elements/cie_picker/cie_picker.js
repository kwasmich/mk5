import { UIView } from "/base/ui-view.js";
import { Observable } from "/util/observable.js";



const template = new Observable();
const priv = Symbol("private");



class CIEPickerElement extends UIView {
    static get observedAttributes() {
        return [];
    }


    get gamut() {
        return this[priv].gamut;
    }


    set gamut(newValue) {
        this[priv].gamut = newValue ?? [[0, 0], [0, 0], [0, 0]];
        this._updateSVG();
    }


    get value() {
        return this[priv].value;
    }


    set value(newValue) {
        if (Array.isArray(newValue)) {
            const [x, y] = newValue
            newValue = { x, y };
        }

        this[priv].value = newValue ?? [0, 0];
        this._updateSVG();
    }


    constructor() {
        const self = super();
        this[priv] = this[priv] ?? {};
        this[priv].shadowRoot = this.attachShadow({mode: 'closed'});
        this[priv].gamut = [[0, 0], [0, 0], [0, 0]];
        this[priv].image = undefined;
        this[priv].value = { x:0, y:0 };
        Object.seal(this);
        Object.seal(this[priv]);

        this._init(this[priv].shadowRoot);
        return self;
    }


    adoptedCallback() {}
    attributeChangedCallback(name, oldValue, newValue) {}
    connectedCallback() {}
    disconnectedCallback() {}


    onInit() {
        this[priv].image = this[priv].shadowRoot.querySelector("svg");
        const image = this[priv].image;
        image.onclick = (e) => this._onClick(e);
        image.onmousedown = (e) => this._onMouseDown(e);
    }


    _onMouseDown(event) {
        document.onmouseup = (e) => this._onMouseUp(e);
        this[priv].image.onmousemove = (e) => this._onClick(e);
        this._onClick(event);
    }


    _onMouseUp(event) {
        document.onmouseup = undefined;
        this[priv].image.onmousemove = undefined;
        const evt = document.createEvent("Event");
        evt.initEvent("change", false, true);
        this.dispatchEvent(evt);
        // console.log(this.value);
    }


    _onClick(event) {
        const image = this[priv].image;
        // console.log(event.currentTarget);
        // console.log(event.offsetX);
        // console.log(image.clientWidth);
        const x = (event.offsetX / image.clientWidth) * 0.75;
        const y = (1 - (event.offsetY / image.clientHeight)) * 0.85;
        this.value = { x, y };
                
        this._updateSVG();
    }


    _updateSVG() {
        const value = this[priv].shadowRoot.querySelector("#value");
        value.cx.baseVal.value = this.value.x * 1000;
        value.cy.baseVal.value = this.value.y * 1000;

        const g = this.gamut.map(([x, y]) => [x * 1000, y * 1000]);
        const gamut = this[priv].shadowRoot.querySelector("#gamut");
        console.log(g); // M675,322 L409,518 L167,400 Z
        gamut.setAttribute("d", `M${g[0].join(",")} L${g[1].join(",")} L${g[2].join(",")} Z`);
    }
}


CIEPickerElement.templatePromise = null;
CIEPickerElement.metaURL = import.meta.url;
Object.seal(CIEPickerElement);


customElements.define('mk-cie-picker', CIEPickerElement);
