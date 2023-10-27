require('dotenv').config()

const express = require('express')
const app = express()
const port = 3000 || process.env.PORT;

const expressLayouts = require('express-ejs-layouts')
const methodOverride = require("method-override");

const connectDB = require('./server/config/db')

const session = require('express-session')
const passport = require('passport')
const MongoStore = require('connect-mongo')

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl: 'mongodb://0.0.0.0:27017/noteApp'
    }),
    // 7 Days
    // cookie: { maxAge: new Date(Date.now() + (3600000)) }
}))

app.use(passport.initialize())
app.use(passport.session())

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(methodOverride("_method"));

//connect to mongodb 
connectDB()

// static Files
app.use(express.static('public'))

// Template Engine
app.use(expressLayouts)
app.set('layout', './layouts/main')
app.set('view engine', 'ejs')

// Routes
app.use('/', require("./server/routes/auth"))
app.use('/', require("./server/routes/index"))
app.use('/', require("./server/routes/dashboard"))

//Handle 404
app.get('*', (req, res) => {
    res.status(404).render('404')
})

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
})