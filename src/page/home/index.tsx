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
		let imgC = tem.sort(() => Math.random() - 0.5)
		console.log(imgC, tem)
		setImgArr(imgC)
		setBgImg(tem[0])
		// 预加载图片
		preloadImages([imgC[0]]).then((images) => {
			console.log('首张图片已加载完毕，开始加载剩余图片', images);
			preloadImages(tem).then((images) => {
				console.log('所有图片已加载完成', images);
			}).catch((error) => {
				console.error(error);
			});
		}).catch((error) => {
			console.error(error);
		});
	}, []);

	function changeBgImg() {
		let index = imgArr.findIndex((item) => {
			return item === bgImg
		})
		let nextIndex = ++index
		if (nextIndex >= imgArr.length) nextIndex = 0
		setBgImg(imgArr[nextIndex])
	}

	// 图片预加载函数
    function preloadImages(imageUrls: string[]): Promise<HTMLImageElement[]> {
        let loadedImages: HTMLImageElement[] = [];
        let loadNumber: number = imageUrls.length;
		// console.log('aaaaaloadImg', imageUrls)
        return new Promise((resolve, reject) => {
            imageUrls.forEach((url, index) => {
                let img: HTMLImageElement = new Image();
				// console.log('loadImg', url)
                img.onload = function () {
					// console.log('loadImgover', this)
                    loadedImages[index] = this as HTMLImageElement;
                    loadNumber--;

                    if (loadNumber === 0) {
                        resolve(loadedImages);
                    }
                };
                img.onerror = function () {
                    reject(new Error(`图片 ${url} 加载失败`));
                };
                img.src = url;
            });
        });
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
