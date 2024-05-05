
    main()
    // 入口函数main方法
    function main(){
        Add()
        last()
        Ret()
    }
    // 封装动态添加图片函数
    function Add(){
        addImg(15) 
        var width2 = getID("content").offsetWidth*0.3
        var contentBoxH = (width2*0.6+32)*5
        var contentBoxh = (width2*0.6+32)*3 +12
        getID("contentP").onclick = function(){
            addImg(9);
            contentBoxH += contentBoxh
            getID("contentBox").style.height = contentBoxH +"px"
        }
        // 动态添加图片及图片外面的div
        function addImg(num){
            for(var i = 1 ; i <= num;i++){
                var div = document.createElement("div");
                div.className = "content-pic";
                getID("contentBox").appendChild(div);
                var img = document.createElement("img");
                img.src = "img/首页/content2/content"+i+".jpg"
                var width1 = getID("content").offsetWidth*0.3
                img.style.width = width1+"px"
                img.style.height = parseInt(img.style.width)*0.6+"px"
                getID("contentBox").style.width = (width1+32)*3+"px"
                getID("contentBox").style.height = (width1*0.6+32)*5 +"px"
                div.appendChild(img);
            }
        }
    }

    // 尾部图片滑动显示
    function last(){
        console.log(getID("foot-min-img"))
        getID("foot-min-img").onmouseover = function(){
            getID("foot-ul-img").style.display = "block"
        }
        getID("foot-min-img").onmouseout = function(){
            getID("foot-ul-img").style.display = "none"
        }
    }

    // 返回顶部效果及帮助
    function Ret(){
        var scroll_top = 0, begina = 0, enda = 0, timera = null;
        window.onscroll = function () {
            scroll_top = scroll().top;
            if(scroll_top > 200){
                show("return")
            }else{
                hiden("return")
            }
            begina = scroll_top;
        };
        getID("return").onclick = function () {
            clearInterval(timera);

            timera = setInterval(function () {
                begina = begina + (enda - begina) / 20;
                window.scrollTo(0, begina);

                console.log(begina, enda);
                if(Math.round(begina) === enda){
                    clearInterval(timera);
                }
            }, 20);
        }
        var time2
        getID("return").onmouseover = function(){
            show("return-p")
        }
        getID("return").onmouseout = function(){
            hiden("return-p")
        }
        getID("help").onmouseover = function(){
            show("help-ul")
        }
        getID("help").onmouseout=function(){
            clearInterval(time2)
            time2 = setTimeout(function(){
                hiden("help-ul")
            },500)
        }
        getID("help-ul").onmouseover = function(){
            clearInterval(time2)
            show("help-ul")
        }
        getID("help-ul").onmoseout = function(){
            this.hiden("help-ul")
        }
    }

    // 封装得到滚动顶部和left函数
    function scroll(){
        if(window.pageYOffset !== null){
            return {
                left:window.pageXOffset,
                top:window.pageYOffset
                }
        }else if(Document.compatMode == "CSS1Compat"){
            return {
                left:document.documentElement.scrollLeft,
                top:document.documentElement.scrollTop
                }
        }return {
            left:document.body.scrollLeft,
            top:document.body.scrollTop
        }
    }
    // 封装获取id函数
    function getID(id){
        return typeof id === "string" ? document.getElementById(id) : null;
    }
    // 封装不显示函数
    function hiden(id){
        getID(id).style.display = "none"
    }
    // 封装显示函数
    function show(id){
        getID(id).style.display = "block"
    }
    