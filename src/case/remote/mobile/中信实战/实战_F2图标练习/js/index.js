import { formatDate, decimalFormat } from "./util.js";
import AccumProfit from "./componet/accontProfit.js";
import NetValue from "./componet/netValue.js";
import AssetDis from "./componet/assetDis.js";
import getRiskProfit from "./componet/riskProfit.js";
import HoldNet, { drawHoldNetChart } from "./componet/holdNet.js";
import ProfitContrl, {createContriDetailChart} from "./componet/profitContrl.js";
import MarketMonthConfig, { changeShowText } from "./componet/marketMonthConfig.js";

new Vue({
	el: "#container",
	data: {
		// 总收益走势图
		totalAmount: "",
		holdPl: "",
		totalPl: "",
		profitChart: "",
		yieldTipsFlag: false, //收益统计收益率tips显隐标识
		yieldTipsData: "", //收益统计收益率tips累计收益
		yieldTipsDate: "", //普通账户收益率tips日期文本
		chartDateNav: [
			{ name: "近3月", val: "3m" },
			{ name: "近半年", val: "6m" },
			{ name: "近1年", val: "1y" },
			{ name: "今年以来", val: "yd" },
		],
		chartDateValue: "3m",

		// 产品列表
		productsList: [
			{ name: "财富私享投资12财富私享投资12号FOF号FOF" },
			{ name: "信享臻选" },
			{ name: "财富私享投资14号FOF" },
		],

		// 净值走势图
		netValueChart: "",
		netValueTipsFlag: false, //收益统计收益率tips显隐标识
		netValueTipsData: "", //收益统计收益率tips累计收益
		netValueTipsDate: "", //普通账户收益率tips日期文本
		netValueChartDateNav: [
			{ name: "近1月", val: "MONTH" },
			{ name: "近三月", val: "SEASON" },
			{ name: "近六月", val: "HALF_YEAR" },
		],
		netValueMoreDateNav: [
			{ name: "今年以来", val: "THIS_YEAR" },
			{ name: "近一年", val: "YEAR" },
			{ name: "近三年", val: "THREE_YEAR" },
			{ name: "成立以来", val: "ALL" },
		], // TWO_YEAR: 近两年 FIVE_YEAR：近五年
		netValueChartDateValue: "MONTH",
		netValueMoreDateName: "更多", //图表更多table默认名称
		netValueMorePopFlag: false, //更多日期弹窗显隐标识

		// 资产配置图
		assetsDisChart: "",
		assetsDisUpdata: "",
		assetsList: [],

		// 持仓产品净值走势
		holdNetChart: "",
		holdNetUpdate: "", // 更新时间
		holdNetAssetTypeList: [], // 资产类型列表
		holdNetAssetTypeSelect: "", // 选中的资产类型
		holdNetAssetData: {}, // 资产数据
		holdNetTipsTitle: {},
		holdNetTipsDateFlag: false, // 日期提示，按压时显示
		holdNetTipsDate: "", //tips日期文本
		holdNetChartDateNav: [
			{ name: "近一月", val: "1m" },
			{ name: "近三月", val: "3m" },
			{ name: "近六月", val: "6m" },
		],
		holdNetMoreDateNav: [
			{ name: "今年以来", val: "yd" },
			{ name: "近一年", val: "1y" },
			{ name: "近两年", val: "2y" },
			{ name: "成立以来", val: "tot" },
		],
		holdNetChartDateValue: "1m",
		holdNetMoreDateName: "更多", //图表更多table默认名称
		holdNetMorePop: false, //更多日期弹窗显隐标识
		holdNetMoreColorMap: {},

		// 收益贡献
		contriHoriChart: "",
		contriDetailChart: "",
		contrlDate: "2023年9月8日",
		contriDateNav: [
			{ name: "近一月", val: "1m" },
			{ name: "近三月", val: "3m" },
			{ name: "近半年", val: "6m" },
			{ name: "今年以来", val: "yd" },
		],
		contriNavValue: "3m",
		contriIndex: "profit",
		contriDetail: { profit: [], loss: [] },
		sygxIndex: 0,
		colorMap: {},

		// 月度配置观点数据
		audio_url: "", // 音频地址
		isAudioPlay: false,
		MonthUpdate: "", // 更新时间
		analyze_market: [], // 债券、股票、量化具体详情

		// 风险收益
		riskYearArr: [["oneYear", "近1年"], ["twoYear", "近2年"],[ "threeYear", "近3年"], ["all", "成立以来"]], // "oneYearElite",
		reskTypeArr: [
			[ "Volatility", "波动率" ],
			[ "sharpe", "夏普率" ],
			[ "MaxDrawdown", "最大回测" ],
			[ "IncomeReversion", "收益回测比" ],
		],
		riskData: [],
	},
	created() {},
	mounted() {
		// 持仓收益及走势
		AccumProfit(this);
		// 净值走势
		NetValue(this);
		// 资产配置
		AssetDis(this);
		// 持仓产品净值
		HoldNet(this);
		// 收益贡献
		ProfitContrl(this);
		// 市场月度观点
		MarketMonthConfig(this);
		// 风险收益指标
		getRiskProfit(this);
		this.initAudio()
	},
	watch: {},
	methods: {
		fnColor(data) {
			if (!data) return { black: true };
			if (parseFloat(data) > 0) return { red: true };
			else if (parseFloat(data) < 0) return { green: true };
			else return { black: true };
		},
		decimalFormat,
		// 收益走势切换时间维度
		chartDateNavSwitch(v) {
			if (this.chartDateValue == v.val) return;
			this.chartDateValue = v.val;
			AccumProfit(this);
		},

		// 净值走势切换时间维度
		netValueChartDateNavSwitch(v) {
			if (this.netValueChartDateValue == v.val) return;
			this.netValueChartDateValue = v.val;
			this.netValueMoreDateName = "更多";
			NetValue(this);
		},
		// 净值更多弹框切换
		switchNetValuePop(isPop) {
			this.netValueMorePopFlag = isPop;
		},
		netValuePopSwitch(v) {
			this.netValueChartDateValue = v.val;
			this.netValueMoreDateName = v.name;
			this.switchNetValuePop(false);
			NetValue(this);
		},

		holdNetChartDateNavSwitch(position, item) {
			if (position === "type" && item !== this.holdNetAssetTypeSelect) {
				this.holdNetAssetTypeSelect = item;
				drawHoldNetChart(this, this.holdNetAssetData[item]);
				return;
			}
			if (this.holdNetChartDateValue === item.val) return;
			this.holdNetChartDateValue = item.val;
			this.holdNetMoreDateName = "更多";
			HoldNet(this);
		},
		setHoldNetPop(popDate) {
			this.holdNetMorePop = popDate;
		},
		holdNetMorePopSwitch(v) {
			this.holdNetChartDateValue = v.val;
			this.holdNetMoreDateName = v.name;
			HoldNet(this);
			this.setHoldNetPop(false);
		},

		// 收益贡献
		switchZCPZ: function switchZCPZ(item) {
			if (item.val === this.contriNavValue) return;
			this.contriNavValue = item.val;
			ProfitContrl(this);
		},
		switchZCPXDetail(e) {
			var index = e.index;
			this.contriIndex = index;
			createContriDetailChart(this, this.contriDetail);
		},

		initAudio() {
			if(!ydpzAudio) return
			ydpzAudio.addEventListener("play", this.changePlay);
			ydpzAudio.addEventListener("pause", this.changePlay);
		},
		changePlay(e){
			this.isAudioPlay = e.type === 'play'
		},
		// 文资展开收起
		foldTextHandle(item, index) {
			this.analyze_market[index] = changeShowText(item);
		},
	},
});
