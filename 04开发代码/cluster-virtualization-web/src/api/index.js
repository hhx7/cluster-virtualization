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

    hsv_to_rgb(h, s, v) {
        let h_i = parseInt(h * 6);
        let f = h * 6 - h_i;
        let p = v * (1 - s);
        let q = v * (1 - f * s);
        let t = v * (1 - (1 - f) * s);
        let r = 0, g = 0, b = 0;
        if (h_i === 0) {
            r = v;
            g = t;
            b = p;
        } else if (h_i === 1) {
            r = q;
            g = v;
            b = p;
        } else if (h_i === 2) {
            r = p;
            g = v;
            b = t;
        } else if (h_i === 3) {
            r = p;
            g = q;
            b = v;
        } else if (h_i === 4) {
            r = t;
            g = p;
            b = v;
        } else if (h_i === 5) {
            r = v;
            g = p;
            b = q;
        }
        return 'rgb(' + parseInt(r * 256) + ',' + parseInt(g * 256) + ',' + parseInt(b * 256) + ')';

    },
    //颜色对象
    getRandomColor(colorNum) {
        let golden_ratio_conjugate = 0.618033988749895;
        let res = [];
        for (let i = 0; i < colorNum; ++i) {
            let h = (Math.random() + golden_ratio_conjugate) % 1;
            res.push(this.hsv_to_rgb(h, 0.5, 0.95));
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
    },

    // 归并排序(过程：从下向上)
    mergeSort(arr, index, order) {
        if (!Array.isArray(arr)) return [];
        var index = Array.isArray(index) ? index : [];
        // 对数组arr做若干次合并：数组arr的总长度为len，将它分为若干个长度为gap的子数组；
        // 将"每2个相邻的子数组" 进行合并排序。
        // len = 数组的长度，gap = 子数组的长度
        function mergeGroups(arr, len, gap) {
            // 对arr[0..len)做一趟归并排序
            // 将"每2个相邻的子数组"进行合并排序
            for (var i = 0; i + 2 * gap - 1 < len; i += gap * 2) {
                merge(arr, i, i + gap - 1, i + 2 * gap - 1);  // 归并长度为len的两个相邻子数组
            }
            // 注意：
            // 若i ≤ len - 1且i + gap - 1 ≥ len - 1时，则剩余一个子数组轮空，无须归并
            // 若i + gap - 1 < len - 1，则剩余一个子数组没有配对
            // 将该子数组合并到已排序的数组中
            if (i + gap - 1 < len - 1) {                              // 尚有两个子文件，其中后一个长度小于len - 1
                merge(arr, i, i + gap - 1, len - 1);           // 归并最后两个子数组
            }
        }

        // 核心排序过程
        function merge(arr, start, mid, end) {
            var i = start;      // 第1个有序区的索引，遍历区间是：arr数组中的[start..mid]
            var j = mid + 1;    // 第2个有序区的索引，遍历区间是：arr数组中的[mid + 1..end]
            var aTmp = [];     // 汇总2个有序区临时数组
            var kTmp = [];
            var isAsc = (order + '').toLowerCase() !== 'desc';
            /* 排序过程开始 */
            while (i <= mid && j <= end) {   // 遍历2个有序区，当该while循环终止时，2个有序区必然有1个已经遍历并排序完毕
                if ((!isAsc && arr[i] <= arr[j]) || (isAsc && arr[i] >= arr[j])) {  // 并逐个从2个有序区分别取1个数进行比较，将较小的数存到临时数组aTmp中
                    aTmp.push(arr[i]);
                    kTmp.push(index[i++]);
                } else {
                    aTmp.push(arr[j]);
                    kTmp.push(index[j++]);
                }
            }
            // 将剩余有序区的剩余元素添加到临时数组aTmp中
            while (i <= mid) {
                aTmp.push(arr[i]);
                kTmp.push(index[i++]);
            }
            while (j <= end) {
                aTmp.push(arr[j]);
                kTmp.push(index[j++]);
            }
            /*排序过程结束*/
            var len = aTmp.length, k;
            // 此时，aTmp数组是经过排序后的有序数列，然后将其重新整合到数组arr中
            for (k = 0; k < len; k++) {
                arr[start + k] = aTmp[k];
                index[start + k] = kTmp[k];
            }
        }

        // 归并排序(从下往上)
        return (function (arr) {
            // 采用自底向上的方法，对arr[0..len)进行二路归并排序
            var len = arr.length;
            if (len <= 0) return arr;
            for (var i = 1; i < len; i *= 2) {   // 共log2(len - 1)趟归并
                mergeGroups(arr, len, i);        // 有序段长度 ≥ len时终止
            }
        })(arr);
    }
}