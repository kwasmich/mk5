import { UIView } from "/base/ui-view.js";
import { loadText } from "/util/helper.js";


const priv = Symbol("private");


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



export class UICanvas extends UIView {
    constructor(...args) {
        const self = super(args);

        this[priv] = this[priv] ?? {};
        this[priv].ctx = undefined;
        this[priv].select = undefined;
        this[priv].input = undefined;
        this[priv].opMap = undefined;
        this[priv].shadowRoot = this.attachShadow({ mode: "closed" });
        Object.seal(this);
        Object.seal(this[priv]);

        this._init(this[priv].shadowRoot);
        return self;
    }


    async onInit() {
        super.onInit();

        console.log("inited");
        const ctx = this[priv].shadowRoot.querySelector("CANVAS").getContext("2d");
        window.ctx2d = ctx;
        this[priv].ctx = ctx;
        ctx.canvas.width = 256;
        ctx.canvas.height = 256;

        console.log(this[priv].canvas);

        const input = await loadText("/elements/canvas/avr.txt");
        this[priv].input = input;
        const mnemonics = input.split("\n");
        const parser = /([0-9a-f]{2}) ([0-9a-f]{2})(?: [0-9a-f]{2} [0-9a-f]{2})?\t([^\t\n]+)(?:$|\t(.*))/;
        const registerParser = /r(\d+)/;

        const ops = new Set();
        const opMap = new Map();
        this[priv].opMap = opMap;

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
        this[priv].select = this[priv].shadowRoot.querySelector("SELECT");

        for (const op of opList) {
            const newOption = document.createElement("OPTION");
            newOption.textContent = op;
            this[priv].select.add(newOption);
        }

        this[priv].select.onchange = () => this.draw();
        this[priv].select.selectedIndex = 0;
        this.draw();
    }


    async draw() {
        const selectedOp = this[priv].select.value;
        const ctx = this[priv].ctx;
        const img = ctx.createImageData(256, 256);
        const opMap = this[priv].opMap;

        for (const { x, y, op, args } of opMap.get(selectedOp)) {
            img.data[(y * 256 + x) * 4 + 0] = 0;
            img.data[(y * 256 + x) * 4 + 1] = 0;
            img.data[(y * 256 + x) * 4 + 2] = 0;
            img.data[(y * 256 + x) * 4 + 3] = 255;
        }

        ctx.putImageData(img, 0, 0);
    }
}



UICanvas.templatePromise = null;
UICanvas.metaURL = import.meta.url;
Object.seal(UICanvas);



customElements.define("ui-canvas", UICanvas);
