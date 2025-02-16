from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from bson import ObjectId
import numpy as np
import joblib

app = Flask(__name__)
CORS(app)

# Connect to MongoDB
client = MongoClient("mongodb://localhost:27017/")
db = client["agroassist_db"]
predictions_collection = db["predictions"]
crops_collection = db["crops"]  # Collection for crop details

# Load the trained ML model
model = joblib.load('crop_model.pkl')

@app.route("/")
def index():
    return "AgroAssist API is running."

# 📌 Route: Predict Suitable Crops
@app.route("/predict", methods=['POST'])
def predict():
    try:
        data = request.json
        email = data.get("email")
        phone = data.get("phone")
        project_name = data.get("projectName")
        category = data.get("category")

        # Extract input features
        N = float(data['Nitrogen'])
        P = float(data['Phosporus'])
        K = float(data['Potassium'])
        temp = float(data['Temperature'])
        humidity = float(data['Humidity'])
        ph = float(data['Ph'])
        rainfall = float(data['Rainfall'])

        feature_list = [N, P, K, temp, humidity, ph, rainfall]
        single_pred = np.array(feature_list).reshape(1, -1)

        # Predict top 10 crops
        probabilities = model.predict_proba(single_pred)[0]
        top_10_indices = probabilities.argsort()[-10:][::-1]

        crop_dict = {
            0: "Rice", 1: "Maize", 2: "Jute", 3: "Cotton", 4: "Coconut",
            5: "Papaya", 6: "Orange", 7: "Apple", 8: "Muskmelon", 9: "Watermelon",
            10: "Mango", 11: "Banana", 12: "Pomegranate", 13: "Lentil",
            14: "Blackgram", 15: "Mungbean", 16: "Mothbeans", 17: "Pigeonpeas",
            18: "Kidneybeans", 19: "Chickpea", 20: "Coffee", 21: "Ladiesfinger",
            22: "Beans", 23: "Scarlet Gourd", 24: "Bittergourd", 25: "Strawberry",
            26: "Tomato", 27: "Pepper", 28: "Capsicum", 29: "Ginger",
            30: "Onion", 31: "Grapes"
        }

        # Categorize crops
        fruits = {4, 5, 6, 7, 8, 9, 10, 11, 12, 20, 25}
        vegetables = {1, 2, 3, 21, 22, 23, 24, 26, 27, 28, 29, 30}

        filtered_crops = []
        for i in top_10_indices:
            crop_name = crop_dict.get(i, f"Crop_{i}")
            if category in ["fruits", "both"] and i in fruits:
                filtered_crops.append({"crop": crop_name, "probability": float(probabilities[i])})
            if category in ["vegetables", "both"] and i in vegetables:
                filtered_crops.append({"crop": crop_name, "probability": float(probabilities[i])})

        # Save prediction in MongoDB
        document = {
            "email": email,
            "phone": phone,
            "project_name": project_name,
            "input_data": {"Nitrogen": N, "Phosporus": P, "Potassium": K, "Temperature": temp, "Humidity": humidity, "Ph": ph, "Rainfall": rainfall},
            "predictions": filtered_crops,
            "selected_crops": []
        }
        inserted_doc = predictions_collection.insert_one(document)

        return jsonify({"top_10_crops": filtered_crops, "document_id": str(inserted_doc.inserted_id)})

    except Exception as e:
        return jsonify({"message": f"An error occurred: {str(e)}"}), 500

# 📌 Route: Store Selected Crops
@app.route("/store-selected-crops", methods=['POST'])
def store_selected_crops():
    try:
        data = request.json
        email = data.get("email")
        phone = data.get("phone")
        selected_crops = data.get("selected_crops")
        document_id = data.get("document_id")
        project_name = data.get("project_name")
        category = data.get("category")

        if not all([email, phone, selected_crops, document_id, project_name, category]):
            return jsonify({"message": "All fields are required!"}), 400

        result = predictions_collection.update_one(
            {"_id": ObjectId(document_id)},
            {"$set": {
                "email": email,
                "phone": phone,
                "selected_crops": selected_crops,
                "project_name": project_name,
                "category": category
            }}
        )

        if result.modified_count == 1:
            return jsonify({"message": "Selected crops updated successfully!"})
        return jsonify({"message": "Document not found or not updated!"}), 404

    except Exception as e:
        return jsonify({"message": f"An error occurred while saving selected crops: {str(e)}"}), 500

# 📌 Route: Get User Projects
@app.route("/get-user-projects", methods=['GET'])
def get_user_projects():
    try:
        email = request.args.get("email")
        if not email:
            return jsonify({"message": "Email is required!"}), 400

        entries = list(predictions_collection.find({"email": email}))
        if not entries:
            return jsonify({"message": "No projects found for the given email!"}), 404

        for entry in entries:
            entry["_id"] = str(entry["_id"])

        return jsonify({"entries": entries})

    except Exception as e:
        return jsonify({"message": f"An error occurred while fetching projects: {str(e)}"}), 500

# 📌 Route: Get Crop Details (NEW)
@app.route("/get-crop-details", methods=['GET'])
def get_crop_details():
    try:
        crop_name = request.args.get("crop_name")
        if not crop_name:
            return jsonify({"message": "Crop name is required!"}), 400

        crop_data = crops_collection.find_one({"name": crop_name})
        if not crop_data:
            return jsonify({"message": "Crop details not found!"}), 404

        crop_data["_id"] = str(crop_data["_id"])  # Convert ObjectId to string
        return jsonify(crop_data)

    except Exception as e:
        return jsonify({"message": f"An error occurred: {str(e)}"}), 500

# Run Flask App
if __name__ == "__main__":
    app.run(debug=True)
