_INTERVAL = 200; // ms
_UTCONFIG = {};
_MAXPLAYER = 10;
_Cache = {"playerMove":{}, "utTrace": {}}
_CURRENTMAP = "";
_UtSvg = {
   "smokegrenade": '<path fill-rule="evenodd" clip-rule="evenodd" d="M10.073 6.72l-1.535.287-.216.244h5.99-5.988V19.58h-.002c.822.53 1.863.847 2.995.847 1.132 0 2.172-.317 2.995-.847V7.63l.912 1.508v8.673l-.194.797h.44l.208-.797V8.758l-2.062-5.185h-.273l-.428.633-.334-.135h-2.508l-.451 1.031h.451V6.72zm-1.447 9.45l2.719.575 2.718-.574v1.013l-2.718.575-2.72-.575v-1.013zm2.719-6.485l-2.72-.574v1.014l2.72.574 2.718-.574V9.11l-2.718.574z" fill="#fff"></path>',
   "flashbang": '<path d="M9.744 6.092V5.084c-.48-.05-.721-.243-.721-.58 0-.218.09-.361.27-.428L9.894 4h3.309L16 7.754v7.937l-1.414.58-.45-.076c-.1-.151-.061-.294.119-.428.16-.119.402-.252.723-.404l.42-.177V8.107l-1.203-.58v1.185l-.722.554v1.185h-.301v1.209h.3v1.26h-.3v1.21h.3v1.26h-.3v1.209h.3v1.159l.723 1.033v.857c0 .235-.14.352-.42.352H8.42c-.282-.001-.421-.118-.421-.353v-.857l.691-1.033v-1.16h.331v-1.209h-.33v-1.26h.33V12.92h-.33v-1.26h.33v-1.208h-.33V9.266L8 8.712V7.1c0-.235.14-.353.42-.353h.422l.902-.655z" fill="#fff"></path>',
   "hegrenade": '<path fill-rule="evenodd" clip-rule="evenodd" d="M17.962 16.728l-.89-5.691-2.908-2.763H9.105a.3.3 0 01-.3-.3V5.433h-.63l.592-1.903h5.557v-.006l1.244 2.674 2.018 4.245.694 6.285h-.318zM9.529 8.274h3.629v1.254a5.624 5.624 0 11-3.628 0V8.274z" fill="#fff"></path>',
   "molotov": '<path d="M18.043 7.208c-.052.119-.01.263.131.432.122.17.088.397-.105.686l-.842.965c-.197.219-.48.356-.836.42l.24-.379.12-.024.912-1.203-.175-.44-.631-.583a3.1 3.1 0 00-.682-.355l-.552-.047-.862 1.138-.234.344h.097l-.584.684-.334-.647c-.14-.457-.166-.829-.078-1.118l.315-.558c.121-.236.121-.558 0-.965l.29.102c.227.118.393.305.497.56l.08.685.026.279.394-.838c.017-.17-.096-.432-.342-.789l-.577-.71c-.105-.153-.148-.508-.131-1.068.017-.574.105-.938.263-1.09.035.355.192.668.472.939.14.136.517.288 1.13.457.246.068.394.212.446.432l.21.533.29.38c.122.154.219.196.289.128.07-.067 0-.262-.209-.584-.23-.337-.195-.711.103-1.117.036.17.246.423.631.762.385.356.622.704.71 1.042l.024.508-.21.61-.286.43zm-1.42 1.906l.79-1.041-.132-.33-.552-.483a2.9 2.9 0 00-.63-.33l-.367-.025-.788 1.04h.025v.153l-2.075 2.44-.472.304-.788.355c-.79.356-1.314.72-1.577 1.092l-4.574 6.222c-.07.169.027.456.29.863.297.441.692.83 1.182 1.169.491.338.967.565 1.524.71.557.145.946-.024.946-.024l4.571-6.198c.262-.372.447-.974.55-1.803.09-.846.168-1.312.238-1.396l1.707-2.693.133-.025z" fill="#fff"></path>',
   "decoy": '<path d="M9.744 6.092V5.084c-.48-.05-.721-.243-.721-.58 0-.218.09-.361.27-.428L9.894 4h3.309L16 7.754v7.937l-1.414.58-.45-.076c-.1-.151-.061-.294.119-.428.16-.119.402-.252.723-.404l.42-.177V8.107l-1.203-.58v1.185l-.722.554v1.185h-.301v1.209h.3v1.26h-.3v1.21h.3v1.26h-.3v1.209h.3v1.159l.723 1.033v.857c0 .235-.14.352-.42.352H8.42c-.282-.001-.421-.118-.421-.353v-.857l.691-1.033v-1.16h.331v-1.209h-.33v-1.26h.33V12.92h-.33v-1.26h.33v-1.208h-.33V9.266L8 8.712V7.1c0-.235.14-.353.42-.353h.422l.902-.655z" fill="#fff"></path><path opacity="0.5" fill-rule="evenodd" clip-rule="evenodd" d="M17 3h1v1.134l.982-.567.5.866L18.5 5l.982.567-.5.866L18 5.866V7h-1V5.866l-.982.567-.5-.866L16.5 5l-.982-.567.5-.866.982.567V3zM18.482 8h1v1.134l.982-.567.5.866-.982.567.982.567-.5.866-.982-.567V12h-1v-1.134l-.982.567-.5-.866.982-.567L17 9.433l.5-.866.982.567V8z" fill="#fff"></path>',
   "incgrenade": '<path fill-rule="evenodd" clip-rule="evenodd" d="M13.431 8.96l-2.047.382-.288.326h7.986v.505l1.216 2.012v11.563l-.258 1.063h.586l.278-1.063v-12.07l-2.749-6.914h-.365l-.57.844-.445-.18H13.43l-.602 1.375h.602v2.156zm-2.333 17.146V9.668h7.983v16.438h.001c-1.096.708-2.484 1.13-3.993 1.13s-2.897-.422-3.993-1.13h.002zm7.653-4.545v1.351l-3.625.766-3.625-.766v-1.351l3.625.765 3.625-.765zm-2.495-10.95c-3.366 1.942-6.432 8.424-1.303 10.002-.846-.96-.94-3.1 0-4.14-.255 1.805.603 2.26 1.007 2.474.064.034.116.062.151.088.504.376.897 1.028.521 1.433 1.013-.333 2.214-1.65 1.679-3.474-.401-1.365-1.2-2.163-1.691-2.653-.165-.165-.295-.295-.364-.4l-.014-.021c-.288-.439-1.097-1.67.014-3.308z" fill="#fff"></path>'
}

function checkCache() {
   for (var eachPlayer in _Cache["playerMove"]) {
      var now = new Date().getTime();
      if (now - _Cache["playerMove"][eachPlayer] >= _MAXPLAYER * _INTERVAL) {
         $(`#playerMove${eachPlayer}`).remove();
         delete _Cache["playerMove"][eachPlayer]
      }
   }
   for (var eachUtTrace in _Cache["utTrace"]) {
      var now = new Date().getTime();
      if (now - _Cache["utTrace"][eachUtTrace] >= _INTERVAL * 2) {
         $(`#utTrace${eachUtTrace}`).remove();
         delete _Cache["utTrace"][eachUtTrace];
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
   _Cache["playerMove"][msg_qPlayerMove[4]] = new Date().getTime()
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

function processQUtTrace(msg_qUtTrace) {
   if ($(`#utTrace${msg_qUtTrace[0]}`).length == 0) {
      $("#canvas").append($(
         `<svg id="utTrace${msg_qUtTrace[0]}" style="position:absolute;top:${msg_qUtTrace[3]};left:${msg_qUtTrace[2]}" width="44" height="44"> \
            ${_UtSvg[msg_qUtTrace[1]]}
         </svg>`
      ));
   }
   else {  // update
      $(`#utTrace${msg_qUtTrace[0]}`).animate(
         {left: msg_qUtTrace[2], top: msg_qUtTrace[3]},
         _INTERVAL
      );
   }
   _Cache["utTrace"][msg_qUtTrace[0]] = new Date().getTime()
}

function processQUtTraces(msg_qUtTraces) {
   for (var idx = 0; idx < msg_qUtTraces.length; idx++) {
      processQUtTrace(msg_qUtTraces[idx]);
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
    socket.on('server_response', function(json_Msg) {
       if (json_Msg.qMap.length) processQMap(json_Msg.qMap);
       if (json_Msg.qPlayersMove.length) processQPlayersMove(json_Msg.qPlayersMove);
       if (json_Msg.qUtility.length) processQUtility(json_Msg.qUtility);
       if (json_Msg.q2WebMsg.length) processQ2WebMsg(json_Msg.q2WebMsg);
       if (json_Msg.qUtTrace.length) processQUtTraces(json_Msg.qUtTrace);
       checkCache();
    });
});
