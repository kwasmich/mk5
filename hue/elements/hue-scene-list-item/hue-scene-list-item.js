import { UIView } from "/base/ui-view.js";
import { ct2rgb, IconMap, xy2rgb } from "/hue/hue-utils.js";



const priv = Symbol("private");



export class HueSceneListItem extends UIView {
    static get observedAttributes() {
        return [];
    }

    get item() {
        return this[priv].scene
    }

    set item(val) {
        this[priv].scene = val ?? {};
        this._updateView();
    }


    constructor(...args) {
        const self = super(args);

        this[priv] = this[priv] ?? {};
        this[priv].initialized = false;
        this[priv].scene = {};
        this[priv].icon = undefined;
        this[priv].name = undefined;
        this[priv].shadowRoot = this.attachShadow({ mode: "closed" });
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
        this.onclick = (mouseEvent) => this._onClick(mouseEvent);

        const sr = this[priv].shadowRoot;
        this[priv].icon = sr.querySelector("img");
        this[priv].name = sr.querySelector("span");
        this[priv].initialized = true;
        this._updateView();
    }


    _updateView() {
        if (this[priv].initialized) {
            const { name } = this[priv].scene;
            const iconPath = this[priv].scene.imagePath;
            
            if (this[priv].icon.src !== window.origin + iconPath) {
                this[priv].icon.src = iconPath;
            }

            this[priv].name.textContent = name;
        }
    }

    _onClick(mouseEvent) {
        this[priv].scene.apply();
    }
}



HueSceneListItem.templatePromise = null;
HueSceneListItem.metaURL = import.meta.url;
Object.seal(HueSceneListItem);



customElements.define("hue-scene-list-item", HueSceneListItem);
