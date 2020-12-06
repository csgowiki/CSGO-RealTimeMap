_INTERVAL = 100;
_UTCONFIG = {};
_MAXPLAYER = 10;

function updateMap(mapname) {
   $('#map_name').attr('src', `static/img/map/${mapname}.png`);
}

function initPlayers(maxplayers) {
   for (var player = 0; player < maxplayers; player++) {
      $("#canvas").append($(
         `<svg id='playerpos${player}' visibility='hidden' style='position:absolute;top:0px;left:0px;width:100px;height:20px;' xmlns='http://www.w3.org/2000/svg' version='1.1'> \
            <circle cx='15' cy='5' r='5' stroke='black' fill='red' /> \
            <a id='playerXlink${player}' href='#'><text id='playername${player}' x='0' y='20' fill='yellow'></text></a> \
         </svg>`
      ))
   }
}

function drawPlayer(players) {
   for (var player = 0; player < _MAXPLAYER; player++) {
      if (player < players.length) {
         $(`#playerpos${player}`).attr('visibility', 'visible');
         $(`#playername${player}`).text(players[player].name);
         $(`#playerXlink${player}`).attr('href', `https://steamcommunity.com/profiles/${players[player].steam3id}`)
         $(`#playerpos${player}`).animate(
            { left: players[player].posX, top: players[player].posY }, 
            _INTERVAL
         );
      }
      else {
         $(`#playerpos${player}`).attr('visibility', 'hidden');
      }
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
      console.log(newMsg);
      $.toaster(newMsg[1], newMsg[2]);
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
          initPlayers(_MAXPLAYER);
       }
    })
    // websocket
    var socket = io.connect();
    socket.on('server_response', function(msg) {
        updateMap(msg.data.mapname);
        drawPlayer(msg.data.players);
        drawUtility(msg.data.utilities);
        showMessage(msg.newMsg);
    });
});