import { decimalFormat, formatDate, formatStr } from "../util.js";
import { mockGetData } from "../mockData/index.js";

export default async function getAccumProfitData(vm) {
	const data = (await mockGetData("accumProfitData"))[vm.chartDateValue];
	const { total_amount, hold_pl, total_pl, period_pl } = data;
	vm.totalAmount = total_amount;
	vm.holdPl = hold_pl;
	vm.totalPl = total_pl;
	const chartData = {
		dateArr: formatStr(period_pl.date_arr_str, ",", false, true),
		amtArr: formatStr(period_pl.pl_arr_str, ",", true),
	};
	let arr = [];
	for (let i = 0; i < chartData.dateArr.length; i++) {
		arr.push({
			date: chartData.dateArr[i] + "",
			amt: chartData.amtArr[i],
			type: "累计收益",
		});
	}
	if (!arr.length) {
		return;
	}
	// console.log("aaa2333", JSON.stringify(arr));
	// 默认显示最后一天的累计收益
	const lastItem = arr[arr.length - 1];
	vm.yieldTipsData = decimalFormat(lastItem.amt, true); //回显我的账户数据
	vm.yieldTipsDate = formatDate(lastItem.date); //设置滑动日期数据
	createProfitChart(vm, arr);
}

function createProfitChart(vm, data) {
	// console.log('aaa23333', JSON.stringify(data))
	vm.profitChart && vm.profitChart.clear();
	vm.profitChart = new F2.Chart({
		id: "profitChart",
		pixelRatio: window.devicePixelRatio,
		padding: [10, 30, "auto", 70],
		// height: 175
	});
	//加载数据、设置x轴数据横向展示范围、不显示图例
	vm.profitChart
		.source(data, {
			amt: { tickCount: 6 },
			date: { tickCount: 2, range: [0, 1] },
		})
		.legend(false);
	//设置滑动提示杆
	vm.profitChart.tooltip({
		alwaysShow: true, // 当移出触发区域，是否仍显示提示框内容
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
			let x = obj.items[0].x; //获得x轴坐标
			let value = obj.items[0].value; //获得y轴数据
			vm.yieldTipsFlag = true;
			vm.$refs.yieldTipsFlag.style.left = obj.items[0].x + "px"; //数据、日期文本跟随tips线X轴移动
			vm.yieldTipsData = decimalFormat(obj.items[0].value); //回显我的账户数据
			vm.yieldTipsDate = formatDate(obj.items[0].title); //设置滑动日期数据
		},
		onHide: function onHide() {
			vm.yieldTipsFlag = false;
		},
	});
	//设置x轴数据底线显隐及文本描述、位置
	vm.profitChart.axis("date", {
		// line: null,
		label: function label(text, index, total) {
			let cfg = {};
			if (index === 0) {
				cfg.text = formatDate(text);
				cfg.textAlign = "left";
			}
			if (index === total - 1) {
				cfg.text = formatDate(text);
				cfg.textAlign = "right";
			}
			// console.log('aaalabelX', cfg)
			return cfg;
		},
	});
	vm.profitChart.axis("amt", {
		label: function label(text) {
			return { text: decimalFormat(text) };
		},
	});
	vm.profitChart
		.line()
		.position("date*amt")
		.color("type", ["#C8893B"])
		.size("type", [1]);
	// 阴影效果
	vm.profitChart
		.area({ startOnZero: false })
		.position("date*amt")
		.color("type", ["rgba(200,137,59,0.5)"])
		.size("type", [1])
		.shape("smooth");
	vm.profitChart.render();
}
