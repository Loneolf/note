class LoadMethod{
    static get IMG_LOAD_OVER(){
        return "img_load_over"
    }
    static init(_arr,_baseUrl){
        let img = new Image()
        img.num = 0
        img.imgList = []
        img.arr=_arr
        img.baseUrl = _baseUrl
        img.addEventListener("load",LoadMethod.loadHandler)
        img.src = img.baseUrl+arr[img.num]
    }
    static loadHandler(e){
        let cloneImgs = this.cloneNode(false)
        let name = this.src.slice(this.src.lastIndexOf("/")+1,this.src.lastIndexOf("."))
        cloneImgs.name = name
        this.imgList.push(cloneImgs)
        this.num++
        if(this.num >= this.arr.length){
            this.removeEventListener("load",LoadMethod.loadHandler)
            var evt = new Event(LoadMethod.IMG_LOAD_OVER)
            evt.list = this.imgList
            document.dispatchEvent(evt)
            return
        }
        this.src=this.baseUrl+this.arr[this.num]
    }
}
