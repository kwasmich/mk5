export async function initIndexedDB(name, version, onupgradeneeded) {
    const promise = (resolve, reject) => {
        const request = globalThis.indexedDB.open(name, version);

        request.onupgradeneeded = onupgradeneeded;

        request.onerror = (event) => {
            console.error('onerror', event);
            reject();
        };

        request.onsuccess = (event) => {
            console.info('onsuccess', event);
            resolve(event.target.result);
        };
    };

    return new Promise(promise);
}



export async function simpleCreate(db, table, payload) {
    const promise = (resolve, reject) => {
        const transaction = db.transaction([table], "readwrite");

        transaction.oncomplete = (event) => {
            // console.info('oncomplete', event);
            resolve(payload);
        };

        transaction.onabort = (event) => {
            // console.info('onabort', event);
            reject();
        };

        transaction.onerror = (event) => {
            // console.error('onerror', event);
            reject();
        };

        const objectStore = transaction.objectStore(table);
        const request = objectStore.add(payload);

        request.onsuccess = (event) => {
            // console.log('onsuccess', event);
            payload.id = request.result;
        }
    };

    return new Promise(promise);
}



export async function simpleGetAll(db, table) {
    const promise = (resolve, reject) => {
        const transaction = db.transaction([table], "readonly");

        transaction.oncomplete = (event) => {
            // console.info('oncomplete', event, request.result);
            resolve(request.result);
        };

        transaction.onabort = (event) => {
            // console.info('onabort', event);
            reject();
        };

        transaction.onerror = (event) => {
            // console.error('onerror', event);
            reject();
        };

        const objectStore = transaction.objectStore(table);
        const request = objectStore.getAll();

        request.onsuccess = (event) => {
            // console.log('onsuccess', event);
        }
    };

    return new Promise(promise);
}



export async function simpleIndexedGetAll(db, table, index, indexValue) {
    const promise = (resolve, reject) => {
        const transaction = db.transaction([table], "readonly");

        transaction.oncomplete = (event) => {
            // console.info('oncomplete', event, request.result);
            resolve(request.result);
        };

        transaction.onabort = (event) => {
            // console.info('onabort', event);
            reject();
        };

        transaction.onerror = (event) => {
            // console.error('onerror', event);
            reject();
        };

        const objectStore = transaction.objectStore(table);
        const idx = objectStore.index(index);
        // console.log({table, index, indexValue });
        const request = idx.getAll(indexValue);

        request.onsuccess = (event) => {
            // console.log('onsuccess', event);
        }
    };

    return new Promise(promise);
}
