import React, { useState } from "react";
import { message, Button } from 'antd';
import "./index.scss";


let string = `
<div class="monthDateWrap" v-show="isShow">
    <div class="dateChoice">
        <span class="dateText begindate" type="text" id="date1" @click="setPopDate('begin', 'wrap')">{{beginDate}}</span>
        <span class="dateMiddleText">至</span>
        <span class="dateText enddate" type="text" id="date2" @click="setPopDate('end', 'wrap')">{{endDate}}</span>
    </div>
    <van-popup v-model="isDatePickerOpen" position="bottom" @click-overlay="onCancel">
        <div class="month-date-picker">
            <van-datetime-picker 
                v-model="selectedDate" 
                :type="datePickerType" 
                :formatter="formatter" 
                :min-date="minDate" 
                :max-date="maxDate" 
                swipe-duration=100
                @confirm="onConfirm" 
                @cancel="onCancel" 
                @change="onChange"
            >
                <template #title>
                    <div class="month-date-picker-types">
                        <div 
                            class="month-date-picker-type date" 
                            :class="{active:datePickerType == 'date'}" 
                            @click="chooseDatePickerType('date')"
                        > 按日选择</div>
                        <div 
                            class="month-date-picker-type month" 
                            :class="{active:datePickerType == 'year-month'}" 
                            @click="chooseDatePickerType('year-month')"
                        >按月选择</div>
                    </div>
                </template>
                <template #columns-top>
                    <div class="month-date-picker-dates" :class="datePickerType === 'date' ? '': 'monthTimeWrap'">
                        <div v-if="datePickerType !== 'date'" class="leftLine"></div>
                        <div class="month-date-picker-date" :class="{active:dateType == 'begin' && datePickerType == 'date'}" @click="setPopDate('begin')">
                            {{ datePickerType === 'date' ? beginDateTemp : monthBegin }}
                        </div>
                        <div style="margin: 0 0.2rem; color: #222222; line-height: 0.7rem; height: 0.7rem">至</div>
                        <div class="month-date-picker-date" :class="{active:dateType == 'end' && datePickerType == 'date'}" @click="setPopDate('end')">
                            {{ datePickerType === 'date' ? endDateTemp : monthEnd }}
                        </div>
                        <div v-if="datePickerType !== 'date'" class="rightLine"></div>
                    </div>
                </template>
            </van-datetime-picker>
            <van-toast></van-toast>
        </div>
    </van-popup>
</div>
`

var string2 = "\n<div class=\"monthDateWrap\" v-show=\"isShow\">\n    <div class=\"dateChoice\">\n        <span class=\"dateText begindate\" type=\"text\" id=\"date1\" @click=\"setPopDate('begin', 'wrap')\">{{beginDate}}</span>\n        <span class=\"dateMiddleText\">\u81F3</span>\n        <span class=\"dateText enddate\" type=\"text\" id=\"date2\" @click=\"setPopDate('end', 'wrap')\">{{endDate}}</span>\n    </div>\n    <van-popup v-model=\"isDatePickerOpen\" position=\"bottom\" @click-overlay=\"onCancel\">\n        <div class=\"month-date-picker\">\n            <van-datetime-picker \n                v-model=\"selectedDate\" \n                :type=\"datePickerType\" \n                :formatter=\"formatter\" \n                :min-date=\"minDate\" \n                :max-date=\"maxDate\" \n                swipe-duration=100\n                @confirm=\"onConfirm\" \n                @cancel=\"onCancel\" \n                @change=\"onChange\"\n            >\n                <template #title>\n                    <div class=\"month-date-picker-types\">\n                        <div \n                            class=\"month-date-picker-type date\" \n                            :class=\"{active:datePickerType == 'date'}\" \n                            @click=\"chooseDatePickerType('date')\"\n                        > \u6309\u65E5\u9009\u62E9</div>\n                        <div \n                            class=\"month-date-picker-type month\" \n                            :class=\"{active:datePickerType == 'year-month'}\" \n                            @click=\"chooseDatePickerType('year-month')\"\n                        >\u6309\u6708\u9009\u62E9</div>\n                    </div>\n                </template>\n                <template #columns-top>\n                    <div class=\"month-date-picker-dates\" :class=\"datePickerType === 'date' ? '': 'monthTimeWrap'\">\n                        <div v-if=\"datePickerType !== 'date'\" class=\"leftLine\"></div>\n                        <div class=\"month-date-picker-date\" :class=\"{active:dateType == 'begin' && datePickerType == 'date'}\" @click=\"setPopDate('begin')\">\n                            {{ datePickerType === 'date' ? beginDateTemp : monthBegin }}\n                        </div>\n                        <div style=\"margin: 0 0.2rem; color: #222222; line-height: 0.7rem; height: 0.7rem\">\u81F3</div>\n                        <div class=\"month-date-picker-date\" :class=\"{active:dateType == 'end' && datePickerType == 'date'}\" @click=\"setPopDate('end')\">\n                            {{ datePickerType === 'date' ? endDateTemp : monthEnd }}\n                        </div>\n                        <div v-if=\"datePickerType !== 'date'\" class=\"rightLine\"></div>\n                    </div>\n                </template>\n            </van-datetime-picker>\n            <van-toast></van-toast>\n        </div>\n    </van-popup>\n</div>\n"


console.log(JSON.stringify({string}))

console.log(string2)

export default function EsTurn() {
	const [taValue, setTaValue] = useState('')
	const [tipText, setTipText] = useState('请在左侧输入框粘贴内容')
	const [showData, setShowData] = useState('')
	const [opType, setOpType] = useState('low')
	const [showRightText, setShowRightText] = useState(false)
	const [messageApi, contextHolder] = message.useMessage();

	// getFieldIndex(JSON.parse(taValue))
	function changeHandle(e: any) {
		try {
			let va = e.target.value
			setTaValue(va)
			if (!e.target.value) {
				setTipText('请在左侧输入框粘贴内容')
				setShowData('')
				return
			}
			if (opType === 'low') {
				let tem1 = JSON.stringify(va)
				let tem2 = tem1.replaceAll(' ', '&nbsp;')
				setShowData(tem2)
				setShowRightText(false)
			} else {
				console.log(JSON.parse(`{"string":${va}}`).string)
				setShowData(JSON.parse(`{"string":${va}}`).string)
				setShowRightText(true)
			}
		} catch (error) {
			setTipText('请粘贴正确的内容')
			setShowData('')
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

	function clickOne() {
		setTaValue(string); 
		setOpType('low')
		changeHandle({target:{value:string}})
		console.log('aaaaclickOne', taValue)
	}
	function clickTwo() {
		setTaValue(string2); 
		setOpType('hight')
		changeHandle({target:{value:string2}})
		console.log('aaaaclickTwo',string2, taValue)
	}

	return (
		<div className="stringChangeBox">
			<div className="topOprateBox">
				{/* <Button type='default' onClick={clickOne}>数据1</Button>

				<Button type='default' onClick={clickTwo}>数据2</Button> */}
				<Button type={opType === 'low' ? "primary" : 'default'} onClick={() => setOpType('low')}>标签兼容降级</Button>
				<Button className="marginBtn" type={opType === 'hight' ? "primary" : 'default'} onClick={() => setOpType('hight')}>标签还原</Button>
				<Button className="marginBtn" type="primary" onClick={() => copy(showData)}>复制</Button>
			</div>
			<div className="stringChangeContent">
				<div className="leftBox">
					<textarea value={taValue} className="textarea" onChange={changeHandle} />
				</div>
				<div className="rightBox">
					{contextHolder}
					{
						showData
						? (opType === 'low' || !showRightText ? <div dangerouslySetInnerHTML={{__html: showData}}></div>
							: <div className="textarea">{showData}</div>
						 )
						: (
							<p className={tipText === "请粘贴正确的请求数据" ? "tip errorTip" : 'tip'}>{tipText}</p>
						)
					}
				</div>
			</div>
		</div>
	);
}
