const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const compression = require('compression');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const storyRoutes = require('./routes/storyRoutes');
const { notFoundHandler, globalErrorHandler } = require('./middlewares/errorMiddleware');

const app = express();

app.set('trust proxy', 1);

app.use(helmet());
app.use(cors());
app.use(compression());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());

const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: { success: false, message: 'Too many requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api', globalLimiter);
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "API is running "
  });
});
app.use('/api/stories', storyRoutes);

app.use(notFoundHandler);
app.use(globalErrorHandler);

module.exports = app;
