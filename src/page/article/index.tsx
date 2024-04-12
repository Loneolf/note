import React, { useState } from "react";
import type { MenuProps } from "antd";
import { Menu } from "antd";
import MdParse from "@c/mdParse";
import { mdCatalog } from '@m/mdCatalog'

import "./index.scss";

export default function Artical() {
	const [mdPath, setMdPath] = useState("webpack/1webpack-基础篇.md")

	const menuClick: MenuProps['onClick'] = function ({keyPath}) {
		console.log('aaamenuClick', keyPath)
		const path = keyPath.reverse().join('/')
		setMdPath(path)
		console.log('aaa232323')
	}

	return (
		<div className="articleWrap">
			<div className="menuWrap">
				<Menu
					onClick={menuClick}
					defaultSelectedKeys={['1webpack-基础篇.md']}
					defaultOpenKeys={['webpack']}
					mode="inline"
					items={mdCatalog}
				/>
			</div>
			<MdParse sourceSrc={mdPath} />
		</div>
	);
}
