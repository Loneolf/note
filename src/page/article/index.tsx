import React, { useEffect, useState } from "react";
import type { MenuProps } from "antd";
import { Menu } from "antd";
import MdParse from "./mdParse";

import "./index.scss";

const items: MenuProps["items"] = [
	{
		label: "webpack",
		key: "webpack",
		children: [
			{
				label: "1webpack-基础篇.md",
				key: "1webpack-基础篇.md",
			},
			{
				label: "2webpack-高级篇.md",
				key: "2webpack-高级篇.md",
			},
			{
				label: "3webpack优化相关.md",
				key: "3webpack优化相关.md",
			},
			{
				label: "4webpack实战react脚手架.md",
				key: "4webpack实战react脚手架.md",
			},
			{
				label: "5webpack实战Vue脚手架.md",
				key: "5webpack实战Vue脚手架.md",
			},
		],
	},
	{
		label: "TS",
		key: "TS",
		children: [
			{
				label: "1TypeScript简介及前言.md",
				key: "1TypeScript简介及前言.md",
			},
			{
				label: "2TS基本类型.md",
				key: "2TS基本类型.md",
			},
		],
	},
];

export default function Artical() {
	const [mdPath, setMdPath] = useState("webpack/1webpack-基础篇.md")

	const menuClick: MenuProps['onClick'] = function ({keyPath}) {
		console.log('aaamenuClick', keyPath)
		const path = keyPath.reverse().join('/')
		setMdPath(path)
	}

	return (
		<div className="articleWrap">
			<div className="menuWrap">
				<Menu
					onClick={menuClick}
					defaultSelectedKeys={['1webpack-基础篇.md']}
					defaultOpenKeys={['webpack']}
					mode="inline"
					items={items}
				/>
			</div>
			<MdParse sourceSrc={mdPath} />
		</div>
	);
}
