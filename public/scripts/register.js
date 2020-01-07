const applicationServerPublicKey = 'BIxbASaN0X-z4Xvc1912IGvP8bvwj5fbupQPRIp5E6Vqja_QM0sCakyNY8VtMUxPRHlIMkAooJf6X4MmEYLmGoI';

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
            .then((reg) => {
                console.log('Service worker registered.', reg);
            })
            .catch((err) => {
                console.error('Service worker register fail', err);
            })
            .then(() => {
                return navigator.serviceWorker.getRegistration()
                    .then((reg) => {
                        const promiseChain = Promise.resolve();
                        if (!('PushManager' in window)) {
                            console.log('Your server do not support web push ');
                            return promiseChain;
                        } else {
                            return reg.pushManager.getSubscription()
                                .then((subscription) => {
                                    if (subscription === null) {
                                        return subscribeUser(reg.pushManager);
                                    } else {
                                        console.log('User is subscribed');
                                        return promiseChain;
                                    }
                                })
                                .catch(err => {
                                    console.log(err);
                                });
                        }
                    })
            });
    });

    navigator.serviceWorker.addEventListener('message', () => {
        console.log('来消息了');
    });
}

function subscribeUser(pushManager) {
    const subscribeOptions = {
        userVisibleOnly: true,
        applicationServerKey: urlB64ToUint8Array(applicationServerPublicKey)
    };

    console.log('Preparing to subscribe user');
    return pushManager.subscribe(subscribeOptions)
        .then((subscription) => {
            return saveSubScriptionToServer(subscription);
        });
}

function saveSubScriptionToServer(subscription) {
    return fetch('/api/save-subscription', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(subscription)
    })
        .then((res) => {
            if (res.ok) {
                console.log('save subscription success');
            } else {
                console.log('save failed');
            }
        })
        .catch(err => {
            console.log('save failed');
        });
}

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
