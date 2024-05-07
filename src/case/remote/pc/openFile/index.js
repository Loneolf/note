// import hljs from 'highlight.js';
// hljs.configure({languages: ['javascript', 'html']});
hljs.configure({languages: []});
hljs.initHighlightingOnLoad();
hljs.highlightAll();

// 读取文件，初步处理后的数据列表，类型为文件类型
let listData = []
// 三角形，区分文件夹和文件，是否打开了文件夹的icon
let triangle = document.querySelector('.triangle')
btn.addEventListener('click', async ()=> {
    try {
        let dirData = await showDirectoryPicker()
        listData = await dealDirData(dirData)
        console.log('aaaa23333', listData, dirData)
        // 排序：文件夹放前面，文件放在数组后面
        listData.children = sortDir(listData?.children)
        initList(listData, listContent)
        
    } catch (error) {
        console.log('aaa禁止访问文件夹', error)
        
    }
})
// 通过递归，将读取文件流转化为可遍历的数组
async function dealDirData(dirData) {
    if (dirData.kind === 'file') {
        // 文件的话直接返回
        return dirData
    }
    // 文件夹递归处理，将子文件夹或者子文件放到children数组中
    dirData.children = []
    let dirs = dirData.entries()
    for await (const dir of dirs) {
        dirData.children.push( await dealDirData(dir[1]) )
    }
    return dirData
}
// 初始化左侧列表，将数组在页面显示出来
function initList(listData, domWrap) {
    let isDir = listData.kind === 'directory'
    let div = createElem('div', domWrap, )
    div.data = listData
    div.isclose = true
    if (isDir) {
        // 文件夹将icon也包含，额外处理下
        let span = createElem('span', div, 'itemTitle') 
        span.appendChild(triangle.cloneNode())
        let textSpan = createElem('span', div, 'textwrap') 
        textSpan.innerHTML = listData.name
        span.appendChild(textSpan)
    } else {
        div.innerHTML = listData.name
    }
    div.addEventListener('click', listItemClick)
    if (isDir) {
        div.appendChild
        listData.children.forEach(item => {
            initList(item, div)
        })
    }
}

// 文件或者文件夹点击处理，文件打开，文件夹展开
async function listItemClick(e) {
    console.log(e, e.target, this)
    e.stopPropagation()
    let isFolder = this.data.kind === 'directory'
    if (isFolder) {
        let trag = this.children[0].children[0] 
        if (this.isclose) {
            trag.className = 'triangle triangleOpen'
            this.style.height = 'auto'
        } else {
            trag.className = 'triangle'
            this.style.height = '20px'
        }
        this.isclose = !this.isclose
    } else {
        // 文件则读取文件打开文件
        let file = await this.data.getFile()
        let isJS = file.name.endsWith('.js')
        let isCss = file.name.endsWith('.css') || file.name.endsWith('.scss')
        let isImg = file.name.endsWith('.jpg') || file.name.endsWith('.png')
        console.log('aaaaaafile', file)
        const reader = new FileReader()

        reader.onload = e => {
            console.log('aaaaareaderresult', e, e.target)
            img.src = ''
            htmlcodewrap.style.background = isImg ? '#fff' : '#f3f3f3'
            if (isImg) {
                img.src = e.target.result
                htmlcodewrap.textContent = ''
                return
            }
            let codeclass = 'language-html'
            if (isJS) codeclass = 'javascript'
            if (isCss) codeclass = 'css'
            htmlcodewrap.className = codeclass
            htmlcodewrap.textContent = e.target.result
            hljs.highlightElement(htmlcodewrap)
        }
        if (isImg) {
            reader.readAsDataURL(file);
        } else {
            reader.readAsText(file, 'utf-8')
        }
        console.log('aaaaa2333', this.data)
    }
}

function sortDir(dirData) {
    if (!dirData) return
    let folderArr = [], dirArr = []
    dirData.forEach(item => {
        if (item.kind === 'directory') {
            folderArr.push(item)
        } else {
            dirArr.push(item)
        }
    })
    return [...folderArr, ...dirArr]
}


function createElem(type,parent, className){
    let elem=document.createElement(type)
    if (className) elem.className = className
    if(parent) parent.appendChild(elem)
    return elem
}
// fileSystem API