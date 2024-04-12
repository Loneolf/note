import React, { useState, useEffect } from "react";
import MarkDown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"; // 代码高亮显示
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw"; // 解析标签，支持html语法
import { DownOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Dropdown, Space, Anchor } from "antd";
import { themeList, themeMap, initTheme, saveTheme } from "./theme";
import "github-markdown-css";
import "./index.scss";

type Title = {
	key: string;
	href: string;
	title: string;
	children?: Title[];
	nodeName: any;
};

export default function MdParse({ sourceSrc }: { sourceSrc: string }) {
	// 获取默认主题对应的文字和主题
	const dfTheme = initTheme();
	const [themeName, setThemeName] = useState(dfTheme.text);
	const [theme, setTheme] = useState(dfTheme.theme);
	const [sourceMd, setSourceMd] = useState("");
	const [titles, setTitles] = useState<Title[]>([]);
	let navWrap:HTMLDivElement | null =null
	let activeNav:HTMLDivElement | null =null
	let navWrapHeight: number
	useEffect(() => {
		titles.length && document.addEventListener('scroll', scrollHandle)
		return () => {
			document.removeEventListener('scroll', scrollHandle)
		}
	}, [titles.length])
	

	useEffect(() => {
		if (!sourceSrc) return;
		// 加载MD数据，并对代码块部分做处理，因为从有道云笔记导出的MD文档代码块不含有“JS”等语言标记，使用正则加
		import(`@m/${sourceSrc}`).then((res) => {
			let text = res.default.replace(/```/g, (match: string, index: number, str: string) => {
				// 获取匹配的 ``` 之前的部分和之后的部分
				const before = str.slice(0, index);
				// 根据 ``` 的数量判断是否添加 'js'
				const count = before.split("```").length - 1;
				return count % 2 === 0 ? `${match}js` : match;
			});
			setSourceMd(text);
			setTimeout(() => {
				// 延时加载列表
				setTitles(addAnchor());
			}, 100);
		})
		.catch(() => {
			console.log("aaaaerrror");
		});
	}, [sourceSrc]);

	function scrollHandle(e:Event) {
		if (!navWrap) {
			navWrap = document.querySelector('.markdown-navigation')!
			navWrapHeight = navWrap.offsetHeight
		}
		activeNav = document.querySelector('.ant-anchor-link-active')!
		if (!activeNav) return
		// navWrap.scrollTop -= navWrap.scrollTop + navWrapHeight/2 - activeNav.offsetTop
		navWrap.scrollTop = activeNav.offsetTop - navWrapHeight/2
	}

	const formatNavItem = (headerDom: NodeListOf<HTMLElement>) => {
		// 将NodeList转换为数组，并提取出需要的属性
		let headerArr = Array.prototype.slice
			.call(headerDom)
			.map((item, index) => {
				let title = {
					href: "#" + index,
					key: "" + index,
					title: headerDom[index].innerText,
					children: [],
					nodeName: item.nodeName,
				};
				return title;
			}) as Title[];

		/**
		 * (双重循环，从后往前，逐渐将子节点存入父节点children属性)
		 * 1. 从后往前，将子标题直接存入前一个父级标题的children[]中
		 * 2. 如果前一个标题与当前标题(或标题数组)无直系关系，则直接将当前标题(或标题数组解构后)放入list数组
		 * 3. 循环多次，直到result数组长度无变化，结束循环
		 */
		let result = headerArr;
		let preLength = 0;
		let newLength = result.length;
		let num = 0;
		while (preLength !== newLength) {
			num++;
			preLength = result.length; // 获取处理前result数组长度
			let list: Title[] = []; // list数组用于存储本次for循环结果
			let childList: Title[] = []; // childList存储遍历到的兄弟标题，用于找到父标题时赋值给父标题的children属性
			for (let index = result.length - 1; index >= 0; index--) {
				if (
					// 当前节点与上一个节点是兄弟节点，将该节点存入childList数组
					result[index - 1] &&
					result[index - 1].nodeName.charAt(1) ===
						result[index].nodeName.charAt(1)
				) {
					childList.unshift(result[index]);
				} else if (
					// 当前节点是上一个节点的子节点，则将该节点存入childList数组，将childList数组赋值给上一节点的children属性，childList数组清空
					result[index - 1] &&
					result[index - 1].nodeName.charAt(1) <
						result[index].nodeName.charAt(1)
				) {
					childList.unshift(result[index]);
					result[index - 1].children = [
						...(result[index - 1].children as []),
						...childList,
					];
					childList = [];
				} else {
					// 当前节点与上一个节点无直系关系，或当前节点下标为0的情况
					childList.unshift(result[index]);
					if (childList.length > 0) {
						list.unshift(...childList);
					} else {
						list.unshift(result[index]);
					}
					childList = [];
				}
			}
			result = list;
			newLength = result.length; // 获取处理后result数组长度
		}
		return result;
	};

	const addAnchor = () => {
		// 获取markdown标题的dom节点
		const header: NodeListOf<HTMLElement> = document.querySelectorAll(".content h1, .content h2, .content h3, .content h4, .content h5, .content h6");
		// 向标题中注入id，用于锚点跳转
		header.forEach((navItem, index) => {
			navItem.setAttribute("id", index.toString());
		});
		// 格式化标题数组，用于antd锚点组件自动生成锚点
		let titles = formatNavItem(header);
		return titles;
	};

	const changeTheme: MenuProps["onClick"] = ({ key }) => {
		const themeName = themeList.find((item) => item.key === key)!.label;
		saveTheme(themeName);
		setThemeName(themeName);
		setTheme(themeMap[themeName as "dark"]);
	};

	const handleClickNavItem = (e: any, link: any) => {
		e.preventDefault();
		if (link.href) {
			// 找到锚点对应得的节点
			let element = document.getElementById(link.href);
			// 如果对应id的锚点存在，就跳滚动到锚点顶部
			element &&
				element.scrollIntoView({ block: "start", behavior: "smooth" });
		}
	};

	return (
		<div className="MDWrap">
			<Dropdown
				trigger={["click"]}
				menu={{
					items: themeList,
					selectable: true,
					defaultSelectedKeys: [themeName],
					onClick: changeTheme,
				}}
			>
				<Space>
					{themeName}
					<DownOutlined />
				</Space>
			</Dropdown>
			{titles.length > 0 && (
				<aside className="markdown-navigation">
					<div className="navTitle">
						目录
					</div>
					<Anchor
						className="markdown-nav"
						affix={false}
						onClick={handleClickNavItem}
						items={titles}
						offsetTop={80}
					></Anchor>
				</aside>
			)}
			<div className="content markdown-body">
				{sourceMd && (
					<MarkDown
						children={sourceMd}
						remarkPlugins={[[remarkGfm, { singleTilde: false }]]}
						rehypePlugins={[rehypeRaw]}
						components={{
							code(props) {
								const { children, className, node, ...rest } = props;
								const match = /language-(\w+)/.exec(className || "");
								return match ? (
									// @ts-ignore
									<SyntaxHighlighter
										{...rest}
										PreTag="div"
										children={String(children).replace(/\n$/,"")}
										language={match[1]}
										style={theme}
									/>
								) : (
									<code {...rest} className={className}>
										{children}
									</code>
								);
							},
						}}
					/>
				)}
			</div>
		</div>
	);
}
