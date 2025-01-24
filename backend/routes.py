from flask import Flask, request, jsonify
import os
from flask_cors import CORS
from werkzeug.utils import secure_filename
import google.generativeai as genai
from image_create import create_image_from_user_style
from PIL import Image
import re
import json
from dotenv import load_dotenv

load_dotenv()
gemini_api_key = os.getenv("GOOGLE_API_KEY")

if not gemini_api_key:
    print("GEMINI_API_KEY is not set in the environment variables.")
    exit()

genai.configure(api_key=gemini_api_key)
model = genai.GenerativeModel('gemini-1.5-flash')
model_8b = genai.GenerativeModel('gemini-1.5-flash-8b')

app = Flask(__name__)
CORS(app)

USER_PROMT = ""
UPLOAD_FOLDER = './uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
ALLOWED_IMAGE_EXTENSIONS = {'png', 'jpg', 'jpeg'}
ALLOWED_VIDEO_EXTENSIONS = {'mp4', 'mov'}


def allowed_file(filename, allowed_extensions):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in allowed_extensions

def analyze_image(image):
    try:
        # Define the prompt
        prompt = """
            Analyze the given image and identify each piece of clothing.
            For each item, provide a description, category, colors, and style.
            Ensure the output is a valid JSON array of objects with this structure:
            [{"description": "", "category": "", "colors": [], "style": [], "gender_type": "", "suitable_weather": "", "material": "", "occasion": ""}]
            Socks arent undergarments.
            Only output the JSON array. Do not include any extra text or formatting outside the JSON.
        """

        # Open the uploaded image
        image_data = Image.open(image)

        # Send the prompt and image to Gemini
        response = model.generate_content([prompt, image_data])
        raw_response = response.text.strip()

        # Extract JSON using regex (to handle improperly formatted responses)
        json_match = re.search(r'\[\s*\{.*\}\s*\]', raw_response, re.DOTALL)
        if json_match:
            cleaned_json = json_match.group(0)  # Extract the JSON array
        else:
            print("Failed to extract JSON from the response. Please check the format.")
            return None

        # Try parsing the extracted JSON
        try:
            json_response = json.loads(cleaned_json)
            if isinstance(json_response, list):
                return json_response  # Valid JSON array
            else:
                print("The response should be an array of objects.")
                return None
        except json.JSONDecodeError as e:
            print(f"Error parsing JSON from the cleaned response: {e}")
            return None

    except Exception as e:
         print(f"Error analyzing image: {e}")
         return None

def generate_outfit_combinations(catalog):
    prompt = f"""Given the following clothing catalog, generate at least three distinct outfit combinations.
      Provide a short description for each outfit.

        Catalog: {catalog}
    """
    try:
        response = model.generate_content(prompt)
        outfit_combinations =  response.text

        # Convert catalog to human-readable text
        catalog_text = ""
        for item in catalog:
            catalog_text += f"Description: {item.get('description', 'N/A')}\n"
            catalog_text += f"Category: {item.get('category', 'N/A')}\n"
            catalog_text += f"Colors: {', '.join(item.get('colors', ['N/A']))}\n"
            catalog_text += f"Style: {', '.join(item.get('style', ['N/A']))}\n"
            catalog_text += f"Gender Type: {item.get('gender_type', 'N/A')}\n"
            catalog_text += f"Suitable Weather: {item.get('suitable_weather', 'N/A')}\n"
            catalog_text += f"Material: {item.get('material', 'N/A')}\n"
            catalog_text += f"Occasion: {item.get('occasion', 'N/A')}\n"
            catalog_text += "-" * 30 + "\n"


        # Combine catalog and outfits
        combined_text = f"Clothing Catalog:\n{catalog_text}\n\nOutfit Combinations:\n{outfit_combinations}"

        prompt_8b = """Given the following clothing catalog, and outfit combinations, what are the items 
        that are missing from this catalog to make better outfits?
        Provide a list of amazon links that the user can use to buy those items.
        Do not include any extra text, just a json array of the links and descriptions:
        [{"description": "", "link": ""}]

         Catalog: """ + combined_text

        response_8b = model_8b.generate_content(prompt_8b)
        try:
            json_response = json.loads(response_8b.text)
        except json.JSONDecodeError as e:
            print(f"Error parsing json: {e}")
            return outfit_combinations, None
        return outfit_combinations, json_response
    except Exception as e:
        print(f"Error generating outfit combinations: {e}")
        return None, None

@app.route('/api/upload', methods=['POST'])
def upload_media():
    try:
        images = request.files.getlist("images")
        videos = request.files.getlist("videos")
        image_prompt = request.form.get("imagePrompt")
        video_prompt = request.form.get("videoPrompt")

        uploaded_files = []
        for image in images:
            if image.filename and allowed_file(image.filename, ALLOWED_IMAGE_EXTENSIONS):
                filename = secure_filename(image.filename)
                image.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
                uploaded_files.append(filename)
        for video in videos:
            if video.filename and allowed_file(video.filename, ALLOWED_VIDEO_EXTENSIONS):
                 filename = secure_filename(video.filename)
                 video.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
                 uploaded_files.append(filename)

        print("Image Prompt:", image_prompt)
        USER_PROMT=image_prompt
        print("Video Prompt:", video_prompt)
        print("Uploaded files:", uploaded_files)

        return jsonify({"message": "Media and prompts uploaded successfully!", "files": uploaded_files}), 200

    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": "Failed to upload media."}), 500

@app.route('/api/analyze', methods=['POST'])
def analyze():
    try:
        if 'image' not in request.files:
             return jsonify({"error": "No image file was uploaded"}), 400

        image = request.files['image']
        if image.filename == '':
            return jsonify({"error": "No file selected"}), 400
         
        if image and allowed_file(image.filename, ALLOWED_IMAGE_EXTENSIONS):
             image_path = os.path.join(app.config['UPLOAD_FOLDER'], secure_filename(image.filename))
             image.save(image_path)
             analysis_result = analyze_image(image_path)

             if analysis_result:
                 return jsonify(analysis_result), 200
             else:
                 return jsonify({"error": "Could not get analysis"}), 500
        else:
            return jsonify({"error": "Invalid image type"}), 400

    except Exception as e:
       print(f"Error: {e}")
       return jsonify({"error": "Failed to analyze image"}), 500

@app.route('/api/outfits', methods=['POST'])
def outfits():
    try:
        data = request.get_json()
        if not data or 'catalog' not in data:
           return jsonify({"error": "Invalid JSON or missing catalog data."}), 400

        catalog = data['catalog']
        outfit_combinations, recommendations = generate_outfit_combinations(catalog)

        if outfit_combinations:
            return jsonify({"outfits": outfit_combinations, "recommendations": recommendations}), 200
        else:
          return jsonify({"error": "Could not generate outfit combinations."}), 500
    except Exception as e:
       print(f"Error: {e}")
       return jsonify({"error": "Failed to generate outfit combinations."}), 500

@app.route('/api/ai_image', methods=['POST'])
def ai_image():
    image_generated_url = create_image_from_user_style(USER_PROMT)
    return image_generated_url

if __name__ == '__main__':
    app.run(debug=True)