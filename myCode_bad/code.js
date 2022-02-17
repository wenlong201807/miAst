// 全局变量
const str = 'someone';
// 自定义函数， 局部变量
function greet(name) {
	// 系统函数调用， 局部变量使用
	console.log('hello ' + name);
}
// 自定义函数调用， 全局变量使用
greet(str);