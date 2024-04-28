import React, { useState, useEffect, useRef } from "react";
import { Menu, Drawer, Popover, Button } from "antd";
import type { MenuProps } from "antd";
import Split from '@c/split'
import { remoteBaseUrl } from '@cf/common'
import { frameAddTouch, generateQR } from '@u/util'
import { caseConfig } from '@/case/remote/dealCaseData'
import '@ac/contentCom.scss'
import './index.scss'

const caseItem = [
	{ label: "奥黛丽赫本", key: "case/pc/Audrey_Hepburn/index.html" },
	{ label: "通讯录侧边滑动", key: "case/mobile/通讯录侧边滑动/index.html" },
]

console.log('aaaa2333caseConfig' ,caseConfig)

export default function Case() {
	const [frameSrc, setFrameSrc] = useState(caseConfig[0].key)
	const [leftDom, setLeftDome] = useState<HTMLDivElement>();
	const [open, setOpen] = useState(false);
	const [QRimgSrc, setQRimgSrc] = useState('')
	const frame = useRef<HTMLIFrameElement>(null)

	const menuClick: MenuProps['onClick'] = function ({keyPath}) {
		console.log('aaaaamenuClick', keyPath)
		setFrameSrc(keyPath[0])
		if (!frame.current || !keyPath[0].includes('mobile')) return
		frameAddTouch(frame.current, true)
	}
	
	useEffect(() => {
		setLeftDome(document.querySelector('.caseWrap .menuWrap')! as HTMLDivElement)
		generateQR(frameSrc).then((data)=> {
			setQRimgSrc(data!)
		})
	}, [])

	const isMobileFrame = frameSrc.includes("mobile")

	return (
		<div className="caseWrap contentWrap">
			<div className="menuWrap">
				<Menu
					onClick={menuClick}
					defaultSelectedKeys={[frameSrc]}
					mode="inline"
					items={caseConfig}
				/>
			</div>
			<Split leftDom={leftDom!} leftPostion={200} />
			<div className={`${isMobileFrame ? "mobileContent" : ""} content`}>
				<div className="operateBox">
					{
						!isMobileFrame && <>
							<Button type="primary" onClick={() => frame.current?.requestFullscreen()}>全屏</Button>
						</>
					}
					<Button type="primary" onClick={() => setOpen(true)}>案例介绍</Button>
				</div>
				{isMobileFrame ? (
					<div className="mobileframebox">
						<iframe ref={frame} src={frameSrc}></iframe>
						<div className="iconBox">
							<span onClick={() => frame.current!.contentWindow?.location.reload()} className="iconfont">&#xe648;</span>
							<Popover 
								placement="top" 
								content={<img className="qrimg" src={QRimgSrc}/>}
								// trigger={'click'}
							>
								<span className="iconfont">&#xe642;</span>
							</Popover>
							<a target="_blank" href={frameSrc}><span className="iconfont">&#xe614;</span></a>
						</div>
					</div>
				) : (
					<iframe ref={frame} src={frameSrc}></iframe>
				)}
			</div>
			<Drawer
				title="Basic Drawer"
				onClose={() => setOpen(false)}
				open={open}
			>
				<p>Some contents...</p>
				<p>Some contents...</p>
				<p>Some contents...</p>
			</Drawer>
		</div>
	);
}
