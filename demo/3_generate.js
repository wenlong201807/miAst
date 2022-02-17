const parser = require("@babel/parser");
const generate = require("@babel/generator");

const code = `function square(n) {
  return n * n;
}`;
const ast = parser.parse(code);

const gen = generate(ast, {}, code);
console.log(gen)

// 执行
// node ./demo/3_generate.js