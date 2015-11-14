import flask
import bson.json_util

def get_request_params():
	data = flask.request.form['data']
	params = bson.json_util.loads(data)
	return params
	
def generate_response(data):
	content = bson.json_util.dumps({'data':data})
	response = flask.Response(
		response=content,
		status = 200,
		mimetype = 'application/json')
	return response