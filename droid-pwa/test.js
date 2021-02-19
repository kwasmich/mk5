// alert("test 123");

if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
        navigator.serviceWorker.register('/service-worker.js');
    });
}

window.addEventListener('beforeinstallprompt', (evt) => alert(JSON.stringify(evt)));
