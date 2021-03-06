
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const requestLogger = require('morgan');
const ConfigurationService = require('./services/configuration.service');
const kafka = require('kafka-node');
const environment = require('process').env;
// Security
const helmet = require('helmet');
const cors = require('cors');

const healthRouterFactory = require('./routes/health');
const defaults = require('./defaults');

function buildConfig(defaultConfig, env) {
  const configurationService = new ConfigurationService(defaultConfig, env);

  return configurationService.loadConfiguration();
}

function buildKafkaAlertConsumer(config) {
  console.info('Consumer is connecting to kafka at:', config.KAFKA_HOST);
  const kafkaClient = new kafka.KafkaClient({kafkaHost: config.KAFKA_HOST});
  const kafkaConsumer = new kafka.Consumer(
    kafkaClient,
    [
        { 
          topic: 'alert' 
        }
    ],
    {
        autoCommit: false
    }    
  );

  return kafkaConsumer;
}

function buildAlertMulticasterWebsocket(server) {
  const io = socketIO(server);
  // A client has connected to our websocket
  io.on('connection', (socket) => {
    // TODO: Authentication https://socket.io/docs/client-api/
    console.log('Websocket', 'client joined');

    socket.on('disconnect', () => {
      console.log('Websocket', 'client disconnected');
    });
  });

  return io;
}

function startApp() {
  const config = buildConfig(defaults, environment);

  const app = express();
  const server = http.Server(app);

  server.listen(config.PORT, () => {
    console.log('listening on *:' + config.PORT);
  });

  app.use(requestLogger('dev'));
  app.use(helmet());
  app.use(helmet.noCache());
  app.use(cors());

  const multicaster = buildAlertMulticasterWebsocket(server);

  const kafkaAlertConsumer = buildKafkaAlertConsumer(config);
  kafkaAlertConsumer.on('message', (alert) => {
    multicaster.emit('alert', alert);
    console.info('Websocket', 'alert emitted');
  });

  // Routes
  app.use('/health', healthRouterFactory());

  return app;
}

module.exports = {
  start: startApp
}