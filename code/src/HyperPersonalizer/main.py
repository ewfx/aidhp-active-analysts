from flask import Flask, request, jsonify
from queryModel import generate_text_from_tuned_model
from retrieval import getPreferences
import json
app = Flask(__name__)

customerInfo=""
customerDetails=""

@app.route("/status", methods=["GET"])
def get_status():
    return jsonify({"status": "running"})

@app.route("/greet/<customerId>", methods=["GET"])
def greet(customerId):
    global customerInfo , customerDetails
    customerInfo=customerId

    customerPreference = getPreferences(customerId)
    print(customerInfo,customerPreference)

    if isinstance(customerPreference, str):
        customerPreference = json.loads(customerPreference)
    customerDetails = ", ".join([f"{key}: {list(value.values())[0]}" for key, value in customerPreference.items()])

    print(customerDetails)
    response = generate_text_from_tuned_model(customerDetails)
    return jsonify({"message": f" {response}!"})

@app.route("/chat", methods=["POST"])
def predict():
    data = request.get_json()
    if "text" not in data:
        return jsonify({"error": "Missing 'text' field"}), 400
    print(data)
    prompt = generate_text_from_tuned_model(data['text'])
    return jsonify({"response": prompt})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000, debug=True)
