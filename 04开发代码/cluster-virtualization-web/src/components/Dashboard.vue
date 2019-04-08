<template>
    <div class="dashboard">
        <!--<UITest />-->
        <Table ref="table" id="table" v-bind:data="getCsvData" v-bind:col-headers="getCsvHeaders"/>
        <!--<Excel id="excel" v-bind:data="getCsv.data" v-bind:col-headers="getCsv.colHeaders"/>-->
        <div class="columns chart">
            <div class="column">
                <ScatterControlPanel v-bind:headers="getCsvHeaders"/>
                <Echarts ref="scatter" v-bind:id="echart_id1" v-bind:options="getOptions"/>
            </div>
            <div class="column">
                <HotmapControlPanel/>
                <Echarts ref="heatmap" v-bind:id="echart_id2" v-bind:options="getHeatmapOptions"/>
            </div>
            <div class="column">
                <StatsControlPanel v-bind:mode="stats_view_mode" @displayStatsView="displayStatsView"/>
                <transition name="fade">
                    <StatsAnova ref="anova" v-if="current_stats_view === stats_view_mode.anova"/>
                    <StatsCorrcoef ref="corrcoef" v-if="current_stats_view === stats_view_mode.corrcoef"/>
                </transition>
            </div>
        </div>
    </div>
</template>

<script>
    import Echarts from "./Echarts"
    import Menu from "./Menu"
    import {mapGetters, mapMutations} from 'vuex'
    import Table from './Table'
    import echarts from 'echarts'
    import ScatterControlPanel from './ScatterControlPanel'
    import HotmapControlPanel from './HotmapControlPanel'
    import UITest from './UITest'
    import StatsControlPanel from "./StatsControlPanel";
    import StatsAnova from "./StatsAnova";
    import StatsCorrcoef from "./StatsCorrcoef";

    export default {
        name: "Dashboard",
        data() {
            return {
                echart_id1: "echart_id1",
                echart_id2: "echart_id2",
                echart_id3: 'echart_id3',
                heatmap_click_blocks: [],
                scatter_graphic_points: [],
                stats_view_mode: {
                    anova: 0,
                    corrcoef: 1
                },
                current_stats_view: 0
            }
        },
        computed: {
            ...mapGetters({
                getCsv: 'table/getCsv',
                getTest: 'table/getTest',
                getCsvData: 'table/getCsvData',
                getCsvHeaders: 'table/getCsvHeaders',
                getOptions: 'scatter/getOptions',
                getScatterGraphicPoints: 'scatter/getScatterGraphicPoints',
                getScatterDataStartPosInSeries: 'scatter/getScatterDataStartPosInSeries',
                getHeatmapOptions: 'heatmap/getHeatmapOptions',
                getHeatmapClickBlocks: 'heatmap/getHeatmapClickBlocks'
            })
        },
        mounted() {
            // this.updateEchartsOptions({
            //     graphic: echarts.util.map(this.getOptions.series[0].data, function (item, dataIndex) {
            //         return {
            //             type: 'circle',
            //             position: this.$refs.scatter.myChart.convertToPixel('grid', item),
            //             shape: {
            //                 cx: 0,
            //                 cy: 0,
            //                 r: 10
            //             },
            //             invisible: false,
            //             //draggable: true,
            //             //ondrag: echarts.util.curry(this.onScatterPointDragging(this), dataIndex),
            //             onclick: echarts.util.curry(this.onScatterPointClick(this), dataIndex),
            //             // onmousemove: echarts.util.curry(showTooltip, dataIndex),
            //             // onmouseout: echarts.util.curry(hideTooltip, dataIndex),
            //             z: 100
            //         };
            //     }.bind(this))
            // });
            this.$refs.scatter.myChart.on('dblclick', this.onScatterPointDblclick);
            this.$refs.heatmap.myChart.on('click', this.onHeatmapBlockClick);
            //this.$refs.scatter.myChart.on('legendselectchanged', (params)=>{console.log(params)});
            this.heatmap_click_blocks = this.getHeatmapClickBlocks;
            this.scatter_graphic_points = this.getScatterGraphicPoints;
            // let data = [];
            // for (let i=0; i< 1000; ++i){
            //     for (let j=0; j< 1000; ++j){
            //         data.push({'A': Math.random()*10, 'B': Math.random()*100});
            //     }
            // };
            // let option = Object.freeze(this.getOptions);
            // option.dataset[0].dimensions = ['A', 'B'];
            // option.dataset[0].source = data;
            //this.$refs.scatter.myChart.setOption(option);
        },
        methods: {
            ...mapMutations('table', {
                updateCsv: 'updateCsv'
            }),
            ...mapMutations('scatter', {
                updateEchartsOptions: 'updateEchartsOptions',
                updateScatterData: 'updateScatterData',
                addScatterLinePointByData: 'addScatterLinePointByData'
            }),
            onScatterPointDragging: function (context) {
                return function (dataIndex, dx, dy) {
                    let series = context.getOptions.series;
                    series[0].data[dataIndex] = context.$refs.scatter.myChart.convertFromPixel('grid', this.position);
                    let s = series[0].data;
                    context.updateEchartsOptions(
                        {
                            series: [{id: 'a', data: s, type: 'line'}],
                            graphic: echarts.util.map(s, function (item, dataIndex) {
                                return {
                                    position: context.$refs.scatter.myChart.convertToPixel('grid', item)
                                };
                            })
                        }
                    );
                };
            },
            onHeatmapBlockClick: function (params) {
                //添加最新点击的块
                this.heatmap_click_blocks.push(params.dataIndex);
                //移除最前边的点
                if (this.heatmap_click_blocks.length >= 3) {
                    let dataIndex = this.heatmap_click_blocks.shift();
                    if (dataIndex !== undefined) {
                        this.$refs.heatmap.myChart.dispatchAction({
                            type: 'downplay',

                            // 使用 dataIndex 来定位节点。
                            dataIndex: dataIndex
                        });
                    }
                }

                //点亮最新块
                this.$refs.heatmap.myChart.dispatchAction({
                    type: 'highlight',
                    // 使用 dataIndex 来定位节点。
                    dataIndex: params.dataIndex
                });

            },
            onScatterPointClick: function (context) {
                return function (dataIndex, dx, dy) {
                    console.log("click:" + dataIndex);
                }
            },
            onScatterPointDblclick: function (params) {
                // let dataIndex = 0;
                // for (let i = this.getScatterDataStartPosInSeries; i < params.seriesIndex; ++i) {
                //     dataIndex += this.getOptions.dataset[i].source.length;
                // }
                //
                // dataIndex += params.dataIndex;
                this.$refs.table.onStartEditing(params.data.id);
                //点亮最新块
                // this.updateEchartsOptions({
                //     graphic: {
                //         type: 'circle',
                //         position: this.$refs.scatter.myChart.convertToPixel('grid', this.getOptions.series[params.seriesIndex].data[params.dataIndex]),
                //         shape: {
                //             cx: 0,
                //             cy: 0,
                //             r: 10
                //         },
                //         invisible: false,
                //         z: 100
                //     }
                // });
            },
            displayStatsView(mode) {
                this.current_stats_view = mode;
                console.log(this.current_stats_view);
            }
        },
        // watch: {
        //     getScatterGraphicPoints: function () {
        //         this.updateEchartsOptions({
        //             graphic: echarts.util.map(this.scatter_graphic_points, function (item, dataIndex) {
        //                 return{
        //                     type: 'circle',
        //                     position: this.$refs.scatter.myChart.convertToPixel('grid', item),
        //                     shape: {
        //                         cx: 0,
        //                         cy: 0,
        //                         r: 10
        //                     },
        //                     invisible: false,
        //                     z: 100
        //                 };
        //             }.bind(this))
        //         });
        //     }
        // },
        components: {
            StatsCorrcoef,
            StatsAnova,
            StatsControlPanel, Menu, Echarts, Table, ScatterControlPanel, HotmapControlPanel, UITest
        }
    }
</script>
<style>
    @import "../../static/css/bulma.min.css";
</style>
<style scoped>


    .dashboard {
        height: 100%;
    }

    .chart {
        height: 50%;
    }

    #table {
        height: 50%
    }


</style>