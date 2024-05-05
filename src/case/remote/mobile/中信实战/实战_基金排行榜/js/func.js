"use strict";

/**
 *  管理所有ajax请求方法
 */
define(function (require, exports) {
	var config = require("./config");
	// 获取静态配置
	exports.getConfig = function (path, callBack) {
		callBack(config[path].data);
	};

	// 获取基金排行数据
	exports.getList = function(params, callBack) {
		mockGetData().then(function (data){
			callBack(data.data.list)
		})
	}

	var num = 0
	function mockGetData () {
		// console.log('数据请求了')
		return new Promise(function (resolve) {
		  setTimeout(function () {
			var result = {
			  code: '0',
			  data: { list: [] },
			  msg: 'scusess'
			}
			for (var i = 0; i < 20; i++) {
			  result.data.list.push({
                "product_code":"150023",
                "income_rate_date":"20201231",
                "net_value":1.8190,
                "market_code":"TRADE",
                "income_rate": (Math.random() * 200 - 100).toFixed(2) + '%',
                "product_name":"深成指B" + i,
                "net_value_date":null
            })
			  num += 1
			}
			resolve(result)
		  }, parseInt(Math.random() * 200) + 200)
		})
	  }

});
