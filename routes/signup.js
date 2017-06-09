const User = require('../models/user');
module.exports.get = function(req,res){
    res.render('signup');
}
module.exports.post = function(req,res,next){
    var email = req.body.email;
    var password = req.body.password;
    if(password == ""){
        throw err;
    }
    User.findOne({email:email},function(err,user){
        if(err){
            return next(err);
        }
        if(user){
            req.flash('error','User already exists!!');
            return res.redirect('signup');
        }
        console.log('ok');
        var newUser = new User({
            email:email,
            password:password
        });
        newUser.save(next);
    });
}