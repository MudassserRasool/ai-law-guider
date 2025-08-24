from openai import OpenAI
import os
from dotenv import load_dotenv

load_dotenv()

# Centralized client configuration
def get_aiml_client():
    """Get a configured AIML client instance"""
    aiml_api_key = os.getenv("AIML_API_KEY")
    if not aiml_api_key:
        raise ValueError("AIML_API_KEY environment variable is not set")
    
    return OpenAI(
        base_url="https://api.aimlapi.com/v1",
        api_key=aiml_api_key,
    )

# Create a singleton instance
_aiml_client = None

def get_client():
    """Get the singleton AIML client instance"""
    global _aiml_client
    if _aiml_client is None:
        _aiml_client = get_aiml_client()
    return _aiml_client

# Example usage (can be removed if not needed)
if __name__ == "__main__":
    try:
        client = get_client()
        response = client.chat.completions.create(
            model="gpt-5-2025-08-07",
            messages=[{"role": "user", "content": "Write a 10 line story about numbers."}],
            tools=[]
        )
        print(response.choices[0].message.content)
    except Exception as e:
        print("Error while calling llm:", e)