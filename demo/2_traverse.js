const parser = require("@babel/parser");
const traverse = require("@babel/traverse");

const code = `function square(n) {
  return n * n;
}`;
const ast = parser.parse(code);

const aa = traverse(ast, {
  enter(path) {
    if (
      path.node.type === "Identifier" &&
      path.node.name === "n"
    ) {
      path.node.name = "x";
    }
  }
});
console.log(aa)

// 执行
// node ./demo/2_traverse.js