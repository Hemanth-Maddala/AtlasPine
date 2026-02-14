import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import pdf from '../assets/document.png'

export default function PdfQA() {
  const token = localStorage.getItem("token");

  const [pdfFile, setPdfFile] = useState(null);
  const [summary, setSummary] = useState("");
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [conversation, setConversation] = useState([]);

  const API = import.meta.env.VITE_API_URL || "http://localhost:5000";


  // Step 1️⃣: Summarize PDF
  const handleSummarize = async () => {
    if (!pdfFile) return toast.error("Please select a PDF first!");

    setIsSummarizing(true);
    setSummary("");
    setConversation([]);

    if (summary.length <= 0) {
      toast.info("Meditating daily a minute can reduce stress and improve focus! and u can start it from now 😉",
        {
          autoClose: false, 
          closeOnClick: true, 
          pauseOnHover: true, 
        }
      );
    }

    try {
      const formData = new FormData();
      formData.append("pdf", pdfFile);

      console.log("Uploading PDF for summarization:", formData.get("pdf").name);
      console.log("Using token:", token);

      const res = await fetch(`${API}/api/summarize`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await res.json();
      setIsSummarizing(false);

      if (!res.ok) {
        toast.error(data.error || "Failed to summarize PDF");
        return;
      }

      setSummary(data.summary);
      toast.success("✅ PDF summarized successfully!");
    } catch (err) {
      console.error("Error during summarization:", err);
      setIsSummarizing(false);
      toast.error("Network error while summarizing PDF");
    }
  };

  // Step 2️⃣: Ask Question
  const handleAsk = async (e) => {
    e.preventDefault();
    if (!summary) return toast.error("Please summarize the PDF first!");
    if (!question.trim()) return toast.error("Please enter a question!");

    setLoading(true);
    const currentQuestion = question.trim();

    try {
      const res = await fetch("http://localhost:5000/api/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ question: currentQuestion }),
      });

      const data = await res.json();
      setLoading(false);

      if (!res.ok) {
        toast.error(data.error || "Failed to get answer");
        return;
      }

      // Add Q&A to conversation history
      setConversation(prev => [...prev, {
        question: currentQuestion,
        answer: data.answer,
        timestamp: new Date().toLocaleTimeString()
      }]);

      setQuestion("");
    } catch (err) {
      console.error("Error while asking question:", err);
      setLoading(false);
      toast.error("Network error while asking the question");
    }
  };
  // 📘
  return (
    <div className="p-6 md:p-10 h-screen overflow-hidden">
      <div className="max-w-6xl mx-auto bg-slate-800/90 rounded-xl shadow-lg p-4 sm:p-6 lg:p-8 min-h-[70vh] max-h-[85vh] sm:max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-semibold text-cyan-600 mb-6" style={{textShadow: "2px 3px 4px #000"}}>
          <img className="inline-block w-8 h-7 mr-2" src={pdf} alt="PDF Icon" />
          PDF Q&A Assistant
        </h2>

        {/* Top: Upload & Summary */}
        <div className="space-y-6">
          <div className="bg-slate-700 rounded-lg p-6">
            <h3 className="text-lg font-medium text-white mb-4" style={{ textShadow: "2px 3px 4px #000" }}>
              <img className="inline-block w-8 h-7 mr-2" src={pdf} alt="PDF Icon" /> Upload & Summarize PDF
            </h3>

            <div className="space-y-4">
              <input
                type="file"
                accept="application/pdf"
                onChange={(e) => setPdfFile(e.target.files[0])}
                disabled={isSummarizing || loading}
                className="block w-full px-4 py-2 rounded-lg bg-slate-900 text-slate-200 border border-slate-600 cursor-pointer"
              />

              <button
                type="button"
                onClick={handleSummarize}
                disabled={!pdfFile || isSummarizing}
                className={`w-full px-4 py-2 rounded-md shadow text-white transition-colors ${isSummarizing
                    ? "bg-slate-600 cursor-not-allowed"
                    : "bg-cyan-700 hover:bg-cyan-600"
                  }`}
              >
                {isSummarizing ? "Summarizing..." : "Summarize PDF"}
              </button>

              {summary && (
                <div className="mt-4 p-4 bg-slate-800 rounded-lg text-slate-200 shadow">
                  <span className="font-medium text-cyan-400">Summary:</span>
                  <div className="mt-2 text-sm leading-relaxed">{summary}</div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom: Q&A + Conversation (whole panel scrolls) */}
        {summary && (
          <div className="bg-slate-700 rounded-lg p-6 mt-6">
            <h3 className="text-lg font-medium text-white mb-4" style={{ textShadow: "2px 3px 4px #000" }}>❓ Ask Doubts Regarding Your PDF</h3>

            <form onSubmit={handleAsk} className="space-y-4">
              <input
                type="text"
                placeholder="Ask any question about your PDF..."
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                disabled={loading}
                className="block w-full px-4 py-2 rounded-lg bg-slate-900 text-slate-200 border border-slate-600"
              />

              <button
                type="submit"
                disabled={loading}
                className={`w-full px-4 py-2 rounded-md shadow text-white transition-colors ${loading
                    ? "bg-slate-600 cursor-not-allowed"
                    : "bg-cyan-700 hover:bg-cyan-600"
                  }`}
              >
                {loading ? "Asking..." : "Ask Question"}
              </button>
            </form>

            {/* Conversation History below the form */}
            <div className="mt-6">
              <h4 className="text-base font-medium text-cyan-300 mb-4">💬 Conversation</h4>
              <div className="max-h-96 overflow-y-auto space-y-4 pr-2">
                {conversation.length === 0 ? (
                  <div className="text-slate-400 text-center py-8">
                    <p>No conversation yet.</p>
                    <p className="text-sm mt-2">Ask questions about your PDF to start a conversation!</p>
                  </div>
                ) : (
                  conversation.map((item, index) => (
                    <div key={index} className="space-y-2">
                      <div className="bg-slate-800 rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-medium text-cyan-400">Question</span>
                          <span className="text-xs text-slate-400">{item.timestamp}</span>
                        </div>
                        <p className="text-slate-200 text-sm">{item.question}</p>
                      </div>

                      <div className="bg-slate-800 rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-medium text-green-400">Answer</span>
                        </div>
                        <p className="text-slate-200 text-sm leading-relaxed">{item.answer}</p>
                      </div>
                      <hr style={{color: "darkcyan",height: 3}}/>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar
          closeOnClick
          pauseOnHover
        />
      </div>
    </div>
  );
}
