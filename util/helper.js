export function loadText(PATH) {
    return fetch(PATH).then(response => response.text());
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



export function loadHTML(PATH) {
    return fetch(PATH).then(response => response.text());
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
        // xhr.setRequestHeader("Cache-Control", "no-cache"); 
        // xhr.setRequestHeader("Pragma", "no-cache"); 
        // xhr.setRequestHeader("cache-control", "no-cache, must-revalidate, post-check=0, pre-check=0");
        // xhr.setRequestHeader("cache-control", "max-age=0");
        // xhr.setRequestHeader("expires", "0");
        // xhr.setRequestHeader("expires", "Tue, 01 Jan 1980 1:00:00 GMT");
        // xhr.setRequestHeader("pragma", "no-cache");
        xhr.send();
    };
    
    return new Promise(promise);
}



// export function loadHTML(PATH) {
//     const promise = (resolve, reject) => {
//         let loadHandler, xhr;
        
//         loadHandler = (EVENT) => {
//             if (EVENT.currentTarget.status === 200) {
//                 const response = EVENT.currentTarget.responseText;
//                 resolve(response);
//             } else {
//                 reject(EVENT.currentTarget);
//             }
//         };

//         xhr = new XMLHttpRequest();
//         xhr.onload = loadHandler;
//         xhr.onerror = reject;
//         xhr.open("GET", PATH, true);
//         // xhr.setRequestHeader("Cache-Control", "no-cache"); 
//         // xhr.setRequestHeader("Pragma", "no-cache"); 
//         // xhr.setRequestHeader("cache-control", "no-cache, must-revalidate, post-check=0, pre-check=0");
//         // xhr.setRequestHeader("cache-control", "max-age=0");
//         // xhr.setRequestHeader("expires", "0");
//         // xhr.setRequestHeader("expires", "Tue, 01 Jan 1980 1:00:00 GMT");
//         // xhr.setRequestHeader("pragma", "no-cache");
//         xhr.send();
//     };
    
//     return new Promise(promise);
// }



export function loadJSON(PATH) {
    return fetch(PATH).then(response => response.json());
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
        xhr.open("GET", PATH, true);
        xhr.send();
    };

    return new Promise(promise);
}

