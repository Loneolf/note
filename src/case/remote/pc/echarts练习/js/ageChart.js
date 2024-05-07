import { ageData } from "./data.js";
// 饼形图定制
let ageChart = echarts.init(document.querySelector(".pie .chart"));

const option = {
	tooltip: {
		trigger: "item",
		formatter: "{a} <br/>{b}: {c} ({d}%)",
		position: function (p) {
			// console.log('aaap', p)
			//其中p为当前鼠标的位置
			return [p[0] + 10, p[1] - 15];
		},
	},
	legend: {
		top: "75%",
		itemWidth: 10,
		itemHeight: 10,
		data: ageData.ageRound,
		textStyle: {
			color: "rgba(255,255,255,.5)",
			fontSize: "12",
		},
	},
	series: [
		{
			name: "年龄分布",
			type: "pie",
			center: ["50%", "38%"],
			radius: ["40%", "60%"],
			color: [
				"#065aab",
				"#066eab",
				"#0682ab",
				"#0696ab",
				"#06a0ab",
				"#06b4ab",
			],
			label: { show: false },
			labelLine: { show: false },
			data: ageData.ageNum,
		},
	],
};

// 使用刚指定的配置项和数据显示图表。
ageChart.setOption(option);
export default ageChart;
