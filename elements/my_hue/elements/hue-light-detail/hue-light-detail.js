import "../hue-light-list-item/hue-light-list-item.js";
import { UIView } from "/base/ui-view.js";
import Hue from "../../hue.js";



export class HueLightDetail extends UIView {
    static get observedAttributes() {
        return [];
    }


    #shadowRoot = this.attachShadow({ mode: "closed" });
    #lightsSubscription = undefined;
    #initialized = false;
    #light = undefined;
    #backButton = undefined;
    #lightListItem = undefined;
    #name = undefined;
    #on = undefined;
    #bri = undefined;
    #hue = undefined;
    #sat = undefined;
    #xy = undefined;
    #ct = undefined;


    get light() {
        return this.#light;
    }


    set light(val) {
        this.#light = val;
        this._updateView();
    }


    constructor(...args) {
        const self = super(args);
        Object.seal(this);

        this._init(this.#shadowRoot);
        this.onInit();
        return self;
    }


    adoptedCallback() { }
    attributeChangedCallback(name, oldValue, newValue) { }


    connectedCallback() {
        const navigationView = this.closest("ui-navigation-view");
        this.#backButton = this.#shadowRoot.querySelector("button");
        this.#backButton.onclick = () => navigationView.popView();


        // const inputs = this.#shadowRoot.querySelectorAll("input");

        // for (const input of inputs) {
        //     input.onchange = (e) => this._onInputChange(e);
        // }
    }


    disconnectedCallback() {
        this.#backButton.onclick = undefined;
    }


    onInit() {
        // this.onclick = (mouseEvent) => this._onClick(mouseEvent);            // FIX ME: this is conflicting with UIListView
        // this.addEventListener("click", (mouseEvent) => this._onClick(mouseEvent));

        this.#lightsSubscription = (value) => this._updateLights(value);
        Hue.lights.subscribe(this.#lightsSubscription);

        this.#lightListItem = this.#shadowRoot.querySelector("hue-light-list-item");

        const tabView = this.#shadowRoot.querySelector("ui-tab-view");
        const [hlsView, xyView, ctView, effectsView, etcView] = tabView.views;

        this.#hue = hlsView.querySelector("input#hue");
        this.#sat = hlsView.querySelector("input#sat");
        this.#hue.onchange = (e) => this._onInputChange(e);
        this.#sat.onchange = (e) => this._onInputChange(e);

        this.#xy = xyView.querySelector("mk-cie-picker");
        this.#xy.onchange = (e) => this._onXYChange(e);

        this.#ct = ctView.querySelector("input#ct");
        this.#ct.onchange = (e) => this._onInputChange(e);

        const alertNoneButton = effectsView.querySelector("button#alertNone");
        const alertSelectButton = effectsView.querySelector("button#alertSelect");
        const alertLSelectButton = effectsView.querySelector("button#alertLSelect");
        const effectNoneButton = effectsView.querySelector("button#effectNone");
        const effectColorloopButton = effectsView.querySelector("button#effectColorloop");
        alertNoneButton.onclick = () => this.#light.alert = "none";
        alertSelectButton.onclick = () => this.#light.alert = "select";
        alertLSelectButton.onclick = () => this.#light.alert = "lselect";
        effectNoneButton.onclick = () => this.#light.effect = "none";
        effectColorloopButton.onclick = () => this.#light.effect = "colorloop";

        this.#name = etcView.querySelector("input#name");
        this.#on = etcView.querySelector("input#on");
        this.#bri = etcView.querySelector("input#bri");
        this.#on.onchange = (e) => this._onInputChange(e);
        this.#bri.onchange = (e) => this._onInputChange(e);

        this.#initialized = true;
        this._updateView();
    }


    _updateLight() {
        const lightListItem = this.#shadowRoot.querySelector("hue-light-list-item");
        lightListItem.item = this.#light;
    }


    _updateView() {
        if (!this.#initialized || !this.#light) {
            return;
        }

        const l = this.#light;
        if (!l) return;

        this.#lightListItem.item = this.#light;

        this.#name.value = l.name;
        this.#on.checked = l.state.on;
        this.#bri.value = l.state.bri;
        this.#hue.value = l.state.hue;
        this.#sat.value = l.state.sat;

        this.#xy.gamut = l.capabilities.control.colorgamut;
        this.#xy.value = l.state.xy;

        const lct = l.capabilities.control.ct;
        this.#ct.min = lct ? lct.min : 153; // TODO: lct?.min ?? 153;
        this.#ct.max = lct ? lct.max : 500;
        this.#ct.value = l.state.ct;
    }


    _onInputChange(event) {
        const attribute = event.target.id;
        const light = this.#light;

        switch (event.target.type) {
            case "checkbox":
                light[attribute] = event.target.checked;
                break;

            default:
                light[attribute] = +event.target.value;
        }
    }


    _onXYChange(event) {
        const light = this.#light;
        const { x, y } = event.target.value;
        light.xy = [x, y];
        console.log([x, y]);
    }


    _updateLights(lightsObj) {
        const lightList = Object.values(lightsObj ?? {});
        this.#light = lightList.find((l) => l.id === this.#light?.id) ?? this.#light;
        this._updateView();
    }
}



UIView.define("hue-light-detail", HueLightDetail, import.meta.url);
