import React from "react";
import { Menu } from "antd";
import type { MenuProps } from "antd";

import TurnCss from './toolItems/turnCss.html'
import './index.scss'

const toolItem = [
	{ label: "css转化", key: "css转化.html" },
]

export default function About() {
	const menuClick: MenuProps['onClick'] = function ({keyPath}) {
		console.log('aaamenuClick', keyPath)
	}

	return (
		<div className="toolsWrap">
			<div className="menuWrap">
				<Menu
					onClick={menuClick}
					defaultSelectedKeys={['1webpack-基础篇.md']}
					defaultOpenKeys={['webpack']}
					mode="inline"
					items={toolItem}
				/>
			</div>
			<div className="content">
				<iframe srcDoc={TurnCss}></iframe>
			</div>
		</div>
	);
}
