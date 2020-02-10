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
      <el-col :span="12">
        <div id="chinaMap"></div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import vue from "vue";
import * as highChartsProj4 from "@/util/proj4.js";
import Highcharts from "highcharts";
import { Chart } from "highcharts-vue";
import { Row, Col } from "element-ui";
import axios from "axios";
import loadWordcloud from "highcharts/modules/wordcloud"; // 词云图形
import highChartsMore from "highcharts/highcharts-more";
import highchartsGauge from "highcharts/modules/solid-gauge"; // 仪表盘图形
import hightmaps from "highcharts/highmaps"; // 中国地图
import {
  lineOptions,
  wordCloudOptions,
  activeAuthorOptions,
  maxBlogOptions,
  scatterOptions,
  chinaMapConfig
} from "../../config";
import citys from "@/util/chartData.js";

vue.use(Row);
vue.use(Col);

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
      scatterOptions,
      chinaMapConfig
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

    // 发布文章作者位置图
    axios.get("/api/authorAddress").then(res => {
      // 根据res来设置配置
      const { data } = res || {};
      const positionData = [];
      const positionPointData = [];

      // 设置位置点
      data.forEach(city => {
        const { username, address } = city || {};
        const cityInfo = citys.find(city => city.value === address);
        const { lon, lat, name } = cityInfo || {};

        positionData.push({ name, username });
        positionPointData.push({
          type: "mappoint",
          name,
          color: "#fca333",
          showInLegend: true,
          tooltip: {
            formatter: function() {
              console.log(this);
            }
          },
          marker: {
            symbol:
              "url(data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' class='icon' viewBox='0 0 1024 2048'%3E%3Cpath fill='" +
              encodeURIComponent("#fca333") +
              "' d='M532.1 918.9c-9.1 11-25.5 12.6-36.5 3.4-1.2-1-2.4-2.2-3.4-3.4-154.6-186.6-245.7-319-273.2-397.3-12-34.3-18.2-70.4-18.1-106.7 0-174.9 139.4-316.7 311.3-316.7S823.4 240 823.4 414.9c0 37.7-6.5 73.9-18.4 107.4-27.5 78.1-118.6 210.3-272.9 396.6zm-20-398.4c57.3 0 103.8-47.3 103.8-105.6s-46.4-105.5-103.8-105.5-103.8 47.2-103.8 105.5 46.5 105.6 103.8 105.6z'/%3E%3C/svg%3E)",
            width: 32,
            height: 64
          },
          dataLabels: { enabled: true },
          data: [
            {
              id: address,
              name,
              lon,
              lat
            }
          ]
        });
      });

      this.chinaMapConfig.series[0].data = positionData;
      this.chinaMapConfig.series = this.chinaMapConfig.series.concat(
        positionPointData
      );

      new hightmaps.Map("chinaMap", chinaMapConfig);
    });
  }
};
</script>
<style scoped lang="less">
.chart-row {
  margin-bottom: 16px;
}
</style>
