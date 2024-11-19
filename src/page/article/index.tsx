import React, { useState, useEffect } from "react";
import type { MenuProps } from "antd";
import { Menu } from "antd";
import MdParse from "@c/mdParse";
import { mdCatalog } from '@m/mdCatalog'
import eventBus from '@u/eventBus'
import Split from '@c/split'

import "./index.scss";

export default function Artical() {
	const [mdPath, setMdPath] = useState("webpack/1webpack-基础篇.md")
	const [leftDom, setLeftDome] = useState<HTMLDivElement>();
	const [rightDom, setRightDom] = useState<HTMLDivElement>();

	const menuClick: MenuProps['onClick'] = function ({keyPath}) {
		console.log('aaamenuClick', keyPath)
		const path = keyPath.reverse().join('/')
		setMdPath(path)
		eventBus.emit('')
	}

	useEffect(() => {
		setLeftDome(document.querySelector('.menuWrap')! as HTMLDivElement)
		setRightDom(document.querySelector('.MDWrap')! as HTMLDivElement)
	}, [])

	console.log('aaamenuClick', mdPath)

	return (
		<div className="articleWrap">
			<div  className="menuWrap">
				<Menu
					onClick={menuClick}
					defaultSelectedKeys={['1webpack-基础篇.md']}
					defaultOpenKeys={['webpack']}
					mode="inline"
					items={mdCatalog}
				/>
			</div>
			<Split leftDom={leftDom!} rightDom={rightDom!} rightDomChange='paddingLeft'/>

			<MdParse sourceSrc={mdPath} />
		</div>
	);
}
