// Here comes the chat functionality
var socket = io();
var userId;
$('.msg-link').click(function(e){
    var log = e.target.getAttribute('data-userid');
    userId = log;
    var username = e.target.getAttribute('data-username');
    $('#chat-bar').html('To: '+username);
    $('#chat-container').css('display','block');
    $('#chat-input input').focus();
});
$('#chat-input').on('submit',function(e){
    var currentUserId = $('.user-details').attr('data-userid');
    e.preventDefault();
    var val = $('#chat-input input').val();
    $('#chat-body').append('<p class="chat-msg">'+val+'</p>')
    socket.emit('msg',{
        'from':currentUserId,
        'to':userId,
        'msg':val
    });  
    $('#chat-input input').val('');
});
 socket.on('msg', function (data) {
     alert(data.msg);
});