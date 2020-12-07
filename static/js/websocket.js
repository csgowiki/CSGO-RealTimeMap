_INTERVAL = 100;
_UTCONFIG = {};
_MAXPLAYER = 10;

function updateMap(mapname) {
   $('#map_name').attr('src', `static/img/map/${mapname}.png`);
}

function drawPlayerMove(playerMove) {
   if (playerMove.length == 0) return;
   if ($(`#playerMove${playerMove[4]}`).length == 0) {
      $("#canvas").append($(
         `<svg id='playerMove${playerMove[4]}' style='position:absolute;top:${playerMove[1]};left:${playerMove[0]};width:100px;height:20px;' xmlns='http://www.w3.org/2000/svg' version='1.1'> \
            <circle cx='15' cy='5' r='5' stroke='black' fill='red' /> \
            <a id='playerXlink${playerMove[4]}' href='${playerMove[2]}'><text id='playername${playerMove[4]}' x='0' y='20' fill='yellow'>${playerMove[3]}</text></a> \
         </svg>`
      ))
   }
   else {
      $(`#playerMove${playerMove[4]}`).animate(
         {left: playerMove[0], top: playerMove[1]},
         _INTERVAL
      );
      setTimeout(function() {
         $(`#playerMove${playerMove[4]}`).remove();
      }, _INTERVAL);
   }
}

function drawUtility(utilities) {
   var nowarray = []
   $.each(utilities, function(utid, value){
      nowarray.push(`utpos${utid}`);
      if (value.uttype == "incgrenade") value.uttype = "molotov";
      if ($(`#utpos${utid}`).length == 0) {
         $("#canvas").append($(
            `<img id='utpos${utid}' \ 
               style='position:absolute;top:${value.posY};left:${value.posX};width:${_UTCONFIG[value.uttype][1]};height:${_UTCONFIG[value.uttype][1]}'  \
               src='static/img/weapon/${value.uttype}.png'> \
            </img>`
         ));
      }
   });
   // delete
   $("#canvas").find("img").each(function() {
      if (this.id != "map_name" && nowarray.indexOf(this.id) == -1) {
         $(`#${this.id}`).remove();
      }
   })
}

function showMessage(newMsg) {
   if (newMsg.length != 0) {
      $.toaster(newMsg[1], newMsg[0]);
   }
}

$(document).ready(function() {
    // init
    $.ajax({
       async: false, url: "/ajax-api/init", type: "get",
       success(data) {
          _MAXPLAYER = data.MAXPLAYER
          _UTCONFIG = data.UTCONFIG;
          _INTERVAL = data.INTERVAL * 1000;
       }
    })
    // websocket
    var socket = io.connect();
    socket.on('server_response', function(msg) {
        updateMap(msg.mapname);
        drawPlayerMove(msg.playerMove);
        drawUtility(msg.utilities);
        showMessage(msg.newMsg);
    });
});