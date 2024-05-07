// 格式化日期
export function formatDate(dateStr, chart = '-', type) {
	if (!dateStr) return
	dateStr += "";
	if (type === "charactDate") {
		let time = new Date(dateStr);
		let y = time.getFullYear();
		let m = time.getMonth() + 1;
		let d = time.getDate();
		return `${y}年${m}月${d}日`;
	}
	return `${dateStr.substr(0, 4)}${chart}${dateStr.substr(4, 2)}${chart}${dateStr.substr(6)}`
}
/*
 * 金额格式化，保留两位
 */
export function decimalFormat(value, symbol) {
	if (!value && value !== 0) return "-";
	value = Number(value).toFixed(2);
	let numArr = value.split(".");
	const intPartFormat = numArr[0].replace(/(\d)(?=(?:\d{3})+$)/g, "$1,"); //将整数部分逢三一断
	if (symbol) {
		symbol = value > 0 ? '+' : '' 
	}
	return `${symbol || ''}${intPartFormat}.${numArr[1]}`;
}

// 删除分组逗号
export function removeGroup(num) {
	if (typeof num === "string") {
		return num.replace(/,/g, "");
	}
	return num + "";
}

// 随机颜色
export function getColor(index) {
	let baseColor = ["#F0BF8C", "#658AF8", "#FF9860", "#E5E5E5", "#FF7070"];
	if (index !== undefined && baseColor[index]) {
		return baseColor[index];
	}
	return (
		"rgb(" +[
			Math.round(Math.random() * 160),
			Math.round(Math.random() * 160),
			Math.round(Math.random() * 160),].join(",") +
		")"
	);
}

// 格式化字符串, 字符串 | 分隔符 | 每一项是否转为数字
export function formatStr(str, splitStr, isNum, isRemoveLine) {
	if (!str) return [];
	if (isRemoveLine) str = str.replace(/-/g, "");
	if (!splitStr) splitStr = ",";
	let arr = str.split(splitStr);

	if (isNum) {
		for (let i = 0; i < arr.length; i++) {
			arr[i] = Number(arr[i]);
		}
	}
	return arr;
}

// 获取某年某月的天数
// 年，月，起始日期(num), endDay(num | undfind),不传默认为全月的最后一天
export function getYearMonthDay(year, t, startDay, endDay) {
	let tem = new Date(year, t, 0);
	let num = endDay || tem.getDate();
	let arr = [];
	while (startDay < num) {
		startDay += 1;
		arr.push(`${year}${addZero(t)}${addZero(startDay)}`);
	}
	// console.log(year, t, num, arr)
	return { monthDayStr: arr.join() + ",", days: num };
}

// 模拟股票走势，baseNum:本金，days: 天数， isCost: 结果是否包含本金，true为包含, 默认不包含
export function stocksMock(baseNum, days, isCost) {
	let start = 0,
		result = [];
	let originBaseMoney = baseNum;
	while (start < days) {
		// 模拟每天的增长率 (-10%, 10%)，
		let increaseRate = Math.random() / 5 - 0.1;
		baseNum += baseNum * increaseRate;
		result.push((isCost ? baseNum : baseNum - originBaseMoney).toFixed(2));
		start += 1;
	}
	return result;
}

// 获取前几个月的数据
export function getMonthDays(monthArr, MathMonth) {
	let m = MathMonth;
	let time = new Date();
	// 获取年
	let year = time.getFullYear();
	// 获取当前月份
	let month = time.getMonth() + 1;
	let result = {},
		allDay = 0,
		dayStr = "";

	for (let i = 0; i < m; i++) {
		if (month - i <= 0) {
			month += 12;
			year -= 1;
		}
		if (month - i > 12) {
			month = month % 12;
			year += Math.floor(month / 12);
		}
		// console.log('aaaa', year, (month - i))
		// 默认起始日期是0
		let tem = getYearMonthDay(year, month - i, 0);
		dayStr = tem.monthDayStr + dayStr;
		allDay += tem.days;
		if (monthArr.includes(i + 1)) {
			result[i + 1] = {
				allDay,
				dayStr: dayStr.substring(0, dayStr.length - 1),
			};
		}
	}
	// console.log(allDay)
	return result;
}

// 获取某个范围内的随机值
export function mathRand(min, max) {
	return parseInt(Math.random() * (max - min)) + min;
}
// 补零
export function addZero(num) {
	if (num < 10) num = `0${num}`;
	return num;
}

// 获取随机值，总金额，分为多少数量，最小值，最大值, 是否是整数
// console.log(getRungeNum(300, 10, 10, 50)); ['46.11', '39.49', '33.36', '19.13', '29.85', '19.72', '31.38', '26.52', '31.89', '22.55']
export function getRungeNum(totalAmount, num, minMoney = 0, maxMoney, isInt) {
	if (!minMoney) minMoney = 0.01;
	if (!maxMoney) maxMoney = totalAmount / 2;
	if (num === 1) return [totalAmount];
	if (totalAmount < num * minMoney || totalAmount > num * maxMoney) {
		throw new Error("参数异常，分配不完或者不够分");
	}
	// 初始为最低值
	let arr = [...new Array(num)].fill(minMoney);
	totalAmount -= minMoney * num;

	let max = maxMoney - minMoney;
	while (num > 1) {
		if (totalAmount < max) {
			max = totalAmount;
		}
		let money = Math.random() * max;
		arr[num - 1] += Number(money);
		totalAmount -= money;
		num -= 1;
	}
	arr[0] += totalAmount;
	arr.forEach(
		(item, index) => (arr[index] = Number(item.toFixed(isInt ? 0 : 2)))
	);
	// console.log("aaaasum", arr.reduce((sum, item) => Number(sum) + Number(item)));
	return arr;
}
