<template>
  <div>
    <el-row :gutter="16">
      <el-col :span="6">
        <highcharts :options="lineOptions" :style="visilizeObj" />
      </el-col>
      <el-col :span="6">
        <highcharts :options="wordCloudOptions" :style="visilizeObj" />
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

vue.use(Row);
vue.use(Col);
//vue.use(highChartsVue);
loadWordcloud(Highcharts);

export default {
  name: "Dashboard",
  components: {
    highcharts: Chart
  },
  data: function() {
    return {
      visilizeObj: { height: "182px" },
      updateArgs: [true, true, { duration: 1000 }],
      lineOptions: {
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
      },
      wordCloudOptions: {
        series: [
          {
            type: "wordcloud",
            data: []
          }
        ],
        title: {
          text: "词云图"
        }
      }
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

      //console.log(seriesData, 5550);
    });

    // 获取标签云
    axios.get("/api/getWordCloud").then(res => {
      const { data } = res || {};

      this.wordCloudOptions.series[0].data = data;
    });
  }
};
</script>