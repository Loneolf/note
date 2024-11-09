import React, { Suspense, lazy, useState } from "react";
import { Link, Route, Routes } from "react-router-dom";
import { Spin } from "antd";
import "./index.scss";

const Home = lazy(() => import(/* webpackChunkName: 'home' */ "./home"));
const Article = lazy(() => import(/* webpackChunkName: 'article' */ "./article"));
const Test = lazy(() => import(/* webpackChunkName: 'test' */ "./test"));
const Reduce = lazy(() => import(/* webpackChunkName: 'reduce' */ "./reduce"));
const Tools = lazy(() => import(/* webpackChunkName: 'Tools' */ "./tool"));
const Game = lazy(() => import(/* webpackChunkName: 'Game' */ "./game"));
const Case = lazy(() => import(/* webpackChunkName: 'Case' */ "./case"));
const Record = lazy(() => import(/* webpackChunkName: 'Record' */ "./record"));

const RouterConfig = [
	{ name: "文章", link: "/article", el: <Article />},
	{ name: "案例", link: "/case", el: <Case /> },
	{ name: "游戏", link: "/game", el: <Game /> },
	{ name: "工具", link: "/tools", el: <Tools /> },
	{ name: "更新记录", link: "/record", el: <Record /> },
	{ name: "reduce", link: "/reduce", el: <Reduce /> },
	{ name: "测试@练习", link: "/test", el: <Test /> },
];

function App() {
	const [activeLink, setActiveLink] = useState("/");
	return (
		<div className="pageWrap">
			<header className="title">
				<Link to='/'><h2>青竹&Loneolf</h2></Link>
				<ul className="navList">
					{RouterConfig.map((item) => {
						return (
							<li
								onClick={() => setActiveLink(item.link)}
								key={item.name}
                                className={activeLink === item.link ? 'activeLi' : ''}
							>
								<Link to={item.link}>{item.name}</Link>
							</li>
						);
					})}
				</ul>
			</header>
			<Suspense fallback={<Spin />}>
				<main className="main">
					<Routes>
						<Route path="/" element={<Home />}></Route>
						{RouterConfig.map((item) => {
							return (
								<Route key={item.link} path={item.link} element={item.el}></Route>
							);
						})}
					</Routes>
				</main>
			</Suspense>
		</div>
	);
}

export default App;
