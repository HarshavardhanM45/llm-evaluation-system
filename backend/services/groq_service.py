from groq import Groq
from config import settings
from utils.logger import get_logger

logger = get_logger(__name__)

class GroqService:
    def __init__(self):
        self.client = Groq(api_key=settings.GROQ_API_KEY)
        self.model = settings.MODEL_NAME
        self.temperature = settings.TEMPERATURE

    def get_json_response(self, system_prompt: str, user_prompt: str) -> str:
        """
        Sends a request to Groq and expects a JSON formatted response.
        The prompt must explicitly ask for JSON to satisfy the response_format requirement.
        """
        try:
            logger.info(f"Sending request to Groq model: {self.model}")
            chat_completion = self.client.chat.completions.create(
                messages=[
                    {
                        "role": "system",
                        "content": system_prompt
                    },
                    {
                        "role": "user",
                        "content": user_prompt
                    }
                ],
                model=self.model,
                temperature=self.temperature,
                response_format={"type": "json_object"},
            )
            response_content = chat_completion.choices[0].message.content
            return response_content
        except Exception as e:
            logger.error(f"Error communicating with Groq API: {str(e)}")
            raise

groq_service = GroqService()
