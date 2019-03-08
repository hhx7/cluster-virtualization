import Papa from 'papaparse'
import Vue from 'vue'
import {saveAs} from 'file-saver';
import api from '../../api'
import {json2excel} from 'js2excel'
import jsPDF from 'jspdf'

Papa.SCRIPT_PATH = '../../../static/js/papaparse.js';

var FileSaver = require('file-saver');

export default {
    namespaced: true,
    state: {
        csv_file: {
            name: '',
            containHeaders: false,
            headers: [],
            data: []
        }
    },
    mutations: {
        addCsvFile(state, {name, headers, data}) {
            console.log('copy start');
            state.csv_file.name = name;
            state.csv_file.headers = headers;
            state.csv_file.data = data;
            console.log('copy complete');
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

        }
    },
    actions: {
        addCsvFile({commit, state, dispatch}, {name, content}) {

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
                        dispatch('uploadCsv', {headers: headers, data: data}, {root: true});
                    }
                }
            })
        }
    },
    getters: {
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
    }
};