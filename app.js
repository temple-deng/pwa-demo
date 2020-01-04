const express = require('express');
const fetch = require('node-fetch');
const app = express();
const fs = require('fs');
const https = require('https');
// const http = require()
const redirectToHTTPS = require('express-http-to-https').redirectToHTTPS;
const port = 3000;

const FORECAST_DELAY = 0;
const API_KEY = '0451d9104216d2a350a2d39ea16a6115';
const BASE_URL = `https://api.darksky.net/forecast`;


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

// Logging for each request
app.use((req, resp, next) => {
    const now = new Date();
    const time = `${now.toLocaleDateString()} - ${now.toLocaleTimeString()}`;
    const path = `"${req.method} ${req.path}"`;
    const m = `${req.ip} - ${time} - ${path}`;
    // eslint-disable-next-line no-console
    console.log(m);
    next();
});

// app.use(redirectToHTTPS([/localhost:(\d{4})/], [], 301));
app.get('/forecast/:location', getForecast);
app.get('/forecast/', getForecast);
app.get('/forecast', getForecast);

app.use(express.static('./public'));
app.listen(port, () => {
    console.log(`The https server listened on port ${port}`);
})

// https.createServer({
//     key: fs.readFileSync('./cert/server.key'),
//     cert: fs.readFileSync('./cert/server.cert')
// }, app)
// .listen(port, () => {
//     console.log(`The https server listened on port ${port}`);
// });

module.exports = app;