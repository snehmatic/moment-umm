import os
from dotenv import load_dotenv
from google import genai

def list_available_models():
    # Load environment variables from .env file
    load_dotenv()
    
    api_key = os.getenv("GEMINI_API_KEY")
    print(api_key)
    if not api_key:
        print("Error: GEMINI_API_KEY not found in .env file.")
        return

    try:
        client = genai.Client(api_key=api_key)
        print("Fetching available models...")
        
        # paged_list returns an iterator of Model objects
        for model in client.models.list():
            print(f"- {model.name}")
            # Optional: Print supported generation methods if available in the object
            # print(f"  Display Name: {model.display_name}")
            
    except Exception as e:
        print(f"An error occurred: {e}")

if __name__ == "__main__":
    list_available_models()
