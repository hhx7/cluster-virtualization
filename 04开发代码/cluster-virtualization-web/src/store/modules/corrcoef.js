export default {
    namespaced: true,
    state: {
        histogram_options: {
            title: {
                text: '',
                subtext: ''
            },
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                data: []
            },
            toolbox: {
                show: true,
                feature: {
                    mark: {show: true},
                    dataView: {show: true, readOnly: false},
                    magicType: {show: true, type: ['line', 'bar']},
                    restore: {show: true},
                    saveAsImage: {show: true}
                }
            },
            calculable: true,
            xAxis: [
                {
                    type: 'value',
                    boundaryGap: [0, 0.01]
                }
            ],
            yAxis: [
                {
                    type: 'category',
                    data: ['巴西', '印尼', '美国', '印度', '中国', '世界人口(万)']
                }
            ],
            series: [
                {
                    type: 'bar',
                    data: [18203, 23489, 29034, 104970, 131744, 630230]
                }
            ]
        }
    },
    mutations: {
        displayCorrcoef(state, {corrcoef, features}) {
            let ydata = [];
            state.histogram_options.series[0].data = [];
            for (let i = 0; i < corrcoef.length; ++i) {
                for (let j = i; j < corrcoef[i].length; ++j) {
                    if (i !== j) {
                        ydata.push(features[i] + '-' + features[j]);
                        state.histogram_options.series[0].data.push(corrcoef[i][j]);
                    }

                }
            }
            state.histogram_options.yAxis[0].data = ydata;
        }
    },
    actions: {
        getCorrcoef({state, commit, rootState, dispatch}) {
            dispatch('corrcoef', null, {root: true});
        },
        displayCorrcoef({state, commit, rootState, dispatch}, {corrcoef}) {

            commit('displayCorrcoef', {
                corrcoef: corrcoef,
                features: rootState.table.csv_file.headers.map(header => header.headerName)
            });
        }
    },
    getters: {
        getCorrcoefOptions: state => {
            return state.histogram_options;
        }
    }
};