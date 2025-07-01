import {getRungeNum, mathRand} from '../util.js'

const base3 = {
	update_dt: "2023-07-01",
	prod_name: "信享臻选",
	prod_code: "00001",
	asset_list: [
		{
			asset_type: "0",
			asset_percent: "1000.99/sum(所有成分资产市值)",
			asset_mkt: "1000.99",
			comp_list: [
				{
					comp_name: "产品1",
					comp_code: "000001",
					comp_mkt: "1000.00",
				},
			],
		},
		{
			asset_type: "1",
			asset_percent: "2000.00/sum(所有成分资产市值)",
			asset_mkt: "2000.00",
			comp_list: [
				{
					comp_name: "产品2",
					comp_code: "000002",
					comp_mkt: "2000.00",
				},
			],
		}
	],
};

export const assetsDisData  = getMockData(base3, 1786786, 4, 11);

// money: 金钱总额， 
// comNum 资产分类， 
// itemNum 一共有多少个产品 (每个资产可能有一到多个产品)
function getMockData(baseData, money, comNum, itemNum) {
    let moneyArr = getRungeNum(money, itemNum,  money/(itemNum * 4), (money * 4) / itemNum)
    let groupArr = getRungeNum(itemNum, comNum, itemNum / (comNum * 2), (itemNum * 2) / comNum, true)
    // console.log('aaaaamoneuyAr', moneyArr, groupArr)
    let assetItem = groupArr.pop()
    let assetSum = 0
    let asset_list = [], temComList = []
    for (let i = 0; i < itemNum; i++) {
        let amt = moneyArr.pop()
        assetSum += Number(amt)
        assetItem -= 1 
        temComList.push({
            comp_name: `产品${i}`,
            comp_code: `00000${i}`,
            comp_mkt: amt,
        })
        // console.log('aaa2333', JSON.parse(JSON.stringify(temComList)))
        if (assetItem === 0) {
            asset_list.push({
                asset_type: mathRand(1,4),
                asset_percent: (assetSum * 100 / money).toFixed(2) ,
                asset_mkt: assetSum.toFixed(2),
                comp_list: JSON.parse(JSON.stringify(temComList))
            })
            assetItem = groupArr.pop()
            assetSum = 0
            temComList = []
        }
    }
    baseData.asset_list = asset_list
    return baseData
}
