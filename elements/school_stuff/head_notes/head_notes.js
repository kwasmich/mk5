import { UIView } from "/base/ui-view.js";



export class HeadNotes extends UIView {
    static get observedAttributes() {
        return [];
    }


    #shadowRoot = this.attachShadow({ mode: "closed" });
    #form = undefined;


    constructor(...args) {
        const self = super(args);
        this._onInput = this._onInput.bind(self);
        this._onBeforePrint = this._onBeforePrint.bind(self);
        this._onAfterPrint = this._onAfterPrint.bind(self);
        Object.seal(this);

        this._init(this.#shadowRoot);
        this._onInit();
        return self;
    }


    adoptedCallback() {}
    attributeChangedCallback(name, oldValue, newValue) {}


    connectedCallback() {
        window.addEventListener("beforeprint", this._onBeforePrint);
        window.addEventListener("afterprint", this._onAfterPrint);
    }

    disconnectedCallback() {
        window.removeEventListener("beforeprint", this._onBeforePrint);
        window.removeEventListener("afterprint", this._onAfterPrint);
    }


    _onInit() {
        console.log("here");
        this.#form = this.#shadowRoot.querySelector(`form`);
        this.#form.onsubmit = this._onSubmit;
        this.#form.oninput = this._onInput;
    }


    _onSubmit(submitEvent) {
        submitEvent.preventDefault();
        console.log(submitEvent);
        const formData = new FormData(submitEvent.target);
        const formProps = Object.fromEntries(formData);

        console.log(formData);
        console.log(formProps);
    }

    _onInput(event) {
        const detailsElement = event.target.closest("DETAILS");

        if (!detailsElement) return;

        const summaryElement = detailsElement.getElementsByTagName("SUMMARY").item(0);
        console.log(detailsElement);
        console.log(summaryElement);
        summaryElement.classList.toggle("checked", true);

        this.#shadowRoot.querySelectorAll("DETAILS").forEach((d) => d.open = false);

        if (detailsElement.nextElementSibling?.tagName === "DETAILS") {
            detailsElement.nextElementSibling.open = true;
        }

        this._update();
    }


    _update() {
        const formData = new FormData(this.#form);
        const formProps = Object.fromEntries(formData);

        const ai = "abcdefghi".split("");
        let aiSum = 0;
        let aiNum = 0;

        for (const el of ai) {
            aiSum += +(formProps[el] ?? 0);
            aiNum += (!!formProps[el]) ? 1 : 0;
        }

        const aiMark = this.#shadowRoot.querySelector(`div:first-of-type h2 span`);
        aiMark.textContent = (aiNum > 0) ? (aiSum / aiNum).toFixed(1) : "-";

        const js = "jklmnopqrs".split("");
        let jsSum = 0;
        let jsNum = 0;


        for (const el of js) {
            jsSum += +(formProps[el] ?? 0);
            jsNum += (!!formProps[el]) ? 1 : 0;
        }

        console.log(aiSum, aiNum);

        const jsMark = this.#shadowRoot.querySelector(`div:last-of-type h2 span`);
        jsMark.textContent = (jsNum > 0) ? (jsSum / jsNum).toFixed(1) : "-";

        console.log(formProps);
    }


    _onBeforePrint() {
        const details = this.#shadowRoot.querySelectorAll(`details`);
        details.forEach((d) => d.open = true);
    }


    _onAfterPrint() {
        const details = this.#shadowRoot.querySelectorAll(`details`);
        details.forEach((d) => d.open = false);
    }
}



UIView.define("school-head-notes", HeadNotes, import.meta.url);
