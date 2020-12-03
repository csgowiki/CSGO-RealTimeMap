from flask import Flask, render_template, request

import mapconvert

app = Flask(__name__)

mp_converter = mapconvert.Converter_Real2Img('de_inferno')

infoContainer = {"cx": 5, "cy": 5}

@app.route('/')
def mapview():
    return render_template("realmap.html")

@app.route('/api/ajax_update', methods=["GET"])
def ajaxview():
    global infoContainer
    return infoContainer

@app.route('/api/server_update', methods=["POST", "GET"])
def serverview():
    if request.method == "POST":
        cx, cy = mp_converter.convert(
            float(request.form.get("realX", 0)),
            float(request.form.get("realY", 0))
        )
        global infoContainer
        infoContainer = {"cx": cx, "cy": cy}
        return {"status": "Ok"}
    return {"status": "None", "message": "POST only"}


if __name__ == '__main__':
    app.run(debug=True)
