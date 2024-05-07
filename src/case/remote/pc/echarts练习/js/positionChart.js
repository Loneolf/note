let myChart = echarts.init(document.querySelector(".pie1 .chart"));


const option = {
    legend: {
        bottom: "0%",
        itemWidth: 10,
        itemHeight: 10,
        textStyle: {
          color: "rgba(255,255,255,.5)",
          fontSize: "12"
        }
      },
    color: [
        "#006cff",
        "#60cda0",
        "#ed8884",
        "#ff9f7f",
        "#0096ff",
        "#9fe6b8",
        "#32c5e9",
        "#1d9dff"
      ],
      tooltip: {
        trigger: "item",
        formatter: "{a} <br/>{b} : {c} ({d}%)"
    },
    series: [
      {
        name: '地区分布',
        type: 'pie',
        radius: ["10%", "70%"],
        center: ['50%', '50%'],
        roseType: 'radius',
        // 图形的文字标签
        label: {
            fontSize: 10,
            // color: '#fff',
            color: 'inherit',
          },
          // 链接图形和文字的线条
          labelLine: {
            // length 链接图形的线条
            length: 6,
            // length2 链接文字的线条
            length2: 8
          },
          data: [
            { value: 20, name: "云南" },
            { value: 26, name: "北京" },
            { value: 24, name: "山东" },
            { value: 25, name: "河北" },
            { value: 20, name: "江苏" },
            { value: 25, name: "浙江" },
            { value: 30, name: "四川" },
            { value: 42, name: "湖北" }
          ]
      }
    ]
  };


  // 使用刚指定的配置项和数据显示图表。
myChart.setOption(option);
export default myChart;