import requests
import json
from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv()

def query_openai_assistant(assistant_id, messages):
    api_key = os.getenv('OPENAI_API_KEY2')
    if not api_key:
        raise ValueError("No OpenAI API key found in .env file")

    headers = {
        'Content-Type': 'application/json',
        'Authorization': f'Bearer {api_key}',
        "OpenAI-Beta": "assistants=v1"
    }

    data = {
        'messages': messages
    }

    response = requests.post(
        f'https://api.openai.com/v1/assistants/{assistant_id}',
        headers=headers,
        data=json.dumps(data)
    )

    if response.status_code == 200:
        return response.json()
    else:
        raise Exception(f"Error in API request: {response.status_code} - {response.text}")

# Example usage
try:
    assistant_id = os.getenv('ASSISTANT_KEY')  # Replace with your actual assistant ID
    conversation = [
        {"role": "system", "content": "You are a helpful assistant."},
        {"role": "user", "content": "Tell me something interesting about space."}
    ]

    response = query_openai_assistant(assistant_id, conversation)
    for message in response['choices'][0]['message']:
        print(f"{message['role'].capitalize()}: {message['content']}")
except Exception as e:
    print("Error:", e)
