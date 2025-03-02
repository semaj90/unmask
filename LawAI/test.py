# Lawyer matching Final

import streamlit as st
from pymongo import MongoClient
import google.generativeai as genai
from typing import Tuple, List, Optional, Dict
import logging
from datetime import datetime

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class LawyerMatcher:
    def __init__(self, mongo_uri: str, gemini_api_key: str):
        """Initialize LawyerMatcher with database and API configurations."""
        self.mongo_uri = mongo_uri
        self.gemini_api_key = gemini_api_key

        # Configure Gemini
        genai.configure(api_key=gemini_api_key)
        self.model = genai.GenerativeModel("gemini-2.0-flash")

        # Initialize MongoDB connection
        try:
            self.client = MongoClient(mongo_uri)
            self.db = self.client["Lawyers"]
            self.collection = self.db["Lawyers_info"]
            logger.info("Successfully connected to MongoDB")
        except Exception as e:
            logger.error(f"MongoDB connection error: {e}")
            st.error("Failed to connect to database. Please check connection settings.")

    def get_lawyers(self) -> List[Dict]:
        """Fetch all lawyers from the database."""
        try:
            return list(self.collection.find({}))
        except Exception as e:
            logger.error(f"Error fetching lawyers: {e}")
            return []

    def format_lawyer_data(self, lawyers: List[Dict]) -> str:
        """Format lawyer data for the AI prompt."""
        return "\n".join([
            f"Lawyer {i+1}:\n"
            f"Name: {lawyer['name']}\n"
            f"Experience: {lawyer['experience']} years\n"
            f"Expertise: {lawyer['description']}\n"
            f"Rating: {lawyer['user_rating']}\n"
            for i, lawyer in enumerate(lawyers)
        ])

    def generate_ai_prompt(self, case_description: str, lawyers_text: str) -> str:
        """Generate the prompt for the AI model."""
        return f"""
        Task: As a legal consultant, analyze the case description and recommend the most suitable lawyer from the available options.

        Case Description:
        {case_description}

        Available Lawyers:
        {lawyers_text}

        Please provide:
        1. The name of the most suitable lawyer
        2. A brief but specific explanation (2-3 sentences) of why this lawyer is the best match for this case
        3. Start your response with "Recommended Lawyer:" followed by the name, then "Reasoning:" followed by your explanation

        Base your recommendation on:
        - Relevant expertise for the specific case type
        - Years of experience
        - Track record and rating
        - Match between lawyer's specialization and case requirements
        """

    def find_best_lawyer(self, case_description: str) -> Tuple[Optional[Dict], Optional[str]]:
        """Find the best lawyer match for the case description."""
        try:
            lawyers = self.get_lawyers()
            if not lawyers:
                return None, "No lawyers found in the database."

            lawyers_text = self.format_lawyer_data(lawyers)
            prompt = self.generate_ai_prompt(case_description, lawyers_text)

            response = self.model.generate_content(prompt)
            if not response.text.strip():
                return None, "Error: Received an empty response from AI model."

            # Process the response and find the lawyer
            response_text = response.text.strip()
            recommended_lawyer_name = response_text.split("Recommended Lawyer:")[1].split("Reasoning:")[0].strip()
            reasoning = response_text.split("Reasoning:")[1].strip()

            # Find the lawyer's full details from the database
            lawyer_doc = self.collection.find_one({"name": recommended_lawyer_name})

            if not lawyer_doc:
                return None, "Could not find the recommended lawyer in the database."

            result = {
                "name": lawyer_doc["name"],
                "experience": lawyer_doc["experience"],
                "description": lawyer_doc["description"],
                "rating": lawyer_doc["user_rating"],
                "reasoning": reasoning,
                "id": str(lawyer_doc["_id"])
            }

            return result, None

        except Exception as e:
            logger.error(f"Error in find_best_lawyer: {e}")
            return None, f"An error occurred: {str(e)}"

def main():
    # Configure the page with dark theme
    st.set_page_config(
        page_title="Legal Case Lawyer Matcher",
        page_icon="⚖️",
        layout="wide"
    )

    # Dark theme CSS
    st.markdown("""
        <style>
        /* Global styles */
        .stApp {
            background-color: #1a1a1a;
            color: #ffffff;
        }
        
        /* Text area styling */
        .stTextArea textarea {
            background-color: #2d2d2d !important;
            color: #ffffff !important;
            border: 1px solid #3d3d3d !important;
            border-radius: 10px;
            height: 200px;
        }
        
        /* Recommendation box */
        .recommendation-box {
            background-color: #2d2d2d;
            padding: 25px;
            border-radius: 10px;
            border: 1px solid #3d3d3d;
            margin: 20px 0;
            color: #ffffff;
        }
        
        /* Lawyer name */
        .lawyer-name {
            color: #4CAF50;
            font-size: 1.4em;
            font-weight: bold;
            margin-bottom: 15px;
        }
        
        /* Stats section */
        .lawyer-stats {
            display: flex;
            gap: 20px;
            margin: 15px 0;
            color: #b3b3b3;
            font-size: 1.1em;
        }
        
        /* Sections */
        .expertise-section, .reasoning-section {
            color: #e0e0e0;
            line-height: 1.6;
            margin: 15px 0;
        }
        
        .reasoning-section {
            border-top: 1px solid #3d3d3d;
            padding-top: 20px;
            margin-top: 20px;
        }
        
        /* Tips section */
        .tips-section {
            background-color: #2d2d2d;
            padding: 20px;
            border-radius: 10px;
            margin-top: 20px;
            border: 1px solid #3d3d3d;
        }
        
        /* Buttons */
        .stButton button {
            background-color: #ff4b4b !important;
            color: white !important;
            border: none !important;
            padding: 10px 20px !important;
            font-size: 1.1em !important;
            width: 100%;
        }
        
        /* Headers */
        h1, h2, h3 {
            color: #ffffff !important;
        }
        
        /* Timestamp */
        .timestamp {
            color: #888888;
            font-size: 0.8em;
            text-align: center;
            margin-top: 20px;
        }
        </style>
    """, unsafe_allow_html=True)

    # App header with icon
    st.markdown("# ⚖️ Legal Case Lawyer Matcher")
    st.markdown("## Find the Right Lawyer for Your Case")

    # Create columns for layout
    col1, col2 = st.columns([3, 1])

    with col1:
        case_description = st.text_area(
            "Case Description",
            placeholder="Please provide a detailed description of your legal case...",
            help="Include relevant details about your case for better lawyer matching"
        )

    with col2:
        st.markdown("""
        <div class="tips-section">
            <h3>💡 Tips for Better Matching</h3>
            <ul>
                <li>Describe your legal issue clearly</li>
                <li>Mention specific legal domains</li>
                <li>Include relevant timeframes</li>
                <li>State any specific requirements</li>
                <li>Mention jurisdiction if relevant</li>
            </ul>
        </div>
        """, unsafe_allow_html=True)

    # Initialize LawyerMatcher
    matcher = LawyerMatcher(
        mongo_uri="mongodb+srv://rbose7997:1S1tF7Dwzy45BKsK@cluster0.fntvc.mongodb.net/Lawyers",
        gemini_api_key="AIzaSyC9Ew_EAHvht5L55N5tyTr5pNRR6jEYRL4"
    )

    if st.button("🔍 Find Best Lawyer Match", type="primary", key="search_button"):
        if len(case_description.strip()) < 20:
            st.warning("⚠️ Please provide a more detailed case description (at least 20 characters)")
            return

        with st.spinner("🔄 Analyzing your case and finding the best match..."):
            result, error = matcher.find_best_lawyer(case_description)
            
            if result:
                st.markdown("### 🎯 Lawyer Recommendation")
                
                # Display recommendation in a structured format
                st.markdown(f"""
                <div class="recommendation-box">
                    <div class="lawyer-name">👨‍⚖️ {result['name']}</div>
                    <div class="lawyer-stats">
                        <span>✨ {result['experience']} years experience</span>
                        <span>⭐ {result['rating']} rating</span>
                    </div>
                    <div class="expertise-section">
                        <strong>Expertise & Background:</strong><br/>
                        {result['description']}
                    </div>
                    <div class="reasoning-section">
                        <strong>Why This Lawyer Matches Your Case:</strong><br/>
                        {result['reasoning']}
                    </div>
                </div>
                """, unsafe_allow_html=True)
                
                # Contact button
                col1, col2, col3 = st.columns([1, 2, 1])
                with col2:
                    if st.button("📞 Contact Lawyer", key="contact_lawyer", use_container_width=True):
                        redirect_url = f"dummy/{result['id']}"
                        st.markdown(f'<meta http-equiv="refresh" content="0;url={redirect_url}">', unsafe_allow_html=True)
                
                # Add timestamp
                st.markdown(f"""
                <div class="timestamp">
                    Analysis completed at {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
                </div>
                """, unsafe_allow_html=True)
            else:
                st.error(f"❌ {error or 'Could not find a matching lawyer.'}")

if __name__ == "__main__":
    main()
