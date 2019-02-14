<template>
    <div>
        <div>
            <button v-on:click="onBtAdd()">Add Row</button>
            <button v-on:click="onBtRemove()">Remove Row</button>
        </div>
        <ag-grid-vue ref="table" style="width: 500px; height: 200px;"
                     class="ag-theme-material"
                     :columnDefs="colHeaders"
                     @data-model-changed="dataModelChanged"
                     v-model="getData"
                     :gridOptions="gridOptions"
                     :rowSelection="rowSelection"
        >
        </ag-grid-vue>

    </div>

</template>

<script>
    import {AgGridVue} from "ag-grid-vue";
    import {mapMutations} from 'vuex'

    export default {
        name: "Table",
        props: ['data', 'colHeaders'],
        data() {
            return {
                columnDefs: null,
                rowData: null,
                gridApi: null,
                rowSelection: 'single',
                gridOptions: {
                    defaultColDef: {
                        editable: true
                    }
                }
            }
        },
        computed: {
            getData: function () {
                return Object.freeze(
                    this.data.map(row => {
                        return row;
                    })
                )
            }
        },
        components: {
            AgGridVue
        },
        beforeMount() {

        },
        mounted() {
            this.gridApi = this.gridOptions.api;
        },
        methods: {
            ...mapMutations(['updateTableData', 'removeRow', 'createRow']),
            dataModelChanged(rowData) {
                //console.log(this.data);
                //this.updateTableData(rowData);
            },
            onBtRemove() {
                var selectedRows = this.gridApi.getSelectedNodes();
                if (!selectedRows || selectedRows.length === 0) {
                    return;
                }
                var selectedRow = selectedRows[0];
                this.removeRow({start: selectedRow.rowIndex, amount: 1});
            },
            onBtAdd() {
                var selectedRows = this.gridApi.getSelectedNodes();
                if (!selectedRows || selectedRows.length === 0) {
                    this.createRow(0);
                    return;
                }

                var selectedRow = selectedRows[0];
                this.createRow(selectedRow.rowIndex);
            },
            onCellValueChanged(oldValue, newValue) {

            }
        }
    }
</script>

<style lang="scss">
    @import "../../node_modules/ag-grid-community/dist/styles/ag-grid.css";
    @import "../../node_modules/ag-grid-community/dist/styles/ag-theme-balham.css";
</style>