import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import api from '../../api'

Vue.use(VueAxios, axios);
axios.defaults.withCredentials = true;
export default {
    namespace: true,
    state: {
        URL_ROOT: 'http://localhost:9000/cvserver'
    },
    mutations: {},
    actions: {
        uploadCsv: {
            root: true,
            handler({state}, {headers, data}) {
                let csv = {
                    headers: headers.map(header => header.headerName),
                    data: data.map(row => {
                        return {row: Object.keys(row).map(key => row[key])}
                    })
                };
                axios.post(state.URL_ROOT + '/home/uploadCsv',
                    csv)
                    .then(function (response) {

                    })
                    .catch(function (error) {
                        console.log(error);
                    });
            }
        },
        createRow: {
            root: true,
            handler({state}, {index, row}) {
                axios.post(state.URL_ROOT + '/table/createRow', {index: index, row: api.getObjectValue(row)}).then(
                    function (response) {

                    }
                ).catch(function (error) {
                    console.log(error);
                });
            }
        },
        removeRow: {
            root: true,
            handler({state}, {start, amount}) {
                axios.post(state.URL_ROOT + '/table/removeRow', {start: start, amount: amount}).then(
                    function (response) {

                    }
                ).catch(function (error) {
                    console.log(error);
                });
            }
        },
        cellValueChanged: {
            root: true,
            handler({state}, {rowIndex, colId, value}) {
                axios.post(state.URL_ROOT + '/table/cellValueChanged', {
                    rowIndex: rowIndex,
                    colId: colId,
                    value: value
                }).then(
                    function (response) {

                    }
                ).catch(function (error) {
                    console.log(error);
                });
            }
        },
        removeColumn: {
            root: true,
            handler({state}, {colId}) {
                axios.post(state.URL_ROOT + '/table/removeColumn', {colId: colId}).then(
                    function (response) {

                    }
                ).catch(function (error) {
                    console.log(error);
                });
            }
        },
        addColumn: {
            root: true,
            handler({state}, colId) {
                axios.post(state.URL_ROOT + '/table/addColumn', {colId: colId}).then(
                    function (response) {

                    }
                ).catch(function (error) {
                    console.log(error);
                });
            }
        },
        showOrHideColumn: {
            root: true,
            handler({state}, {headerName, show}) {
                axios.post(state.URL_ROOT + '/table/showOrHideColumn', {colId: headerName, show: show}).then(
                    function (response) {

                    }
                ).catch(function (error) {
                    console.log(error);
                });
            }
        },
        pca: {
            root: true,
            handler({state, dispatch}) {
                axios.post(state.URL_ROOT + '/home/pca').then(
                    function (response) {
                        dispatch('scatter/redisplayPCAData', {data: response.data.res});
                    }
                ).catch(function (error) {
                    console.log(error);
                });
            }
        },
        mds: {
            root: true,
            handler({state, dispatch}) {
                axios.post(state.URL_ROOT + '/home/mds').then(
                    function (response) {
                        dispatch('scatter/redisplayMDSData', {data: response.data.res});
                    }
                ).catch(function (error) {
                    console.log(error);
                });
            }

        },
        kmeans: {
            root: true,
            handler({state, dispatch}, max_cluster) {
                axios.post(state.URL_ROOT + '/home/kmeans', {maxCluster: max_cluster}).then(
                    function (response) {
                        dispatch('heatmap/redisplayKMeansData', {data: response.data.res});
                    }
                ).catch(function (error) {
                    console.log(error);
                });
            }
        }
    },
    getters: {}
}