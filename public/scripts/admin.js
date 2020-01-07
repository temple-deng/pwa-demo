const message = document.getElementById('message');
const btn = document.getElementById('btn');


btn.addEventListener('click', () => {
    fetch('/api/send-message', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: message.value
    }).then((res) => {
        if (!res.ok) {
            alert('推送失败')
        }
    }).catch(err => {
        alert('推送失败')
    });
});