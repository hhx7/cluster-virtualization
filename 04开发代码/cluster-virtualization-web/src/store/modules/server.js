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
                let nheaders = headers.map(header => header.headerName);
                let csv = {
                    headers: nheaders,
                    rows: data.map(row => {
                        let data = [];
                        nheaders.forEach((v, i) => {
                            data[i] = row[v];
                        });
                        return {id: row.id, data: data};
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
            handler({state}, {index, row, headers}) {
                let data = [];
                headers.forEach((v, i) => {
                    data[i] = row[v];
                });
                axios.post(state.URL_ROOT + '/table/createRow', {id: row.id, data: data}).then(
                    function (response) {

                    }
                ).catch(function (error) {
                    console.log(error);
                });
            }
        },
        removeRow: {
            root: true,
            handler({state}, {id}) {
                axios.post(state.URL_ROOT + '/table/removeRow', {id: id}).then(
                    function (response) {

                    }
                ).catch(function (error) {
                    console.log(error);
                });
            }
        },
        cellValueChanged: {
            root: true,
            handler({state}, {id, colId, value}) {
                axios.post(state.URL_ROOT + '/table/cellValueChanged', {
                    id: id,
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
            handler({state}, {colId}) {
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
            handler({state}, {colId, show}) {
                axios.post(state.URL_ROOT + '/table/showOrHideColumn', {colId: colId, show: show}).then(
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
                        let data = api.serverDataToClientData(response.data.pca);

                        dispatch('scatter/redisplayPCAData', data);
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
                        let data = api.serverDataToClientData(response.data.mds);
                        dispatch('scatter/redisplayMDSData', data);
                    }
                ).catch(function (error) {
                    console.log(error);
                });
            }
        },
        kmeans: {
            root: true,
            handler({state, dispatch, commit}, max_cluster) {
                axios.post(state.URL_ROOT + '/home/kmeans', {maxCluster: max_cluster}).then(
                    function (response) {
                        dispatch('heatmap/redisplayKMeansData', {
                            centroids: response.data.centroids,
                            headers: response.data.headers
                        });
                        commit('table/setIdx', {idx: response.data.idx});
                        dispatch('scatter/cluster');
                    }
                ).catch(function (error) {
                    console.log(error);
                });
            }
        },
        anova: {
            root: true,
            handler({state, commit}, {x1id, x2id, colId}) {
                axios.post(state.URL_ROOT + '/home/anova', {x1id: x1id, x2id: x2id, colId: colId}).then(
                    function (response) {
                        commit('anova/setAnovaResult', response.data)
                        // dispatch('heatmap/redisplayKMeansData', {data: response.data.centroids});
                        // dispatch('scatter/cluster', {idx: response.data.idx});
                    }
                ).catch(function (error) {
                    console.log(error);
                });
            }
        },
        corrcoef: {
            root: true,
            handler({state, dispatch}) {
                axios.get(state.URL_ROOT + '/table/corrcoef').then(
                    function (response) {
                        dispatch('corrcoef/displayCorrcoef', {corrcoef: response.data.corrcoef});
                        // dispatch('scatter/cluster', {idx: response.data.idx});
                    }
                ).catch(function (error) {
                    console.log(error);
                });
            }
        }
    },
    getters: {}
}