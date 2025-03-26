import google.generativeai as genai
from dotenv import load_dotenv
import os

# Configure your API key. You can get this from Google AI Studio.
load_dotenv()  # Load environment variables from .env
API_KEY = os.getenv("API_KEY")
genai.configure(api_key=API_KEY)

def generate_text_from_tuned_model(prompt):
  try:
      tuned_model_name = 'tunedModels/financialrecommendationdatasetnatural-oj'
      model = genai.GenerativeModel(tuned_model_name)
      response = model.generate_content(prompt)
      return response.text
  except Exception as e:
      print(f"An error occurred: {e}")
      return None

generate_text_from_tuned_model("hi")
