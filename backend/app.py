from flask import Flask, request, jsonify
import os
from flask_cors import CORS

app = Flask(__name__)

CORS(app)

UPLOAD_FOLDER = './uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
IMAGE_PROMPT = ''

@app.route('/api/upload', methods=['POST'])
def upload_media():
    try:
        images = request.files.getlist("images")  
        # videos = request.files.getlist("videos")  

        for image in images:
            if image.filename:  
                image.save(os.path.join(app.config['UPLOAD_FOLDER'], image.filename))
                
        # for video in videos:
        #     if video.filename:  
        #         video.save(os.path.join(app.config['UPLOAD_FOLDER'], video.filename))

        image_prompt = request.form.get("imagePrompt")
        # video_prompt = request.form.get("videoPrompt")

        # Print or log for debugging
        print("Image Prompt:", image_prompt)
        IMAGE_PROMPT = image_prompt
        # print("Video Prompt:", video_prompt)

        return jsonify({"message": "Media and prompts uploaded successfully!"}), 200

    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": "Failed to upload media."}), 500



if __name__ == '__main__':
    app.run(debug=True)
