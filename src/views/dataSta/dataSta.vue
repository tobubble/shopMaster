<template>
  <div>
    <el-card>
      <div v-if="reportData" id="echarts" class="dataReport"></div>
    </el-card>
  </div>
</template>

<script>
import { getDataReport } from "network/dataReport/dataReport";

export default {
  data() {
    return {
      // 保存数据报表图的数据
      reportData: {},
    };
  },
  created() {
    this.getDataReportPut();
  },
  updated() {
    this.showEcharts();
  },
  methods: {
    // 数据请求
    // 请求数据报表数据
    async getDataReportPut() {
      const { data: res } = await getDataReport();
      if (res.meta.status !== 200) return this.$message.error("请求数据失败");
      this.reportData = res.data;
      console.log(this.reportData);
    },
    // 自定义方法
    // 初始化 div ，将div 变成统计图
    showEcharts() {
      const obj = {};
      const myChart = this.$echarts.init(document.getElementById("echarts"));
      const option = {
        title: {
          text: "用户来源",
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            label: {
              backgroundColor: "#E9EEF3",
            },
          },
        },
        // legend: {
        //   data: ["销量"],
        // },
        // xAxis: {
        //   data: ["衬衫", "羊毛衫", "雪纺衫", "裤子", "高跟鞋", "袜子"],
        // },
        // yAxis: {},
        // series: [
        //   {
        //     name: "销量",
        //     type: "bar",
        //     data: [5, 20, 36, 10, 10, 20],
        //   },
        // ],
      };
      console.log(this.reportData);
      Object.assign(obj, option, this.reportData);
      console.log(obj);
      myChart.setOption(obj);
    },
  },
};
</script>

<style lang='less' scoped>
#echarts {
  width: 50%;
  height: 500px;
}
</style>