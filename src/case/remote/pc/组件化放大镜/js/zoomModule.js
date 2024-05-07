class Zoom{
    constructor(parent){
        let loadHandlerBind = this.loadHandler.bind(this)
        document.addEventListener(LoadMethod.IMG_LOAD_OVER,loadHandlerBind)
        parent.appendChild(this.createBox())
        this._num = 0
    }
    set num(value){
        if(value === this._num) return
        if(value>this.midArr.length-1){
            value = 0
        }
        if(value < 0){
            value = this.midArr.length-1
        }
        this._num = value
        this.addBorder()
        this.midImg.src = this.midArr[value].src
        this.bigImg.src = this.bigArr[value].src
    }
    get num(){
        return this._num
    }

    loadHandler(e){
        console.log('aaaloadHanle', e)
        this.arr = e.list
        this.arrLength = e.list.length
        this.change()
    }

    createBox(){
        if(this.view) return this.view
        let box = document.createElement("div")
        Object.assign(box.style,{
            position:"relative",
            width:"690px",
            height:"500px",
        })
        // 左边小盒子布局，上中下三部分，固定宽高和尺寸。
        let littleBox = document.createElement("div")
        Object.assign(littleBox.style,{
            width:"88px",
            height:"500px",
            float:"left",
            overflow:"hidden"
        })
        let style1 = {
            display:"block",
            height:"26px",
            width:"80px",
            background:"#ccc",
            border:"none",
            marginLeft:"4px",
        }
        let topBtn = document.createElement("button")
        topBtn.innerText = '上一张'
        Object.assign(topBtn.style,style1)
        this.littleContent = document.createElement("div")
        Object.assign(this.littleContent.style,{
            height:"448px",
            width:"84px",
            padding:"4px 0 0 4px",
            overflow:"hidden",
            position:"relative",
            // overflow:"hidden"
        })
        let BottomBtn = document.createElement("button")
        BottomBtn.innerText = '下一张'
        Object.assign(BottomBtn.style,style1)

        let btnClickHandlerBind = this.btnClickHandler.bind(this)
        topBtn.addEventListener("click",btnClickHandlerBind)
        BottomBtn.addEventListener("click",btnClickHandlerBind)
        littleBox.appendChild(topBtn)
        littleBox.appendChild(this.littleContent)
        littleBox.appendChild(BottomBtn)

        //中间中部盒子布局，左中右三部分，左右添加点击事件，中间部分添加mousemove,mouseleave事件。
        let style2 = {
            width:"50px",
            height:"31px",
            float:"left",
            marginTop:"235px",
            background:"#ccc",
            border:"none",
            cursor:"pointer"
        }
        let leftBtn = document.createElement("button")
        leftBtn.innerText = 'pre'
        Object.assign(leftBtn.style,style2)

        this.midBox = document.createElement("div")
        Object.assign(this.midBox.style,{
            width:"500px",
            height:"500px",
            float:"left",
            border:"1px solid #ccc",
            position:"relative",
        })
        this.midImg = new Image()
        Object.assign(this.midImg.style,{
            width:"500px",
            height:"500px",
            display:"block",
        })
        this.moveBox = document.createElement("div")
        Object.assign(this.moveBox.style,{
            width:"500px",
            height:"500px",
            opacity:"0",
            position:"absolute",
            top:0,
            left:0,
        })
        let midmouseHandlerBind = this.midmouseHandler.bind(this)
        this.moveBox.addEventListener("mousemove",midmouseHandlerBind)
        this.moveBox.addEventListener("mouseleave",midmouseHandlerBind)
        this.midBox.appendChild(this.midImg)
        this.midBox.appendChild(this.moveBox)

        let rightBtn = document.createElement("button")
        rightBtn.innerText = 'next'
        Object.assign(rightBtn.style,style2)
        let changeImgHandlerBind = this.changeImgHandlerBind.bind(this)
        leftBtn.addEventListener("click",changeImgHandlerBind)
        rightBtn.addEventListener("click",changeImgHandlerBind)

        this.bigBox = document.createElement("div")
        Object.assign(this.bigBox.style,{
            width:"500px",
            height:"500px",
            border:"1px solid #ccc",
            position:"absolute",
            left:"680px",
            overflow:"hidden",
            display:"none"
        })
        this.bigImg = new Image()
        Object.assign(this.bigImg.style,{
            width:"1000px",
            height:"1000px",
            position:"absolute",
        })
        this.bigBox.appendChild(this.bigImg)

        box.appendChild(littleBox)
        box.appendChild(leftBtn)
        box.appendChild(this.midBox)
        box.appendChild(rightBtn)
        box.appendChild(this.bigBox)

        return box
    }

    change(){
        if(!this.arr || this.arr.length !== this.arrLength) return
        this.littleArr = []
        this.midArr = []
        this.bigArr = []
        for(var i = 0;i<this.arr.length;i++){
            switch(this.arr[i].name.slice(0,this.arr[i].name.length-1)){
                case "little":
                    this.littleArr.push(this.arr[i])
                    break
                case "mid":
                    this.midArr.push(this.arr[i])
                    break
                case "big":
                    this.bigArr.push(this.arr[i])
                    break
            }
        }
        this.littleImgAllBox = document.createElement("div")
        Object.assign(this.littleImgAllBox.style,{
            position:"absolute",
            top:"4px"
        })
        console.log('aaaalittleArr', this.littleArr)
        for(let j = 0;j<this.littleArr.length;j++){
            let littleImgBox = document.createElement("div")
            let mouseOverBind = this.mouseOverHandler.bind(this)
            this.littleArr[j].addEventListener("mouseover",mouseOverBind)
            Object.assign(littleImgBox.style,{
                width:"80px",
                height:"80px",
                marginBottom:"10px",
                position:"relative"
            })
            Object.assign(this.littleArr[j].style,{
                width:"100%",
                height:"100%",
                display:"block"
            })
            littleImgBox.appendChild(this.littleArr[j])
            this.littleImgAllBox.appendChild(littleImgBox)
        }

        this.littleContent.appendChild(this.littleImgAllBox)
        this.addBorder()

        this.rec = this.midBox.getBoundingClientRect()
        this.midImg.src = this.midArr[this.num].src
        this.bigImg.src = this.bigArr[this.num].src
    }

    mouseOverHandler(e){
        e.stopPropagation()
        this.num = Number(e.target.name.slice(e.target.name.length-1))-1
    }
    addBorder(){
        let box = this.littleImgAllBox
        console.log('aaaa2333', box.children)
        for(let i = 0;i<box.children.length;i++){
            if(box.children[i].children.length === 2) box.children[i].lastElementChild.remove()
        }
        let borderBox = document.createElement("div")
        Object.assign(borderBox.style,{
            position:"absolute",
            width:"84px",
            height:"84px",
            left:"-4px",
            top:"-4px",
            border:"2px solid #333"
        })
        box.children[this.num].appendChild(borderBox)
    }

    btnClickHandler(e) {
        let box = this.littleImgAllBox
        if (box.children.length < 5) return
        let top = parseInt(box.style.top)
        if(e.target === box.parentElement.nextElementSibling){
            if(top <= -(box.children.length-5)*90+4) return
            if(top=== -4) {
                box.style.top = top - 86 + "px"
            }else{
                box.style.top = top-90+"px"
            }
        }

        if(e.target === box.parentElement.previousElementSibling){
            if(top>=4)return
            box.style.top = top+90+"px"
        }
    }

    changeImgHandlerBind(e){
        if(e.target === this.midBox.previousElementSibling)this.num--
        if(e.target === this.midBox.nextElementSibling) this.num++
    }

    midmouseHandler(e){
        if(e.type === "mousemove"){
            this.bigBox.style.display = "block"
            Object.assign(this.moveBox.style,{
                width:this.midBox.clientWidth/2+"px",
                height:this.midBox.clientHeight/2+"px",
                opacity:0.5,
                transition:"all 0s"
            })
            if(this.moveBox.clientWidth-10>this.midBox.clientWidth/2 || this.moveBox.clientHeight-10>this.midBox.clientHeight/2)return
            let x = e.pageX - this.rec.left - this.moveBox.clientWidth/2
            let y = e.pageY- this.rec.top -this.moveBox.clientHeight/2
            if(x<0){
                x = 0
            }else if(x >= this.midBox.clientWidth-this.moveBox.clientWidth){
                x = this.midBox.clientWidth-this.moveBox.clientWidth
            }
            if(y<0){
                y = 0
            }else if(y >= this.midBox.clientHeight-this.moveBox.clientHeight){
                y = this.midBox.clientHeight-this.moveBox.clientHeight
            }
            Object.assign(this.moveBox.style,{
                borderColor:"#333",
                borderStyle:"solid",
                borderWidth:`${y}px ${this.midBox.clientWidth-this.moveBox.clientWidth-x}px ${this.midBox.clientHeight-this.moveBox.clientHeight-y}px ${x}px`
            })
            this.bigImg.style.left = -x*this.midBox.clientWidth/(this.midBox.clientWidth-this.moveBox.clientWidth)+"px"
            this.bigImg.style.top = -y*this.midBox.clientHeight/(this.midBox.clientHeight-this.moveBox.clientHeight)+"px"
        }
        if(e.type === "mouseleave"){
            Object.assign(this.moveBox.style,{
                width:this.midBox.clientWidth+"px",
                height:this.midBox.clientHeight+"px",
                opacity:0,
                borderWidth:0,
                transition:"all 0.5s"
            })
            this.bigBox.style.display = "none"
        }
    }
}