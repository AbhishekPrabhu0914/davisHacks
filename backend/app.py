from io import BytesIO
from tkinter import Image
from flask import Flask, request, jsonify, make_response, render_template
from flask_cors import CORS, cross_origin
import tensorflow as tf
import keras 
import h5py
from tensorflow.keras.models import load_model
import numpy as np
app = Flask(__name__)
CORS(app, resources={ r"/predict": {
        "origins": ["chrome-extension://cliojfeoacfelabmkojpkhfhegnlflho"]
    }
})
model = load_model('/Users/abhishekprabhu/davisHacks/backend/larger_model.h5')

@app.route('/')
def index():
    # Image filenames stored in static/graphs/
    graph1 = 'graphs/graph1.png'
    return render_template('index.html', graph1=graph1)

# Load your model (make sure the path is correct)
model = load_model('larger_model.h5') # Adjust path as needed

def preprocess_image(image_bytes, target_size=(112, 112)):
    try:
        img = Image.open(BytesIO(image_bytes)).resize(target_size)
        img_array = np.array(img) / 255.0
        img_array = np.expand_dims(img_array, axis=0)
        return img_array
    except Exception as e:
        print(f"Error preprocessing image: {e}")
        return None

@app.route('/predict', methods=['POST', 'OPTIONS'])
@cross_origin()
def predict():
    if request.method == 'OPTIONS':
        # Respond to preflight request
        response = app.make_default_options_response()
        return response
    elif request.method == 'POST':
        data = request.get_json()
        image_url = data.get('imageUrl')

        if not image_url:
            return jsonify({'error': 'No imageUrl provided'}), 400

        try:
            response = requests.get(image_url, stream=True)
            response.raise_for_status()  # Raise an exception for bad status codes
            image_bytes = response.content
        except requests.exceptions.RequestException as e:
            return jsonify({'error': f'Error fetching image from URL: {e}'}), 400

        # Preprocess the image
        processed_image = preprocess_image(image_bytes)

        if processed_image is None:
            return jsonify({'error': 'Failed to preprocess the image'}), 400

        # Make the prediction
        prediction = model.predict(processed_image)[0][0] # Assuming binary output

        # Return the probability
        return jsonify({'ai_probability': float(prediction)}) # Ensure it's a float for JSON

    return jsonify({'error': 'Invalid request method'}), 405

if __name__ == '__main__':
    app.run(port=5050)
