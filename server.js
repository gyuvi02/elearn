const app = require('./app');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config({path: './config.env'});

const DB = process.env.DATABASE;
mongoose.connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
}).then(() => console.log('Database connection successful'));

const port = process.env.PORT;
app.listen(port, ()=> {
    console.log(`App running on port ${process.env.PORT}` );
});

