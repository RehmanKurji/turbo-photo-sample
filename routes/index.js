var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");

//route route
router.get("/", function(req,res){
	res.render("landing");
});


//**************************************
//AUTH ROUTES
//display registration form
router.get("/register", function(req, res){
	res.render("register");
});

// sign up logic handling
router.post("/register", function(req, res){
	var newUser = new User({username: req.body.username});
	User.register(newUser, req.body.password, function(err, user){
		if(err){
			req.flash("error", "ERROR: " + err.message);
			return res.redirect("/register");
		}
		passport.authenticate("local")(req, res, function(){
			req.flash("success", "Welcome to YelpCamp " + user.username);
			res.redirect("/campgrounds");
		});
	});
});

//show login form
router.get("/login", function(req, res){
	res.render("login" /*, {message: req.flash("error")}*/);
});

//handling login logic
router.post("/login", passport.authenticate("local", 
	{
	successRedirect: "/campgrounds",
	failureRedirect: "/login"
	}), function(req, res){
});

//Logout
router.get("/logout", function(req, res){
	req.logout();
	req.flash("warning", "Logged you out!");
	res.redirect("/campgrounds");
});


module.exports = router;