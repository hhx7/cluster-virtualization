<template>
    <aside class="menu">
        <ul class="menu-list">
            <li><a @click="$refs.file.click()">导入csv</a><input class="input is-hidden" type="file" ref="file"
                                                               id="open_csv" @change="openCsv" accept="text/csv"></li>

            <li><a href="#">热点图</a></li>
            <li><a href="#">聚类</a></li>
            <li><a href="#">保存</a></li>
        </ul>
    </aside>
</template>

<script>
    import {mapActions} from 'vuex'

    export default {
        name: "Menu",
        methods: {
            ...mapActions([
                'addCsvFile'
            ]),
            openCsv: function (evt) {
                var files = evt.target.files;
                var reader = new FileReader();
                for (var i = 0, f; f = files[i]; i++) {

                    if (!f.type.match('csv')) {
                        continue;
                    }

                    reader.onload = function (f) {
                        return function (e) {
                            this.addCsvFile({name: f.name.substring(0, f.name.indexOf('.')), content: e.target.result})
                        }.bind(this)

                    }.bind(this)(f);
                    reader.readAsText(f)
                }


            }
        }
    }
</script>

<style scoped>
    @import "../../static/css/bulma.min.css";

</style>