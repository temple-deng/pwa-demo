const express = require('express');
const fetch = require('node-fetch');
const app = express();
const fs = require('fs');
const https = require('https');
// const http = require()
const redirectToHTTPS = require('express-http-to-https').redirectToHTTPS;
const port = 3000;

const webpush = require('web-push');
const bodyParser = require('body-parser');
const FORECAST_DELAY = 0;
const API_KEY = '0451d9104216d2a350a2d39ea16a6115';
const BASE_URL = `https://api.darksky.net/forecast`;
const Datastore = require('nedb');
const db = new Datastore({
    filename: __dirname + '/subscribeInfo',
    autoload: true
});

const vapidKeys = {
    publicKey:
    'BIxbASaN0X-z4Xvc1912IGvP8bvwj5fbupQPRIp5E6Vqja_QM0sCakyNY8VtMUxPRHlIMkAooJf6X4MmEYLmGoI',
    privateKey: '-RZ5CK7LneN9bNbyr4W49c1vv6Ql1NQTVy3T8Wjd_xw'
};

webpush.setVapidDetails(
    'mailto:630435132@@qq.com',
    vapidKeys.publicKey,
    vapidKeys.privateKey
);

function getForecast(req, resp) {
    const location = req.params.location || '40.051913, 116.301019';
    const url = `${BASE_URL}/${API_KEY}/${location}`;
    fetch(url).then((resp) => {
        if (resp.status !== 200) {
            throw new Error(resp.statusText);
        }
        return resp.json();
    }).then((data) => {
        setTimeout(() => {
            resp.json(data);
        }, FORECAST_DELAY);
    }).catch((err) => {
        console.error('Dark Sky API Error:', err.message);
        resp.send('Error');
    });
}

app.use((req, resp, next) => {
    const now = new Date();
    const time = `${now.toLocaleDateString()} - ${now.toLocaleTimeString()}`;
    const path = `"${req.method} ${req.path}"`;
    const m = `${req.ip} - ${time} - ${path}`;
    console.log(m);
    next();
});

app.use(bodyParser.json());

// app.use(redirectToHTTPS([/localhost:(\d{4})/], [], 301));
app.get('/forecast/:location', getForecast);
app.get('/forecast/', getForecast);
app.get('/forecast', getForecast);

app.post('/api/save-subscription', (req, res) => {
    return saveSubscriptionToDatabase(req.body)
        .then((subscriptionId) => {
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify({ data: { success: true } }));
        })
        .catch((err) => {
            console.log(err);
            res.status(500);
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify({
                error: {
                    id: 'unable-to-save-subscription',
                    message: 'The subscription was received but we were unable to save it to our database.'
                }
            }));
        });
})

app.post('/api/send-message', (req, res) => {
    return sendMessageToUser(req.body)
        .then(() => {
            res.send('ok');
        })
        .catch(err => {
            console.log(err);
            res.status(500);
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify({
                error: {
                    message: 'There is a error occur'
                }
            }));
        })
});

app.use(express.static('./public'));
app.listen(port, () => {
    console.log(`The https server listened on port ${port}`);
})

function saveSubscriptionToDatabase(subscription) {
    return new Promise(function (resolve, reject) {
        db.insert(subscription, function (err, newDoc) {
            if (err) {
                reject(err);
                return;
            }

            resolve(newDoc._id);
        });
    });
};

function sendMessageToUser(data) {
    return new Promise((resolve, reject) => {
        db.find({}, (err, docs) => {
            if (err) {
                reject(err);
                return
            }

            console.log(docs);
            const promises = [];
            docs.forEach((doc) => {
                promises.push(new Promise((re, rej) => {
                    fetch('https://web-push-codelab.glitch.me/api/send-push-msg', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            subscription: {
                                endpoint: doc.endpoint,
                                keys: doc.keys
                            },
                            data: "hhhhhhh",
                            applicationKeys: {
                                public: vapidKeys.publicKey,
                                private: vapidKeys.privateKey
                            }
                        })
                    }).then(re, (err) => {
                        console.log(err);
                        rej(err);
                    })
                }));

                Promise.all(promises).then(resolve).catch(reject);
            });
        });
    });
}

module.exports = app;

// https.createServer({
//     key: fs.readFileSync('./keys/server.key'),
//     cert: fs.readFileSync('./keys/server.cert')
// }, app)
// .listen(port, () => {
//     console.log(`The https server listened on port ${port}`);
// });
