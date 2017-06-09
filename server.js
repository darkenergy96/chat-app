'use strict';
const http = require('http');
const express = require("express");
const app = express();
const server = http.Server(app);
const io = require('socket.io')(server);
const path = require("path");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const MongoDBStore = require('connect-mongodb-session')(session);
const flash = require("connect-flash");
const passport = require("passport");
const mongoose = require('mongoose');
const passportSocketIo = require("passport.socketio");
const Chat = require('./models/chat.js');

mongoose.connect("mongodb://localhost:27017/blogo");
const store = new MongoDBStore(
      {
        uri: 'mongodb://localhost:27017/blogo',
        collection: 'login-sessions'
      });
const routes = require("./routes/routes");
const setUpPassport = require("./setupassport");
app.set("port",process.env.PORT || 3000);
var port = app.get('port');

app.set("views",path.join(__dirname, "views"));
app.set("view engine","pug");
app.use(express.static(path.join(__dirname,'public')));
app.use(bodyParser.urlencoded({extended:false}));
app.use(cookieParser());

app.use(session({
    key:'express.sid',
    secret:"express",
    store:store,
    resave:true,
    saveUninitialized:true
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
setUpPassport();

//mongoose events
mongoose.connection.on('connected', function () {
 console.log('Mongoose connected');
});
mongoose.connection.on('error',function (err) {
 console.log('Mongoose connection error: ' + err);
});
mongoose.connection.on('disconnected', function () {
 console.log('Mongoose disconnected\n');
 process.exit(0);
});
process.on('SIGINT', function() {
 mongoose.connection.close(function () {
 console.log('Mongoose disconnected through app termination\n');
 process.exit(0);
 });
});

server.listen(port,function(){
    console.log("Blogo app running on port " + port);
});

     io.use(passportSocketIo.authorize({
        passport:passport,
    //   cookieParser: cookieParser,       // the same middleware you registrer in express
      key:          'express.sid',       // the name of the cookie where express/connect stores its session_id
      secret:       "express",    // the session_secret to parse the cookie
      store:        store,        // we NEED to use a sessionstore. no memorystore please
      success:      onAuthorizeSuccess,  // *optional* callback on success - read more below
      fail:         onAuthorizeFail,     // *optional* callback on fail/error - read more below
    }));

function onAuthorizeSuccess(data, accept){
  console.log('successful connection to socket.io');
  accept();
}

function onAuthorizeFail(data, message, error, accept){
  if(error)
    throw new Error(message);
  console.log('failed connection to socket.io:', message);

  accept(null, false);
  if(error)
    accept(new Error(message));
}

// var sockets = {};

function chatAction(msg){
  var promise = new Promise(function(resolve,reject){
  Chat.find({},function(err,chats){
    if(err)
    reject(Error('db error!'));
    resolve(chats);
  });
});
promise.then(function(chats){
  if(chats.length === 0){
    var newChat = new Chat({
          messages : [msg]
        });
        newChat.save(function(err,chats){
          if(err) return err;
          console.log('firstsave',chats);
        });
  }
  else{
    Chat.find({},function(err,chats){
      chats[0].messages.push(msg);

      chats[0].save(function(err,chats){
        console.log('current chats',chats);
      });
      
    })
  }
},function(err){
  console.log('db error!',err);
});

};

// shifted to /chat route

// socket.io code
io.on('connection',function(socket){
  // getMessages(socket);
    // sockets[socket.request.user.id] = socket.id;
    // socket.on('msg',data =>{
    //     io.to(sockets[data.to]).emit('msg',{from:data.from,msg:data.msg});
    // });

    socket.on('chat',data=>{
      chatAction(data);
      socket.broadcast.emit('chat',data);
    })
    socket.on('typing',username=>{
      socket.broadcast.emit('typing',username);
    })

    socket.on('disconnect',()=>{
    })
});

app.get('/chat',(req,res)=>{
  Chat.find({},(err,chat)=>{
    if(err)
    return err;
    res.json(chat);
  });
})
app.get('/chat/:index',(req,res)=>{
  let index = req.params.index;
  Chat.find({},(err,chat)=>{
    if(err)
    return err;
    if(chat.slice(index).length === 0){
      res.send(false);
    }
    else{
      res.json(chat.slice(index));
    }
  })
});
app.use(routes);



