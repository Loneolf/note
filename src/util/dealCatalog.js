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

function readDirectory(directoryPath, res) {
	fs.readdir(directoryPath, (err, files) => {
		if (err) {
			console.error("读取目录失败:", err);
			return;
		}

		// 处理目录中的文件和子文件夹
		files.forEach((file) => {
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
					//   console.log('aaafile', file, res);
					file.endsWith(baseConfig.fileType) &&
						res.push({
							label: file.replace(baseConfig.fileType, ''),
							key: file,
						});
				}
			});
		});
	});
}
