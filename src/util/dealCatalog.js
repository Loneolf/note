const fs = require("fs");
const path = require("path");

const config = {
	md: {
		path: '../mds',
		outFile: '../mds/mdCatalog.js',
		outName: 'mdCatalog',
		fileType: '.md'
	},
	case: {
		path: '../case/remote',
		outFile: '../page/case/caseRemoteCatalog.js',
		outName: 'caseCatalog',
		fileType: '.html'
	},
	bgimg: {
		path: '../assets/bgImg',
		outFile: '../page/home/bgConfig.js',
		outName: 'bgImgCatalog',
		fileType: ['.png', '.jpg', '.jpeg', '.gif', '.webp']
	}
}

const baseConfig = config[process.env?.readFile || 'md']

const dealPath = path.resolve(__dirname, baseConfig.path);

const mydata = [];
readDirectory(dealPath, mydata);
setTimeout(() => {
	console.log("aaamyData", JSON.stringify(mydata));
	fs.writeFile(
		path.resolve(__dirname, baseConfig.outFile),
		`export const ${baseConfig.outName} = ${JSON.stringify(mydata)}`,
		(error) => {
			if (error) {
				console.log("写入文件错误", error);
			} else {
				console.log("写入文件成功");
			}
		}
	);
}, 100);


/**
 * 读取目录下的文件和子目录，并将文件名和目录名处理后存储在 res 数组中
 * @param {string} directoryPath - 目录路径
 * @param {Array} res - 存储文件名和目录名的数组
 */
function readDirectory(directoryPath, res) {
	// 使用 fs.readdir 方法读取目录下的文件和子目录
	fs.readdir(directoryPath, (err, files) => {
		if (err) {
			console.error("读取目录失败:", err);
			return;
		}

		// 遍历读取到的文件和子目录
		files.forEach((file) => {
			// 使用 path.join 方法拼接文件路径
			const filePath = path.join(directoryPath, file);
			fs.stat(filePath, (err, stats) => {
				if (err) {
					console.error("处理文件失败:", err);
					return;
				}

				if (stats.isDirectory()) {
					// 如果是子文件夹，递归读取
					//   console.log('aaadirectory', file)
					let dirItem = {
						label: file,
						key: file,
						children: [],
					};
					res.unshift(dirItem);
					readDirectory(filePath, dirItem.children);
				} else {
					  console.log('aaafile', file, res);
					let isPush = false;
					if (Array.isArray(baseConfig.fileType)) {
						isPush = baseConfig.fileType.some((item) => {
							return file.endsWith(item)
						});
					} else {
						isPush = file.endsWith(baseConfig.fileType);
					}
					isPush && res.push({
						label: file.replace(baseConfig.fileType, ''),
						key: file,
					});
				}
			});
		});
	});
}
