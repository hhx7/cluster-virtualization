<template>
    <div class="control-panel">
        <div class="level">
            <div class="level-left">
                <div class="select is-rounded is-small">
                    <label>
                        <select v-model="selected">
                            <option :value="raw_data">Raw Data</option>
                            <option :value="pca">PCA</option>
                            <option :value="mda">MDA</option>
                        </select>
                    </label>
                </div>
            </div>
            <div class="level-item" v-if="is_raw_data_selected">
                <div class="level-left">
                    <div class="select is-rounded is-small">
                        <label>
                            <select v-model="x_option">
                                <option v-for="header in headers"> {{ header.headerName }}</option>
                            </select>
                        </label>
                    </div>
                </div>
                <div class="level-item">
                    <div class="select is-rounded is-small">
                        <label>
                            <select v-model="y_option">
                                <option v-for="header in headers"> {{
                                    header.headerName }}
                                </option>
                            </select>
                        </label>
                    </div>
                </div>


            </div>
            <div class="level-item">
                <button class="button is-rounded is-small" @click="displayData">OK</button>
            </div>
        </div>
    </div>
</template>

<script>
    import {mapActions, mapMutations} from "vuex";

    export default {
        name: "ControlPanel",
        props: ['headers'],
        data() {
            return {
                raw_data: 0,
                pca: 1,
                mda: 2,
                selected: 0,
                x_option: null,
                y_option: null
            }
        },
        computed: {
            is_raw_data_selected() {
                return this.selected === this.raw_data && this.headers.length > 0;
            },
            is_pca_selected() {
                return this.selected === this.pca;
            },
            is_mda_selected() {
                return this.selected === this.mda;
            }
        },
        methods: {
            ...mapActions({
                pca_handle: 'pca'
            }),
            ...mapActions('scatter', {
                displayRawData: 'displayRawData'
            }),
            ...mapMutations('scatter', {
                displayPCAData: 'displayPCAData'
            }),
            displayData() {
                switch (this.selected) {
                    case this.raw_data:
                        this.displayRawData({headers: [this.x_option, this.y_option]});
                        break;
                    case this.pca:
                        this.pca_handle();
                        break;
                    case this.mda:
                        break;
                }
            }
        },
        watch: {
            selected: function (nval, oval) {
                switch (nval) {
                    case this.raw_data:
                        this.displayRawData({headers: [this.x_option, this.y_option]});
                        break;
                    case this.pca:
                        this.displayPCAData();
                        break;
                }
            },
            headers: function (nval, oval) {
                if (nval.length > 0) {
                    this.x_option = nval[0].headerName;
                    this.y_option = nval[0].headerName;
                }
            }
        }
    }
</script>

<style scoped>
    .control-panel {
        height: 50px;
    }
</style>