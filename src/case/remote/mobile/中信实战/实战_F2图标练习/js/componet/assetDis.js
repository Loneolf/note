// 资产配置

import { formatDate } from "../util.js";
import { mockGetData } from "../mockData/index.js";
import {typeMap} from './config.js'

export default async function getAssetsDis(vm) {
	const data = await mockGetData("assetsDisData");
	// console.log("aaagetAssetsDis", data);
	let chartData = [];
	data.asset_list.forEach(function (item) {
		item.asset_name = typeMap[item.asset_type];
		chartData.push({
			amount: Number(item.asset_mkt),
			memo: item.asset_name,
		});
	});
	// console.log('aaaarrr', chartData)
	if (!chartData.length) {
		return;
	}
	vm.assetsDisUpdata = formatDate(data.update_dt, true, "charactDate");
	vm.assetsList = data.asset_list;
	createAssetsDisChart(vm, chartData);
}
function createAssetsDisChart(vm, data) {
	vm.assetsDisChart && vm.assetsDisChart.clear();
	vm.assetsDisChart = new F2.Chart({
		id: "assetsDisChart",
		pixelRatio: window.devicePixelRatio,
	});
	vm.assetsDisChart.source(data);
	vm.assetsDisChart.coord("polar", {
		transposed: true,
		innerRadius: 0.55,
		radius: 1,
	});
	vm.assetsDisChart.axis(false);
	vm.assetsDisChart.tooltip(false);
	vm.assetsDisChart.legend(false);
	// vm.assetsDisChart.guide().html({
	//   position: ['50%', '50%'],
	//   html: '<div style="width: 100px;height: 20px;text-align: center;line-height: 20px;" id="textContent"></div>'
	// });
	vm.assetsDisChart
		.interval()
		.position("1*amount")
		.color("memo", ["#F0BF8C", "#658AF8", "#FF9860", "#E5E5E5", "#FF7070"])
		.adjust("stack")
		.style({
			lineWidth: 1,
			stroke: "#FFFFFF",
		});
	vm.assetsDisChart.render();

	// 绘制内阴影
	let frontPlot = vm.assetsDisChart.get("frontPlot");
	let coord = vm.assetsDisChart.get("coord"); // 获取坐标系对象
	frontPlot.addShape("sector", {
		attrs: {
			x: coord.center.x,
			y: coord.center.y,
			r: coord.circleRadius * coord.innerRadius * 1.2, // 全半径
			r0: coord.circleRadius * coord.innerRadius,
			fill: "#000",
			opacity: 0.15,
		},
	});
	vm.assetsDisChart.render();
}
