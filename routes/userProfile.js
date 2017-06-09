const User = require('../models/user');
module.exports = function(req,res){
    var id = req.params.id;
    User.findOne({_id:id}).exec(function(err,user){
        if(err){
            res.send('error getting user');

        }
        else{
            res.send(user);
        }
    })

}
