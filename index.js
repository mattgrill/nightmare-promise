const cluster = require('cluster');
const path = require('path');
const uuid = require('uuid');
const tests = require('./tests');

const testGroups = Object.keys(tests).reduce((previousValue, currentValue, currentIndex) => {
  if (currentIndex % 2 == 0  && currentIndex !== 0) {
    previousValue.push([]); };
  let testObject = {};
  testObject[currentValue] = tests[currentValue];
  previousValue[previousValue.length - 1].push(testObject);
  return previousValue;
}, [[]]);
const testRunners = testGroups.length;

const workers = {};

if (cluster.isMaster) {
  console.log(`==> Master ${process.pid} has started. <==`);
  for (let i = 0; i < testRunners; i++) {
    let worker = cluster.fork();
    workers[uuid.v4()] = {worker: worker, testGroup: i};
  }

  Object.keys(workers).forEach(id => {
    workers[id].worker.on('message', msg => {
      if (msg.idRequest) {
        workers[id].worker.send({testGroup: workers[id].testGroup});
      }
      if (msg.finished) {
        workers[id].worker.kill();
      }
    });
  });
}
else {
  console.log(`=> Worker ${process.pid} has started. <=`);
  process.send({idRequest: true});

  process.on('message', msg => {
    Promise.all(testGroups[msg.testGroup].map(test => require(path.resolve(__dirname, 'tests', test[Object.keys(test)[0]]))))
      .then(result => {
        console.log('result =>',result);
        process.send({finished: true});
      })
      .catch(err => {
        console.log('err =>', err);
        process.send({finished: true});
      })
  });
}
