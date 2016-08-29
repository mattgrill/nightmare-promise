const tests = require('./tests');
Promise.all(Object.keys(tests).map(test => tests[test]()))
  .then(result => console.log('result =>', result))
  .catch(err => console.log('err =>', err))
