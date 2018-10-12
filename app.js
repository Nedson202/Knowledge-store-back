import express from 'express';
import graphqlHTTP from 'express-graphql';
import { logger} from './helper/logger';
import passport from 'passport';
import schema from './schema/schema';
import models from './models/index';
import stackTracer from './helper/stackTracer';
import { requestLogger } from './helper/logger';
import passportSetup from './config/passportSetup';
import authRoutes from './routes';

const app = express();

const port = process.env.PORT || 4000;

// initialize passport
app.use(passport.initialize());

app.use('/auth', authRoutes);

const isAuthenticated = (req, res, next) => {
  return req.isAuthenticated() ?
    next() : res.redirect('/auth');
}

app.use(
  '/graphql',
  isAuthenticated,
  graphqlHTTP(req => ({
    schema,
    graphiql: process.env.NODE_ENV.match('development') ? true : false,
    context: req
  }))
)

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
    logger.info(`App running on ${process.env.NODE_ENV.toUpperCase()} mode and listening on port ${port} ...\n`);
    models.sequelize.sync({
      logging: false
    });
  }
);