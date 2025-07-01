import React, { useState, useEffect, useRef } from "react";
import { Menu, Drawer, Popover, Button, message, Alert } from "antd";
import type { MenuProps } from "antd";
import Marquee from 'react-fast-marquee';
import Split from '@c/split'
import { frameAddTouch, generateQR } from '@u/util'
import { caseConfig } from './dealCaseData'
import { caseIntrol } from './caseIntrol'
import '@ac/contentCom.scss'
import './index.scss'

export default function Case() {
	const [frameSrc, setFrameSrc] = useState(caseConfig[0].key)
	const [leftDom, setLeftDome] = useState<HTMLDivElement>();
	const [open, setOpen] = useState(false);
	const [QRimgSrc, setQRimgSrc] = useState('')
	const [introItem, setIntroItem] = useState(finddIntro(caseConfig[0].key))
	const frame = useRef<HTMLIFrameElement>(null)

	const menuClick: MenuProps['onClick'] = function ({ key }) {
		setFrameSrc(key)
		setIntroItem(finddIntro(key))
		console.log('aaaaamenuClick', frame.current, key.includes('mobile'))
		if (!frame.current || !key.includes('mobile')) return
		frameAddTouch(frame.current, true)
	}
	
	useEffect(() => {
		setLeftDome(document.querySelector('.caseWrap .menuWrap')! as HTMLDivElement)
		generateQR(frameSrc).then((data)=> {
			setQRimgSrc(data!)
		})
		if (frame.current && frameSrc.includes('mobile')) {
			frameAddTouch(frame.current, true)
		}
	}, [])

	function finddIntro(url: string) {
		let currenItem = caseConfig.find((item)=> item.key === url)
		if (!currenItem) return
		return caseIntrol[currenItem.label]
	}

	function openIntroDrawer() {
		if (!introItem?.intro.length) {
			message.info('暂无介绍', 1)
			return
		}
		setOpen(true)
	}

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
			<Split leftDom={leftDom!} leftPostion={300} />
			<div className={`${isMobileFrame ? "mobileContent" : ""} content`}>
				<div className="operateBox">
					{
						introItem?.tip && <Alert
							className="caseAlert"
							banner
							message={
							<Marquee delay={3} pauseOnHover gradient={false}>
								{introItem.tip}
							</Marquee>
							}
						/>
					}
				
					{
						!isMobileFrame && <>
							<Button type="primary" onClick={() => frame.current?.requestFullscreen()}>全屏</Button>
							<a href={frameSrc} target="_blank">
								<Button type="primary">新开标签查看</Button>
							</a>
						</>
					}
					<Button type="primary" onClick={openIntroDrawer}>案例介绍</Button>
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
				title={introItem?.title}
				onClose={() => setOpen(false)}
				open={open}
				className="caseDrawer"
			>
				{
					introItem?.intro.map((si)=> {
						if (si.startsWith('title:')) {
							return <div className="titleIntrotitle" key={si}>{si.replace('title:', '')}</div>
						}
						return <p className="introItem" key={si}>{si}</p>
					})
				}
			</Drawer>
		</div>
	);
}
