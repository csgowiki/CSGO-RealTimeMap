const MAXPLAYERS = 10;
const UPDATE_INTERVAL = 100;

function updateMap(mapname) {
   $('#map_name').attr('src', `static/img/map/${mapname}.png`);
}

function initPlayers(maxplayers = MAXPLAYERS) {
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
   for (var player = 0; player < MAXPLAYERS; player++) {
      if (player < players.length) {
         $(`#playerpos${player}`).attr('visibility', 'visible');
         $(`#playername${player}`).text(players[player].name);
         $(`#playerXlink${player}`).attr('href', `https://steamcommunity.com/profiles/${players[player].steam3id}`)
         $(`#playerpos${player}`).animate(
            { left: players[player].posX, top: players[player].posY }, 
            UPDATE_INTERVAL
         );
      }
      else {
         $(`#playerpos${player}`).attr('visibility', 'hidden');
      }
   }
}

$(document).ready(function() {
    // init
    initPlayers();
    // websocket
    var socket = io.connect();
    socket.on('server_response', function(msg) {
        updateMap(msg.data.mapname);
        drawPlayer(msg.data.players);
    });
});