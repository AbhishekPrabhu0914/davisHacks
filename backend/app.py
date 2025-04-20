from flask import Flask, request, jsonify, make_response
from flask_cors import CORS, cross_origin

app = Flask(__name__)
CORS(app, resources={ r"/predict": {
        "origins": ["chrome-extension://cliojfeoacfelabmkojpkhfhegnlflho"]
    }
})

@app.route('/predict', methods=['POST', 'OPTIONS'])
@cross_origin()
def predict():
    data = request.get_json()
    image_url = data.get('imageUrl')
    score = 0.88
    return jsonify({'ai_probability': score})

if __name__ == '__main__':
    app.run(port=5050)
