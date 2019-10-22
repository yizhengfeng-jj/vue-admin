<template>
  <div>
    <el-row>
      <el-col :span="6">
        <div id="container" :style="visilizeObj"></div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import vue from "vue";
import Highcharts from "highcharts";
import { Row, Col } from "element-ui";
import axios from "axios";

vue.use(Row);
vue.use(Col);

export default {
  name: "Dashboard",
  data: function() {
    return {
      visilizeObj: { height: "182px" }
    };
  },
  mounted: function() {
    const charts = Highcharts.chart("container", {
      chart: {
        type: "spline",
        inverted: false
      },
      title: {
        text: "一周登录次数"
      },
      xAxis: {
        type: "category",
        reversed: false,
        title: {
          enabled: true,
          text: "最近七天"
        },
        labels: {
          enabled: false
        },
        maxPadding: 0.05,
        showLastLabel: true
      },
      yAxis: {
        title: {
          text: "登录总次数"
        },
        labels: {
          formatter: function() {
            return this.value;
          }
        },
        lineWidth: 2
      },
      legend: {
        enabled: false
      },
      tooltip: {
        headerFormat: "",
        pointFormatter: function() {
          console.log(this, 22200);
          const { name, y } = this.options || {};
          return name + ": " + y;
        }
      },
      series: [
        {
          name: "时间",
          data: []
        }
      ]
    });

    // 发送请求
    axios.get("/api/getLoginCount").then(result => {
      //charts.series[0].addPoint(result.data);
      let { data } = result;
      const dataCopy = Array.isArray(data) ? data : [];

      dataCopy.forEach(item => {
        const { time, num } = item || {};

        charts.series[0].addPoint([time, num], false);
      });

      charts.redraw();

      //console.log(seriesData, 5550);
    });
  }
};
</script>