from os import error
from threading import Lock, Timer

from flask import Flask, render_template, request
from flask_socketio import SocketIO

from utils import *

__CHARSPLIT = '|'
__NAMESPLIT = '!@!'
DEFAULT_MAP = 'de_inferno'
__INTERVAL = 0.1 # s
__MAXPLAYER = 10
__UTCONFIG = {
    'flashbang': [1, '50px'], # timelast, diameter
    'hegrenade': [1, '50px'], 
    'molotov': [7, '50px'],
    'incgrenade': [7, '50px'],
    'smokegrenade': [15, '60px'],
    'decoy': [15, '30px']
}

app = Flask(__name__)
socketio = SocketIO(app)

_thread = None
lock = Lock()

mp_converter = Converter_Real2Img(DEFAULT_MAP)
infoContainer = {
    'mapname': DEFAULT_MAP,  # str
    'players': [], # [{'posX', 'posY', 'name', 'steam3id'}]
    'utilities': {} # {'utid': {'uttype', 'posX', 'posY'}}   type=[flashbang, hegrenade, molotov, smokegrenade]
}

@app.route('/')
def mapview():
    return render_template("index.html")

def background_task():
    global infoContainer, __INTERVAL
    while True:
        socketio.emit("server_response", {"data": infoContainer})
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

@app.route('/server-api/map', methods=["POST", "GET"])
def serverMapView():
    if request.method == "POST":
        global infoContainer, mp_converter
        infoContainer['mapname'] = request.form.get('mapname', DEFAULT_MAP)
        mp_converter.load_map(infoContainer['mapname'])
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
        '''
        global infoContainer, __CHARSPLIT, __NAMESPLIT
        playerXs = request.form.get('playerXs', []).split(__CHARSPLIT)
        playerYs = request.form.get('playerYs', []).split(__CHARSPLIT)
        steam3ids = request.form.get('steam3ids', []).split(__CHARSPLIT)
        names = request.form.get('names', []).split(__NAMESPLIT)
        # check valid
        if len(playerXs) != len(names):
            return {"status": "error", "message": "player's name INVALID"}

        playerCount = len(playerXs)
        infoContainer["players"].clear()
        for player in range(playerCount):
            px, py = mp_converter.convert(float(playerXs[player]), float(playerYs[player]))
            infoContainer["players"].append({
                "posX": px, "posY": py,
                "steam3id": steam3ids[player], "name": names[player]
            })
        return {"status": "Ok"}
    return {"status": "None", "message": "POST only"}

@app.route('/server-api/utility', methods=['POST', 'GET'])
def serverUtilityView():
    if request.method == 'POST':
        '''
        utid, uttype, realX, realY
        '''
        global infoContainer, __UTCONFIG
        utid = int(request.form.get('utid', 0))
        uttype = request.form.get('uttype', 'smokegrenade')
        realX = float(request.form.get('realX', 0)) - 80
        realY = float(request.form.get('realY', 0)) + 144
        posX, posY = mp_converter.convert(realX, realY)
        infoContainer['utilities'][utid] = {
            'posX': posX, 'posY': posY, 'uttype': uttype
        }
        def utTimerCallBack(utid: int):
            global infoContainer
            del infoContainer['utilities'][utid]
        utTimer = Timer(__UTCONFIG[uttype][0], utTimerCallBack, (utid,))
        utTimer.start()
        return {"status": "Ok"}
    return {"status": "None", "message": "POST only"}

if __name__ == '__main__':
    socketio.run(app, host="0.0.0.0", port=5000, debug=True)
