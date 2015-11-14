import flask
import sys
import traceback
from dabaopku.utils.network import generate_response, get_request_params


class App(flask.Flask):
    def get_send_file_max_age(self, name):
        if name == u'js/app.js':
            return 0
        return flask.Flask.get_send_file_max_age(self, name)
        
app = App(__name__)
app.config.update({"DEBUG": True })

@app.route("/")
def root():
    return flask.render_template("index.html")

@app.route("/data")
def data():
    return generate_response("Hello World!")

@app.errorhandler(500)
def error(error):
    traceback.print_exc()
    response = flask.jsonify({
        "error": 500,
        "msg": str(error)})
    return response
    

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8912, use_reloader=False)