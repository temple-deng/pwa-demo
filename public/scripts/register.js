const applicationServerPublicKey = 'BIxbASaN0X-z4Xvc1912IGvP8bvwj5fbupQPRIp5E6Vqja_QM0sCakyNY8VtMUxPRHlIMkAooJf6X4MmEYLmGoI';

const subscribeOptions = {
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(
        'BEl62iUYgUivxIkv69yViEuiBIa-Ib9-SkvMeAtA3LFgDzkrxZJjSgSnfckjBJuBkr3qBUYIHBQFLXYp5Nksh8U'
    )
};

function urlB64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/\-/g, '+')
        .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}


if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('../sw.js')
            .then((reg) => {
                console.log('Service worker registered.', reg);

                return reg.pushManager.getSubscription()
                    .then((subscription) => {
                        if (!subscription) {
                            console.log('Preparing to subscribe user')
                            // return reg.pushManager.subscribe()
                        } else {
                            console.log('User is subscribed');
                        }
                    })
            })
            .catch((err) => {
                console.error('Service worker register fail', err);
            });
    })
}