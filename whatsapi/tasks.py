import os
import datetime
import requests
from pymongo import MongoClient
from celery import Celery
from celery.schedules import crontab
from dotenv import load_dotenv


# Load environment variables
load_dotenv()

# Celery configuration
app = Celery('tasks', broker='redis://localhost:6379/0')

# MongoDB connection
client = MongoClient('mongodb://localhost:27017/')
db = client['whatsapi']
users_collection = db['users']

# WhatsApp Cloud API credentials
WHATSAPP_TOKEN = os.getenv('WHATSAPP_TOKEN')
WHATSAPP_PHONE_NUMBER_ID = os.getenv('WHATSAPP_PHONE_NUMBER_ID')
WHATSAPP_API_URL = os.getenv('WHATSAPP_API_URL')

# HTTP Headers for WhatsApp Cloud API
HEADERS = {
    "Authorization": f"Bearer {WHATSAPP_TOKEN}",
    "Content-Type": "application/json"
}

@app.task
def send_whatsapp_message(phone_number, name):
    # Generate a custom message dynamically
    #custom_message = f"Hello {name}, this is your scheduled message from our service!"
    custom_message = name

    print(f"📨 Sending message to: {name} ({phone_number})")

    message_data = {
        "messaging_product": "whatsapp",
        "to": phone_number,
        "type": "template",
        "template": {
            "name": "hello_world",
            "language": {
                "code": "en_US"
            },
            "components": [
                {
                    "type": "body",
                    "parameters": []
                }
            ]
        }
    }

    response = requests.post(WHATSAPP_API_URL, headers=HEADERS, json=message_data)

    if response.status_code == 200:
        print(f"✅ Message sent to {name} ({phone_number})")
    else:
        print(f"❌ Failed to send message to {name} ({phone_number}): {response.json()}")

@app.on_after_configure.connect
def setup_periodic_tasks(sender, **kwargs):
    scheduled_hour = 2
    scheduled_minute = 40
    scheduled_time = f"{scheduled_hour:02}:{scheduled_minute:02}"
    users = users_collection.find()
    for user in users:
        phone_number = user.get('phone')
        name = user.get('name')

        print(f"🕒 Scheduling send_whatsapp_message to {name} ({phone_number}) at {scheduled_time}")
        
        sender.add_periodic_task(
            crontab(hour=scheduled_hour, minute=scheduled_minute),
            send_whatsapp_message.s(phone_number, name),
            name=f'send-message-to-{name}'
        )

app.conf.timezone = 'Asia/Kolkata'