import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { increment, asyncIncrement, decrement } from "@s/features/counterSlice"; // 引入actions
import { pushList, delList } from "@s/features/listSlice"; // 引入actions

function App() {
	const { count } = useSelector((state: any) => state.counter);
	const { list } = useSelector((state: any) => state.list);
	// console.log("aaalist", list);
	const dispatch = useDispatch();
	return (
		<div className="box">
			<div className="add">
				<button
					onClick={() => {
						dispatch(increment({ step: 1 }));
					}}
				>
					加一
				</button>
				<button
					onClick={() => {
						dispatch(decrement({ step: 2 }));
					}}
				>
					减二
				</button>
				<button
					onClick={() => {
						// @ts-ignore 
						dispatch(asyncIncrement({ step: 1 }));
					}}
				>
					延时加一
				</button>
			</div>
			<div className="content">{count}</div>
			<hr />
			<button
				onClick={() => {
					dispatch(pushList());
				}}
			>
				列表增加
			</button>
			<ul>
				{list.map((item: number, i: number) => {
					return (
						<li key={i}>
							{item}
							<button
								onClick={() => {
									dispatch(delList(i));
								}}
							>
								删除
							</button>
						</li>
					);
				})}
			</ul>
		</div>
	);
}

export default App;
