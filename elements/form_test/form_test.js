import { UIView } from "/base/ui-view2.js";



export class MyForm extends UIView {
    static get observedAttributes() {
        return [];
    }


    #shadowRoot = this.attachShadow({ mode: "closed" });


    constructor(...args) {
        const self = super(args);
        Object.seal(this);

        this._init(this.#shadowRoot);
        return self;
    }


    adoptedCallback() {}
    attributeChangedCallback(name, oldValue, newValue) {}
    connectedCallback() {}
    disconnectedCallback() {}
}



UIView.define("my-form", MyForm, import.meta.url);




class FancyButton extends HTMLElement {
    constructor() {
      super(); // always call super() first in the constructor.
      this.addEventListener("click", e => this.drawRipple(e.offsetX, e.offsetY));
    }
  
    // Material design ripple animation.
    drawRipple(x, y) {
      let div = document.createElement("div");
      div.classList.add("ripple");
      this.appendChild(div);
      div.style.top = `${y - div.clientHeight/2}px`;
      div.style.left = `${x - div.clientWidth/2}px`;
      div.style.backgroundColor = "currentColor";
      div.classList.add("run");
      div.addEventListener("transitionend", e => div.remove());
    }
  }
  
  customElements.define("fancy-button", FancyButton, {extends: "button"});
  