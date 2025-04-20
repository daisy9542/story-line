from openai import AsyncOpenAI

from src.utils import get_config

config = get_config()
DEEPSEEK_API_KEY = config.get("deepseek_api_key")
client = AsyncOpenAI(api_key=DEEPSEEK_API_KEY, base_url="https://api.deepseek.com")


async def call_llm(content: str) -> str:
    
    response = await client.chat.completions.create(
        model="deepseek-chat",
        messages=[
            {"role": "user", "content": content},
        ],
        stream=False
    )
    
    return response.choices[0].message.content
