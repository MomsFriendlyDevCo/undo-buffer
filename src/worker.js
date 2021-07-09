addEventListener('install', e => {
    console.log('ServiceWorker.install', e);
});

addEventListener('activate', e => {
    console.log('ServiceWorker.activate', e);
});

addEventListener('message', e => {
    console.log('ServiceWorker.message', e);
});

onmessage = function (e) {
    console.log('ServiceWorker.onmessage', e)
}
