<template>
    <div class="panel test">
        <div class="panel-heading tabs is-toggle is-toggle-rounded">
            <ul>
                <li class="is-active">
                    <a><span>Normal</span></a>
                </li>
                <li>
                    <a><span>Range</span></a>
                </li>
            </ul>
        </div>
        <div class="panel-block">
            <div class="control">
                <div class="level">
                    <div class="control level-item">
                        <input class="input is-primary" type="text" ref="input" @keydown.enter="onChange($event)"
                               v-model="value"/>
                    </div>
                    <div class="control level-item">
                        <button class="button level-item" @click="changeData">OK</button>
                    </div>
                </div>

            </div>
        </div>

        <div class="panel-block">
            <div class="control">
                <div class="level">
                    <div class="control level-item">
                        <input class="slider" :step="c_value" :min=getMin :max=getMax v-model.number="value"
                               type="range">
                    </div>
                    <div class="control level-item">
                        <label class="label">{{ value }}</label>
                    </div>

                    <div class="control level-item">
                        <button class="button level-item">OK</button>
                    </div>
                </div>
            </div>

        </div>

        <div class="panel-block">
            <div class="control">
                <div class="level">
                    <div class="control level-item">
                        <input class="input range-input" type="number" v-model.number="k_value" min=0
                               @keydown.enter="onKvalueChange($event)">
                    </div>
                    <div class="control level-item">
                        <input class="input range-input" type="number" v-model.number="c_value" min=1
                               @keydown.enter="onCvalueChange($event)">
                    </div>
                </div>
            </div>
        </div>

        <div class="panel-block">
            <div class="control">
                <div class="level">
                    <button class="button level-item" @click="generatePointsInInterval">OK</button>
                </div>

            </div>
        </div>


    </div>

</template>

<script>
    import Vue from 'vue'
    import {mapMutations} from "vuex";

    export default {
        name: "MyCellEditor",
        data() {
            return {
                value: 0,
                cancelBeforeStart: true,
                changed: false,
                k_value: 1,
                c_value: 1,
                std_deviation: 1,
                slider_value: 0
            }
        },
        computed: {
            getMin: function () {
                return this.params.value - this.k_value * this.std_deviation;
            },
            getMax: function () {
                return this.params.value + this.k_value * this.std_deviation;
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
            this.clearScatterLinePointByData();
            let dataObj = JSON.parse(JSON.stringify(this.params.node.data));
            let dataArray = Object.keys(dataObj).map(key => dataObj[key]);
            this.addScatterLinePointByData(dataArray);
        },

        methods: {
            ...mapMutations(['updateScatterGraphicPointByData', 'updateScatterGraphicPointByIndex',
                'addScatterLinePointByData', 'clearScatterLinePointByData',
                'addScatterLinePointByData', 'addScatterLinePointsByArray']),
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
            },
            onKvalueChange(event) {
                event.stopImmediatePropagation();
            },
            onCvalueChange(event) {
                event.stopImmediatePropagation();
            },
            generatePointsInInterval() {
                this.clearScatterLinePointByData();
                console.log(this.params);
                let colIndex = Object.keys(this.params.node.data).indexOf(this.params.column.colId);
                let points = [];
                // left interval
                for (let i = this.params.value; i >= this.getMin; i -= this.c_value) {
                    let dataArray = Object.keys(this.params.node.data).map(key => this.params.node.data[key]);
                    dataArray[colIndex] = i;
                    points.push(dataArray);
                }
                points.reverse();
                //right interval
                for (let i = this.params.value + this.c_value; i <= this.getMax; i += this.c_value) {
                    let dataArray = Object.keys(this.params.node.data).map(key => this.params.node.data[key]);
                    dataArray[colIndex] = i;
                    points.push(dataArray);
                }
                this.addScatterLinePointsByArray(points);

            }
        }
    }
</script>

<style scoped>
</style>