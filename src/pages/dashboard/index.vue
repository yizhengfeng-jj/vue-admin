<template>
  <div>
    <el-row :gutter="16">
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
  </div>
</template>
<script>
import vue from "vue";
import Highcharts from "highcharts";
import { Chart } from "highcharts-vue";
import { Row, Col } from "element-ui";
import axios from "axios";
import loadWordcloud from "highcharts/modules/wordcloud";
import highChartsMore from 'highcharts/highcharts-more';
import highchartsGauge from 'highcharts/modules/solid-gauge';
import {
  lineOptions,
  wordCloudOptions,
  activeAuthorOptions,
  maxBlogOptions
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
      maxBlogOptions
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
    axios.get('/api/getMaxBlog').then(res => {
     
      const { data } = res || {};
      const { num, author } = data || {};

      this.maxBlogOptions.series[0].data = [num];
      this.maxBlogOptions.series[0].dataLabels.format = `<div><h1>${author}/${num}篇</h1></div>`
    })
  }
};
</script>