const message = document.getElementById('message');
const btn = document.getElementById('btn');
let subscription;
const applicationServerPublicKey = 'BIxbASaN0X-z4Xvc1912IGvP8bvwj5fbupQPRIp5E6Vqja_QM0sCakyNY8VtMUxPRHlIMkAooJf6X4MmEYLmGoI';
const privateKey = '-RZ5CK7LneN9bNbyr4W49c1vv6Ql1NQTVy3T8Wjd_xw'

btn.addEventListener('click', () => {
    fetch('https://cors-anywhere.herokuapp.com/https://web-push-codelab.glitch.me/api/send-push-msg', {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            subscription: subscription,
            data: message.value,
            applicationKeys: {
                public: applicationServerPublicKey,
                private: privateKey
            }
        })
    }).then((res) => {
        if (!res.ok) {
            alert('推送失败-not ok')
            document.getElementById('error').innerHTML = res.statusText + res.text();
        }
    }).catch(err => {
        document.getElementById('error').innerHTML = JSON.stringify(err);
    });
});

navigator.serviceWorker.getRegistration()
    .then(reg => {
        return reg.pushManager.getSubscription()
            .then((sub) => {
                subscription = JSON.parse(JSON.stringify(sub));
            });
    })