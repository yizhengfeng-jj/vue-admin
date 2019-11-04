const lineOptions = {
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
};

const wordCloudOptions = {
  series: [
    {
      type: "wordcloud",
      data: []
    }
  ],
  title: {
    text: "词云图"
  }
};

const activeAuthorOptions = {
  chart: {
    type: "column"
  },
  title: {
    text: "活跃用户"
  },

  tooltip: {
    headerFormat: "",
    pointFormatter: function() {
        const { name, y } = this.options || {};
        return name + ": " + y;
    }
  },
  xAxis: {
    type: "category"
  },
  yAxis: {
    title: {
      text: "文章数"
    }
  },
  legend: {
    enabled: false
  },
  series: [
    {
      name: "活跃用户",
      data: []
    }
  ]
};


const maxBlogOptions = {
  chart: {
    type: 'solidgauge'
  },
  title: {
    text: null
  },
  tooltip: {
    enabled: false
  },
  pane: {
    startAngle: -90,
    endAngle: 90,
    size: '150%',
    center: ['50%', '85%'],
    background: {
      innerRadius: '60%',
			outerRadius: '100%',
      shape: 'arc'
    }
  },
  plotOptions: {
    solidgauge: {
      dataLabels: {
        borderWidth: 0,
        y: 20,
        useHTML: true
      }
    }
  },
  yAxis: {
    stops: [
			[0.1, '#55BF3B'], // green
			[0.5, '#DDDF0D'], // yellow
			[0.9, '#DF5353'] // red
		],
    min: 0,
    max: 10,
    tickWidth: 0,
    lineWidth: 0,
    minorTickInterval: null,
    tickPixelInterval: 400,
    title: {
      text: '博客量',
      y: -70
    },
    labels: {
      y: 20
    }
  },
  series: [{
    data: [],
    dataLabels: {
      formatter: function () {
        //console.log(this, 333300000);
        return ``
      }
    }
  }]

}

export { lineOptions, wordCloudOptions, activeAuthorOptions, maxBlogOptions };
