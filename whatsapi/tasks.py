import socket

# ESP32 server IP and port
ESP32_IP = "192.168.111.63"  # Replace with your ESP32 IP
ESP32_PORT = 5000

def request_sensor_data():
    try:
        # Create a socket connection
        client_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        client_socket.connect((ESP32_IP, ESP32_PORT))

        # Send request to ESP32
        client_socket.sendall(b"GET_DATA\n")

        # Receive response
        response = client_socket.recv(1024).decode('utf-8')
        print("Received:", response)

        # Split the response into an array
        data_array = response.strip().split(", ")
        print("Split Data Array:", data_array)

        # Extract values
        moisture = data_array[0].split(": ")[1]
        temperature_str = data_array[1].split(": ")[1].replace("°C", "")
        temperature = int(float(temperature_str))  # Convert to integer

        npk_values_str = data_array[2].split(": ")[1]
        npk_array = npk_values_str.replace("N=", "").replace("P=", "").replace("K=", "").split()
        npk_array = [int(value) for value in npk_array]  # Convert to integers

        print("Moisture:", moisture)
        print("Temperature:", temperature)
        print("NPK Array:", npk_array)

        # Close connection
        client_socket.close()

    except Exception as e:
        print("Error:", e)


if __name__ == "__main__":
    print("Press Enter to request sensor data from ESP32...")
    while True:
        input("Press Enter to get sensor data when the button is pressed...")
        request_sensor_data()