<template>
    <div class="control-panel">
        <div class="level">
            <div class="level-right">
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
                    <div class="level-item">
                        <input class="input is-small is-rounded" v-model.number="max_clusters" min="1">
                    </div>
                    <div class="level-right">
                        <button class="button is-rounded is-small" @click="startClustering">OK</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import {mapActions, mapMutations} from 'vuex'

    export default {
        name: "HotmapControlPanel",
        data() {
            return {
                cluster_selected: 0,
                stats_selected: 0,
                k_means: 0,
                anova: 0,
                max_clusters: 2
            };
        },
        methods: {
            ...mapActions({
                kmeans_handle: 'kmeans'
            }),
            ...mapActions('heatmap', {
                getDataAndAnova: 'getDataAndAnova'
            }),
            ...mapMutations('heatmap', {
                setClusterNum: 'setClusterNum'
            }),
            startClustering() {
                switch (this.cluster_selected) {
                    case this.k_means:
                        this.kmeans_handle(this.max_clusters);
                        this.setClusterNum(this.max_clusters);
                        break;
                }
            },
            startStats() {
                switch (this.stats_selected) {
                    case this.anova:
                        this.getDataAndAnova();
                        break;
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