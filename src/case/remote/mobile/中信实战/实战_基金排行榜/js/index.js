"use strict";

/**
 * 入口文件，在其中可以添加自定义功能函数
 */
define(function (require, exports, module) {
	var logic = require('./logic')
	var app;
	function init() {
		initVue();
	};
	//初始化
	function initVue() {
		app = new Vue({
			el: "#container",
			data: {
				mutualType: [], // 一二级tab选项
				mutualTypeSelect: 0, // 当前选中的一级tab 索引，默认为0
				showFilter: false, // 是否打开侧边过滤弹框
				filterCondition: [], // 筛选条件
				popType: 'normal', // 筛选展示内容, normal:正常筛选, other: 基金公司和基金主题筛选
				otherPopContent: {}, //  索引筛选数据，基金公司及基金主题筛选数据
				otherPopType: '', // 基金公司基金主题type
				timeList: [  // 收益周期时间区间选择
					{ text: '日涨幅', value: '1D' },
					{ text: '近一周', value: '1W' },
					{ text: '近一月', value: '1M' },
					{ text: '近半年', value: '6M' },
					{ text: '近一年', value: '1Y' },
					{ text: '今年以来', value: 'THISYEAR' },
				  ],
				incomePeriod: '1Y', // 收益周期，默认为一年

				chooseFilter: { // 已选择的过滤条件
					companyId: {name: '全部', value: ''}, // 基金公司
					buyStatus: {name: '可购', value: '1'}, // 开放状态
					riskLevel: {name: '全部', value: ''},  // 风险等级
					scale: {name: '全部', value: ''}, // 基金规模
					assetToPublic: {name: '全部', value: ''}, // 是否券商公募产品
					theme: {name: '不限', value: ''}, // 基金主题
					startMount: {name: '全部', value: ''}, // 起购金额
				}, 
				seachCondition: [], // 搜索条件,每个一级tab都有独自的搜索条件，互不影响
				filterMap: { // 已选择的过滤条件与筛选条件的映射
					'0': 'companyId',
					'1': 'buyStatus',
					'2': 'riskLevel',
					'3': 'scale',
					'4': 'assetToPublic',
					'5': 'theme',
					'6': 'startMount',
				},
				hasFilterItem: false, // 是否有筛选条件，当有一条筛选条件，改值为true，图标为红色图标
			},
			created: function created() {
				// 获取过滤配置
				logic.getFilter(this)
				// 获取基金公司列表
				logic.getFundcompany(this)
				// 获取基金主题列表
				logic.getTheme(this)
			},
			mounted: function mounted() {
				//遮罩隐藏
				document.getElementById('__hello').style.display = 'none'
			},
			methods: {
				// 加载数据
				loadData: function (loadType) {
					var temMut = this.mutualType[this.mutualTypeSelect]
					var temPageInfo = this.seachCondition[this.mutualTypeSelect]
					if (loadType === 'init') {
						temPageInfo.pageNo = 1
					}
					var params = {
						loadType: loadType,
						// 货币型基金的收益周期是七日年化，不需要传值，额外处理一下
						incomePeriod: this.mutualTypeSelect === 3 ? '' : this.incomePeriod, // 收益周期
						mutualType: temMut.value, // 一级选项
						mutualSecondType: temMut['mutual_second_type'][temMut.activeSi].value, // 二级tab选项
						pageNo:temPageInfo.pageNo, //页号
						pageSize:temPageInfo.pageSize, //每页数量
						companyId: this.chooseFilter.companyId.value,
						buyStatus: this.chooseFilter.buyStatus.value,
						riskLevel: this.chooseFilter.riskLevel.value,
						scale: this.chooseFilter.scale.value,
						assetToPublic: this.chooseFilter.assetToPublic.value,
						theme: this.chooseFilter.theme.value,
						startMount: this.chooseFilter.startMount.value,
					}
					// console.log('aaaparams', loadType, params)
					logic.getList(params, this)
				},

				// 一级tab 加载数据
				mutualChange: function (index) {
					if (this.mutualTypeSelect == index) return
					this.mutualTypeSelect = index
					// 二级tab滚动条初始化
					this.$refs.subMut.forEach(function(item) {
						item.scrollLeft = 0
					})
					if (this.mutualType[index].isLoadData && this.mutualType[index].activeSi === 0) return
					this.mutualType[index].isLoadData = true
					this.mutualType[index].activeSi = 0
					this.loadData('init')
				},
				// 二级tab 加载数据
				secondMutual: function (index, sindex) {
					this.mutualType[index].activeSi = sindex
					this.loadData('init')
					// 切换二级tab,将当前的列表滚动到最顶部
					this.$refs.listItem[index].scrollTo(0, 0)
				},
				// 是否展示过滤侧边弹框
				openShowFilter: function () {
					this.showFilter = true
					// 打开过滤条件时，需要将已选择的过滤条件重新赋值
					var that = this
					this.filterCondition.forEach(function (item, index) {
						var tem = that.chooseFilter[that.filterMap[index]]
						item.select = tem
						// 基金公司和基金主题右上角的文字需要额外赋值
						if (index === 0 || index === 5) {
							item.rightContent = tem.name
						}
					})
				},
				// 关闭弹层，popType置为normal
				popUpClose: function () {
					this.popType = 'normal'	
				},
				// 设置过滤条件(展示用)
				setCondition: function (index, item) {
					this.filterCondition[index].select = item
					// console.log('aaaasetCondition', index, item, JSON.parse(JSON.stringify(this.filterCondition)))
					if (index === 5) { 
						// 基金主题需要额外设置rightContent字段
						this.filterCondition[index].rightContent = item.name
					}
				},
				// 设置索引弹框
				setOtherPop: function (name) {
					if (name === 'back') {
						this.popType = 'normal'
						return
					}
					this.popType = 'other'
					this.otherPopType = name
					// console.log('aaa2333', name, JSON.parse(JSON.stringify(this.otherPopContent)))
				},
				// 基金弹框点击处理
				fundItemClick: function (item) {
					this.popType = 'normal'
					var conditionItem = this.filterCondition[this.otherPopType === '基金公司' ? 0 : 5]
					conditionItem.rightContent = item.name
					conditionItem.select = item
					if (item.name === '不限主题') {
						conditionItem.rightContent ="不限"
					}
					if (item.name === '全部基金公司') {
						conditionItem.rightContent ="全部"
					}
					// console.log(JSON.stringify(item))
				},
				// 当前选中的other pop选项
				fundActiveItem: function (name) {
					var item = this.filterCondition[this.otherPopType === '基金公司' ? 0 : 5]
					if (name === '不限主题' && item.rightContent === '不限' || name === '全部基金公司' && item.rightContent === '全部') {
						return 'fundActiveItem'
					} 
					return item.rightContent === name ? 'fundActiveItem' : ''
				},
				incomePeriodChange: function (value) {
					// 移除tab缓存状态，切换tab重新触发搜索
					var that = this
					this.mutualType.forEach(function (item, index) {
						if (index !== that.mutualTypeSelect) {
							item.isLoadData = false
						}
					})
					this.loadData('init')
					var btn_name
					this.timeList.forEach(function (item) {
						if (item.value === value) {
							btn_name = item.text
						}
					})
				},
				// 重置搜索
				resetFilter: function () {
					// console.log('aaaReset')
					this.filterCondition.forEach(function (item, index) {
						if (index === 0 || index === 5) {
							item.rightContent = ''
						} 
						switch (index) {
							case 0:
								item.rightContent = '全部'
								item.select = { name: '全部', value: '' }
								break;
							case 5:
								item.rightContent = '不限'
								item.select = { name: '不限', value: '' }
								break;
							case 1:
								item.select = {name: '可购', value: '1'}
								break;
							default:
								item.select = {name: '全部', value: ''}
								break;
						}
					})
				},
				// 过滤条件搜索
				filterLoaderData: function () {
					var oldFilterArr = this.FilterArr || []
					this.FilterArr = []
					var that = this
					this.filterCondition.forEach(function (item, index) {
						that.chooseFilter[that.filterMap[index]] = item.select
						that.FilterArr.push(item.select.value)
					})
					// 是否选择了过滤条件，用于筛选的红色图标展示
					this.hasFilterItem = this.FilterArr.some(function (item, index) {
						if (index === 1) {
							// 开发状态默认为可购，值为1，全部值为''，需要额外处理
							return item !== "1"
						}
						return item !== ''
					})
					if (JSON.stringify(oldFilterArr) !== JSON.stringify(this.FilterArr)) {
						// 筛选条件有变化，移除缓存状态，切换tab重新触发搜索
						this.mutualType.forEach(function (item, index) {
							if (index !== that.mutualTypeSelect) {
								item.isLoadData = false
							}
						})
					}
					// console.log('aaatemArr', FilterArr, this.hasFilterItem)
					// console.log('aaafilter', JSON.parse(JSON.stringify(this.chooseFilter)))
					this.showFilter = false
					this.loadData('init')
					// 将当前的列表滚动到最顶部
					this.$refs.listItem[this.mutualTypeSelect].scrollTo(0, 0)
				},
				// 去详情页
				goDetail: function (productCode, productName) {
					console.log(productCode, productName)
				},
			},
		});
		console.log("生成文件！");
	}
	exports.init = init;
});
