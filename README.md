# AST 迷你版

- [ast在线网站](https://astexplorer.net/)

- 更换指定的变量名：静态编译转换[success]
./node_modules/.bin/babel ./babel/index.js -o ./babel/output.js
./node_modules/.bin/babel ./babel/github_demo.js -o ./babel/github_demo_output.js

- 将MemberExpression 对应的内容替换
NOOD_ENV=production ./node_modules/.bin/babel ./babel/index.js -o ./babel/output.js

- 自定义混淆代码[fail]
node ./myCode/myTransfer.js

- demo[fail]
./node_modules/.bin/babel ./demo/1_parser.js
node ./demo/1_parser.js

## 官网
- [babel-traverse](https://github.com/jamiebuilds/babel-handbook/blob/master/translations/en/plugin-handbook.md#babel-traverse)