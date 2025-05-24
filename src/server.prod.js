// module imports
const cluster = require('node:cluster');
const os = require('node:os');

if (cluster.isPrimary) {
  const numCPUs = os.cpus().length;
  console.log(`Primary ${process.pid} is running`);
  console.log(`Forking for ${numCPUs} CPUs`);

  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    if (code !== 0 && !worker.exitedAfterDisconnect) {
      console.log(`Worker ${worker.process.pid} died. Restarting...`);
      cluster.fork();
    }
  });

  process.on('SIGTERM', () => {
    console.log('SIGTERM signal received: closing HTTP server');
    for (const id in cluster.workers) {
      cluster.workers[id].send('shutdown');
    }
  });
} else {
  require('./server.js');
  console.log(`Worker ${process.pid} started`);
}


process.on('uncaughtException', (error) => {
  console.error(`${new Date().toISOString()} Uncaught Exception:`, error.message);
  console.error(error.stack);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error(`${new Date().toISOString()} Unhandled Rejection at:`, promise);
  console.error('Reason:', reason);
  process.exit(1);
});