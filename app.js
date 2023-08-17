const express = require("express");

const app = express();
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

const globalErrorHandler = require('./controllers/errorController');
const morgan = require('morgan');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const AppError = require('./utils/appError');

app.use(helmet());

const limiter = rateLimit({
    max: 100,
    windowMs: 60 * 60 * 1000,
    message: 'Too many requests. Please try again in 1 hour!'
});

app.use('/api', limiter);

//Body-parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));

//Data sanitization against NO-SQL query Injection
app.use(mongoSanitize());

//Data sanitization against XSS
app.use(xss());

//Preventing parameter pollution
app.use(hpp({
    whitelist: [
        'duration',
        'ratingsQuantity',
        'ratingsAverage',
        'maxGroupSize',
        'difficulty',
        'price'
    ]
}));

//Serving Static files
app.use(express.static(`${__dirname}/public`));

console.log(process.env.NODE_ENV);
if (process.env.NODE_ENV === 'development')
{
    app.use(morgan("dev"));

}

// app.use((req, res, next) => {
//   console.log("HeLLo from the middleware");
//   next();
// });

// app.use("/api/v1/tours/:id", (req, res, next) => {
//   console.log("reqtime is being used");
//   req.requestTime = new Date().toISOString();
//   next();
// });





app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/reviews", reviewRouter);

app.all('*', (req, res, next) => {
    next(new AppError(`Cannot find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);

module.exports = app;