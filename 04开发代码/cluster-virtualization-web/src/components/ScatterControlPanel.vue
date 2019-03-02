<template>
    <div class="control-panel">
        <div class="level">
            <div class="select is-rounded is-small">
                <label>
                    <select v-model="selected">
                        <option :value="raw_data">Raw Data</option>
                        <option :value="pca">PCA</option>
                        <option :value="mda">MDA</option>
                    </select>
                </label>
            </div>
            <div class="level-item" v-if="is_raw_data_selected">
                <div class="level-left">
                    <div class="select is-rounded is-small">
                        <label>
                            <select>
                                <option>A</option>
                                <option>B</option>
                            </select>
                        </label>
                    </div>
                </div>
                <div class="level-item">
                    <div class="select is-rounded is-small">
                        <label>
                            <select>
                                <option>A</option>
                                <option>B</option>
                            </select>
                        </label>
                    </div>
                </div>

                <div class="level-item">
                    <button class="button is-rounded is-small" @click="printValue">OK</button>
                </div>
            </div>
            <div class="level-item" v-if="is_pca_selected">
                <div class="select is-rounded is-small">
                    <label>
                        <select>
                            <option>C</option>
                            <option>D</option>
                        </select>
                    </label>
                </div>
            </div>
        </div>


    </div>
</template>

<script>
    export default {
        name: "ControlPanel",
        data() {
            return {
                raw_data: 0,
                pca: 1,
                mda: 2,
                selected: 0
            }
        },
        computed: {
            is_raw_data_selected() {
                return this.selected === this.raw_data;
            },
            is_pca_selected() {
                return this.selected === this.pca;
            },
            is_mda_selected() {
                return this.selected === this.mda;
            }
        },
        methods: {
            printValue() {
                console.log(this.selected);
            }
        }
    }
</script>

<style scoped>
    .control-panel {
        height: 50px;
    }
</style>