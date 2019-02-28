<template>
    <div class="level">
        <div class="level-item">
            <input class="input is-primary" type="text" ref="input" @keydown.enter="onChange($event)" v-model="value"/>
        </div>
        <button class="button level-item" @click="changeData">OK</button>
    </div>

</template>

<script>
    import Vue from 'vue'
    import {mapMutations} from "vuex";

    export default {
        name: "MyCellEditor",
        data() {
            return {
                value: '',
                cancelBeforeStart: true,
                changed: false
            }
        },
        methods: {
            ...mapMutations(['updateScatterGraphicPointByData', 'updateScatterGraphicPointByIndex', 'addScatterLinePointByData', 'clearScatterLinePointByData', 'addScatterLinePointByData']),
            getValue() {
                this.clearScatterLinePointByData();
                return this.changed ? this.value : this.params.value;
            },
            isPopup() {
                return true;
            },
            isCancelBeforeStart() {
                return this.cancelBeforeStart;
            },

            // will reject the number if it greater than 1,000,000
            // not very practical, but demonstrates the method.
            isCancelAfterEnd() {
                return this.value > 1000000;
            },

            onKeyDown(event) {
                // if (!this.isKeyPressedNumeric(event)) {
                //     if (event.preventDefault) event.preventDefault();
                // }
            },

            getCharCodeFromEvent(event) {
                event = event || window.event;
                return (typeof event.which === "undefined") ? event.keyCode : event.which;
            },

            isCharNumeric(charStr) {
                return /\d/.test(charStr);
            },

            isKeyPressedNumeric(event) {
                const charCode = this.getCharCodeFromEvent(event);
                const charStr = String.fromCharCode(charCode);
                return this.isCharNumeric(charStr);
            },
            onChange(event) {
                event.stopImmediatePropagation();
                let dataObj = JSON.parse(JSON.stringify(this.params.node.data));
                dataObj[this.params.column.colId] = this.value;
                let dataArray = Object.keys(dataObj).map(key => dataObj[key]);
                this.addScatterLinePointByData(dataArray);

                // console.log(this.params.rowIndex);
                // this.updateScatterGraphicPointByIndex(this.params.rowIndex);
            },
            changeData() {
                this.changed = true;
                this.params.api.stopEditing();
            }
        },
        created() {
            this.value = this.params.value;

            // only start edit if key pressed is a number, not a letter
            this.cancelBeforeStart = this.params.charPress && ('1234567890'.indexOf(this.params.charPress) < 0);
        },
        mounted() {
            Vue.nextTick(() => {
                // need to check if the input reference is still valid - if the edit was cancelled before it started there
                // wont be an editor component anymore
                if (this.$refs.input) {
                    this.$refs.input.focus();
                }
            });
            let dataObj = JSON.parse(JSON.stringify(this.params.node.data));
            let dataArray = Object.keys(dataObj).map(key => dataObj[key]);
            this.addScatterLinePointByData(dataArray);
        }
    }
</script>

<style scoped>
</style>