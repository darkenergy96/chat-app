const express = require('express');
const router = express.Router();
const path = require('path');
const User = require('../models/user');
const passport = require('passport');
var LocalStrategy = require("passport-local").Strategy;
const isAuthenticated = function(req,res,next){
    if(req.isAuthenticated()){
        res.redirect('/app');
    }
    else{
        next();
    }
};
router.use(function(req, res, next) {
 res.locals.user = req.user;
 res.locals.errors = req.flash("error");
 res.locals.infos = req.flash("info");
 if(req.user){
      User.findById({_id:req.user.id},function(err,user){
    if(err){
        console.error(err);
    }
    else{
        user.lastActive = Date.now();
        user.save(function(err,user){
            if(err){
                console.error(err);
            }
        });
    }
 });
 }
 next();
});
// router.use((req,res,next)=>{
//     if(req.user){
//         next();
//     }
//     else{
//     res.redirect('/signin');
//     }
// });

router.get('/',(req,res)=>{
    res.render('home');
});

router.get('/signin',isAuthenticated,(req,res)=>{
    res.render('signin');
});

router.post('/signin',passport.authenticate('login',{
    successRedirect:'/app.html',
    failureRedirect:'/signin',
    failureFlash:true
}));

router.get('/signup',isAuthenticated,(req,res)=>{
    res.render('signup');
});

router.post('/signup',require('./signup').post,passport.authenticate('login',{
    successRedirect:'/app.html',
    failureRedirect:'signup',
    failureFlash:true
}));

router.get('/signout',function(req,res){
    req.logout();
    res.redirect('/signin');
});

router.get('/app',(req,res)=>{
    if(req.isAuthenticated()){
    res.sendFile(path.join(__dirname,'../public/app.html'));
    }
    else{
    res.redirect('/');
     }
});

router.get('/user',(req,res)=>{
        if(req.isAuthenticated()){
            User.findById({_id:req.user.id},'email',function(err,user){
            if(err){
                return err;
            }
            console.log(user);
            res.json(user);
        });
    }
    else{
        res.send(false);
    }
});
// router.get('/chat',(req,res)=>{
//     function getMessages(socket){
//   Chat.find({},(err,chat)=>{
//     if(err)
//     return err;
//     socket.emit('get messages',chat[0].messages);
//   });
// }
// })

router.use(function(req,res){
    res.send('404 error!');
});

module.exports = router;