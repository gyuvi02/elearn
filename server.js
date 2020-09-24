const app = require('./app');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

process.on('uncaughtException', err => {
    console.log(err.name, err.message);
    console.log('UNHANDLED EXCEPTION! THE PROGRAM WILL QUIT');
    process.exit(1)});

dotenv.config({path: './config.env'});

const DB = process.env.DATABASE;
mongoose.connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
}).then(() => console.log('Database connection successful'));

const port = process.env.PORT;
const server = app.listen(port, ()=> {
    console.log(`App running on port ${process.env.PORT}` );
});

process.on('unhandledRejection', err => {
    console.log(err.name, err.message);
    console.log('UNHANDLED REJECTION! THE PROGRAM WILL QUIT')
    server.close(() => process.exit(1));
});


