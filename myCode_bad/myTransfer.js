const parser = require('@babel/parser')
const traverse = require('@babel/traverse').default
const generator = require('@babel/generator')
const codeStr = require('./code.js') // 导入上面的js代码
// 参考学习  https://www.yisu.com/zixun/543478.html
// 生成随机字符串
function randomString(len) {
	len = len || 2;
	const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
	// 变量名不能用数字开头， 加个前缀
	let s = '_$';
	for (let i = 0; i < len; i++) {
		s += chars.charAt(Math.floor(Math.random() * chars.length))
	}
	return s;
}
// 记录已改过的作用域
let scopeRecord = {};
// 替换作用域内变量
function replaceScopeVarsName(path) {
	// 防止重复修改
	if (scopeRecord[path.scope.uid]) return;
	for (let i in path.scope.bindings) {
		let item = path.scope.bindings[i]
		// 变量名应该唯一， 这里用随机字符凑合一下
		let newName = randomString()
		// 替换变量名
		item.identifier.name = newName
		// 替换引用
		item.referencePaths.forEach(function(refItem) {
			refItem.node.name = newName;
		})
	}
	scopeRecord[path.scope.uid] = true
}

let ast = parser.parse(codeStr) // 将代码转换成ast(抽象语法树)
// 遍历修改ast
traverse(ast, {
	VariableDeclaration(path) {
		replaceScopeVarsName(path)
	},
	FunctionDeclaration(path){
		replaceScopeVarsName(path)
	}
})
let { code } = generator.default(ast) // 将ast转换成代码, 混淆后的代码
console.log('code:', code);