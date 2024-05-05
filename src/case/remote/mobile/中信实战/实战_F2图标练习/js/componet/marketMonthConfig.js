import { mockGetData } from "../mockData/index.js";

// 设置超出三行显示 展示/收起
const line = 3;

// 净值走势
export default async function MarketMonthConfig(vm) {
	const data = (await mockGetData("MarketMonthConfig"));
    // console.log('aaaa23333', data)
	let showArr = [];
	// 默认都是折叠状态
	if (data.bond_schg) {
		showArr.push({
			allText: data.bond_schg,
			showText: data.bond_schg,
			title: "债券市场",
		});
	}
	if (data.stk_schg) {
		showArr.push({
			allText: data.stk_schg,
			showText: data.stk_schg,
			title: "股票市场",
		});
	}
	if (data.lh_schg) {
		showArr.push({
			allText: data.lh_schg,
			showText: data.lh_schg,
			title: "量化市场",
		});
	}
	vm.audio_url = data.audio_url;
	vm.MonthUpdate = data.update_dt;
	vm.analyze_market = showArr;
    vm.$nextTick(() => {
        let allTextBox = document.querySelectorAll(".ydpz-item-text");
        vm.analyze_market.forEach(function (item, index) {
            if (allTextBox[index].scrollHeight >= line * 22) {
                // 展示操作符
                item.showOperate = true;
                // 初始状态不折叠
                item.isFold = false;
                item.showText = changeShowText(item).showText;
            }
        });
    })
}

export function changeShowText(item) {
	let dombox = document.querySelector(".ydpz-item-calculate");
	let characterArr = item.allText.split("");
	if (!item.isFold) {
		// 如果是折叠状态，则打开折叠
		// 使用innerHTML依次将字符串插入到text标签中，当其scrollHeight高度大于其实际高度时，就代表已经有了足够的字数。
		// 然后适当减去几个字符，加上"..."
		item.isFold = true;
		let shortCharacter = "";
		for (let i = 0; i < characterArr.length; i++) {
			shortCharacter += characterArr[i];
			dombox.innerHTML = shortCharacter + "占位...收起^^";
			if (dombox.scrollHeight > line * 24) {
				item.showText = shortCharacter + "...";
				break;
			}
		}
	} else {
		// 当展开时text标签中的文本为所有字符
		item.isFold = false;
		item.showText = item.allText;
	}
	return item;
}
