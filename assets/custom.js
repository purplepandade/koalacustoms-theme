//Cart prüfen, bei leerem cart nichts tun
function checkCart() {
jQuery.getJSON('/cart.js', function(cart) {
   // now have access to Shopify cart object
   var count = cart.item_count;
  console.log(count);
  if (count > 0) {
  getCookie();
  }
} );
}

//CARTWARNUNG EINBLENDEN
function cart() {
$('#countdown').css('height', 'auto');
}

//COOKIE ABCHECKEN UND EVTL SETZEN

function getCookie(){
  var exists = document.cookie.indexOf('timerKC=');
  //console.log(exists);
  if (exists == -1){
  var now = new Date().getTime();
  setCookie('timerKC',now,1);
  check_cookie_name('timerKC');
  }
  
  else{
  check_cookie_name('timerKC');
  $('#countdown').show();
  }
}

//Cookie Löschen

function del_cookie(name) {
document.cookie = "timerKC=;expires=" + new Date(0).toUTCString() +";path=/";
}
 

//Cookie setzen

function setCookie(cname, cvalue, exdays) {
  const d = new Date();
  d.setTime(d.getTime() + (exdays*24*60*60*1000));
  let expires = "expires="+ d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}


//Timer Funktion
function setTimer(time) {
  
var countDownDate = time;  
$('#countdown').show();  
var x = setInterval(function() {
;
  // Get today's date and time
  var now = new Date().getTime();

  // Find the distance between now and the count down date
  var distance = countDownDate - now;
	var dist2 = now - countDownDate;
  // Time calculations for days, hours, minutes and seconds
  var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  var seconds = Math.floor((distance % (1000 * 60)) / 1000);

  // Display the result in the element with id="demo"
  
  //TODO:PADDEN MIT 0
  document.getElementById("countdown").innerHTML ="Dein Warenkorb ist noch " + (15 + minutes) + ":" + (60+seconds) + " Minuten lang reserviert.";
  
  console.log(minutes);

  // If the count down is finished, write some text
  if (distance < -900000) {
      document.cookie = "timerKC=;expires=" + new Date(0).toUTCString();
    del_cookie('timerKC');
    clearInterval(x);
    //document.getElementById("countdown").innerHTML = "EXPIRED";
  console.log(distance);
  clearCart();
  }
}, 1000);
  
$('#countdown').data('timer', x);
  
  
  
}

function check_cookie_name(name) 
    {
      var match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
      if (match) {
        console.log(match[2]);
        var time = match[2];
        
        setTimer(time);
      
      }
      else{
           clearCart();
      }
   }

//Cart Leeren

function clearCart(){
$.ajax({
    type: "POST",
    url: '/cart/clear.js',
    data: '',
    dataType: 'json',
    success: function() { 
      //location.reload();
      $('#countdown').hide();
      var clear = $('#countdown').data('timer');
      clearInterval(clear);
       del_cookie('TimerKC');
      document.dispatchEvent(new CustomEvent('cart:build'));
  //console.log('gelöscht');
    },
    error: function(XMLHttpRequest, textStatus) {
      /* error code */
    }
  });
  return false;


}





//EVENTS

$( ".drawer__close-button" ).on( "click", function() {
  //console.log("closed");
  $('#countdown').css('height', 0);
});


document.addEventListener('drawerOpen', function(evt) {
const myTimeout = setTimeout(cart, 600);
});

document.addEventListener('ajaxProduct:added', function(evt) {
getCookie();
});


document.addEventListener('drawerClose', function(evt) {
//console.log('Closed');
});

$( document ).ready(function() {
    checkCart();
});