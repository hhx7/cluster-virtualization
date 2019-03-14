import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'

Vue.use(VueAxios, axios);
axios.defaults.withCredentials = true;
export default {
    namespace: true,
    state: {
        URL_ROOT: 'http://localhost:9000/cvserver/home'
    },
    mutations: {},
    actions: {
        uploadCsv: {
            root: true,
            handler({state}, {headers, data}) {
                let csv = {
                    headers: headers.map(header => header.headerName),
                    data: data.map(row => Object.keys(row).map(key => row[key]))
                };
                axios.post(state.URL_ROOT + '/uploadCsv',
                    csv)
                    .then(function (response) {

                    })
                    .catch(function (error) {
                        console.log(error);
                    });
            }
        },
        pca: {
            root: true,
            handler({state, dispatch}) {
                axios.post(state.URL_ROOT + '/pca').then(
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
                axios.post(state.URL_ROOT + '/mds').then(
                    function (response) {
                        dispatch('scatter/redisplayMDSData', {data: response.data.res});
                    }
                ).catch(function (error) {
                    console.log(error);
                });
            }

        }
    },
    getters: {}
}