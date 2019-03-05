<template>
    <div class="dashboard columns">
        <Menu class="has-background-grey-light column is-2"/>
        <div class="column">
            <!--<UITest />-->
            <Table ref="table" id="table" v-bind:data="getCsv.data" v-bind:col-headers="getCsv.colHeaders"/>
            <!--<Excel id="excel" v-bind:data="getCsv.data" v-bind:col-headers="getCsv.colHeaders"/>-->
            <div class="columns chart">
                <div class="column">
                    <ScatterControlPanel v-bind:headers="getCsv.colHeaders"/>
                    <Echarts ref="scatter" v-bind:id="echart_id1" v-bind:options="getOptions"/>
                </div>
                <div class="column">
                    <HotmapControlPanel/>
                    <Echarts v-bind:id="echart_id2" v-bind:options="getHeatmapOptions"/>
                </div>

            </div>
        </div>
    </div>
</template>

<script>
    import Excel from "./Excel"
    import Echarts from "./Echarts"
    import Menu from "./Menu"
    import {mapGetters, mapMutations} from 'vuex'
    import Table from './Table'
    import echarts from 'echarts'
    import ScatterControlPanel from './ScatterControlPanel'
    import HotmapControlPanel from './HotmapControlPanel'
    import UITest from './UITest'

    export default {
        name: "Dashboard",
        data() {
            return {
                echart_id1: "echart_id1",
                echart_id2: "echart_id2",
                scatter_graphic_points: []
            }
        },
        computed: {
            ...mapGetters({
                getCsv: 'table/getCsv',
                getOptions: 'scatter/getOptions',
                getScatterGraphicPoints: 'scatter/getScatterGraphicPoints',
                getScatterDataStartPosInSeries: 'scatter/getScatterDataStartPosInSeries',
                getHeatmapOptions: 'heatmap/getHeatmapOptions'
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
            this.scatter_graphic_points = this.getScatterGraphicPoints;
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
            onScatterPointClick: function (context) {
                return function (dataIndex, dx, dy) {
                    console.log("click:" + dataIndex);
                }
            },
            onScatterPointDblclick: function (params) {
                let dataIndex = 0;
                for (let i = this.getScatterDataStartPosInSeries; i < params.seriesIndex; ++i) {
                    dataIndex += this.getOptions.series[i].length;
                }
                dataIndex += params.dataIndex;
                this.$refs.table.onStartEditing(dataIndex);
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
        components: {Menu, Excel, Echarts, Table, ScatterControlPanel, HotmapControlPanel, UITest}
    }
</script>

<style scoped>
    @import "../../static/css/bulma.min.css";

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