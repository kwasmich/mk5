import { UIView } from "/base/ui-view.js";



const IDLE_TIMEOUT = 180000;    // 3 minutes

const SOUND_MAP = {
    begin: 53,
    capture: 20,
    countdown1: 6,
    countdown2: 8,
    countdown3: 8,
    idle: 21,
    print: 157
};

const LAST_SOUND = {
    begin: 0,
    capture: 0,
    countdown1: 0,
    countdown2: 0,
    countdown3: 0,
    idle: 0,
    print: 0
};


function getRND(name) {
    let rnd;

    do {
        rnd = 1 + Math.floor(Math.random() * SOUND_MAP[name]);
    } while (rnd === LAST_SOUND[name]);

    LAST_SOUND[name] = rnd;
    return rnd;
}



export class PhotoBooth extends UIView {
    static get observedAttributes() {
        return [];
    }


    #shadowRoot = this.attachShadow({ mode: "closed" });
    #selectElement;
    #cameraStream;
    #busy = false;
    #audioElement;
    #idleTimer;
    #isIdle = false;


    constructor(...args) {
        const self = super(args);
        this._eject = this._eject.bind(this);
        this._finish = this._finish.bind(this);
        this._startIdle = this._startIdle.bind(this);
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

        this.#audioElement = this.#shadowRoot.querySelector("AUDIO");
        this.#selectElement = this.#shadowRoot.querySelector("SELECT");
        this.#selectElement.onchange = (event) => this._onChange(event);
        const all = this.#shadowRoot.querySelector("DIV.fill");
        all.onclick = () => this._toggleFullScreen();
        // all.onclick = () => this._trigger();
        this._listCameras();
    }


    disconnectedCallback() {
        this.#selectElement.onchange = undefined;
        this.#selectElement = undefined;
        this.#audioElement = undefined;
        this._stopStream();
    }


    async _listCameras() {
        try {
            const devices = await navigator.mediaDevices.enumerateDevices();
            const deviceList = devices.filter((d) => d.kind === "videoinput");

            deviceList.forEach((d) => {
                console.info(d);
                const option = this.#shadowRoot.ownerDocument.createElement("OPTION");
                option.value = d.deviceId;
                option.text = d.label;
                this.#selectElement.append(option);
            });

            if (deviceList.length === 1) {
                this.#selectElement.value = deviceList.at(0).deviceId;
                this._onChange();
            }
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
        this._startIdleTimer();
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
        clearTimeout(this.#idleTimer);

        if (this.#isIdle) {
            this.#isIdle = false;
            const rnd = getRND("begin");
            this.#audioElement.src = `elements/photo_booth/sounds/begin/${rnd}.wav`
            this._stopIdle();
            this._startIdleTimer();
            return;
        }

        if (this.#busy) return;

        this.#busy = true;
        this._countDown();
        setTimeout(() => this._flash(), 3000);
        setTimeout(() => this._takeStill(), 4000);
        setTimeout(() => this._eject(this._finish), 7000);
    }


    _countDown() {
        console.log("_countDown");
        let count = 3;
        const counter = this.#shadowRoot.querySelector("#countdown");

        const step = () => {
            if (count === 0) return;

            counter.textContent = count;
            const rnd = getRND(`countdown${count}`);
            this.#audioElement.src = `elements/photo_booth/sounds/countdown/${count}/${rnd}.wav`
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

        const rnd = getRND("capture");
        this.#audioElement.src = `elements/photo_booth/sounds/capture/${rnd}.wav`
    }


    _takeStill() {
        console.log("_takeStill");
        const video = this.#shadowRoot.querySelector("VIDEO");
        const canvas = this.#shadowRoot.querySelector("CANVAS");
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        console.log(this.#cameraStream);
        this.#cameraStream?.getTracks().forEach((track) => console.log(track));

        const ctx = canvas.getContext("2d");
        ctx.drawImage(video, 0, 0);

        var link = this.#shadowRoot.ownerDocument.createElement("A");
        link.download = `PhotoBooth_${new Date().toISOString()}.png`;
        link.href = canvas.toDataURL();
        link.click();
    }


    _eject(next, timeout) {
        console.log("_eject");
        const canvas = this.#shadowRoot.querySelector("CANVAS");
        canvas.classList.add("eject");
        canvas.addEventListener("animationend", () => {
            canvas.classList.remove("eject");
            timeout ? setTimeout(next, timeout) : next();
        }, { once: true });

        const rnd = getRND("print");
        this.#audioElement.src = `elements/photo_booth/sounds/print/${rnd}.wav`
    }


    _finish() {
        console.log("_finish");
        this.#busy = false;
        const canvas = this.#shadowRoot.querySelector("CANVAS");
        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        this._startIdleTimer();
    }


    _startIdleTimer() {
        this.#idleTimer = setTimeout(this._startIdle, IDLE_TIMEOUT + Math.random() * IDLE_TIMEOUT);
    }


    _startIdle() {
        this.#isIdle = true;
        const rnd = getRND("idle");
        this.#audioElement.src = `elements/photo_booth/sounds/idle/${rnd}.wav`
        this._startIdleTimer();
        // start idle animation
        const video = this.#shadowRoot.querySelector("VIDEO");
        video.parentElement.classList.add("idle");
    }


    _stopIdle() {
        // stop idle animation
        const video = this.#shadowRoot.querySelector("VIDEO");
        video.parentElement.classList.remove("idle");
    }
}



UIView.define("photo-booth", PhotoBooth, import.meta.url);
