const alphabets = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
export default {
    getCsvFromFile(f) {


    },
    generateHeaders(len) {

        var res = alphabets.slice(0, len);
        for (var i = 0; i < alphabets.length && res.length < len; ++i) {
            for (var j = 0; j < alphabets.length && res.length < len; ++j) {
                res.push(alphabets[i] + alphabets[j]);
            }
        }
        return res;
    },
    //颜色对象
    getRandomColor(colorNum) {
        let res = [];
        for (let i = 0; i < colorNum; ++i) {
            let r = Math.floor(Math.random() * 255);
            let g = Math.floor(Math.random() * 255);
            let b = Math.floor(Math.random() * 255);
            res.push('rgb(' + r + ',' + g + ',' + b + ')');
        }

        return res;
    },

    getObjectValue(obj) {
        return Object.keys(obj).map(key => obj[key]);
    },

    getObjectValueExcept(obj, xset) {
        if (xset === null || xset === undefined) {
            return Object.keys(obj).map(key => obj[key]);
        }
        let keys = Object.keys(obj);
        let value = [];
        keys.forEach((v, i) => {
            if (xset.indexOf(v) < 0) {
                value.push(obj[v]);
            }
        });
        return value;
    },
    countNumberLength(num) {
        // x = Number(String(num).replace(/[^0-9]/g, ''));
        // return (Math.log10((x ^ (x >> 31)) - (x >> 31)) | 0) + 1;
        return num.toString().length;
    },

    guid() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    },

    serverDataToClientData(data) {
        let headers = this.generateHeaders(data[0].data.length);
        let rows = data.map(row => {
            let nrow = {id: row.id};
            headers.forEach((v, i) => {
                nrow[v] = row.data[i];
            });
            return nrow;
        });
        return {headers: headers, rows: rows};
    }
}