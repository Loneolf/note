import { getMonthDays, stocksMock, getRungeNum } from '../util.js'

const baseData = {
	update_dt: "2023-07-01",
	prod_name: "信享臻选",
	prod_code: "00001",
	asset_list: [
		{
			asset_type: "0",
			comp_list: [
				{
					comp_name: "产品名1",
					comp_unitval_str: "0.85,0.85...",
					unitval_date: "20230101,20230108...",
				},
				{
					comp_name: "产品名2",
					comp_unitval_str: "0.85,0.85...",
					unitval_date: "20230101,20230108...",
				},
			],
		},
	],
};
const monthArr = [1, 3, 6, 7, 12, 36, 48]
const AmontArr = getRungeNum(1000000, 12, 50000, 300000, true)
export const holdNetData = getMockData(baseData, monthArr, AmontArr, 4, false)
// monthArr 数组中是获取几个月的数据，例如[3,6,9,12] 等, 
// baseAmontArr 几个产品的基准金额，有三个就是是三个产品
// isCost: 是纯收益走势还是包含本金的走势
function getMockData(baseData, monthArr, baseAmontArr, comNum, isCost) {
    const mockResult = {};
    // 最大月数
    const MathMonth = monthArr[monthArr.length - 1];
    // 所有日期数据
    let allMonthData = getMonthDays(monthArr, MathMonth);
    // 所有利润数据
    let allProfitArr = []
    let alen = baseAmontArr.length
    // 随机分组
    const groupArr = getRungeNum(alen, comNum, alen / (comNum * 2), (alen * 2) / comNum, true)
    // console.log(JSON.stringify(groupArr))
    let assetItem = groupArr.pop()
    let asset_list = [], temComList = []
    let asset_typeArr = [7,3,5,1]
    for (let i = 0; i < alen; i++) {
        let profitItem = stocksMock(baseAmontArr[i], allMonthData[MathMonth].allDay, isCost)
        allProfitArr.push(profitItem)
        assetItem -= 1 
        temComList.push({
            comp_name: `产品${i}`,
            comp_unitval_str: '',
            unitval_date: '',
        })
        if (assetItem === 0) {
            asset_list.push({
                asset_type: asset_typeArr.pop(),
                comp_list: JSON.parse(JSON.stringify(temComList))
            })
            assetItem = groupArr.pop()
            temComList = []
        }
    }
    // console.log('aaaaprofit', allProfitArr)
    for (let j = 0; j < monthArr.length; j++) {
        const { dayStr, allDay } = allMonthData[monthArr[j]];
        let num = 0
        asset_list.forEach(item => {
            item.comp_list.forEach(sonItem => {
                let profitItem = allProfitArr[num];
                num += 1
                sonItem.comp_unitval_str = profitItem.slice(profitItem.length - allDay, profitItem.length).join()
                sonItem.unitval_date = dayStr
            })
        })
        baseData.asset_list = asset_list
        mockResult[monthArr[j]] = JSON.parse(JSON.stringify(baseData));
    }
    // console.log(mockResult);
    return mockResult;
}
