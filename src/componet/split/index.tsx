import React, { useEffect, useRef } from "react";

import "./index.scss";

interface ISplitProps {
	leftDom: HTMLDivElement;
	rightDom?: HTMLDivElement;
	rightDomChange?: string;
	leftMin?: number;
	leftMax?: number;
	leftPostion?: number;
}

export default function Split({
	leftDom,
	rightDom,
	rightDomChange,
	leftMin = 200,
	leftMax = 400,
	leftPostion = 300
}: ISplitProps) {
	const splitDom = useRef<HTMLDivElement>(null);
	// 增加遮挡层，右侧有frame标签时，容易丢失事件，加上遮挡层会在当前dom中，不会跑到frame中的dom里
	const splitShadow = useRef<HTMLDivElement>(null);
	useEffect(() => {
		const dom = splitDom.current;
		if (!dom || !leftDom) return;
		dom.addEventListener("mousedown", mouthDown);
		return () => {
			dom.removeEventListener("mousedown", mouthDown);
		};
	}, [leftDom]);
	// console.log('aaa2333', leftDom)
	function mouthDown() {
		// console.log("aaaamouthdown");
		document.addEventListener("mousemove", mouthMove);
		document.addEventListener("mouseup", mouthUp);
	}
	function mouthMove(e: MouseEvent) {
		// console.log("aaaaamouthMove");
		if (e.x < leftMin || e.x > leftMax) return;
		splitDom.current!.style.left = e.x + "px";
		leftDom.style.width = e.x + "px";
		splitShadow.current!.style.display = 'block'
		splitShadow.current!.style.left = e.x + 4 + 'px'
		if (rightDomChange && rightDom) {
			rightDom.style[rightDomChange as "width"] = e.x + "px";
		}
	}
	function mouthUp() {
		// console.log("aaaamouthup");
		splitShadow.current!.style.display = 'none'
		document.removeEventListener("mousemove", mouthMove);
		document.removeEventListener("mouseup", mouthUp);
	}

	return (
		<>
			<div className="split" ref={splitDom} style={{left: leftPostion}}></div>
			<div className="splitShadow" ref={splitShadow}></div>
		</>
	);
}
