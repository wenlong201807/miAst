const updateParamNameVisitor = {
  Identifier(path) {
    if (path.node.name === this.paramName) {
      path.node.name = "x";
    }
  }
};

const MyVisitor = {
  FunctionDeclaration(path) {
    const param = path.node.params[0];
    const paramName = param.name;
    param.name = "x";

    path.traverse(updateParamNameVisitor, { paramName });
  }
};

module.exports = function({types: t}) {
  return {
    pre(state) {
      this.cache = new Map();
    },
    visitor: {
      // state 是 .babel 配置中第二个参数为对象
      Identifier(path, state) { // 获取变量名
        // console.log('state.opts:', state.opts); // state.opts: { tips: 'newTips' }
        const name = path.node.name;
        if (state.opts[name]) {
          path.node.name = `__${state.opts[name]}__`
        }

        if (name === 'aa') {
          // console.log(666)
          path.node.name = 'a_new';
        }
      },
      MemberExpression(path) {
        if (path.get("object").matchesPattern("process.env")) {
          const key = path.toComputedKey();
          if (t.isStringLiteral(key)) {
            // path.replaceWith(t.valueToNode(process.env[key.value]));
            path.replaceWith(t.valueToNode(`_${process.env[key.value]}`));
          }
        }
      },
      BinaryExpression(path) {
        // console.log(path.node.left);
        // console.log(path.node.right);
      },
      FunctionDeclaration(path) {
        // path.traverse(MyVisitor); // 失败
        // console.log('path.node:', path.node)
        // const param = path.node.params[0];
        // paramName = param.name;
        // param.name = "x";
        // console.log('path.node.id:', path.node.id, path.node.id.name)
        // const oldId = path.node.id.name; // 修改函数名
        // path.node.id.name = `new_${oldId}`

        const id = path.scope.generateUidIdentifierBasedOnNode(path.node.id);
        path.remove();
        path.scope.parent.push({ id, init: path.node });
      },
      StringLiteral(path) {
        throw path.buildCodeFrameError("Error message here");
      }
    },
    post(state) {
      console.log(this.cache);
    },
    
  }
}