export default {
    namespaced: true,
    state: {
        anova_res: {
            d1: 0,
            d2: 0,
            f: 0,
            p: 0,
            w2: 0
        }
    },
    mutations: {
        setAnovaResult(state, data) {
            state.anova_res = data;
        }
    },
    actions: {},
    getters: {
        getAnovaResult: state => {
            let headers = ["A", "B"];
            let body = [
                ['F(' + state.anova_res.d1 + ',' + state.anova_res.d2 + ')', state.anova_res.f],
                ['p', state.anova_res.p],
                ['Effect size(w2)', state.anova_res.w2]
            ];
            return {headers: headers, body: body};
        }
    }
};