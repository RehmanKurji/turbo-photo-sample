var express = require("express"),
    app = express(),
	bodyParser = require("body-parser"),
	mongoose = require("mongoose"),
	flash = require("connect-flash"),
	passport = require("passport"),
	LocalStrategy = require("passport-local"),
	methodOverride = require("method-override"),
	Campground = require("./models/campground"),
	seedDB = require("./seeds"),
	Comment = require("./models/comment"),
	User = require("./models/user");

	//requiring routes
	var commentRoutes = require("./routes/comments"),
		campgroundRoutes = require("./routes/campgrounds"),
		indexRoutes = require("./routes/index");

//seedDB();
//mongoose.connect("mongodb://localhost/yelp_camp", {useNewUrlParser: true, useUnifiedTopology:true});
mongoose.connect("mongodb+srv://RehmanKurji:testing786@cluster0.7fgce.mongodb.net/yelp_camp?retryWrites=true&w=majority",{
	useNewUrlParser: true, 
	useUnifiedTopology:true, 
	useCreateIndex: true
}).then(() => {
	console.log("Connected to DB!");
}).catch(err => {
	console.log("ERROR:", err.message);
});
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
//console.log(__dirname);

// // SCHEMA SETUP
// var campgroundSchema = new mongoose.Schema({
// 	name: String,
// 	image: String,
// 	description: String
// })

// var Campground = mongoose.model("Campground", campgroundSchema);

// Campground.create(
// 	{name: "Salmon River", 
// 	 image: "https://cdn.pixabay.com/photo/2016/11/21/16/03/campfire-1846142_1280.jpg"
// 	}, function(err, campground){
// 		if(err){
// 			console.log(err);
// 		} else {
// 			console.log("New Campground Created");
// 			console.log(campground);
// 		}
// 	});

// var campgrounds = [
// 		{name: "Salmon River", image: "https://cdn.pixabay.com/photo/2016/11/21/16/03/campfire-1846142_1280.jpg"},
// 		{name: "Camp Huron", image: "https://cdn.pixabay.com/photo/2016/01/19/16/48/teepee-1149402_1280.jpg"},
// 		{name: "Kicking Horse Pass", image: "https://cdn.pixabay.com/photo/2016/11/22/23/08/adventure-1851092_1280.jpg"},
// 	{name: "Salmon River", image: "https://cdn.pixabay.com/photo/2016/11/21/16/03/campfire-1846142_1280.jpg"},
// 		{name: "Camp Huron", image: "https://cdn.pixabay.com/photo/2016/01/19/16/48/teepee-1149402_1280.jpg"},
// 		{name: "Kicking Horse Pass", image: "https://cdn.pixabay.com/photo/2016/11/22/23/08/adventure-1851092_1280.jpg"},
// 	{name: "Salmon River", image: "https://cdn.pixabay.com/photo/2016/11/21/16/03/campfire-1846142_1280.jpg"},
// 		{name: "Camp Huron", image: "https://cdn.pixabay.com/photo/2016/01/19/16/48/teepee-1149402_1280.jpg"},
// 		{name: "Kicking Horse Pass", image: "https://cdn.pixabay.com/photo/2016/11/22/23/08/adventure-1851092_1280.jpg"}
		
// 	];

// PASSPORT CONFIGURATION
app.use(require("express-session")({
	secret: "I drove all the way to North Bay from Ottawa, and drove to Toronto from there!",
	resave: false,
	saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.warning = req.flash("warning");
	res.locals.success = req.flash("success");
	next();
});

app.use(indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

var port = process.env.PORT || 3000;
app.listen(port, function() {
	console.log("Running YelpCamp Server")
});