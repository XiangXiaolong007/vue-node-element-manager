// @login & register
const express = require('express');
const router = express.Router();
const User = require("../../models/User");
const bcrypt = require("bcrypt");
const gravatar = require("gravatar");
const jwt = require("jsonwebtoken");
const passport = require("passport");

const key = require("../../config/keys");

/**
 * $route  GET  api/users/test
 * @description 返回的请求的json数据
 * @access public
 */
router.get("/test", (req, res) => {
    res.json({
        msg: "login works"
    })
})

/**
 * $route  POST  api/users/register
 * @description 返回的请求的json数据
 * @access public
 */
router.post("/register", (req, res) => {
    // console.log(req.body)
    // 查询数据库中是否拥有该邮箱
    User.findOne({
        email: req.body.email
    }).then(user => {
        if(user) {
            return res.status(409).json({
                email: "邮箱已被注册"
            })
        } else {
            const avatar = gravatar.url(req.body.email, {s: '200', r: 'pg', d: 'mm'});
            const newUser = new User({
                name: req.body.name,
                email: req.body.email,
                avatar,
                password: req.body.password,
                identity: req.body.identity
            })

            bcrypt.genSalt(10, function(err, salt) {
                bcrypt.hash(newUser.password, salt, function(err, hash) {
                    if(err) throw err;
                    newUser.password = hash; 
                    newUser.save()
                        .then(user => {
                            res.json(user)
                        })
                        .catch(err => console.log(err)) 
                })
            })
        }
    })
})
/**
 * $route  POST  api/users/login
 * @description 返回token jwt passport
 * @access public
 */
router.post("/login", (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    User.findOne({
        email
    }).then((user) => {
        if(!user) {
            return res.status(404).json({
                errmsg: "邮箱未注册"
            })
        } else {
            bcrypt.compare(password, user.password).then((isMatch) => {
                if(!isMatch) {
                    return res.status(400).json({
                        errmsg: "密码错误"
                    })
                } else {
                    const rule = {
                        id: user.id,
                        name: user.name,
                        identity: user.identity,
                        avatar: user.avatar
                    }
                    jwt.sign(rule, key.secretOrKey, {
                        expiresIn: 3600
                    }, (err, token) => {
                        res.json({
                            msg: "success",
                            token: "Bearer " + token
                        })
                    })
                }
            })
        }
    })
})
/**
 * $route  GET  api/users/current
 * @description 返回当前用户信息
 * @access Private
 */
router.get("/current", passport.authenticate('jwt', {session: false}), (req, res) => {
    res.json({
        id: req.user.id,
        name: req.user.name,
        email: req.user.email,
        identity: req.user.identity
    })
})
module.exports = router;
