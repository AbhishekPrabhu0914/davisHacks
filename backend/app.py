from flask import Flask, request, jsonify, make_response, render_template
from flask_cors import CORS, cross_origin

app = Flask(__name__)
CORS(app, resources={ r"/predict": {
        "origins": ["chrome-extension://cliojfeoacfelabmkojpkhfhegnlflho"]
    }
})


@app.route('/')
def index():
    # Image filenames stored in static/graphs/
    graph1 = 'graphs/graph1.png'
    graph2 = 'graphs/graph2.png'
    return render_template('index.html', graph1=graph1, graph2=graph2)

  
  
@app.route('/predict', methods=['POST', 'OPTIONS'])
@cross_origin()
def predict():
    data = request.get_json()
    image_url = data.get('imageUrl')
    score = 0.88
    return jsonify({'ai_probability': score})

if __name__ == '__main__':
    app.run(port=5050)
