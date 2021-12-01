import { UIView } from "/base/ui-view.js";
import { ct2rgb, IconMap, xy2rgb } from "/hue/hue-utils.js";




export class HueSceneListItem extends UIView {
    static get observedAttributes() {
        return [];
    }


    #shadowRoot = this.attachShadow({ mode: "closed" });
    #initialized = false;
    #scene = {};
    #icon = undefined;
    #name = undefined;


    get item() {
        return this.#scene
    }
    

    set item(val) {
        this.#scene = val ?? {};
        this._updateView();
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
        // this.onclick = (mouseEvent) => this._onClick(mouseEvent);            // FIX ME: this is conflicting with UIListView
        this.addEventListener("click", (mouseEvent) => this._onClick(mouseEvent));

        const sr = this.#shadowRoot;
        this.#icon = sr.querySelector("img");
        this.#name = sr.querySelector("span");
        this.#initialized = true;
        this._updateView();
    }


    _updateView() {
        if (this.#initialized) {
            const { name } = this.#scene;
            const iconPath = this.#scene.imagePath;

            this.#icon.src = "";
            this.#icon.style.background = "";
            this.#icon.style.backgroundColor = "";
            this.#icon.style.backgroundImage = "";
            
            if (iconPath && this.#icon.src !== window.origin + iconPath) {
                this.#icon.src = iconPath;
            } else {
                const colors = this.#scene.colors;

                if (colors) {
                    if (colors.length === 1) {
                        this.#icon.style.background = "";
                        this.#icon.style.backgroundColor = colors.join();
                    } else if (colors.length > 1) {
                        this.#icon.style.background = `linear-gradient(to right bottom, ${colors.join()})`;
                    } else {
                        this.#icon.style.background = "";
                        this.#icon.style.backgroundColor = "#444";
                    }
                }
            }

            this.#name.textContent = name;
        }
    }

    _onClick(mouseEvent) {
        this.#scene.apply();
    }
}



UIView.define("hue-scene-list-item", HueSceneListItem, import.meta.url);