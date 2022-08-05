import { UIView } from "/base/ui-view.js";
import { loadText } from "/util/helper.js";



class AVROP {
    constructor(x = 0, y = 0, op) {
        this.x = x;
        this.y = y;
        this.op = op;
    }
}



class AVRConstant {
    constructor(x = 0, y = 0, op, constant) {
        this.x = x;
        this.y = y;
        this.op = op;
        this.constant = constant;
    }
}



export class MyCanvas extends UIView {
    static get observedAttributes() {
        return [];
    }


    #shadowRoot = this.attachShadow({ mode: "closed" });
    #ctx = undefined;
    #select = undefined;
    #opMap = undefined;


    constructor(...args) {
        const self = super(args);
        Object.seal(this);

        this._init(this.#shadowRoot);
        this._onInit();

        return self;
    }


    adoptedCallback() {}
    attributeChangedCallback(name, oldValue, newValue) {}
    connectedCallback() {
        this.#shadowRoot.querySelector("BUTTON").onclick = () => {
            const ce = new CustomEvent("ChangePage", { detail: {
                path: "/form",
                component: "my-form",
                title: "Form",
            } });
            this.dispatchEvent(ce);
        }
    }
    disconnectedCallback() {}

    async _onInit() {
        console.log("inited");
        const ctx = this.#shadowRoot.querySelector("CANVAS").getContext("2d");
        window.ctx2d = ctx;
        this.#ctx = ctx;
        ctx.canvas.width = 256;
        ctx.canvas.height = 256;

        console.log(this.#ctx.canvas);

        const input = await loadText("/elements/canvas/avr.txt");
        const mnemonics = input.split("\n");
        const parser = /([0-9a-f]{2}) ([0-9a-f]{2})(?: [0-9a-f]{2} [0-9a-f]{2})?\t([^\t\n]+)(?:$|\t(.*))/;
        const registerParser = /r(\d+)/;

        const ops = new Set();
        const opMap = new Map();
        this.#opMap = opMap;

        for (const mnemonic of mnemonics) {
            const [y16, x16, op, args] = parser.exec(mnemonic).slice(1);
            ops.add(op)
            const x = parseInt(x16, 16);
            const y = parseInt(y16, 16);

            if (!opMap.has(op)) {
                opMap.set(op, []);
            }

            opMap.get(op).push({ x, y, op, args });
            // console.log(instructions[i], parser.exec(instructions[i])?.slice(1));
            // console.log(x, y, mnemonic, args);

            // if (args) {
            //     const splittedArgs = args.split(",\t");
            //     const rd = registerParser.exec(splittedArgs[0])?.[1];
            //     const rr = registerParser.exec(splittedArgs[1])?.[1];
            //     console.log(instructions[i], splittedArgs, rd, rr);
            // }

        }

        const opList = [...ops].sort();
        this.#select = this.#shadowRoot.querySelector("SELECT");

        for (const op of opList) {
            const newOption = this.#shadowRoot.ownerDocument.createElement("OPTION");
            newOption.textContent = op;
            this.#select.add(newOption);
        }

        this.#select.onchange = () => this._draw();
        this.#select.selectedIndex = 0;
        this._draw();
    }

    async _draw() {
        const selectedOp = this.#select.value;
        const ctx = this.#ctx;
        const img = ctx.createImageData(256, 256);
        const opMap = this.#opMap;

        for (const { x, y, op, args } of opMap.get(selectedOp)) {
            img.data[(y * 256 + x) * 4 + 0] = 0;
            img.data[(y * 256 + x) * 4 + 1] = 0;
            img.data[(y * 256 + x) * 4 + 2] = 0;
            img.data[(y * 256 + x) * 4 + 3] = 255;
        }

        ctx.putImageData(img, 0, 0);
    }
}



UIView.define("my-canvas", MyCanvas, import.meta.url);
