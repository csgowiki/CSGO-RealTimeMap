_INTERVAL = 200; // ms
_UTCONFIG = {};
_MAXPLAYER = 10;
_PlayerCache = {};
_CURRENTMAP = "";

function checkPlayerCache() {
   for (var eachPlayer in _PlayerCache) {
      var now = new Date().getTime();
      if (now - _PlayerCache[eachPlayer] >= _MAXPLAYER * _INTERVAL) {
         $(`#playerMove${eachPlayer}`).remove();
         delete _PlayerCache[eachPlayer]
      }
   }
}

function processQMap(msg_qMap) {
   $('#map_name').attr('src', `static/img/map/${msg_qMap[0]}.png`);
}

function processQPlayerMove(msg_qPlayerMove) {
   if ($(`#playerMove${msg_qPlayerMove[4]}`).length == 0) { // create
      $("#canvas").append($(
         `<svg id='playerMove${msg_qPlayerMove[4]}' style='position:absolute;top:${msg_qPlayerMove[1]};left:${msg_qPlayerMove[0]};width:100px;height:20px;' xmlns='http://www.w3.org/2000/svg' version='1.1'> \
            <circle cx='15' cy='5' r='5' stroke='black' fill='red' /> \
            <a id='playerXlink${msg_qPlayerMove[4]}' href='https://steamcommunity.com/profiles/${msg_qPlayerMove[3]}'><text id='playername${msg_qPlayerMove[4]}' x='0' y='20' fill='yellow'>${msg_qPlayerMove[2]}</text></a> \
         </svg>`
      ))
   }
   else {  // update
      $(`#playerMove${msg_qPlayerMove[4]}`).animate(
         {left: msg_qPlayerMove[0], top: msg_qPlayerMove[1]},
         _INTERVAL
      );
   }
   _PlayerCache[msg_qPlayerMove[4]] = new Date().getTime()
}

function processQPlayersMove(msg_qPlayersMove) {
   for (var idx = 0; idx < msg_qPlayersMove.length; idx++) {
      processQPlayerMove(msg_qPlayersMove[idx]);
   }
}

function processQUtility(msg_qUtility) {
   if ($(`#utpos${msg_qUtility[0]}`).length == 0) {
      $("#canvas").append($(
         `<img id='utpos${msg_qUtility[0]}' \ 
            style='position:absolute;top:${msg_qUtility[3]};left:${msg_qUtility[2]};width:${_UTCONFIG[msg_qUtility[1]][1]};height:${_UTCONFIG[msg_qUtility[1]][1]}'  \
            src='static/img/weapon/${msg_qUtility[1]}.png'> \
         </img>`
      ));
   }
   // countdown
   setTimeout(function() {
      $(`#utpos${msg_qUtility[0]}`).remove();
   }, _UTCONFIG[msg_qUtility[1]][0]);
}

function processQ2WebMsg(msg_q2WebMsg) {
   $.toaster(msg_q2WebMsg[1], msg_q2WebMsg[0]);
   console.log(`${msg_q2WebMsg[0]}: ${msg_q2WebMsg[1]}`);
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
    socket.on('server_response', function(json_Msg) {
       if (json_Msg.qMap.length) processQMap(json_Msg.qMap);
       if (json_Msg.qPlayersMove.length) processQPlayersMove(json_Msg.qPlayersMove);
       if (json_Msg.qUtility.length) processQUtility(json_Msg.qUtility);
       if (json_Msg.q2WebMsg.length) processQ2WebMsg(json_Msg.q2WebMsg);
       checkPlayerCache();
    });
});
