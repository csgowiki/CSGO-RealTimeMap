import os
import json
from threading import Lock

from flask import Flask, render_template, request
from flask_socketio import SocketIO

class Converter_Real2Img():
    def __init__(self, map_name: str):
        self.load_map(map_name)

    def load_map(self, map_name: str):
        try:
            map_info_path = os.path.join('static', 'json', 'map_info.json')
            with open(map_info_path, 'r') as infile:
                self.map_info = json.loads(infile.read())[map_name]
        except:
            raise Exception('map_info.json load FAILED!')
    
    def convert(self, realX: float, realY: float):
        try:
            imgX = '{}px'.format((realX - self.map_info['pos_x']) / self.map_info['scale'])
            imgY = '{}px'.format((self.map_info['pos_y'] - realY) / self.map_info['scale'])
            return imgX, imgY
        except:
            raise Exception('convert FAILED!')

__CHARSPLIT = '|'
__NAMESPLIT = '!@!'
__MAXPLAYERS = 10
DEFAULT_MAP = 'de_inferno'

app = Flask(__name__)
socketio = SocketIO(app)

_thread = None
lock = Lock()

mp_converter = Converter_Real2Img(DEFAULT_MAP)
infoContainer = {
    'mapname': DEFAULT_MAP,
    'players': []
}

@app.route('/')
def mapview():
    return render_template("realmap.html")

def background_task():
    global infoContainer
    while True:
        socketio.emit("server_response", {"data": infoContainer})
        socketio.sleep(0.1)

@socketio.on("connect")
def websocket_connect():
    global _thread
    with lock:
        if _thread is None:
            _thread = socketio.start_background_task(target=background_task)

@app.route('/server-api/map', methods=["POST", "GET"])
def serverMapView():
    if request.method == "POST":
        global infoContainer, mp_converter
        infoContainer['mapname'] = request.form.get('mapname', DEFAULT_MAP)
        mp_converter.load_map(infoContainer['mapname'])
        return {"status": "Ok"}
    return {"status": "None", "message": "POST only"}

@app.route('/server-api/player', methods=["POST", "GET"])
def serverview():
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


if __name__ == '__main__':
    socketio.run(app, host="0.0.0.0", port=5000, debug=True)
