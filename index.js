var express = require("express");
var index = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var methodOverride = require("method-override");
mongoose.connect("mongodb://localhost/blog_app",{useNewUrlParser: true});
index.set("view engine","ejs");
index.use(express.static("public"));
index.use(methodOverride("_method"));
index.use(bodyParser.urlencoded({extended: true}));


var blogSchema = mongoose.Schema({
	title: String,
	image: String,
	body: String,
	Created: {type: Date, default: Date.now()}
});

var Blog = mongoose.model("Blog", blogSchema);



index.get("/", function(req,res){
	res.redirect("/blog");
});

index.get("/blog", function(req,res){
	Blog.find({},function(err, blogs){
		if(err)
			{
				console.log("ERRor");
			}
		else
			{
				res.render("page",{blogs: blogs});
			}
	});
});

index.get("/blog/new", function(req, res){
	res.render("form");
});

index.post("/blog", function(req, res){
	Blog.create(req.body.blog, function(err, newblog){
		if(err)
			{
				console.log("new");
			}
		else
			{
				res.redirect("/blog");
			}
	});
});

index.get("/blog/:id",function(req,res){
	Blog.findById(req.params.id, function(err, found){
		if(err)
			{
				res.redirect("/blog");
			}
		else
			{
				res.render("show",{blog: found});
			}
	});
});

index.get("/blog/:id/edit",function(req,res){
	Blog.findById(req.params.id, function(err,found)
				 {
		if(err)
			{
				console.log("error");
			}
		else
			{
					res.render("edit",{blog: found});
			}
	});
});

index.put("/blog/:id",function(req,res){
	Blog.findByIdAndUpdate(req.params.id,req.body.blog, function(err,found)
						  {
		if(err)
			{
				console.log("error");
			}
		else
			{
				  var showUrl = "/blog/" + req.params.id;
				  console.log(req.body.blog);
				  console.log(req.params.id);
                   res.redirect(showUrl);
			}
	});
});

index.delete("/blog/:id",function(req,res){
	Blog.findByIdAndRemove(req.params.id, function(err, blog)
						  {
		if(err)
			{
				console.log("error");
			}
		else
			{
				res.redirect("/blog");
			}
	});
});

index.listen(9000, function(req, res){
	console.log("blog app server started");
});

