
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const requestLogger = require('morgan');
const ConfigurationService = require('./services/configuration.service');
const kafka = require('kafka-node');
const environment = require('process').env;

const indexRouterFactory = require('./routes/index');
const healthRouterFactory = require('./routes/health');
const defaults = require('./defaults');

// Get configuration / environment variables
const configurationService = new ConfigurationService(defaults, environment);
const config = configurationService.loadConfiguration();

function createKafkaListenerFunction(socket) {
  return () => {
    socket.emit('message', 'jackbird')
    console.log('kafka listener called');
  };
}

function initKafkaConsumer() {
  console.info('Consumer is connecting to kafka at:', config.KAFKA_HOST);
  const kafkaClient = new kafka.KafkaClient({kafkaHost: config.KAFKA_HOST});
  const kafkaConsumer = new kafka.Consumer(
    kafkaClient,
    [
        { 
          topic: 'birds' 
        }
    ],
    {
        autoCommit: false
    }    
  );

  return kafkaConsumer;
}

function initWebsocket(server, kafkaConsumer) {
  const io = socketIO(server);
  // A client has connected to our websocket
  io.on('connection', (socket) => {
    // TODO: Authentication https://socket.io/docs/client-api/
    console.log('a user connected');
    const listenerFunction = createKafkaListenerFunction(socket);
    kafkaConsumer.on('message', listenerFunction);

    socket.on('disconnect', () => {
      console.log('user disconnected');
      kafkaConsumer.removeListener("message", listenerFunction);
    });
  
    socket.on('birds', (bird) => {
      console.log('bird arrived', bird);
    });

  });

  return io;
}

function startApp() {

  const app = express();
  const server = http.Server(app);

  server.listen(config.PORT, () => {
    console.log('listening on *:' + config.PORT);
  });

  app.use(requestLogger('dev'));

  const kafkaConsumer = initKafkaConsumer();
  const io = initWebsocket(server, kafkaConsumer);

  // Routes
  app.use('/', indexRouterFactory(io));
  app.use('/health', healthRouterFactory());

  return app;
}

module.exports = {
  start: startApp
}