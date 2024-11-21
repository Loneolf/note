import React, { useState, useEffect } from "react";
import { Menu } from "antd";
import type { MenuProps } from "antd";
import Split from '@c/split'

import TurnCss from '@/case/local/turnCss.html'
import DownTime from '@/case/local/倒计时/TimingAlarmClock.html'
import GetFieldIndex from '@c/tools/getFieldIndex'
import '@a/css/contentCom.scss'
import './index.scss'

const toolItem = [
	{ label: "css转化", key: "css转化", com: TurnCss },
	{ label: "倒计时", key: "倒计时", com: DownTime },
	{ label: "字段下标获取", key: "字段下标获取", com: <GetFieldIndex />, type: 'reactCom'},
]

export default function Tool() {
	const [leftDom, setLeftDome] = useState<HTMLDivElement>();
	const [toolCom, setToolCom] = useState(TurnCss);
	const [currentItem, setCurrentItem] = useState(toolItem[0])
	const menuClick: MenuProps['onClick'] = function ({keyPath}) {
		const tem = toolItem.find((item) => {
			return item.key === keyPath[0]
		})
		setToolCom(tem?.com)
		setCurrentItem(tem!)
		console.log()
	}

	useEffect(() => {
		setLeftDome(document.querySelector('.toolsWrap .menuWrap')! as HTMLDivElement)		
	}, [])

	return (
		<div className="toolsWrap contentWrap">
			<div className="menuWrap">
				<Menu
					onClick={menuClick}
					defaultSelectedKeys={['css转化']}
					mode="inline"
					items={toolItem}
				/>
			</div>
			<Split leftDom={leftDom!} leftPostion={200}/>
			<div className="content">
				{
					// eslint-disable-next-line jsx-a11y/iframe-has-title
					currentItem?.type === 'reactCom' ? toolCom : <iframe srcDoc={toolCom}></iframe>
				}
			</div>
		</div>
	);
}
