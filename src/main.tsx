import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, HashRouter } from "react-router-dom";
import zhCN from "antd/locale/zh_CN";
import { ConfigProvider } from "antd";
import { Provider } from "react-redux";
import {envConfig} from "./config/envConfig";
import store from "./store";
import App from "./page";
import "./assets/css/reset.scss";
import * as util from './util/util'
window.util = util

const root = ReactDOM.createRoot(document.querySelector("#app")!);
root.render(
	<Provider store={store}>
		<ConfigProvider locale={zhCN}>
			{envConfig?.buildType === "Browser" ? (
				<BrowserRouter basename={ process.env.NODE_ENV === "development" ? "" : "/note" }>
					<App />
				</BrowserRouter>
			) : (
				<HashRouter>
					<App />
				</HashRouter>
			)}
		</ConfigProvider>
	</Provider>
);
