const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    name : {type: String, required: true},
    score:{type:String, required:true},
    difficulty:{type:String, required:true},
})

const UserModel = mongoose.model("userrandomgame", userSchema)

module.exports = { UserModel }