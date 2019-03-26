import Vue from "vue";
import api from '../../api'


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
                type: 'value',
                scale: true,
                axisLine: {onZero: false}
            },
            yAxis: {
                show: false,
                // splitLine: {
                //     lineStyle: {
                //         type: 'dashed'
                //     }
                // },
                scale: true,

                type: 'value',
                axisLine: {onZero: false}
            },
            dataset: [{
                source: []
            }, {
                dimensions: null,
                source: [[15, 0.12], [15, 0.1234], [15, 0.123456], [15, 0.11111], [15, 0.121212]]
            }],
            series: [{
                id: "line",
                type: 'line',
                smooth: true,
                animation: true,
                symbolSize: 15,
                datasetIndex: 0
            }, {
                type: 'scatter',
                symbolSize: 10,
                datasetIndex: 1,
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
        pca: {dataset: [], series: []},
        mds: {dataset: [], series: []},
        rawData: {dataset: [], series: []},
        idx: {},
        dimensions: [],
        currentData: [],
        mode: {
            rawData: 0,
            pca: 1,
            mds: 2
        },
        currentMode: 0
    },
    mutations: {
        displayData(state) {
            let idx = state.idx;
            let data = state.currentData;
            let dimensions = state.dimensions;
            let dataset = [];
            let series = [];
            if (data.length > 0) {
                if (Object.keys(idx).length > 0) {
                    data.forEach((v, i) => {
                        let cluster = idx[v.id];
                        if (dataset[cluster] === undefined) {
                            dataset[cluster] = {dimensions: dimensions, source: []};
                            series.push({
                                type: 'scatter',
                                symbolSize: 10,
                                datasetIndex: series.length + 1,//series和dataset从下标1开始
                                itemStyle: {
                                    normal: {
                                        color: api.getRandomColor(1)
                                    }
                                }
                            });
                        }
                        dataset[cluster].source.push(v);
                    });
                } else {
                    dataset.push({dimensions: dimensions, source: data});
                    series.push({
                        type: 'scatter',
                        symbolSize: 10,
                        datasetIndex: 1,
                        itemStyle: {
                            normal: {
                                color: api.getRandomColor(1)
                            }
                        }
                    });
                }
                state.scatter_options.dataset = state.scatter_options.dataset.concat(dataset);
                state.scatter_options.series = state.scatter_options.series.concat(series);
            }

        },
        displayRawData(state) {
            if (state.rawData.dataset.length > 0 && state.rawData.series.length > 0) {
                state.scatter_options.dataset = state.rawData.dataset;
                state.scatter_options.series = state.rawData.series;
                state.currentMode = state.mode.rawData;
            }
        },
        displayPCAData(state) {
            if (state.pca.dataset.length > 0 && state.pca.series.length > 0) {
                state.scatter_options.dataset = state.pca.dataset;
                state.scatter_options.series = state.pca.series;
                state.currentMode = state.mode.pca;
            }
        },
        displayMDSData(state) {
            if (state.mds.dataset.length > 0 && state.mds.series.length > 0) {
                state.scatter_options.dataset = state.mds.dataset;
                state.scatter_options.series = state.mds.series;
                state.currentMode = state.mode.mds;
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
            Vue.set(state.scatter_options.dataset[0].source, dataIndex, state.scatter_options.dataset[0].source[dataIndex]);
        },
        addScatterLinePointByData(state, data) {
            if (state.scatter_options.dataset[0].source.length >= 2) {
                Vue.set(state.scatter_options.dataset[0].source, 1, data);
            } else
                state.scatter_options.dataset[0].source.push(data);
        },

        clearScatterLinePoint(state) {
            state.scatter_options.dataset[0].source.splice(0);
        },
        addScatterLinePointByIndex(state, totalLength) {
            // let seriesIndex = 0, dataIndex = 0, currentLength = 0,
            //     nextPartLength = state.scatter_options.series[seriesIndex].length;
            // while (currentLength + nextPartLength <= totalLength) {
            //     currentLength += nextPartLength;
            //     nextPartLength = state.scatter_options.series[++seriesIndex].length;
            // }
            //
            // dataIndex = totalLength - currentLength;
            state.scatter_options.dataset[0].source.push(state.scatter_options.dataset[1].source[totalLength]);
        },
        updateScatterGraphicPointByData(state, data) {
            state.scatter_graphic_points.push(data);
        },
        clearScatter(state) {
            state.scatter_options.dataset[0].source = [];
            state.scatter_options.dataset[0].dimensions = [];
            state.scatter_options.dataset.splice(1);
            state.scatter_options.series.splice(1);
        }
    },
    actions: {
        displayRawData({state, rootState, rootGetters, commit}, {headers}) {
            if (rootState.table.csv_file.data.length > 0) {
                commit('clearScatter');
                state.dimensions = headers;
                state.currentData = rootState.table.csv_file.data;
                commit('displayData');
                state.rawData.dataset = state.scatter_options.dataset;
                state.rawData.series = state.scatter_options.series;
                state.currentMode = state.mode.rawData;
            }
        },
        redisplayPCAData({state, commit}, {headers, rows}) {
            commit('clearScatter');
            state.dimensions = headers;
            state.currentData = rows;
            commit('displayData');
            state.pca.dataset = state.scatter_options.dataset;
            state.pca.series = state.scatter_options.series;
            state.currentMode = state.mode.pca;
        },
        redisplayMDSData({state, commit}, {headers, rows}) {
            commit('clearScatter');
            state.dimensions = headers;
            state.currentData = rows;
            commit('displayData');
            state.mds.dataset = state.scatter_options.dataset;
            state.mds.series = state.scatter_options.series;
            state.currentMode = state.mode.mds;
        },
        cluster({state, commit, rootState}) {
            state.idx = rootState.table.csv_file.idx;
            commit('clearScatter');
            commit('displayData');
        },
        fppcaAddScatterLinePoints({state}, {data}) {
            state.scatter_options.dataset[0].source = data;
        },
        addScatterLinePoints({state, rootState, dispatch}, {current_node_id, data}) {
            let currentData = rootState.table.csv_file.data.filter(v => v.id === current_node_id);
            state.scatter_options.dataset[0].dimensions = state.dimensions;
            data.unshift(currentData[0]);
            switch (state.currentMode) {
                case state.mode.rawData:
                    state.scatter_options.dataset[0].source = data;
                    break;
                case state.mode.pca:
                    dispatch('fppca', {x: data, headers: state.dimensions, id: current_node_id}, {root: true});
                    break;
                case state.mode.mds:
                    break;
            }
        }
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
        },
        getDataset: state => {
            return state.scatter_options.dataset.source;
        }
    }

};