// module imports
const cluster = require('cluster');
const workers = require('os').cpus().length;

if (cluster.isMaster) {
  console.log('start cluster with %s workers', workers);

  for (let i = 0; i < workers; i++) {
    const work = cluster.fork().process;
    console.log('worker %s started', work.pid);
  }

  cluster.on('exit', function (worker) {
    console.log('worker %s died. restart...', worker.process.pid);
    cluster.fork();
  });
} else {
  require('./server.js');
}

process.on('uncaughtException', function (err) {
  console.error(`${new Date().toUTCString()} uncaughtException:`, err.message);
  console.error(err.stack);
  process.exit(1);
});
