import Papa from 'papaparse'
import Vue from 'vue'
import scatter from "./scatter"
import Handsontable from 'handsontable'
import {saveAs} from 'file-saver';
import api from '../../api'
import {json2excel} from 'js2excel'
import jsPDF from 'jspdf'

Papa.SCRIPT_PATH = '../../../static/js/papaparse.js';

var FileSaver = require('file-saver');


const state = {
    temp: [],
    csv_file: {
        name: '',
        containHeaders: false,
        headers: [],
        data: []
    },
    scatter_data_start_pos_in_series: 1,
    scatter_options: {
        tooltip: {},
        // backgroundColor: new echarts.graphic.RadialGradient(0.3, 0.3, 0.8, [{
        //     offset: 0,
        //     color: '#f7f8fa'
        // }, {
        //     offset: 1,
        //     color: '#cdd0d5'
        // }]),
        title: {
                text: '1990 与 2015 年各国家人均寿命与 GDP'
        },
        legend: {
            right: 10,
            height: 320,
            width: 480,
            data: ['1990', '2015']
        },
        grid: {},
        xAxis: {
            show: false,
            // splitLine: {
            //     lineStyle: {
            //         type: 'dashed'
            //     }
            // }

            type: 'value',
            axisLine: {onZero: false}
        },
        yAxis: {
            show: false,
            // splitLine: {
            //     lineStyle: {
            //         type: 'dashed'
            //     }
            // },
            // scale: true

            type: 'value',
            axisLine: {onZero: false}
        },
        series: [{
            id: "line",
            type: 'line',
            smooth: true,
            animation: true,
            symbolSize: 15,
            data: []
        }, {
            id: 'a',
            data: [[15, 0], [-50, 10], [-56.5, 20], [-46.5, 30], [-22.1, 40]], //,[43294,81.7,35939927,'Canada',2015],[13334,76.9,1376048943,'China',2015],[21291,78.5,11389562,'Cuba',2015],[38923,80.8,5503457,'Finland',2015],[37599,81.9,64395345,'France',2015],[44053,81.1,80688545,'Germany',2015],[42182,82.8,329425,'Iceland',2015],[5903,66.8,1311050527,'India',2015],[36162,83.5,126573481,'Japan',2015],[1390,71.4,25155317,'North Korea',2015],[34644,80.7,50293439,'South Korea',2015],[34186,80.6,4528526,'New Zealand',2015],[64304,81.6,5210967,'Norway',2015],[24787,77.3,38611794,'Poland',2015],[23038,73.13,143456918,'Russia',2015],[19360,76.5,78665830,'Turkey',2015],[38225,81.4,64715810,'United Kingdom',2015],[53354,79.1,321773631,'United States',2015]
            type: 'scatter',
            symbolSize: 10,
            smooth: true,
            // symbolSize: function (data) {
            //     return Math.sqrt(data[2]) / 5e2;
            // },
            label: {

                emphasis: {
                    show: true,
                    formatter: function (param) {
                        return param.data[3];
                    },
                    position: 'top'
                }
            },
            itemStyle: {
                normal: {
                    // shadowBlur: 10,
                    // shadowColor: 'rgba(25, 100, 150, 0.5)',
                    // shadowOffsetY: 5,
                    color: 'rgb(129, 227, 238)'
                    // new echarts.graphic.RadialGradient(0.4, 0.3, 1, [{
                    //     offset: 0,
                    //     color: 'rgb(129, 227, 238)'
                    // }, {
                    //     offset: 1,
                    //     color: 'rgb(25, 183, 207)'
                    // }])
                }
            }
            // ,
            // markLine: {
            //     animation: true,
            //     lineStyle: {
            //         normal: {
            //             type: 'solid'
            //         }
            //     },
            //     data: [
            //         [{coord: [15, 0], symbol: 'none'}, {coord: [-50, 10],  symbol: 'none'}],
            //         [{coord: [-50, 10], symbol: 'none'},{coord: [-56.5, 20], symbol: 'none'}]
            //     ]
            // }
        }]
    },
    scatter_graphic_points: [],
    test: {},
    zz: 'zz'
};

const mutations = {
    addCsvFile(state, {name, headers, data}) {
        console.log('copy start');
        state.csv_file.name = name;
        state.csv_file.headers = headers;
        state.csv_file.data = data;
        console.log('copy complete');
    },
    addCsvRows(state, {data}) {

        if (state.csv_file.data.length === 0) {
            state.csv_file.data = data;
            return;
        }

        data.forEach((v, i) => {
            if (!(v.length === 1 && v[0] === null)) { // [null]
                state.csv_file.data.push(v);
            }
        });
    },
    addCsvRow(state, {row}) {
        // if (state.csv_file.containHeaders) {
        //     commit('addCsvFile', {name: name, headers: results.meta.fields, data: results.data});
        // } else {
        //     var len = results.data[0].length === 0 ? 5 : results.data[0].length;
        //     var data = [];
        //     if (results.data.length > 0) {
        //         data = results.data.map(function (item) {
        //             var row = [];
        //             for (var key in item) {
        //                 row.push(item[key]);
        //             }
        //             return row;
        //         })
        //     }
        //     commit('addCsvFile', {name: name, headers: api.generateHeaders(len), data: data});
        // }
        if (state.csv_file.data.length === 0) {
            state.csv_file.data = row;
        } else {
            state.csv_file.data.push(row[0]);
        }
    },
    updateCsv(state, {row, prop, newValue}) {
        // state.scatter_options.series = [ { data: nval, type: 'scatter'  } ]
        state.csv_file.data[row][prop] = newValue;
        Vue.set(state.csv_file.data, row, state.csv_file.data[row]);
    },
    updateTableData(state, rowData) {
        state.csv_file.data = rowData;
    },
    updateTableHeader(state, {headerName, checked}) {
        for (var i in state.csv_file.headers) {
            if (state.csv_file.headers[i].headerName === headerName) {
                state.csv_file.headers[i].show = checked;
                Vue.set(state.csv_file.headers, i, state.csv_file.headers[i]);
                break;
            }
        }
    },
    removeTableFeature(state, headerName) {
        // remove header
        for (var i in state.csv_file.headers) {
            if (state.csv_file.headers[i].headerName === headerName) {
                state.csv_file.headers.splice(i, 1);
                break;
            }
        }
        // delete data
        state.csv_file.data.forEach((value, i) => {
            Vue.delete(value, headerName);
        });
    },
    addTableFeature(state, headerName) {
        state.csv_file.headers.push({
            headerName: headerName,
            field: headerName,
            sortable: true,
            filter: true,
            show: true
        });
    },
    saveAsCSV(state, path) {
        var items = state.csv_file.data;
        const replacer = (key, value) => value === null ? '' : value;
        const header = state.csv_file.headers.map(item => item.headerName);
        let csv = items.map(row => header.map(headerName => JSON.stringify(row[headerName], replacer)).join(','));
        csv.unshift(header.join(','));
        let str = csv.join('\r\n');
        var blob = new Blob([str], {type: "text/csv;charset=utf-8"});
        FileSaver.saveAs(blob, "hello world.csv");
    },
    saveAsExcel(state, filename) {
        let data = state.csv_file.data;
        try {
            json2excel({
                data,
                name: 'excel',
                formatDate: 'yyyy/mm/dd'
            });
        } catch (e) {
            console.error('export error');
        }
    },
    saveAsPDF(state, filename) {
        var doc = new jsPDF();
        state.csv_file.headers.forEach((value, i) => {
            doc.text(20 + (i * 20), 10, value.headerName);
        });
        state.csv_file.data.forEach((item, i) => {
            let j = 0;
            for (let key in item) {
                let data = item[key] == null ? "" : item[key];
                doc.text(20 + j * 30, 30 + i * 20, data.toString());
                ++j;
            }
        });
        doc.save(filename);

    },
    removeRow(state, {start, amount}) {
        state.csv_file.data.splice(start, amount);
    },
    createRow(state, i) {
        var nrow = {};
        state.csv_file.headers.forEach(function (item) {
            console.log(item);
            nrow[item.field] = undefined;
        });
        state.csv_file.data.splice(i, 0, nrow);

    },
    updateEchartsOptions(state, obj) {
        state.scatter_options = {...state.scatter_options, ...obj};
        // if (state.scatter_options.hasOwnProperty(key)){
        //     state.scatter_options = { ...state.scatter_options, key: value};
        // } else
        //     Vue.set(state.scatter_options, key, value);

    },
    updateScatterData(state, dataIndex) {
        Vue.set(state.scatter_options.series[0].data, dataIndex, state.scatter_options.series[0].data[dataIndex]);
    },
    addScatterLinePointByData(state, sdata) {
        let data = JSON.parse(JSON.stringify(sdata));
        if (state.scatter_options.series[0].data.length >= 2) {
            Vue.set(state.scatter_options.series[0].data, 1, data);
        } else
            state.scatter_options.series[0].data.push(data);
    },
    clearScatterLinePointByData(state) {
        state.scatter_options.series[0].data.splice(0);
    },
    updateScatterGraphicPointByIndex(state, totalLength) {
        let seriesIndex = 0, dataIndex = 0, currentLength = 0,
            nextPartLength = state.scatter_options.series[seriesIndex].length;
        while (currentLength + nextPartLength <= totalLength) {
            currentLength += nextPartLength;
            nextPartLength = state.scatter_options.series[++seriesIndex].length;
        }

        dataIndex = totalLength - currentLength;
        state.scatter_graphic_points.push(state.scatter_options.series[seriesIndex].data[dataIndex]);
    },
    updateScatterGraphicPointByData(state, data) {
        state.scatter_graphic_points.push(data);
    },
    addRow(state, {data}) {
        state.temp.push(data[0]);
    },
    assignToData(state) {
        console.log('assignData');

        state.csv_file.data = state.temp;
        console.log(state.csv_file.data);
    },
    excelFilter(col, value) {

    },
    initData(state) {
        state.csv_file.data = Handsontable.helper.createSpreadsheetData(400000, 2);
    }

};

const actions = {
    addCsvFile({commit, state}, {name, content}) {

        Papa.parse(content, {
            header: state.csv_file.containHeaders,
            worker: true,
            dynamicTyping: true,
            // step: function (row) {
            //     //console.log(row);
            //     //commit('addRow', {data: row.data});
            //     commit('addCsvRow', { row: row.data});
            //     console.log(row);
            // },
            // complete: function () {
            //     console.log('complete');
            //     //commit('assignToData');
            // }
            // chunk: function (rows) {
            //     commit('addCsvRows', {data: rows.data});
            // }
            // complete: function (results) {
            //     console.log('read file complete');
            //     //commit('initData');
            //     if (state.csv_file.containHeaders) {
            //         var len = results.data[0].length === 0 ? 5 : results.data[0].length;
            //         var data = [];
            //         if (results.data.length > 0) {
            //             data = results.data.map(function (item) {
            //                 var row = [];
            //                 for (var key in item) {
            //                     row.push(item[key]);
            //                 }
            //                 return row;
            //             })
            //         }
            //         commit('addCsvFile', {name: name, headers: results.meta.fields, data: results.data});
            //     } else {
            //         var len = results.data[0].length === 0 ? 5 : results.data[0].length;
            //         commit('addCsvFile', {name: name, headers: api.generateHeaders(len), data: data});
            //
            //     }
            //
            // }.bind(this)
            complete: function (results) {
                console.log('read file complete');
                if (state.csv_file.containHeaders) {
                    commit('addCsvFile', {name: name, headers: results.meta.fields, data: results.data});
                } else {
                    var len = results.data[0].length === 0 ? 5 : results.data[0].length;
                    var data = [];
                    var headers = api.generateHeaders(len);
                    if (results.data.length > 0) {
                        data = results.data.map(function (item) {
                            var row = {};
                            for (var i in headers) {
                                row[headers[i]] = item[i];
                            }
                            return row;
                        })
                    }
                    headers = headers.map(function (item) {
                        return {headerName: item, field: item, sortable: true, filter: true, show: true};
                    });
                    commit('addCsvFile', {name: name, headers: headers, data: data});
                }
            }
        })
    }
};

const getters = {
    getCsv: function (state) {

        var headers = [];
        var rows = [];

        try {
            headers = state.csv_file.content.meta.fields;

            rows = state.csv_file.content.data;

        } catch (e) {

        }
        return {
            colHeaders: state.csv_file.headers,
            data: state.csv_file.data
        }
    },
    getZz: state => {
        return state.zz

    },
    getOptions: state => {
        if (state.csv_file.data.length > 0) {
            var scatter_data = state.csv_file.data.map(function (item) {
                var row = [];
                for (var key in item) {
                    row.push(item[key]);
                }
                return row;
            });
            state.scatter_options.series[1].data = scatter_data;
            state.scatter_options.title.text = state.csv_file.name;
        }
        return state.scatter_options
    },

    getScatterGraphicPoints: state => {
        return state.scatter_graphic_points;
    },
    getScatterDataStartPosInSeries: state => {
        return state.scatter_data_start_pos_in_series;
    }
};


export default {
    state,
    mutations,
    getters,
    actions
}