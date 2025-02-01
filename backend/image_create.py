from together import Together
from dotenv import load_dotenv
import os

list_url = []
def create_image_from_user_style(input):
    load_dotenv()
    api_key= os.getenv('TOGETHER_AI')
    client = Together(api_key)
    response = client.images.generate(
        prompt=f"Create a realistic image for young adults from head to toe :{input}",
        model="black-forest-labs/FLUX.1-schnell",
        steps=3,
        n=4
    )
    image_url=response.data[0].url
    return image_url

