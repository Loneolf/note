import { jobData } from "./data.js";

// 柱状图1模块
let jobChart = echarts.init(document.querySelector(".bar .chart"));

// 实例化对象
const { xAxis, yAxis } = jobData;
// 指定配置和数据
let option = {
	color: ["#2f89cf"],
	tooltip: {
		trigger: "axis",
		axisPointer: {
			// 坐标轴指示器，坐标轴触发有效
			type: "shadow", // 默认为直线，可选为：'line' | 'shadow'
		},
	},
	grid: {
		left: "0%",
		top: "10px",
		right: "5%",
		bottom: "4%",
		containLabel: true,
	},
	xAxis: [
		{
			type: "category",
			data: xAxis,
			axisTick: {
				alignWithLabel: true,
			},
			axisLabel: {
				textStyle: {
					color: "rgba(255,255,255,.6)",
					fontSize: "12",
				},
			},
			axisLine: {
				show: false,
			},
		},
	],
	yAxis: [
		{
			type: "value",
			axisLabel: {
				textStyle: {
					color: "rgba(255,255,255,.6)",
					fontSize: "12",
				},
			},
			axisLine: {
				lineStyle: {
					color: "rgba(255,255,255,.3)",
					// width: 1,
					// type: "solid"
				},
			},
			splitLine: {
				lineStyle: {
					color: "rgba(255,255,255,.3)",
				},
			},
		},
	],
	series: [
		{
			name: "直接访问",
			type: "bar",
			barWidth: "35%",
			data: yAxis["2022"],
			itemStyle: {
				barBorderRadius: 3,
			},
		},
	],
};

// 把配置给实例对象
jobChart.setOption(option);

job2022.addEventListener("click", () => {
	handleClick("2022");
});
job2023.addEventListener("click", () => {
	handleClick("2023");
});
function handleClick(year) {
	option.series[0].data = yAxis[year];
	jobChart.setOption(option);
}

export default jobChart;
