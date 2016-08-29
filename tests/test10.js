
const Nightmare = require('nightmare');
const nightmare = Nightmare();

module.exports = nightmare
  .goto('http://localhost:9999/test.html')
  .evaluate(function () {
    return document.querySelector('body #test10').textContent
  })
  .end()
  .then(result => Promise.resolve(result))
  .catch(err => Promise.reject(err));