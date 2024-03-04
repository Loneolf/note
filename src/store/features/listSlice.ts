import { createSlice } from "@reduxjs/toolkit";

export const counterSlice = createSlice({
	name: "list",
	initialState: {
		list: [] as string[],
	},
	reducers: {
		pushList(state) {
			state.list.push((Math.random() * 100).toFixed(0));
		},
		delList(state, { payload }) {
			state.list.splice(payload, 1);
		},
	},
});
export const { pushList, delList } = counterSlice.actions;

export default counterSlice.reducer;
