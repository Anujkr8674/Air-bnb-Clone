const express = require("express");
// const router = express.Router({mergeParams:true});
const router = express.Router();
const User = require("../models/user");
const wrapAsync = require("../utils/wrapAsync");

const passport = require("passport"); // Fix: Correct import

const {saveRedirectUrl} = require("../middleware.js")

const userController = require("../controllers/users.js");



router.route("/signup")
//  singupform
.get( userController.renderSignupForm)

// singup
.post( wrapAsync(userController.signup));


router.route("/login")
    // login form
.get( userController.renderLoginForm)
    // login
.post(
    saveRedirectUrl,
    passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash : true,
    }),
    userController.login
    );



    // logout
router.get("/logout", userController.logout);

module.exports = router;

