from pymongo import MongoClient

# Connect to MongoDB
client = MongoClient('mongodb://localhost:27017/')

# Access the 'whatsapi' database and the 'users' collection
db = client['whatsapi']
users_collection = db['users']

# Sample user data
users = [
    {"name": "midhun", "id": 1, "phone": "+919544170913"},
    {"name": "Bob", "id": 2, "phone": "+917736744800"},
    {"name": "sasi", "id": 3, "phone": "+919567124498"}
]

# Insert data into the collection
users_collection.insert_many(users)

print("✅ Users inserted into MongoDB successfully!")

# Verify data insertion
for user in users_collection.find():
    print(user)