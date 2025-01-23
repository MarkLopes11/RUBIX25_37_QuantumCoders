import streamlit as st
import google.generativeai as genai
import os
from dotenv import find_dotenv, load_dotenv

load_dotenv(find_dotenv(), override=True)
gemini_api_key = os.getenv("GOOGLE_API_KEY")


if not gemini_api_key:
    st.error("GEMINI_API_KEY is not set in the environment variables.")
    st.stop()

genai.configure(api_key=gemini_api_key)
model = genai.GenerativeModel('gemini-pro')


# Function to analyze image (static response for now)
def analyze_image(image):
   
    return {
        "description": "A woman wearing a purple dress with a black belt and black shoes standing in front of a yellow wall.",
        "category": "Fashion",
        "colors": ["purple"],
        "style": "Formal",
        "gender_type": "Female",
        "suitable_weather": "Indoor",
        "material": "Cotton",
        "style_details": ["Belt", "Sleeveless"],
        "occasion": "Wedding",
        "design_elements": ["Belt"]
    }

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

            # Analyze image (static response)
            with st.spinner("Analyzing Image..."):
                catalog = analyze_image(uploaded_image)

            st.subheader("Clothing Catalog:")
            st.json(catalog)

            st.success("Image Analysis Complete!")


    # Outfit Combinations page
    elif page == "Outfit Combinations":
            st.header("Outfit Combinations")
            # This is a very basic example.
            # In a real application you should be using a persisted catalog from the dashboard
            # For this example we will use the same response from the dashboard page
            catalog = {
                "description": "A woman wearing a purple dress with a black belt and black shoes standing in front of a yellow wall.",
                "category": "Fashion",
                "colors": ["purple"],
                "style": "Formal",
                "gender_type": "Female",
                "suitable_weather": "Indoor",
                "material": "Cotton",
                "style_details": ["Belt", "Sleeveless"],
                "occasion": "Wedding",
                "design_elements": ["Belt"]
                }
            # Generate outfit combinations
            with st.spinner("Generating Outfit Combinations..."):
                outfit_combinations = generate_outfit_combinations(catalog)
            if outfit_combinations:
                st.subheader("Outfit Suggestions:")
                st.markdown(outfit_combinations)



if __name__ == "__main__":
    main()