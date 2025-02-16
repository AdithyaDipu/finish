from flask import Flask, request, jsonify
import joblib
import pandas as pd

app = Flask(__name__)

# Load the trained crop recommendation model
model = joblib.load('crop_model.pkl')

# Define route for crop recommendation
@app.route('/recommend_crop', methods=['POST'])
def recommend_crop():
    try:
        # Get input data from the POST request
        data = request.get_json()

        # Extract the input values
        N = data['N']
        P = data['P']
        K = data['K']
        temperature = data['temperature']
        humidity = data['humidity']
        ph = data['ph']
        rainfall = data['rainfall']

        # Create a DataFrame for the input
        input_data = pd.DataFrame([[N, P, K, temperature, humidity, ph, rainfall]],
                                  columns=['N', 'P', 'K', 'temperature', 'humidity', 'ph', 'rainfall'])

        # Make prediction using the trained model
        prediction = model.predict(input_data)[0]

        # Return the recommended crop
        return jsonify({'recommended_crop': prediction})

    except Exception as e:
        return jsonify({'error': str(e)})

if __name__ == '__main__':
    app.run(debug=True)
