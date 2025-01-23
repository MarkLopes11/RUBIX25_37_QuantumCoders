from together import Together
from dotenv import load_dotenv
import os

list_url = []
def create_image_from_user_style(input):
    load_dotenv()
    api_key= os.getenv('TOGETHER_AI')
    client = Together(api_key=api_key)
    response = client.images.generate(
        prompt=f"Create a realistic image for young adults from head to toe :{input}",
        model="black-forest-labs/FLUX.1-schnell",
        steps=3,
        n=4
    )
    image_url=response.data[0].url
    print(image_url)
    list_url.append(image_url)
gender = 'male'  
create_image_from_user_style('''
Casual Spring Day
*
Gender:{gender}
Items:

Pink cardigan sweater, white crew neck t-shirt, gray denim jeans. *

Description:
For male
A relaxed and comfortable outfit perfect for a spring day.
The pink cardigan adds a pop of color over the classic white t-shirt and gray jeans. 
Suitable for a casual lunch date or running errands.''')

