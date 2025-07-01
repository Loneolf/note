import React, { useState, useEffect } from "react";
import "@a/css/contentCom.scss";
import COS from 'cos-js-sdk-v5'
import { COSSECRET } from '@/util/myConfig'
// import Test from "@/case/remote/mobile/拖拽到指定答案位置.html";

const cos = new COS({
	SecretId: COSSECRET.id,
	SecretKey: COSSECRET.key,
});

export default function Fetch() {
	const [data, setData] = useState<any[]>([]);

	function getData () {
		cos.getObject({
			Bucket: 'qing-1258827329', // 填入您自己的存储桶，必须字段
			Region: 'ap-beijing',  // 存储桶所在地域，例如 ap-beijing，必须字段
			Key: 'test.json',  // 存储在桶里的对象键（例如1.jpg，a/b/test.txt），必须字段
			DataType: 'blob',        // 非必须
			onProgress: function (progressData: any) {
				console.log(JSON.stringify(progressData));
			}
	   }, function(err: any, data: any) {
			parseBlob(data.Body).then((res) => {
				// @ts-ignore
				res.done.push('工作23333')
				const blob = new Blob([JSON.stringify(res)], { type: "application/json" });
				handleFileInUploading(blob)

			})
		   console.log(err || data.Body);
	   });
	}

	function handleFileInUploading(file: Blob) {
		cos.uploadFile({
			Bucket: 'qing-1258827329', /* 填写自己的 bucket，必须字段 */
			Region: 'ap-beijing',     /* 存储桶所在地域，必须字段 */
			Key: 'test.json',              /* 存储在桶里的对象键（例如:1.jpg，a/b/test.txt，图片.jpg）支持中文，必须字段 */
			Body: file, // 上传文件对象
			SliceSize: 1024 * 1024 * 5,     /* 触发分块上传的阈值，超过5MB使用分块上传，小于5MB使用简单上传。可自行设置，非必须 */
			onProgress: function(progressData) {
				console.log(JSON.stringify(progressData));
			}
		}, function(err, data) {
			if (err) {
			  console.log('上传失败', err);
			} else {
			  console.log('上传成功');
			}
		});
	  }


	function parseBlob(blob: Blob) {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.onload = function (event) {
				if (event.target!.readyState === FileReader.DONE) {
					const text = event.target!.result;
					try {
						const jsonData = JSON.parse(text as string);
						console.log(resolve);
						resolve(jsonData);
					} catch (error) {
						console.error('解析JSON数据出错:', error);
					}
				}
			};
			reader.readAsText(blob);
		})
	}

	useEffect(() => {
		getData()
		// 接口请求
		// fetch("/api/hello")
		// 	.then((res) => res.text())
		// 	.then((res) => {
		// 		console.log("aaafetchRes12", res);
		// 	});
	}, []);

	return (
		<div className="toolsWrap contentWrap">
			test
		</div>
	);
}
