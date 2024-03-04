declare global {
    interface Window {
        gfontSize: number;
        process: any;
    }
}

// 添加MD类型声明
declare module "*.md" {
    const content: string;
    export default content;
}

export {}