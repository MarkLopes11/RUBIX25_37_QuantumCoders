from flask import Flask, request, jsonify, send_file
import os
from flask_cors import CORS
from werkzeug.utils import secure_filename
import google.generativeai as genai
from image_create import create_image_from_user_style
from PIL import Image
import re
import json
from dotenv import load_dotenv
from io import StringIO
from datetime import datetime

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

USER_PROMPT = ""
UPLOAD_FOLDER = './uploads'
REPORTS_FOLDER = './reports' # Define reports folder
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(REPORTS_FOLDER, exist_ok=True) # Create the reports folder if it doesn't exist
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['REPORTS_FOLDER'] = REPORTS_FOLDER # Set the reports folder in app config
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

def create_report(analysis_result, outfit_combinations):
    report = StringIO()
    report.write("Fashion AI Report\n")
    report.write("-------------------\n\n")

    if analysis_result:
        report.write("Image Analysis Results:\n")
        for idx, item in enumerate(analysis_result):
             report.write(f"\nAnalysis {idx+1}:\n")
             report.write(f"  Description: {item.get('description', 'N/A')}\n")
             report.write(f"  Category: {item.get('category', 'N/A')}\n")
             report.write(f"  Colors: {', '.join(item.get('colors', ['N/A']))}\n")
             report.write(f"  Style: {', '.join(item.get('style', ['N/A']))}\n")
             report.write(f"  Gender Type: {item.get('gender_type', 'N/A')}\n")
             report.write(f"  Suitable Weather: {item.get('suitable_weather', 'N/A')}\n")
             report.write(f"  Material: {item.get('material', 'N/A')}\n")
             report.write(f"  Occasion: {item.get('occasion', 'N/A')}\n")
        report.write("\n")

    if outfit_combinations and outfit_combinations.get("outfits"):
        report.write("Outfit Recommendations:\n")
        outfits_text = outfit_combinations["outfits"]

        # Remove asterisks from outfit combinations
        outfits_text = outfits_text.replace("*", "")


        report.write(f"{outfits_text}\n")
        report.write("\n")
        if outfit_combinations.get("recommendations"):
            report.write("Recommended Items:\n")
            for item in outfit_combinations.get("recommendations"):
                 report.write(f"  - {item.get('description', 'N/A')}: {item.get('link', 'N/A')}\n")
            report.write("\n")

    report.seek(0)
    return report


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
    image_generated_url = create_image_from_user_style(USER_PROMPT)
    return jsonify({"ai_image": image_generated_url})

@app.route('/api/generate_report', methods=['POST'])
def generate_report():
    try:
        data = request.get_json()
        if not data or 'analysisResult' not in data or 'outfitCombinations' not in data:
            return jsonify({"error": "Missing analysis result or outfit combinations."}), 400

        analysis_result = data['analysisResult']
        outfit_combinations = data['outfitCombinations']

        report_content = create_report(analysis_result, outfit_combinations)

         # Get the current timestamp
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
         # Create a file name with timestamp
        filename = f"fashion_report_{timestamp}.txt"
        
        # Get the full path to save in the reports folder
        file_path = os.path.join(app.config['REPORTS_FOLDER'], filename)
        
        # Save to disk and return file
        with open(file_path, 'w') as f:
            f.write(report_content.getvalue())

        return send_file(file_path, as_attachment=True, download_name=filename)

    except Exception as e:
        print(f"Error generating report: {e}")
        return jsonify({"error": "Failed to generate report."}), 500


