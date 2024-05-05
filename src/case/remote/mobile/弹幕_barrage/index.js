// export interface IBarrageInfo {
//     barrageList: IBarrageListItem[];
//     barrageCount: number;
//     barrageSpeed?: IBarrageSpeed;
// }
// export interface IBarrageListItem {
//     text: string;
//     emoImg: string;
//     isSpecial?: boolean;
// }
// export interface IBarrageSpeed {
//     baseSpeed: number;
//     rangeSpeed: number;
//     isAllRandom?: boolean;
//     speedDiff: number;
//     randomPadding: number;
// }
// import { mathRand, addZero, dutil } from "../util/util.js";

function createElem(type, parent, className, style){
    var elem=document.createElement(type)
    if(parent) parent.appendChild(elem)
	if(className) elem.className = className
    for(var key in style){
        elem.style[key]=style[key]
    }
    return elem
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



// 主体

let barrageMaterial = [
	"66666666",
	"Nice兄dei",
	"哈哈哈哈哈哈哈哈哈哈哈",
	"干得漂亮啊!666666",
	"前方高能预警，非战斗人员请撤离你这样不会被打死吗?",
	"楼主默哀三秒钟哈哈哈",
	"对不起忍不住，笑死了哈哈",
	"老夫看你骨骼惊奇，日后必成大器啊!",
	"恭喜你发现宝藏主播",
	"恭喜你发现宝藏主",
	"好可爱这是什么神仙主播啊",
	"天爱了",
	"点关注不迷路333333",
	"点关注不迷路3333",
	"2333大部爱了啊阿阿阿啊主播盛世美颜",
	"泰盖",
	"收下我的膝盖",
	"前方高能",
	"啊啊啊阿阿阿啊啊生大可爱了吧",
	"欢迎各位家人们",
	"欢迎各位家人们",
	"神仙爱了",
	"点关注不迷路哦哦哦哦",
	"前方高能申仙主播",
	"爱了爱了",
	"放松放松不要紧张",
	"放松放松不要礼物",
	"抱紧主播唱歌好好听",
	"起来",
	"艾斯主播",
	"主播太太太太可爱了@!",
	"太太太可爱了 @!",
	"6666666神夫播",
	"主播的点个关注",
	"红红火火恍恍惚惚好喜欢主播!L番的点下关注哦",
	"主播",
	"喜欢主播的点个关注",
	"好了",
	"可阿邓可阿邓可阿邓可阿邓可阿邓和阿爱爱爱爱爱爱啊",
	"太好了太好了",
	"阿啊",
];

const barrageInfo = getBarrageInfo();
const barrageNumList = initBarrage(barrageInfo);
const domList = [];
const moveType = 'calculate' // calculate / animation

console.log(barrageNumList);

rendDom(barrageNumList);
if (moveType === 'calculate') {
	calculateMove(domList, barrageInfo);
} else {
	animationMove(domList, barrageInfo)
}

// 使用计算的方式移动弹幕，不停地填装弹道
function calculateMove(domList, barrageInfo) {
	const len = domList.length;
	const { barrageSpeed, barrageCount } = barrageInfo;
	// 获取弹幕宽度，用于数据初始化将从右边进来
	const w = box.clientWidth;
	const {
        baseSpeed,
		speedDiff = 0,
		rangeSpeed,
		isAllRandom,
		randomPadding = 0,
		itemMargin = 0
	} = barrageSpeed;

    let temSpeed = 0;
	const init = Array.from({ length: len }, () => {
		if (!temSpeed || isAllRandom) {
			temSpeed = baseSpeed + Math.ceil(Math.random() * rangeSpeed);
		} else {
			temSpeed -= speedDiff;
		}
		return {
			speed: temSpeed / 10,
			lastLeft: 0,
		};
	});
    console.log('aaainit', JSON.stringify(init))
	// 记录每个弹幕的速度
	const speedList = Array.from({ length: barrageCount }, () => []);
	// 用定时器改变弹幕的位移
	setInterval(() => {
		domList.forEach((domItemList, listIndex) => {
			// 每个弹幕应该距离左边的距离
			let leftSum = 0;
			// 解构弹道的初始弹道数据
			const t = init[listIndex];
			// 解构每个弹道的速度
			const ls = speedList[listIndex];
			// 每次循环，最后元素的位移也要更改
			t.lastLeft -= numt(t.speed);
			Array.from(domItemList.children).forEach((domItem, index) => {
                let itemData = ls[index]
				if (!itemData) {
                    const padding = Math.ceil(Math.random() * randomPadding);
                    // 每个弹幕的宽度：自身宽度加上随机padding + margin固定距离值
                    const itemW = numt(domItem.getBoundingClientRect().width + padding + itemMargin);
                    ls[index] = itemData = { itemW };
                }
				// 将每个弹幕的位移值存放到弹幕速度列表中
				if (ls[index].left === undefined) {
                    ls[index] = itemData ={...itemData, left: numt(w + leftSum)};
				}
                const { itemW } = itemData
				// 速度变更
				itemData.left = numt(itemData.left - t.speed);
				// 当弹幕位移出屏幕，放到最后面重新开始循环
				if (itemData.left + itemW < -20) {
					itemData.left = numt(t.lastLeft);
				}
				// 给最后位移值赋值
				if (itemData.left + itemW > t.lastLeft) {
					t.lastLeft = numt(itemData.left + itemData.itemW);
				}
				domItem.style.transform = `translateX(${itemData.left}px)`;
				// 位移值累加
				leftSum += itemW;
			});
		});
	}, 1000 / 60);
}

// 使用transfrom和动画无线滚动弹幕，有空隙
function animationMove(domList, barrageInfo) {
	// 设置弹道的播放速度
	const {barrageSpeed} = barrageInfo
	const { baseSpeed, speedDiff, rangeSpeed, isAllRandom } = barrageSpeed;
	let temSpeed = 0;
	domList?.forEach((element) => {
		// @ts-ignore
		if (!element?.style) return;
		// 动画时间为10＋ 随机的0-7秒
		if (!temSpeed || isAllRandom) {
			temSpeed = baseSpeed + Math.ceil(Math.random() * rangeSpeed);
		} else {
			temSpeed -= speedDiff;
		}
		// @ts-ignore
		element.style.animationDuration = `${temSpeed}s`;
		// @ts-ignore
		element.style.animationPlayState = "running";
	});
}

// 生成dom，渲染dom
function rendDom(barrageNumList) {
	barrageNumList.forEach((lineList) => {
		let lineBox = createElem("div", box, `lineBox ${moveType === 'animation' ? 'animationLine' : ''}`);
		domList.push(lineBox);
		lineList.forEach((item) => {
			let itemClass = `barrage-item ${moveType === 'animation' ? 'animationItem' : 'calculateItem'}`
			let spanItem = createElem("span", lineBox, itemClass);
			let barrageText = createElem("span", spanItem, "barrage-text");
			barrageText.textContent = item.text;
			let emoImg = createElem("img", spanItem, "emoImg");
			emoImg.src = item.emoImg;
		});
	});
}

// 保留两位数字
function numt(num) {
	return Number(num.toFixed(2))
}

// 获取弹幕相关信息
function getBarrageInfo() {
	const baseInfo = {
		barrageCount:  5, // 弹道
		barrageSpeed: {
			baseSpeed: 20,  // 基础速度
			rangeSpeed: 10,  // 随机速度(0-10)  真是速度为基础速度+随机速度
			speedDiff: 0,
			randomPadding: 50, // 弹幕间的随机差值
			isAllRandom: true, 
			itemMargin: 40 // 弹幕之间的固定差值  弹幕与弹幕之间的距离为固定差值+随机差值
		},
		barrageList: [], // 弹幕文本与icon
	};
	for (let i = 0; i < 30; i++) {
		baseInfo.barrageList.push({
			text: barrageMaterial.pop(),
			emoImg: `./emoji/emoji_${addZero(mathRand(1, 40))}.png`,
		});
	}
	return baseInfo;
}

// 初始化弹幕的弹道，将字幕放到弹道数组中
function initBarrage(barrageInfo) {
	const { barrageCount, barrageList } = barrageInfo;
	const barrageNumList = Array.from({ length: barrageCount }, () => []);
	barrageList.forEach((item, index) => {
		barrageNumList[index % barrageCount].push(item);
	});
	return barrageNumList;
}
