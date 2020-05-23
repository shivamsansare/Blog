var mongoose=require("mongoose");
var GoogleStrategy=require("passport-google-oauth2").Strategy;

var UserSchema=new mongoose.Schema({
    googleId: String,
    username: String
});

module.exports=mongoose.model("User",UserSchema);