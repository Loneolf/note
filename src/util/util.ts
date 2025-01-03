import QRCode, { QRCodeErrorCorrectionLevel, QRCodeDataURLType } from "qrcode";
import { message } from 'antd';

// 节流函数
export const throttle = (func: Function, delay: number = 1000) => {
	let debounceTimer: NodeJS.Timeout | null;
	return function (this: unknown, ...args: any[]) {
		const context = this;
		if (!debounceTimer) {
			debounceTimer = setTimeout(() => {
				debounceTimer = null;
				func.apply(context, args);
			}, delay);
		}
	};
}

// 防抖函数
export function debounce(func: Function, delay: number) {
	let debounceTimer: NodeJS.Timeout;
	return function (...args: any[]) {
		clearTimeout(debounceTimer);
		debounceTimer = setTimeout(() => {
			// @ts-ignore
			func.apply(this, args);
		}, delay);
	};
}

/**
 * 给iframe标签加载touch模拟器，并设置是否可选择文本
 * @param frameDom - 要加载touch模拟器的iframe元素
 * @param isSelect - 是否禁止用户选择文本，默认为false
 */
export function frameAddTouch(frameDom: HTMLIFrameElement, isSelect?: boolean) {
	frameDom.onload = function () {
		const doc = frameDom?.contentDocument || frameDom.contentWindow?.document
		if (!doc) return
		let script = doc?.createElement('script')!
		script.src = 'https://fastly.jsdelivr.net/npm/@vant/touch-emulator';
		doc.head.appendChild(script)
		if (isSelect) {
			doc.body.style.userSelect = 'none'
		}
	}
}

// 传进来url链接生成 image/database的二维码数据
export const generateQR = async (text: string) => {
	try {
		const opts = {
			errorCorrectionLevel: 'H' as QRCodeErrorCorrectionLevel,
			type: "image/png" as QRCodeDataURLType,
			quality: 0.9,
			margin: 1,
		};
		const png = await QRCode.toDataURL(text, opts);
		//   console.log(png);
		return png;
	} catch (err) {
		console.error(err);
	}
};

export const copyString = async function (copyString:string, noMessage?: boolean) {
	return new Promise((resolve, reject) => {
		if (!copyString) {
			message.info({
				content: '复制内容不能为空',
				duration: 1,
			})
			reject('无复制内容')
			return
		}
		navigator.clipboard.writeText(copyString).then((res) => {
			resolve(res)
			if (noMessage) return 
			message.success({
				content: `已复制内容:${copyString}`,
				duration: 1,
			})
		}).catch((err: any) => {
			reject(err)
			if (noMessage) return 
			message.error({
				content: '复制失败，请检查剪切板权限及浏览器版本',
				duration: 1,
			});
		})
	})
}

export const mySort = function (date: {[property: string]: string;}[], rule: string[], sortKey: string = 'key') {
	return date.sort((a, b) => {
		for (var i = 0; i < rule.length; i++) {
			var key = rule[i];
			if (a[sortKey] === key) {
				return -1;
			} else if (b[sortKey] === key) {
				return 1;
			}
		}
		return 0;
	})
}