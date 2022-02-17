

module.exports = function({types: t}) {
  return {
    visitor: {
      // BinaryExpression(path) { // 成功
      //   if (path.node.operator !== "===") {
      //     return;
      //   }
      
      //   path.node.left = t.identifier("sebmck");
      //   path.node.right = t.identifier("dork");
      // },
      // BinaryExpression(path) { // 失败
      //   path.get('left'); 
      // },
      // Program(path) {
      //   path.get('body.0');
      // }
      // BinaryExpression(path) {
      //   path.replaceWith(
      //     t.binaryExpression("**", path.node.left, t.numberLiteral(2))
      //   );
      // },
      // ReturnStatement(path) {
      //   path.replaceWithMultiple([
      //     t.expressionStatement(t.stringLiteral("Is this the real life?")),
      //     t.expressionStatement(t.stringLiteral("Is this just fantasy?")),
      //     t.expressionStatement(t.stringLiteral("(Enjoy singing the rest of the song in your head)")),
      //   ]);
      // }
      FunctionDeclaration(path) {
        // 删除指定函数
        const delfn = path.node.id.name; // 修改函数名
        if (delfn === 'square') {
          path.remove();
        }
        // path.replaceWithSourceString(`function add(a, b) {
        //   return a + b;
        // }`);
      },
      // FunctionDeclaration(path) {
      //   path.insertBefore(t.expressionStatement(t.stringLiteral("Because I'm easy come, easy go.")));
      //   path.insertAfter(t.expressionStatement(t.stringLiteral("A little high, little low.")));
      // },
      ClassMethod(path) {
        path.get('body').unshiftContainer('body', t.expressionStatement(t.stringLiteral('before')));
        path.get('body').pushContainer('body', t.expressionStatement(t.stringLiteral('after')));
      }
    }
  }
};