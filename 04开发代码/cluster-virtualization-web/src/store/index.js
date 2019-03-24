import Vue from 'vue'
import Vuex from 'vuex'
import server from './modules/server'
import scatter from './modules/scatter'
import table from './modules/table'
import heatmap from './modules/heatmap'
import corrcoef from "./modules/corrcoef";
import anova from "./modules/anova"

Vue.use(Vuex);

export default new Vuex.Store({
    modules: {
        //file: file,
        server: server,
        scatter: scatter,
        table: table,
        heatmap: heatmap,
        corrcoef: corrcoef,
        anova: anova
    }
})
