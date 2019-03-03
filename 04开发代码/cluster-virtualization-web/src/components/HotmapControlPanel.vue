<template>
    <div class="control-panel">
        <div class="level">
            <div class="level-left">
                <div class="level">
                    <div class="level-left">
                        <div class="select is-rounded is-small">
                            <label>
                                <select v-model="cluster_selected">
                                    <option :value="k_means">K-means</option>
                                </select>
                            </label>
                        </div>
                    </div>
                    <div class="level-right">
                        <button class="button is-rounded is-small" @click="printValue">OK</button>
                    </div>
                </div>
            </div>
            <div class="level-right">
                <div class="level">
                    <div class="level-left">
                        <div class="select is-rounded is-small">
                            <label>
                                <select v-model="stats_selected">
                                    <option :value="anova">ANOVA</option>
                                </select>
                            </label>
                        </div>
                    </div>
                    <div class="level-right">
                        <button class="button is-rounded is-small" @click="printValue">OK</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "HotmapControlPanel",
        data() {
            return {
                cluster_selected: 0,
                stats_selected: 0,
                k_means: 0,
                anova: 0,
            }
        }
    }
</script>

<style scoped>
    .control-panel {
        height: 50px;
    }
</style>