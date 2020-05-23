var Blog=require("../models/blog");
var Comment=require("../models/comment");
var middlewareObj={};


middlewareObj.isLoggedIn=function(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error","Login First!");
    res.redirect("back");
}


middlewareObj.checkOwnership=function(req,res,next){
    if(req.isAuthenticated()){
        Blog.findById(req.params.id,function(err,found){
            if(err){
                console.log(err);
                req.flash("error","Cannot Find");
                res.redirect("back");
            }
            else{
                if(found.author.id.equals(req.user._id)){
                    next();
                }
                else{
                    req.flash("error","No Access");
                    res.redirect("back");
                }
            }
        });
    }
    else{
        req.flash("error","Login First!");
        res.redirect("back");
    }
}

middlewareObj.checkCommentOwnership=function(req,res,next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id,function(err,found){
            if(err){
                console.log(err);
                req.flash("error","Cannot Find");
                res.redirect("back");
            }
            else{
                if(found.author.id.equals(req.user._id)){
                    next();
                }
                else{
                    req.flash("error","No Access!");
                    res.redirect("back");
                }
            }
        });
    }
    else{
        req.flash("error","Login First!");
        res.redirect("back");
    }
}

module.exports=middlewareObj