from threading import Lock, Timer
import gc
from queue import Queue

from flask import Flask, render_template, request
from flask_socketio import SocketIO

from utils import *

# CONFIG
__CHARSPLIT = '|'
__NAMESPLIT = '!@!'
DEFAULT_MAP = 'de_inferno'
SUPPORT_MAPS = ["de_inferno", "de_cache", "de_dust2", "de_mirage", "de_nuke", "de_overpass", "de_train", "de_vertigo"]
__INTERVAL = 0.2 # s
__MAXPLAYER = 10
__UTCONFIG = {
    'flashbang': [1000, '50px'], # timelast(ms), diameter
    'hegrenade': [1000, '50px'], 
    'molotov': [7000, '50px'],
    'incgrenade': [7000, '50px'],
    'smokegrenade': [15000, '60px'],
    'decoy': [15000, '30px']
}

app = Flask(__name__)
socketio = SocketIO(app)

_thread = None
lock = Lock()

mp_converter = Converter_Real2Img(DEFAULT_MAP)
messageQueue = MessageQueue(qPlayerMoveSz=3)

@app.route('/')
def indexView():
    return render_template("index.html", localIP=request.remote_addr)

def background_task():
    global __INTERVAL, messageQueue
    while True:
        socketio.emit("server_response", messageQueue.qGetAllMsg_noWait(qExcept=["q2ServerMsg"]))
        socketio.sleep(__INTERVAL)

@socketio.on("connect")
def websocket_connect():
    global _thread
    with lock:
        if _thread is None:
            _thread = socketio.start_background_task(target=background_task)

@app.route('/ajax-api/init', methods=['GET'])
def ajaxInitView():
    global __MAXPLAYER, __UTCONFIG, __INTERVAL
    return {'MAXPLAYER': __MAXPLAYER, 'UTCONFIG': __UTCONFIG, "INTERVAL": __INTERVAL}

@app.route('/ajax-api/webmsg', methods=['GET', 'POST'])
def ajaxWebMsgView():
    if request.method == "POST":
        global messageQueue
        msg = request.form.get("msg", None)
        if msg is not None and len(msg.strip()):
            messageQueue.qPut("q2WebMsg", [request.remote_addr, msg])
            messageQueue.qPut("q2ServerMsg", [request.remote_addr, msg])
        return {"status": "Ok"}
    return {"status": "None", "message": "POST only"}

@app.route('/server-api/map', methods=["POST", "GET"])
def serverMapView():
    if request.method == "POST":
        global messageQueue, mp_converter
        rq_map = request.form.get("mapname", DEFAULT_MAP)
        if rq_map not in SUPPORT_MAPS: 
            return {"status": "Error", "message": "map({}) do not support".format(rq_map)}
        messageQueue.qPut("qMap", [rq_map])
        mp_converter.load_map(rq_map)
        return {"status": "Ok"}
    return {"status": "None", "message": "POST only"}

@app.route('/server-api/player', methods=["POST", "GET"])
def serverPlayerView():
    if request.method == "POST":
        '''
        playerXs: xx|xx|xx
        playerYs: xx|xx|xx
        steam3ids: xx|xx|xx
        names: xx !@! xx !@! xx
        ids: xx|xx|xx
        '''
        global messageQueue
        try:
            playerXs = request.form.get('playerXs', []).split(__CHARSPLIT)
            playerYs = request.form.get('playerYs', []).split(__CHARSPLIT)
            steam3ids = request.form.get('steam3ids', []).split(__CHARSPLIT)
            names = request.form.get('names', []).split(__NAMESPLIT)
            ids = request.form.get('ids', []).split(__CHARSPLIT)
            # check valid
            if len(playerXs) != len(names):
                return {"status": "error", "message": "player's name INVALID"}
            newPlayersMove = []
            playerCount = len(playerXs)
            for player in range(playerCount):
                px, py = mp_converter.convert(float(playerXs[player]), float(playerYs[player]))
                newPlayersMove.append([px, py, names[player], steam3ids[player], ids[player]])
            messageQueue.qPut("qPlayersMove", newPlayersMove)
            return {"status": "Ok"}
        except:
            return {"status": "Error"}
    return {"status": "None", "message": "POST only"}

@app.route('/server-api/utility', methods=['POST', 'GET'])
def serverUtilityView():
    if request.method == 'POST':
        '''
        utid, uttype, realX, realY
        '''
        global messageQueue
        utid = int(request.form.get('utid', 0))
        uttype = request.form.get('uttype', 'smokegrenade')
        realX = float(request.form.get('realX', 0)) - 80
        realY = float(request.form.get('realY', 0)) + 144
        posX, posY = mp_converter.convert(realX, realY)

        messageQueue.qPut("qUtility", [utid, uttype, posX, posY])
        return {"status": "Ok"}
    return {"status": "None", "message": "POST only"}

@app.route('/server-api/msg', methods=['POST', 'GET'])
def msgView():
    if request.method == 'POST':
        '''
        name, msg
        '''
        try:
            global messageQueue
            name = request.form.get("name", None)
            msg = request.form.get("msg", None)
            if name is not None and msg is not None:
                messageQueue.qPut("q2WebMsg", [name, msg])
            
            success, newMsg = messageQueue.qGet_noWait("q2ServerMsg")
            if success: 
                return {"status": "Good", "ip": newMsg[0], "msg": newMsg[1]}
            return {"status": "Ok"}
        except:
            return {"status": "Error"}

    return {"status": "None", "message": "POST only"}

if __name__ == '__main__':
    def memreset(): gc.collect()
    gcTimer = Timer(60.0, memreset)
    gcTimer.start()
    socketio.run(app, host="0.0.0.0", port=5000, debug=False)
