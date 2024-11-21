import React, { useEffect, useState } from "react";
import { remoteImgUrl } from '@cf/common'
import { bgImgCatalog } from './bgConfig'
import './index.scss'

export default function Fetch() {
	const [bgImg, setBgImg] = useState('')
	const [imgArr, setImgArr] = useState([] as string[])
	useEffect(() => {
		let tem = bgImgCatalog.map((item) => {
			return `${remoteImgUrl}homeBg/${item.key}`
		})
		setImgArr(tem.sort(() => Math.random() - 0.5))
		setBgImg(tem[0])
	}, []);

	function changeBgImg() {
		let index = imgArr.findIndex((item) => {
			return item === bgImg
		})
		let nextIndex = ++index
		if (nextIndex >= imgArr.length) nextIndex = 0
		setBgImg(imgArr[nextIndex])
	}

	return (
		<div className="home">
			<div className="imgBgBox" style={{backgroundImage: `url(${bgImg}`}}></div>
			<div className="saying" onClick={changeBgImg}>
				<div className="sayTitle">青竹小轩</div>
				<p className="desc">不积跬步，无以至千里</p>
			</div>
		</div>
	);
}
