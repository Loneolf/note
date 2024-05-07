var Method=(function(){
    return {
        EVENT_ID:"event_id",
        getNum:function(str){
            if(isNaN(Number(str))) return str;
            return Number(str);
        },

        loadImg:function(arr){
            var img=new Image()
            img.addEventListener("load",this.loadHandler)
            img.arr=arr
            img.self=this
            img.num=0
            img.list=[]
            img.src=img.arr[img.num]
        },
        loadHandler:function(e){
            this.list.push(this.cloneNode(false))
            this.num++
            if(this.num>this.arr.length-1){
                this.removeEventListener("load",this.self.loadHandler)
                var evt=new Event(Method.EVENT_ID)
                evt.list=this.list
                document.dispatchEvent(evt)
                return
            }
            this.src=this.arr[this.num]
        },

        createElem:function(type,parent,style){
            var elem=document.createElement(type)
            if(parent) parent.appendChild(elem)
            for(var key in style){
                elem.style[key]=style[key]
            }
            return elem
        },
        dragElem:function(elem){
            elem.addEventListener("mousedown",Method.downHandler)
            elem.self=this
        },
        removeElem:function(elem){
            elem.removeEventListener("mousedown",Method.mouseDragHandler);
        },
        downHandler:function(e){
            if(e.type==="mousedown"){
                e.stopPropagation()
                e.preventDefault()
                document.addEventListener("mousemove",Method.downHandler)
                document.position={x:e.offsetX,y:e.offsetY}
                document.elem=this
                this.addEventListener("mouseup",Method.downHandler)
            }
            if(e.type==="mousemove"){
                this.elem.style.left=e.x-this.position.x+"px"
                this.elem.style.top=e.y-this.position.y+"px"
            }
            if(e.type==="mouseup"){
                document.position=null
                document.elem=null
                document.removeEventListener("mousemove",Method.downHandler)
                this.removeEventListener("mouseup",Method.downHandler)
            }
        },
        setCookie:function(obj,hour,data,month,year){
            var time=new Date()
            var bool=false
            if(hour&&hour>0&&Method.getNum(hour)){
                time.setHours(hour)
                bool=true
            }
            if(data&&data>0&&Method.getNum(data)){
                time.setDate(data)
            }
            if(month&&month>0&&Method.getNum(month)){
                time.setMonth(month)
            }
            if(year&&year>time.getFullYear()&&Method.getNum(year)){
                time.setFullYear(year)
            }
            var d=""
            if(bool){
                d=";expires="+time.toUTCString()
            }
            for(var key in obj){
                document.cookie=key+"="+obj[key]+d
            }

        },
        getCookie:function(){
            var str=document.cookie
            arr=str.split(";")
            var obj={}
            for(var i=0;i<arr.length;i++){
                obj[arr[i].split("=")[0].trim()]=Method.getNum(arr[i].split("=")[1])
            }
            return obj
        },
        mixColor:function (red,green,blue,alpha) {
            var obj={};
            var reds=Method.getColor(red);
            var greens=Method.getColor(green);
            var blues=Method.getColor(blue);
            var alphas=Method.getColor(alpha);

            obj.color="#"+reds[1]+greens[1]+blues[1];
            obj.colorAlpha="#"+reds[1]+greens[1]+blues[1]+(!alpha ? "FF" : alphas[1]);
            obj.rgba="rgba("+reds[0]+","+greens[0]+","+blues[0]+","+(!alpha ? 1 : alphas[0]/256)+")";
            obj.rgb="rgba("+reds[0]+","+greens[0]+","+blues[0]+")";
            return obj;
        },
        getColor:function (col) {
            if(typeof col!=="number" && !Array.isArray(col)){
                col=256;
            }
            if(col>256) col=256;
            var color;
            if(Array.isArray(col)){
                color =Math.floor(Method.random(col[0],col[1]));
                col=color.toString(16);
            }else{
                color=Math.floor(Math.random()*col);

                col=color.toString(16);
            }
            if(col.length===1){
                col="0"+col;
            }
            return [color,col];
        },
        hitTest:function(elem1,elem2){
            let rect1=elem1.getBoundingClientRect();
            let rect2=elem2.getBoundingClientRect();
            if(rect1.left>rect2.left && rect1.left<rect2.right && rect1.top>rect2.top && rect1.top<rect2.bottom){
                return true;
            }
            if(rect1.right>rect2.left && rect1.right<rect2.right && rect1.top>rect2.top && rect1.top<rect2.bottom){
                return true;
            }
            if(rect1.left>rect2.left && rect1.left<rect2.right && rect1.bottom>rect2.top && rect1.bottom<rect2.bottom){
                return true;
            }
            if(rect1.right>rect2.left && rect1.right<rect2.right && rect1.bottom>rect2.top && rect1.bottom<rect2.bottom){
                return true;
            }
            return false;
        },

        /*
        *当有精灵图和与其对应的json文件或者XML文件，可以根据想加载某一张精灵图就加载某一张精灵图
        * 加载完成后在body.append即可，
        *
        *init(imgDataList,basePath,type)
        * imgDataList：要加载的json文件或者XML文件名称数组，
        * basePath：基础路径，所要加载图片的基础路径，例如“img/”
        * type：要加载的文件类型：json，或者xml，如果不填默认为json
        *
        * getImage(name)
        * 根据name加载一个div,div的背景为所要加载图片，宽高等属性与图片一致，返回div
        *
        * changeImg(elem,name)
        * 改变图片
        * */
        DATA_FINISH_EVENT:"data_finish_event",
        init:function (imgDataList,basePath,type) {
            if(imgDataList.length===0) return;
            if(!type) type="json";
            RES.imgDataList=imgDataList.reverse();
            RES.basePath=basePath;
            RES.type=type;
            RES.ajax(basePath+imgDataList.pop()+"."+type)
        },
        ajax:function (path) {
            var xhr=new XMLHttpRequest();
            xhr.addEventListener("load",RES.loadHandler);
            xhr.open("GET",path);
            xhr.send();
        },
        loadHandler:function (e) {
            this.removeEventListener("load",RES.loadHandler);
            var key,obj;
            if(RES.type==="json"){
                obj=JSON.parse(this.response);
                key=obj.meta.image.split(".png")[0];
                list[key]=obj.frames;
            }else if(RES.type==="xml"){
                obj=this.responseXML.children[0];
                key=obj.getAttribute("imagePath").split(".png")[0];
                list[key]=obj;
            }

            if(RES.imgDataList.length===0){
                var evt=new Event(RES.DATA_FINISH_EVENT);
                evt.list=list;
                document.dispatchEvent(evt);
                return;
            }
            RES.ajax(RES.basePath+RES.imgDataList.pop()+"."+RES.type);
        },
        getNameJSONData:function (name) {
            var fileName=RES.basePath;
            for(var key in list){
                var arr=list[key].filter(function (t) {
                    return t.filename===name;
                });
                if(arr.length>0){
                    fileName+=key+".png";
                    break;
                }
            }
            if(arr.length===0){
                return false;
            }else{
                return {
                    file:fileName,
                    w:arr[0].frame.w,
                    h:arr[0].frame.h,
                    x:arr[0].frame.x,
                    y:arr[0].frame.y
                };
            }
        },
        getNameXMLData:function (name) {
            var fileName=RES.basePath;
            for(var key in list){
                var elem=list[key].querySelector("[n="+name+"]");
                if(elem){
                    fileName+=list[key].getAttribute("imagePath");
                    break;
                }
            }
            if(!elem) return false;
            return {
                file:fileName,
                w:elem.getAttribute("w"),
                h:elem.getAttribute("h"),
                x:elem.getAttribute("x"),
                y:elem.getAttribute("y")
            }
        },
        getImage:function (name) {
            var obj;
            if(RES.type==="json"){
                obj=RES.getNameJSONData(name);
            }else if(RES.type==="xml"){
                obj=RES.getNameXMLData(name)
            }
            if(!obj)return;
            var div=document.createElement("div");
            Object.assign(div.style,{
                width:obj.w+"px",
                height:obj.h+"px",
                backgroundImage:"url("+obj.file+")",
                backgroundPositionX:-obj.x+"px",
                backgroundPositionY:-obj.y+"px",
                position:"absolute"
            });
            return div;
        },
        changeImg:function (elem,name) {
            var obj;
            if(RES.type==="json"){
                obj=RES.getNameJSONData(name);
            }else if(RES.type==="xml"){
                obj=RES.getNameXMLData(name)
            }
            if(!obj)return;
            Object.assign(elem.style,{
                width:obj.w+"px",
                height:obj.h+"px",
                backgroundImage:"url("+obj.file+")",
                backgroundPositionX:-obj.x+"px",
                backgroundPositionY:-obj.y+"px",
                position:"absolute"
            });
        },

        /*
        *给一个dom增加增加class，移除class，是否有class
        *
        * */
        hasClasses:function (classValue) {
        var index=this.className.lastIndexOf(" "+classValue);
        if(index>-1 && this.className.length-classValue.length-1===index){
            return true;
        }
        return (this.className.indexOf(classValue+" ")===0 || this.className.indexOf(" "+classValue +" ")>0 || this.className.trim()===classValue)

    },
        addClasses:function (classValue) {
            this.className=this.className+" "+classValue;
        },
        removeClasses:function (classValue) {
            if(this.className.indexOf(classValue+" ")===0){
                this.className=this.className.replace(classValue,"");
            }

            if(this.className.indexOf(" "+classValue +" ")>-1){
                this.className=this.className.replace(" "+classValue+" "," ");
            }
            var index=this.className.lastIndexOf(" "+classValue);
            if(index>-1 && this.className.length-classValue.length-1===index){
                this.className=this.className.slice(0,index);
            }
            if(this.className.trim()===classValue){
                this.className="";
            }
            this.className=this.className.trim();
        },
        //    深复制
        cloneObj:function (targetObj,souseObj){
            var name=Object.getOwnPropertyNames(souseObj)
            for(var i=0;i<name.length;i++){
                var desc=Object.getOwnPropertyDescriptor(souseObj,name[i])
                if(typeof desc.value==="Object" && desc.value!==null){
                    // var obj = (Array.isArray(desc.value) ? [] :{})
                    var obj=desc.value.constructor//作用等同于上一句注释。
                    clone(obj,desc.value)
                    Object.defineProperty(targetObj,name[i],{
                        writable:desc.writable,
                        enumerable:desc.enumerable,
                        configurable:desc.configurable,
                        value:obj,
                    })
                    continue
                }
                Object.defineProperty(targetObj,name[i],desc)
            }
            return targetObj
        },
        /*
        * ES5继承封装
        *
        * 通过中间函数F（空对象），来实现将father的原型继承到son的原型上。
        * */
        extendClass:function (sun,father) {
            function F() {}
            F.prototype=father.prototype;
            son.prototype=new F();
            son.prototype.constructor=this;
            son.supClass=supClass.prototype;
            if(father.prototype.constructor===Object.prototype.constructor){
                father.prototype.constructor=father;
            }
        },
    }
})()
