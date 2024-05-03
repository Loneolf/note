import React, { useEffect } from "react";
import "@a/css/contentCom.scss";
// import Test from "@/case/remote/mobile/拖拽到指定答案位置.html";

export default function Fetch() {
	useEffect(() => {
		return;
		// 接口请求
		fetch("/api/hello")
			.then((res) => res.text())
			.then((res) => {
				console.log("aaafetchRes12", res);
			});
	}, []);
	const isMobile = true;

	return (
		<div className="toolsWrap contentWrap">
			{isMobile ? (
				<div className="mobileContent content">
					<div className="mobileframebox">
						{/* <iframe srcDoc={Test}></iframe> */}
					</div>
				</div>
			) : (
				<div className="content">
					{/* <iframe srcDoc={Test}></iframe> */}
				</div>
			)}
		</div>
	);
}
