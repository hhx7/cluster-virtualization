import Vue from 'vue'
import Vuex from 'vuex'
import file from './modules/file'
import scatter from './modules/scatter'

Vue.use(Vuex);

export default new Vuex.Store({
    modules: {
        file,
        scatter
    }
})
