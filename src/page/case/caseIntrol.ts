type tcaseIntrol = {
    [property: string] : {
        title: string;
        intro: string[];
        tip?: string;
    }
}

export const caseIntrol: tcaseIntrol = {
    "输入框@人名选中和删除": {
        "title": "输入框@人名选中和删除",
        "intro": [
            "输入框输入'@'符号会出现人名选择列表，可用上下键切换或者鼠标单击选中，然后会插入到当前鼠标位置，记录人名列表的起始位置，并在输入框改变的时候实时更新",
            "左右键操作光标，会将人名看做一个整体，无论是删除还是左右切换，鼠标点击人名也会操作光标到人名的尾端",
            "实现技术主要是通过文本域的selectionStart和selectionEnd对光标进行操作，监听文本域的click，input，keydown等事件"
        ]
    },
    "拖动录制": {
        "title": "拖动录制",
        "intro": [

        ]
    },
    "轮播图": {
        "title": "轮播图",
        "intro": []
    },
    "组件化放大镜": {
        "title": "组件化放大镜",
        "intro": []
    },
    "放大镜": {
        "title": "放大镜",
        "intro": []
    },
    "瀑布流": {
        "title": "瀑布流",
        "intro": []
    },
    "游戏_寻找徐峥": {
        "title": "游戏_寻找徐峥",
        "intro": []
    },
    "图像明暗切换_滑块控制": {
        "title": "图像明暗切换_滑块控制",
        "intro": []
    },
    "旋转照片": {
        "title": "旋转照片",
        "intro": []
    },
    "优图驿站首页模仿-大学时期练习作品": {
        "title": "优图驿站首页模仿-大学时期练习作品",
        "intro": []
    },
    "openFile": {
        "title": "openFile",
        "intro": []
    },
    "echarts练习": {
        "title": "echarts练习",
        "intro": []
    },
    "canvaseElementDrag": {
        "title": "canvaseElementDrag",
        "intro": []
    },
    "Audrey_Hepburn": {
        "title": "Audrey_Hepburn",
        "intro": []
    },
    "3D照片旋转": {
        "title": "3D照片旋转",
        "intro": []
    },
    "googleDrive弹性布局": {
        "title": "googleDrive弹性布局",
        "intro": []
    },
    "不定高长列表性能渲染优化": {
        "title": "不定高长列表性能渲染优化",
        "intro": []
    },
    "中间省略号": {
        "title": "中间省略号",
        "intro": []
    },
    "刮刮乐PC": {
        "title": "刮刮乐PC",
        "intro": []
    },
    "定高长列表渲染优化": {
        "title": "定高长列表渲染优化",
        "intro": []
    },
    "星星绘制": {
        "title": "星星绘制",
        "intro": []
    },
    "碰撞检测": {
        "title": "碰撞检测",
        "intro": []
    },
    "环形数字": {
        "title": "环形数字",
        "intro": []
    },
    "笛卡尔心形函数": {
        "title": "笛卡尔心形函数",
        "intro": []
    },
    "路径": {
        "title": "路径",
        "intro": []
    },
    "通讯录侧边滑动": {
        "title": "通讯录侧边滑动",
        "intro": []
    },
    "弹幕_barrage": {
        "title": "弹幕_barrage",
        "intro": []
    },
    "实战_基金排行榜": {
        "title": "实战_基金排行榜",
        "intro": []
    },
    "实战_F2图标练习": {
        "title": "实战_F2图标练习",
        "intro": []
    },
    "展开收起": {
        "title": "展开收起",
        "intro": []
    },
    "刮刮乐移动端": {
        "title": "刮刮乐移动端",
        "intro": []
    },
    "拖拽到指定答案位置": {
        "title": "拖拽到指定答案位置",
        "intro": []
    },
    "渐变圆盘": {
        "title": "渐变圆盘",
        "intro": []
    }
}