const applicationServerPublicKey = 'BIxbASaN0X-z4Xvc1912IGvP8bvwj5fbupQPRIp5E6Vqja_QM0sCakyNY8VtMUxPRHlIMkAooJf6X4MmEYLmGoI';

const subscribeOptions = {
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(
        applicationServerPublicKey
    )
};

function urlBase64ToUint8Array(base64String) {
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

const pushBtn = document.getElementsByClassName('push')[0];
const subscribeBtn = document.getElementsByClassName('subscribe')[0];

const textareaTitle = document.getElementsByClassName('textarea-title');
const message = document.getElementById('message');
const subscriptionElem = document.getElementById('subscription');

if ('serviceWorker' in navigator && 'PushManager' in window) {
    navigator.serviceWorker.register('./sw.js')
        .then((reg) => {
            return reg.pushManager.getSubscription()
                .then((subscription) => {
                    if (subscription === null) {
                        subscribeBtn.style.display = 'inline-block';
                    } else {
                        textareaTitle[0].style.display = 'block';
                        subscriptionElem.value = JSON.stringify(subscription, null, 2);
                        subscriptionElem.style.display = 'block';
                    }
                });
        })
}

subscribeBtn.addEventListener('click', () => {
    navigator.serviceWorker.register('./sw.js')
        .then((reg) => {
            return reg.pushManager.subscribe(subscribeOptions)
                .then((subscription) => {
                    subscribeBtn.style.display = 'none';
                    textareaTitle[0].style.display = 'block';
                    subscriptionElem.value = JSON.stringify(subscription, null, 2);
                    subscriptionElem.style.display = 'block';
                })
                .catch((err) => {
                    console.log(err);
                });
        })
});