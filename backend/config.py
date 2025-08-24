import os
from dotenv import load_dotenv

load_dotenv()  # if using .env file

class Settings:
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY")

settings = Settings()
