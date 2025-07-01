import { decimalFormat, formatDate, formatStr } from "../util.js";
import { mockGetData } from "../mockData/index.js";

// 净值走势
export default async function getNetValueData(vm) {
	const data = (await mockGetData("netValueData"))[vm.netValueChartDateValue];
	// console.log("aaaagetNetValueData", data);
	let unitNetValueList = formatStr(data.unitNetValue, ",", true);
	let netValueList = formatStr(data.netValueDate, ",");
	let arr = [];
	for (let i = 0; i < unitNetValueList.length; i++) {
		if (!unitNetValueList[i]) {
			continue;
		}
		arr.push({
			x: netValueList[i] + "",
			y: unitNetValueList[i],
			type: "单位净值",
		});
	}

	if (!arr.length) {
		return;
	}
	let initValue = arr[arr.length - 1];
	vm.netValueTipsData = initValue.y;
	vm.netValueTipsDate = formatDate(initValue.x);
	createNetValueChart(vm, arr);
}
function createNetValueChart(vm, data) {
    // console.log(JSON.stringify(data))
	vm.netValueChart && vm.netValueChart.clear();
	vm.netValueChart = new F2.Chart({
		id: "netValueChart",
		pixelRatio: window.devicePixelRatio,
		padding: [10, 30, "auto", 60],
	});
	//加载数据、设置x轴数据横向展示范围、不显示图例
	vm.netValueChart
		.source(data, {
			y: { tickCount: 6, minTickInterval: 0.01 },
			x: { range: [0, 1] },
		})
		.legend(false);
	//设置滑动提示杆
	vm.netValueChart.tooltip({
		showCrosshairs: false, //不显示自带tips线
		showTooltipMarker: false, //不显示自带tips数据位置
		custom: true, //自定义tips,不显示自带tips对X轴数据提示
		triggerOff: "touchend", // 消失的触发行为，可自定义
		tooltipMarkerStyle: {
			fill: "#C8893B", // 设置 tooltipMarker 的样式
			stroke: "rgba(200,137,59,0.3)",
			lineWidth: 6,
			radius: 2,
		},
		onShow: function onShow(obj) {
			this.showTooltipMarker = true; //显示自带tips数据位置
			vm.netValueTipsFlag = true; //显示收益tips、数据文本、日期文本
			vm.$refs.netValueTipsFlag.style.left = obj.items[0].x + "px"; //数据、日期文本跟随tips线X轴移动
			vm.netValueTipsData = obj.items[0].value; //回显我的账户数据
			vm.netValueTipsDate = formatDate(obj.items[0].title); //设置滑动日期数据
		},
		onHide: function onHide() {
			vm.netValueTipsFlag = false; //显示收益率tips、数据文本、日期文本
		},
	});
	//设置x轴数据底线显隐及文本描述、位置
	vm.netValueChart.axis("x", {
		line: null,
		label: function label(text, index, total) {
			let cfg = { text: "" };
			if (index == 0) {
				cfg.text = formatDate(text);
				cfg.textAlign = "left";
			}
			if (index == total - 1) {
				cfg.text = formatDate(text);
				cfg.textAlign = "right";
			}
			return cfg;
		},
	});
	vm.netValueChart.axis("y", {
		label: function label(text) {
			return { text: decimalFormat(text) };
		},
	});
	vm.netValueChart
		.line()
		.position("x*y")
		.color("type", ["#C8893B"])
		.size("type", [1]);
	vm.netValueChart
		.area({ startOnZero: false })
		.position("x*y")
		.color("type", ["rgba(200,137,59,0.5)"])
		.size("type", [1])
		.shape("smooth");
	vm.netValueChart.render();
}
