import React, { useEffect } from "react";

export default function Fetch() {
	useEffect(() => {
		return
    // 接口请求
		fetch("/api/hello")
			.then((res) => res.text())
			.then((res) => {
				console.log("aaafetchRes12", res);
			});
	}, []);

	return <h1>nav~~~</h1>;
}
