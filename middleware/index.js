var Campground = require("../models/campground");
var Comment = require("../models/comment");

// For ALL Middleware
var middlewareObj = {};

middlewareObj.checkCampgroundOwnership = function(req, res, next){
	// is logged in?
	if(req.isAuthenticated()){
		Campground.findById(req.params.id, function(err, foundCampground){
			if(err || !foundCampground) {
				req.flash("error", "ERROR: Campground not found");
				res.redirect("back")
			} else {
				//does user own campgrounds?
				if(foundCampground.author.id.equals(req.user._id)){
					next();
				} else {
					req.flash("error", "ERROR: Access Denied!!");
					res.redirect("back");
				}	
			}
		});	
	} else {
		req.flash("warning", "Please log in");
		res.redirect("back");
	}
};

middlewareObj.checkCommentOwnership = function(req, res, next){
	// is logged in?
	if(req.isAuthenticated()){
		Comment.findById(req.params.comment_id, function(err, foundComment){
			if(err || !foundComment) {
				req.flash("error", "ERROR: Comment not found");
				res.redirect("back")
			} else {
				//does user own comment?
				if(foundComment.author.id.equals(req.user._id)){
					next();
				} else {
					req.flash("error", "ERROR: Your account is not authorized to make the following change");
					res.redirect("back");
				}	
			}
		});	
	} else {
		req.flash("warning", "Please log in");
		res.redirect("back");
	}
	
}

middlewareObj.isLoggedIn = function(req, res, next){
	// is authenticated?
	if(req.isAuthenticated()){
		return next();
	}
	req.flash("warning", "Please Login First!")
	res.redirect("/login");
}
	

module.exports = middlewareObj;