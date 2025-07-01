import { accontProfitData } from './profit.js'
import { netValueData } from './netValue.js'
import { holdNetData } from './holdNet.js'
import { assetsDisData } from './assetsDis.js'


const timeMap1 = { 1: "1m", 3: "3m", 6: "6m", 12: "1y", 24: "2y", 36: "3y", 48: "tot", 7: "yd" };
const timeMap2 = { 1: "MONTH", 3: "SEASON", 6: "HALF_YEAR", 12: "YEAR", 36: "THREE_YEAR", 48: "ALL", 7: "THIS_YEAR" };

// 获取市场月度配置
const MarketMonthConfig = {
	update_dt: "2023-07-24",
	audio_url: "./img/test.mp3",
	bond_schg:
		"6月降息落地后债市止盈情绪升温，，中债3年AAA中票到期收益率下行10BP。6月降息落地后债市止盈情绪升温，，中债3年AAA中票到期收益率下行10BP。6月降息落地后债市止盈情绪升温，，中债3年AAA中票到期收益率下行10BP。6月降息落地后债市止盈情绪升温，，中债3年AAA中票到期收益率下行10BP。6月降息落地后债市止盈情绪升温，，中债3年AAA中票到期收益率下行10BP。",
	stk_schg:
		"6月A股先扬后抑，18个行业上涨，12个行业下跌。具体来看，家电涨幅最大（11.59%），通信（10.38%）、汽车（9.46%）次之；医药跌幅最大（-4.93%），消费者服务（-4.59%）、电力及公用事业（-2.56%）跌幅居后。6月降息落地后债市止盈情绪升温，，中债3年AAA中票到期收益率下行10BP。6月降息落地后债市止盈情绪升温，，中债3年AAA中票到期收益率下行10BP。6月降息落地后债市止盈情绪升温，，中债3年AAA中票到期收益率下行10BP。",
	lh_schg:
		" 商品市场方面，言，大盘成长和中盘成长表现稳健。本次OMO先于MLF调降，但短期看仍有配置价值。此外，考虑将绝对收益率偏低和信用利差较低的信用品种逐步置换到利率债或二永品种。本次OMO先于MLF调降，但短期看仍有配置价值。此外，考虑将绝对收益率偏低和信用利差较低的信用品种逐步置换到利率债或二永品种。",
	bond_fm:
		"本次OMO先于MLF调降，但短期看仍有配置价值。此外，考虑将绝对收益率偏低和信用利差较低的信用品种逐步置换到利率债或二永品种。",
	stk_fm: "当前A股市场整体估值具备吸引力，、电力设备及新能源。",
	lh_fm: " 商品市场方面，，同时关注中报业绩超预期以及超跌反弹的板块机会。",
};

// 风险收益指标
const riskProfit = {
	code: "0",
	msg: "成功",
	data: {
		allIncomeReversion: -0.7786,
		allMaxDrawdown: 15.49,
		allsharpe: -1.1508,
		allvolatility: 2.44,
		oneYearEliteIncomeReversion: 4.638,
		oneYearEliteMaxDrawdown: 16.9805,
		oneYearElitesharpe: 2.4245,
		oneYearEliteVolatility: 1.3834,
		oneYearIncomeReversion: null, // 近一年收益回撤比
		oneYearMaxDrawdown: null, // 近一年最大回撤
		oneYearsharpe: null, // 近一年夏普比率
		oneYearVolatility: null, // 近一年波动率
		threeYearIncomeReversion: null,
		threeYearMaxDrawdown: null,
		threeYearsharpe: null, 
		threeYearVolatility: null,
		twoYearIncomeReversion: null,
		twoYearMaxDrawdown: null,
		twoYearsharpe: null,
		twoYearVolatility: null,
	}
};

// 收益贡献
const contriData = {
	code: "0",
	msg: "成功",
	data: {
		loss_amount: "-325643.10",
		update_dt: "2023-07-24",
		loss_amount_str:
			"0.00,0.00,0.00,0.00,0.00,0.00,-9138.82,-11129.13,-21754.43,-32640.78,-72931.49,-178048.45",
		loss_count: 12,
		loss_name_str: "m22,m0,m7,m4,m2,m1,m5,m13,m6,m14,m17,m9",
		loss_percent_str: "0,0,0,0,0,0,0,0,0,0,-0.01,-0.01",
		prod_code: "PD-AMC-2019-00614",
		prod_name: "财富私享投资29号FOF",
		profit_amount: "506268.95",
		profit_amount_str:
			"169912.53,73910.48,57494.24,53570.65,41677.24,37669.51,35018.59,10937.84,10574.68,10177.86,5325.33,0.00,0.00,0.00,0.00,0.00,0.00",
		profit_count: 17,
		profit_name_str:
			"m20,m19,m8,m12,m16,m18,m15,m11,m3,m10,m21,m22,m0,m7,m4,m2,m1",
		profit_percent_str: "0.01,0.01,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0",
	},
};
const keyObj = {
    // 获取持仓收益及走势
    accumProfitData: changeTimeKey(accontProfitData, timeMap1),
    // 获取产品收益及走势
    netValueData: changeTimeKey(netValueData, timeMap2),
    // 获取资产配置数据
    assetsDisData,
    // 持仓产品净值走势数据
    holdNetData: changeTimeKey(holdNetData, timeMap1),
    // 收益贡献
    contriData,
    // 获取市场月度配置
    MarketMonthConfig,
	// 风险收益指标
	riskProfit,
}

function changeTimeKey(obj, timeMap) {
    let res = {}
    for (const key in obj) {
        res[timeMap[key]] = obj[key]
    }
    return res
}

export function mockGetData(data) {
	return new Promise(function (resolve, reject) {
		setTimeout(function () {
			var result = keyObj[data];
			resolve(result);
		}, parseInt(Math.random() * 100) + 100);
	});
}
