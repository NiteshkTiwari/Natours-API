const dotenv = require('dotenv');
const mongoose = require('mongoose');

process.on('uncaughtException', err => {
  console.log('Uncaught Exception 😶‍🌫️, Shutting Down...😴');
  console.log(err.name, err.message);
  process.exit(1);
});

dotenv.config({ path: './configg.env' });

const app = require('./app');

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log('Database Connection Successful!');
  });




const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log('App is running');
});

process.on('unhandledRejection', err => {
  console.log(err.name, err.message);
  console.log('Unhandled Rejection!😶‍🌫️ Shutting Down...😴');
  server.close(() => {
    process.exit(1);
  });
}); 