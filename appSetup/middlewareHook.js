import express from 'express';
import graphqlHTTP from 'express-graphql';
import passport from 'passport';
import cors from 'cors';
import helmet from 'helmet';

import schema from '../graphql';
import '../passport';
import authRoutes from '../routes';

import requestLogger from '../helper/requestLogger';
import { DEVELOPMENT } from '../settings/default';

const app = express();

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
    graphiql: !!process.env.NODE_ENV.match(DEVELOPMENT),
    context: req
  }))
);

app.use(requestLogger);

export default app;
