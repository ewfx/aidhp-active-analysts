import requests
import pandas as pd
from transformers import pipeline
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from flask import Flask, request, jsonify

# Initialize Flask app
app = Flask(__name__)

# Load sentiment analysis model (Hugging Face)
sentiment_analyzer = pipeline("sentiment-analysis")

# Trainable model data
vectorizer = TfidfVectorizer()
trained_vectors = None
product_list = []


def load_csv_data(file_path):
    """Loads data from a specified CSV file."""
    try:
        return pd.read_csv(file_path)
    except FileNotFoundError:
        return None


def train_model():
    """Trains the recommendation model based on available data."""
    global trained_vectors, product_list
    product_data = load_csv_data("data/recommended_products.csv")
    if product_data is not None and not product_data.empty:
        product_list = product_data['recommended_products'].dropna().unique().tolist()
        trained_vectors = vectorizer.fit_transform(product_list)


def analyze_sentiment(text):
    """Analyzes customer sentiment using Hugging Face transformer models."""
    if not text.strip():
        return "neutral", 0.5  # Default neutral sentiment
    result = sentiment_analyzer(text)
    return result[0]['label'], result[0]['score']


def generate_recommendations(user_id):
    """Generates personalized recommendations based on available data sources."""
    profile_data = load_csv_data("data/customer_profiles.csv")
    social_data = load_csv_data("data/social_media_activity.csv")
    purchase_data = load_csv_data("data/purchase_history.csv")

    purchase_history = []
    social_text = ""

    if purchase_data is not None and user_id in purchase_data['user_id'].values:
        purchase_history = purchase_data[purchase_data['user_id'] == user_id]['purchase_history'].values[0].split(', ')

    if social_data is not None and user_id in social_data['user_id'].values:
        social_text = social_data[social_data['user_id'] == user_id]['social_media_activity'].values[0]

    all_text = " ".join(purchase_history + [social_text])
    sentiment_label, sentiment_score = analyze_sentiment(all_text)

    # Generate recommendations
    recommendations = []
    if trained_vectors is not None and product_list:
        user_vector = vectorizer.transform([all_text])
        similarities = cosine_similarity(user_vector, trained_vectors)
        recommendations = sorted(zip(product_list, similarities[0]), key=lambda x: x[1], reverse=True)
        recommendations = [item[0] for item in recommendations[:3]]

    return {
        "sentiment": sentiment_label,
        "recommendations": recommendations
    }


@app.route("/recommend", methods=["POST"])
def recommend():
    """API endpoint to get real-time recommendations."""
    user_id = request.json.get("user_id")
    if not user_id:
        return jsonify({"error": "User ID is required"}), 400

    response = generate_recommendations(user_id)
    return jsonify(response)


if __name__ == "__main__":
    train_model()  # Train the model before starting the API
    app.run(host="0.0.0.0", port=5000, debug=True)
