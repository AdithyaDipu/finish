import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
import joblib

# Step 1: Load the dataset
df = pd.read_csv('Final_Crop_recommendation.csv')  # Ensure the path is correct

# Step 2: Prepare the data
X = df[['N', 'P', 'K', 'temperature', 'humidity', 'ph', 'rainfall']]
y = df['label']

# Step 3: Split the data into training and testing sets
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Step 4: Train the Random Forest model
model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

# Step 5: Save the trained model as crop_model.pkl
joblib.dump(model, 'crop_model.pkl', compress=3)

print("Model training complete. Saved as crop_model.pkl.")
