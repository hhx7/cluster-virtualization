<template>
    <div id="hot-preview">
        <HotTable :root="root" :settings="hotSettings"></HotTable>
    </div>
</template>

<script>
    import HotTable  from 'vue-handsontable-official';

    export default {
        name: 'excel',
        data: function() {
            return {
                root: 'test-hot',
                hotSettings: {
                    data: [['sample', 'data']],
                    colHeaders: true
                }
            };
        },
        components: {
            HotTable
        }
    }
</script>

<style scoped src="../../node_modules/handsontable/dist/handsontable.full.min.css">

    #hot-preview {
        width: 600px;
        height: 400px;
        overflow: hidden;
    }
</style>


