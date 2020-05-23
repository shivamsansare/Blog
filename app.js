var express=require("express"),
    app=express(),
    bodyParser=require("body-parser"),
    keys=require("./keys"),
    passport=require("passport"),
    GoogleStrategy=require("passport-google-oauth2").Strategy,
    Blog=require("./models/blog"),
    Comment=require("./models/comment"),
    User=require("./models/user"),
    flash=require("connect-flash"),
    methodOverride=require("method-override"),
    mongoose=require("mongoose");


mongoose.connect(keys.google.mongoDb,{useNewUrlParser: true});


app.use(require("express-session")({
  secret:"Shivam's Blog Website",
  resave:false,
  saveUninitialized: false
}));

app.use(bodyParser.urlencoded({extended:true}));

app.set("view engine","ejs");
app.use(express.static(__dirname+"/public"));
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride("_method"));
app.use(flash());

passport.serializeUser((user, done) => {
  return done(null, user._id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    if(err){
      return done(err, null);
    } 
    else{
      return done(null, user);
    }
  });
});

passport.use(new GoogleStrategy({
    clientID: keys.google.clientID,
    clientSecret: keys.google.clientSecret,
    callbackURL: "http://localhost:4000/auth/google/callback",
    passReqToCallback   : true
  },
  function(request, accessToken, refreshToken, profile, done) {
    User.findOne({googleId: profile.id},function (err, user) {
      if(err){
        return done(err);
      }else{
        if(!user){
          newUser={googleId:profile.id, username:profile.displayName};
          User.create(newUser,function(err,users){
              if(err){
                  console.log(err);
              }
              else{
                return done(err, users)
              }
          });
        }
        else{
          return done(err, user)
        }
      }
    });
  }
));

app.use(function(req,res,next){
  res.locals.currentUser=req.user;
  res.locals.success=req.flash("success");
  res.locals.error=req.flash("error");
  next();
});

app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile'] }));

app.get("/auth/google/callback",passport.authenticate("google"),function(req,res){
      req.flash("success","Login successfull!");  
      res.redirect("back");
    }
);

app.get("/",function(req,res){
  res.render("landing")
});

app.get("/logout",function(req,res){
  req.logout();
  res.redirect("/blogs");
});

var blogRoutes=require("./routes/blog");
var commentRoutes=require("./routes/comments");

app.use("/blogs",blogRoutes);
app.use("/blogs/:id/comments",commentRoutes);

app.get("*",function(req,res){
    res.render("404")
});

//const PORT=5000;

app.listen(process.env.PORT,process.env.IP,function(req,res){
    console.log("hello");
});