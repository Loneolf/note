import React, { Suspense, lazy, useState } from "react";
import { Link, Route, Routes } from "react-router-dom";
import { Spin } from "antd";
import "./index.scss";

const Article = lazy(() => import(/* webpackChunkName: 'article' */ "./article"));
const Fetch = lazy(() => import(/* webpackChunkName: 'fetch' */ "./fetch"));
const Reduce = lazy(() => import(/* webpackChunkName: 'reduce' */ "./reduce"));
const Tools = lazy(() => import(/* webpackChunkName: 'Tools' */ "./tool"));
const Game = lazy(() => import(/* webpackChunkName: 'Game' */ "./game"));
const Case = lazy(() => import(/* webpackChunkName: 'Case' */ "./case"));

const RouterConfig = [
	{ name: "文章", link: "/article" },
	{ name: "案例", link: "/case" },
	{ name: "游戏", link: "/game" },
	{ name: "工具", link: "/tools" },
	{ name: "reduce", link: "/reduce" },
	{ name: "测试@练习", link: "/fetch" },
];

function App() {
	const [activeLink, setActiveLink] = useState("/article");
	return (
		<div className="pageWrap">
			<header className="title">
				<h2>青竹&Loneolf</h2>
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
						<Route path="/" element={<Article />}></Route>
						<Route path="/article" element={<Article />}></Route>
						<Route path="/fetch" element={<Fetch />}></Route>
						<Route path="/case" element={<Case />}></Route>
						<Route path="/game" element={<Game />}></Route>
						<Route path="/tools" element={<Tools />}></Route>
						<Route path="/reduce" element={<Reduce />}></Route>
					</Routes>
				</main>
			</Suspense>
		</div>
	);
}

export default App;
