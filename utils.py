# -*- coding:utf-8 -*-
import os
import json

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
