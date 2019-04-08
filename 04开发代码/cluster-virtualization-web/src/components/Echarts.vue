<template>
  <!-- built files will be auto injected -->
  <div :id="id" class="echart">
  </div>
</template>

<script>
  import echarts from 'echarts' // 引入echarts

  export default {
  name: 'Echarts',
    props: ['id', 'options'],
    data() {
    return {
      myChart: {}
    }
  },
  mounted () {
    this.draw();
  },
  methods: {
    draw: function () {
      // 基于准备好的dom，初始化echarts实例
      this.myChart = echarts.init(document.getElementById(this.id));
      // 绘制图表
      this.myChart.setOption(this.options, true);
      window.addEventListener("resize", () => {
        this.myChart.resize();
      });
    }
  },
    beforeDestroy() {
      this.myChart.clear()
    },
    watch: {
      options: {
        handler(nval, oval) {
          //this.myChart.clear();
          this.myChart.setOption(nval, true);
        },
        deep: true
    }
  }
}
</script>

<style scoped>
  .echart {
    height: 100%;
    width: 100%;
  }

</style>
