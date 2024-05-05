// 轮播图区域js
var b = $(".carousel-box .carousel-allbox")
var a = $("#carousel .carousel-box ul li")
//计时器
var clearTime = null;
//当前显示的
var nowIndex = 0;
//即将显示
var index = 0;
autoPlay();
//计时器,开始滑动
function autoPlay(){
	clearTime = setInterval(function(){
		index++;
		if(index > 2){
			index = 0;
		}
//		滑动动画
		scrollPlay()
        nowIndex = index
	},5000);
}
//滑动动画
function scrollPlay(){
	var b = $(".carousel-box .carousel-allbox")
	var a = $("#carousel .carousel-box ul li")
//	滑动的同时,li变色
//	siblings()过滤
	a.eq(index).addClass("list-choose").siblings().removeClass("list-choose");
//	如果当前显示小于即将显示,向左滑
	if(nowIndex < index){
//		当前显示的.left=-720
		b.eq(nowIndex).stop(true,true).animate({left:"-1500px"},1000);
		b.eq(index).css("left","1500px").stop(true,true).animate({left:"0px"},1000);
	}else if(nowIndex > index){
		b.eq(nowIndex).stop(true,true).animate({left:"1500px"},1000);
		b.eq(index).css("left","-1500px").stop(true,true).animate({left:"0px"},1000);
	}
}
//鼠标经过li
a.mouseover(function(){
//	清除计时器
	clearInterval(clearTime);
//	获取下标
	index = $(this).index();
	scrollPlay();
	nowIndex = index;
}).mouseout(function(){
//	鼠标离开,继续轮播
	autoPlay();
});
//点击左箭头
$(".carousel-box .btn-left").click(function(){
	index++;
	if(index > 2){
		index = 0;
	}
	scrollPlay();
	nowIndex = index;
	clearInterval(clearTime);
	autoPlay();
});
//点击右箭头
$(".carousel-box .btn-right").click(function(){
	index--;
	if(index < 0){
		index = 2;
	}
	scrollPlay();
	nowIndex = index;
	clearInterval(clearTime);
	autoPlay();
});
