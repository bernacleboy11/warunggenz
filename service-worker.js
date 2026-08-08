const CACHE_NAME = "warung-genz-v2";

const APP_FILES = [
    "./",
    "./index.html",
    "./style.css",
    "./script.js",
    "./manifest.json",
    "./logo.png"
];


// ===============================
// INSTALL
// ===============================

self.addEventListener("install", function(event) {

    event.waitUntil(

        caches.open(CACHE_NAME)

            .then(function(cache) {

                return cache.addAll(APP_FILES);

            })

    );

    self.skipWaiting();

});


// ===============================
// AKTIFKAN SERVICE WORKER BARU
// ===============================

self.addEventListener("activate", function(event) {

    event.waitUntil(

        caches.keys().then(function(cacheNames) {

            return Promise.all(

                cacheNames

                    .filter(function(cacheName) {

                        return (

                            cacheName !== CACHE_NAME

                        );

                    })

                    .map(function(cacheName) {

                        return caches.delete(

                            cacheName

                        );

                    })

            );

        })

    );

    self.clients.claim();

});


// ===============================
// MODE OFFLINE
// ===============================

self.addEventListener("fetch", function(event) {

    event.respondWith(

        caches.match(event.request)

            .then(function(cachedResponse) {

                if (cachedResponse) {

                    return cachedResponse;

                }


                return fetch(event.request)

                    .then(function(networkResponse) {

                        return networkResponse;

                    })

                    .catch(function() {

                        return new Response(

                            "Aplikasi sedang offline",

                            {

                                status: 503,

                                headers: {

                                    "Content-Type":

                                    "text/plain"

                                }

                            }

                        );

                    });

            })

    );

});