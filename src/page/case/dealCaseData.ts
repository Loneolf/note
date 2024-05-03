import { caseCatalog } from './caseRemoteCatalog'
import { remoteBaseUrl } from '@cf/common'

type caseItem = {
    label: string;
    key: string;
    children?: caseItem[]
}

function dealCase(data: caseItem[], res: caseItem[], allPath?: string, beforePath?: string) {
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

const caseConfig = dealCase(caseCatalog, []);

export {
    caseConfig
}
