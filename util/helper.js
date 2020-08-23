export function loadHTML(PATH) {
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



export function loadJSON(URL) {
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
        xhr.onerror = reject;
        xhr.open("GET", URL, true);
        xhr.send();
    };

    return new Promise(promise);
}

