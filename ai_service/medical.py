import json
from langchain.chains import RetrievalQA
from langchain.prompts import PromptTemplate
from langchain_community.chat_models import ChatOllama
from langchain_pinecone import PineconeVectorStore
from langchain_community.embeddings import HuggingFaceEmbeddings
from pinecone import Pinecone
from dotenv import load_dotenv
import os
from flask import Flask, request, jsonify,Blueprint
from flask_cors import CORS


medical_blueprint = Blueprint('medical_blueprint', __name__)

# -------------------------------
# 1. Load config
# -------------------------------
with open("config.json") as f:
    cfg = json.load(f)

# -------------------------------
# 2. Setup Pinecone connection
# -------------------------------
load_dotenv()
PINECONE_API_KEY = os.getenv("PINECONE_API_KEY")
INDEX_NAME = os.getenv("INDEX_NAME")

# Initialize embeddings
embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")

# Connect to Pinecone
pc = Pinecone(api_key=PINECONE_API_KEY)
index = pc.Index(INDEX_NAME)

# Connect existing index to LangChain
docsearch = PineconeVectorStore(
    index=index,
    embedding=embeddings
)

# -------------------------------
# 3. Setup Ollama model
# -------------------------------
llm = ChatOllama(model=cfg["model"], temperature=cfg["temperature"])

# -------------------------------
# 4. Build prompt
# -------------------------------
prompt = PromptTemplate(
    template=cfg["prompt"],
    input_variables=["context", "question"]
)

# -------------------------------
# 5. Create QA Chain
# -------------------------------
qa_chain = RetrievalQA.from_chain_type(
    llm=llm,
    retriever=docsearch.as_retriever(search_kwargs={"k": cfg["retriever_k"]}),
    chain_type="stuff",
    return_source_documents=False,
    chain_type_kwargs={"prompt": prompt}
)

# app = Flask(__name__) 
# CORS(app)
@medical_blueprint.route("/", methods=["POST"])
# @app.route('/api/medical', methods=['POST'])
def medical_answer():
    try:
        data = request.get_json()
        question = data.get("question", "")
        if not question:
            return jsonify({"error": "Question missing"}), 400

        result = qa_chain.invoke({"query": question})
        return jsonify({"answer": result["result"]})
    except Exception as e:
        print("Error:", e)
        return jsonify({"error": str(e)}), 500

# if __name__ == "__main__":
#     print("🚀 Python Medical AI server running on http://localhost:8000")
#     app.run(host="0.0.0.0", port=8000)