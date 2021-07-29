const request = require('request');
const express = require('express');
const app = express();

app.use(require('cors')());

const cache = {};
app.get('/lospec/palettes', (req, res) => {
    let url = 'https://lospec.com/palette-list/load?' + query2string(req.query);
    cache[url] ? res.send(cache[url]) : request.get(url, (err, res, body) => {
        try {
            cache[url] = JSON.parse(body);
        } catch(err) { }
    }).pipe(res);
});

app.use(express.static('./dist'))

app.listen(420, () => {
    console.log(`@420`);
});

function query2string(query) {
    let str = '';
    for (let key in query) {
        str += `${key}=${query[key]}&`
    }
    return str.substring(0, str.length - 1);
}
