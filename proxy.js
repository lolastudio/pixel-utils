const request = require('request');
const express = require('express');
const app = express();

app.use(require('cors')());

const cache = {};
app.get('/lospec/palettes', (req, res) => {
    let url = 'https://lospec.com/palette-list/load?' + query2string(req.query);
    cache[url] ? res.send(cache[url]) : request.get(url, (err, res, body) => {
        cache[url] = JSON.parse(body);
    }).pipe(res);
});

app.listen(80, () => {
    console.log(`@80`);
});

function query2string(query) {
    let str = '';
    for (let key in query) {
        str += `${key}=${query[key]}&`
    }
    return str.substring(0, str.length - 1);
}
