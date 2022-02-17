// before (add 2 (subtract 4 2))
// after add(2, subtract(4, 2));

// ast 是描述数据结构的形式
// (add 2 (subtract 4 2)) 经过ast转化之后如下效果 
// 数据结构模型
// const obj = [ // 目标效果
//   {
//     name: 'add',
//     type: 'function',
//     params: [
//       {
//         value: 2,
//         type: 'number',
//       },
//       {
//         name: 'subtract',
//         type: 'function',
//         params: [
//           {
//             value: 4,
//             type: 'number',
//           },
//           {
//             value: 2,
//             type: 'number',
//           },
//         ]
//       }
//     ]
//   }
// ]

// 目标效果过于复杂，我们先生成一个以为对象数据结构，再生成嵌套的目标效果数组
// 分词，处理每个字符内容
function generateToken(str) {
  let current = 0;
  let tokens = [];
  while(current < str.length) {
    let char = str[current];

    if (char === "(") {
      tokens.push({
        type: "paren",
        value: "("
      });
      current++;
      continue;
    }

    if (char === ")") {
      tokens.push({
        type: "paren",
        value: ")"
      });
      current++;
      continue;
    }

    if (/\s/.test(char)) {
      current++;
      continue;
    }

    if (/[0-9]/.test(char)) {
      let numberValue = '';
      while(/[0-9]/.test(char)) {
        numberValue += char;
        char = str[++current];
      }
      tokens.push({
        type: 'number',
        value: numberValue
      });
      continue;
    }

    if (/[a-z]/.test(char)) {
      let stringValue = '';
      while(/[a-z]/.test(char)) {
        stringValue += char;
        char = str[++current];
      }
      tokens.push({
        type: 'name',
        value: stringValue
      });
      continue;
    }

    throw new TypeError("未能识别的字符");
  }

  return tokens;
}
/*
分词函数处理结果

输入为 const input = '(add 2 (subtract 4 2))';

输出为 如下
token: [
  { type: 'paren', value: '(' },
  { type: 'name', value: 'add' },
  { type: 'number', value: '2' },
  { type: 'paren', value: '(' },
  { type: 'name', value: 'subtract' },
  { type: 'number', value: '4' },
  { type: 'number', value: '2' },
  { type: 'paren', value: ')' },
  { type: 'paren', value: ')' }
]
*/ 

// AST 生成
function generateAST(tokens) {
  let current = 0;

  let ast = {
    type: "Program",
    body: [],
  };
  // 闭包缘故，需要访问父级变量，并在父级作用于中使用更新后的变量数据
  function walk() {
    let token = tokens[current];
    if (token.type === 'number') {
      current++;
      return {
        type: "NumberLiteral",
        value: token.value,
      }
    }
    if (token.type === 'paren' && token.value === "(") {
      token = tokens[++current];
      let node = {
        type: "CallExpression",
        name: token.value,
        params: [],
      };
      token = tokens[++current];

      while(
        (token.type !== "paren") || (token.type === 'paren' && token.value !== ")")
      ) {
        node.params.push(walk());
        token = tokens[current];
      }
      current++;
      return node;
    }

    throw new TypeError(token.type);
  }

  while(current < tokens.length) {
    ast.body.push(walk())
  }
  return ast;
}
/*
JSON.stringify(generateAST(tokens))
json化的 结果数据如下 详细内容看 ast.json文件

ast: {"type":"Program","body":[{"type":"CallExpression","name":"add","params":[{"type":"NumberLiteral","value":"2"},{"type":"CallExpression","name":"subtract","params":[{"type":"NumberLiteral","value":"4"},{"type":"NumberLiteral","value":"2"}]}]}]}
*/


// AST 转化： babel 插件需要我们处理的部分
function transformer(ast) {
  let newAst = {
    type: "Program",
    body: [],
  };

  ast._context = newAst.body;

  DFS(ast, {
    NumberLiteral: {
      enter(node, parent) {
        parent._context.push({
          type: "NumberLiteral",
          value: node.value // 人为操作的地方再这里
          // value: `${Number(node.value) + 3}` // 每个数字 +3
        });
      }
    },
    CallExpression: {
      enter(node, parent) {
        let expression = {
          type: "CallExpression",
          callee: {
            type: "Identifier",
            name: node.name
          },
          arguments: [],
        };

        node._context = expression.arguments;
        if (parent.type !== "CallExpression") {
          expression = {
            type: "ExpressionStatement",
            expression: expression,
          }
        }
        parent._context.push(expression);
      }
    }
  })

  return newAst;
}
/*
JSON.stringify(transformer(ast))
json化的 结果数据查看 详细内容看 newAst.json文件
*/

// AST 遍历
function DFS(ast, visitor) {

  function traverseArray(children, parent) {
    children.forEach(child => traverseNode(child, parent));
  }

  function traverseNode(node, parent) {
    let methods = visitor[node.type];
    if (methods && methods.enter) {
      methods.enter(node, parent);
    }
    switch(node.type) {
      case "Program":
        traverseArray(node.body, node);
        break;
      case "CallExpression":
        traverseArray(node.params, node);
        break;
      case "NumberLiteral":
        break;
    }
    if (methods && methods.exit) {
      methods.exit(node, parent);
    }
  }
  return traverseNode(ast, null);
}



// ast -> code 生成代码过程
function generate(ast) {
  switch(ast.type) {
    case "Program": return ast.body.map(subAst => generate(subAst)).join('\n');
    case "ExpressionStatement": return generate(ast.expression) + ";";
    case "CallExpression": return generate(ast.callee) + "(" +ast.arguments.map(arg => generate(arg)).join(', ') + ")";
    case "Identifier": return ast.name;
    case "NumberLiteral": return ast.value;
  }
}
// 返回目标结果 add(2, subtract(4, 2));

/*
1、分词，处理每个字符内容
2、AST 生成
3、AST 转化： babel 插件需要我们处理的部分
4、ast -> code 生成代码过程
*/
function parser(input) {
  const tokens = generateToken(input); 
  // console.log('token:', tokens)
  const ast = generateAST(tokens);
  // console.log('ast:', JSON.stringify(ast))
  const newAst = transformer(ast); // 人为操作的地方再这里
  // console.log('newAst:', JSON.stringify(newAst))
  const code = generate(newAst); 
  // console.log('code:', code)
  return code;
}

module.exports = parser;





































