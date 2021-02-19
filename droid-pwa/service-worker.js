const CACHE_NAME = "cache-2020-08-04";
const CACHE_URLS = [];


function fetchHandler(event) {
    // console.log("fetch", event);

    // event.respondWith(
    //     new Response("This came from the service worker!")
    // );

    event.respondWith(
        caches.match(event.request).then(
            (response) => {
                if (response) {
                    console.info("HIT", event.request.url);
                    return response;
                } else {
                    console.error("MISS", event.request.url);
                    return fetch(event.request).then(
                        (response) => {
                            console.log(response, response && response.status, response && response.type);

                            // Check if we received a valid response
                            if (!response || response.status !== 200 || response.type !== "basic") {
                                return response;
                            }

                            // IMPORTANT: Clone the response. A response is a stream
                            // and because we want the browser to consume the response
                            // as well as the cache consuming the response, we need
                            // to clone it so we have two streams.
                            const responseToCache = response.clone();
                            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseToCache));
                            return response;
                        }
                    );
                }
            }
        )
    );
}


function downloadHandler(event) {
    console.log("download", event);
}


function installHandler(event) {
    console.log("install", event);
    event.waitUntil(
        caches.open(CACHE_NAME).then(
            (cache) => {
                console.log("Opened cache");
                return cache.addAll(CACHE_URLS);
            }
        ).then(
            () => console.log("success"),
            () => console.error("fail")
        )
    );
}


function activateHandler(event) {
    console.log("activate", event);
}


self.addEventListener("fetch", fetchHandler);
self.addEventListener("download", downloadHandler);
self.addEventListener("install", installHandler);
self.addEventListener("activate", activateHandler);
