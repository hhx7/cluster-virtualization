import Papa from 'papaparse'
import Vue from 'vue'
import scatter from "./scatter"
import Handsontable from 'handsontable'
import api from '../../api'

Papa.SCRIPT_PATH = '../../../static/js/papaparse.js';
const state = {
    temp: [],
    csv_file: {
        name: '',
        containHeaders: false,
        headers: [],
        data: []
    },
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
        xAxis: {
            splitLine: {
                lineStyle: {
                    type: 'dashed'
                }
            }
        },
        yAxis: {
            splitLine: {
                lineStyle: {
                    type: 'dashed'
                }
            },
            scale: true
        },
        series: [{
            name: '1990',
            data: [], //,[31163,77.4,27662440,'Canada',1990],[1516,68,1154605773,'China',1990],[13670,74.7,10582082,'Cuba',1990],[28599,75,4986705,'Finland',1990],[29476,77.1,56943299,'France',1990],[31476,75.4,78958237,'Germany',1990],[28666,78.1,254830,'Iceland',1990],[1777,57.7,870601776,'India',1990],[29550,79.1,122249285,'Japan',1990],[2076,67.9,20194354,'North Korea',1990],[12087,72,42972254,'South Korea',1990],[24021,75.4,3397534,'New Zealand',1990],[43296,76.8,4240375,'Norway',1990],[10088,70.8,38195258,'Poland',1990],[19349,69.6,147568552,'Russia',1990],[10670,67.3,53994605,'Turkey',1990],[26424,75.7,57110117,'United Kingdom',1990],[37062,75.4,252847810,'United States',1990]
            type: 'scatter',
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
                    // shadowColor: 'rgba(120, 36, 50, 0.5)',
                    // shadowOffsetY: 5,
                    color: 'rgb(251, 118, 123)'//new echarts.graphic.RadialGradient(0.4, 0.3, 1, [{
                    //     offset: 0,
                    //     color: 'rgb(251, 118, 123)'
                    // }, {
                    //     offset: 1,
                    //     color: 'rgb(204, 46, 72)'
                    // }])
                }
            }
        }, {
            name: '2015',
            data: [], //,[43294,81.7,35939927,'Canada',2015],[13334,76.9,1376048943,'China',2015],[21291,78.5,11389562,'Cuba',2015],[38923,80.8,5503457,'Finland',2015],[37599,81.9,64395345,'France',2015],[44053,81.1,80688545,'Germany',2015],[42182,82.8,329425,'Iceland',2015],[5903,66.8,1311050527,'India',2015],[36162,83.5,126573481,'Japan',2015],[1390,71.4,25155317,'North Korea',2015],[34644,80.7,50293439,'South Korea',2015],[34186,80.6,4528526,'New Zealand',2015],[64304,81.6,5210967,'Norway',2015],[24787,77.3,38611794,'Poland',2015],[23038,73.13,143456918,'Russia',2015],[19360,76.5,78665830,'Turkey',2015],[38225,81.4,64715810,'United Kingdom',2015],[53354,79.1,321773631,'United States',2015]
            type: 'scatter',
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
        }]
    },
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
        var scatter_data = state.csv_file.data.map(function (item) {
            var row = [];
            for (var key in item) {
                row.push(item[key]);
            }
            return row;
        });
        state.scatter_options.series = [{data: scatter_data, type: 'scatter'}];
        state.scatter_options.title.text = state.csv_file.name;
        return state.scatter_options
    }
};


export default {
    state,
    mutations,
    getters,
    actions
}