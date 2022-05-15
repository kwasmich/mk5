import "../hue-light-list-item/hue-light-list-item.js";
import { UIView } from "/base/ui-view.js";
import Hue from "/hue/hue.js";



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
    #alertNoneButton = undefined;
    #alertSelectButton = undefined;
    #alertLSelectButton = undefined;
    #effectNoneButton = undefined;
    #effectColorloopButton = undefined;


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

        const sr = this.#shadowRoot;
        this.#lightListItem = sr.querySelector("hue-light-list-item");
        this.#name = sr.querySelector("input#name");
        this.#on = sr.querySelector("input#on");
        this.#bri = sr.querySelector("input#bri");
        this.#hue = sr.querySelector("input#hue");
        this.#sat = sr.querySelector("input#sat");
        this.#ct = sr.querySelector("input#ct");

        this.#xy = sr.querySelector("mk-cie-picker");

        this.#alertNoneButton = sr.querySelector("button#alertNone");
        this.#alertSelectButton = sr.querySelector("button#alertSelect");
        this.#alertLSelectButton = sr.querySelector("button#alertLSelect");
        this.#effectNoneButton = sr.querySelector("button#effectNone");
        this.#effectColorloopButton = sr.querySelector("button#effectColorloop");


        this.#on.onchange = (e) => this._onInputChange(e);
        this.#bri.onchange = (e) => this._onInputChange(e);
        this.#hue.onchange = (e) => this._onInputChange(e);
        this.#sat.onchange = (e) => this._onInputChange(e);
        this.#ct.onchange = (e) => this._onInputChange(e);

        this.#xy.onchange = (e) => this._onXYChange(e);

        this.#alertNoneButton.onclick = () => this.#light.alert = "none";
        this.#alertSelectButton.onclick = () => this.#light.alert = "select";
        this.#alertLSelectButton.onclick = () => this.#light.alert = "lselect";
        this.#effectNoneButton.onclick = () => this.#light.effect = "none";
        this.#effectColorloopButton.onclick = () => this.#light.effect = "colorloop";

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
