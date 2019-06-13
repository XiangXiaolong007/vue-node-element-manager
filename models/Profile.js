const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const ProfileSchema = new Schema({
    // 与user关联
    // user: {
    //     type: Schema.Types.ObjectId,
    //     ref: "users"
    // },
    // writeArr: [
    //     {
    //         type: {
    //             type: String
    //         },
    //         describe: {
    //             type: String
    //         },
    //         income: {
    //             type: String,
    //             required: true
    //         },
    //         expend: {
    //             type: String,
    //             required: true
    //         },
    //         cash: {
    //             type: String,
    //             required: true
    //         },
    //         remark: {
    //             type: String
    //         },
    //         date: {
    //             type: Date,
    //             default: Date.now
    //         }
    //     }
    // ]
    type: {
        type: String
    },
    describe: {
        type: String
    },
    income: {
        type: String,
        required: true
    },
    expend: {
        type: String,
        required: true
    },
    cash: {
        type: String,
        required: true
    },
    remark: {
        type: String
    },
    date: {
        type: Date,
        default: Date.now
    }
})

module.exports = Profile = mongoose.model("profile", ProfileSchema);