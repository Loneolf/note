import React, { useEffect } from "react";
import { recordC } from "./config";
import "./index.scss";

export default function Recode() {
	useEffect(() => {
		return;
	}, []);

	return (
		<div className="recodeBox">
			<h3 className="recodeTitle">网站更新记录</h3>
			<div className="recodeContent">
				<div className="recodeMainContent">
					{recordC.map((item, index) => {
						return (
							<div className={`recodeItem ${index === 0 ? 'lastRecodeItem' : ''} ${index === recordC.length -1 ? 'firstRecodeItem' : ''}`} key={index}>
								<div className="timeBox">
									<div className="dotBox">
										<div className="dotIn"></div>
									</div>
									{item.time}
								</div>
								<ul className="itemContent">
									{item.desc.map((si, sindex) => (
										<li key={sindex} className="contentItem">
											{si}
										</li>
									))}
								</ul>
							</div>
						);
					})}
					<div className="dotBox beginDotBox">
						<div className="dotIn"></div>
					</div>
				</div>
			</div>
		</div>
	);
}
