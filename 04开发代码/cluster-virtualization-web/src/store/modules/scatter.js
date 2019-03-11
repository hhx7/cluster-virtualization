import Vue from "vue";

export default {
    namespaced: true,
    state: {
        scatter_data_start_pos_in_series: 1,
        scatter_options: {
            tooltip: {trigger: 'item'},
            // backgroundColor: new echarts.graphic.RadialGradient(0.3, 0.3, 0.8, [{
            //     offset: 0,
            //     color: '#f7f8fa'
            // }, {
            //     offset: 1,
            //     color: '#cdd0d5'
            // }]),
            toolbox: {
                show: true,
                feature: {
                    mark: {show: true},
                    dataZoom: {show: true},
                    dataView: {show: true},
                    magicType: {show: true, type: ['line', 'bar']},
                    restore: {show: true},
                    saveAsImage: {show: true}
                }
            },
            title: {
                show: false,
                text: '1990 与 2015 年各国家人均寿命与 GDP'
            },
            legend: {
                right: 10,
                height: 320,
                width: 480,
                data: ['1990', '2015']
            },
            dataZoom: [
                {
                    type: 'slider',
                    show: true,
                },
                {
                    type: 'inside',
                },
                {
                    type: 'slider',
                    show: true,
                    yAxisIndex: 0,
                    filterMode: 'empty'
                }
            ],
            grid: {},
            xAxis: {
                show: false,
                // splitLine: {
                //     lineStyle: {
                //         type: 'dashed'
                //     }
                // }

                type: 'value',
                axisLine: {onZero: false}
            },
            yAxis: {
                show: false,
                // splitLine: {
                //     lineStyle: {
                //         type: 'dashed'
                //     }
                // },
                // scale: true

                type: 'value',
                axisLine: {onZero: false}
            },
            dataset: {
                dimensions: null,
                source: [[15, 0], [-50, 10], [-56.5, 20], [-46.5, 30], [-22.1, 40]]
            },
            series: [{
                id: "line",
                type: 'line',
                smooth: true,
                animation: true,
                symbolSize: 15,
                data: []
            }, {
                id: 'a', //,[43294,81.7,35939927,'Canada',2015],[13334,76.9,1376048943,'China',2015],[21291,78.5,11389562,'Cuba',2015],[38923,80.8,5503457,'Finland',2015],[37599,81.9,64395345,'France',2015],[44053,81.1,80688545,'Germany',2015],[42182,82.8,329425,'Iceland',2015],[5903,66.8,1311050527,'India',2015],[36162,83.5,126573481,'Japan',2015],[1390,71.4,25155317,'North Korea',2015],[34644,80.7,50293439,'South Korea',2015],[34186,80.6,4528526,'New Zealand',2015],[64304,81.6,5210967,'Norway',2015],[24787,77.3,38611794,'Poland',2015],[23038,73.13,143456918,'Russia',2015],[19360,76.5,78665830,'Turkey',2015],[38225,81.4,64715810,'United Kingdom',2015],[53354,79.1,321773631,'United States',2015]
                type: 'scatter',
                symbolSize: 10,
                // label: {
                //     emphasis: {
                //         show: true,
                //         formatter: function (param) {
                //             return param.data[3];
                //         },
                //         position: 'top'
                //     }
                // },
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
                // ,
                // markLine: {
                //     animation: true,
                //     lineStyle: {
                //         normal: {
                //             type: 'solid'
                //         }
                //     },
                //     data: [
                //         [{coord: [15, 0], symbol: 'none'}, {coord: [-50, 10],  symbol: 'none'}],
                //         [{coord: [-50, 10], symbol: 'none'},{coord: [-56.5, 20], symbol: 'none'}]
                //     ]
                // }
            }]
        },
        scatter_graphic_points: [],
        pca: []
    },
    mutations: {
        displayPCAData(state) {
            if (state.pca.length > 0) {
                state.scatter_options.dataset.source = state.pca;
            }
        },
        updateEchartsOptions(state, obj) {
            state.scatter_options = {...state.scatter_options, ...obj};
            // if (state.scatter_options.hasOwnProperty(key)){
            //     state.scatter_options = { ...state.scatter_options, key: value};
            // } else
            //     Vue.set(state.scatter_options, key, value);

        },
        updateScatterData(state, dataIndex) {
            Vue.set(state.scatter_options.series[0].data, dataIndex, state.scatter_options.series[0].data[dataIndex]);
        },
        addScatterLinePointByData(state, data) {
            if (state.scatter_options.series[0].data.length >= 2) {
                Vue.set(state.scatter_options.series[0].data, 1, data);
            } else
                state.scatter_options.series[0].data.push(data);
        },
        addScatterLinePointsByArray(state, array) {
            state.scatter_options.series[0].data = array;
        },
        clearScatterLinePointByData(state) {
            state.scatter_options.series[0].data.splice(0);
        },
        updateScatterGraphicPointByIndex(state, totalLength) {
            let seriesIndex = 0, dataIndex = 0, currentLength = 0,
                nextPartLength = state.scatter_options.series[seriesIndex].length;
            while (currentLength + nextPartLength <= totalLength) {
                currentLength += nextPartLength;
                nextPartLength = state.scatter_options.series[++seriesIndex].length;
            }

            dataIndex = totalLength - currentLength;
            state.scatter_graphic_points.push(state.scatter_options.series[seriesIndex].data[dataIndex]);
        },
        updateScatterGraphicPointByData(state, data) {
            state.scatter_graphic_points.push(data);
        },
    },
    actions: {
        displayRawData({state, rootState, rootGetters}, {headers}) {


            if (rootState.table.csv_file.data.length > 0) {
                state.scatter_options.dataset.source = rootState.table.csv_file.data;
                state.scatter_options.dataset.dimensions = headers;
                //     //let colors = api.getRandomColor(state.scatter_options.series.length);
                //     // state.scatter_options.series.forEach((v, i) => {
                //     //     v.itemStyle = {
                //     //         normal: {
                //     //             color: colors[i]
                //     //         }
                //     //     };
                //     // });
            }
        },
        redisplayPCAData({state, commit}, {data}) {
            state.pca = data;
            commit('displayPCAData');
        },
    },
    getters: {
        getOptions: (state, getters, rootState, rootGetters) => {

            return state.scatter_options
        },
        getScatterGraphicPoints: state => {
            return state.scatter_graphic_points;
        },
        getScatterDataStartPosInSeries: state => {
            return state.scatter_data_start_pos_in_series;
        }
    }

};