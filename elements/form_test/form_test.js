import { UIView } from "/base/ui-view.js";



const priv = Symbol("private");



export class FormTestView extends UIView {
    static get observedAttributes() {
        return [];
    }


    constructor(...args) {
        const self = super(args);

        this[priv] = this[priv] ?? {};
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
}



FormTestView.templatePromise = null;
FormTestView.metaURL = import.meta.url;
Object.seal(FormTestView);



customElements.define("ui-form-test", FormTestView);



class FancyButton extends HTMLElement {
    constructor() {
      super(); // always call super() first in the constructor.
      this.addEventListener('click', e => this.drawRipple(e.offsetX, e.offsetY));
    }
  
    // Material design ripple animation.
    drawRipple(x, y) {
      let div = document.createElement('div');
      div.classList.add('ripple');
      this.appendChild(div);
      div.style.top = `${y - div.clientHeight/2}px`;
      div.style.left = `${x - div.clientWidth/2}px`;
      div.style.backgroundColor = 'currentColor';
      div.classList.add('run');
      div.addEventListener('transitionend', e => div.remove());
    }
  }
  
  customElements.define('fancy-button', FancyButton, {extends: 'button'});