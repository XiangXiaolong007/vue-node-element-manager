// @login & register
const express = require('express');
const router = express.Router();
const Profile = require("../../models/Profile");
const passport = require("passport");

/**
 * $route  GET  api/profile/test
 * @description 返回的请求的json数据
 * @access public
 */
router.get("/test", (req, res) => {
    res.json({
        msg: "profile works"
    })
})

/**
 * $route  POST  api/profile/add
 * @description 创建信息接口
 * @access Private
 */
router.post("/add", passport.authenticate('jwt', {session: false}), (req, res) => {
    const profileFields = {};

    if(req.body.type) profileFields.type = req.body.type;
    if(req.body.describe) profileFields.describe = req.body.describe;
    if(req.body.income) profileFields.income = req.body.income;
    if(req.body.cash) profileFields.cash = req.body.cash;
    if(req.body.expend) profileFields.expend = req.body.expend;
    if(req.body.remark) profileFields.remark = req.body.remark;

    new Profile(profileFields).save().then(profile => {
        res.json(profile);
    })
})
/**
 * $route  GET  api/profile
 * @description 获取所有信息
 * @access Private
 */
router.get("/", passport.authenticate('jwt', {session: false}), (req, res) => {
    Profile.find().then(profile => {
        if(!profile) {
            return res.status(404).json({
                errmsg: "没有任何信息"
            });
        }
        res.json(profile);
    }).catch(err => {
        return res.status(400).json(err);
    })
})

/**
 * $route  GET  api/profile/:id
 * @description 获取单条信息
 * @access Private
 */
router.get("/:id", passport.authenticate('jwt', {session: false}), (req, res) => {
    Profile.findOne({
        _id: req.params.id
    }).then(profile => {
        if(!profile) {
            return res.status(404).json({
                errmsg: "没有找到相关信息"
            });
        }
        res.json(profile);
    }).catch(err => {
        return res.status(400).json(err);
    })
})

/**
 * $route  POST  api/profile/edit/:id
 * @description 编辑信息接口
 * @access Private
 */
router.post("/edit/:id", passport.authenticate('jwt', {session: false}), (req, res) => {
    const profileFields = {};

    if(req.body.type) profileFields.type = req.body.type;
    if(req.body.describe) profileFields.describe = req.body.describe;
    if(req.body.income) profileFields.income = req.body.income;
    if(req.body.cash) profileFields.cash = req.body.cash;
    if(req.body.expend) profileFields.expend = req.body.expend;
    if(req.body.remark) profileFields.remark = req.body.remark;

    Profile.findOneAndUpdate({
        _id: req.params.id
    }, {
        $set: profileFields
    }, {
        new: true
    }).then(profile => {
        res.json(profile)
    }).catch(err => {
        res.status(400).json(err);
    })
})
/**
 * $route  DELETE  api/profile/delete/:id
 * @description 删除信息接口
 * @access Private
 */
router.delete("/delete/:id", passport.authenticate('jwt', {session: false}), (req, res) => {
    Profile.findOneAndRemove({
        _id: req.params.id
    }).then(profile => {
        profile.save().then(response => {
            res.json(response)
        })
    }).catch(err => {
        res.status(404).json({
            errmsg: "删除失败"
        })
    })
})
module.exports = router;
