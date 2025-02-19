import os
from dotenv import load_dotenv
from flask import Flask, request, jsonify
import requests
from flask_cors import CORS  

# Load environment variables from .env file
load_dotenv()

# Access variables
WHATSAPP_TOKEN = os.getenv("WHATSAPP_TOKEN")
WHATSAPP_PHONE_NUMBER_ID = os.getenv("WHATSAPP_PHONE_NUMBER_ID")
WHATSAPP_API_URL = os.getenv("WHATSAPP_API_URL")

app = Flask(__name__)
CORS(app)  # Allow requests from frontend

@app.route("/send-message", methods=["POST"])
def send_message():
    try:
        data = request.json
        recipient_number = data.get("recipientNumber")  
        message_template = data.get("messageTemplate")  

        if not recipient_number or not message_template:
            return jsonify({"success": False, "error": "Recipient number or template name is missing."}), 400

        payload = {
            "messaging_product": "whatsapp",
            "to": recipient_number,
            "type": "template",
            "template": {
                "name": message_template,
                "language": {"code": "en_US"},
            }
        }

        headers = {
            "Authorization": f"Bearer {WHATSAPP_TOKEN}",
            "Content-Type": "application/json",
        }

        response = requests.post(WHATSAPP_API_URL, json=payload, headers=headers)

        if response.status_code == 200:
            return jsonify({"success": True, "response": response.json()})
        else:
            return jsonify({"success": False, "error": response.json()}), response.status_code

    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

if __name__ == "__main__": 
    app.run(host="0.0.0.0", port=5000, debug=True)
