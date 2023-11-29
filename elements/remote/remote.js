import { UIView } from "/base/ui-view.js";



// inspired by https://knx-user-forum.de/forum/projektforen/edomi/1193337-medion-telefunken-tv-steuern



export class MyRemote extends UIView {
    static get observedAttributes() {
        return [];
    }


    #shadowRoot = this.attachShadow({ mode: "closed" });
    #address = undefined;
    #ports = [56791];


    constructor(...args) {
        const self = super(args);
        Object.seal(this);

        this._init(this.#shadowRoot);
        return self;
    }


    adoptedCallback() {}
    attributeChangedCallback(name, oldValue, newValue) {}
    connectedCallback() {
        const input = this.#shadowRoot.querySelector("INPUT");
        this.#address = input.value;

        input.onchange = (event) => {
            this.#address = event.target.value;
            this.#findPort();
        }

        this.#findPort();

        this.#shadowRoot.querySelector("TABLE").onclick = (event) => {
            if (event.target.tagName === "BUTTON") {
                const code = event.target.dataset.code;
                for (const port of this.#ports)
                fetch(`http://${this.#address}:${port}/apps/vr/remote`, {
                    mode: "no-cors",
                    method: "POST",
                    body: `<remote><key code=${code}/></remote>`,
                    // headers: { "Host": `${this.#address}:${port}` }
                });
            }
        }

        // const style = document.styleSheets[0];
        // const target = this.#shadowRoot.styleSheets[0]
        // console.log("connected");
        // console.log(target);
        // console.log(style);
        // let count = 0;

        // for (let rule of style.cssRules) {
        //     target.insertRule(rule.cssText, count++);
        // }

        // target.insertRule("button { border: 1px solid white; }", count++);

        // const r = document.styleSheets[0].cssRules.item(6);
        // const rule = r.cssText;
        // console.log(r);
        // const styleElement = this.#shadowRoot.querySelector("style");
        // styleElement.textContent += rule;

        // console.log(target);

    }
    disconnectedCallback() {}


    async #findPort() {
        const ports = ['56789', '56790', '56791', '56792', '56793', '56794'];
        const code = 1051; // record
        const abortController = new AbortController();
        const promises = ports.map((p) =>
            fetch(`http://${this.#address}:${p}/apps/vr/remote`, {
                mode: "no-cors",
                method: "POST",
                body: `<remote><key code=${code}/></remote>`,
                // headers: { "Host": `${this.#address}:${this.#port}` }
                signal: abortController.signal
            }).then((response) => { console.log(response.bodyUsed); return Promise.resolve(p) })
        );
        setTimeout(() => abortController.abort(), 100);
        try {
            const ports = await Promise.allSettled(promises);
            const fulfilledPorts = ports.filter((p) => p.status === "fulfilled").map((p) => +p.value);
            console.log(fulfilledPorts);
            this.#ports = fulfilledPorts;
        } catch {}
    }
}




UIView.define("my-remote", MyRemote, import.meta.url);
