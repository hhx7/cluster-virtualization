<template>
    <div class="control-panel">
        <div class="level">
            <div class="level-left">
                <div class="dropdown is-hoverable is-up">
                    <div class="dropdown-trigger">
                        <a class="icon is-small" aria-haspopup="true" aria-controls="dropdown-menu4">
                            <i class="fas fa-cog" aria-hidden="true"></i>
                        </a>
                    </div>
                    <div class="dropdown-menu setting" id="dropdown-menu4" role="menu">
                        <div class="dropdown-content">
                            <div class="panel">
                                <div class="panel-block">
                                    <div class="level">
                                        <div class="level-item first-level">
                                            <span class="tag is-info is-small">current sampling num: {{ getSamplingNum }}</span>
                                        </div>
                                        <div class="level-item">
                                            <span class="tag is-info is-small">sampling rate:{{ samplingRate / getSamplingSliderMaxValue}}</span>
                                        </div>
                                    </div>
                                </div>
                                <div class="panel-block">
                                    <input class="slider is-fullwidth is-circle sampling-slider" step="1" min="0"
                                           :max="getSamplingSliderMaxValue"
                                           v-model.number="samplingRate" @change="updateSamplingRate" type="range">
                                </div>
                            </div>


                        </div>
                    </div>
                </div>
            </div>
            <div class="level-item">
                <div class="select is-rounded is-small">
                    <label>
                        <select v-model="selected">
                            <option :value="raw_data">Raw Data</option>
                            <option :value="pca">PCA</option>
                            <option :value="mds">MDS</option>
                        </select>
                    </label>
                </div>
            </div>
            <div class="level-item" v-if="is_raw_data_selected">
                <div class="level-left">
                    <div class="select is-rounded is-small">
                        <label>
                          <select class="axis-width" v-model="x_option">
                                <option v-for="header in myHeaders"> {{ header.headerName }}</option>
                            </select>
                        </label>
                    </div>
                </div>
                <div class="level-item">
                    <div class="select is-rounded is-small">
                        <label>
                          <select class="axis-width" v-model="y_option">
                                <option v-for="header in myHeaders"> {{
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
  import {mapActions, mapGetters, mapMutations} from "vuex";

  export default {
        name: "ControlPanel",
        props: ['headers'],
        data() {
            return {
                raw_data: 0,
                pca: 1,
                mds: 2,
                selected: 0,
                x_option: null,
                y_option: null,
                samplingRate: 0
            }
        },
        computed: {
            ...mapGetters('scatter', {
                getSamplingNum: 'getSamplingNum',
                getSamplingRate: 'getSamplingRate',
                getSamplingSliderMaxValue: 'getSamplingSliderMaxValue'
            }),
            is_raw_data_selected() {
                return this.selected === this.raw_data && this.headers.length > 0;
            },
            is_pca_selected() {
                return this.selected === this.pca;
            },
            is_mda_selected() {
                return this.selected === this.mds;
            },
            myHeaders() {
                return this.headers.filter(item => item.show === true);
            }
        },
        mounted() {
            this.samplingRate = this.getSamplingRate * this.getSamplingSliderMaxValue;
        },
        methods: {
            ...mapActions({
                pca_handle: 'pca',
                mds_handle: 'mds'
            }),
            ...mapActions('scatter', {
                displayRawData: 'displayRawData',
                changeSamplingRate: 'changeSamplingRate'
            }),
            ...mapMutations('scatter', {
                displayPCAData: 'displayPCAData',
                displayMDSData: 'displayMDSData'
            }),
            displayData() {
                switch (this.selected) {
                    case this.raw_data:
                        this.displayRawData({headers: [this.x_option, this.y_option]});
                        break;
                    case this.pca:
                        this.pca_handle();
                        break;
                    case this.mds:
                        this.mds_handle();
                        break;
                }
            },
            updateSamplingRate() {
                this.changeSamplingRate(this.samplingRate / this.getSamplingSliderMaxValue);
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
                    case this.mds:
                        this.displayMDSData();
                        break;
                }
            },
            headers: function (nval, oval) {
                if (nval.length > 0) {
                    this.x_option = nval[0].headerName;
                    this.y_option = nval[0].headerName;
                }
            },
            getSamplingSliderMaxValue: function (nval, oval) {
                this.samplingRate = this.samplingRate / oval * nval;
            }
        }
    }
</script>

<style scoped>
    @import "../../node_modules/bulma-extensions/bulma-slider/dist/css/bulma-slider.min.css";
    .control-panel {
        height: 50px;
    }

    .setting {
        width: 500px;
    }

    .sampling-slider {
        margin: 0;
    }

    .axis-width {
      width: 100px;
    }

</style>
