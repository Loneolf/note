import { caseCatalog } from './caseRemoteCatalog'
import { remoteBaseUrl } from '@cf/common'
import { mySort } from '@u/util'

type caseItem = {
    label: string;
    key: string;
    children?: caseItem[]
}

const caseSort = [
    '输入框@人名选中和删除',
    '通讯录侧边滑动',
    '不定高长列表性能渲染优化',
    '定高长列表渲染优化',
    'openFile',
    'canvaseElementDrag',
    'echarts练习',
    'Audrey_Hepburn',
    '刮刮乐PC',
    '拖拽到指定答案位置',
    '3D照片旋转',
    '中间省略号',
    '弹幕_barrage',
    '渐变圆盘',
    '实战_F2图标练习',
    '实战_基金排行榜',
    
]

function dealCase(data: caseItem[], res: caseItem[], allPath?: string, beforePath?: string): {
    label: string; key: string;
}[] {
    data.forEach((item) => {
        if (item.children?.length) {
            return dealCase(item.children, res, `${allPath ? allPath + '/' : ''}${item.label}`, item.label)
        }
        if (item.key.endsWith('.html')) {
            res.push({
                label: item.label === 'index' ? beforePath! : item.label,
                key: `${remoteBaseUrl}case/${allPath}/${item.key}`,
            })
        }
    })
    return res
}

const docCase = {
    label: '文档组件库',
    key: `https://qing-1258827329.cos.ap-beijing.myqcloud.com/doc/index.html`,
    type: 'pc'
}

const caseConfig = mySort(dealCase(caseCatalog, []), caseSort, 'label');

console.log('aaacaseConfig', caseConfig)

caseConfig.splice(2, 0 , docCase)


export {
    caseConfig
}
