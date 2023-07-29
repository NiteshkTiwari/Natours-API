const express = require("express");

const app = express();
const globalErrorHandler = require('./controllers/errorController');
const morgan = require('morgan');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const AppError = require('./utils/appError');


app.use(express.json());
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

app.all('*', (req, res, next) => {
    next(new AppError(`Cannot find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);

module.exports = app;