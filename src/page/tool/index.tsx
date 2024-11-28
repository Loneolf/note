import React, { useState, useEffect } from "react";
import { Menu } from "antd";
import type { MenuProps } from "antd";
import Split from '@c/split'

import TurnCss from '@/case/local/turnCss.html'
import DownTime from '@/case/local/倒计时/TimingAlarmClock.html'
import GetFieldIndex from '@c/tools/getFieldIndex'
import StringTurn from '@/componet/tools/stringTurn'
import '@a/css/contentCom.scss'
import './index.scss'

const toolItem = [
	{ label: "字符串转换", key: "字符串转换", com: <StringTurn />, type: 'reactCom'},
	{ label: "css转化", key: "css转化", com: TurnCss },
	{ label: "倒计时", key: "倒计时", com: DownTime },
	{ label: "字段下标获取", key: "字段下标获取", com: <GetFieldIndex />, type: 'reactCom'},
]

export default function Tool() {
	const [leftDom, setLeftDome] = useState<HTMLDivElement>();
	const [toolCom, setToolCom] = useState(<StringTurn />);
	const [currentItem, setCurrentItem] = useState(toolItem[0])
	const menuClick: MenuProps['onClick'] = function ({keyPath}) {
		const tem = toolItem.find((item) => {
			return item.key === keyPath[0]
		})
		setToolCom(tem?.com)
		setCurrentItem(tem!)
	}

	useEffect(() => {
		setLeftDome(document.querySelector('.toolsWrap .menuWrap')! as HTMLDivElement)		
	}, [])

	console.log('AAAACURRENTITEM')

	return (
		<div className="toolsWrap contentWrap">
			<div className="menuWrap">
				<Menu
					onClick={menuClick}
					defaultSelectedKeys={['字符串转换']}
					mode="inline"
					items={toolItem}
				/>
			</div>
			<Split leftDom={leftDom!} leftPostion={200}/>
			<div className="content">
				{
					// @ts-ignore  
					currentItem?.type === 'reactCom' ? toolCom : <iframe srcDoc={toolCom}></iframe>
				}
			</div>
		</div>
	);
}
