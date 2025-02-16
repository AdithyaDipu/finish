from flask import Flask, jsonify
from flask_cors import CORS
import socket

app = Flask(__name__)  # Define app first
CORS(app)  # Apply CORS after app is defined

ESP32_IP = "192.168.30.63"  # Replace with your actual ESP32 IP
ESP32_PORT = 5000

soil_data = {
    "moisture": 0,
    "temperature": 0,
    "nitrogen": 0,
    "phosphorus": 0,
    "potassium": 0
}

def request_sensor_data():
    try:
        client_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        client_socket.connect((ESP32_IP, ESP32_PORT))
        client_socket.sendall(b"GET_DATA\n")

        response = client_socket.recv(1024).decode('utf-8')
        data_array = response.strip().split(", ")

        moisture = data_array[0].split(": ")[1]
        temperature = int(float(data_array[1].split(": ")[1].replace("°C", "")))
        npk_values_str = data_array[2].split(": ")[1]
        npk_array = [int(value) for value in npk_values_str.replace("N=", "").replace("P=", "").replace("K=", "").split()]

        soil_data.update({
            "moisture": moisture,
            "temperature": temperature,
            "nitrogen": npk_array[0],
            "phosphorus": npk_array[1],
            "potassium": npk_array[2]
        })

        print("Soil Data from ESP32:")
        print("Moisture:", moisture)
        print("Temperature:", temperature)
        print("Nitrogen:", npk_array[0])
        print("Phosphorus:", npk_array[1])
        print("Potassium:", npk_array[2])

        client_socket.close()

    except Exception as e:
        print("Error:", e)

@app.route('/api/soil-data', methods=['GET'])
def soil_data_api():
    request_sensor_data()
    return jsonify(soil_data)

if __name__ == "__main__":
    app.run(host='127.0.0.1', port=5001, debug=True)

