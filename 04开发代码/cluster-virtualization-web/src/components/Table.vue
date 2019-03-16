<template>
    <div>
        <div>
            <button class="button" v-on:click="onBtAdd()">Add Row</button>
            <button class="button" v-on:click="onBtRemove()">Remove Row</button>
            <div class="dropdown is-hoverable">
                <div class="dropdown-trigger">
                    <button class="button" aria-haspopup="true" aria-controls="dropdown-menu4">
                        <span>Add/Remove Feature</span>
                        <span class="icon is-small">
                            <i class="fas fa-angle-down" aria-hidden="true"></i>
                        </span>
                    </button>
                </div>
                <div class="dropdown-menu" id="dropdown-menu4" role="menu">
                    <div class="dropdown-content">
                        <div v-if="colHeaders.length">
                            <div class="dropdown-item level" v-for="header in colHeaders">
                                <div class="level-left">
                                    <input :id="header.headerName" type="checkbox" name="switchExample"
                                           class="switch is-rtl  is-thin" checked="checked"
                                           @change="updateFeature(header.headerName, $event)">
                                    <label :for="header.headerName">{{ header.headerName }}</label>
                                </div>
                                <button class="delete is-small" @click="removeFeature(header.headerName)"/>
                            </div>
                        </div>
                        <hr class="dropdown-divider">
                        <input placeholder="add new feature" class="input" @keyup.enter="addFeature($event)">
                    </div>
                </div>
            </div>
            <button class="button" @click="exportToCSV()">CSV</button>
            <button class="button" @click="exportToExcel()">Excel</button>
            <button class="button" @click="exportToPDF()">PDF</button>
        </div>
        <ag-grid-vue ref="table" style="width: 100%; height: 200px;"
                     class="ag-theme-balham"
                     :columnDefs="getHeaders"
                     :gridOptions="gridOptions"
                     :rowSelection="rowSelection"
                     :rowModelType="rowModelType"
                     :infiniteInitialRowCount="infiniteInitialRowCount"
                     @grid-ready="onGridReady"
                     @cell-value-changed="onCellValueChanged"
        >
        </ag-grid-vue>
    </div>

</template>

<script>
    import {AgGridVue} from "ag-grid-vue";
    import {mapActions, mapMutations} from 'vuex'
    import MyCellEditor from './MyCellEditor'

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
                        editable: true,
                        cellEditorFramework: 'MyCellEditor'
                    }
                },
                infiniteInitialRowCount: 500,
                rowModelType: 'infinite'
            }
        },
        computed: {
            getData: function () {
                return Object.freeze(
                    this.data.map(row => {
                        return row;
                    })
                )
            },
            getHeaders: function () {
                return this.colHeaders.filter(header => header.show === true);
            }
        },
        components: {
            AgGridVue, MyCellEditor
        },
        beforeMount() {
        },
        mounted() {
            this.gridApi = this.gridOptions.api;
        },
        methods: {
            ...mapMutations('table', {
                updateTableData: 'updateTableData',
                updateTableHeader: 'updateTableHeader',
                saveAsCSV: 'saveAsCSV',
                saveAsExcel: 'saveAsExcel',
                saveAsPDF: 'saveAsPDF'
            }),
            ...mapActions('table', {
                removeRow: 'removeRow',
                createRow: 'createRow',
                cellValueChanged: 'cellValueChanged',
                addTableFeature: 'addTableFeature',
                removeTableFeature: 'removeTableFeature',
                showOrHideColumn: 'showOrHideColumn'
            }),
            ...mapMutations('scatter', {
                updateScatterGraphicPointByIndex: 'updateScatterGraphicPointByIndex',
                addScatterLinePointByData: 'addScatterLinePointByData'
            }),
            updateData(data) {
                var dataSource = {
                    rowCount: null,
                    getRows: function (params) {
                        setTimeout(function () {
                            var rowsThisPage = data.slice(params.startRow, params.endRow);
                            var lastRow = -1;
                            if (data.length <= params.endRow) {
                                lastRow = data.length;
                            }
                            params.successCallback(rowsThisPage, lastRow);
                        }, 500);
                    }
                };
                this.gridApi.setDatasource(dataSource);
            },
            updateFeature(headerName, e) {
                this.showOrHideColumn({headerName: headerName, show: e.target.checked});
            },
            removeFeature(headerName) {
                this.removeTableFeature(headerName);
            },
            addFeature(e) {
                if (e.target.value !== "") {
                    this.addTableFeature(e.target.value);
                    e.target.value = "";
                }

            },
            exportToCSV() {
                this.saveAsCSV('hello');
            },
            exportToExcel() {
                this.saveAsExcel('excel');
            },
            exportToPDF() {
                this.saveAsPDF('pdf');
            },
            onGridReady(params) {
                this.updateData(this.data);
                params.api.sizeColumnsToFit();
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
            onStartEditing(dataIndex) {
                if (this.gridApi.getInfiniteRowCount() < dataIndex)
                    this.gridApi.setInfiniteRowCount(dataIndex + 1, false);
                this.gridApi.ensureIndexVisible(dataIndex);
                this.gridApi.setFocusedCell(dataIndex, this.colHeaders[0].headerName, null);
                let node = this.gridApi.getRowNode(dataIndex.toString());
                node.setSelected(true);
                // this.gridApi.startEditingCell({
                //     rowIndex: 0,
                //     colKey: "lastName",
                //     rowPinned: pinned,
                //     keyPress: key,
                //     charPress: char
                // });
            },
            onCellValueChanged(params) {
                this.updateScatterGraphicPointByIndex(params.rowIndex);
                this.cellValueChanged({rowIndex: params.rowIndex, colId: params.column.colId, value: params.value});
            }
        },
        watch: {
            data: function () {
                this.updateData(this.data);
            }
        }
    }
</script>

<style lang="scss">
    @import "../../node_modules/ag-grid-community/dist/styles/ag-grid.css";
    @import "../../node_modules/ag-grid-community/dist/styles/ag-theme-balham.css";


</style>

<style>
    @import "../../node_modules/bulma-extensions/bulma-switch/dist/css/bulma-switch.min.css";
</style>