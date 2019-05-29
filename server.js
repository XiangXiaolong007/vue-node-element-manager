const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");

// 引入路由
const users = require("./routes/api/users");
const profile = require("./routes/api/profile");

// DB config
const db = require('./config/keys');
mongoose.connect(db.mongoURI,{ useNewUrlParser: true }).then(() => {
    console.log('MongoDB connected');
}).catch((err) => {
    console.log(err);
})
mongoose.set('useFindAndModify', false);

// 使用body-parser 中间件
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json())

// passport 初始化
app.use(passport.initialize());
require("./config/passport")(passport);

app.get("/", (req, res) => {
    res.send("Hello World!");
})

// 使用routes
app.use('/api/users', users);
app.use('/api/profile', profile);

const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`Server is running on port ${port}...`)
})