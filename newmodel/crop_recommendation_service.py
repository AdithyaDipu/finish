from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import pandas as pd

app = Flask(__name__)
CORS(app)

# Load the trained crop recommendation model
model = joblib.load('crop_model.pkl')

@app.route('/')
def home():
    return "AgroAsist Crop Recommendation API is running."

# Crop recommendation route
@app.route('/recommend_crop', methods=['POST'])
def recommend_crop():
    try:
        data = request.get_json()
        
        # Extract input values
        input_data = pd.DataFrame([[data['N'], data['P'], data['K'], data['temperature'], 
                                    data['humidity'], data['ph'], data['rainfall']]],
                                  columns=['N', 'P', 'K', 'temperature', 'humidity', 'ph', 'rainfall'])

        # Get probabilities of each crop
        probs = model.predict_proba(input_data)[0]

        # Get top 10 crops
        classes = model.classes_
        top_indices = probs.argsort()[-10:][::-1]
        top_crops = [classes[i] for i in top_indices]

        return jsonify({'recommended_crops': top_crops})

    except Exception as e:
        return jsonify({'error': str(e)})

if __name__ == '__main__':
    app.run(debug=True)
