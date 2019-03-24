<template>
    <table class="table anova">
        <thead>
        <tr>
            <th v-for="header in getAnovaResult.headers">{{ header }}</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="row in getAnovaResult.body">
            <td v-for="column in row"> {{ column }}</td>
        </tr>
        </tbody>
    </table>
</template>

<script>
    import {mapGetters} from "vuex";

    export default {
        name: "StatsAnova",
        computed: {
            ...mapGetters('anova', {
                getAnovaResult: 'getAnovaResult'
            })
        }
    }
</script>

<style scoped>
    .anova {
        width: 100%;
    }
</style>