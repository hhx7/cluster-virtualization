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
                        <input class="input is-primary" type="text" ref="input"/>
                    </div>
                    <div class="control level-item">
                        <button class="button">OK</button>
                    </div>
                </div>

            </div>
        </div>

        <div class="panel-block">
            <div class="control">
                <div class="level">
                    <div class="control level-item">
                        <input class="slider" step="1" :min="k_value" :max="c_value" v-model="slider_value"
                               type="range">
                    </div>
                    <div class="control level-item">
                        <label class="label">{{ slider_value }}</label>
                    </div>
                </div>
            </div>

        </div>

        <div class="panel-block">
            <div class="control">
                <div class="level">
                    <div class="control level-item">
                        <input class="input range-input" type="number" v-model="k_value">
                    </div>
                    <div class="control level-item">
                        <input class="input range-input" type="number" v-model="c_value">
                    </div>
                </div>
            </div>
        </div>

        <div class="panel-block">
            <div class="control">
                <div class="level">
                    <button class="button level-item">OK</button>
                </div>

            </div>
        </div>


    </div>

</template>

<script>
    export default {
        name: "UITest",
        data() {
            return {
                k_value: 0,
                c_value: 100,
                slider_value: 0
            }
        },
        computed: {
            getMin: function () {

            }
        }
    }
</script>

<style scoped>
    .test {
        width: 300px;
    }
</style>