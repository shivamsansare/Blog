var express=require("express");
var router=express.Router({mergeParams:true});
var Blog=require("../models/blog");
var Comment=require("../models/comment");
var middleware=require("../middleware");


router.get("/:comment_id/edit",middleware.checkCommentOwnership,function(req,res){
    Comment.findById(req.params.comment_id,function(err,found){
        if(err){
            console.log(err);
            res.redirect("back");
        }
        else{
            res.render("comments/edit",{blog_id:req.params.id, comment:found});
        }
    });
});

router.put("/:comment_id",middleware.checkCommentOwnership,function(req,res){
    Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,function(err,updated){
        if(err){
            redirect("back");
        }
        else{
            res.redirect("/blogs/"+req.params.id);
        }
    });
});

router.delete("/:comment_id",middleware.checkCommentOwnership,function(req,res){
    Comment.findByIdAndRemove(req.params.comment_id,function(err){
        if(err){
            res.redirect("back");
        }
        else{
            res.redirect("/blogs/"+req.params.id);
        }
    });
});

module.exports=router;
