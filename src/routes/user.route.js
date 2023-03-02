const express= require("express");
const { get_random_word, post_user, DeleteUser, getUsers } = require("../controller/user.controller");
const router= express.Router();

router.route("/user").post(post_user);
router.route("/word").get(get_random_word);
router.route("/user").delete(DeleteUser);
router.route("/user").get(getUsers);

module.exports=router