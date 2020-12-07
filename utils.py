# -*- coding:utf-8 -*-
import os
import json
import queue

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

class MessageQueue():
    def __init__(self, qMapSz=1, qPlayerMoveSz=100, qUtilitySz=10, q2ServerMsgSz=10, q2WebMsgSz=5):
        '''
        qMap: [mapname]
        qPlayersMove: [[posX, posY, name, steam3id, clientid]]
        qUtility: [utid, uttype, posX, posY]
        q2WebMsg: [ip/name, msg]
        q2ServerMsg: [ip, msg]
        '''
        self.qMsg = {
            "qMap": queue.Queue(maxsize=qMapSz),
            "qPlayersMove": queue.Queue(maxsize=qPlayerMoveSz),
            "qUtility": queue.Queue(maxsize=qUtilitySz),
            "q2WebMsg": queue.Queue(maxsize=q2WebMsgSz),
            "q2ServerMsg": queue.Queue(maxsize=q2ServerMsgSz),
        }
    
    def qPut(self, qName: str, value: list=[]):
        try:
            if self.qMsg[qName].full(): self.qMsg[qName].get_nowait()
            self.qMsg[qName].put_nowait(value)
        except:
            raise Exception("Queue({}) Put Error!".format(qName))
    
    def qGetAllMsg_noWait(self, qExcept=[]):
        allMsg = {}
        for key, value in self.qMsg.items():
            if key in qExcept: continue
            allMsg[key] = [] if value.empty() else value.get_nowait()
        return allMsg

    def qGet_noWait(self, qName: str):
        try:
            # success, Msg
            return (False, []) if self.qMsg[qName].empty() else (True, self.qMsg[qName].get_nowait())
        except:
            raise Exception("Queue({}) Get Error!".format(qName))

    def qClearAll(self):
        for key in self.qMsg.keys():
            self.qMsg[key] = queue.Queue()