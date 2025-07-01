// 持仓产品净值走势
import { decimalFormat, formatDate, formatStr, getColor } from "../util.js";
import { mockGetData } from "../mockData/index.js";
import { typeMap } from "./config.js";

export default async function getHoldNetData(vm) {
	const data = (await mockGetData("holdNetData"))[vm.holdNetChartDateValue];
	// console.log("aaagetHoldNetData", data);
	if (!data) return;
	vm.holdNetUpdate = data.update_dt;
	let holdNetAssetData = {}; // 处理后的所有图表数据，按照资产类型分类
	let holdNetAssetTypeList = []; // 有哪些资产类别
	let holdNetTipsTitle = {}; // 图标上面的产品信息展示
	// 数据遍历，处理数据
	data.asset_list.forEach((item, index) => {
		// 通过遍历将所有资产类别存储
		let assetName = typeMap[item.asset_type];
		holdNetAssetTypeList.push(assetName);
		holdNetTipsTitle[assetName] = [];
		// 粗略处理数据存放，将时间收益数据字符串split后，存放到dataArr中，有多少个产品dataArr中就有多少item
		let dataArr = [];
		// 考虑到产品起止时间的不同，按照最大长度的产品进行遍历 maxLen
		let maxLen = 0;
		item.comp_list.forEach((si, i) => {
            // console.log('aaaitem', si)
			let temData = {
				assetName: assetName, // 资产类别名称
				comp_name: si.comp_name, // 产品名称
				dateArr: formatStr(si.unitval_date, ",", true), // 时间
				valueArr: formatStr(si.comp_unitval_str, ",", true), // 收益
			};
			holdNetTipsTitle[assetName].push({
				prodName: si.comp_name,
				prodValue: temData.valueArr[temData.valueArr.length - 1],
				color: getColor(i),
			});
			dataArr.push(temData);
			vm.holdNetMoreColorMap[si.comp_name] = getColor(i);
			if (temData["dateArr"].length > maxLen) {
				maxLen = temData["dateArr"].length;
			}
		});
		let chartArr = [];
		// 按照最大产品时间线遍历，每次遍历会遍历每个产品，并将对应的数据放到chartArr中，最终按照资产存放到holdNetAssetData中
		for (let i = 0; i < maxLen; i++) {
			dataArr.forEach( di => {
                // console.log('aaaadi', di)
				if (!di.dateArr[i]) return;
				chartArr.push({
					date: formatDate(di.dateArr[i]),
					value: di.valueArr[i],
					type: di.comp_name,
				});
			});
		}
		holdNetAssetData[assetName] = chartArr;
	});
	vm.holdNetAssetTypeList = holdNetAssetTypeList;
	vm.holdNetAssetTypeSelect = vm.holdNetAssetTypeList[0];
	vm.holdNetAssetData = holdNetAssetData;
	vm.holdNetTipsTitle = holdNetTipsTitle;
	let drawData = holdNetAssetData[vm.holdNetAssetTypeSelect];
	if (!drawData.length) {
        return;
	}
    // console.log(JSON.stringify(drawData));
	drawHoldNetChart(vm, drawData);
}
export function drawHoldNetChart(vm, data) {
	// console.log('aaadrawHoldNetChart', JSON.stringify(data))
    vm.holdNetChart && vm.holdNetChart.clear();
    vm.holdNetChart = new F2.Chart({
        id: "holdNetChart",
        pixelRatio: window.devicePixelRatio,
        padding: [30, 30, "auto", 60],
    });
    vm.holdNetChart
        .source(data, { value: { tickCount: 6 } })
        .legend(false)
        .legend(false);
    vm.holdNetChart.scale("date", {
        type: "timeCat",
        tickCount: 2,
    });
    vm.holdNetChart.axis("date", {
        line: { lineWidth: 1 },
        label(text, index, total) {
            let textCfg = {};
            if (index === 0) {
                textCfg.textAlign = "left";
            } else if (index === total - 1) {
                textCfg.textAlign = "right";
            }
            return textCfg;
        },
    });
    vm.holdNetChart.axis("value", {
        label(text) {
            return { text: decimalFormat(text) };
        },
    });
    vm.holdNetChart.tooltip({
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
        onShow(obj) {
            this.showTooltipMarker = true; //显示自带tips数据位置
            let x = obj.items[0].x; //获得x轴坐标
            let currentTitle =
                vm.holdNetTipsTitle[vm.holdNetAssetTypeSelect];
            obj.items.forEach((i, ix) => {
                currentTitle[ix].prodValue = i.value;
            });
            vm.$refs.holdNetTipsDateFlag.style.left =
                vm.$refs.holdNetTipsFlag.style.left = x + "px";
            vm.holdNetTipsDateFlag = true;
            vm.holdNetTipsDate = obj.items[0].title; //设置滑动日期数据
        },
        onHide() {
            vm.holdNetTipsDateFlag = false;
        },
    });
    vm.holdNetChart
        .line()
        .position("date*value")
        .color("type", (item) => {
            return vm.holdNetMoreColorMap[item];
        })
        .size("type", [1]);
    vm.holdNetChart.render();
}
