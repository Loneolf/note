const canvas = document.querySelector('#canvas')
const ctx = canvas.getContext('2d')
console.log(ctx)
const circles = []
// 画圆方法封装
function dragCircle(ctx, cx, cy, r){
    ctx.save()
    ctx.beginPath()
    ctx.strokeStyle='blue'
    ctx.arc(cx, cy, r, 0, Math.PI * 2)
    ctx.stroke()
    ctx.closePath()
    ctx.restore()
}
// 填充两个初始圆
dragCircle(ctx, 100, 100 ,20)
circles.push({x: 100, y: 100, r: 20})
dragCircle(ctx, 200, 200 ,50)
circles.push({x: 200, y: 200, r: 50})
// canvas的状态
const canvasStatus = {
    IDLE: 'idle', // 闲置状态
    DRAG_START: 'drag_start', // 开始移动，记录原始位置等相关数据
    DRAGING: 'draging', // 移动中，实时描绘
    RIGHT_START: 'right_start', // 开始右键
    RIGHT_MOVING: 'right_moving', // 右键移动
}
// canvas信息源， 画布状态， 拖动目标， 缩放比例，便宜量等
const canvasInfo = {
    status: canvasStatus.IDLE, // 画布状态
    dragTarget: null, // 画布拖动目标
    lastEvtPos: {x: null ,y: null}, // 是否移动标记点
    offEvtPos: {x: null, y: null}, // 拖动目标偏移量
    offset: {x: 0, y: 0},
    scale: 1,
    scaleStap: 0.1,
    maxScale: 2,
    minScale: 0.5
}
// 给画布添加事件，鼠标按下，移动，抬起，滚轮事件
canvas.addEventListener('mousedown', mouseDownhandle)
canvas.addEventListener('mousemove', mouseMoveHandle)
canvas.addEventListener('mouseup', mouseUpHanle)
canvas.addEventListener('wheel', wheelHandle)
canvas.addEventListener('contextmenu', contextmenuHanle)


// 滚轮方法， 偏移量计算
function wheelHandle(e) {
    e.preventDefault()
    const postion = getPostion(e)
    const realPosition = {
        x: postion.x - canvasInfo.offset.x,
        y: postion.y - canvasInfo.offset.y,
    }
    const {minScale, maxScale, scaleStap} = canvasInfo
    const delteX = realPosition.x / canvasInfo.scale * scaleStap
    const delteY = realPosition.y / canvasInfo.scale * scaleStap
    if (e.wheelDelta > 0 && canvasInfo.scale < maxScale) {
        canvasInfo.scale += canvasInfo.scaleStap
        canvasInfo.offset.x -= delteX
        canvasInfo.offset.y -= delteY
    } else if (e.wheelDelta < 0 && canvasInfo.scale > minScale){
        canvasInfo.scale -= canvasInfo.scaleStap
        canvasInfo.offset.x += delteX
        canvasInfo.offset.y += delteY
    }
    const {offset, scale} = canvasInfo
    ctx.clearRect(-offset.x / scale, -offset.y / scale, canvas.width / scale, canvas.height / scale)
    ctx.setTransform(scale, 0, 0 ,scale, offset.x, offset.y)
    circles.forEach((item) => dragCircle(ctx, item.x, item.y, item.r))
}
function mouseMoveHandle(e) {
    const {scale, offset, lastEvtPos, dragTarget, offEvtPos} = canvasInfo
    let position = getPostion(e, offset, scale)
    if (isInCircle(position, circles)) {
        canvas.style.cursor = 'all-scroll'
    } else {
        canvas.style.cursor = 'default'
    }
    if (canvasInfo.status === canvasStatus.DRAG_START && getDistance(position, lastEvtPos) > 5) {
        canvasInfo.status = canvasStatus.DRAGING
        canvasInfo.offEvtPos = position
    } else if ( canvasInfo.status === canvasStatus.DRAGING ) {
        dragTarget.x += position.x - offEvtPos.x 
        dragTarget.y += position.y - offEvtPos.y
        ctx.clearRect(-offset.x / scale, -offset.y / scale, canvas.width / scale, canvas.height / scale)
        circles.forEach((item) => dragCircle(ctx, item.x, item.y, item.r))
        canvasInfo.offEvtPos = position
    } else if (canvasInfo.status === canvasStatus.RIGHT_START && getDistance(position, lastEvtPos) > 5) {
        canvasInfo.status = canvasStatus.RIGHT_MOVING
    } else if (canvasInfo.status === canvasStatus.RIGHT_MOVING) {
        position = getPostion(e)
        offset.x += (position.x - offEvtPos.x) / scale 
        offset.y += (position.y - offEvtPos.y) /scale 
        ctx.clearRect(-offset.x, -offset.y, canvas.width / scale, canvas.height / scale)
        ctx.setTransform(scale, 0, 0 ,scale, offset.x, offset.y)
        circles.forEach((item) => dragCircle(ctx, item.x, item.y, item.r))
        canvasInfo.offEvtPos = position
    }
}

function mouseDownhandle(e) {
    const position = getPostion(e, canvasInfo.offset, canvasInfo.scale)
    let circle = isInCircle(position, circles)
    if (e.button === 0) {
        if (!circle) return
        canvasInfo.status = canvasStatus.DRAG_START
        canvasInfo.dragTarget = circle
        canvasInfo.lastEvtPos = position
        canvasInfo.offEvtPos = position
    } else if (e.button === 2) {
        if (circle) return
        canvasInfo.status = canvasStatus.RIGHT_START
        canvasInfo.offEvtPos = getPostion(e)
    }
}

// 鼠标抬起时将画布状态置为限制状态
function mouseUpHanle(e) {
    canvasInfo.status = canvasStatus.IDLE
}
// 在画布上阻止鼠标右键事件
function contextmenuHanle(e) {
    e.returnValue = false
}

function getPostion(e, offset = {x: 0, y: 0}, scale = 1) {
    return { 
        x: (e.offsetX - offset.x) / scale, 
        y: (e.offsetY - offset.y) / scale
    }
}

function getDistance(p1, p2) {
    return Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2)
}

function isInCircle(pos, circles) {
    for (let i = 0; i < circles.length; i++) {
        let tem = circles[i]
        if (getDistance(pos, tem) < tem.r) return tem
    }
    return false
}