import React, { useState } from "react";
import { Button } from 'antd';
import "./index.scss";
import { copyString } from "@/util/util";


export default function StringTurn() {
	const [taValue, setTaValue] = useState('')
	const [tipText, setTipText] = useState('请在左侧输入框粘贴内容')
	const [showData, setShowData] = useState('')
	const [showPre, setShowPre] = useState(false)


	function changeHandle(e: any) {
		try {
			let va: string = e.target.value
			setTaValue(va)
			if (!va) {
				setTipText('请在左侧输入框粘贴内容')
				setShowData('')
				return
			}
			let back = va.includes('\\n') && (va.includes('\\n\\t') || va.includes('\\n    '))
			console.log('aaaaback', back, va)
			if (!back) {
				let tem1 = JSON.stringify(va)
				setShowData(tem1)
				setShowPre(false)
			} else {
				setShowData(JSON.parse(`{"string":${va}}`).string)
				setShowPre(true)
			}
		} catch (error) {
			setTipText('请粘贴正确的内容')
			setShowData('')
			console.log('error', error)
		}
	}

	function dealParseString(str:string) {
		return new Promise<string>((resolve, reject) => {
			copyString(str, true).then(() => {
				navigator.clipboard.readText().then((res: string) => {
					resolve(res)
				})
			}).catch((error: string) => {
				reject(error)
			})
		})
	}

	return (
		<div className="stringChangeBox">
			<div className="topOprateBox">
				<Button className="marginBtn" type="primary" onClick={() => copyString(showData)}>复制结果</Button>
			</div>
			<div className="stringChangeContent">
				<div className="leftBox">
					<textarea value={taValue} className="textarea" onChange={changeHandle} />
				</div>
				<div className="rightBox">
					{
						showData
						? (showPre ? <pre className="showBox preShowBox">{showData}</pre> : <div className="showBox">{showData}</div>)
						: (<p className={tipText === "请粘贴正确的请求数据" ? "tip errorTip" : 'tip'}>{tipText}</p>)
					}
				</div>
			</div>
		</div>
	);
}
