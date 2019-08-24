import express from 'express';
import graphqlHTTP from 'express-graphql';
import passport from 'passport';
import cors from 'cors';
import http from 'http';
import https from 'https';
import helmet from 'helmet';
import { stackLogger } from 'info-logger';
import requestLogger from './helper/requestLogger';
import schema from './graphql';
import models from './models/index';
import './config/passportSetup';
import authRoutes from './routes';
import {
  checkHealthStatus, createMapping
} from './elasticSearch';
import logger from './utils/initLogger';
import {
  development, unhandledRejection,
  uncaughtException, SIGTERM
} from './utils/default';
import './redis';

const app = express();

const port = process.env.PORT || 4000;
const appUrl = process.env.NODE_ENV.match(development)
  ? `http://localhost:${port}` : process.env.PROD_SERVER;

// enable cross origin resource sharing
app.use(cors());
app.use(helmet());

// initialize passport
app.use(passport.initialize());

app.use('/auth', authRoutes);

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.use(
  '/graphql',
  graphqlHTTP(req => ({
    schema,
    graphiql: !!process.env.NODE_ENV.match(development),
    context: req
  }))
);

app.use(requestLogger);

process.on(unhandledRejection, (reason) => {
  stackLogger(reason);
});

process.on(uncaughtException, (reason) => {
  stackLogger(reason);
  process.exit(0);
});

process.on(SIGTERM, () => {
  process.exit(0);
});

app.listen(port,
  () => {
    logger.info(`
      App running on ${process.env.NODE_ENV.toUpperCase()}
      mode and listening on port ${port} ...\n`);
    models.sequelize.sync({
      logging: false
    });
  });

const httpProtocol = process.env.NODE_ENV.match(development) ? http : https;

setInterval(() => {
  (() => {
    httpProtocol.get(`${appUrl}/healthChecker`, () => { });
  })();
}, 1000 * 10 * 60);

checkHealthStatus();
createMapping();
