"use strict";

class HueService {
    constructor(IP_ADDRESS, USER) {
        this.ip = IP_ADDRESS;
        this.user = USER;
        Object.seal(this);
    }


    get url() {
        return `http://${this.ip}/api/${this.user}/`;
    }


    query(TYPE, PATH, DATA) {
        const promise = (resolve, reject) => {
            let loadHandler, xhr;

            loadHandler = (EVENT) => {    
                if (EVENT.currentTarget.status === 200) {
                    const response = EVENT.currentTarget.responseText;
                    const json = JSON.parse(response);
                    resolve(json);
                } else {
                    reject(EVENT.currentTarget);
                }
            };

            xhr = new XMLHttpRequest();
            xhr.onload = loadHandler;
            xhr.open(TYPE, this.url + PATH, true);
            xhr.send(DATA);
        };

        return new Promise(promise);
    }
}


export default new HueService("kwasi-hue.local", "kwasihueremote");
