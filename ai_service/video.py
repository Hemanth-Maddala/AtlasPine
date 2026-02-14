from youtube_transcript_api import YouTubeTranscriptApi
from langchain_community.chat_models import ChatOllama
from langchain.prompts import PromptTemplate
from langchain.chains import LLMChain
from flask import Flask,Blueprint, request, jsonify
ytt_api = YouTubeTranscriptApi()

video_blueprint = Blueprint('video_blueprint', __name__)

llm = ChatOllama(model="llama3", temperature=0.7)
summary_prompt = PromptTemplate(
    input_variables=["text"],
    template=(
        "you are a Youtube video summarization expert. you will be given the transcript of a youtube video. "
        "generate a concise and informative summary of the video in a great detail.\n\n"
        "Text:\n{text}\n\nSummary:"
    ),
)
summary_chain = LLMChain(llm=llm, prompt=summary_prompt)

def summarize_youtube_video(video_url):
    video_id = video_url.split("v=")[1]
    transcript = ytt_api.fetch(video_id)
    transcript_text = " ".join(entry.text for entry in transcript)
    summary = summary_chain.run({"text": transcript_text})
    return summary

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