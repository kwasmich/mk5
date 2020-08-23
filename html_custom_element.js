function loadHTML(PATH) {
    const promise = (resolve, reject) => {
        let loadHandler, xhr;
        
        loadHandler = (EVENT) => {
            if (EVENT.currentTarget.status === 200) {
                const response = EVENT.currentTarget.responseText;
                resolve(response);
            } else {
                reject(EVENT.currentTarget);
            }
        };

        xhr = new XMLHttpRequest();
        xhr.onload = loadHandler;
        xhr.onerror = reject;
        xhr.open("GET", PATH, true);
        xhr.send();
    };
    
    return new Promise(promise);
}



const priv = Symbol("private");



export default class HTMLCustomElement extends HTMLElement {
    constructor(template, { url }) {
        super();

        console.log(template.value);

        const path = url.replace(".js", "");

        loadHTML(`${path}.html`).then((html) => {
            const temp = document.createElement("TEMPLATE");
            const domParser = new DOMParser();
            const doc = domParser.parseFromString(`<html><body>${html}</body></html>`, "text/html");
            const newElements = doc.body.childNodes;
            // const newElements = document.importNode(doc.body, true).children;
            
            const link = document.createElement("LINK");
            link.rel = "stylesheet";
            link.type = "text/css";
            link.href = `${path}.css`;
            temp.content.appendChild(link);
            
            for (const node of [...newElements]) {
                temp.content.appendChild(node);
            }

            template.value = temp;
        });
    }
}
