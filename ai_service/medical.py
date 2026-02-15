import json
import os
from dotenv import load_dotenv
from flask import request, jsonify, Blueprint

# Modern LangChain imports
from langchain.chains import RetrievalQA
from langchain.prompts import PromptTemplate
from langchain_google_genai import ChatGoogleGenerativeAI 
from langchain_pinecone import PineconeVectorStore
from langchain_huggingface import HuggingFaceEmbeddings 
from pinecone import Pinecone

# 1. Initialize Blueprint
medical_blueprint = Blueprint('medical_blueprint', __name__)

# 2. Load Environment Variables
load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
with open("config.json") as f:
    cfg = json.load(f)

# -------------------------------
# 3. Setup Pinecone and Embeddings
# -------------------------------
embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")

pc = Pinecone(api_key=os.getenv("PINECONE_API_KEY"))
index = pc.Index(os.getenv("INDEX_NAME"))

docsearch = PineconeVectorStore(
    index=index,
    embedding=embeddings
)

# -------------------------------
# 4. Setup Gemini LLM (CRITICAL FIX HERE)
# -------------------------------
llm = ChatGoogleGenerativeAI(
    model="gemini-flash-lite-latest", 
    google_api_key=GEMINI_API_KEY,
    temperature=cfg.get("temperature", 0.7),
    transport="rest", 
    client_options=None 
)

# -------------------------------
# 5. Build prompt and Chain
# -------------------------------
prompt = PromptTemplate(
    template=cfg["prompt"],
    input_variables=["context", "question"]
)

qa_chain = RetrievalQA.from_chain_type(
    llm=llm,
    retriever=docsearch.as_retriever(search_kwargs={"k": cfg["retriever_k"]}),
    chain_type="stuff",
    return_source_documents=False,
    chain_type_kwargs={"prompt": prompt}
)

# -------------------------------
# 6. API Route
# -------------------------------
@medical_blueprint.route("", methods=["POST"])
def medical_answer():
    try:
        data = request.get_json()
        question = data.get("question", "")
        
        if not question:
            return jsonify({"error": "Question missing"}), 400

        print(f"🔹 Processing medical question: {question}")
        
        # Execute chain using invoke
        result = qa_chain.invoke({"query": question})
        
        return jsonify({"answer": result["result"]})

    except Exception as e:
        print(f"❌ Error in medical route: {str(e)}")
        return jsonify({"error": str(e)}), 500