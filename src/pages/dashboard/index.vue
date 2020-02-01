<template>
  <div>
    <el-row :gutter="16" class="chart-row">
      <el-col :span="6">
        <highcharts :options="lineOptions" :style="visilizeObj" />
      </el-col>
      <el-col :span="6">
        <highcharts :options="wordCloudOptions" :style="visilizeObj" />
      </el-col>
      <el-col :span="6">
        <highcharts :options="activeAuthorOptions" :style="visilizeObj" />
      </el-col>
      <el-col :span="6">
        <highcharts :options="maxBlogOptions" :style="visilizeObj" />
      </el-col>
    </el-row>
    <el-row :gutter="24" class="chart-row">
      <el-col :span="12">
        <highcharts :options="scatterOptions" :styl="visilizeObj" />
      </el-col>
    </el-row>
  </div>
</template>
<script>
import vue from "vue";
import Highcharts from "highcharts";
import { Chart } from "highcharts-vue";
import { Row, Col } from "element-ui";
import axios from "axios";
import loadWordcloud from "highcharts/modules/wordcloud"; // 词云图形
import highChartsMore from "highcharts/highcharts-more";
import highchartsGauge from "highcharts/modules/solid-gauge"; // 仪表盘图形
import {
  lineOptions,
  wordCloudOptions,
  activeAuthorOptions,
  maxBlogOptions,
  scatterOptions
} from "../../config";

vue.use(Row);
vue.use(Col);
//vue.use(highChartsVue);
loadWordcloud(Highcharts);
highChartsMore(Highcharts);
highchartsGauge(Highcharts);

export default {
  name: "Dashboard",
  components: {
    highcharts: Chart
  },
  data: function() {
    return {
      visilizeObj: { height: "182px" },
      updateArgs: [true, true, { duration: 1000 }],
      lineOptions,
      wordCloudOptions,
      activeAuthorOptions,
      maxBlogOptions,
      scatterOptions
    };
  },
  mounted: function() {
    //const charts = Highcharts.chart("container", );

    //Highcharts.chart("wordCloud1", );

    // 发送请求获取一周内登录次数
    axios.get("/api/getLoginCount").then(result => {
      //charts.series[0].addPoint(result.data);
      let { data } = result;
      let dataCopy = Array.isArray(data) ? data : [];

      dataCopy = dataCopy.map(item => {
        const { time, num } = item || {};

        return [time, num];
      });

      this.lineOptions.series[0].data = dataCopy;
    });

    // 获取标签云
    axios.get("/api/getWordCloud").then(res => {
      const { data } = res || {};

      this.wordCloudOptions.series[0].data = data;
    });

    // 获取活跃用户
    axios.get("/api/getActiveAuthor").then(res => {
      const { data } = res || {};
      const chartData = Array.isArray(data)
        ? data.map(item => {
            const { author, num } = item || {};

            return [author, num];
          })
        : [];

      this.activeAuthorOptions.series[0].data = chartData;
    });

    // 获取最多作者信息
    axios.get("/api/getMaxBlog").then(res => {
      const { data } = res || {};
      const { num, author } = data || {};

      this.maxBlogOptions.series[0].data = [num];
      this.maxBlogOptions.series[0].dataLabels.format = `<div><h1>${author}/${num}篇</h1></div>`;
    });

    // 获取一天之内发布文章的散点图
    axios.get("/api/oneDayPublish").then(res => {
      const { data = [] } = res || {};

      this.scatterOptions.xAxis.categories = Object.keys(data);
      console.log(Object.keys(data));
      this.scatterOptions.series[0].data = Object.values(data);
    });
  }
};
</script>
<style scoped lang="less">
.chart-row {
  margin-bottom: 16px;
}
</style>
