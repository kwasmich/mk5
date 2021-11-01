const css = `
fancy-button {
    display: inline-block;
    background-color: lime;
    position: relative;
    overflow: hidden;
}

.ripple {
    border-radius: 50%;
    position: absolute;

    width: 30px;
    height: 30px;
    pointer-events: none;
    opacity: 0.5;
    transform: scale(1);
    transition: opacity   1000ms cubic-bezier(0, 0, 0.2, 1),
    transform 1000ms cubic-bezier(0, 0, 0.2, 1);
}

.run {
    /* transform: scale(8); */
    transform: scale(0);
    opacity: 0;
}

`;


export class FancyButton extends HTMLElement {
    constructor(...args) {
        const self = super(args); // always call super() first in the constructor.
        this._drawRipple = this._drawRipple.bind(this);

        const style = document.createElement("STYLE");
        style.textContent = css;
        this.appendChild(style);
        return self;
    }

    adoptedCallback() {}
    attributeChangedCallback(name, oldValue, newValue) {}


    connectedCallback() {
        this.addEventListener("click", this._drawRipple);
    }


    disconnectedCallback() {
        this.removeEventListener("click", this._drawRipple);
    }


    // Material design ripple animation.
    _drawRipple(mouseEvent) {
        const x = mouseEvent.offsetX;
        const y = mouseEvent.offsetY;
        let div = document.createElement("div");
        div.classList.add("ripple");
        this.appendChild(div);
        div.style.top = `${y - div.clientHeight / 2}px`;
        div.style.left = `${x - div.clientWidth / 2}px`;
        div.style.backgroundColor = "currentColor";
        div.classList.add("run");
        div.addEventListener("transitionend", e => div.remove());
    }
}

customElements.define("fancy-button", FancyButton, { extends: "button" });
