const parser = require("@babel/parser");

const code = `function square(n) {
  return n * n;
}`;

const aa = parser.parse(code, {
  // sourceType: "module", // default: "script"
  // plugins: ["jsx"] // default: []
});
// Node {
//   type: "File",
//   start: 0,
//   end: 38,
//   loc: SourceLocation {...},
//   program: Node {...},
//   comments: [],
//   tokens: [...]
// }

console.log(aa)

// 执行
// node ./demo/1_parser.js