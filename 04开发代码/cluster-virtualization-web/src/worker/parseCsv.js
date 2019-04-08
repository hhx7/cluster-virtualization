import api from '../api'

self.addEventListener('message', function (e) {
    let headers = e.headers;
    let data = e.data;
    let rows = data.map((row) => {
        let nrow = {};
        nrow['id'] = api.guid();
        for (let j in headers) {
            nrow[headers[j]] = row[j];
        }
        return nrow;
    });
    self.postMessage(rows);
    self.close();
}, false);