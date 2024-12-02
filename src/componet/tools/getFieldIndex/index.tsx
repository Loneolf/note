import React, { useState } from "react";
import { message } from 'antd';
import "./index.scss";

type NumberAndStrings = [number,...string[]]; 


// console.log(JSON.parse(str))

export default function GetFieldIndex() {
	const [taValue, setTaValue] = useState('')
	const [tipText, setTipText] = useState('请在左侧输入框粘贴要解析的数据')
	const [showData, setShowData] = useState([] as NumberAndStrings[])
	const [messageApi, contextHolder] = message.useMessage();



	function getFieldIndex(data: any) {
		const grid0 = data.GRID0[0].split('|');
		let res: NumberAndStrings[] = []
		grid0.forEach((item: string, index: number) => {
			if (!item) return
			// console.log(item, index)
			let tem: NumberAndStrings = [9999]
			for (const key in data) {
				if (tem[0] === 9999) {
					tem[0] = index
					tem.push(item)
				}
				if (Number(data[key]) === index) {
					tem.push(`---${key}`)
				}
			}
			if (tem.length === 2) tem.push(`需补充下标`)
			res.push(tem)
		});
		console.log(res.sort((a, b) => {
			return a[0] - b[0]
		}))
		return res.sort((a, b) => {
			// console.log(a[0], b[0])
			return a[0] - b[0]
		});
	}
	// getFieldIndex(JSON.parse(taValue))
	function changeHandle(e: any) {
		try {
			setTaValue(e.target.value)
			if (!e.target.value) {
				setTipText('请粘贴要解析的数据')
				setShowData([])
				return
			}
			let data = JSON.parse(e.target.value)
			setShowData(getFieldIndex(data))
			console.log(getFieldIndex(data))
		} catch (error) {
			setTipText('请粘贴正确的请求数据')
			setShowData([])
			console.log('error', error)
		}
	}

	function copy(params:string) {
		navigator.clipboard.writeText(params).then(() => {
			messageApi.open({
				type: 'success',
				content: `已复制内容:${params}`,
			});
		}).catch(() => {
			messageApi.open({
				type: 'error',
				content: '复制失败，请检查剪切板权限及浏览器版本',
			});
		})
	}

	return (
		<div className="getFieldIndexBox">
			<div className="leftBox">
				<textarea value={taValue} className="textarea" onChange={changeHandle} />
			</div>
			<div className="rightBox">
				{contextHolder}
				{
					showData.length > 0
					? showData.map((item: NumberAndStrings, index: number) => {
						return (
							<p key={index} className="item">
								{item[0]} ---- {item.map((si: string|number, sindex) => {
									if (sindex < 1) return null
									return (
										<span key={sindex} className={(si as string).includes('需补充下标') ? 'needIndex' : ''}>{si} </span>
									)
								})}
								<span onClick={() => copy(item[1])} className="iconfont">&#xec7a;</span>
							</p>
						)
					}) 
					: (
						<p className={tipText === "请粘贴正确的请求数据" ? "tip errorTip" : 'tip'}>{tipText}</p>
					)
				}
			</div>
		</div>
	);
}
