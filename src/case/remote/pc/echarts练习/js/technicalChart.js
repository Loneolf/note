import { technicalData } from './data.js'

let technicalChart = echarts.init(document.querySelector(".bar1 .chart"));

const option = {
	//图标位置
	grid: {
		top: "10%",
		left: "22%",
		bottom: "10%",
	},
	xAxis: {
		show: false, // 不展示X轴
	},
    tooltip: {
		formatter: (params) => {
            let allNum = params[1].axisValue
            return `总题数${allNum}, 已刷${(params[0].data * allNum).toFixed(0)}`
        },
		// position: function (p) {
		// 	//其中p为当前鼠标的位置，固定在鼠标的位置
		// 	return [p[0] + 10, p[1] - 15];
		// },
		trigger: "axis",  // item
		axisPointer: {
			// 坐标轴指示器，坐标轴触发有效
			type: "shadow", // 默认为直线，可选为：'line' | 'shadow'
		},
	},
	yAxis: [
		{
			show: true,
			data: technicalData.titlename,
			inverse: true,
			axisLine: {
				show: false,
			},
			splitLine: {
				show: false,
			},
			axisTick: {
				show: false,
			},
			axisLabel: {
				color: "#fff",
				rich: {
					lg: {
						backgroundColor: "#339911",
						color: "#fff",
						borderRadius: 15,
						// padding: 5,
						align: "center",
						width: 15,
						height: 15,
					},
				},
			},
		},
		{
			show: true,
			inverse: true,
			data: technicalData.questionNum,
			axisLabel: {
				textStyle: {
					fontSize: 12,
					color: "#fff",
				},
			},
		},
	],
	series: [
		{
			name: "条",
			type: "bar",
			yAxisIndex: 0,
			data: technicalData.ratio,
			barCategoryGap: 50,
			barWidth: 10,
			itemStyle: {
				normal: {
					barBorderRadius: 20,
					color: function (params) {
						return technicalData.color[params.dataIndex];
					},
				},
			},
			label: {
				normal: {
					show: true,
					position: "inside",
					formatter: (params) => {
                        return params.data * 100 + "%"
                    },
				},
			},
		},
		{
			name: "框",
			type: "bar",
			yAxisIndex: 1,
			barCategoryGap: 50,
			data: technicalData.ratioFull,
			barWidth: 15,
			itemStyle: {
				normal: {
					color: "none",
					borderColor: "#00c1de",
					borderWidth: 3,
					barBorderRadius: 15,
				},
			},
		},
	],
};

// 使用刚指定的配置项和数据显示图表。
technicalChart.setOption(option);

export default technicalChart