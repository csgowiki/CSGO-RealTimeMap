const MAXPLAYERS = 10;
const UPDATE_INTERVAL = 1000; // ms

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

function drawPlayer(data) {
   for (var player = 0; player < MAXPLAYERS; player++) {
      if (player < data.players.length) {
         $(`#playerpos${player}`).attr('visibility', 'visible');
         $(`#playername${player}`).text(data.players[player].name);
         $(`#playerXlink${player}`).attr('href', `https://steamcommunity.com/profiles/${data.players[player].steam3id}`)
         $(`#playerpos${player}`).animate(
            { left: data.players[player].posX, top: data.players[player].posY }, 
            UPDATE_INTERVAL
         );
      }
      else {
         $(`#playerpos${player}`).attr('visibility', 'hidden');
      }
   }
}

$(function(){
   $.ajax({
      async: false,
      url: "/api/ajax_init",
      type: "get",
      success(data) {
         initPlayers(data.maxplayers)
      }
   })

   window.setInterval(function() {
      $.ajax({
         async: false,
         url: "/api/ajax_update",
         type: "get",
         success(data) {
            drawPlayer(data);
         }
      })
   }, UPDATE_INTERVAL);
})