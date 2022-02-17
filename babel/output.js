// 指定了要修改的变量名
let __newTips__ = ["Click on any AST node with a '+' to expand it", "Hovering over a node highlights the \
   corresponding location in the source code", "Shift click on an AST node to expand the whole subtree"];

// 不要修改的变量名
let arr = [];

// 将MemberExpression 对应的内容替换
const a = "_undefined";

// 修改函数
function new_add(a_new, b) {
  return a_new + b;
}
