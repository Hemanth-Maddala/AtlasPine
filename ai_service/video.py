# import os
# from youtube_transcript_api import YouTubeTranscriptApi
# from langchain_google_genai import ChatGoogleGenerativeAI 
# from langchain.prompts import PromptTemplate
# from langchain.chains import LLMChain
# from flask import Blueprint, request, jsonify
# from dotenv import load_dotenv

# # Load environment variables
# load_dotenv()

# # Match your working code's instance setup
# ytt_api = YouTubeTranscriptApi()

# video_blueprint = Blueprint('video_blueprint', __name__)

# # --- LLM CHANGE: Ollama to Gemini ---
# llm = ChatGoogleGenerativeAI(
#     model="gemini-flash-lite-latest", 
#     google_api_key=os.getenv("GEMINI_API_KEY"),
#     temperature=0.7,
#     transport="rest"  # Fixed transport for your environment
# )

# summary_prompt = PromptTemplate(
#     input_variables=["text"],
#     template=(
#         "you are a Youtube video summarization expert. you will be given the transcript of a youtube video. "
#         "generate a concise and informative summary of the video in a great detail.\n\n"
#         "Text:\n{text}\n\nSummary:"
#     ),
# )

# summary_chain = LLMChain(llm=llm, prompt=summary_prompt)

# def summarize_youtube_video(video_url):
#     # Safely extract Video ID
#     video_id = video_url.split("v=")[1].split("&")[0]

#     # --- Reverted to your EXACT working logic ---
#     transcript = ytt_api.fetch(video_id)
#     transcript_text = " ".join(entry.text for entry in transcript)
    
#     # Run the chain
#     summary = summary_chain.run({"text": transcript_text})
#     return summary

# @video_blueprint.route('/summarize_video', methods=['POST'])
# def summarize_video_endpoint():
#     data = request.get_json()
#     video_url = data.get('video_url')
    
#     if not video_url:
#         return jsonify({"error": "video_url is required"}), 400
        
#     try:
#         summary = summarize_youtube_video(video_url)
#         return jsonify({"summary": summary})
#     except Exception as e:
#         print(f"❌ Error: {str(e)}")
#         return jsonify({"error": str(e)}), 500



import os
import re
from youtube_transcript_api import YouTubeTranscriptApi
from langchain_google_genai import ChatGoogleGenerativeAI 
from langchain.prompts import PromptTemplate
from flask import Blueprint, request, jsonify
from dotenv import load_dotenv

load_dotenv()

video_blueprint = Blueprint('video_blueprint', __name__)

# Use gemini-1.5-flash (more stable/faster)
llm = ChatGoogleGenerativeAI(
    model="gemini-1.5-flash", 
    google_api_key=os.getenv("GEMINI_API_KEY"),
    temperature=0.7,
    transport="rest"
)

def extract_video_id(url):
    """Extracts ID from watch links, shorts, or mobile links."""
    pattern = r'(?:v=|\/)([0-9A-Za-z_-]{11}).*'
    match = re.search(pattern, url)
    return match.group(1) if match else None

def summarize_youtube_video(video_url):
    video_id = extract_video_id(video_url)
    if not video_id:
        raise ValueError("Invalid YouTube URL")

    try:
        print(f"🎬 Fetching transcript for: {video_id}")
        # CORRECT METHOD: Use the class directly
        transcript = YouTubeTranscriptApi.get_transcript(video_id, languages=['en'])
        
        # CORRECT ACCESS: transcript is a list of dicts, use entry['text']
        transcript_text = " ".join(entry['text'] for entry in transcript)[:12000]
        print("✅ Transcript fetched successfully")

        template = (
            "You are a Youtube video summarization expert. Generate a concise and "
            "informative summary based on this transcript:\n\n{text}\n\nSummary:"
        )
        prompt = PromptTemplate(input_variables=["text"], template=template)
        
        # Newer LangChain syntax
        chain = prompt | llm
        response = chain.invoke({"text": transcript_text})
        
        return response.content

    except Exception as e:
        print(f"❌ YouTube API Error: {str(e)}")
        # If YouTube blocks the IP, this is where it fails
        raise Exception(f"YouTube Blocked or No Transcript: {str(e)}")

@video_blueprint.route('/summarize_video', methods=['POST'])
def summarize_video_endpoint():
    data = request.get_json()
    video_url = data.get('video_url')
    
    if not video_url:
        return jsonify({"error": "video_url is required"}), 400
        
    try:
        summary = summarize_youtube_video(video_url)
        return jsonify({"summary": summary})
    except Exception as e:
        return jsonify({"error": str(e)}), 500