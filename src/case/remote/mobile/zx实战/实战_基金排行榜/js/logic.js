"use strict";
define(function (require, exports) {
	var fun = require("./func");
	// 获取过滤列表，初始化过滤条件
	exports.getFilter = function (vm) {
		fun.getConfig("filter", function (data) {
			// console.log("aaaafilter", data);
			var seachCondition = []
			data.mutual_type.forEach(function (item, index) {
				if (!item.mutual_second_type) {
					item.mutual_second_type = [];
				}
				item.activeSi = 0; // 默认为第0项，也就是全部
				// 是否已经加载过数据，第一次默认未加载，会请求数据，之后切换一级tab不再请求数据
				item.isLoadData = index !== 0 ? false : true 
				item.mutual_second_type.unshift({
					name: "全部",
					value: "",
				});
				seachCondition.push({
					dataList: [], // 处理后用于显示的数据
					isLoading: true, // 下拉刷新
					isLoadmore: false, // 上拉刷新
					finished: false, // 数据是否加载完毕
					isRequest: false, // 是否正在请求接口数据，用于数据请求中不显示无数据表示
					pageNo: 1, // 
					pageSize: 20, // 每次请求 显示条数
					tab: item.value,
				})
			});
			vm.mutualType = data.mutual_type;
			vm.seachCondition = seachCondition
			// console.log('aaa2333seachCondition', JSON.parse(JSON.stringify(seachCondition)))
			vm.filterCondition.push(
				{
					title: "基金公司",
					rightContent: "全部",
					select: {name: '全部', value: ''},
					content: [],
				},
				{
					title: "开放状态",
					select: {name: '可购', value: '1'},
					content: data.buy_status,
				},
				{
					title: "风险等级",
					select: {name: '全部', value: ''},
					content: data.risk_level,
				},
				{
					title: "基金规模",
					select: {name: '全部', value: ''},
					content: data.scale,
				},
				{
					title: "券商公募产品",
					select: {name: '全部', value: ''},
					content: data.asset_to_public,
				},
				{
					title: "基金主题",
					rightContent: "不限",
					select: {name: '不限', value: ''},
					content: data.theme,
				},
				{
					title: "起购金额",
					select: {name: '全部', value: ''},
					content: data.start_mount,
				}
			);
		});
	}
	// 获取基金公司
    exports.getFundcompany = function (vm) {
        fun.getConfig("fundcompany", function (data) {
			// console.log("aaaafundcompany", data);
			var arr = []
            var idArr = data.company_id.split('|')
            var nameArr = data.company_name.split('|')
            var pyArr = data.company_name_py.split('|')
			console.log(idArr.length, nameArr.length, pyArr.length)
            for (var i = 0; i < idArr.length; i++) {
				// console.log(nameArr[i], idArr[i], pyArr[i])
                if (idArr[i]) {
                    arr.push({
                        name: nameArr[i],
						value: idArr[i],
                        py: pyArr[i],
                    })                
                }              
            }
			var res = dealPYsort(arr)
			// console.log('aaares', res)
			res.sortData.unshift({items: [{name: '全部基金公司', value: ''}]})
			vm.otherPopContent['基金公司'] = res.sortData;
			vm.otherPopContent['基金公司_index'] = res.sortIndex;
		});
    }
	// 获取主题并处理主题显示数据
    exports.getTheme = function (vm) {
        fun.getConfig("theme", function (data) {
			// console.log("aaaaTheme", data);
			var arr = []
            var idArr = data.theme_code.split('|')
            var nameArr = data.theme_name.split('|')
            var pyArr = data.theme_first_py.split('|')
            for (var i = 0; i < idArr.length; i++) {
                if (idArr[i]) {
                    arr.push({
                        name: nameArr[i],
						value: idArr[i],
                        py: pyArr[i],
                    })                
                }              
            }
			var res = dealPYsort(arr)
			res.sortData.unshift({items: [{name: '不限主题', value: ''}]})
			vm.otherPopContent['基金主题'] = res.sortData;
			// console.log(JSON.parse(JSON.stringify(res.sortData)))
			vm.otherPopContent['基金主题_index'] = res.sortIndex;
			
		});
    }
	// 根据过滤条件，搜索过滤结果
	exports.getList = function (params, vm) {
		// console.log(params.loadType)
		var tem = vm.seachCondition[vm.mutualTypeSelect]
		if (params.loadType === 'init') { 
			// tem.isLoading = true
			tem.isRequest = true
			tem.dataList = []
		}
		fun.getList(params, function (data) {
			tem.isRequest = false
			var dealData = dealListData(data, params.mutualType)
			var len = dealData.length
			if (params.loadType === 'init') {
				tem.dataList = dealData
				if (!len) {
					tem.isLoading = false
					tem.isLoadmore = false
					return
				}
				console.log('数据信息__', '起始:', 0, dealData[len - 1] && dealData[0].product_name, dealData[len - 1] && dealData[0].product_code)
				console.log('数据信息__', '结束:', len, dealData[len - 1].product_name,dealData[len - 1] && dealData[len - 1].product_code, '本次请求数据条数: ', len)
			} else {
				console.log('数据信息__', '起始:', tem.dataList.length, dealData[len - 1] && dealData[0].product_name, dealData[len - 1] && dealData[0].product_code)
				console.log('数据信息__', '结束:', tem.dataList.length + len, dealData[len - 1] && dealData[len - 1].product_name, dealData[len - 1] && dealData[len - 1].product_code, '本次请求数据条数: ', len)
				tem.dataList = tem.dataList.concat(dealData)
			}
			tem.isLoadmore = false
			tem.isLoading = false
			tem.pageNo += 1
			if (len >= tem.pageSize) {
				tem.finished = false
			} else {
				tem.finished = true
			}
		})
	}
	function dealListData(list, type) {
		if (!list) return
		list.forEach(function (item) {
			item.showValue = type === 'monetary' ? (item.million_of_income || '--') : (item.net_value || '--')
			item.rateData = incomeRate(type === 'monetary' ? item.seven_year_income_rate : item.income_rate)
			item.time = timeFormat(item.income_rate_date)
		})
		return list
	}
	// 利率颜色，加百分号
	function incomeRate (rate) {
		if (!rate) return { dealRate: '--' }
		var tem = rate.replace('%', '')
		if (Number(tem) === 0) return {dealRate: '0.00%'}
		if (isNaN(Number(tem))) return { dealRate: '--' }
		var className = '', dealRate = '--'
		if (tem > 0) {
			className = 'red'
			dealRate = '+' + tem + '%'
		} else if(tem < 0) {
			className = 'green'
			dealRate = tem + '%'
		}
		return {className: className, dealRate: dealRate}
	}
	// 日期格式化
	function timeFormat(time) {
		if (!time) return
		return time.replace(/(\d{4})(\d{2})(\d{2})/, "$2-$3")
	}
	// 拼音排序
	function dealPYsort (data) {
		data.sort(function(a, b) {
			return a.py.localeCompare(b.py);
		});
		var sortData = [] // 处理后全部数据
		var otherGroup = [] // 非A-Z的数据
		var sortIndex = [] // 索引列表
		data.forEach(function(item) {
			var py = item.py.charAt(0); // 按照拼音首字母分类
			var group = sortData.find(function(group) {return group.py === py });
			// 如果不在A-Z的首字母，放到#里面
			if (!(/[a-zA-Z]/.test(py))) {
				return otherGroup.push(item)
			}
			// console.log('aaaaaapy', py, /[a-zA-Z]/.test(py))
			if (group) {
				group.items.push(item);
			} else {
				sortIndex.push(py)
				sortData.push({ py: py, items: [item] });
			}
		})
		sortData.push({ py: '#', items: otherGroup })
		sortIndex.push('#')
		// console.log(sortData)
		return {sortData: sortData, sortIndex: sortIndex}
	}
});
