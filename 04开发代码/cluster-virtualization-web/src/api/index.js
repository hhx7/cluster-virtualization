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
    }
}