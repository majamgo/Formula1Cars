//require('dotenv').config();

const express = require('express');
const session = require('express-session');
const cors = require('cors');
const MongoStore = require('connect-mongo')(session);

const app = express();
const PORT = process.env.PORT;
const SESS_NAME = process.env.SESS_NAME;
const SESS_SECRET = process.env.SESS_SECRET;
const THREE_HOURS = 1000 * 60 * 60 * 3;


// Mongoose og DB
const mongoose = require('mongoose');
mongoose.connect(process.env.DATABASE_URL_ATLAS, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true });
const db = mongoose.connection;
db.on('error', (error) => console.log(error));
db.once('open', () => console.log('connected to Database'));


// APP
app.use(cors({ credentials: true, origin: true }));
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set('trust proxy', 1);


// SESSION
app.use(session({
    name: SESS_NAME,
    resave: false,
    rolling: true,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: db }),
    secret: SESS_SECRET,
    cookie: {
        maxAge: THREE_HOURS,
        sameSite: true,
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true
    }
}));


// INDEX  --------------------------------------------------------------------------------------
app.get('/', async (req, res) => {
    res.send("Velkommen til serveren!");
});


// AUTH
app.use('*/admin*', (req, res, next) => {
    console.log(req.session);

    if(!req.session.userId) {
        return res.status(401).json({ message: "You don't have permission to continue!" });
    }

    next();
});


// CARS
const carRouter = require('./routes/cars.routes');
app.use('/formula1cars', carRouter);


// USER
const userRouter = require('./routes/user.routes');
app.use('/admin/user', userRouter);


// AUTH
const authRouter = require('./routes/auth.routes');
app.use('/auth', authRouter);


app.listen(PORT, () => console.log('Server started - listening on port ' + PORT));