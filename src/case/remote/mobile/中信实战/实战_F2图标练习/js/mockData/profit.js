// 收益走势
import {stocksMock, getMonthDays} from '../util.js'

//  总收益
let accontProfitbase = {
    total_amount: "1001000.11",
    hold_pl: "1000.11",
    total_pl: "20000.11",
    period_pl: {
        date_arr_str: "",
        pl_arr_str: "",
    },
};
export const accontProfitData = getMockData(accontProfitbase, [3, 6, 7, 12], 500000)

// 单支产品收益
let productProfitBase = {
    "update_dt": "2023-07-01",
    "prod_name": "信享臻选",
    "prod_code": "00001",
    "total_amount": "1001000.11",
    "hold_pl": "1000.11",
    "total_pl": "20000.11",
    "period_pl": {
        "date_arr_str": "20230101,20230102,...",
        "pl_arr_str": "200.01,-100.23,..."
    }
};
export const productProfitData = getMockData(productProfitBase, [3, 7, 12, 24], 100000)

// 获取mock数据，数组中是获取几个月的数据，例如[3,6,9,12] 等, isCost: 是纯收益走势还是包含本金的走势
function getMockData(baseData, monthArr, baseAmont, isCost) {
    const mockResult = {};
    const MathMonth = monthArr[monthArr.length - 1];
    // 所以日期数据
    let allMonthData = getMonthDays(monthArr, MathMonth);
    let allProfit = stocksMock(baseAmont, allMonthData[MathMonth].allDay, isCost);

    let len = allProfit.length;
    for (let i = 0; i < monthArr.length; i++) {
        const { dayStr, allDay } = allMonthData[monthArr[i]];
        baseData.period_pl.pl_arr_str = allProfit.slice(len - allDay, len).join();
        baseData.period_pl.date_arr_str = dayStr;

        mockResult[monthArr[i]] = JSON.parse(JSON.stringify(baseData));
    }
    // console.log(mockResult);
    return mockResult;
}