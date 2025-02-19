from flask import Flask, jsonify
from flask_cors import CORS
import socket

app = Flask(__name__)
CORS(app)  # Allow CORS for React requests

ESP32_IP = "192.168.111.63"  # Replace with your ESP32 IP
ESP32_PORT = 5000

soil_data = {
    "moisture": "N/A",
    "temperature": 0,
    "nitrogen": 0,
    "phosphorus": 0,
    "potassium": 0
}

def request_sensor_data():
    """Fetch sensor data from ESP32 using TCP socket."""
    try:
        print("🌱 Connecting to ESP32 at", ESP32_IP, ":", ESP32_PORT)
        client_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        client_socket.settimeout(5)  # Timeout after 5 seconds
        client_socket.connect((ESP32_IP, ESP32_PORT))
        print("✅ Connected to ESP32.")

        client_socket.sendall(b"GET_DATA\n")
        print("📡 Request sent to ESP32.")

        response = client_socket.recv(1024).decode('utf-8')
        print("📥 Received from ESP32:", response)

        if not response:
            print("❌ No data received from ESP32.")
            return

        # Parse response: Moisture: Dry, Temperature: 24°C, NPK: N=48 P=32 K=17
        data_array = response.strip().split(", ")

        soil_data.update({
            "moisture": data_array[0].split(": ")[1],
            "temperature": int(float(data_array[1].split(": ")[1].replace("°C", ""))),
            "nitrogen": int(data_array[2].split(": ")[1].split()[0].split("=")[1]),
            "phosphorus": int(data_array[2].split(": ")[1].split()[1].split("=")[1]),
            "potassium": int(data_array[2].split(": ")[1].split()[2].split("=")[1])
        })

        print("✅ Updated Soil Data:", soil_data)
        client_socket.close()

    except socket.timeout:
        print("❌ ERROR: Connection to ESP32 timed out.")
    except ConnectionRefusedError:
        print("❌ ERROR: ESP32 refused the connection. Check ESP32 server.")
    except Exception as e:
        print("❌ General Error:", e)


@app.route('/api/soil-data', methods=['GET'])
def soil_data_api():
    """API endpoint to return soil data."""
    request_sensor_data()
    return jsonify(soil_data)


if __name__ == "__main__":
    app.run(host='127.0.0.1', port=5001, debug=True)
