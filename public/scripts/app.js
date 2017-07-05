let userId;
let username;
const socket = io.connect('//' + window.location.host, {
  query: 'session_id=' + readCookie('your.sid-key';)
});
$.ajax({
    type:'GET',
    url:'/user',
    success:function(data){
        userId = data._id;
        username = data.email;
    }
});
// let userId = $('.container').attr('data-userid');
// let username = $('.container').attr('data-username');
//on page load get chat msgs
let posData = {
    currentUser : null,
    position:'left'
};

socket.on('chat',function(data){
    console.log($('.chat-body').children().length);
    if(!posData.currentUser){
    // append left
    appendMessage(data,'other-chat-msg',posData.position);
    posData.currentUser = data.from.username;
    console.log('0 childs',posData);
    }
    else{
        if(posData.currentUser === data.from.username){
            // same
            appendMessage(data,'other-chat-msg',posData.position);
            console.log('same user',posData);
        }
        else{
            // opp
            if(posData.position === 'left'){
            posData.position = 'right';}
            else{
                posData.position = 'left';
            }
            appendMessage(data,'other-chat-msg',posData.position);
            posData.currentUser = data.from.username;
            console.log('other user',posData);
        }
    }
});
//submit on click
// $('#send').click(function(){
//     if(!username){
//         alert('signin to chat!!');
//         return;
//     }
//     $('#chat-field').submit();
// });

// dom
$('#chat-field').on('submit',function(e){
    e.preventDefault();
    if(!username){
        alert('signin to chat');
        return;
    }
    let msg = $('#chat-field input').val();
    if(!msg){
        return;
    }
    console.log('msg:',msg);
    socket.emit('chat',{
        from:{username:username,userId:userId},
        msg:msg
    });
    $('#chat-field input').val('');
    if(!posData.currentUser){
    // append left
    appendMyMessage(msg,'my-chat-msg',posData.position);
    posData.currentUser = username;
    console.log('0 children',posData);
    }
    else{
        if(posData.currentUser === username){
            // same
            appendMyMessage(msg,'my-chat-msg',posData.position);
            console.log('same user',posData);
        }
        else{
            // opp
            if(posData.position === 'left')
            posData.position = 'right';
            else{
                posData.position = 'left';
            }
            appendMyMessage(msg,'my-chat-msg',posData.position);
            posData.currentUser = username;
            console.log('other user',posData);
        }
    }
});

function appendMessage(data,className,pos){
    let div = `<div class="${className} ${pos}">${data.from.username}:${data.msg}</div>`
    $('.chat-body').append(div);
}

function appendMyMessage(data,className,pos){
    let classNames = `${className} ${pos}`;
    let div = `<div class="${classNames}">${username} : ${data}</div>`
    $('.chat-body').append(div);
}


// get from db and update UI 
socket.on('get messages',data=>{
    console.log(data);
    data.forEach(function(data){
        console.log(data.from);
        if(posData.currentUser === data.from.username){
            if(data.from.username === username){
                appendDbMsg(data,'my-chat-msg',posData.position);
            }
            else{
                appendDbMsg(data,'other-chat-msg',posData.position);
            }
        }
        else{
            posData.currentUser = data.from.username;
            if(posData.position === 'left'){
                posData.position = 'right';
                if(data.from.username === username){
                    appendDbMsg(data,'my-chat-msg',posData.position)
                }
                else{
                    appendDbMsg(data,'other-chat-msg',posData.position)
                }
            }
            else{
                posData.position = 'left';
                if(data.from.username === username){
                    appendDbMsg(data,'my-chat-msg',posData.position)
                }
                else{
                    appendDbMsg(data,'other-chat-msg',posData.position)
                }
            }
        }

    });
});
function appendDbMsg(data,className,pos){
    let classNames = `${className} ${pos}`;
    let div = `<div class="${classNames}">${data.from.username} : ${data.msg}</div>`
    $('.chat-body').append(div);
}

// user is typing
$('#input-chat').on('change',function(){
    socket.emit('typing',username);
});
socket.on('typing',function(data){
    console.log(username);
});


// service worker
if ('serviceWorker' in navigator) {
    navigator.serviceWorker
             .register('./sw.js')
             .then(function() { console.log('Service Worker Registered'); });
  }

// iterate chat array and render to screen
function renderMessages(array){
    array.forEach(function(data){
        console.log(data.from);
        if(posData.currentUser === data.from.username){
            if(data.from.username === username){
                appendDbMsg(data,'my-chat-msg',posData.position);
            }
            else{
                appendDbMsg(data,'other-chat-msg',posData.position);
            }
        }
        else{
            posData.currentUser = data.from.username;
            if(posData.position === 'left'){
                posData.position = 'right';
                if(data.from.username === username){
                    appendDbMsg(data,'my-chat-msg',posData.position)
                }
                else{
                    appendDbMsg(data,'other-chat-msg',posData.position)
                }
            }
            else{
                posData.position = 'left';
                if(data.from.username === username){
                    appendDbMsg(data,'my-chat-msg',posData.position)
                }
                else{
                    appendDbMsg(data,'other-chat-msg',posData.position)
                }
            }
        }

    });
};

// get msgs from local storage
localforage.keys().then(function(keys) {
    // An array of all the key names.
    console.log(keys);
    let bool;
    keys.forEach(function(key){
        if(key === 'chat'){
            bool = true;
            return;
        }
    });
    if(bool){
        localforage.getItem('chat',function(err,data){
                if(err){
                 console.log(err);return;
                }
                renderMessages(data);
        });

    }
}).catch(function(err) {
    // This code runs if there were any errors
    console.log(err);
});

// ajax messages
$.ajax({
    type:'GET',
    url:'/chat',
    success:function(chat){
        console.log(chat[0].messages);
        if(chat.length === 0){
        console.log('no messages');
        }
        else{
            localforage.setItem('chat',chat[0].messages,function(err,chat){
                if(err){
                console.log(err);return;
            }
            console.log('saved to local!!');
        });
        localforage.setItem('chat index',chat[0].messages.length,function(err,chat){
                if(err){
                console.log(err);return;
            }
            console.log('saved index to local!!');
            });
        }
    }
});

// conditional ajax request
localforage.iterate(function(value, key, iterationNumber) {
    if(key === 'chat index'){
        return value;
    }
}).then(function(index) {
    console.log('Iteration has completed');
    console.log(index);
    $.ajax({
        type:'GET',
        url:`chat/${index}`,
        success:function(newChat){
            if(!newChat){
                return;
            }
            localforage.getItem('chat',function(err,chatArr){
                renderMessages(newChat);
                chatArr = chatArr.concat(newChat[0].messages);
                localforage.setItem('chat',chatArr);
            });
        }
    });

}).catch(function(err) {
    // This code runs if there were any errors
    console.log(err);
});
