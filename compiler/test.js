const parser = require('./index');
const input = '(add 2 (subtract 4 2))';
const output = 'add(2, subtract(4, 2));';

console.log(parser(input) === output, parser(input));