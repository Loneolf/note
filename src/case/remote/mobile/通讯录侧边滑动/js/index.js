const { pinyin } = pinyinPro;

const nameList = [
	"王勇",
	"陈婷",
	"刘杰",
	"马丽",
	"赵刚",
	"吴婷",
	"周阳",
	"徐磊",
	"孙艳",
	"张勇",
	"丁磊",
	"郭子昂",
	"唐宇航",
	"杨强",
	"李明",
	"王婷",
	"陈勇",
	"刘婷",
	"马刚",
	"赵阳",
	"吴艳",
	"周磊",
	"徐艳",
	"孙婷",
	"张磊",
	"丁宇航",
	"郭子强",
	"唐勇",
	"杨婷",
	"李刚",
	"王艳",
	"陈刚",
	"刘阳",
	"马艳",
	"赵婷",
	"吴磊",
	"周艳",
	"徐婷",
	"孙强",
	"张宇航",
	"丁强",
	"郭子阳",
	"唐婷",
	"杨艳",
	"李阳",
	"王强",
	"陈阳",
	"刘艳",
	"马婷",
	"赵强",
	"吴勇",
	"周强",
	"徐勇",
	"孙阳",
	"张艳",
	"丁阳",
	"郭子艳",
	"唐强",
	"杨阳",
	"李艳",
	"王志刚",
	"陈阳阳",
	"刘勇勇",
	"马强强",
	"赵勇勇",
	"吴阳阳",
	"周阳阳",
	"徐阳阳",
	"孙阳阳",
	"张阳阳",
	"丁阳阳",
	"郭子阳阳",
	"唐阳阳",
	"杨阳阳",
	"李明阳",
	"王阳阳",
	"陈勇勇勇",
	"刘阳阳阳",
	"马阳阳阳",
	"赵阳阳阳",
	"吴阳阳阳",
	"周阳阳阳",
	"徐阳阳阳",
	"孙阳阳阳",
	"张阳阳阳",
	"丁阳阳阳",
	"郭子阳阳阳",
	"唐阳阳阳",
	"杨阳阳阳",
	"李阳阳阳",
	"王志阳阳",
	"陈勇勇勇勇",
	"刘阳阳阳阳",
	"马阳阳阳阳",
	"赵阳阳阳阳",
	"吴阳阳阳阳",
	"周阳阳阳阳",
	"徐阳阳阳阳",
	"孙阳阳阳阳",
	"张阳阳阳阳",
	"Alexander",
	"Andrew",
	"Anthony",
	"Austin",
	"Benjamin",
	"Brandon",
	"Brian",
	"Calvin",
	"Carter",
	"Charles",
	"Daniel",
	"David",
	"Dennis",
	"Douglas",
	"Edward",
	"Eric",
	"Franklin",
	"Gabriel",
	"Gordon",
	"Harold",
	"Isaac",
	"Jacob",
	"James",
	"Jason",
	"Jeffrey",
	"John",
	"Joseph",
	"Kenneth",
	"Kyle",
	"Larry",
	"Leonard",
	"Marcus",
	"Mason",
	"Matthew",
	"Maximilian",
	"Nicholas",
	"Noah",
	"Oliver",
	"Patrick",
	"Paul",
	"Peter",
	"Philip",
	"Quinn",
	"Rachel",
	"Raymond",
	"Richard",
	"Robert",
	"Ronald",
	"Samuel",
	"Theodore",
	"艾米丽",
	"约瑟夫",
	"萨拉",
	"迈克尔",
	"伊丽莎白",
	"戴维",
	"凯瑟琳",
	"詹姆斯",
	"艾米",
	"123",
	"457",
	"18323678629",
];

// 固定在头部的元素, 滑动索引tip元素
let fixtitle, tipbox
// 定时器，清除定时器，tips定时消失
let time
// 是否是点击或者滑动，标记 tips显示
let isClickMove = false

initDom()

// 全局变量，initDom后执行
// 索引列表及每个元素的位置信息
const itemList = Array.from(document.querySelectorAll('.indexItem'))
const indexPData = itemList.map((item) => {
    let itemRect = item.getBoundingClientRect()
    itemRect.dom = item
    itemRect.value = item.innerText
    return itemRect
})
const titleList = Array.from(document.querySelectorAll('.title'))
const titlePData = titleList.map((item) => {
    let itemRect = item.getBoundingClientRect()
	itemRect.offTop = item.offsetTop
    itemRect.dom = item
    itemRect.value = item.innerText
    return itemRect
})

// 创建dom，元素初始化，别给索引和主容器添加对应的点击、滑动、滚动事件
function initDom() {
    let showData = dealPYsort(nameList);
    let frament = document.createDocumentFragment();
    // 创建元素
    let content = createElem("div", frament, "content");
    content.addEventListener('scroll', scrollHandle)
	// 滚动列表固定在顶部的title
	fixtitle = createElem("div", content, "fixtitle");
    // 创建索引容器，并给索引容器添加touchmove和click事件
    let indexBox = createElem("div", frament, "indexbox");
	tipbox = createElem('div',indexBox, 'tipbox')
	createElem('div', tipbox, 'tipContent', 'A')
	createElem('div', tipbox, 'tipArr')
    indexBox.addEventListener("touchmove", moveHandle);
    indexBox.addEventListener("click", clickHandle);
    // 渲染列表
    showData.sortData.forEach((item) => {
        let title = createElem("div", content, "title", item.py);
        title.setAttribute("id", item.py);
        item.items.forEach((si) => {
            createElem("div", content, "item", si.text);
        });
    });
    // 渲染索引
    showData.sortIndex.forEach((item) => {
        createElem("div", indexBox, "indexItem", item);
    });
    box.appendChild(frament);
}

// 页面滚动，固定头部，侧边栏激活
function scrollHandle() {
	let top = Math.ceil(this.scrollTop)
	let fixItem = titlePData.find((item, index) => {
		return item.offTop <= top && titlePData[index + 1]?.offTop > top
	})
	if (!fixItem) return
	// 找到对应的侧边栏索引并激活
	let indexItem = indexPData.find(item => item.value === fixItem.value)
	fixtitle.style.display = 'block'
	fixtitle.innerText = fixItem.value
	if (isClickMove) return
	itemToView(indexItem, false)
}

// 处理touchMove
function moveHandle(e) {
	isClickMove = true
    let y = e.touches[0].clientY
    let last =  indexPData[indexPData.length - 1]
    if (y < indexPData[0].y || y >( last.y + last.height)) return
    let touchItem = indexPData.find(item => {
        return item.y < y && (item.y + item.height) > y
    })
    if (!touchItem) return
    itemToView(touchItem)
}

// 处理点击
function clickHandle(e) {
	if (e.target.className !== "indexItem") return;
	isClickMove = true
	let viewItem = indexPData.find(item => item.value === e.target.innerText)
    itemToView(viewItem)
}

// 索引高亮，是否title到顶部
function itemToView(item, isView = true) {
	if (!item) return
	// 先清空所有的激活索引，再重新赋值激活索引
    itemList.forEach(item => {
        item.classList.remove('activeIndex')
    })
	let value = item.dom.innerText;
    item.dom.classList.add('activeIndex')

	if (isClickMove) {
		tipbox.style.opacity = 1
		tipbox.style.top = (item.y - 5) + 'px'
		tipbox.firstElementChild.innerText = item.value
	}

	clearTimeout(time)
	time = setTimeout(() => {
		isClickMove = false
		tipbox.style.opacity = 0
	}, 300);
	if (!isView) return
	document.getElementById(value).scrollIntoView(true);
}

// 创建元素的方法，添加类名，值等
function createElem(type, parent, className, value) {
	var elem = document.createElement(type);
	if (parent) parent.appendChild(elem);
	if (className) elem.className = className;
	if (value) elem.innerHTML = value;
	return elem;
}

// 处理数据，按照拼音进行排序
function dealPYsort(data) {
	// 处理汉字，加上拼音
	const pyData = [];
	data.forEach((item) => {
		let str = pinyin(item, { toneType: "none" });
		str = str.replace(/ /g, "");
		pyData.push({
			text: item,
			py: str.toUpperCase(),
		});
	});
	// 排序
	pyData.sort(function (a, b) {
		return a.py.localeCompare(b.py);
	});
	let sortData = []; // 处理后全部数据
	let otherGroup = []; // 非A-Z的数据
	let sortIndex = []; // 索引列表
	pyData.forEach(function (item) {
		let py = item.py.charAt(0); // 按照拼音首字母分类
		let group = sortData.find(function (group) {
			return group.py === py;
		});
		// 如果不在A-Z的首字母，放到#里面
		if (!/[a-zA-Z]/.test(py)) {
			return otherGroup.push(item);
		}
		if (group) {
			group.items.push(item);
		} else {
			sortIndex.push(py);
			sortData.push({ py: py, items: [item] });
		}
	});
	sortData.push({ py: "#", items: otherGroup });
	sortIndex.push("#");
	// console.log(sortData, sortIndex);
	return { sortData, sortIndex };
}
