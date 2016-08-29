const Nightmare = require('nightmare');
const nightmare = Nightmare({show: true});

const port = 8000;
module.exports = () => nightmare
  .goto(`http://localhost:${port}/demo.html?demo=2`)
  .evaluate(function () {
    return document.querySelector('body #title2').textContent
  })
  .end()
  .then(result => Promise.resolve(result));
