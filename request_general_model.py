import requests
import json
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

def query_openai(prompt):
    api_key = os.getenv('OPENAI_API_KEY2')  # Get API key from .env file
    if not api_key:
        raise ValueError("No OpenAI API key found in .env file")

    headers = {
        'Content-Type': 'application/json',
        'Authorization': f'Bearer {api_key}'
    }

    data = {
        'prompt': prompt,
        'max_tokens': 60,
        'temperature': 0.7
    }

    response = requests.post(
        'https://api.openai.com/v1/engines/ft:babbage-002:personal::8Oq8nTwn/completions',
        headers=headers,
        data=json.dumps(data)
    )

    if response.status_code == 200:
        return response.json()
    else:
        raise Exception(f"Error in API request: {response.status_code} - {response.text}")

# Example usage
try:
    prompt_text = "You are a supportive assistant interpreting inputs as positive sayings. Input: 'https://platform.openai.com/api-keys'"
    response = query_openai(prompt_text)
    print("AI Response:", response['choices'][0]['text'].strip())
except Exception as e:
    print("Error:", e)
