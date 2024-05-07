// 基于准备好的dom，初始化echarts实例
let myChart = echarts.init(document.querySelector(".line1 .chart"));

const option = {
	// 图例显示
	tooltip: {
		trigger: "axis",
		// 图例样式设置
		axisPointer: {
			lineStyle: {
				color: "#dddc6b",
			},
		},
	},
	legend: {
		top: "0%",
		textStyle: {
			color: "rgba(255,255,255,.6)",
			fontSize: "12",
		},
	},
	// 设置尺寸
	grid: {
		left: "10",
		top: "30",
		right: "10",
		bottom: "10",
		containLabel: true,
	},

	xAxis: [
		{
			type: "category",
			boundaryGap: false,
			axisLabel: {
				textStyle: {
					color: "rgba(255,255,255,.8)",
					fontSize: 12,
				},
			},
			axisLine: {
				lineStyle: {
					color: "rgba(255,255,255,.4)",
				},
			},

			data: [ "01", "02", "03", "04", "05", "06", "07", "08", "09", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30",],
		},
		// {
		//   axisPointer: { show: false },
		//   axisLine: { show: false },
		//   position: "bottom",
		//   offset: 20
		// }
	],

	yAxis: [
		{
			type: "value",
			axisTick: { show: false },
			axisLine: {
				lineStyle: {
					color: "rgba(255,255,255,.2)",
				},
			},
			axisLabel: {
				textStyle: {
					color: "rgba(255,255,255,.6)",
					fontSize: 12,
				},
			},

			splitLine: {
				lineStyle: {
					color: "rgba(255,255,255,.2)",
				},
			},
		},
	],
	series: [
		{
			name: "播放量",
			type: "line",
			smooth: true,
			symbol: "circle",
			symbolSize: 5,
			showSymbol: false,
			lineStyle: {
				normal: {
					color: "#0184d5",
					width: 2,
				},
			},
			areaStyle: {
				normal: {
					color: new echarts.graphic.LinearGradient(
						0,
						0,
						0,
						1,
						[
							{
								offset: 0,
								color: "rgba(1, 132, 213, 0.4)",
							},
							{
								offset: 0.8,
								color: "rgba(1, 132, 213, 0.1)",
							},
						],
						false
					),
					shadowColor: "rgba(0, 0, 0, 0.1)",
				},
			},
			itemStyle: {
				normal: {
					color: "#0184d5",
					borderColor: "rgba(221, 220, 107, .1)",
					borderWidth: 12,
				},
			},
			data: [ 30, 40, 30, 40, 30, 40, 30, 60, 20, 40, 20, 40, 30, 40, 30, 40, 30, 40, 30, 60, 20, 40, 20, 40, 30, 60, 20, 40, 20, 40, ],
		},
		{
			name: "转发量",
			// 线条
			type: "line",
			// 线条过渡圆滑
			smooth: true,
			// 线条样式
			lineStyle: {
				normal: {
					color: "#00d887",
					// 宽度默认为2，可不设置
					width: 2,
				},
			},
			// 拐点类型，圆形，可设置'circle', 'rect', 'roundRect', 'triangle', 'diamond', 'pin', 'arrow', 'none'等，还可设置图片
			symbol: "circle",
			// 拐点大小
			symbolSize: 5,
			// 正常是否显示拐点，false为不显示，鼠标滑过才显示
			showSymbol: false,
			// 拐点的样式
			itemStyle: {
				normal: {
					color: "#00d887",
					borderColor: "rgba(221, 220, 107, .1)",
					borderWidth: 12,
				},
			},
			// 填充区域的样式，两个颜色是过渡LinearGradient
			areaStyle: {
				normal: {
					color: new echarts.graphic.LinearGradient(
						0,
						0,
						0,
						1,
						[
							{
								offset: 0,
								color: "rgba(0, 216, 135, 0.4)",
							},
							{
								offset: 0.8,
								color: "rgba(0, 216, 135, 0.1)",
							},
						],
						false
					),
					shadowColor: "rgba(0, 0, 0, 0.1)",
				},
			},

			data: [ 50, 30, 50, 60, 10, 50, 30, 50, 60, 40, 60, 40, 80, 30, 50, 60, 10, 50, 30, 70, 20, 50, 10, 40, 50, 30, 70, 20, 50, 10, 40, ],
		},
	],
};

// 使用刚指定的配置项和数据显示图表。
myChart.setOption(option);
export default myChart;
