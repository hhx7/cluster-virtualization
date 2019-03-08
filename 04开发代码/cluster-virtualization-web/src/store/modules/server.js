import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'

Vue.use(VueAxios, axios);

export default {
    state: {},
    mutations: {},
    actions: {
        uploadCsv: {
            root: true,
            handler(state, {headers, data}) {
                console.log(headers);
                let csv = {
                    headers: headers.map(header => header.headerName),
                    data: data.map(row => Object.keys(row).map(key => row[key]))
                };
                axios.post('http://localhost:9000/cvserver/home/uploadCsv',
                    csv)
                    .then(function (response) {
                        console.log(response);
                    })
                    .catch(function (error) {
                        console.log(error);
                    });
            }
        }
    },
    getters: {}
}