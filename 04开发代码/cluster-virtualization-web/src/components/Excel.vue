<template>
    <div id="hot-preview">
        <HotTable :root="root" :settings="hotSettings" :data="data" :colHeaders="colHeaders"></HotTable>
    </div>
</template>

<script>
    import HotTable from 'vue-handsontable-official';
    import {mapMutations} from 'vuex'

    export default {
        name: 'excel',
        props: ['data', 'colHeaders'],
        data: function () {
            return {
                root: 'test-hot',
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
                    mergeCells: true,
                    afterChange: this.afterChange
                }
            };
        },
        methods: {
            ...mapMutations(['updateCsv']),
            afterChange: function (changes) {
                if (changes == null)
                    return;
                changes.forEach(function ([row, prop, oldValue, newValue]) {
                    this.updateCsv(row)
                }.bind(this));
            }
        },
        components: {
            HotTable
        }
    }
</script>

<style scoped src="../../node_modules/handsontable/dist/handsontable.full.min.css">

    #hot-preview {
        width: 100%;
        height: 100%;
        overflow: hidden;
    }
</style>


