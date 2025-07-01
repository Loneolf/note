// 收益贡献 三个图表

import { decimalFormat, formatStr, getColor } from "../util.js";
import { mockGetData } from "../mockData/index.js";

export default async function getContriData(vm) {
	const data = (await mockGetData("contriData")).data;
	// console.log("aaagetContriData", data);
	if (!data) return;
	// 盈利与亏损简易视图
	let lossAmt = Math.abs(data.loss_amount);
	let allPreCent = lossAmt + Number(data.profit_amount);
	let profitData = [
		{
			type: "profit",
			num: data.profit_count,
			amount: Number(data.profit_amount),
			precent: data.profit_amount / allPreCent,
			common: "profit-loss",
		},
		{
			type: "loss",
			num: data.loss_count,
			amount: Number(lossAmt),
			precent: lossAmt / allPreCent,
			common: "profit-loss",
		},
	];
	vm.profitDetail = profitData;
	createProfitDetailChart(vm, profitData);

	// 具体盈利亏损产品详情视图
	let contrlData = {
		profit: dealContrlData(
			data.profit_name_str,
			data.profit_amount_str,
			data.profit_percent_str,
			data.profit_amount
		),
		loss: dealContrlData(
			data.loss_name_str,
			data.loss_amount_str,
			data.loss_percent_str,
			data.loss_amount
		),
	};
	function dealContrlData(nameStr, amtStr, percentStr, allAmt) {
		let res = [];
		let nameArr = formatStr(nameStr);
		let amtArr = formatStr(amtStr);
		let percentArr = formatStr(percentStr);
		let sumAmt = 0;
		let len = nameArr.length;
		for (let i = 0; i < len; i++) {
			sumAmt += Number(amtArr[i]);
			res.push({
				name: nameArr[i],
				amount: amtArr[i],
				ratio: percentArr[i],
				chartRatio: Number((amtArr[i] / allAmt).toFixed(2)),
			});
		}
		return res;
	}
	vm.contriDetail = contrlData;
	// console.log('aaa2333contri', JSON.stringify(contrlData))
	createContriDetailChart(vm, contrlData);
}
function createProfitDetailChart(vm, data) {
	vm.profitDetailChart && vm.profitDetailChart.clear();
	vm.profitDetailChart = new F2.Chart({
		id: "profitDetailChart",
		pixelRatio: window.devicePixelRatio,
		padding: ["auto", 0, 0, 0],
	}).scale({ type: { range: [0.46, 0.54] } });
	//加载数据、设置x轴数据横向展示范围、不显示图例
	vm.profitDetailChart.source(data);
	vm.profitDetailChart.axis(false);
	vm.profitDetailChart.tooltip(false);
	vm.profitDetailChart.legend(false);
	vm.profitDetailChart
		.interval()
		.position("type*num")
		.color("type", function (value) {
			if (value == "profit") {
				return "#F0BF8C";
			} else if (value == "loss") {
				return "#7DAFF9";
			}
		})
		.size(20);
    data.forEach(function (v, k) {
		let index = v.type === "profit" ? 0 : 1;
		if (v.num) {
			vm.profitDetailChart.guide().html({
				position: [v.type, v.num],
				html:
					'<span class="sygx-guide ' +
					(index ? "sygx-loss" : "sygx-profit") +
					'">' +
					(index ? "亏损" : "盈利") +
					"<i>" +
					v.num +
					"</i>只</span>",
				alignX: index ? "left" : "right",
				alignY: "bottom",
				offsetX: index ? -10 : 10,
				offsetY: -4,
			});
		}
	});
	vm.profitDetailChart.render();

	vm.contriHoriChart && vm.contriHoriChart.clear();
	vm.contriHoriChart = new F2.Chart({
		id: "contriHoriChart",
		pixelRatio: window.devicePixelRatio,
		padding: [0, 15, 0, 15],
	}).scale({ type: { range: [0, 0.5] } });
	vm.contriHoriChart.source(data);
	vm.contriHoriChart.coord({
		transposed: true,
	});
	vm.contriHoriChart.axis(false);
	vm.contriHoriChart.tooltip(false);
	vm.contriHoriChart.legend(false);
	vm.contriHoriChart
		.interval()
		.position("common*precent")
		.color("type", function (value) {
			if (value == "profit") {
				return "#F0BF8C";
			} else if (value == "loss") {
				return "#7DAFF9";
			}
		})
		.adjust("stack")
		.size(5);
    data.forEach(function (v) {
		let amt = decimalFormat(v.amount);
		// console.log('aaaaamt', amt, v.amount)
		if (v.type === "profit") {
			vm.contriHoriChart.guide().html({
				position: [-2, 0],
				html:
					'<span class="horiText">盈利<i class="normal-red">' +
					amt +
					"</i>元</span>",
				alignX: "left",
				alignY: "bottom",
			});
		} else if (v.type === "loss") {
			vm.contriHoriChart.guide().html({
				position: [-2, 1],
				html:
					'<span class="horiText textRight">亏损<i class="normal-green">' +
					amt +
					"</i>元</span>",
				alignX: "right",
				alignY: "bottom",
			});
		}
	});
	vm.contriHoriChart.render();
}
export function createContriDetailChart(vm, data) {
	let type = vm.contriIndex;
	if (!data[type].length) {
		return;
	}
	let colorMap = {};
	data[type].forEach(function (v, k) {
		colorMap[v.name] = getColor(k);
	});
	vm.colorMap = colorMap;
	vm.contriDetailChart && vm.contriDetailChart.clear();
	vm.contriDetailChart = new F2.Chart({
		id: "contriDetailChart",
		pixelRatio: window.devicePixelRatio,
	});
	vm.contriDetailChart.source(data[type]);
	vm.contriDetailChart.coord("polar", {
		transposed: true,
		innerRadius: 0.55,
		radius: 1,
	});
	vm.contriDetailChart.axis(false);
	vm.contriDetailChart.legend(false);
	vm.contriDetailChart.tooltip(false);
	vm.contriDetailChart
		.interval()
		.position("1*chartRatio")
		.color("name", function (val) {
			return colorMap[val];
		})
		.adjust("stack")
		.style({
			lineWidth: 1,
			stroke: "#FFFFFF",
		});
	vm.contriDetailChart.render();

	// 绘制内阴影
	let frontPlot = vm.contriDetailChart.get("frontPlot");
	let coord = vm.contriDetailChart.get("coord"); // 获取坐标系对象
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
}
