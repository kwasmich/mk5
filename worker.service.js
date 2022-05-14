const CACHE_NAME = "cache-2020-08-04";
const CACHE_URLS = [
    "/",
    "/apple-touch-icon-120x120.png",
    "/apple-touch-icon.png",
    "/assets/bri.svg",
    "/assets/ct.svg",
    "/assets/hue.svg",
    "/assets/sat.svg",
    "/assets/xy.svg",
    "/elements/cie_picker/cie_picker.css",
    "/elements/cie_picker/cie_picker.html",
    "/elements/cie_picker/cie_picker.js",
    "/elements/hue_main/hue_main.css",
    "/elements/hue_main/hue_main.html",
    "/elements/hue_main/hue_main.js",
    "/elements/hue_setup/hue_setup.css",
    "/elements/hue_setup/hue_setup.html",
    "/elements/hue_setup/hue_setup.js",
    "/favicon.png",
    "/html_custom_element.js",
    "/hue.js",
    "/hue.service.js",
    "/hue_light.js",
    "/icon.svg",
    "/index.html",
    "/json/hue.json",
    "/json/lights.json",
    "/launch.png",
    "/main.js",
    "/style.css",
    "/util/custom_element_helper.js",
    "/util/helper.js",
    "/util/observable.js",
    "/util/security.js"
];


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

    // event.respondWith(
    //     caches.match(event.request).then((response) => {
    //         return response || event.default();
    //     }).catch(() => {
    //         return caches.match("/my-blog/fallback.html");
    //     })
    // );
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
    // const cacheWhitelist = ["static-v2"];

    // event.waitUntil(
    //     caches.keys(function (cacheNames) {
    //         return Promise.all(
    //             cacheNames.map(function (cacheName) {
    //                 if (cacheWhitelist.indexOf(cacheName) == -1) {
    //                     return caches.delete(cacheName);
    //                 }
    //             })
    //         )
    //     })
    // );
}


self.addEventListener("fetch", fetchHandler);
self.addEventListener("download", downloadHandler);
self.addEventListener("install", installHandler);
self.addEventListener("activate", activateHandler);
