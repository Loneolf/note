// MD 文档主题，默认主题为dracula，选择主题后，将主题存放在localStorage中，保存用户设置

import {
    a11yDark,
    atomDark,
    base16AteliersulphurpoolLight,
    cb,
    coldarkCold,
    coldarkDark,
    coy,
    darcula,
    dark,
    dracula,
    duotoneDark,
    duotoneEarth,
    duotoneForest,
    duotoneLight,
    duotoneSea,
    duotoneSpace,
    funky,
    ghcolors,
    gruvboxDark,
    gruvboxLight,
    hopscotch,
    materialDark,
    materialLight,
    materialOceanic,
    nord,
    okaidia,
    oneDark,
    oneLight,
    pojoaque,
    prism,
    shadesOfPurple,
    solarizedlight,
    synthwave84,
    tomorrow,
    twilight,
    vs,
    vscDarkPlus,
    xonokai,
} from "react-syntax-highlighter/dist/esm/styles/prism";

const themeMap = {
    a11yDark: a11yDark,
    atomDark: atomDark,
    base16AteliersulphurpoolLight: base16AteliersulphurpoolLight,
    cb: cb,
    coldarkCold: coldarkCold,
    coldarkDark: coldarkDark,
    coy: coy,
    darcula: darcula,
    dark: dark,
    dracula: dracula,
    duotoneDark: duotoneDark,
    duotoneEarth: duotoneEarth,
    duotoneForest: duotoneForest,
    duotoneLight: duotoneLight,
    duotoneSea: duotoneSea,
    duotoneSpace: duotoneSpace,
    funky: funky,
    ghcolors: ghcolors,
    gruvboxDark: gruvboxDark,
    gruvboxLight: gruvboxLight,
    hopscotch: hopscotch,
    materialDark: materialDark,
    materialLight: materialLight,
    materialOceanic: materialOceanic,
    nord: nord,
    okaidia: okaidia,
    oneDark: oneDark,
    oneLight: oneLight,
    pojoaque: pojoaque,
    prism: prism,
    shadesOfPurple: shadesOfPurple,
    solarizedlight: solarizedlight,
    synthwave84: synthwave84,
    tomorrow: tomorrow,
    twilight: twilight,
    vs: vs,
    vscDarkPlus: vscDarkPlus,
    xonokai: xonokai,
};

function initDropDownItem(map: { [str: string]: { [key: string]: React.CSSProperties }; }) {
    const res = [];
    for (const key in map) {
        res.push({
            key: key,
            label: key,
        });
    }
    return res;
}

const themeList = initDropDownItem(themeMap);

const saveTheme = function (theme: string) {
    localStorage.setItem('defaultTheme', theme)
}

const initTheme = function () {
    const res = localStorage.getItem('defaultTheme') || 'dracula'
    return {text: res, theme: themeMap[res as 'dracula']}
}



export {
    themeList,
    saveTheme,
    initTheme,
    themeMap,
}