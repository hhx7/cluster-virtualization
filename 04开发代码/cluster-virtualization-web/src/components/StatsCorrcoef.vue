<template>
    <Echarts v-bind:id="idv" v-bind:options="getCorrcoefOptions"/>
</template>

<script>
    import {mapGetters} from "vuex";
    import Echarts from "./Echarts"

    export default {
        name: "StatsCorrcoef",
        computed: {
            ...mapGetters('corrcoef', {
                getCorrcoefOptions: 'getCorrcoefOptions'
            })
        },
        data() {
            return {
                idv: 'corrcoef_view'
            }
        },
        mounted() {

        },
        components: {Echarts}
    }
</script>

<style scoped>

</style>