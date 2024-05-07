time(); //開始运行
setInterval(time, 1000);
function time() {
    dt = new Date();
    let y = dt.getFullYear();
    let mt = dt.getMonth() + 1;
    let day = dt.getDate();
    let h = dt.getHours(); //获取时
    let m = dt.getMinutes(); //获取分
    let s = dt.getSeconds(); //获取秒
    document.querySelector(".showTime").innerHTML = "当前时间：" + y + "年" + mt + "月" + day + "-" + h + "时" + m + "分" + s + "秒";
}