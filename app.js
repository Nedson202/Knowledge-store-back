import express from 'express';
import graphqlHTTP from 'express-graphql';
import passport from 'passport';
import { logger, requestLogger } from './helper/logger';
import schema from './schema/schema';
import models from './models/index';
import stackTracer from './helper/stackTracer';
import passportSetup from './config/passportSetup'; // eslint-disable-line
import authRoutes from './routes';

const app = express();

const port = process.env.PORT || 4000;

// initialize passport
app.use(passport.initialize());

app.use('/auth', authRoutes);

app.use(
  '/graphql',
  graphqlHTTP(req => ({
    schema,
    graphiql: !!process.env.NODE_ENV.match('development'),
    context: req
  }))
);

app.use(requestLogger);

process.on('unhandledRejection', (reason) => {
  stackTracer(reason);
});

process.on('uncaughtException', (reason) => {
  stackTracer(reason);
  process.exit();
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
