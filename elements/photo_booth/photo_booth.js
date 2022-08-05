import { UIView } from "/base/ui-view.js";



export class PhotoBooth extends UIView {
    static get observedAttributes() {
        return [];
    }


    #shadowRoot = this.attachShadow({ mode: "closed" });
    #selectElement;
    #cameraStream;
    #busy = false;


    constructor(...args) {
        const self = super(args);
        Object.seal(this);

        this._init(this.#shadowRoot);
        return self;
    }


    adoptedCallback() {}
    attributeChangedCallback(name, oldValue, newValue) {}


    connectedCallback() {
        if (!navigator.mediaDevices) {
            console.error("HTTP/S required to access camera!");
            return;
        }

        this.#selectElement = this.#shadowRoot.querySelector("SELECT");
        this.#selectElement.onchange = (event) => this._onChange(event);
        const button = this.#shadowRoot.querySelector("BUTTON");
        button.onclick = () => this._takeStill();
        const all = this.#shadowRoot.querySelector("DIV.fill");
        all.onclick = () => this._toggleFullScreen();
        this._listCameras();
    }


    disconnectedCallback() {
        this.#selectElement.onchange = undefined;
        this.#selectElement = undefined;
        this._stopStream();
    }


    async _listCameras() {
        try {
            const devices = await navigator.mediaDevices.enumerateDevices();
            
            devices.filter((d) => d.kind === "videoinput").forEach((d) => {
                const option = this.#shadowRoot.ownerDocument.createElement("OPTION");
                option.value = d.deviceId;
                option.text = d.label;
                this.#selectElement.append(option);
            });
        } catch (err) {
            console.error(err);
        }
    }


    _onChange(event) {
        this._stopStream();
        this._startStream(this.#selectElement.value);
        const cameraSelector = this.#shadowRoot.querySelector("#controls");
        cameraSelector.remove();
        const all = this.#shadowRoot.querySelector("DIV.fill");
        all.classList.remove("hidden");
    }


    _toggleFullScreen() {
        const all = this.#shadowRoot.querySelector("DIV.fill");
        let full;

        if (all.requestFullscreen)
            full = all.requestFullscreen(void 0);
        else if (all.webkitRequestFullscreen)
            full = all.webkitRequestFullscreen();
        else if (all.mozRequestFullScreen)
            full = all.mozRequestFullScreen();
        else if (all.msRequestFullscreen)
            full = all.msRequestFullscreen();
        else if (all.webkitEnterFullscreen)
            full = all.webkitEnterFullscreen();
        else
            console.error("Fullscreen API unavailable");

        all.onclick = () => this._trigger();
    }

    
    async _startStream(deviceId) {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: { deviceId } });
            this.#cameraStream = stream;
            const video = this.#shadowRoot.querySelector("VIDEO");
            video.srcObject = stream;
        } catch (err) {
            console.error(err);
        }
    }


    _stopStream() {
        this.#cameraStream?.getTracks().forEach((track) => track.stop());
        this.#cameraStream = undefined;
    }
    

    _trigger() {
        console.log("_trigger");
        if (this.#busy) return;

        this.#busy = true;
        this._countDown();
        setTimeout(() => this._flash(), 3000);
        setTimeout(() => this._takeStill(), 4000);
        setTimeout(() => this._finish(), 7000 + 3000);
    }


    _countDown() {
        console.log("_countDown");
        let count = 3;
        const counter = this.#shadowRoot.querySelector("#countdown");

        const step = () => {
            if (count === 0) return;

            counter.textContent = count;
            count--;
            counter.classList.add("count");
            counter.addEventListener("animationend", () => {
                counter.textContent = "";
                counter.classList.remove("count");
                setTimeout(() => step(), 0);
            }, { once: true });
        };

        step();
    }


    _flash() {
        console.log("_flash");
        const flash = this.#shadowRoot.querySelector("#flash");
        flash.classList.add("flash");
        flash.addEventListener("animationend", () => {
            flash.classList.remove("flash");
        }, { once: true });
    }


    _takeStill() {
        console.log("_takeStill");
        const video = this.#shadowRoot.querySelector("VIDEO");
        const canvas = this.#shadowRoot.querySelector("CANVAS");
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        console.log(this.#cameraStream);
        this.#cameraStream?.getTracks().forEach((track) => console.log(track));

        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0);

        var link = this.#shadowRoot.ownerDocument.createElement('A');
        link.download = `PhotoBooth_${new Date().toISOString()}.png`;
        link.href = canvas.toDataURL();
        link.click();
    }


    _finish() {
        console.log("_finish");
        this.#busy = false;
        const canvas = this.#shadowRoot.querySelector("CANVAS");
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
}



UIView.define("photo-booth", PhotoBooth, import.meta.url);
