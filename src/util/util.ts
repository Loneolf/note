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
function debounce(func: Function, delay: number) {
	let debounceTimer: NodeJS.Timeout;
	return function(...args: any[]) {
	  clearTimeout(debounceTimer);
	  debounceTimer = setTimeout(() => {
		// @ts-ignore
		func.apply(this, args);
	  }, delay);
	};
  }