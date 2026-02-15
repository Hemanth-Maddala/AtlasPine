import os
from flask import Flask, request, jsonify, Blueprint
from flask_cors import CORS
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.embeddings import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS
from langchain.chains import RetrievalQA, LLMChain
from langchain.prompts import PromptTemplate
# --- CHANGED: Import Gemini instead of Ollama ---
from langchain_google_genai import ChatGoogleGenerativeAI 
from langchain_community.document_loaders import PyMuPDFLoader
from dotenv import load_dotenv

pdf_blueprint = Blueprint('pdf_blueprint', __name__)

# -----------------------------------
# Global variables
# -----------------------------------
# --- CHANGED: LLM Setup ---
load_dotenv()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
llm = ChatGoogleGenerativeAI(
    model="gemini-flash-lite-latest", 
    google_api_key=GEMINI_API_KEY,
    temperature=0.7
)

embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")
stored_chunks = None  # We'll reuse this between summarize and ask

# -----------------------------------
# Helpers
# -----------------------------------
def load_and_split_pdf(file_path):
    loader = PyMuPDFLoader(file_path)
    documents = loader.load()
    splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=100)
    chunks = splitter.split_documents(documents)
    return chunks

def summarize_pdf(file_path):
    chunks = load_and_split_pdf(file_path)
    pdf_text = " ".join([doc.page_content for doc in chunks])

    summary_prompt = PromptTemplate(
        input_variables=["text"],
        template=(
            "Summarize the following document text clearly and concisely.\n"
            "Focus on the key ideas and structure the summary properly.\n\n"
            "Text:\n{text}\n\nSummary:"
        ),
    )

    summary_chain = LLMChain(llm=llm, prompt=summary_prompt)
    # Using invoke instead of run (recommended for newer LangChain versions)
    summary = summary_chain.invoke({"text": pdf_text})["text"]
    return summary, chunks

def answer_question(chunks, question):
    library = FAISS.from_documents(chunks, embeddings)

    prompt_template = """
You are a helpful assistant. Use the following context to answer the user's question.
If you don't know the answer, say "Sorry, I could not find the answer in the document."

Context: {context}
Question: {question}

Answer:
"""
    prompt = PromptTemplate(template=prompt_template, input_variables=["context", "question"])

    qa_chain = RetrievalQA.from_chain_type(
        llm=llm,
        chain_type="stuff",
        retriever=library.as_retriever(),
        return_source_documents=False,
        chain_type_kwargs={"prompt": prompt}
    )

    return qa_chain.invoke(question)["result"]

# -----------------------------------
# ROUTE: /summarize
# -----------------------------------
@pdf_blueprint.route("/summarize", methods=["POST"])
def summarize_route():
    global stored_chunks
    if "pdf" not in request.files:
        return jsonify({"error": "No PDF uploaded"}), 400

    pdf_file = request.files["pdf"]
    save_path = os.path.join("uploads", pdf_file.filename)
    os.makedirs("uploads", exist_ok=True)
    pdf_file.save(save_path)

    print(f"📄 Received PDF: {save_path}")
    summary, chunks = summarize_pdf(save_path)

    stored_chunks = chunks  # ✅ Save for later Q&A
    return jsonify({"summary": summary})

# -----------------------------------
# ROUTE: /ask
# -----------------------------------
@pdf_blueprint.route("/ask", methods=["POST"])
def ask_route():
    global stored_chunks
    data = request.get_json()

    if not data or "question" not in data:
        return jsonify({"error": "Question not provided"}), 400
    if stored_chunks is None:
        return jsonify({"error": "No document summarized yet"}), 400

    question = data["question"]
    print("❓ User asked:", question)

    answer = answer_question(stored_chunks, question)
    return jsonify({"answer": answer})