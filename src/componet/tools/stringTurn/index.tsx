import React, { useState, useEffect } from "react";
import { Button } from 'antd';
import "./index.scss";
import { copyString } from "@/util/util";


var str = '\n            <div style="width: 100%;">\n            <div class="sbxj-div-container-tit">\n                <div class="sbxj-div-container-tit-con">\n                    <div class="sbxj-div-container-tit-name"> \u57FA\u91D1\u540D\u79F0</div>\n                    <div class="sbxj-div-container-tit-value">\u51C0\u503C</div>\n                    <div class="sbxj-div-container-tit-select">\n                        <van-dropdown-menu>\n                            <van-dropdown-item v-model="sbxjSelectValue" :options="sbxjSelectOption" v-tap="{methods:qieHuanXuanZeQi}">\n                        </van-dropdown-menu>\n                    </div>\n                </div>\n            </div>\n            {{SanBuXuanJiJieList}}\n            <div class="sbxj-div-container">\t\t\n                <div class="sbxj-div-container-list" v-for="(v,k) in SanBuXuanJiJieList">\n                    <div class="sbxj-container-list-grouptop">\n                        <div class="sbxj-container-list-grouptopone"> \n                            <div class="sbxj-container-list-tit">{{v.name}}</div>\n                            <img :src="(v.isElite==\'0\')?\'\':tagIconUrl" alt="" class="sbxj-container-list-img">\n                        </div>\n                        <div class="sbxj-container-list-grouptoptow">\n                            <div class="sbxj-container-list-num">{{v.net_value}}</div>\n                            \n                            <div :class="(v.rose.substr(0,4)>0)?\'sbxj-container-list-per\':\'sbxj-container-list-per-green\'">{{v.rose}}</div>\n                        </div>\n                    </div>\n                    <div class="sbxj-container-list-groupbottom">\n                        <div class="sbxj-container-list-grouptopone">\n                            <div class="sbxj-div-container-list-amount">{{v.code}}</div>\n                            <div class="sbxj-container-list-type">{{v.second_type}}</div>\n                        </div>\n                        <div class="sbxj-container-list-grouptoptow">\n                            <div class="sbxj-div-container-list-date">{{v.netValueDate}}</div>\n                            <div class="sbxj-div-container-list-year">{{v.year?v.year:\'\'}}</div>\n                        </div>\n                    </div>\n                    <div class="sbxj-container-list-tip">\n                        <div class="sbxj-container-list-grouptopone" v-if="v.highlights">    \n                            <div class="sbxj-div-container-list-tip" v-for="(v,k) in v.highlights">{{v}}</div>\n                        </div>\n                    </div>\n                </div>\t  \n            </div>\n        </div>\n        '


var str2 = "\n<div class=\"monthDateWrap\" v-show=\"isShow\">\n    <div class=\"dateChoice\">\n        <span class=\"dateText begindate\" type=\"text\" id=\"date1\" @click=\"setPopDate('begin', 'wrap')\">{{beginDate}}</span>\n        <span class=\"dateMiddleText\">\u81F3</span>\n        <span class=\"dateText enddate\" type=\"text\" id=\"date2\" @click=\"setPopDate('end', 'wrap')\">{{endDate}}</span>\n    </div>\n    <van-popup v-model=\"isDatePickerOpen\" position=\"bottom\" @click-overlay=\"onCancel\">\n        <div class=\"month-date-picker\">\n            <van-datetime-picker \n                v-model=\"selectedDate\" \n                :type=\"datePickerType\" \n                :formatter=\"formatter\" \n                :min-date=\"minDate\" \n                :max-date=\"maxDate\" \n                swipe-duration=100\n                @confirm=\"onConfirm\" \n                @cancel=\"onCancel\" \n                @change=\"onChange\"\n            >\n                <template #title>\n                    <div class=\"month-date-picker-types\">\n                        <div \n                            class=\"month-date-picker-type date\" \n                            :class=\"{active:datePickerType == 'date'}\" \n                            @click=\"chooseDatePickerType('date')\"\n                        > \u6309\u65E5\u9009\u62E9</div>\n                        <div \n                            class=\"month-date-picker-type month\" \n                            :class=\"{active:datePickerType == 'year-month'}\" \n                            @click=\"chooseDatePickerType('year-month')\"\n                        >\u6309\u6708\u9009\u62E9</div>\n                    </div>\n                </template>\n                <template #columns-top>\n                    <div class=\"month-date-picker-dates\" :class=\"datePickerType === 'date' ? '': 'monthTimeWrap'\">\n                        <div v-if=\"datePickerType !== 'date'\" class=\"leftLine\"></div>\n                        <div class=\"month-date-picker-date\" :class=\"{active:dateType == 'begin' && datePickerType == 'date'}\" @click=\"setPopDate('begin')\">\n                            {{ datePickerType === 'date' ? beginDateTemp : monthBegin }}\n                        </div>\n                        <div style=\"margin: 0 0.2rem; color: #222222; line-height: 0.7rem; height: 0.7rem\">\u81F3</div>\n                        <div class=\"month-date-picker-date\" :class=\"{active:dateType == 'end' && datePickerType == 'date'}\" @click=\"setPopDate('end')\">\n                            {{ datePickerType === 'date' ? endDateTemp : monthEnd }}\n                        </div>\n                        <div v-if=\"datePickerType !== 'date'\" class=\"rightLine\"></div>\n                    </div>\n                </template>\n            </van-datetime-picker>\n            <van-toast></van-toast>\n        </div>\n    </van-popup>\n</div>\n"


console.log('aaabbb', str)

// copyString(str, true)
// setTimeout(async () => {
// 	var temStr = await navigator.clipboard.readText()
// 	console.log('temStr', temStr)
// }, 100);


// console.log('aaacheckQuotesWithRegex', checkQuotesWithRegex(str), checkQuotesWithRegex(str2))


export default function StringTurn() {
	const [taValue, setTaValue] = useState('')
	const [tipText, setTipText] = useState('请在左侧输入框粘贴内容')
	const [showData, setShowData] = useState('')
	const [showPre, setShowPre] = useState(false)

	useEffect(() => {
		dealParseString(str).then((res: string) => {
			console.log('dealParseString', res)
		})
	}, [])


	function changeHandle(e: any) {
		try {
			let va: string = e.target.value
			setTaValue(va)
			if (!va) {
				setTipText('请在左侧输入框粘贴内容')
				setShowData('')
				return
			}
			let back = va.includes('\\n') && va.includes('\\n    ')
			console.log('aaaback', va.trim() === str.trim())
			console.log(va, str)
			if (!back) {
				let tem1 = JSON.stringify(va)
				setShowData(tem1)
				setShowPre(false)
			} else {
				console.log(`{'string':${va}}`)
				if (document.querySelector('.preShowBox')) {
					document.querySelector('.preShowBox')!.innerHTML = va
				} 
				// setShowData(va)
				// console.log(JSON.parse(`{'string':${va}}`).string)
				dealParseString(va).then((res: string) => {
					console.log('dealParseString', res)
					// setShowData(res)
					// setShowPre(true)
				})
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
