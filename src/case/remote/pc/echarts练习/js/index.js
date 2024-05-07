// 就业图
import jobChart from "./jobChart.js";
// 人员变化图
import personChart from "./personChart.js";
// 年龄分布图
import ageChart from "./ageChart.js";
// 柱状-技能图
import technicalChart from "./technicalChart.js";
// 播放量折线
import playChart from "./playChart.js";
// 饼形图-地区分布
import positionChart from './positionChart.js'
// 中国地图飞机
import airPlaneChart from './airplaneChart.js'

window.addEventListener("resize", function () {
	jobChart.resize();
	personChart.resize();
	ageChart.resize();
	technicalChart.resize();
	playChart.resize();
	positionChart.resize();
	airPlaneChart.resize();
});
