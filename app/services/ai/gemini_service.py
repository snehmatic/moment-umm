import json
from typing import List
from google import genai
from google.genai import types
from app.core.config import settings
from app.schemas.task import MicroStep
from app.services.ai.base import LLMService

class GeminiService(LLMService):
    def __init__(self):
        # Initialize the client with the API key from settings
        # The new SDK handles missing keys gracefully or raises errors when used
        if not settings.GEMINI_API_KEY:
            pass
        print("Key: ", settings.GEMINI_API_KEY)
        self.client = genai.Client(api_key=settings.GEMINI_API_KEY)
        self.model_name = "gemini-2.0-flash"

    async def decompose_task(self, objective: str, model: str = None, api_key: str = None, system_instruction: str = None) -> List[MicroStep]:
        # Determine configuration
        effective_key = api_key if api_key and api_key.strip() else settings.GEMINI_API_KEY
        effective_model = model if model and model.strip() else self.model_name
        
        # Use a temporary client if a custom key is provided, otherwise use the default
        client = self.client
        if api_key and api_key.strip():
             client = genai.Client(api_key=api_key)

        # Construct the System Instruction / Persona
        default_persona = """
        You are an Executive Function Coach for someone with ADHD.
        Your goal is to break down the following vague, overwhelming task into atomic, laughable micro-steps.
        Each step should take about 2 minutes to complete. 
        The tone should be encouraging but non-judgmental.
        """
        
        persona = system_instruction if system_instruction and system_instruction.strip() else default_persona

        prompt = f"""
        {persona}

        Task: "{objective}"

        Return a strictly valid JSON array of objects. 
        Each object must have these exact keys: 
        - "step_number" (integer)
        - "description" (string)
        - "estimated_duration" (string, e.g., "2 mins")
        
        Do not include any markdown formatting (like ```json). Just the raw JSON string.
        """
        
        try:
            # Using the new SDK call structure
            response = client.models.generate_content(
                model=effective_model,
                contents=prompt,
                config=types.GenerateContentConfig(
                    response_mime_type="application/json"
                )
            )
            
            text = response.text.strip()
            
            # Defensive cleaning (though response_mime_type helps, sometimes models still wrap)
            if text.startswith("```json"):
                text = text[7:]
            elif text.startswith("```"):
                text = text[3:]
            if text.endswith("```"):
                text = text[:-3]
            
            text = text.strip()
            data = json.loads(text)
            
            return [MicroStep(**item) for item in data]
            
        except json.JSONDecodeError:
            print(f"Error decoding JSON from AI response: {text}")
            return []
        except Exception as e:
            print(f"Unexpected error in decompose_task: {e}")
            return []
