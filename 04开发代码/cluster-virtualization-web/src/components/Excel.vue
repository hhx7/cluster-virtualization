<template>
    <div id="hot-preview">
        <HotTable :root="root" ref="myTable" :settings="hotSettings" :data="getData"
                  :colHeaders="colHeaders"></HotTable>
    </div>
</template>

<script>
    import {HotTable} from '@handsontable/vue'
    import {mapMutations} from 'vuex'


    export default {
        name: 'excel',
        props: ['data', 'colHeaders'],
        data: function () {
            return {
                root: 'test-hot',
                trimmedRows: [],
                filterConditions: [],
                hotSettings: {
                    stretchH: 'all',
                    autoWrapRow: true,
                    maxRows: 22,
                    manualRowResize: true,
                    manualColumnResize: true,
                    rowHeaders: true,
                    manualRowMove: true,
                    manualColumnMove: true,
                    contextMenu: true,
                    filters: true,
                    dropdownMenu: true,
                    fixedRowsTop: 2,
                    fixedRowsBottom: 2,
                    fixedColumnsLeft: 3,
                    columnSorting: {
                        indicator: true
                    },
                    autoColumnSize: {
                        samplingRatio: 23
                    },
                    search: true,
                    mergeCells: true,
                    afterChange: this.updateData,
                    afterGetColHeader: this.addInput,
                    beforeOnCellMouseDown: function (event, coords) {
                        if (coords.row === -1 && event.realTarget.nodeName === 'INPUT') {
                            event.stopImmediatePropagation();
                            this.deselectCell();
                        }
                    },
                    data: this.data,
                    colHeaders: this.colHeaders,
                    trimRows: true

                }
            };
        },
        mounted() {

            //this.hot = new HandsonTable(document.getElementById('hot-preview'), this.hotSettings);
        },
        computed: {
            getData: function () {
                if (this.trimmedRows.length === 0)
                    return this.data;
                return this.trimmedRows.map((index) => {
                    return this.data[index]
                });
            }
        },
        methods: {
            ...mapMutations(['updateCsv']),
            updateData: function (changes) {
                if (changes == null)
                    return;
                changes.forEach(function ([row, prop, oldValue, newValue]) {
                    this.updateCsv(row);
                }.bind(this));
            },
            debounceFn: function () {
                this.trimmedRows = [];
                this.data.forEach(function (data_v, data_i) {
                    if (data_v.length === this.colHeaders.length) {
                        let match_success = true;
                        this.filterConditions.forEach((filter_v, filter_i) => {
                            if (filter_v !== "" && data_v[filter_i].toString().indexOf(filter_v) < 0) {
                                match_success = false;
                            }
                        });
                        if (match_success) {
                            this.trimmedRows.push(data_i);
                        }
                    }
                }.bind(this));
            },
            addEventListeners: function (input, colIndex) {
                input.addEventListener('keyup', function () {
                    //this.$refs.myTable.hotInstance.debounce(() => { this.debounceFn(colIndex, event); }, 200);
                    this.filterConditions[colIndex] = event.target.value;
                    this.debounceFn();
                }.bind(this))
            },
            getInitializedElements: function (colIndex) {
                var div = document.createElement('div');
                var input = document.createElement('input');

                div.className = 'filterHeader';

                this.addEventListeners(input, colIndex);

                div.appendChild(input);

                return div;
            },
            addInput: function (col, TH) {
                // Hooks can return value other than number (for example `columnSorting` plugin use this).
                if (typeof col !== 'number') {
                    return col;
                }

                if (col >= 0 && TH.childElementCount < 2) {
                    TH.appendChild(this.getInitializedElements(col));
                }
            }
        },
        watch: {
            colHeaders: {
                helper: function () {
                    if (this.colHeaders !== undefined && this.colHeaders.length > 0) {
                        this.filterConditions = new Array(this.colHeaders.length);
                    }
                },
                deep: true
            }
        },
        components: {
            HotTable
        }
    }
</script>

<style src="../../node_modules/handsontable/dist/handsontable.full.css">

    #hot-preview {
        width: 100%;
        height: 100%;
        overflow: hidden;
    }
</style>


