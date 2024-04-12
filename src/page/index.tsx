import React, { Suspense, lazy } from "react";
import { Link, Route, Routes } from "react-router-dom";
import { Spin } from 'antd';
import './index.scss'

const Article= lazy(() => import(/* webpackChunkName: 'article' */ "./article"));
const Nav = lazy(() => import(/* webpackChunkName: 'nav' */ "./nav"));
const Reduce = lazy(() => import(/* webpackChunkName: 'reduce' */ "./reduce"));

function App() {
	
	return (
		<div className="pageWrap">
            <header className="title">
                <h2>青竹&Loneolf</h2>
                <ul className="navList">
                    <li><Link to="/article">文章</Link></li>
                    <li><Link to="/nav">案例</Link></li>
                    <li><Link to="/reduce">游戏</Link></li>
                    <li><Link to="/reduce">工具</Link></li>
                    <li><Link to="/test">测试@练习</Link></li>
                </ul>
            </header>
                <Suspense fallback={<Spin />}>
                    <main className="main">
                        <Routes>
                            <Route path="/" element={<Article />}></Route>
                            <Route path="/article" element={<Article />}></Route>
                            <Route path="/nav" element={<Nav />}></Route>
                            <Route path="/reduce" element={<Reduce />}></Route>
                        </Routes>
                    </main>
                </Suspense>
		</div>
	);
}

export default App;
