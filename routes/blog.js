var express=require("express");
var router=express.Router();
var Blog=require("../models/blog");
var Comment=require("../models/comment");
var middleware=require("../middleware");

router.get("/",function(req,res){
    Blog.find({},function(err,blogs){
        if(err){
            console.log(err);
        }
        else{
            //console.log(blogs);
            res.render("blogs/index",{blogs:blogs,currentUser:req.user});
        }
    });
});

router.post("/",middleware.isLoggedIn,function(req,res){
    var name=req.body.name;
    var image=req.body.image;
    var description=req.body.description;
    var author={
        id:req.user._id,
        username:req.user.username
    }
    var newBlog={name:name,image:image,description:description,author:author}
    Blog.create(newBlog,function(err,newBlogs){
        if(err){
            console.log(err);
        }
        else{
            res.redirect("/blogs");
        }
    });
});

router.get("/new",middleware.isLoggedIn,function(req,res){
    res.render("blogs/new");
});

router.get("/:id",function(req,res){
    Blog.findById(req.params.id).populate("comments").exec(function(err,found){
        //console.log(found);
        if(err){
            console.log(err);
        }
        else{
            res.render("blogs/show",{blog:found});
        }
    })
});

router.post("/:id",middleware.isLoggedIn,function(req,res){
    Blog.findById(req.params.id,function(err,blog){
        if(err){
            res.redirect("/blogs");
        }else{
            Comment.create(req.body.comment,function(err,comment){
                if(err){
                    console.log(err);
                }
                else{
                    comment.author.id=req.user._id;
                    comment.author.username=req.user.username;
                    comment.save();
                    //console.log(req.body.comment);
                    blog.comments.push(comment);
                    blog.save();
                    res.redirect("/blogs/"+blog._id);
                }
            });
        }
    });
});

router.get("/:id/edit",middleware.checkOwnership,function(req,res){
    Blog.findById(req.params.id,function(err,found){
        if(err){
            res.redirect("/blog");
        }
        else{
            res.render("blogs/edit",{blog:found});
        }
    });
});

router.put("/:id",middleware.checkOwnership,function(req,res){
    Blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err,updated){
        if(err){
            res.redirect("/blogs");
        }
        else{
            res.redirect("/blogs/"+req.params.id);
        }
    })
});

router.delete("/:id",middleware.checkOwnership,function(req,res){
    Blog.findByIdAndRemove(req.params.id,function(err){
        if(err){
            res.redirect("/blogs");
        }
        else{
            req.flash("success","Successfully Removed");
            res.redirect("/blogs");
        }
    });
});


module.exports=router;