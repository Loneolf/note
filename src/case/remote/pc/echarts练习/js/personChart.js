import { personData } from "./data.js";
// 折线图定制
let personChart = echarts.init(document.querySelector(".line .chart"));

// 指定配置和数据
const option = {
	color: ["#00f2f1", "#ed3f35"],
	tooltip: {
		// 通过坐标轴来触发
		trigger: "axis",
	},
	legend: {
		// 距离容器10%
		right: "10%",
		// 修饰图例文字的颜色
		textStyle: {
			color: "#4c9bfd",
		},
		// 如果series 里面设置了name，此时图例组件的data可以省略
		// data: ["邮件营销", "联盟广告"]
	},
	grid: {
		top: "20%",
		left: "3%",
		right: "4%",
		bottom: "3%",
		show: true,
		borderColor: "#012f4a",
		containLabel: true,
	},

	xAxis: {
		type: "category",
		boundaryGap: false,
		data: personData.month,
		// 去除刻度
		axisTick: {
			show: false,
		},
		// 修饰刻度标签的颜色
		axisLabel: {
			color: "rgba(255,255,255,.7)",
		},
		// 去除x坐标轴的颜色
		axisLine: {
			show: false,
		},
	},
	yAxis: {
		type: "value",
		// 去除刻度
		axisTick: {
			show: false,
		},
		// 修饰刻度标签的颜色
		axisLabel: {
			color: "rgba(255,255,255,.7)",
		},
		// 修改y轴分割线的颜色
		splitLine: {
			lineStyle: {
				color: "#012f4a",
			},
		},
	},
	series: [
		{
			name: "新增粉丝",
			type: "line",
			stack: "总量",
			// 是否让线条圆滑显示
			smooth: true,
			data: personData.peopleNum[0],
		},
		{
			name: "新增游客",
			type: "line",
			stack: "总量",
			smooth: true,
			data: personData.peopleNum[1],
		},
	],
};
// 3. 把配置和数据给实例对象
personChart.setOption(option);

// // 重新把配置好的新数据给实例对象
// personChart.setOption(option);

export default personChart;
