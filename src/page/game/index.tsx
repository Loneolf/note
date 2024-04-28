import React, { useState, useEffect } from "react";
import { Menu } from "antd";
import type { MenuProps } from "antd";
import Split from '@c/split'
import { remoteBaseUrl } from '@cf/common'
import '@ac/contentCom.scss'
import './index.scss'

const toolItem = [
	{ label: "贪吃蛇", key: "snake/index.html" },
]

export default function Game() {
	const [frameSrc, setFrameSrc] = useState(toolItem[0].key)
	const [leftDom, setLeftDome] = useState<HTMLDivElement>();
	const menuClick: MenuProps['onClick'] = function ({keyPath}) {
		setFrameSrc(keyPath[0])
	}

	useEffect(() => {
		setLeftDome(document.querySelector('.gameWrap .menuWrap')! as HTMLDivElement)
	}, [])

	return (
		<div className="gameWrap contentWrap">
			<div className="menuWrap">
				<Menu
					onClick={menuClick}
					defaultSelectedKeys={[frameSrc]}
					mode="inline"
					items={toolItem}
				/>
			</div>
			<Split leftDom={leftDom!} leftPostion={200}/>
			<div className="content">
				<iframe src={remoteBaseUrl + frameSrc}></iframe>
			</div>
		</div>
	);
}
