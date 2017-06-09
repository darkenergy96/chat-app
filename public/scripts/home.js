// navmenu toggle
(function(){
    
var x = 0;
$('#menu-icon').click(function(){
    //$('#menu').toggle();
    if(x===0){
        $('#menu').css('left','0px');
        x++;
        $('.container').toggleClass('slideRight slideLeft');
    }
    else{
        $('#menu').css('left','-20%');
        x--;
        $('.container').toggleClass('slideRight slideLeft');
    }
});

})();

// post options toggle
(function(){

var x = 0;
$('.options-icon').click(function(){
    if(x === 0){
        $(this).next().animate({
            top:'90%',
            right:'30px',
            opacity:'1'
        },200);
        
        x+=1;
    }
    else{
        $(this).next().animate({
            top:'70%',
            right:'20px',
            opacity:'0'
        },200);
        x-=1;
    }
});

})();
// hide a post
$('.hide').click(function(){
    $(this).parents('.post').addClass('animated fadeOutLeft');
    setTimeout(function(){
        $('.fadeOutLeft').remove();
    },400);
});


// $('.cool').click(function(){
//     var userid = $(this).attr('data-userid');
    
//     $.ajax({
//         url:'/follow/'+userid,
//         type:'PUT',
//         success:function(data){
//             alert(data);
//         }
//     });
// });


