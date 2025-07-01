// 风险收益指标

import { mockGetData } from "../mockData/index.js";

export default async function getRiskProfit(vm) {
	const data = (await mockGetData("riskProfit")).data;
	// console.log("aaagetRiskProfit", data);
	if (!data) return;
    var arr = []
    vm.reskTypeArr.forEach(function (tItem) {
        var temObj = {name: tItem[1]}
        vm.riskYearArr.forEach( function(yItem) {
            var temStr = yItem[0] +  tItem[0]
            temObj[yItem[0]] = data[temStr] ? data[temStr].toFixed(2) + '%' : '--'
        })
        arr.push(temObj)
    })
    // console.log(JSON.stringify(arr))
    vm.riskData = arr
}