import { configureStore } from "@reduxjs/toolkit";
import counterSlice from "./features/counterSlice";
import listSlice from "./features/listSlice";

// configureStore创建一个redux数据
export default configureStore({
	reducer: {
		counter: counterSlice,
		list: listSlice,
	},
});
