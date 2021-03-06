const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const { NODE_ENV } = require('./config');
const errorHandler = require('./middleware/error-handler');
const authRouter = require('./auth/auth-router');
const languageRouter = require('./language/language-router');
const userRouter = require('./user/user-router');

const app = express();

app.use(
  morgan(NODE_ENV === 'production' ? 'tiny' : 'common', {
    skip: () => NODE_ENV === 'test'
  })
);

const corsOptions = {
  origin: [
    'https://spaced-repetition-eight-blue.now.sh',
    'https://michael-balay-spaced-repetition.now.sh',
    'https://spaced-repetition.balayaydemir.now.sh',
    'http://localhost:3000',
    'https://turkishly.now.sh'
  ]
};

app.use(cors(corsOptions));
app.use(helmet());

app.use('/api/auth', authRouter);
app.use('/api/language', languageRouter);
app.use('/api/user', userRouter);

app.use(errorHandler);

module.exports = app;
