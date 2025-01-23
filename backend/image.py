import streamlit as st
import google.generativeai as genai
import os
import json
from PIL import Image
from dotenv import find_dotenv, load_dotenv

load_dotenv(find_dotenv(), override=True)
gemini_api_key = os.getenv("GOOGLE_API_KEY")

if not gemini_api_key:
    st.error("GEMINI_API_KEY is not set in the environment variables.")
    st.stop()

genai.configure(api_key=gemini_api_key)
model = genai.GenerativeModel('gemini-1.5-flash')


import re

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

        # Log the raw response for debugging
        st.write("Raw Response from Gemini:", repr(raw_response))

        # Extract JSON using regex (to handle improperly formatted responses)
        json_match = re.search(r'\[\s*\{.*\}\s*\]', raw_response, re.DOTALL)
        if json_match:
            cleaned_json = json_match.group(0)  # Extract the JSON array
        else:
            st.error("Failed to extract JSON from the response. Please check the format.")
            return None

        # Try parsing the extracted JSON
        try:
            json_response = json.loads(cleaned_json)
            if isinstance(json_response, list):
                return json_response  # Valid JSON array
            else:
                st.error("The response should be an array of objects.")
                return None
        except json.JSONDecodeError as e:
            st.error(f"Error parsing JSON from the cleaned response: {e}")
            return None

    except Exception as e:
        st.error(f"Error analyzing image: {e}")
        return None


# Function to generate outfit combinations using Gemini
def generate_outfit_combinations(catalog):
    prompt = f"""Given the following clothing catalog, generate at least three distinct outfit combinations. Provide a short description for each outfit.

        Catalog: {catalog}
    """
    try:
        response = model.generate_content(prompt)
        return response.text
    except Exception as e:
        st.error(f"Error generating outfit combinations: {e}")
        return None

# Main Streamlit app
def main():
    st.title("Wardrobe Styling App")

    # Sidebar for navigation
    st.sidebar.title("Navigation")
    page = st.sidebar.radio("Go to", ["Dashboard", "Outfit Combinations"])

    # Dashboard page
    if page == "Dashboard":
        st.header("Wardrobe Dashboard")
        uploaded_image = st.file_uploader("Upload a wardrobe picture", type=["png", "jpg", "jpeg"])
        if uploaded_image:
            # Display the image
            st.image(uploaded_image, caption="Uploaded Wardrobe Image", use_column_width=True)

            # Analyze image
            with st.spinner("Analyzing Image..."):
                catalog = analyze_image(uploaded_image)
            if catalog:
                st.session_state.catalog = catalog
                st.subheader("Clothing Catalog:")
                st.json(catalog)
                st.success("Image Analysis Complete!")
            else:
                st.error("Could not get analysis, please try again.")

    # Outfit Combinations page
    elif page == "Outfit Combinations":
            st.header("Outfit Combinations")
            # This is a very basic example.
            # In a real application you should be using a persisted catalog from the dashboard
            # For this example we will use the same response from the dashboard page
            if 'catalog' in st.session_state:
                 catalog = st.session_state.catalog
                 st.write("Catalog: ", catalog) # Log the session catalog
                 # Generate outfit combinations
                 with st.spinner("Generating Outfit Combinations..."):
                     outfit_combinations = generate_outfit_combinations(catalog)
                 if outfit_combinations:
                    st.subheader("Outfit Suggestions:")
                    st.markdown(outfit_combinations)
                 else:
                     st.error("Could not generate outfit combinations")

            else:
               st.warning("Please upload an image in the dashboard page to generate outfit combinations.")

if __name__ == "__main__":
    main()