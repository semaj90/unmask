#finalised integration of all 3 component
import streamlit.components.v1 as components
import streamlit as st 
from phi.agent import Agent
from phi.model.google import Gemini
from phi.tools.duckduckgo import DuckDuckGo
from google.generativeai import upload_file, get_file
import google.generativeai as genai
from PyPDF2 import PdfReader
import time
from pathlib import Path
import tempfile
from dotenv import load_dotenv
load_dotenv()
import os
import webbrowser


from pymongo import MongoClient
import google.generativeai as genai
from typing import Tuple, List, Optional, Dict
import logging
from datetime import datetime

# Configure API
API_KEY=os.getenv("GOOGLE_API_KEY")
if API_KEY:
    genai.configure(api_key=API_KEY)

def redirect_button(url: str, text: str = "📎 Visit Lawyer Profile", new_tab: bool = True):
    js = f"""
        <script>
            function redirect() {{
                {'window.open("' + url + '", "_blank");' if new_tab else 'window.location.href = "' + url + '";'}
            }}
        </script>
        <style>
            .redirect-btn {{
                background-color: #007BFF;
                color: white;
                font-size: 16px;
                padding: 10px 20px;
                width: 100%;
                border: none;
                border-radius: 8px;
                cursor: pointer;
                transition: background-color 0.3s;
            }}
            .redirect-btn:hover {{
                background-color: #0056b3;
            }}
        </style>
        <button class="redirect-btn" onclick="redirect()">{text}</button>
    """
    st.components.v1.html(js, height=60)

# Page configuration
st.set_page_config(
    page_title="AI Content Analyzer",
    page_icon="🤖",
    layout="wide"
)

# Enhanced Custom CSS for dark theme
st.markdown("""
    <style>
    /* Center align headers */
    h1, h2, h3 {
        text-align: center !important;
    }

    /* Gradient border animation */
    @keyframes borderGlow {
        0% { border-color: rgba(255,255,255,0.2); }
        50% { border-color: rgba(255,255,255,0.5); }
        100% { border-color: rgba(255,255,255,0.2); }
    }

    /* Card styling */
    .stCard {
        border-radius: 15px;
        padding: 20px;
        margin: 15px 0;
        background-color: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.1);
        backdrop-filter: blur(10px);
        transition: all 0.3s ease;
    }
    .stCard:hover {
        transform: translateY(-5px);
        background-color: rgba(255, 255, 255, 0.08);
    }

    /* Tool cards */
    .tool-card {
        padding: 25px;
        border-radius: 15px;
        margin: 20px 0;
        background-color: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.1);
        animation: borderGlow 2s infinite;
    }

    /* Button styling */
    .stButton>button {
        width: 100%;
        border-radius: 25px;
        padding: 10px 25px;
        background-color: rgba(255, 255, 255, 0.1);
        border: 1px solid rgba(255, 255, 255, 0.2);
        transition: all 0.3s ease;
    }
    .stButton>button:hover {
        background-color: rgba(255, 255, 255, 0.15);
        border-color: rgba(255, 255, 255, 0.3);
    }

    /* File uploader styling */
    .uploadedFile {
        border: 2px dashed rgba(255, 255, 255, 0.2);
        border-radius: 15px;
        padding: 20px;
        text-align: center;
    }

    /* Text area styling */
    .stTextArea textarea {
        border-radius: 15px;
        padding: 15px;
        font-size: 16px;
        background-color: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.1);
        min-height: 120px;
    }

    /* About section styling */
    .about-section {
        padding: 30px;
        border-radius: 15px;
        background-color: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.1);
        text-align: center;
    }

    /* Social links styling */
    .social-links {
        display: flex;
        justify-content: center;
        gap: 20px;
        margin: 20px 0;
    }
    .social-links a {
        transition: transform 0.3s ease;
    }
    .social-links a:hover {
        transform: translateY(-3px);
    }

    /* Success message styling */
    .success-message {
        padding: 15px;
        border-radius: 10px;
        margin: 15px 0;
        background-color: rgba(25, 135, 84, 0.2);
        border: 1px solid rgba(25, 135, 84, 0.3);
        text-align: center;
    }

    /* Warning message styling */
    .warning-message {
        padding: 15px;
        border-radius: 10px;
        margin: 15px 0;
        background-color: rgba(255, 193, 7, 0.2);
        border: 1px solid rgba(255, 193, 7, 0.3);
        text-align: center;
    }

    /* Error message styling */
    .error-message {
        padding: 15px;
        border-radius: 10px;
        margin: 15px 0;
        background-color: rgba(220, 53, 69, 0.2);
        border: 1px solid rgba(220, 53, 69, 0.3);
        text-align: center;
    }

    /* Centered container */
    .centered-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        margin: 20px 0;
    }

    /* Skill tags */
    .skill-tag {
        display: inline-block;
        padding: 8px 15px;
        margin: 5px;
        border-radius: 20px;
        background-color: rgba(255, 255, 255, 0.1);
        border: 1px solid rgba(255, 255, 255, 0.2);
    }
    </style>
""", unsafe_allow_html=True)

# Initialize agents
@st.cache_resource
def initialize_video_agent():
    return Agent(
        name="Video AI Analyzer",
        model=Gemini(id="gemini-2.0-flash-exp"),
        tools=[DuckDuckGo()],
        markdown=True,
    )

@st.cache_resource
def initialize_document_agent():
    return Agent(
        name="Document AI Analyzer",
        model=Gemini(id="gemini-2.0-flash-exp"),
        tools=[DuckDuckGo()],
        markdown=True,
    )

# Main title with centered container
st.markdown("""
    <div class="centered-container">
        <h1>🤖 Legal AI Assistant</h1>
        <p style="font-size: 1.2em; opacity: 0.8;">Powered by Tech Janta Party</p>
    </div>
""", unsafe_allow_html=True)

# Navigation
selected_bot = st.sidebar.radio(
    "Choose Your Analysis Tool",
    ["Home", "Legal Video Analyzer", "Legal Document Analyzer", "Lawyer Matching"]
)

if selected_bot == "Home":
    st.markdown("""
    <div class="centered-container">
        <h2>Welcome to Legal AI Assistant! 🚀</h2>
        <p style="font-size: 1.2em; margin-bottom: 30px;">Your all-in-one solution for intelligent legal content analysis and assistance</p>
    </div>
    """, unsafe_allow_html=True)
    
    col1, col2, col3= st.columns(3)
    
    with col1:
        st.markdown("""
        <div class='tool-card'>
            <h3>🎥Legal Video Analyzer</h3>
            <ul style="list-style-type: none; padding: 0;">
                <li style="margin: 10px 0;">✨ Upload and analyze video content</li>
                <li style="margin: 10px 0;">📊 Get detailed insights and summaries</li>
                <li style="margin: 10px 0;">❓ Ask questions about video content</li>
            </ul>
        </div>
        """, unsafe_allow_html=True)
    
    with col2:
        st.markdown("""
        <div class='tool-card'>
            <h3>📄Legal Document Analyzer</h3>
            <ul style="list-style-type: none; padding: 0;">
                <li style="margin: 10px 0;">📑 Process PDF and TXT documents</li>
                <li style="margin: 10px 0;">🔍 Extract key information</li>
                <li style="margin: 10px 0;">📈 Get comprehensive analysis</li>
            </ul>
        </div>
        """, unsafe_allow_html=True)

    with col3:
        st.markdown("""
        <div class='tool-card'>
            <h3>📄Lawyer Matching</h3>
            <ul style="list-style-type: none; padding: 0;">
                <li style="margin: 10px 0;">📑 Process your case-specific Lawyers</li>
                <li style="margin: 10px 0;">🔍 Extract key information</li>
                <li style="margin: 10px 0;">📈 Get reasoning for your suggested Lawyer</li>
            </ul>
        </div>
        """, unsafe_allow_html=True)

elif selected_bot == "Legal Video Analyzer":
    st.markdown("<h2 style='text-align: center;'>Legal Video Content Analyzer 🎥</h2>", unsafe_allow_html=True)
    multimodal_Agent = initialize_video_agent()
    
    with st.container():
        video_file = st.file_uploader(
            "Upload a video file", type=['mp4', 'mov', 'avi'], 
            help="Upload a video for AI analysis"
        )

        if video_file:
            with tempfile.NamedTemporaryFile(delete=False, suffix='.mp4') as temp_video:
                temp_video.write(video_file.read())
                video_path = temp_video.name

            st.video(video_path, format="video/mp4", start_time=0)

            user_query = st.text_area(
                "What insights are you seeking from the video?",
                placeholder="Ask anything about the video content. The AI agent will analyze and gather additional context if needed.",
                help="Provide specific questions or insights you want from the video."
            )

            if st.button("🔍 Analyze Video", key="analyze_video_button"):
                if not user_query:
                    st.markdown('<div class="warning-message">Please enter a question or insight to analyze the video.</div>', unsafe_allow_html=True)
                else:
                    try:
                        with st.spinner("🔄 Processing video and gathering insights..."):
                            processed_video = upload_file(video_path)
                            while processed_video.state.name == "PROCESSING":
                                time.sleep(1)
                                processed_video = get_file(processed_video.name)

                            analysis_prompt = (
                                f"""
                                You are a Legal Assistant expert in analyzing legal cases.
                                Analyze the uploaded video for content and context.
                                Respond to the following query using video insights and supplementary web research:
                                {user_query}

                                Provide a detailed, user-friendly, and actionable response.
                                """
                            )

                            response = multimodal_Agent.run(analysis_prompt, videos=[processed_video])

                        st.markdown('<div class="success-message">✅ Analysis completed successfully!</div>', unsafe_allow_html=True)
                        st.markdown("<h3 style='text-align: center;'>Analysis Result</h3>", unsafe_allow_html=True)
                        st.markdown(response.content)

                    except Exception as error:
                        st.markdown(f'<div class="error-message">❌ An error occurred during analysis: {error}</div>', unsafe_allow_html=True)
                    finally:
                        Path(video_path).unlink(missing_ok=True)

elif selected_bot == "Legal Document Analyzer":
    st.markdown("<h2 style='text-align: center;'>Legal Document Content Analyzer 📄</h2>", unsafe_allow_html=True)
    multimodal_Agent = initialize_document_agent()
    
    with st.container():
        document_file = st.file_uploader(
            "Upload a document file", type=['pdf', 'txt'], 
            help="Upload a document for AI analysis"
        )

        if document_file is not None:
            try:
                if document_file.type == "application/pdf":
                    pdf_reader = PdfReader(document_file)
                    document_text = ""
                    for page in pdf_reader.pages:
                        document_text += page.extract_text()
                else:
                    document_text = document_file.getvalue().decode('utf-8')

                user_query = st.text_area(
                    "What insights are you seeking from the document?",
                    placeholder="Ask anything about the document content. The AI agent will analyze and gather additional context if needed.",
                    help="Provide specific questions or insights you want from the document."
                )

                if st.button("🔍 Analyze Document", key="analyze_document_button"):
                    if not user_query:
                        st.markdown('<div class="warning-message">Please enter a question or insight to analyze the document.</div>', unsafe_allow_html=True)
                    else:
                        try:
                            with st.spinner("🔄 Processing document and gathering insights..."):
                                analysis_prompt = f"""
                                You are an expert legal assistant 
                                Here is the document content:
                                {document_text}

                                Based on the above document content, please answer the following question:
                                {user_query}

                                Provide a detailed, well-structured response using only the information from the document 
                                and relevant web research when necessary. 

                                Structure your response as:
                                Background: Give a few line introduction of the parties involved (if present in the document, else skip)
                                Key Legal Issues: Mention the specific type to which the case belongs and few allegations 
                                Response: Here respond to the user's question in this section
                                Suggestions: Provide some general suggestions on the specific case 

                                Make sure to cite specific parts of the document in your response. 
                                """

                                response = multimodal_Agent.run(
                                    analysis_prompt,
                                    context={"document_content": document_text}
                                )

                                st.markdown('<div class="success-message">✅ Analysis completed successfully!</div>', unsafe_allow_html=True)
                                st.markdown("<h3 style='text-align: center;'>Analysis Result</h3>", unsafe_allow_html=True)
                                st.markdown(response.content)

                        except Exception as error:
                            st.markdown(f'<div class="error-message">❌ An error occurred during analysis: {str(error)}</div>', unsafe_allow_html=True)

            except Exception as error:
                st.markdown(f'<div class="error-message">❌ Error processing document: {str(error)}</div>', unsafe_allow_html=True)
                st.markdown('<div class="error-message">Please make sure you\'ve uploaded a valid document file.</div>', unsafe_allow_html=True)

elif selected_bot == "Lawyer Matching":
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
            self.model = genai.GenerativeModel("gemini-pro")
            
            # Initialize MongoDB connection
            try:
                self.client = MongoClient(mongo_uri)
                self.db = self.client["Lawyers"]
                self.collection = self.db["lawyers"]
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
        # st.set_page_config(
        #     page_title="Legal Case Lawyer Matcher",
        #     page_icon="⚖️",
        #     layout="wide"
        # )

        #st.markdown("<h2 style='text-align: center;'>Legal Case Lawyer Matcher ⚖️</h2>", unsafe_allow_html=True)

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
                height: 340px;
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
                    <li>State any specific requirements</li>
                    <li>Mention jurisdiction if relevant</li>
                </ul>
            </div>
            """, unsafe_allow_html=True)

        # Initialize LawyerMatcher
        matcher = LawyerMatcher(
            #mongo_uri="mongodb+srv://rbose7997:1S1tF7Dwzy45BKsK@cluster0.fntvc.mongodb.net/Lawyers",
            #gemini_api_key="AIzaSyC9Ew_EAHvht5L55N5tyTr5pNRR6jEYRL4"
            mongo_uri=os.getenv("MONGO_URI"),
            gemini_api_key=os.getenv("GOOGLE_API_KEY"),
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

                    # if result["image_uri"]:
                    #     st.image(result["image_uri"], caption=f"{result['name']}", width=250)

                    if result and "image_uri" in result and result["image_uri"]:
                        st.image(result["image_uri"], caption=f"{result['name']}", width=250)

                    
                    # Contact button

                    if "redirect" not in st.session_state:
                        st.session_state["redirect"] = False

                    col1, col2, col3 = st.columns([1, 2, 1])
                    #redirecting button
                    with col2:
                        redirect_button(
                                url=f"https://lawyer-hub-tau.vercel.app/lawyer/{result["id"]}",
                        )

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